import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Project, CategoryFilter } from '../types';
import { Lock, Unlock, Plus, Trash2, Edit2, Download, Upload, RotateCcw, AlertTriangle, FileText, Check, ArrowRight } from 'lucide-react';

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

  // Raw JSON Backup state
  const [jsonBackupText, setJsonBackupText] = useState('');
  const [backupSuccessMsg, setBackupSuccessMsg] = useState('');

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
    if (passwordInput === '1111') {
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
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !client || !coverImage) {
      alert('프로젝트명, 클라이언트명, 대표 이미지 URL은 필수 정보입니다.');
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

    const cleanedAddImages = additionalImagesRaw
      .split(',')
      .map((i) => i.trim())
      .filter((i) => i.length > 0);

    const projectData: Project = {
      id: isEditingId || 'p_' + Date.now(),
      title,
      client,
      period: period || '진행 중',
      scope: cleanedScope.length > 0 ? cleanedScope : ['촬영', '보정'],
      category,
      tools: cleanedTools.length > 0 ? cleanedTools : ['Camera', 'Photoshop'],
      description: description || '등록된 프로젝트 세부 설명이 없습니다.',
      coverImage,
      additionalImages: cleanedAddImages,
      videoUrl: videoUrl || undefined,
      featured
    };

    if (isEditingId) {
      onUpdateProject(projectData);
    } else {
      onAddProject(projectData);
    }
    clearForm();
    alert(isEditingId ? '성공적으로 수정 완료되었습니다.' : '신규 프로젝트가 아카이브에 성공적으로 업로드되었습니다.');
  };

  const handleBackupExport = () => {
    const rawData = JSON.stringify(projects, null, 2);
    setJsonBackupText(rawData);
    setBackupSuccessMsg('현재 아카이브 리스트가 JSON 데이터로 변환되어 아래 텍스트창에 로딩되었습니다. 복사하여 소중히 보관하실 수 있습니다.');
  };

  const handleBackupImport = () => {
    if (!jsonBackupText.trim()) {
      alert('입력창에 복원할 JSON 데이터를 붙여넣어 주세요.');
      return;
    }
    try {
      const parsed = JSON.parse(jsonBackupText);
      if (Array.isArray(parsed) && parsed.every(p => p.id && p.title && p.client)) {
        onImportBackup(parsed);
        setJsonBackupText('');
        setBackupSuccessMsg('성공적으로 로컬 아카이브 데이터베이스가 갱신 및 백업으로부터 동기화되었습니다!');
      } else {
        alert('올바른 포트폴리오 스키마 배열 형식이 아닙니다.');
      }
    } catch (e) {
      alert('JSON 문법 오류가 발견되었습니다. 서식을 다시 확인하여 주세요.');
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

          <h3 className="font-syne text-lg font-black text-white tracking-widest uppercase mb-1">
            ARCHIVIST WORKSPACE
          </h3>
          <p className="font-outfit text-[11px] text-dark-muted tracking-wider uppercase mb-8">
            자료 관리국 및 가도 조정 제어반 [1111]
          </p>

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
    <section className="py-24 px-6 md:px-12 bg-dark-bg border-t border-dark-border" id="admin-panel-unlocked">
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
              김장섭(Orange) 크리에이터의 포트폴리오를 주체적이고 역동적으로 관리하는 CMS 영역입니다. (자동 임시 보존 처리됨)
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={onResetToDefault}
              className="flex items-center gap-1.5 p-2 px-3 border border-dark-border hover:border-red-500/20 hover:text-red-400 bg-dark-card/50 text-[10px] font-mono text-dark-muted rounded-xs transition-colors cursor-pointer select-none"
              id="admin-reset-to-defaults-btn"
            >
              <RotateCcw size={11} />
              <span>[RESET TO CORE SAMPLES]</span>
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

                {/* Cover Image URL */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-mono text-[9px] text-dark-muted uppercase tracking-widest block">
                      REPRESENT IMAGE URL (대표 썸네일 이미지 URL) *
                    </label>
                    <span className="text-[8px] text-accent font-bold">임시 이미지 퀵 로드 지원</span>
                  </div>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    required
                    className="w-full bg-dark-bg border border-dark-border py-1.5 px-3 rounded-xs text-xs text-white focus:border-accent/50 focus:outline-none"
                    id="form-cover-image-input"
                  />
                  
                  {/* Quick Preset Selector */}
                  <div className="mt-2 p-3 bg-dark-bg border border-dark-border rounded-xs">
                    <span className="font-mono text-[8px] text-dark-muted uppercase tracking-wider block mb-1.5">
                      [ DESIGN TOOLKIT // HIGH-QUALITY CINEMATIC PLACEHOLDERS ]
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {presets.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleApplyPresetImage(preset.url)}
                          className="px-2 py-1 text-[9px] font-outfit text-white hover:text-accent bg-dark-card border border-dark-border hover:border-accent/40 rounded-sm cursor-pointer transition-colors"
                          id={`preset-img-btn-${idx}`}
                        >
                          {preset.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Additional Images (Comma separated) */}
                <div>
                  <label className="font-mono text-[9px] text-dark-muted uppercase tracking-widest block mb-1">
                    ADDITIONAL PORTFOLIO IMAGES (추가 갤러리 이미지 URL - 쉼표 구분)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="추가적으로 고화질 상세 뷰에 띄울 Unsplash 등의 이미지들을 쉼표(,) 혹은 한 줄 단위로 기술해 둡니다."
                    value={additionalImagesRaw}
                    onChange={(e) => setAdditionalImagesRaw(e.target.value)}
                    className="w-full bg-dark-bg border border-dark-border py-2 px-3 rounded-xs text-xs text-white placeholder-dark-muted focus:border-accent/50 focus:outline-none"
                    id="form-additional-images-textarea"
                  />
                </div>

                {/* Video Embed Link */}
                <div>
                  <label className="font-mono text-[9px] text-dark-muted uppercase tracking-widest block mb-1">
                    VIDEO EMBED COMPONENT URL (상세 페이지 삽입용 플레이어 영상 URL - 유튜브/비메오 Embed)
                  </label>
                  <input
                    type="url"
                    placeholder="예시: https://www.youtube.com/embed/dQw4w9WgXcQ"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="w-full bg-dark-bg border border-dark-border py-1.5 px-3 rounded-xs text-xs text-white focus:border-accent/50 focus:outline-none"
                    id="form-video-url-input"
                  />
                  <p className="font-mono text-[9px] text-dark-muted mt-1 leading-relaxed text-[8px]">
                    ※ 반드시 "/embed/" 스키마가 들어있는 Iframe용 플레이어 전송 소스를 추가하여 주십시오.
                  </p>
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
                        <button
                          onClick={() => startEdit(p)}
                          className="p-1.5 border border-dark-border hover:border-accent/35 text-dark-muted hover:text-accent bg-dark-card rounded-xs transition-colors cursor-pointer select-none"
                          title="프로젝트 수정"
                          id={`edit-item-btn-${p.id}`}
                        >
                          <Edit2 size={11} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`"${p.title}" 프로젝트를 전시관 및 로컬 캐시 데이터베이스에서 영구 삭제하시겠습니까?`)) {
                              onDeleteProject(p.id);
                            }
                          }}
                          className="p-1.5 border border-dark-border hover:border-red-500/35 text-dark-muted hover:text-red-400 bg-dark-card rounded-xs transition-colors cursor-pointer select-none"
                          title="영구 삭제"
                          id={`delete-item-btn-${p.id}`}
                        >
                          <Trash2 size={11} />
                        </button>
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
