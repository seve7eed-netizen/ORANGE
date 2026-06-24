/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Philosophy from './components/Philosophy';
import ProjectGrid from './components/ProjectGrid';
import ProjectDetail from './components/ProjectDetail';
import AdminPanel from './components/AdminPanel';
import Footer from './components/Footer';
import { initialProjects } from './initialProjects';
import { Project, CategoryFilter } from './types';
import { AnimatePresence, motion } from 'motion/react';
import { Sliders, Play, Settings, Landmark, ShieldCheck, Lock, Unlock, X, ArrowRight, RefreshCw } from 'lucide-react';
import { BulletproofDB } from './utils/db';
import {
  loadProjectsFromFirestore,
  saveProjectToFirestore,
  deleteProjectFromFirestore,
  seedProjectsToFirestore,
  subscribeToProjectsFromFirestore,
  getDeletedProjectIdsFromFirestore,
  markProjectAsDeletedInFirestore,
  getSeededStatusFromFirestore,
  clearDeletedProjectIdsInFirestore,
  undeleteProjectsInFirestore
} from './utils/firebase';

async function getLocalProjects(): Promise<Project[]> {
  let localList: Project[] = [];
  try {
    const saved = localStorage.getItem('orange_archive_v2_portfolios');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        localList = parsed.filter((p: any) => p && typeof p === 'object' && p.id);
      }
    }
  } catch (_) {}

  try {
    const storeProjects = await BulletproofDB.loadAll();
    if (storeProjects && storeProjects.length > 0) {
      const filtered = storeProjects.filter((p: any) => p && typeof p === 'object' && p.id);
      const localMap = new Map<string, Project>();
      localList.forEach(p => localMap.set(p.id, p));
      filtered.forEach(p => localMap.set(p.id, p));
      localList = Array.from(localMap.values());
    }
  } catch (e) {
    console.warn('IndexedDB load failed during boot, using LocalStorage:', e);
  }
  return localList;
}

export default function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [syncStatus, setSyncStatus] = useState<{ isSyncing: boolean; total: number; current: number } | null>(null);
  const [currentTab, setCurrentTab] = useState<string>('home'); // 'home', 'philosophy', 'gallery', 'admin'
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isAdminLoggedIn, setIsAdminLoggedInState] = useState(() => {
    try {
      return localStorage.getItem('orange_archive_v2_admin_logged_in') === 'true';
    } catch {
      return false;
    }
  });

  const setIsAdminLoggedIn = (val: boolean) => {
    setIsAdminLoggedInState(val);
    try {
      localStorage.setItem('orange_archive_v2_admin_logged_in', val ? 'true' : 'false');
    } catch (e) {
      console.error(e);
    }
  };
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('all');
  const [scrollY, setScrollY] = useState(0);

  // Password gate modal states
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  const handleAdminClick = () => {
    if (isAdminLoggedIn) {
      setCurrentTab('admin');
      window.scrollTo({ top: 0, behavior: 'instant' });
    } else {
      setShowPasswordModal(true);
      setPasswordInput('');
      setPasswordError(false);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === '9764') {
      setIsAdminLoggedIn(true);
      setShowPasswordModal(false);
      setPasswordInput('');
      setCurrentTab('admin');
      window.scrollTo({ top: 0, behavior: 'instant' });
    } else {
      setPasswordError(true);
    }
  };

  // References for scrolling
  const archiveRef = useRef<HTMLDivElement | null>(null);
  const isScrollingRef = useRef(false);
  const syncingInProgressRef = useRef(false);

  // Scroll listener for landing splash scale effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll observer to update active header menu item as visitor scrolls
  useEffect(() => {
    if (currentTab === 'admin') return;

    const handleScrollState = () => {
      const homeEl = document.getElementById('section-home');
      const philEl = document.getElementById('section-philosophy');
      const galleryEl = document.getElementById('section-gallery');

      if (!homeEl || !philEl || !galleryEl) return;

      const scrollPosition = window.scrollY + window.innerHeight * 0.4;

      const philTop = philEl.offsetTop;
      const galleryTop = galleryEl.offsetTop;

      if (scrollPosition >= galleryTop) {
        if (!isScrollingRef.current) {
          setCurrentTab('gallery');
        }
      } else if (scrollPosition >= philTop) {
        if (!isScrollingRef.current) {
          setCurrentTab('philosophy');
        }
      } else {
        if (!isScrollingRef.current) {
          setCurrentTab('home');
        }
      }
    };

    window.addEventListener('scroll', handleScrollState);
    return () => window.removeEventListener('scroll', handleScrollState);
  }, [currentTab]);

  // 1-hour inactivity automatic logout tracker
  useEffect(() => {
    if (!isAdminLoggedIn) return;

    let timeoutId: any;

    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      // 1 hour = 3,600,000 milliseconds
      timeoutId = setTimeout(() => {
        setIsAdminLoggedIn(false);
        if (currentTab === 'admin') {
          setCurrentTab('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 3600000);
    };

    // User activity signaling events
    const activityEvents = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];

    activityEvents.forEach((ev) => {
      window.addEventListener(ev, resetTimer, { passive: true });
    });

    // Start timer on mount/active status
    resetTimer();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      activityEvents.forEach((ev) => {
        window.removeEventListener(ev, resetTimer);
      });
    };
  }, [isAdminLoggedIn, currentTab]);

  // Load from Central Firebase Firestore (shared) or fallback to local Dual-Drive
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    const bootstrapData = async () => {
      // 1. Retrieve all possible local projects from physical storage caches (PC/Local Browser)
      let localProjectsList = await getLocalProjects();

      // 2. Load deleted IDs & Seeded status from Firestore metadata
      let deletedIds: string[] = [];
      let isSeededInFirestore = false;
      try {
        deletedIds = await getDeletedProjectIdsFromFirestore();
        isSeededInFirestore = await getSeededStatusFromFirestore();
      } catch (err) {
        console.warn('Failed to fetch firestore metadata during bootstrap:', err);
      }

      // Restoring p1 and p2 photography projects as requested by the user
      if (deletedIds.includes('p1') || deletedIds.includes('p2')) {
        try {
          console.log('Restoring p1 and p2 photography projects as requested by the user...');
          await undeleteProjectsInFirestore(['p1', 'p2']);
          deletedIds = deletedIds.filter(id => id !== 'p1' && id !== 'p2');
        } catch (e) {
          console.warn('Failed to restore p1/p2 in firestore metadata:', e);
        }
      }

      const deletedSet = new Set(deletedIds);

      // Filter local list against deleted set
      if (deletedSet.size > 0) {
        localProjectsList = localProjectsList.filter(p => p && p.id && !deletedSet.has(p.id));
      }

      // Restore default photography projects to local cache if missing
      const localIds = new Set(localProjectsList.map(p => p.id));
      const defaultPhotographyProjects = initialProjects.filter(p => p.category === 'photography');
      let localListUpdated = false;
      for (const dp of defaultPhotographyProjects) {
        if (!localIds.has(dp.id) && !deletedSet.has(dp.id)) {
          localProjectsList.push(dp);
          localListUpdated = true;
        }
      }
      if (localListUpdated) {
        try {
          localStorage.setItem('orange_archive_v2_portfolios', JSON.stringify(localProjectsList));
          await BulletproofDB.saveAll(localProjectsList);
        } catch (_) {}
      }

      // Keep immediate styling in sync using local recovery caches
      if (localProjectsList.length > 0) {
        setProjects(localProjectsList);
      } else {
        setProjects(isSeededInFirestore ? [] : initialProjects);
      }

      // 3. High-availability one-time retrieval to bypass WebSocket/gRPC sandbox blocks
      console.log('Performing immediate HTTPS fetch of projects from Firestore...');
      try {
        let cloudProjects = await loadProjectsFromFirestore();
        if (cloudProjects) {
          if (deletedSet.size > 0) {
            cloudProjects = cloudProjects.filter(p => p && p.id && !deletedSet.has(p.id));
          }

          if (cloudProjects.length > 0) {
            console.log('Firestore HTTP load successfully completed. Count:', cloudProjects.length);
            
            const currentLocal = localProjectsList;
            const localMap = new Map<string, Project>(currentLocal.map(p => [p.id, p]));
            const cloudIds = new Set(cloudProjects.map(p => p.id));
            
            const mergedList: Project[] = [];
            cloudProjects.forEach(cp => {
              const lp = localMap.get(cp.id);
              if (lp) {
                const merged = { ...cp };
                if (lp.videoUrl && lp.videoUrl.startsWith('data:') && !cp.videoUrl) {
                  merged.videoUrl = lp.videoUrl;
                }
                if (lp.videoUrls && cp.videoUrls) {
                  merged.videoUrls = Array.from(new Set([...lp.videoUrls, ...cp.videoUrls]));
                } else if (lp.videoUrls && !cp.videoUrls) {
                  merged.videoUrls = lp.videoUrls;
                }
                mergedList.push(merged);
              } else {
                mergedList.push(cp);
              }
            });

            // Identify and prepare missing items
            const missingItems = currentLocal.filter(lp => lp && lp.id && !cloudIds.has(lp.id));
            mergedList.push(...missingItems);

            setProjects(mergedList);
            try {
              localStorage.setItem('orange_archive_v2_portfolios', JSON.stringify(mergedList));
              await BulletproofDB.saveAll(mergedList);
            } catch (_) {}

            // Upload sequentially in the background
            if (missingItems.length > 0 && !syncingInProgressRef.current) {
              (async () => {
                syncingInProgressRef.current = true;
                setSyncStatus({ isSyncing: true, total: missingItems.length, current: 0 });
                let uploaded = 0;
                for (const lp of missingItems) {
                  try {
                    console.log(`Auto uploading missing project "${lp.title}" to Firestore...`);
                    await saveProjectToFirestore(lp);
                    uploaded++;
                    setSyncStatus({ isSyncing: true, total: missingItems.length, current: uploaded });
                  } catch (syncErr) {
                    console.error(`Auto upload of project "${lp.title}" failed:`, syncErr);
                  }
                }
                setSyncStatus(null);
                syncingInProgressRef.current = false;
              })();
            }
          } else {
            if (isSeededInFirestore) {
              console.log('Cloud database is empty because user deleted all projects. Keep empty.');
              setProjects([]);
              try {
                localStorage.setItem('orange_archive_v2_portfolios', JSON.stringify([]));
                await BulletproofDB.saveAll([]);
              } catch (_) {}
            } else {
              console.log('Firestore database is empty. Performing initial seed from client...');
              const listToSeed = localProjectsList.length > 0 ? localProjectsList : initialProjects;
              await seedProjectsToFirestore(listToSeed);
              setProjects(listToSeed);
            }
          }
        }
      } catch (e) {
        console.warn('One-time Firestore HTTPS fetch did not complete (database may be clean or restricted):', e);
      }

      // 4. Subscribe to Firebase Firestore for real-time live synchronization (1:1 with developer DB)
      console.log('Subscribing to active projects stream from Firestore...');
      try {
        unsubscribe = subscribeToProjectsFromFirestore(
          (firestoreProjects) => {
            console.log('Real-time updates from Firestore. Count:', firestoreProjects.length);
            
            (async () => {
              try {
                // Fetch latest metadata
                let freshDeletedIds: string[] = [];
                let isSeeded = false;
                try {
                  freshDeletedIds = await getDeletedProjectIdsFromFirestore();
                  isSeeded = await getSeededStatusFromFirestore();
                } catch (e) {
                  console.warn('Failed to load metadata in subscription callback:', e);
                }
                const freshDeletedSet = new Set(freshDeletedIds);

                // Load current local store to compare and preserve assets
                let localStore = await getLocalProjects();
                if (freshDeletedSet.size > 0) {
                  localStore = localStore.filter(lp => lp && lp.id && !freshDeletedSet.has(lp.id));
                }

                const filteredFirestoreProjects = firestoreProjects.filter(p => p && p.id && !freshDeletedSet.has(p.id));
                const localMap = new Map<string, Project>(localStore.map(lp => [lp.id, lp]));

                if (filteredFirestoreProjects.length > 0) {
                  const unifiedList: Project[] = [];
                  const cloudIds = new Set(filteredFirestoreProjects.map(p => p.id));

                  // Process cloud projects, merging base64 video values from local copies
                  filteredFirestoreProjects.forEach((cp) => {
                    const lp = localMap.get(cp.id);
                    if (lp) {
                      const merged = { ...cp };
                      // Maintain local base64 videos
                      if (lp.videoUrl && lp.videoUrl.startsWith('data:') && !cp.videoUrl) {
                        merged.videoUrl = lp.videoUrl;
                      }
                      if (lp.videoUrls && cp.videoUrls) {
                        merged.videoUrls = Array.from(new Set([...lp.videoUrls, ...cp.videoUrls]));
                      } else if (lp.videoUrls && !cp.videoUrls) {
                        merged.videoUrls = lp.videoUrls;
                      }
                      unifiedList.push(merged);
                    } else {
                      unifiedList.push(cp);
                    }
                  });

                  // Only heal missing projects if we are not currently uploading
                  const missingFromCloud = localStore.filter(lp => lp && lp.id && !cloudIds.has(lp.id));
                  unifiedList.push(...missingFromCloud);

                  setProjects(unifiedList);
                  try {
                    localStorage.setItem('orange_archive_v2_portfolios', JSON.stringify(unifiedList));
                    await BulletproofDB.saveAll(unifiedList);
                  } catch (_) {}

                  if (missingFromCloud.length > 0 && !syncingInProgressRef.current) {
                    (async () => {
                      syncingInProgressRef.current = true;
                      setSyncStatus({ isSyncing: true, total: missingFromCloud.length, current: 0 });
                      let uploaded = 0;
                      for (const lp of missingFromCloud) {
                        try {
                          console.log(`Healing missing local custom project "${lp.title}" into memory & cloud...`);
                          await saveProjectToFirestore(lp);
                          uploaded++;
                          setSyncStatus({ isSyncing: true, total: missingFromCloud.length, current: uploaded });
                        } catch (syncErr) {
                          console.error(`Auto back-sync of local project "${lp.title}" failed:`, syncErr);
                        }
                      }
                      setSyncStatus(null);
                      syncingInProgressRef.current = false;
                    })();
                  }
                } else {
                  if (isSeeded) {
                    console.log('Cloud database is empty because user deleted all projects (real-time). Keep empty.');
                    setProjects([]);
                    try {
                      localStorage.setItem('orange_archive_v2_portfolios', JSON.stringify([]));
                      await BulletproofDB.saveAll([]);
                    } catch (_) {}
                  } else {
                    console.log('Cloud database is empty. Seeding defaults or current local store...');
                    const listToSeed = localStore.length > 0 ? localStore : initialProjects;
                    setProjects(listToSeed);
                    try {
                      await seedProjectsToFirestore(listToSeed);
                    } catch (seedingError) {
                      console.error('Initial auto-seeding cloud registry failed:', seedingError);
                    }
                  }
                }
              } catch (innerErr) {
                console.error('Error handling Firestore snapshot update in callback:', innerErr);
              }
            })();
          },
          (err) => {
            console.warn('Real-time subscription to cloud projects was blocked or failed:', err);
          }
        );
      } catch (e) {
        console.error('Failed to initialize active project subscription:', e);
      }
    };

    bootstrapData();

    return () => {
      if (unsubscribe) {
        console.log('Unsubscribing active projects listener');
        unsubscribe();
      }
    };
  }, []);

  const updateLocalAndOfflineCache = async (updated: Project[]) => {
    setProjects(updated);
    
    // 1. Save to high-capacity IndexedDB (unlimited megabytes)
    try {
      await BulletproofDB.saveAll(updated);
    } catch (e) {
      console.error('Failed to save to IndexedDB:', e);
    }

    // 2. Try to write to LocalStorage as cache (ignores quota warning)
    try {
      localStorage.setItem('orange_archive_v2_portfolios', JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage limit saturated, saved securely in persistent IndexedDB:', e);
    }
  };

  const handleAddProject = async (p: Project) => {
    const updated = [p, ...projects];
    updateLocalAndOfflineCache(updated);

    try {
      await saveProjectToFirestore(p);
    } catch (e) {
      console.error('Firestore save failed:', e);
      throw e;
    }
  };

  const handleUpdateProject = async (p: Project) => {
    const updated = projects.map((orig) => (orig.id === p.id ? p : orig));
    updateLocalAndOfflineCache(updated);

    try {
      await saveProjectToFirestore(p);
    } catch (e) {
      console.error('Firestore update failed:', e);
      throw e;
    }
  };

  const handleDeleteProject = async (id: string) => {
    const updated = projects.filter((p) => p.id !== id);
    await updateLocalAndOfflineCache(updated);

    try {
      await markProjectAsDeletedInFirestore(id);
      await deleteProjectFromFirestore(id);
    } catch (e) {
      console.error('Firestore delete failed:', e);
      throw e;
    }
  };

  const handleResetToDefault = async () => {
    try {
      await clearDeletedProjectIdsInFirestore();
    } catch (e) {
      console.warn('Failed to clear deleted project IDs during reset:', e);
    }

    await updateLocalAndOfflineCache(initialProjects);
    try {
      await seedProjectsToFirestore(initialProjects);
    } catch (e) {
      console.error('Firestore reset failed:', e);
      throw e;
    }
  };

  const handleImportBackup = async (imported: Project[]) => {
    updateLocalAndOfflineCache(imported);
    try {
      await seedProjectsToFirestore(imported);
    } catch (e) {
      console.error('Firestore import backup failed:', e);
      throw e;
    }
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(`section-${sectionId}`);
    if (el) {
      isScrollingRef.current = true;
      setCurrentTab(sectionId);
      
      const headerOffset = 64; // Height of the sticky header
      const elementPosition = el.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      // Keep tracking active scroll state to avoid flip during transit animation
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 850);
    }
  };

  const handleTabChange = (tab: string) => {
    if (tab === 'admin') {
      handleAdminClick();
      return;
    }

    if (currentTab === 'admin') {
      setCurrentTab(tab);
      setTimeout(() => {
        scrollToSection(tab);
      }, 80);
    } else {
      scrollToSection(tab);
    }
  };

  const handleScrollToArchive = () => {
    setActiveFilter('all');
    scrollToSection('gallery');
  };

  const handlePillarClick = (category: 'photography' | 'videography') => {
    setActiveFilter(category);
    scrollToSection('gallery');
  };

  const handleEnterJournal = () => {
    scrollToSection('philosophy');
  };

  return (
    <div className="relative bg-dark-bg text-white min-h-screen flex flex-col font-sans selection:bg-accent selection:text-black">
      {/* 1. Header Navigation Wrapper */}
      <Header
        currentTab={currentTab}
        setCurrentTab={handleTabChange}
        isAdmin={isAdminLoggedIn}
        onAdminClick={handleAdminClick}
        onLogout={() => {
          setIsAdminLoggedIn(false);
          setCurrentTab('home');
          window.scrollTo({ top: 0, behavior: 'instant' });
        }}
        scrollY={scrollY}
      />

      {/* 2. Main Page Body with Motion Wrapper */}
      <main className="flex-grow pt-16 font-sans">
        <AnimatePresence mode="wait">
          {currentTab === 'admin' ? (
            <motion.div
              key="admin-screen"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
            >
              <AdminPanel
                projects={projects}
                onAddProject={handleAddProject}
                onUpdateProject={handleUpdateProject}
                onDeleteProject={handleDeleteProject}
                onResetToDefault={handleResetToDefault}
                onImportBackup={handleImportBackup}
                isAdminLoggedIn={isAdminLoggedIn}
                setIsAdminLoggedIn={setIsAdminLoggedIn}
              />
            </motion.div>
          ) : (
            <motion.div
              key="main-ambient-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="relative w-full flex flex-col"
            >
              {/* Seamless unified ambient background for continuous scroll content */}
              <div className="absolute inset-0 z-0 pointer-events-none select-none">
                {/* Upper ambient glow */}
                <div className="absolute top-[5%] -right-[15%] w-[700px] h-[700px] rounded-full bg-accent/[0.045] blur-[150px] mix-blend-screen" />
                
                {/* Middle ambient glow */}
                <div className="absolute top-[35%] -left-[15%] w-[600px] h-[600px] rounded-full bg-accent/[0.030] blur-[130px] mix-blend-screen" />
                
                {/* Lower ambient glow in ProjectGrid area */}
                <div className="absolute bottom-[10%] -right-[15%] w-[750px] h-[750px] rounded-full bg-accent/[0.04] blur-[160px] mix-blend-screen" />
                
                {/* Vintage vignette/moody ambient overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,transparent_10%,_var(--color-dark-bg)_80%)] opacity-80" />
                
                {/* Subtle minimalist grid structure */}
                <div className="absolute inset-0 opacity-[0.008] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:50px_50px]" />
              </div>

              {/* Section 1: HOME */}
              <div id="section-home" className="relative z-10 w-full">
                <Hero onEnter={handleEnterJournal} />
              </div>

              {/* Section 2: PHILOSOPHY */}
              <div id="section-philosophy" className="relative z-10 w-full border-t border-dark-border/40">
                <Philosophy onPillarClick={handlePillarClick} />
              </div>

              {/* Section 3: GALLERY/EXHIBITION */}
              <div id="section-gallery" className="relative z-10 w-full border-t border-dark-border/40">
                <div id="archive-section" className="relative bg-transparent">
                  <ProjectGrid
                    projects={projects}
                    onProjectClick={(p) => setSelectedProject(p)}
                    activeFilter={activeFilter}
                    setActiveFilter={setActiveFilter}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 3. Sliding project detail overlay */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectDetail
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>

      {/* 4. Sleek floating Password Modal gate */}
      <AnimatePresence>
        {showPasswordModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
            onClick={() => setShowPasswordModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative max-w-sm w-full p-8 bg-dark-bg border border-dark-border/85 rounded-sm shadow-2xl overflow-hidden select-none"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Corner decorative bracket */}
              <div className="absolute top-0 left-0 w-full h-[3px] bg-accent" />
              
              {/* Close button */}
              <button
                onClick={() => setShowPasswordModal(false)}
                className="absolute top-4 right-4 text-dark-muted hover:text-white cursor-pointer transition-colors"
                title="닫기"
              >
                <X size={16} />
              </button>

              <div className="text-center">
                <div className="mx-auto rounded-full p-3 bg-dark-card border border-dark-border w-fit mb-4">
                  <Lock size={20} className="text-accent" />
                </div>

                <h3 className="font-syne text-sm font-black text-white tracking-widest uppercase mb-6">
                  ARCHIVIST WORKSPACE
                </h3>

                <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4 text-left">
                  <div>
                    <label className="font-mono text-[9px] text-dark-muted uppercase tracking-widest block mb-1.5 text-center">
                      ACCESS PASSCODE
                    </label>
                    <input
                      type="password"
                      placeholder="••••"
                      maxLength={8}
                      autoFocus
                      value={passwordInput}
                      onChange={(e) => {
                        setPasswordInput(e.target.value);
                        if (passwordError) setPasswordError(false);
                      }}
                      className="w-full bg-dark-bg border border-dark-border py-2 px-4 rounded-sm text-center font-mono text-lg text-white placeholder-dark-border tracking-[0.5em] focus:border-accent/60 focus:outline-none"
                      id="modal-passcode-input"
                    />
                  </div>

                  {passwordError && (
                    <motion.div 
                      initial={{ opacity: 0, y: -2 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-[10px] font-mono text-red-500 bg-red-950/20 border border-red-900/30 p-2 text-center rounded-sm"
                    >
                      [ ACCESS DENIED: INVALID PASSCODE ]
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    className="mt-2 w-full py-2 bg-accent hover:bg-[#fa8743] hover:text-black text-black font-mono font-black text-[10px] tracking-wider transition-all rounded-xs cursor-pointer flex items-center justify-center gap-1.5"
                    id="modal-login-submit-btn"
                  >
                    <span>ENTER WORKSPACE</span>
                    <ArrowRight size={11} />
                  </button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4.5. Real-time Database Synchronization Progress Overlay */}
      <AnimatePresence>
        {syncStatus && syncStatus.isSyncing && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-[90] flex items-center gap-3 px-5 py-4 bg-[#111111]/90 border border-accent/40 rounded-sm shadow-2xl text-white font-mono text-xs select-none backdrop-blur-md"
          >
            <div className="relative flex items-center justify-center">
              <RefreshCw className="animate-spin text-accent" size={16} />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-bold text-accent tracking-wider uppercase">DATABASE SYNCING</span>
              <span className="text-[10px] text-dark-muted">
                Uploading local custom projects to cloud: {syncStatus.current} / {syncStatus.total}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. Footer info bar */}
      <Footer />
      
    </div>
  );
}
