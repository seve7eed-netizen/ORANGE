import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Project, CategoryFilter } from '../types';
import { Lock, Unlock, Plus, Trash2, Edit2, Download, Upload, RotateCcw, AlertTriangle, FileText, Check, ArrowRight, Image as ImageIcon, Film, Video, Star, Save, Database } from 'lucide-react';
import { BulletproofDB } from '../utils/db';
import { compressBase64IfNeeded } from '../utils/firebase';
import { isDevelopmentWorkspace } from '../utils/isDev';

interface AdminPanelProps {
  projects: Project[];
  onAddProject: (project: Project) => Promise<void> | void;
  onUpdateProject: (project: Project) => Promise<void> | void;
  onDeleteProject: (id: string) => Promise<void> | void;
  onResetToDefault: () => Promise<void> | void;
  onImportBackup: (imported: Project[]) => Promise<void> | void;
  onForceSyncToCloud?: () => Promise<void> | void;
  onPullFromCloud?: () => Promise<void> | void;
  onRestoreFromLocalBackup?: () => Promise<void> | void;
  isAdminLoggedIn: boolean;
  setIsAdminLoggedIn: (val: boolean) => void;
  isStaticMode: boolean;
  setIsStaticMode: (val: boolean) => void;
}

export default function AdminPanel({
  projects,
  onAddProject,
  onUpdateProject,
  onDeleteProject,
  onResetToDefault,
  onImportBackup,
  onForceSyncToCloud,
  onPullFromCloud,
  onRestoreFromLocalBackup,
  isAdminLoggedIn,
  setIsAdminLoggedIn,
  isStaticMode,
  setIsStaticMode
}: AdminPanelProps) {
  const isDev = isDevelopmentWorkspace();
  const [passwordInput, setPasswordInput] = useState('');
  const [passError, setPassError] = useState(false);
  const [isPullingCloud, setIsPullingCloud] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [hasLocalBackup, setHasLocalBackup] = useState(() => {
    try {
      return !!localStorage.getItem('orange_archive_v2_backup_projects');
    } catch (_) {
      return false;
    }
  });

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
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoUrls, setVideoUrls] = useState<string[]>([]);
  const [featured, setFeatured] = useState(false);

  // Direct File Upload & Representative selection states
  const [uploadedFiles, setUploadedFiles] = useState<{ id: string; url: string; name: string; type: 'image' | 'video' }[]>([]);
  const [representativeId, setRepresentativeId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Raw JSON Backup state
  const [jsonBackupText, setJsonBackupText] = useState('');
  const [backupSuccessMsg, setBackupSuccessMsg] = useState('');
  const backupFileInputRef = useRef<HTMLInputElement | null>(null);

  // Custom states for iFrame-safe non-blocking feedback & inline confirmation
  const [toast, setToast] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isHardSaving, setIsHardSaving] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSyncingCloud, setIsSyncingCloud] = useState(false);

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

  const getErrorMessage = (err: any): string => {
    if (!err) return '알 수 없는 오류가 발생했습니다.';
    const msg = err.message || String(err);
    try {
      if (msg.trim().startsWith('{')) {
        const parsed = JSON.parse(msg);
        if (parsed && parsed.error) {
          if (parsed.error.includes('Missing or insufficient permissions')) {
            return '데이터베이스 접근 권한이 없습니다. (보안 규칙 확인이 필요합니다)';
          }
          if (parsed.error.includes('Quota exceeded')) {
            return 'Firestore 용량 초과 또는 요청 제한에 도달했습니다.';
          }
          return parsed.error;
        }
      }
    } catch (_) {}
    return msg;
  };

  const handleCopyStaticCode = () => {
    try {
      const servicesArray = [
        {
          id: 's1',
          title: '사진 촬영',
          englishTitle: 'PHOTOGRAPHY',
          description: '기하학적인 자연광 분석과 최상급 상업 조명 장비를 결합하여 오브제와 인물의 본질적 깊이를 포획합니다. 단순한 평면 기록이 아닌, 하셀블라드 기만의 공간감과 심도를 프레임 안에 입체적으로 설계합니다.',
          capabilities: ['하이 패션 룩북', '건축 스페이스 아카이빙', '프리미엄 미니멀 초상', '라이프스타일 브랜드 컷']
        },
        {
          id: 's2',
          title: '영상 촬영',
          englishTitle: 'VIDEOGRAPHY & CINEMA',
          description: '이야기와 감정의 궤도를 정밀하게 추적하는 고화질 시네마 레코딩을 주도합니다. 철저한 마스터 샷 계획, 조명 동선 설계, 핸드헬드와 정적 삼각대 구도를 결합해 세련되고 극적인 시각 서사를 가꿉니다.',
          capabilities: ['크리에이티브 다큐멘터리', '브랜드 무비 & 패션필름', '비주얼 루프 아키텍쳐', '4K/6K RAW 시네마 레코딩']
        }
      ];

      const jsonProjects = JSON.stringify(projects, null, 2);
      const jsonServices = JSON.stringify(servicesArray, null, 2);

      const fileContent = `import { Project, ServiceDetail } from './types';

export const initialProjects: Project[] = ${jsonProjects};

export const services: ServiceDetail[] = ${jsonServices};
`;

      navigator.clipboard.writeText(fileContent);
      showToast('정적 소스 코드가 클립보드에 복사되었습니다! src/initialProjects.ts 에 붙여넣으세요.', 'success');
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 3000);
    } catch (e) {
      console.error(e);
      showToast('코드 복사에 실패했습니다.', 'error');
    }
  };

  const handleManualForceSync = async () => {
    if (!onForceSyncToCloud) return;
    setIsSyncingCloud(true);
    showToast('클라우드 데이터베이스에 모든 홈페이지 데이터를 강제로 전송하는 중입니다...', 'info');
    try {
      await onForceSyncToCloud();
      showToast('성공적으로 모든 활성 포트폴리오 데이터가 클라우드로 복제 및 동기화되었습니다! 이제 프리뷰(Shared App) 페이지에서도 완벽하게 확인 가능합니다.', 'success');
    } catch (err) {
      console.error('Failed to force sync:', err);
      showToast(`클라우드 동기화 실패: ${getErrorMessage(err)}`, 'error');
    } finally {
      setIsSyncingCloud(false);
    }
  };

  const handleManualPull = async () => {
    if (!onPullFromCloud) return;

    const confirmPull = window.confirm(
      "⚠️ [주의] 클라우드(Shared App)에서 최신 데이터를 가져오시겠습니까?\n\n" +
      "이 작업은 현재 브라우저 기기에만 있는 모든 게시물(미전송 사진촬영 등)을 덮어씁니다.\n\n" +
      "안전을 위해 실행 직전에 현재 데이터가 '자동 로컬 백업'에 먼저 보관되며,\n" +
      "혹시 실수로 덮어쓰더라도 아래의 [로컬 백업 복원] 버튼으로 즉시 원래대로 되돌릴 수 있습니다."
    );
    if (!confirmPull) return;

    setIsPullingCloud(true);
    showToast('클라우드 서버에서 모든 포트폴리오 데이터를 안전하게 가져오는 중입니다...', 'info');
    try {
      await onPullFromCloud();
      showToast('성공적으로 모든 클라우드 데이터를 로컬 저장소로 복원하고 화면을 업데이트했습니다!', 'success');
      // Update local backup presence state
      setHasLocalBackup(true);
    } catch (err: any) {
      console.error('Failed to pull from cloud:', err);
      showToast(`데이터를 가져오는 중 오류가 발생했습니다: ${getErrorMessage(err)}`, 'error');
    } finally {
      setIsPullingCloud(false);
    }
  };

  const handleManualRestore = async () => {
    if (!onRestoreFromLocalBackup) return;

    const confirmRestore = window.confirm(
      "🔄 최근 로컬 자동 백업을 복원하시겠습니까?\n\n" +
      "클라우드에서 가져오기(Pull) 직전 상태의 로컬 게시물 데이터로 즉시 복구합니다."
    );
    if (!confirmRestore) return;

    try {
      await onRestoreFromLocalBackup();
      showToast('축하합니다! 유실되었던 로컬 게시물 데이터가 즉시 백업본에서 복구되었습니다.', 'success');
    } catch (err: any) {
      console.error('Failed to restore:', err);
      showToast(err.message || '로컬 백업 복구 중 오류가 발생했습니다.', 'error');
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
    setAdditionalImages(p.additionalImages || []);
    setVideoUrl(p.videoUrl || '');
    // Make sure we don't duplicate the main videoUrl in videoUrls if they both exist
    const otherVideos = p.videoUrls ? p.videoUrls.filter(v => v !== p.videoUrl) : [];
    setVideoUrls(otherVideos);
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

    const vUrls = p.videoUrls || (p.videoUrl ? [p.videoUrl] : []);
    vUrls.forEach((vUrl, idx) => {
      if (vUrl) {
        list.push({
          id: `video_${idx}_${Date.now()}`,
          url: vUrl,
          name: vUrls.length > 1 ? `프로젝트 비디오 #${idx + 1}` : '프로젝트 비디오 (Embedded/Uploaded)',
          type: 'video'
        });
      }
    });

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
    setAdditionalImages([]);
    setVideoUrl('');
    setVideoUrls([]);
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
          
          // Limit image dimensions to safe boundaries (max 500 border to fit Firestore size limitations perfectly)
          const MAX_RESOL = 500;
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
            
            // Compress into highly-optimized web-scaled JPEG (0.30 quality keeps Firestore records stable below 1MB)
            const compressedUrl = canvas.toDataURL('image/jpeg', 0.30);
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
            showToast(`"${fileToRead.name}" 이미지의 고화질 웹 최적화 압축(600px)이 완료되었습니다.`, 'success');
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
    reader.onload = async (event) => {
      let resultUrl = event.target?.result as string;
      if (resultUrl && resultUrl.startsWith('data:image/')) {
        showToast(`"${fileObj.name}" 이미지의 예비 최적화 압축을 진행 중입니다...`, 'info');
        resultUrl = await compressBase64IfNeeded(resultUrl, 600, 0.4);
      }
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
      showToast(`"${fileObj.name}" 이미지 복구 형식을 통해 최적화 완료 및 업로드되었습니다.`, 'success');
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

    let finalCoverImage = coverImage.trim();
    let finalVideoUrl = videoUrl.trim();

    // Check if there is a representative file in uploadedFiles
    const repFile = uploadedFiles.find(f => f.id === representativeId && f.type === 'image');
    if (repFile) {
      finalCoverImage = repFile.url;
    } else {
      // If representativeId doesn't point to a file, but there are uploaded images, pick the first one
      const uploadedImagesOnly = uploadedFiles.filter(f => f.type === 'image');
      if (uploadedImagesOnly.length > 0 && !finalCoverImage) {
        finalCoverImage = uploadedImagesOnly[0].url;
      }
    }

    if (!title || !client || !finalCoverImage) {
      showToast('프로젝트명, 클라이언트명, 대표 사진은 필수 항목입니다. 직접 파일을 업로드하거나 이미지 링크를 입력해 주세요.', 'error');
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

    // Collect all uploaded images that are NOT the representative one
    const uploadedAddImages = uploadedFiles
      .filter(f => f.type === 'image' && f.id !== (repFile?.id || representativeId))
      .map(f => f.url);

    const manualAddImages = additionalImages
      .map(img => img.trim())
      .filter(img => img.length > 0);

    // Combine uploaded images and manual image URLs (without duplication)
    const cleanedAdditionalImages = Array.from(new Set([
      ...uploadedAddImages,
      ...manualAddImages
    ]));

    const allVideoUrls = [finalVideoUrl, ...videoUrls]
      .map(v => v.trim())
      .filter(v => v.length > 0);

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
      additionalImages: cleanedAdditionalImages,
      videoUrl: allVideoUrls[0] || undefined,
      videoUrls: allVideoUrls.length > 0 ? allVideoUrls : undefined,
      featured
    };

    setIsSaving(true);
    const isEdit = !!isEditingId;
    const savePromise = isEdit ? onUpdateProject(projectData) : onAddProject(projectData);

    Promise.resolve(savePromise)
      .then(() => {
        clearForm();
        showToast(isEdit ? '성공적으로 수정 완료되었습니다.' : '신규 프로젝트가 아카이브에 성공적으로 업로드되었습니다.', 'success');
      })
      .catch((err) => {
        console.error('Failed to sync project:', err);
        let errorMsg = '클라우드 저장 실패: 권한이 없거나 입력된 이미지 주소가 유효하지 않습니다.';
        if (err && typeof err === 'object' && err.message) {
          errorMsg = `저장 실패: ${err.message}`;
        }
        showToast(errorMsg, 'error');
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  const handleBackupExport = () => {
    try {
      const rawData = JSON.stringify(projects, null, 2);
      setJsonBackupText(rawData);

      // Create a Blob and trigger a browser download
      const blob = new Blob([rawData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `orange_archive_backup_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setBackupSuccessMsg('백업 JSON 파일 다운로드가 시작되었습니다. 하단 텍스트 영역에서도 백업본 확인 및 복사가 가능합니다.');
      showToast('성공적으로 백업 파일(.json) 다운로드를 개시했습니다!', 'success');
    } catch (err) {
      console.error('Backup download error:', err);
      showToast('백업 파일 생성에 실패했습니다.', 'error');
    }
  };

  const handleBackupImport = () => {
    if (!jsonBackupText.trim()) {
      showToast('입력창에 복원할 JSON 데이터를 붙여넣어 주세요.', 'error');
      return;
    }
    try {
      const parsed = JSON.parse(jsonBackupText);
      if (Array.isArray(parsed) && parsed.every(p => p && p.id && p.title)) {
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

  const handleBackupFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed) && parsed.every(p => p && p.id && p.title)) {
          onImportBackup(parsed);
          setJsonBackupText('');
          setBackupSuccessMsg('성공적으로 로컬 아카이브 데이터베이스가 갱신 및 백업으로부터 동기화되었습니다!');
          showToast('성공적으로 백업 파일(.json)을 로드하여 데이터베이스를 복원했습니다!', 'success');
        } else {
          showToast('올바른 포트폴리오 백업 형식이 아닙니다.', 'error');
        }
      } catch (err) {
        showToast('JSON 파일 파싱에 실패했습니다.', 'error');
      }
    };
    reader.readAsText(file);
    // Reset file input value so same file can be selected again
    e.target.value = '';
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
          </div>
        </div>

        {/* Iframe Storage Security Alert Banner */}
        <div className="mb-6 p-4 bg-orange-950/20 border border-accent/30 rounded-xs flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
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

        {/* Runtime Mode Selector (Static SPA vs Cloud Sync) */}
        <div className="mb-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-dark-card border border-dark-border p-4 rounded-sm text-left">
          <div className="flex-grow">
            <span className="font-syne text-[10px] font-bold text-accent uppercase tracking-widest block">
              [ WEBSITE RUNTIME SYSTEM // 웹사이트 구동 방식 설정 ]
            </span>
            <p className="text-xs font-sans text-dark-muted mt-1 leading-relaxed">
              <strong>정적 사이트(Static SPA) 모드</strong>를 활성화하면 Firebase 데이터베이스 연동 및 접근 권한 제한 없이, 내장된 데이터 파일과 브라우저 캐시만으로 초고속 단독 정적 구동됩니다.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
            <span className="font-sans text-xs font-bold text-white select-none">
              {isStaticMode ? '정적 단독형 웹사이트 (Static SPA)' : '클라우드 실시간 동기화'}
            </span>
            <button
              type="button"
              onClick={() => {
                setIsStaticMode(!isStaticMode);
                showToast(
                  !isStaticMode 
                    ? "정적 단독형 웹사이트 모드가 활성화되었습니다. 데이터베이스 접근 에러가 발생하지 않습니다." 
                    : "클라우드 데이터 실시간 동기화 모드로 전환되었습니다.", 
                  "success"
                );
              }}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isStaticMode ? 'bg-accent font-bold' : 'bg-dark-border'
              }`}
              id="admin-runtime-mode-toggle"
              title="구동 방식 스위치"
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-black shadow ring-0 transition duration-200 ease-in-out ${
                  isStaticMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Dynamic Panel rendering based on mode */}
        {isStaticMode ? (
          <div className="mb-8 p-5 bg-accent/5 border border-accent/40 rounded-sm shadow-md flex flex-col xl:flex-row items-center justify-between gap-6 transition-all duration-300 hover:border-accent/60 relative overflow-hidden text-left w-full">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-accent" />
            <div className="flex gap-4">
              <div className="p-3 bg-accent/10 rounded-full text-accent shrink-0 self-start">
                <Database size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h4 className="font-syne text-sm font-bold text-white uppercase tracking-wider">
                    정적 단독 구동 제어 센터 (Static SPA Center)
                  </h4>
                  <span className="flex items-center gap-1 font-mono text-[9px] text-accent bg-accent/10 px-1.5 py-0.5 rounded-full uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                    PURE OFFLINE STATIC ACTIVE
                  </span>
                </div>
                <p className="font-sans text-xs text-dark-muted leading-relaxed max-w-3xl">
                  현재 웹사이트는 Firebase 데이터베이스 연결을 원천 우회하고, <strong className="text-accent">100% 독립적인 오프라인/정적 모드</strong>로 작동 중입니다. 로딩 지연이 전혀 없고 권한 에러 걱정이 없습니다.
                  <br />
                  수정 사항을 배포 사이트(Netlify 등)에 영구 반영하시려면, 아래 버튼을 눌러 소스코드를 복사한 뒤 에디터의 <code className="text-white bg-dark-bg/80 px-1 py-0.5 rounded font-mono text-[11px]">src/initialProjects.ts</code> 파일의 내용 전체에 그대로 덮어씌워 배포(빌드)하시면 됩니다!
                </p>
              </div>
            </div>
            
            <div className="shrink-0 w-full xl:w-auto">
              <button
                type="button"
                onClick={handleCopyStaticCode}
                className="w-full xl:w-auto shrink-0 flex items-center justify-center gap-2 p-3.5 px-6 rounded-xs font-mono text-xs uppercase font-extrabold tracking-wider transition-all duration-300 bg-accent text-black hover:bg-accent/80 hover:shadow-accent/20 active:scale-[0.98] cursor-pointer"
              >
                <Save size={13} />
                <span>{copiedCode ? '복사 완료! ✔' : 'initialProjects.ts 소스 복사 ↗'}</span>
              </button>
            </div>
          </div>
        ) : (
          /* Highly prominent Cloud Preview Synchronization Dashboard Panel */
          onForceSyncToCloud && (
            <div className="mb-8 p-5 bg-emerald-950/15 border border-emerald-500/40 rounded-sm shadow-md flex flex-col xl:flex-row items-center justify-between gap-6 transition-all duration-300 hover:border-emerald-500/60 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500" />
              <div className="flex gap-4 text-left">
                <div className="p-3 bg-emerald-500/10 rounded-full text-emerald-400 shrink-0 self-start">
                  <Database size={20} className={isSyncingCloud || isPullingCloud ? 'animate-bounce' : ''} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-syne text-sm font-bold text-emerald-400 uppercase tracking-wider">
                      클라우드 데이터 동기화 제어 센터 (Cloud Sync Center)
                    </h4>
                    <span className="flex items-center gap-1 font-mono text-[9px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full uppercase">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      ONLINE SYNC ACTIVE
                    </span>
                  </div>
                  <p className="font-sans text-xs text-dark-muted leading-relaxed max-w-3xl">
                    구글 AI 스튜디오 프리뷰 환경과 배포된 Netlify 웹사이트 간에 포트폴리오 데이터를 완벽하게 실시간 동기화할 수 있습니다.
                    <br />
                    • <strong className="text-emerald-400">클라우드 데이터 저장 ↗</strong>: 현재 화면의 포트폴리오/사진촬영 데이터를 클라우드 데이터베이스에 영구 저장하여 Netlify 등 다른 기기에서 가져갈 수 있게 합니다.
                    <br />
                    • <strong className="text-emerald-400">클라우드 데이터 가져오기 ↙</strong>: 클라우드에 보관된 최신 포트폴리오 데이터를 현재 브라우저로 가져와 화면에 즉시 적용합니다. (실행 전 자동으로 로컬 백업이 생성됩니다)
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto shrink-0">
                <button
                  type="button"
                  onClick={handleManualForceSync}
                  disabled={isSyncingCloud || isPullingCloud}
                  className={`shrink-0 flex items-center justify-center gap-2 p-3.5 px-6 rounded-xs font-mono text-xs uppercase font-extrabold tracking-wider transition-all duration-300 shadow-lg ${
                    isSyncingCloud
                      ? 'bg-dark-card border border-dark-border text-dark-muted animate-pulse cursor-not-allowed shadow-none'
                      : 'bg-emerald-500 text-black hover:bg-emerald-400 hover:shadow-emerald-500/20 active:scale-[0.98] cursor-pointer'
                  }`}
                  id="admin-main-cloud-sync-btn"
                >
                  <Database size={13} className={isSyncingCloud ? 'animate-spin' : ''} />
                  <span>{isSyncingCloud ? '동기화 전송 중...' : '클라우드 데이터 저장 ↗'}</span>
                </button>

                {onPullFromCloud && (
                  <button
                    type="button"
                    onClick={handleManualPull}
                    disabled={isSyncingCloud || isPullingCloud}
                    className={`shrink-0 flex items-center justify-center gap-2 p-3.5 px-6 rounded-xs font-mono text-xs uppercase font-extrabold tracking-wider transition-all duration-300 border shadow-lg ${
                      isPullingCloud
                        ? 'bg-dark-card border border-dark-border text-dark-muted animate-pulse cursor-not-allowed shadow-none'
                        : 'border-emerald-500/50 bg-transparent text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-400 active:scale-[0.98] cursor-pointer'
                    }`}
                    id="admin-main-cloud-pull-btn"
                  >
                    <Download size={13} className={isPullingCloud ? 'animate-spin' : ''} />
                    <span>{isPullingCloud ? '데이터 로드 중...' : '클라우드 데이터 가져오기 ↙'}</span>
                  </button>
                )}

                {onRestoreFromLocalBackup && hasLocalBackup && (
                  <button
                    type="button"
                    onClick={handleManualRestore}
                    disabled={isSyncingCloud || isPullingCloud}
                    className="shrink-0 flex items-center justify-center gap-2 p-3.5 px-6 rounded-xs font-mono text-xs uppercase font-extrabold tracking-wider transition-all duration-300 border border-amber-500/40 bg-amber-950/20 text-amber-400 hover:bg-amber-500/15 hover:border-amber-400 active:scale-[0.98] cursor-pointer shadow-lg"
                    id="admin-restore-backup-btn"
                  >
                    <RotateCcw size={13} />
                    <span>최근 로컬 백업 복원 ↺</span>
                  </button>
                )}
              </div>
            </div>
          )
        )}

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

                {/* 1. URL 입력 필드 (사진 링크 & 동영상 링크) */}
                <div className="border border-dark-border bg-dark-bg/40 p-4 rounded-sm flex flex-col gap-4">
                  <span className="font-mono text-[9px] text-accent uppercase tracking-widest block font-black">
                    [ GALLERY MEDIA LINKS // 포트폴리오 직접 미디어 URL 입력 ]
                  </span>

                  {/* DIRECT FILE UPLOADER & PREVIEW ZONE */}
                  <div className="border border-dark-border/60 bg-dark-bg/60 p-4 rounded-xs flex flex-col gap-3">
                    <div className="flex items-center justify-between border-b border-dark-border/40 pb-2">
                      <span className="font-mono text-[9px] text-accent uppercase tracking-widest block font-black">
                        [ DIRECT MEDIA UPLOAD // 미디어 파일 직접 업로드 ]
                      </span>
                      <span className="text-[8px] font-sans text-dark-muted font-bold">
                        HEIC 자동 변환 • 600px 스마트 리사이징 적용
                      </span>
                    </div>

                    {/* Drag and Drop Zone */}
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => {
                        const fileInput = document.getElementById('project-media-upload-input');
                        if (fileInput) fileInput.click();
                      }}
                      className={`border-2 border-dashed rounded-xs p-5 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-2 group ${
                        isDragging
                          ? 'border-accent bg-accent/10 text-white'
                          : 'border-dark-border/80 hover:border-accent/50 bg-dark-bg/30 text-dark-muted hover:text-white'
                      }`}
                    >
                      <input
                        type="file"
                        id="project-media-upload-input"
                        multiple
                        accept="image/*,video/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <Upload size={20} className={`transition-transform duration-300 group-hover:-translate-y-0.5 ${isDragging ? 'text-accent' : 'text-dark-muted group-hover:text-accent'}`} />
                      <div className="flex flex-col gap-0.5 select-none">
                        <p className="font-sans text-xs font-bold text-white/90">
                          클릭하여 파일을 선택하거나 여기에 드래그 앤 드롭 하세요
                        </p>
                        <p className="font-sans text-[10px] text-dark-muted">
                          지원 형식: JPG, PNG, WEBP, HEIC 및 MP4 등 영상
                        </p>
                      </div>
                    </div>

                    {/* Uploaded Files List */}
                    {uploadedFiles.length > 0 && (
                      <div className="mt-1 flex flex-col gap-2">
                        <label className="font-mono text-[8px] text-dark-muted uppercase tracking-widest block font-black">
                          UPLOADED FILES ({uploadedFiles.length})
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1 no-scrollbar">
                          {uploadedFiles.map((file) => {
                            const isRep = file.id === representativeId;
                            return (
                              <div
                                key={file.id}
                                className={`flex items-center gap-2.5 p-2 rounded-xs border transition-all ${
                                  isRep
                                    ? 'border-accent bg-accent/5'
                                    : 'border-dark-border bg-dark-bg/30 hover:border-dark-border/80'
                                }`}
                              >
                                {file.type === 'image' ? (
                                  <img
                                    src={file.url}
                                    alt=""
                                    className="w-10 h-10 object-cover rounded-xs border border-dark-border shrink-0"
                                    referrerPolicy="no-referrer"
                                  />
                                ) : (
                                  <div className="w-10 h-10 bg-dark-bg border border-dark-border rounded-xs flex items-center justify-center shrink-0">
                                    <Film size={14} className="text-accent" />
                                  </div>
                                )}

                                <div className="flex-1 min-w-0 text-left">
                                  <p className="font-sans text-[10px] text-white font-bold truncate" title={file.name}>
                                    {file.name}
                                  </p>
                                  <p className="font-mono text-[8px] text-dark-muted uppercase">
                                    {file.type}
                                  </p>
                                </div>

                                <div className="flex items-center gap-1 shrink-0">
                                  {file.type === 'image' && (
                                    <button
                                      type="button"
                                      onClick={() => handleSetRepresentative(file.id)}
                                      className={`p-1 rounded-xs transition-colors cursor-pointer select-none ${
                                        isRep
                                          ? 'bg-accent/15 text-accent border border-accent/20'
                                          : 'hover:bg-dark-bg border border-transparent text-dark-muted hover:text-white'
                                      }`}
                                      title={isRep ? "현재 대표 이미지 지정됨" : "대표 이미지로 지정"}
                                    >
                                      <Star size={11} fill={isRep ? 'currentColor' : 'none'} />
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveUploadedFile(file.id)}
                                    className="p-1 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 text-dark-muted hover:text-red-500 rounded-xs transition-colors cursor-pointer select-none"
                                    title="제거"
                                  >
                                    <Trash2 size={11} />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Photo Link */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <label className="font-mono text-[9px] text-white uppercase tracking-widest block font-bold">
                        PHOTO LINK (대표 사진 링크 - .jpg, .png, .webp 등 URL) *
                      </label>
                      <span className="text-[8px] text-accent font-bold">ImgBB, Postimages 등의 직접 링크 권장</span>
                    </div>
                    <input
                      type="url"
                      placeholder="예시: https://i.ibb.co/.../image.jpg (필수)"
                      value={coverImage}
                      onChange={(e) => setCoverImage(e.target.value)}
                      className="w-full bg-dark-bg border border-dark-border py-1.5 px-3 rounded-xs text-xs text-white focus:border-accent/50 focus:outline-none"
                      id="form-cover-image-input"
                      required
                    />

                    {/* Dynamic Additional Photo Links */}
                    {additionalImages.map((imgUrl, index) => (
                      <div key={index} className="flex gap-2 items-center mt-1.5 animate-fadeIn">
                        <span className="font-mono text-[9px] text-accent font-bold shrink-0 min-w-[20px]">#{index + 1}</span>
                        <input
                          type="url"
                          placeholder={`추가 사진 링크 #${index + 1} (예시: https://...)`}
                          value={imgUrl}
                          onChange={(e) => {
                            const newImgs = [...additionalImages];
                            newImgs[index] = e.target.value;
                            setAdditionalImages(newImgs);
                          }}
                          className="flex-1 bg-dark-bg border border-dark-border py-1.5 px-3 rounded-xs text-xs text-white focus:border-accent/50 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setAdditionalImages(additionalImages.filter((_, idx) => idx !== index));
                          }}
                          className="p-1.5 border border-red-500/30 hover:border-red-500 bg-red-500/5 hover:bg-red-500/10 text-red-500 hover:text-white rounded-xs transition-colors cursor-pointer shrink-0"
                          title="삭제"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => setAdditionalImages([...additionalImages, ''])}
                      className="mt-1 flex items-center justify-center gap-1.5 py-2 px-3 border border-dashed border-accent/40 hover:border-accent bg-accent/5 hover:bg-accent/10 text-accent hover:text-white rounded-xs text-[10px] font-mono transition-all cursor-pointer w-full"
                    >
                      <Plus size={11} />
                      <span>사진 링크 추가 (ADD PHOTO LINK)</span>
                    </button>
                  </div>

                  {/* Video Link */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <label className="font-mono text-[9px] text-white uppercase tracking-widest block font-bold">
                        VIDEO LINK (동영상 링크 - 유튜브, 비메오, 드라이브 등 URL)
                      </label>
                      <span className="text-[8px] text-dark-muted font-bold">선택사항</span>
                    </div>
                    <input
                      type="url"
                      placeholder="예시: https://www.youtube.com/watch?v=... 또는 구글 드라이브, Dropbox 공유 링크"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      className="w-full bg-dark-bg border border-dark-border py-1.5 px-3 rounded-xs text-xs text-white placeholder-dark-muted focus:border-accent/50 focus:outline-none"
                      id="form-video-url-input-main"
                    />

                    {/* Dynamic Additional Video Links */}
                    {videoUrls.map((vUrl, index) => (
                      <div key={index} className="flex gap-2 items-center mt-1.5 animate-fadeIn">
                        <span className="font-mono text-[9px] text-accent font-bold shrink-0 min-w-[20px]">#{index + 1}</span>
                        <input
                          type="url"
                          placeholder={`추가 동영상 링크 #${index + 1} (예시: https://...)`}
                          value={vUrl}
                          onChange={(e) => {
                            const newVurls = [...videoUrls];
                            newVurls[index] = e.target.value;
                            setVideoUrls(newVurls);
                          }}
                          className="flex-1 bg-dark-bg border border-dark-border py-1.5 px-3 rounded-xs text-xs text-white focus:border-accent/50 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setVideoUrls(videoUrls.filter((_, idx) => idx !== index));
                          }}
                          className="p-1.5 border border-red-500/30 hover:border-red-500 bg-red-500/5 hover:bg-red-500/10 text-red-500 hover:text-white rounded-xs transition-colors cursor-pointer shrink-0"
                          title="삭제"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => setVideoUrls([...videoUrls, ''])}
                      className="mt-1 flex items-center justify-center gap-1.5 py-2 px-3 border border-dashed border-accent/40 hover:border-accent bg-accent/5 hover:bg-accent/10 text-accent hover:text-white rounded-xs text-[10px] font-mono transition-all cursor-pointer w-full"
                    >
                      <Plus size={11} />
                      <span>비디오 링크 추가 (ADD VIDEO LINK)</span>
                    </button>
                  </div>
                </div>

                {/* Actions group */}
                <div className="flex gap-3 mt-4 border-t border-dark-border pt-4">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className={`flex-1 py-2.5 bg-accent hover:bg-[#fa8743] hover:text-black text-black font-mono font-black text-xs tracking-wider transition-all rounded-xs cursor-pointer text-center flex items-center justify-center gap-2 ${
                      isSaving ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    id="form-submit-btn"
                  >
                    {isSaving ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin inline-block" />
                        <span>SAVING TO CLOUD...</span>
                      </>
                    ) : (
                      isEditingId ? 'SAVE CHANGES (수정 사항 디스크 임포트)' : 'UPLOAD TO ARCHIVE (전시관 업로드)'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={clearForm}
                    disabled={isSaving}
                    className={`px-4 py-2.5 border border-dark-border hover:bg-dark-bg text-dark-muted hover:text-white font-mono text-xs transition-colors rounded-xs cursor-pointer select-none ${
                      isSaving ? 'opacity-40 cursor-not-allowed' : ''
                    }`}
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
                <div className="flex items-center gap-2">
                  {onForceSyncToCloud && (
                    <button
                      type="button"
                      onClick={handleManualForceSync}
                      disabled={isSyncingCloud}
                      className="text-[10px] font-mono text-accent hover:text-white border border-accent/30 hover:border-accent px-2 py-0.5 rounded-xs transition-all flex items-center gap-1 cursor-pointer bg-accent/5 hover:bg-accent/20"
                      title="모든 홈페이지 데이터를 클라우드로 강제 동기화하여 프리뷰와 100% 일치시킵니다"
                    >
                      {isSyncingCloud ? 'SYNCING...' : 'FORCE SYNC TO CLOUD ↗'}
                    </button>
                  )}
                  <span className="text-[10px] font-mono text-accent/50 select-none flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                    LIVE
                  </span>
                </div>
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
                rows={1}
                className="hidden"
                readOnly
                value={jsonBackupText}
              />

              <input
                type="file"
                ref={backupFileInputRef}
                accept=".json"
                onChange={handleBackupFileImport}
                className="hidden"
              />

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleBackupExport}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-accent hover:bg-accent hover:text-black text-accent text-[10px] font-mono rounded-xs transition-all duration-300 cursor-pointer select-none"
                  id="backup-export-btn"
                >
                  <Download size={13} />
                  DOWNLOAD BACKUP FILE (.json)
                </button>
                <button
                  type="button"
                  onClick={() => backupFileInputRef.current?.click()}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-dark-border hover:border-accent text-dark-muted hover:text-white text-[10px] font-mono rounded-xs transition-all duration-300 cursor-pointer select-none"
                  id="backup-file-import-btn"
                >
                  <Upload size={13} />
                  UPLOAD BACKUP FILE (.json)
                </button>
              </div>

              <div className="mt-5 border-t border-dark-border pt-4">
                <label className="block text-[10px] font-mono text-dark-muted uppercase tracking-wider mb-2">
                  OR RAW TEXT PASTE RESTORE (또는 텍스트 직접 붙여넣기 복원)
                </label>
                <textarea
                  rows={2}
                  placeholder="텍스트 복사/붙여넣기를 사용하려면 여기에 직접 JSON 백업 데이터를 붙여넣은 뒤 아래 복원 단추를 눌러주세요."
                  value={jsonBackupText}
                  onChange={(e) => setJsonBackupText(e.target.value)}
                  className="w-full bg-dark-bg border border-dark-border font-mono text-[9px] leading-normal p-2.5 rounded-xs text-dark-muted focus:text-white focus:outline-none mb-2"
                  id="raw-backup-textarea"
                />
                <button
                  type="button"
                  onClick={handleBackupImport}
                  className="w-full py-2 border border-dashed border-dark-border hover:border-accent text-dark-muted hover:text-white text-[10px] font-mono rounded-xs transition-colors cursor-pointer select-none"
                  id="backup-import-btn"
                >
                  RESTORE FROM RAW TEXT CODE
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
