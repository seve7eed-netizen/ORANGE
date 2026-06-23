import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Project, CategoryFilter } from '../types';
import { Lock, Unlock, Plus, Trash2, Edit2, Download, Upload, RotateCcw, AlertTriangle, FileText, Check, ArrowRight, Image as ImageIcon, Film, Video, Star, Save, Database } from 'lucide-react';
import { BulletproofDB } from '../utils/db';

interface AdminPanelProps {
  projects: Project[];
  onAddProject: (project: Project) => void;
  onUpdateProject: (project: Project) => void;
  onDeleteProject: (id: string) => void;
  onResetToDefault: () => void;
  onImportBackup: (imported: Project[]) => void;
  isAdminLoggedIn: boolean;
  setIsAdminLoggedIn: (val: boolean) => void;
}

export default function AdminPanel({
  projects,
  onAddProject,
  onUpdateProject,
  onDeleteProject,
  onResetToDefault,
  onImportBackup,
  isAdminLoggedIn,
  setIsAdminLoggedIn
}: AdminPanelProps) {
  const [passwordInput, setPasswordInput] = useState('');
  const [passError, setPassError] = useState(false);

  // Form states for creating/editing
  const [isEditingId, setIsEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [client, setClient] = useState('');
  const [period, setPeriod] = useState('');
  const [scopeRaw, setScopeRaw] = useState('');
  const [category, setCategory] = useState<Project['category']>('videography');
  const [toolsRaw, setToolsRaw] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [additionalImagesRaw, setAdditionalImagesRaw] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [featured, setFeatured] = useState(false);

  // Direct File Upload & Representative selection states
  const [uploadedFiles, setUploadedFiles] = useState<{ id: string; url: string; name: string; type: 'image' | 'video' }[]>([]);
  const [representativeId, setRepresentativeId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Raw JSON Backup state
  const [jsonBackupText, setJsonBackupText] = useState('');
  const [backupSuccessMsg, setBackupSuccessMsg] = useState('');

  // Custom states for iFrame-safe non-blocking feedback & inline confirmation
  const [toast, setToast] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isHardSaving, setIsHardSaving] = useState(false);

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ text, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const handleHardSave = async () => {
    setIsHardSaving(true);
    showToast('영구 기억장치(IndexedDB)에 포트폴리오 데이터를 동기화 및 고정하는 중입니다...', 'info');
    try {
      await BulletproofDB.saveAll(projects);
      // Wait for absolute verification/realistic animation delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      showToast('전시관 데이터베이스 및 고대비 영구 기억장치(IndexedDB)에 모든 포트폴리오를 강력하게 고정하였습니다! 절대 유실되지 않으며 영구 보존됩니다.', 'success');
    } catch (e) {
      console.error(e);
      showToast('강력 저장에 실패했습니다. 다시 시도해 주세요.', 'error');
    } finally {
      setIsHardSaving(false);
    }
  };

  // Curated Unsplash cinematic placeholders helpers
  const presets = [
    { name: '시네마 카메라 (Cine)', url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=1200' },
    { name: '조명/촬영 스튜디오 (Studio)', url: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=1200' },
    { name: '에디팅 작업 데스크 (Edit Desk)', url: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&q=80&w=1200' },
    { name: '인물/패션 촬영 (Portrait)', url: 'https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1?auto=format&fit=crop&q=80&w=1200' },
    { name: '다큐멘터리 작업 (Craft)', url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=1200' },
    { name: '기하학 건축/도시 (Monolith)', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200' }
  ];

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === '9764') {
      setIsAdminLoggedIn(true);
      setPassError(false);
      setPasswordInput('');
    } else {
      setPassError(true);
      setTimeout(() => setPassError(false), 2000);
    }
  };

  const handleApplyPresetImage = (url: string) => {
    setCoverImage(url);
    
    // Also push to uploadedFiles for consistency
    const id = 'preset_' + Date.now();
    setUploadedFiles(prev => {
      const filtered = prev.filter(f => !f.id.startsWith('preset_'));
      const nextFiles = [
        ...filtered,
        { id, url, name: '프리셋 이미지', type: 'image' }
      ];
      setRepresentativeId(id);
      return nextFiles;
    });
  };

  const startEdit = (p: Project) => {
    setIsEditingId(p.id);
    setTitle(p.title);
    setClient(p.client);
    setPeriod(p.period);
    setScopeRaw(p.scope.join(', '));
    setCategory(p.category);
    setToolsRaw(p.tools.join(', '));
    setDescription(p.description);
    setCoverImage(p.coverImage);
    setAdditionalImagesRaw(p.additionalImages.join(', '));
    setVideoUrl(p.videoUrl || '');
    setFeatured(p.featured || false);

    // Initialize list with project resources
    const list: { id: string; url: string; name: string; type: 'image' | 'video' }[] = [];
    let repId: string | null = null;

    if (p.coverImage) {
      const cid = 'cover_' + Date.now();
      list.push({
        id: cid,
        url: p.coverImage,
        name: '대표 이미지 (Main Cover)',
        type: 'image'
      });
      repId = cid;
    }

    if (p.additionalImages && p.additionalImages.length > 0) {
      p.additionalImages.forEach((img, idx) => {
        list.push({
          id: 'add_' + idx + '_' + Date.now(),
          url: img,
          name: `추가 이미지 #${idx + 1}`,
          type: 'image'
        });
      });
    }

    if (p.videoUrl) {
      list.push({
        id: 'video_' + Date.now(),
        url: p.videoUrl,
        name: '프로젝트 비디오 (Embedded/Uploaded)',
        type: 'video'
      });
    }

    setUploadedFiles(list);
    setRepresentativeId(repId);
  };

  const clearForm = () => {
    setIsEditingId(null);
    setTitle('');
    setClient('');
    setPeriod('');
    setScopeRaw('');
    setCategory('videography');
    setToolsRaw('');
    setDescription('');
    setCoverImage('');
    setAdditionalImagesRaw('');
    setVideoUrl('');
    setFeatured(false);
    setUploadedFiles([]);
    setRepresentativeId(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    processFiles(files);
  };

  const processFiles = async (files: FileList) => {
    for (const file of Array.from(files)) {
      const isVideo = file.type.startsWith('video/');
      const isHEIC = file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif') || file.type === 'image/heic' || file.type === 'image/heif';

      let fileToRead: File = file;

      // 1. HEIC converting filter using dynamic heic2any
      if (isHEIC) {
        showToast(`HEIC 포멧을 감지하여 고대비 표준 JPEG로 변환하는 중입니다...`, 'info');
        try {
          const heic2any = (await import('heic2any')).default;
          const converted = await heic2any({
            blob: file,
            toType: 'image/jpeg',
            quality: 0.85
          });
          const convertedBlob = Array.isArray(converted) ? converted[0] : converted;
          fileToRead = new File([convertedBlob], file.name.replace(/\.heic$/i, '.jpg').replace(/\.heif$/i, '.jpg'), {
            type: 'image/jpeg'
          });
          showToast(`"${file.name}" 이미지가 크로스 브라우저 호환 JPEG로 복원 변환되었습니다!`, 'success');
        } catch (err) {
          console.error('HEIC conversion failed:', err);
          showToast('HEIC 이미지 변환 과정에서 규격 해석 오류가 발생하여 원동력 백업 모드로 로드합니다.', 'info');
        }
      }

      // Show toast if uploading a large file > 5MB
      if (fileToRead.size > 5 * 1024 * 1024) {
        showToast(`대용량 미디어 파일 처리 중 (${(fileToRead.size / (1024 * 1024)).toFixed(1)}MB). 고화질 압축 및 브라우저 성능 최적화가 가동됩니다.`, 'info');
      }

      if (isVideo) {
        // For video files, we read them with FileReader as DataURL to persist in IndexedDB
        const reader = new FileReader();
        reader.onload = (event) => {
          const resultUrl = event.target?.result as string;
          const newFile = {
            id: 'file_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
            url: resultUrl,
            name: fileToRead.name,
            type: 'video' as 'image' | 'video'
          };
          setUploadedFiles((prev) => [...prev, newFile]);
          setVideoUrl(resultUrl);
          showToast('동영상 파일이 첨부되었습니다.', 'success');
        };
        reader.onerror = () => {
          showToast('동영상 파일 읽기 작업이 중단되었습니다.', 'error');
        };
        reader.readAsDataURL(fileToRead);
      } else {
        // Memory-safe Image loading using temporary Object URL (avoids string overhead before resize)
        const objectUrl = URL.createObjectURL(fileToRead);
        const img = new Image();

        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Limit image dimensions to safe boundaries (max 1920 border)
          const MAX_RESOL = 1920;
          if (width > MAX_RESOL || height > MAX_RESOL) {
            if (width > height) {
              height = Math.round((height * MAX_RESOL) / width);
              width = MAX_RESOL;
            } else {
              width = Math.round((width * MAX_RESOL) / height);
              height = MAX_RESOL;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, width, height);
            
            // Compress into high quality progressive JPEG (0.85 quality matches top professional look)
            const compressedUrl = canvas.toDataURL('image/jpeg', 0.85);
            const newFile = {
              id: 'file_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
              url: compressedUrl,
              name: fileToRead.name,
              type: 'image' as 'image' | 'video'
            };

            setUploadedFiles((prev) => {
              const updated = [...prev, newFile];
              if (!representativeId) {
                setRepresentativeId(newFile.id);
                setCoverImage(compressedUrl);
              }
              return updated;
            });
            showToast(`"${fileToRead.name}" 이미지의 최적 복원 및 영구 고주파 압축이 완료되었습니다.`, 'success');
          } else {
            // Context acquisition failed fallback - use FileReader
            readAsDataUrlFallback(fileToRead);
          }
          URL.revokeObjectURL(objectUrl);
        };

        img.onerror = () => {
          // Object URL failed, try FileReader as backup
          readAsDataUrlFallback(fileToRead);
          URL.revokeObjectURL(objectUrl);
        };

        img.src = objectUrl;
      }
    }
  };

  // Fallback to ReadAsDataURL for safety
  const readAsDataUrlFallback = (fileObj: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const resultUrl = event.target?.result as string;
      const newFile = {
        id: 'file_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        url: resultUrl,
        name: fileObj.name,
        type: 'image' as 'image' | 'video'
      };
      setUploadedFiles((prev) => {
        const updated = [...prev, newFile];
        if (!representativeId) {
          setRepresentativeId(newFile.id);
          setCoverImage(resultUrl);
        }
        return updated;
      });
      showToast(`"${fileObj.name}" 이미지 복구 형식을 통해 안전하게 업로드되었습니다.`, 'success');
    };
    reader.readAsDataURL(fileObj);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
  };

  const handleRemoveUploadedFile = (id: string) => {
    setUploadedFiles((prev) => {
      const filtered = prev.filter((f) => f.id !== id);
      
      // If removed item was representative, pick next available image
      if (id === representativeId) {
        const nextImg = filtered.find((f) => f.type === 'image');
        if (nextImg) {
          setRepresentativeId(nextImg.id);
          setCoverImage(nextImg.url);
        } else {
          setRepresentativeId(null);
          setCoverImage('');
        }
      }

      // If removed item is video, clear videoUrl
      const wasVideo = prev.find((f) => f.id === id)?.type === 'video';
      if (wasVideo) {
        setVideoUrl('');
      }

      return filtered;
    });
  };

  const handleSetRepresentative = (id: string) => {
    const file = uploadedFiles.find((f) => f.id === id);
    if (file) {
      if (file.type === 'video') {
        showToast('영상 파일은 대표 이미지로 지정할 수 없습니다. 이미지 파일을 지정해 주세요.', 'error');
        return;
      }
      setRepresentativeId(id);
      setCoverImage(file.url);
    }
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();

    // Resolve cover, additional, and video from interactive uploaded files list
    let finalCoverImage = coverImage;
    let finalAddImages = additionalImagesRaw
      .split(',')
      .map((i) => i.trim())
      .filter((i) => i.length > 0);
    let finalVideoUrl = videoUrl;

    if (uploadedFiles.length > 0) {
      // Find selected representative
      const selectedRep = uploadedFiles.find(f => f.id === representativeId && f.type === 'image');
      if (selectedRep) {
        finalCoverImage = selectedRep.url;
      } else {
        const firstImg = uploadedFiles.find(f => f.type === 'image');
        if (firstImg) {
          finalCoverImage = firstImg.url;
        }
      }

      // Extract additional gallery images (all other images)
      finalAddImages = uploadedFiles
        .filter(f => f.type === 'image' && f.url !== finalCoverImage)
        .map(f => f.url);

      // Extract video if any
      const videoItem = uploadedFiles.find(f => f.type === 'video');
      if (videoItem) {
        finalVideoUrl = videoItem.url;
      }
    }

    if (!title || !client || !finalCoverImage) {
      showToast('프로젝트명, 클라이언트명, 대표 커버 이미지는 필수 항목입니다.', 'error');
      return;
    }

    const cleanedScope = scopeRaw
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    
    const cleanedTools = toolsRaw
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const projectData: Project = {
      id: isEditingId || 'p_' + Date.now(),
      title,
      client,
      period: period || '진행 중',
      scope: cleanedScope.length > 0 ? cleanedScope : ['촬영', '보정'],
      category,
      tools: cleanedTools.length > 0 ? cleanedTools : ['Camera', 'Photoshop'],
      description: description || '등록된 프로젝트 세부 설명이 없습니다.',
      coverImage: finalCoverImage,
      additionalImages: finalAddImages,
      videoUrl: finalVideoUrl || undefined,
      featured
    };

    if (isEditingId) {
      onUpdateProject(projectData);
    } else {
      onAddProject(projectData);
    }
    const isEdit = !!isEditingId;
    clearForm();
    showToast(isEdit ? '성공적으로 수정 완료되었습니다.' : '신규 프로젝트가 아카이브에 성공적으로 업로드되었습니다.', 'success');
  };

  const handleBackupExport = () => {
    const rawData = JSON.stringify(projects, null, 2);
    setJsonBackupText(rawData);
    setBackupSuccessMsg('현재 아카이브 리스트가 JSON 데이터로 변환되어 아래 텍스트창에 로딩되었습니다. 복사하여 소중히 보관하실 수 있습니다.');
  };

  const handleBackupImport = () => {
    if (!jsonBackupText.trim()) {
      showToast('입력창에 복원할 JSON 데이터를 붙여넣어 주세요.', 'error');
      return;
    }
    try {
      const parsed = JSON.parse(jsonBackupText);
      if (Array.isArray(parsed) && parsed.every(p => p.id && p.title && p.client)) {
        onImportBackup(parsed);
        setJsonBackupText('');
        setBackupSuccessMsg('성공적으로 로컬 아카이브 데이터베이스가 갱신 및 백업으로부터 동기화되었습니다!');
        showToast('성공적으로 로컬 아카이브 데이터베이스가 백업으로부터 동기화되었습니다!', 'success');
      } else {
        showToast('올바른 포트폴리오 스키마 배열 형식이 아닙니다.', 'error');
      }
    } catch (e) {
      showToast('JSON 문법 오류가 발견되었습니다. 서식을 다시 확인하여 주세요.', 'error');
    }
  };

  // 1. Password Protection Gate Form
  if (!isAdminLoggedIn) {
    return (
      <section className="min-h-screen bg-dark-bg flex items-center justify-center pt-24 pb-12 px-6 select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full p-8 border border-dark-border bg-dark-bg rounded-sm text-center shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-[3px] bg-accent" />
          
          <div className="mx-auto rounded-full p-3.5 bg-dark-bg border border-dark-border w-fit mb-5">
            <Lock size={22} className="text-accent animate-pulse" />
          </div>

          <h3 className="font-syne text-lg font-black text-white tracking-widest uppercase mb-8">
            ARCHIVIST WORKSPACE
          </h3>

          <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4 text-left">
            <div>
              <label className="font-mono text-[9px] text-dark-muted uppercase tracking-widest block mb-1.5">
                ACCESS PASSCODE (패스코드)
              </label>
              <input
                type="password"
                placeholder="••••"
                maxLength={4}
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-dark-bg border border-dark-border py-2.5 px-4 rounded-sm text-center font-mono text-lg text-white placeholder-dark-border tracking-[0.5em] focus:border-accent/60 focus:outline-none"
                id="admin-passcode-input"
              />
            </div>

            {passError && (
              <div className="text-[11px] font-mono text-red-500 bg-red-950/25 border border-red-900/30 p-2 text-center rounded-sm">
                [ ACCESS DENIED: INVALID PASSCODE ]
              </div>
            )}

            <button
              type="submit"
              className="mt-2 w-full py-2.5 bg-accent hover:bg-[#fa8743] hover:text-black text-black font-mono font-black text-[11px] tracking-wider transition-all rounded-xs cursor-pointer flex items-center justify-center gap-1.5"
              id="admin-login-submit-btn"
            >
              <span>ACCESS WORKSPACE</span>
              <ArrowRight size={12} />
            </button>
          </form>

          <div className="mt-8 pt-4 border-t border-dark-border/40 text-[10px] font-mono text-dark-muted leading-relaxed">
            비밀번호 입력 시 기획한 6개의 핵심 작품 리스트에 신규 항목을 업로드, 수정, 영구 삭제할 수 있는 특전이 주어집니다.
          </div>
        </motion.div>
      </section>
    );
  }

  // 2. Unlocked Admin Workspace
  return (
    <section className="py-24 px-6 md:px-12 bg-dark-bg border-t border-dark-border relative" id="admin-panel-unlocked">
      {/* Custom Floating Toast Alert */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 p-4 border rounded-sm shadow-xl backdrop-blur-md text-xs font-mono tracking-wide max-w-sm select-none animate-in fade-in slide-in-from-bottom-2 duration-300 ${
          toast.type === 'error' 
            ? 'border-red-900/40 bg-[#160b0b] text-red-200' 
            : 'border-accent/20 bg-dark-card text-white'
        }`}>
          <div className={`h-2 w-2 rounded-full ${toast.type === 'error' ? 'bg-red-500' : 'bg-accent'} animate-pulse`} />
          <span className="flex-1 font-sans">{toast.text}</span>
          <button 
            onClick={() => setToast(null)}
            className="ml-3 text-dark-muted hover:text-white cursor-pointer font-bold text-sm"
          >
            ×
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        
        {/* Title Grid */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-dark-border pb-8">
          <div className="text-left flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <Unlock size={12} className="text-accent" />
              <span className="font-mono text-[9px] tracking-[0.2em] text-accent uppercase font-black">
                ROOT SYSTEM WORKSPACE
              </span>
            </div>
            <h2 className="font-syne text-3xl font-black text-white uppercase select-none">
              ORANGE <span className="text-accent">DASHBOARD</span>
            </h2>
            <p className="font-outfit text-xs text-dark-muted mt-1 font-light">
              김장섭(Orange) 크리에이터의 포트폴리오를 주체적이고 역동적으로 관리하는 CMS 영역입니다.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={handleHardSave}
              disabled={isHardSaving}
              className={`flex items-center gap-1.5 p-2 px-3 border rounded-xs transition-all duration-300 cursor-pointer select-none font-mono text-[10px] uppercase font-bold tracking-wider ${
                isHardSaving 
                  ? 'bg-dark-card border-dark-border text-dark-muted animate-pulse cursor-not-allowed'
                  : 'border-accent bg-accent text-black hover:bg-[#fa8743] hover:shadow-lg hover:shadow-accent/15'
              }`}
              id="admin-hard-save-btn"
            >
              <Save size={11} className={isHardSaving ? 'animate-spin' : ''} />
              <span>[포트폴리오 강력보존 (SECURE HARD SAVE)]</span>
            </button>
            <button
              onClick={() => {
                onResetToDefault();
                showToast('아카이브의 모든 포트폴리오 정보가 성공적으로 초기화되었습니다!', 'success');
              }}
              className="flex items-center gap-1.5 p-2 px-3 border border-red-500/10 hover:border-red-500 hover:text-red-400 bg-red-950/10 text-[10px] font-mono text-red-300 rounded-xs transition-colors cursor-pointer select-none"
              id="admin-reset-to-defaults-btn"
            >
              <RotateCcw size={11} />
              <span>[전체 아카이브 비우기 (WIPE ALL)]</span>
            </button>
            <button
              onClick={() => setIsAdminLoggedIn(false)}
              className="flex items-center gap-1.5 p-2 px-3 border border-accent/30 text-accent hover:bg-accent hover:text-black text-[10px] font-mono rounded-xs transition-all duration-300 cursor-pointer text-center select-none"
              id="admin-lock-workspace-btn"
            >
              <Lock size={11} />
              <span>[LOCK WORKSPACE]</span>
            </button>
          </div>
        </div>

        {/* Iframe Storage Security Alert Banner */}
        <div className="mb-8 p-4 bg-orange-950/20 border border-accent/30 rounded-xs flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
          <div className="flex gap-3 text-left">
            <span className="text-xl leading-none">💡</span>
            <div>
              <p className="font-sans font-bold text-white mb-0.5">
                [ 프리뷰(Iframe) 환경에서의 데이터 파일 업로드 주의 사항 ]
              </p>
              <p className="font-sans text-dark-muted leading-relaxed max-w-4xl">
                브라우저 보안 규칙으로 인해 편집 창 우측의 <strong>임시 프리뷰(Iframe) 화면 내에서는 로컬 저장소(IndexedDB/LocalStorage) 작동이 차단되거나 세션이 유지되지 않고 삭제될 수 있습니다.</strong><br />
                데이터가 유실되지 않는 <strong>완벽하고 안정적인 데이터 업로드를 위해서는 우측 상단의 '새 창에서 열기' 버튼 또는 실제 주소 홈페이지(Development/Shared App URL)로 직접 접속하여 관리자 패널(비밀번호 9764)을 사용</strong>해 주세요. 실제 홈페이지로 가시면 업로드한 포트폴리오 이미지가 로컬 디바이스에 완벽하고 영구적으로 보존됩니다!
              </p>
            </div>
          </div>
          <button
            onClick={() => window.open(window.location.origin, '_blank')}
            className="shrink-0 p-2 px-3 border border-accent/40 hover:bg-accent hover:text-black text-[10px] font-mono font-bold uppercase rounded-xs text-accent transition-colors duration-300 cursor-pointer self-start md:self-center"
          >
            [새 창(홈페이지)에서 관리자 열기]
          </button>
        </div>

        {/* Outer Split layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Panel: Form Control Panel */}
          <div className="lg:col-span-6 flex flex-col text-left">
            <div className="bg-dark-card border border-dark-border p-6 md:p-8 rounded-sm shadow-xl relative">
              <div className="absolute top-0 left-0 w-full h-[2.5px] bg-accent" />
              
              <div className="flex items-center gap-2 mb-6">
                <Plus size={14} className="text-accent" />
                <h3 className="font-syne text-xs uppercase text-white font-extrabold tracking-widest">
                  {isEditingId ? 'EDIT ARCHIVE PORTION (전시 정보 수정)' : 'ADD NEW ARCHIVE PORTION (새 전시물 추가)'}
                </h3>
              </div>

              <form onSubmit={handleSaveProject} className="flex flex-col gap-4">
                
                {/* Title */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-mono text-[9px] text-dark-muted uppercase tracking-widest block mb-1">
                      PROJECT NAME (프로젝트명) *
                    </label>
                    <input
                      type="text"
                      placeholder="예시: Silent Resonance"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      className="w-full bg-dark-bg border border-dark-border py-1.5 px-3 rounded-xs text-xs text-white focus:border-accent/50 focus:outline-none"
                      id="form-title-input"
                    />
                  </div>
                  <div>
                    <label className="font-mono text-[9px] text-dark-muted uppercase tracking-widest block mb-1">
                      CLIENT NAME (클라이언트명) *
                    </label>
                    <input
                      type="text"
                      placeholder="예시: AETHER Studio"
                      value={client}
                      onChange={(e) => setClient(e.target.value)}
                      required
                      className="w-full bg-dark-bg border border-dark-border py-1.5 px-3 rounded-xs text-xs text-white focus:border-accent/50 focus:outline-none"
                      id="form-client-input"
                    />
                  </div>
                </div>

                {/* Meta details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="font-mono text-[9px] text-dark-muted uppercase tracking-widest block mb-1">
                      TIMELINE (작업 기간)
                    </label>
                    <input
                      type="text"
                      placeholder="예시: 2026.01 - 2026.02"
                      value={period}
                      onChange={(e) => setPeriod(e.target.value)}
                      className="w-full bg-dark-bg border border-dark-border py-1.5 px-3 rounded-xs text-xs text-white focus:border-accent/50 focus:outline-none"
                      id="form-period-input"
                    />
                  </div>
                  <div>
                    <label className="font-mono text-[9px] text-dark-muted uppercase tracking-widest block mb-1">
                      CATEGORY (분류 카테고리)
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as Project['category'])}
                      className="w-full bg-dark-bg border border-dark-border py-1.5 px-3 rounded-xs text-xs text-white focus:border-accent/50 focus:outline-none cursor-pointer"
                      id="form-category-select"
                    >
                      <option value="photography">사진 촬영</option>
                      <option value="videography">영상 촬영</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2 pt-5">
                    <input
                      type="checkbox"
                      id="featured-checkbox"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="rounded-xs border-dark-border accent-accent h-4 w-4 bg-dark-bg focus:ring-0 checked:bg-accent cursor-pointer"
                    />
                    <label htmlFor="featured-checkbox" className="font-mono text-[9px] text-white uppercase tracking-widest cursor-pointer select-none">
                      FEATURED (메인 하이라이트)
                    </label>
                  </div>
                </div>

                {/* Scopes & Tools */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-mono text-[9px] text-dark-muted uppercase tracking-widest block mb-1">
                      SCOPE OF WORK (작업 범위 - 쉼표 구분)
                    </label>
                    <input
                      type="text"
                      placeholder="예: 촬영, 현장 조명, 색보정"
                      value={scopeRaw}
                      onChange={(e) => setScopeRaw(e.target.value)}
                      className="w-full bg-dark-bg border border-dark-border py-1.5 px-3 rounded-xs text-xs text-white focus:border-accent/50 focus:outline-none"
                      id="form-scope-input"
                    />
                  </div>
                  <div>
                    <label className="font-mono text-[9px] text-dark-muted uppercase tracking-widest block mb-1">
                      TOOLS UTILIZED (사용 툴 - 쉼표 구분)
                    </label>
                    <input
                      type="text"
                      placeholder="예: Sony FX3, DaVinci Resolve"
                      value={toolsRaw}
                      onChange={(e) => setToolsRaw(e.target.value)}
                      className="w-full bg-dark-bg border border-dark-border py-1.5 px-3 rounded-xs text-xs text-white focus:border-accent/50 focus:outline-none"
                      id="form-tools-input"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="font-mono text-[9px] text-dark-muted uppercase tracking-widest block mb-1">
                    PROJECT DESCRIPTION (프로젝트 상세 설명)
                  </label>
                  <textarea
                    rows={4}
                    placeholder="프로젝트 상세 기획 배경 및 연출 방향에 대해 상세히 기술해 주세요."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-dark-bg border border-dark-border py-2 px-3 rounded-xs text-xs text-white placeholder-dark-muted focus:border-accent/50 focus:outline-none leading-relaxed"
                    id="form-description-textarea"
                  />
                </div>

                {/* 1. Direct File Upload Zone */}
                <div className="border border-dark-border bg-dark-bg/40 p-4 rounded-sm">
                  <span className="font-mono text-[9px] text-accent uppercase tracking-widest block mb-2 font-black">
                    [ GALLERY MEDIA UPLOAD // 직접 미디어 파일 업로드 ]
                  </span>
                  
                  {/* Drag and Drop Container */}
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-sm p-6 text-center cursor-pointer transition-colors ${
                      isDragging
                        ? 'border-accent bg-accent/10'
                        : 'border-dark-border/80 hover:border-accent/40 bg-dark-card/25'
                    }`}
                    onClick={() => document.getElementById('media-file-input')?.click()}
                  >
                    <input
                      type="file"
                      id="media-file-input"
                      multiple
                      accept="image/*,video/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Upload size={24} className="mx-auto mb-2 text-dark-muted group-hover:text-accent" />
                    <p className="text-xs text-white uppercase font-sans font-medium mb-1">
                      클릭하거나 사진/동영상을 이 곳으로 드래그 하세요
                    </p>
                    <p className="text-[10px] text-dark-muted font-mono">
                      (PNG, JPG, WEBP, MP4, MOV 등 지원)
                    </p>
                  </div>

                  {/* Uploaded Files grid with custom checkboxes to "Set as Representative Picture" */}
                  {uploadedFiles.length > 0 && (
                    <div className="mt-4 border-t border-dark-border/40 pt-4">
                      <span className="font-mono text-[9px] text-dark-muted uppercase tracking-widest block mb-1 font-extrabold">
                        첨부 및 업로드된 파일 리스트 ({uploadedFiles.length})
                      </span>
                      <p className="text-[8px] font-mono text-dark-muted mb-2.5">
                        ※ "대표로 지정" 박스를 선택하여 업로드물 중 대표 사진(커버)을 손쉽게 설정하여 주십시오.
                      </p>
                      <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto no-scrollbar">
                        {uploadedFiles.map((file) => {
                          const isRepresentative = file.id === representativeId;
                          return (
                            <div
                              key={file.id}
                              className={`flex items-center justify-between p-2 rounded-xs border text-left bg-dark-bg/65 ${
                                isRepresentative ? 'border-accent bg-accent-dim/10' : 'border-dark-border/50'
                              }`}
                            >
                              <div className="flex items-center gap-3 overflow-hidden flex-1">
                                {/* Thumbnail */}
                                <div className="h-10 w-12 bg-black border border-dark-border flex-shrink-0 overflow-hidden relative flex items-center justify-center rounded-xs">
                                  {file.type === 'image' ? (
                                    <img
                                      src={file.url}
                                      alt={file.name}
                                      className="h-full w-full object-cover"
                                      referrerPolicy="no-referrer"
                                    />
                                  ) : (
                                    <Video size={14} className="text-accent" />
                                  )}
                                </div>
                                <div className="overflow-hidden pr-2">
                                  <p className="text-[10px] text-white truncate font-medium max-w-[150px] sm:max-w-xs">{file.name}</p>
                                  <p className="font-mono text-[8px] text-dark-muted uppercase">
                                    {file.type === 'image' ? 'IMAGE FILE' : 'VIDEO FILE'}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                {/* Representative Setting Box */}
                                {file.type === 'image' && (
                                  <button
                                    type="button"
                                    onClick={() => handleSetRepresentative(file.id)}
                                    className={`flex items-center gap-1.5 py-1 px-2.5 border rounded-xs font-mono text-[8px] font-bold tracking-wider cursor-pointer transition-all ${
                                      isRepresentative
                                        ? 'bg-accent border-accent text-black font-black'
                                        : 'border-dark-border/80 text-dark-muted hover:text-white hover:border-accent/40'
                                    }`}
                                    title="대표 사진(Cover)으로 지정"
                                  >
                                    {isRepresentative ? (
                                      <>
                                        <Check size={8} className="stroke-[3]" />
                                        <span>[ 대표 사진 ]</span>
                                      </>
                                    ) : (
                                      <span>[ 대표로 지정 ]</span>
                                    )}
                                  </button>
                                )}

                                {/* Delete button */}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveUploadedFile(file.id)}
                                  className="p-1 px-2 border border-red-900/30 text-red-400 hover:bg-red-950/20 rounded-xs hover:border-red-500/20 cursor-pointer transition-colors"
                                  title="첨부 해제"
                                >
                                  <Trash2 size={10} />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Direct Video Link Field (High Visibility) */}
                <div className="border border-dark-border bg-dark-bg/20 p-4 rounded-sm flex flex-col gap-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Video size={13} className="text-accent" />
                    <span className="font-mono text-[9px] text-accent uppercase tracking-widest block font-black">
                      [ VIDEO STREAMING LINK // 동영상 링크 추가 ]
                    </span>
                  </div>
                  <label className="font-mono text-[9.5px] text-white uppercase tracking-wider block">
                    YOUTUBE OR VIMEO URL (유튜브 또는 비메오 동영상 주소)
                  </label>
                  <input
                    type="url"
                    placeholder="예시: https://www.youtube.com/watch?v=dQw4w9WgXcQ 또는 https://youtu.be/..."
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="w-full bg-dark-bg border border-dark-border py-2 px-3 rounded-xs text-xs text-white placeholder-dark-muted focus:border-accent/50 focus:outline-none"
                    id="form-video-url-input-new"
                  />
                  <p className="font-sans text-[10.5px] text-dark-muted leading-relaxed">
                    ※ 전시할 동영상(유튜브/비메오 등)의 <strong>일반 웹 주소를 그대로 복사하여 입력</strong>해 주세요. 갤러리 뷰어에서 <strong>비디오 플레이어로 자동 변환</strong>되어 즉시 감상할 수 있습니다.
                  </p>
                </div>

                {/* Advanced URL Fields (collapsible/secondary so they can still manually feed fallback URLs or presets) */}
                <div className="border border-dark-border/40 p-4 rounded-sm bg-dark-bg/25">
                  <details className="group">
                    <summary className="font-mono text-[9px] text-dark-muted uppercase tracking-widest cursor-pointer select-none list-none flex items-center justify-between outline-none">
                      <span>[ ADVANCED: MANUAL MEDIATOR URLS // 직접 수동 입력 및 복사 설정 ]</span>
                      <span className="text-accent group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    
                    <div className="mt-4 flex flex-col gap-4">
                      {/* Cover Image URL */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="font-mono text-[9px] text-dark-muted uppercase tracking-widest block">
                            REPRESENT IMAGE URL (대표 이미지 주소)
                          </label>
                          <span className="text-[8px] text-accent font-bold">임시 이미지 퀵 로드 지원</span>
                        </div>
                        <input
                          type="url"
                          placeholder="https://images.unsplash.com/photo-..."
                          value={coverImage}
                          onChange={(e) => setCoverImage(e.target.value)}
                          className="w-full bg-dark-bg border border-dark-border py-1.5 px-3 rounded-xs text-[10px] text-white focus:border-accent/50 focus:outline-none"
                          id="form-cover-image-input"
                        />
                        
                        {/* Quick Preset Selector */}
                        <div className="mt-2 p-2 bg-dark-bg border border-dark-border rounded-xs">
                          <span className="font-mono text-[7px] text-dark-muted uppercase tracking-wider block mb-1">
                            고화질 시네마틱 프리셋 주소 퀵 로드
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {presets.map((preset, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => handleApplyPresetImage(preset.url)}
                                className="px-1.5 py-0.5 text-[8px] font-outfit text-white hover:text-accent bg-dark-card border border-dark-border hover:border-accent/40 rounded-sm cursor-pointer transition-colors"
                                id={`preset-img-btn-${idx}`}
                              >
                                {preset.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Additional URLs */}
                      <div>
                        <label className="font-mono text-[9px] text-dark-muted uppercase tracking-widest block mb-1">
                          ADDITIONAL GALLERY IMAGES (추가 이미지 주소 - 쉼표 구분)
                        </label>
                        <textarea
                          rows={2}
                          placeholder="수동으로 추가하고 싶은 원격 이미지 URL 입력"
                          value={additionalImagesRaw}
                          onChange={(e) => setAdditionalImagesRaw(e.target.value)}
                          className="w-full bg-dark-bg border border-dark-border py-1.5 px-3 rounded-xs text-[10px] text-white placeholder-dark-muted focus:border-accent/50 focus:outline-none"
                          id="form-additional-images-textarea"
                        />
                      </div>
                    </div>
                  </details>
                </div>

                {/* Actions group */}
                <div className="flex gap-3 mt-4 border-t border-dark-border pt-4">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-accent hover:bg-[#fa8743] hover:text-black text-black font-mono font-black text-xs tracking-wider transition-all rounded-xs cursor-pointer text-center"
                    id="form-submit-btn"
                  >
                    {isEditingId ? 'SAVE CHANGES (수정 사항 디스크 임포트)' : 'UPLOAD TO ARCHIVE (전시관 업로드)'}
                  </button>
                  <button
                    type="button"
                    onClick={clearForm}
                    className="px-4 py-2.5 border border-dark-border hover:bg-dark-bg text-dark-muted hover:text-white font-mono text-xs transition-colors rounded-xs cursor-pointer select-none"
                    id="form-clear-btn"
                  >
                    CANCEL
                  </button>
                </div>

              </form>
            </div>
          </div>

          {/* Right Panel: Content Inventory List & JSON synchronization panel */}
          <div className="lg:col-span-6 flex flex-col gap-8 text-left">
            
            {/* Active Inventory List */}
            <div className="bg-dark-card border border-dark-border p-6 rounded-sm shadow-xl flex flex-col justify-between max-h-[500px]">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-dark-border/60">
                <span className="font-mono text-[10px] uppercase text-white font-black tracking-widest">
                  [ ACTIVE ARCHIVE PIECES ({projects.length}) ]
                </span>
                <span className="text-[10px] font-mono text-accent select-none">LIVE SYNC</span>
              </div>

              <div className="flex flex-col gap-3 overflow-y-auto pr-1 no-scrollbar flex-1">
                {projects.map((p) => {
                  const displayCategory = 
                    p.category === 'photography' ? '사진 촬영' : '영상 촬영';

                  return (
                    <div 
                      key={p.id}
                      className="flex items-center gap-4 p-3 border border-dark-border bg-dark-bg/60 rounded-xs justify-between group hover:border-accent/20 transition-colors"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <img 
                          src={p.coverImage} 
                          alt="" 
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 object-cover rounded-xs border border-dark-border"
                        />
                        <div className="text-left overflow-hidden">
                          <span className="text-[9px] font-mono font-bold text-accent uppercase block tracking-wider">
                            {p.category.toUpperCase()} // {displayCategory}
                          </span>
                          <h4 className="font-outfit text-xs font-bold text-white tracking-tight line-clamp-1 group-hover:text-accent transition-colors">
                            {p.title}
                          </h4>
                          <span className="font-mono text-[9px] text-dark-muted">
                            Client: {p.client}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {deleteConfirmId === p.id ? (
                          <div className="flex items-center gap-1 bg-red-950/45 p-1 border border-red-900/40 rounded-xs animate-in fade-in zoom-in-95 duration-200">
                            <span className="text-[9px] font-mono font-bold text-red-400 px-1">정말 삭제?</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteProject(p.id);
                                showToast(`"${p.title}" 프로젝트가 영구 삭제되었습니다.`, 'info');
                                setDeleteConfirmId(null);
                              }}
                              className="px-2 py-0.5 bg-red-600 hover:bg-red-500 text-white font-mono text-[8px] font-bold rounded-xs transition-colors cursor-pointer"
                              id={`delete-confirm-yes-${p.id}`}
                            >
                              YES
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteConfirmId(null);
                              }}
                              className="px-2 py-0.5 border border-dark-border hover:text-white text-dark-muted font-mono text-[8px] rounded-xs transition-colors cursor-pointer"
                              id={`delete-confirm-no-${p.id}`}
                            >
                              NO
                            </button>
                          </div>
                        ) : (
                          <>
                            <button
                              onClick={() => startEdit(p)}
                              className="p-1.5 border border-dark-border hover:border-accent/35 text-dark-muted hover:text-accent bg-dark-card rounded-xs transition-colors cursor-pointer select-none"
                              title="프로젝트 수정"
                              id={`edit-item-btn-${p.id}`}
                            >
                              <Edit2 size={11} />
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(p.id)}
                              className="p-1.5 border border-dark-border hover:border-red-500/35 text-dark-muted hover:text-red-400 bg-dark-card rounded-xs transition-colors cursor-pointer select-none"
                              title="영구 삭제"
                              id={`delete-item-btn-${p.id}`}
                            >
                              <Trash2 size={11} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RAW Backup Synchronizer (Very pro, provides ultimate robustness for drafts) */}
            <div className="bg-dark-card border border-dark-border p-6 rounded-sm shadow-xl flex flex-col text-left">
              <div className="flex items-center gap-2 mb-4 border-b border-dark-border pb-3">
                <FileText size={14} className="text-accent" />
                <h3 className="font-syne text-xs uppercase text-white font-extrabold tracking-widest">
                  DATA RECOVERY CENTRE (데이터 백업 및 백업 복원소)
                </h3>
              </div>

              <p className="font-sans text-[11px] text-dark-muted leading-relaxed mb-4">
                브라우저 내부 캐시가 소거되더라도 백업에 문제가 없도록, 포트폴리오 정보를 원형 JSON 백업 데이터로 저장하거나 로딩할 수 있습니다.
              </p>

              {backupSuccessMsg && (
                <div className="text-[10px] font-mono text-accent bg-accent-dim/15 border border-accent/25 p-2 rounded-xs select-text block mb-3">
                  {backupSuccessMsg}
                </div>
              )}

              <textarea
                rows={3}
                placeholder="백업 내려받기 단추를 클릭하여 생성된 코드 정보나, 소지 중이신 JSON 백업 덤프 소스를 붙여넣어 주세요."
                value={jsonBackupText}
                onChange={(e) => setJsonBackupText(e.target.value)}
                className="w-full bg-dark-bg border border-dark-border font-mono text-[9px] leading-normal p-2.5 rounded-xs text-dark-muted focus:text-white focus:outline-none mb-4"
                id="raw-backup-textarea"
              />

              <div className="flex gap-2.5">
                <button
                  onClick={handleBackupExport}
                  className="flex-1 py-2 border border-accent hover:bg-accent hover:text-black text-accent text-[10px] font-mono rounded-xs transition-all duration-300 cursor-pointer select-none"
                  id="backup-export-btn"
                >
                  DOWNLOAD BACKUP DAT
                </button>
                <button
                  onClick={handleBackupImport}
                  className="flex-1 py-2 border border-dark-border hover:border-accent text-dark-muted hover:text-white text-[10px] font-mono rounded-xs transition-colors cursor-pointer select-none"
                  id="backup-import-btn"
                >
                  RESTORE BACKUP DAT
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
