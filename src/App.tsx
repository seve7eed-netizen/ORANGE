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
import { Sliders, Play, Settings, Landmark, ShieldCheck, Lock, Unlock, X, ArrowRight } from 'lucide-react';
import { BulletproofDB } from './utils/db';

export default function App() {
  const [projects, setProjects] = useState<Project[]>([]);
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
    if (passwordInput === '1111') {
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

  // Load from Dual-Drive (IndexedDB + Local Storage) on boot, fallback to elegant preset
  useEffect(() => {
    const bootstrapData = async () => {
      try {
        // Try IndexedDB first! It holds the high-volume image data
        const storeProjects = await BulletproofDB.loadAll();
        if (storeProjects && storeProjects.length > 0) {
          const filtered = storeProjects.filter((p: any) =>
            p &&
            typeof p === 'object' &&
            p.id &&
            (p.category === 'photography' || p.category === 'videography')
          );
          if (filtered.length > 0) {
            setProjects(filtered);
            // Sync back to local storage as warm metadata cache fallback
            try {
              localStorage.setItem('orange_archive_v2_portfolios', JSON.stringify(filtered));
            } catch (_) {}
            return;
          }
        }
      } catch (e) {
        console.warn('IndexedDB load failed, falling back to LocalStorage:', e);
      }

      // LocalStorage fallback
      try {
        const saved = localStorage.getItem('orange_archive_v2_portfolios');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const filtered = parsed.filter((p: any) => 
              p && 
              typeof p === 'object' &&
              p.id &&
              (p.category === 'photography' || p.category === 'videography')
            );
            setProjects(filtered);
            // Sync IndexedDB
            try {
              await BulletproofDB.saveAll(filtered);
            } catch (_) {}
            return;
          }
        }
      } catch (_) {}

      // Ultimate fallback: static initial defaults
      setProjects(initialProjects);
      try {
        localStorage.setItem('orange_archive_v2_portfolios', JSON.stringify(initialProjects));
        await BulletproofDB.saveAll(initialProjects);
      } catch (_) {}
    };

    bootstrapData();
  }, []);

  const updatePersistedData = async (updated: Project[]) => {
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

  const handleAddProject = (p: Project) => {
    const updated = [p, ...projects];
    updatePersistedData(updated);
  };

  const handleUpdateProject = (p: Project) => {
    const updated = projects.map((orig) => (orig.id === p.id ? p : orig));
    updatePersistedData(updated);
  };

  const handleDeleteProject = (id: string) => {
    const updated = projects.filter((p) => p.id !== id);
    updatePersistedData(updated);
  };

  const handleResetToDefault = () => {
    updatePersistedData(initialProjects);
  };

  const handleImportBackup = (imported: Project[]) => {
    updatePersistedData(imported);
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

                <h3 className="font-syne text-sm font-black text-white tracking-widest uppercase mb-1">
                  ARCHIVIST WORKSPACE
                </h3>
                <p className="font-outfit text-[10px] text-dark-muted tracking-wide uppercase mb-6">
                  자료 관리국 가도 조정반
                </p>

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

                <div className="mt-6 pt-4 border-t border-dark-border/40 text-[9px] font-mono text-dark-muted leading-relaxed">
                  비밀번호를 입력하고 승인받으신 후 포트폴리오 관리국에 접속할 수 있습니다. (기본: 1111)
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. Footer info bar */}
      <Footer />
      
    </div>
  );
}
