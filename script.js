// ORANGE Portfolio Exhibition Archive - Core Data & Logic

// Initial fallback projects data
const defaultProjects = [
  {
    "id": "p_1782547146284",
    "title": "VACIA",
    "client": "VACIA",
    "period": "진행 중",
    "scope": ["촬영", "보정"],
    "category": "photography",
    "tools": ["Camera", "Photoshop"],
    "description": "기하학적 공간 분석과 프리미엄 자연광을 활용한 고대비 상업 룩북 프로젝트입니다. 정형화되지 않은 앵글을 통해 인물의 깊이와 고유 분위기를 섬세하게 아카이빙했습니다.",
    "coverImage": "https://i.ibb.co/DD6ctx7Q/DSC00045.png",
    "additionalImages": [
      "https://i.ibb.co/MxwGkN5p/6.jpg",
      "https://i.ibb.co/G486QTyW/10.jpg",
      "https://i.ibb.co/HLyNf9jJ/14.jpg",
      "https://i.ibb.co/sJ19GPMd/18.jpg",
      "https://i.ibb.co/r2Hd9DfS/44.jpg",
      "https://i.ibb.co/jZj2chYP/DSC00003.png",
      "https://i.ibb.co/VWmQtJQL/DSC00004.png",
      "https://i.ibb.co/5WFmGB2z/DSC00005.png",
      "https://i.ibb.co/HpBbdvzh/5.jpg",
      "https://i.ibb.co/Wp6XCKw6/DSC00058.png",
      "https://i.ibb.co/YBsY4Py4/DSC00062.png",
      "https://i.ibb.co/0RTL0dsN/DSC05772.png",
      "https://i.ibb.co/TxYFZh09/DSC09960.png"
    ],
    "featured": true
  },
  {
    "id": "p_1782440226537",
    "title": "르꼬프 테니스 커머셜",
    "client": "개인 프로젝트",
    "period": "진행 중",
    "scope": ["촬영", "보정"],
    "category": "videography",
    "tools": ["Camera", "Photoshop"],
    "description": "역동적인 테니스 코트 위에서 빛과 인물의 유기적인 결합을 담은 고화질 무드 비디오 프로젝트입니다. 공간감과 고속 프레임을 조화롭게 설계하여 역동적인 찰나를 시네마틱하게 포착했습니다.",
    "coverImage": "https://i.ibb.co/67vm2vT5/3.png",
    "videoUrl": "https://www.youtube.com/watch?v=XUbz1-xlKuA",
    "videoUrls": ["https://www.youtube.com/watch?v=XUbz1-xlKuA"],
    "additionalImages": [],
    "featured": true
  },
  {
    "id": "p_1782545360872",
    "title": "여름",
    "client": "개인 프로젝트",
    "period": "진행 중",
    "scope": ["촬영", "보정"],
    "category": "videography",
    "tools": ["Camera", "Photoshop"],
    "description": "순수한 한여름의 정취와 푸르른 무드를 필름 질감과 깊이 있는 핸드헬드 구도로 포괄한 크리에이티브 아카이브 필름워크입니다.",
    "coverImage": "https://i.ibb.co/67vm2vT5/3.png",
    "videoUrl": "https://youtu.be/wlrqRL0PVA0",
    "videoUrls": ["https://youtu.be/wlrqRL0PVA0"],
    "additionalImages": [],
    "featured": false
  }
];

// Load from localStorage or use default projects
let projects = [];
try {
  const saved = localStorage.getItem('orange_archive_v2_portfolios');
  if (saved) {
    projects = JSON.parse(saved);
  }
} catch (e) {
  console.error("Local storage read failed, using defaults:", e);
}

if (!Array.isArray(projects) || projects.length === 0) {
  projects = [...defaultProjects];
  try {
    localStorage.setItem('orange_archive_v2_portfolios', JSON.stringify(projects));
  } catch (e) {
    console.error(e);
  }
}

// Global active filters and states
let currentTab = 'home'; // 'home', 'philosophy', 'gallery', 'admin'
let activeFilter = 'all'; // 'all', 'photography', 'videography'
let searchQuery = '';
let selectedProject = null;
let isAdminLoggedIn = false;
let isUploadingToImgBB = false;
let additionalImages = [];
let editingProjectId = null;

// Initial Admin Login state
try {
  isAdminLoggedIn = localStorage.getItem('orange_archive_v2_admin_logged_in') === 'true';
} catch (_) {
  isAdminLoggedIn = false;
}

// Init Function on Load
document.addEventListener('DOMContentLoaded', () => {
  initClock();
  initScrollListeners();
  renderProjects();
  initFormListeners();
  updateAuthUI();

  // If already logged in, show admin menu if it was active
  if (isAdminLoggedIn) {
    const adminTabBtn = document.getElementById('header-admin-btn');
    if (adminTabBtn) {
      adminTabBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-unlock"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>
        <span>WORKSPACE</span>
      `;
    }
  }

  // Handle URL hash navigation or defaults
  navigateToTab('home');

  // Trigger lucide icons loading
  if (window.lucide) {
    window.lucide.createIcons();
  }
});

// Real-Time Clock
function initClock() {
  const clockElement = document.getElementById('live-clock');
  const updateTime = () => {
    const now = new Date();
    if (clockElement) {
      clockElement.textContent = now.toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
    }
  };
  updateTime();
  setInterval(updateTime, 1000);
}

// Scroll and Navigation System
function initScrollListeners() {
  const header = document.querySelector('header');
  
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    
    // Header opacity and transparent styling logic based on scroll
    if (currentTab === 'home') {
      const headerOpacity = Math.min(scrollY / 180, 1);
      header.style.opacity = headerOpacity;
      if (scrollY < 12) {
        header.style.pointerEvents = 'none';
      } else {
        header.style.pointerEvents = 'auto';
      }
    } else {
      header.style.opacity = '1';
      header.style.pointerEvents = 'auto';
    }

    // Dynamic scroll menu updates
    if (currentTab !== 'admin') {
      const homeEl = document.getElementById('section-home');
      const philEl = document.getElementById('section-philosophy');
      const galleryEl = document.getElementById('section-gallery');

      if (homeEl && philEl && galleryEl) {
        const scrollPosition = window.scrollY + window.innerHeight * 0.4;
        const philTop = philEl.offsetTop;
        const galleryTop = galleryEl.offsetTop;

        let activeMenu = 'home';
        if (scrollPosition >= galleryTop) {
          activeMenu = 'gallery';
        } else if (scrollPosition >= philTop) {
          activeMenu = 'philosophy';
        }

        updateHeaderIndicator(activeMenu);
      }
    }
  });
}

function updateHeaderIndicator(tabId) {
  // Desktop
  document.querySelectorAll('nav button').forEach(btn => {
    btn.classList.remove('text-accent', 'font-extrabold');
    btn.classList.add('text-dark-muted');
  });
  const activeBtn = document.getElementById(`nav-${tabId}`);
  if (activeBtn) {
    activeBtn.classList.remove('text-dark-muted');
    activeBtn.classList.add('text-accent', 'font-extrabold');
  }

  // Mobile
  document.querySelectorAll('.mobile-nav-btn').forEach(btn => {
    btn.classList.remove('text-accent');
    btn.classList.add('text-dark-muted');
  });
  const activeMobileBtn = document.getElementById(`mobile-nav-${tabId}`);
  if (activeMobileBtn) {
    activeMobileBtn.classList.remove('text-dark-muted');
    activeMobileBtn.classList.add('text-accent');
  }
}

function navigateToTab(tabId) {
  currentTab = tabId;
  
  // Close mobile menus automatically
  const mobileMenu = document.getElementById('mobile-menu-dropdown');
  if (mobileMenu) mobileMenu.classList.add('hidden');

  updateHeaderIndicator(tabId);

  // Scroll logic for sections
  if (tabId === 'home') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else if (tabId === 'philosophy') {
    const philEl = document.getElementById('section-philosophy');
    if (philEl) philEl.scrollIntoView({ behavior: 'smooth' });
  } else if (tabId === 'gallery') {
    const galleryEl = document.getElementById('section-gallery');
    if (galleryEl) galleryEl.scrollIntoView({ behavior: 'smooth' });
  } else if (tabId === 'admin') {
    // Show Admin Panel Section & Hide others
    const mainSections = document.getElementById('main-sections-container');
    const adminSection = document.getElementById('admin-panel-section');
    if (mainSections) mainSections.classList.add('hidden');
    if (adminSection) adminSection.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'instant' });
    renderAdminProjectsList();
    return;
  }

  // Keep main sections visible and admin panel hidden
  const mainSections = document.getElementById('main-sections-container');
  const adminSection = document.getElementById('admin-panel-section');
  if (mainSections) mainSections.classList.remove('hidden');
  if (adminSection) adminSection.classList.add('hidden');
}

// Project Rendering
function renderProjects() {
  const gridContainer = document.getElementById('projects-grid');
  if (!gridContainer) return;

  const filtered = projects.filter(p => {
    const matchesCategory = activeFilter === 'all' || p.category === activeFilter;
    const matchesSearch = 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.tools && p.tools.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))) ||
      (p.scope && p.scope.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCategory && matchesSearch;
  });

  // Render display count
  const countSpan = document.getElementById('exhibition-count');
  if (countSpan) {
    countSpan.textContent = filtered.length;
  }

  if (filtered.length === 0) {
    gridContainer.innerHTML = `
      <div class="col-span-1 sm:col-span-2 lg:col-span-3 py-24 border border-dashed border-dark-border/60 rounded-sm text-center flex flex-col items-center justify-center max-w-lg mx-auto w-full px-6">
        <span class="text-lg md:text-xl text-dark-muted uppercase font-syne font-black mb-3">전시물이 존재하지 않습니다</span>
        <p class="font-outfit text-xs text-dark-muted max-w-xs leading-relaxed mb-4">
          일치하는 작품 자료가 없습니다. 검색어를 재확인하거나 초기화해 주세요.
        </p>
        <button onclick="resetFilters()" class="px-4 py-2 border border-accent text-accent font-mono text-[10px] tracking-wide font-black hover:bg-accent hover:text-black cursor-pointer transition-all duration-300 rounded-sm">
          RESET ALL SELECTIONS
        </button>
      </div>
    `;
    return;
  }

  gridContainer.innerHTML = filtered.map((project, index) => {
    const formattedIndex = String(index + 1).padStart(2, '0');
    const displayCategory = project.category === 'photography' ? '사진 촬영' : '영상 촬영';
    const periodStr = project.period || '진행 중';
    const featuredBadge = project.featured ? `<span class="absolute top-4 right-4 text-[9px] font-mono font-bold bg-accent text-black uppercase py-0.5 px-2 rounded-xs">FEATURED</span>` : '';
    
    // Tools list markup
    const toolsMarkup = (project.tools || []).slice(0, 3).map(t => `
      <span class="font-mono text-[9px] text-dark-muted bg-dark-card py-0.5 px-1.5 rounded-xs border border-dark-border">${t}</span>
    `).join('');

    const otherToolsCount = (project.tools || []).length > 3 ? `
      <span class="font-mono text-[9px] text-accent font-bold py-0.5 px-1.5">+${project.tools.length - 3} OTHER</span>
    ` : '';

    return `
      <div 
        onclick="openProjectDetail('${project.id}')"
        class="group relative cursor-pointer flex flex-col justify-between overflow-hidden border border-dark-border bg-dark-card/25 hover:border-accent/35 transition-all duration-300 rounded-sm hover:-translate-y-1 w-full"
        id="project-card-${project.id}"
      >
        <div class="relative aspect-video w-full overflow-hidden bg-dark-bg border-b border-dark-border">
          <img 
            src="${project.coverImage}" 
            alt="${project.title}" 
            referrerpolicy="no-referrer"
            class="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-dark-bg/80 via-transparent to-transparent opacity-60"></div>
          
          <!-- Hover Open Overlay -->
          <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div class="flex items-center gap-2 px-4 py-2 border border-accent/40 bg-accent-dim text-accent font-mono text-[11px] font-bold rounded-sm tracking-widest">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="animate-pulse"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0z"/><circle cx="12" cy="12" r="3"/></svg>
              <span>OPEN CABINET</span>
            </div>
          </div>

          <span class="absolute top-4 left-4 font-mono text-[9px] text-white/50 bg-dark-bg/80 backdrop-blur-xs py-0.5 px-2 border border-white/10 rounded-xs select-none">
            [ ${formattedIndex} ]
          </span>
          ${featuredBadge}
        </div>

        <div class="p-6 text-left">
          <div class="flex items-center justify-between mb-2">
            <span class="font-mono text-[9px] font-bold tracking-widest text-accent uppercase">
              ${project.category.toUpperCase()} // # ${displayCategory}
            </span>
            <div class="flex items-center gap-1.5 text-dark-muted font-mono text-[9px]">
              <svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
              <span>${periodStr}</span>
            </div>
          </div>

          <h3 class="font-outfit text-base font-bold text-white group-hover:text-accent transition-colors tracking-tight truncate mb-2">
            ${project.title}
          </h3>

          <p class="font-outfit text-xs text-dark-muted leading-relaxed font-light line-clamp-2 md:h-10">
            ${project.description}
          </p>

          <div class="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-dark-border/40">
            ${toolsMarkup}
            ${otherToolsCount}
          </div>
        </div>
      </div>
    `;
  });
  
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// Reset Filters
function resetFilters() {
  const searchInput = document.getElementById('gallery-search-input');
  if (searchInput) searchInput.value = '';
  searchQuery = '';
  setFilter('all');
}

function setFilter(filterVal) {
  activeFilter = filterVal;
  document.querySelectorAll('.filter-pill').forEach(btn => {
    btn.className = "filter-pill relative px-5 py-2.5 font-outfit text-xs font-semibold tracking-wider transition-colors outline-none cursor-pointer select-none whitespace-nowrap rounded-sm text-dark-muted hover:text-white";
    // remove active pill backgrounds
    const pillSpan = btn.querySelector('.pill-bg');
    if (pillSpan) pillSpan.remove();
  });

  const activeBtn = document.getElementById(`filter-tab-${filterVal}`);
  if (activeBtn) {
    activeBtn.className = "filter-pill relative px-5 py-2.5 font-outfit text-xs tracking-wider transition-colors outline-none cursor-pointer select-none whitespace-nowrap rounded-sm text-black font-extrabold";
    const bgSpan = document.createElement('span');
    bgSpan.className = "pill-bg absolute inset-0 bg-accent rounded-sm -z-10";
    activeBtn.appendChild(bgSpan);
  }

  renderProjects();
}

// Search Handling
function handleSearch(e) {
  searchQuery = e.target.value;
  renderProjects();
}

// Project Details Modal Handling
function openProjectDetail(projectId) {
  const project = projects.find(p => p.id === projectId);
  if (!project) return;

  selectedProject = project;

  const displayCategory = 
    project.category === 'photography' ? '사진 촬영 (Photography)' : '영상 촬영 (Videography)';

  // Build Metadata Log Spec sheet HTML
  const scopeMarkup = (project.scope || []).map(s => `
    <span class="px-2 py-0.5 text-[10px] font-outfit bg-dark-bg border border-dark-border text-dark-muted rounded-xs">${s}</span>
  `).join('');

  const toolsMarkup = (project.tools || []).map(t => `
    <span class="px-2 py-0.5 text-[10px] font-mono bg-accent-dim/20 border border-accent/20 text-accent rounded-xs font-medium">${t}</span>
  `).join('');

  // Video Section builder
  let videoMarkup = '';
  const allVideos = Array.from(new Set([
    ...(project.videoUrl ? [project.videoUrl] : []),
    ...(project.videoUrls || [])
  ]));

  if (allVideos.length > 0) {
    const videoFrames = allVideos.map((vUrl, index) => {
      const isEmbed = vUrl.includes('youtube.com') || vUrl.includes('youtu.be') || vUrl.includes('vimeo.com');
      let embedUrl = vUrl;
      
      // Basic youtube/vimeo parser
      if (vUrl.includes('youtube.com/watch?v=')) {
        const vid = vUrl.split('watch?v=')[1]?.split('&')[0];
        embedUrl = `https://www.youtube.com/embed/${vid}`;
      } else if (vUrl.includes('youtu.be/')) {
        const vid = vUrl.split('youtu.be/')[1]?.split('?')[0];
        embedUrl = `https://www.youtube.com/embed/${vid}`;
      }

      const counterStr = allVideos.length > 1 ? `<span class="font-mono text-[9px] text-accent font-black uppercase tracking-widest block mb-1">[ VIDEO #${index + 1} // 영상 #${index + 1} ]</span>` : '';

      return `
        <div class="flex flex-col gap-2 w-full">
          ${counterStr}
          <div class="relative aspect-video w-full overflow-hidden border border-dark-border bg-black rounded-sm shadow-inner group">
            ${isEmbed ? `
              <iframe src="${embedUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen class="w-full h-full"></iframe>
            ` : `
              <video src="${vUrl}" controls class="w-full h-full object-contain bg-black"></video>
            `}
            <div class="absolute bottom-2 right-2 px-2.5 py-1 bg-dark-bg/80 border border-dark-border text-[9px] font-mono text-dark-muted rounded-xs select-none pointer-events-none group-hover:text-accent group-hover:border-accent/40 transition-colors">
              ORANGE // STREAMING_TRACK #${index + 1}
            </div>
          </div>
        </div>
      `;
    }).join('');

    videoMarkup = `
      <div class="mb-12 text-left">
        <div class="flex items-center gap-2 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-accent"><polygon points="23 7 16 12 23 17 23 7"/><rect width="15" height="14" x="1" y="5" rx="2" ry="2"/></svg>
          <h4 class="font-syne text-xs text-white uppercase tracking-widest font-bold">PREMIUM VIDEO VIEW (프로젝트 영상)</h4>
        </div>
        <div class="flex flex-col gap-6">${videoFrames}</div>
      </div>
    `;
  }

  // Photo gallery builder
  const coverCard = `
    <div 
      class="group relative aspect-[4/3] overflow-hidden border border-dark-border bg-dark-bg rounded-sm cursor-zoom-in"
      onclick="zoomImage('${project.coverImage}')"
    >
      <img src="${project.coverImage}" alt="${project.title} cover" referrerpolicy="no-referrer" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" />
      <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-white bg-dark-bg/60 p-1 rounded-sm"><path d="m15 3 6 6M9 21l-6-6M21 3v6h-6M3 21v-6h6"/></svg>
      </div>
      <span class="absolute bottom-3 left-3 bg-dark-bg/80 border border-dark-border text-[8px] font-mono px-2 py-0.5 text-dark-muted rounded-xs">MAIN COVER</span>
    </div>
  `;

  const addCards = (project.additionalImages || []).map((img, idx) => `
    <div 
      class="group relative aspect-[4/3] overflow-hidden border border-dark-border bg-dark-bg rounded-sm cursor-zoom-in"
      onclick="zoomImage('${img}')"
    >
      <img src="${img}" alt="${project.title} supplemental ${idx + 1}" referrerpolicy="no-referrer" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" />
      <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-white bg-dark-bg/60 p-1 rounded-sm"><path d="m15 3 6 6M9 21l-6-6M21 3v6h-6M3 21v-6h6"/></svg>
      </div>
      <span class="absolute bottom-3 left-3 bg-dark-bg/80 border border-dark-border text-[8px] font-mono px-2 py-0.5 text-dark-muted rounded-xs">PLATE #0${idx + 1}</span>
    </div>
  `).join('');

  const photoMarkup = `
    <div class="border-t border-dark-border/40 pt-10 text-left">
      <div class="flex items-center gap-2 mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-accent"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
        <h4 class="font-syne text-xs text-white uppercase tracking-widest font-bold">PROJECT EXHIBITION CANVAS (전시 이미지)</h4>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        ${coverCard}
        ${addCards}
      </div>
    </div>
  `;

  // Put everything in the modal body template
  const detailBody = document.getElementById('project-detail-body');
  if (detailBody) {
    detailBody.innerHTML = `
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 mb-10">
        <!-- Left Title Overview Column -->
        <div class="lg:col-span-7 flex flex-col justify-start text-left">
          <span class="font-syne text-[10px] text-accent font-extrabold tracking-widest uppercase mb-1">${displayCategory}</span>
          <h2 class="font-syne text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight mb-6">${project.title}</h2>
          <div class="h-[1px] bg-dark-border/60 w-32 mb-6"></div>
          <h4 class="font-outfit text-xs text-accent font-semibold tracking-wider uppercase mb-3">// PROJECT OVERVIEW</h4>
          <p class="font-sans text-sm text-dark-text/90 leading-relaxed font-light whitespace-pre-line">${project.description}</p>
        </div>

        <!-- Right Spec Placard Column -->
        <div class="lg:col-span-5 bg-dark-card/40 border border-dark-border/80 p-6 rounded-sm flex flex-col gap-5 text-left h-fit self-start">
          <h4 class="font-mono text-[10px] text-dark-muted border-b border-dark-border/50 pb-2 uppercase tracking-widest font-black">[ METADATA SPEC SHEET ]</h4>
          
          <div class="grid grid-cols-3 gap-2">
            <div class="flex items-center gap-2 text-dark-muted font-mono text-[10px] uppercase">
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-accent"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <span>CLIENT_</span>
            </div>
            <div class="col-span-2 text-left font-outfit text-xs font-medium text-white">${project.client}</div>
          </div>

          <div class="grid grid-cols-3 gap-2 border-t border-dark-border/10 pt-4">
            <div class="flex items-center gap-2 text-dark-muted font-mono text-[10px] uppercase">
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-accent"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
              <span>TIMELINE_</span>
            </div>
            <div class="col-span-2 text-left font-outfit text-xs font-medium text-white">${project.period || '진행 중'}</div>
          </div>

          <div class="grid grid-cols-3 gap-2 border-t border-dark-border/10 pt-4">
            <div class="flex items-center gap-2 text-dark-muted font-mono text-[10px] uppercase">
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-accent"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
              <span>SCOPE_</span>
            </div>
            <div class="col-span-2 flex flex-wrap gap-1">${scopeMarkup}</div>
          </div>

          <div class="grid grid-cols-3 gap-2 border-t border-dark-border/10 pt-4">
            <div class="flex items-center gap-2 text-dark-muted font-mono text-[10px] uppercase">
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-accent"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
              <span>TOOLS_</span>
            </div>
            <div class="col-span-2 flex flex-wrap gap-1">${toolsMarkup}</div>
          </div>
        </div>
      </div>

      ${videoMarkup}
      ${photoMarkup}
    `;
    
    // Header specific metadata label
    const labelHeader = document.getElementById('project-detail-header-label');
    if (labelHeader) {
      labelHeader.textContent = `${project.category.toUpperCase()} // PROJECT INDEX`;
    }
  }

  // Open the modal by stripping hidden utilities
  const modalOverlay = document.getElementById('project-detail-overlay');
  if (modalOverlay) {
    modalOverlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function closeProjectDetail() {
  const modalOverlay = document.getElementById('project-detail-overlay');
  if (modalOverlay) {
    modalOverlay.classList.add('hidden');
    document.body.style.overflow = '';
  }
  selectedProject = null;
}

// Lightbox image zoom helper
function zoomImage(imgUrl) {
  const zoomImageEl = document.getElementById('zoomed-lightbox-img');
  if (zoomImageEl) {
    zoomImageEl.src = imgUrl;
  }
  const zoomOverlay = document.getElementById('lightbox-zoom-overlay');
  if (zoomOverlay) {
    zoomOverlay.classList.remove('hidden');
  }
}

function closeZoomImage() {
  const zoomOverlay = document.getElementById('lightbox-zoom-overlay');
  if (zoomOverlay) {
    zoomOverlay.classList.add('hidden');
  }
}

// Password verification gate handling
function openAdminAccess() {
  if (isAdminLoggedIn) {
    navigateToTab('admin');
  } else {
    const passwordModal = document.getElementById('password-gate-modal');
    if (passwordModal) {
      passwordModal.classList.remove('hidden');
      document.getElementById('gate-password-input').focus();
    }
  }
}

function closeAdminGate() {
  const passwordModal = document.getElementById('password-gate-modal');
  if (passwordModal) passwordModal.classList.add('hidden');
  document.getElementById('gate-password-input').value = '';
  document.getElementById('gate-password-error').classList.add('hidden');
}

function handlePasswordSubmit(e) {
  e.preventDefault();
  const passVal = document.getElementById('gate-password-input').value;
  if (passVal === '9764') {
    isAdminLoggedIn = true;
    try {
      localStorage.setItem('orange_archive_v2_admin_logged_in', 'true');
    } catch (_) {}
    closeAdminGate();
    updateAuthUI();
    navigateToTab('admin');
    showToast('관리자 인증이 성공적으로 완료되었습니다!', 'success');
  } else {
    document.getElementById('gate-password-error').classList.remove('hidden');
  }
}

function logoutAdmin() {
  isAdminLoggedIn = false;
  try {
    localStorage.setItem('orange_archive_v2_admin_logged_in', 'false');
  } catch (_) {}
  updateAuthUI();
  navigateToTab('home');
  showToast('안전하게 로그아웃 되었습니다.', 'info');
}

function updateAuthUI() {
  const authBtn = document.getElementById('header-admin-btn');
  const logoutBtn = document.getElementById('header-logout-btn');

  if (isAdminLoggedIn) {
    if (authBtn) {
      authBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-unlock"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>
        <span>WORKSPACE</span>
      `;
      authBtn.className = "flex items-center gap-2 px-3 py-1.5 rounded-sm border font-mono text-[10px] tracking-wider font-semibold cursor-pointer transition-all duration-300 group border-accent/40 bg-accent-dim text-accent hover:bg-accent hover:text-black";
    }
    if (logoutBtn) {
      logoutBtn.classList.remove('hidden');
    }
  } else {
    if (authBtn) {
      authBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-lock"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        <span>WORKSPACE</span>
      `;
      authBtn.className = "flex items-center gap-2 px-3 py-1.5 rounded-sm border font-mono text-[10px] tracking-wider font-semibold cursor-pointer transition-all duration-300 group border-dark-border bg-dark-card text-dark-muted hover:border-accent hover:text-accent";
    }
    if (logoutBtn) {
      logoutBtn.classList.add('hidden');
    }
  }

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// Toast System
function showToast(text, type = 'success') {
  const toastContainer = document.getElementById('toast-container');
  if (!toastContainer) return;

  const toastDiv = document.createElement('div');
  toastDiv.className = `flex items-center gap-2 px-4 py-3 border rounded-sm shadow-xl text-xs font-medium font-sans animate-fadeIn max-w-sm ${
    type === 'success' 
      ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-400' 
      : type === 'error' 
        ? 'bg-rose-950/20 border-rose-500/30 text-rose-400' 
        : 'bg-accent/10 border-accent/30 text-accent'
  }`;

  toastDiv.innerHTML = `
    <span>${text}</span>
  `;

  toastContainer.appendChild(toastDiv);

  // Automatically vanish
  setTimeout(() => {
    toastDiv.classList.add('opacity-0');
    setTimeout(() => {
      toastDiv.remove();
    }, 300);
  }, 3500);
}

// Admin Panel Dashboard rendering
function renderAdminProjectsList() {
  const adminList = document.getElementById('admin-projects-list-body');
  if (!adminList) return;

  if (projects.length === 0) {
    adminList.innerHTML = `
      <div class="text-center py-10 text-dark-muted font-sans text-xs">
        등록된 아카이브가 없습니다. 상단의 "신규 전시 등록" 단추를 눌러 첫 프로젝트를 개설하세요.
      </div>
    `;
    return;
  }

  adminList.innerHTML = projects.map((p, idx) => {
    const num = String(idx + 1).padStart(2, '0');
    const categoryName = p.category === 'photography' ? '사진' : '영상';
    const featuredTag = p.featured ? '<span class="px-1.5 py-0.5 text-[8px] bg-accent text-black font-bold font-mono rounded-xs shrink-0 select-none uppercase tracking-widest">[FEATURED]</span>' : '';

    return `
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-dark-border/60 bg-dark-bg/30 hover:bg-dark-bg/50 rounded-xs transition-colors text-left font-sans">
        <div class="flex items-center gap-3 min-w-0">
          <span class="font-mono text-[9px] text-accent/60 shrink-0 select-none">[ ${num} ]</span>
          <img src="${p.coverImage}" alt="${p.title}" referrerpolicy="no-referrer" class="w-10 h-10 object-cover border border-dark-border/80 rounded-xs shrink-0" />
          <div class="min-w-0 flex flex-col">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="font-bold text-xs text-white truncate">${p.title}</span>
              <span class="font-mono text-[8px] text-accent font-bold uppercase tracking-wider">[ ${categoryName} ]</span>
              ${featuredTag}
            </div>
            <span class="text-[10px] text-dark-muted mt-0.5 truncate">Client: ${p.client} | Period: ${p.period}</span>
          </div>
        </div>

        <div class="flex items-center gap-2 self-end sm:self-center">
          <button onclick="startEditProject('${p.id}')" class="px-2.5 py-1.5 border border-dark-border hover:border-accent text-dark-muted hover:text-accent font-mono text-[9px] font-bold rounded-xs tracking-wider transition-colors cursor-pointer select-none">
            [ EDIT // 편집 ]
          </button>
          <button onclick="triggerDeleteProject('${p.id}')" class="px-2.5 py-1.5 border border-red-500/20 hover:border-red-500 bg-red-500/5 hover:bg-red-500/10 text-red-500 hover:text-white font-mono text-[9px] font-bold rounded-xs tracking-wider transition-colors cursor-pointer select-none">
            [ DELETE // 삭제 × ]
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// ImgBB API Key caching
function getImgbbApiKey() {
  try {
    return localStorage.getItem('orange_archive_imgbb_key') || '';
  } catch (_) {
    return '';
  }
}

// Admin Panel Form Setup & Actions
function initFormListeners() {
  const keyInput = document.getElementById('form-imgbb-key');
  if (keyInput) {
    keyInput.value = getImgbbApiKey();
    keyInput.addEventListener('change', (e) => {
      try {
        localStorage.setItem('orange_archive_imgbb_key', e.target.value.trim());
        showToast('ImgBB API 키가 브라우저 기억장치에 동기화되었습니다.', 'success');
      } catch (_) {}
    });
  }
}

function startEditProject(projectId) {
  const p = projects.find(item => item.id === projectId);
  if (!p) return;

  editingProjectId = p.id;
  
  // Fill inputs
  document.getElementById('form-title').value = p.title || '';
  document.getElementById('form-client').value = p.client || '';
  document.getElementById('form-period').value = p.period || '';
  document.getElementById('form-scope').value = (p.scope || []).join(', ');
  document.getElementById('form-category').value = p.category || 'videography';
  document.getElementById('form-tools').value = (p.tools || []).join(', ');
  document.getElementById('form-description').value = p.description || '';
  document.getElementById('form-cover-image').value = p.coverImage || '';
  document.getElementById('form-video-url').value = p.videoUrl || '';
  document.getElementById('form-featured').checked = !!p.featured;

  // Additional images rendering
  additionalImages = [...(p.additionalImages || [])];
  renderAdditionalImagesList();

  // Change headers
  document.getElementById('form-section-header').textContent = '[ 📁 EDIT THE CABINET WORKPLACE // 프로젝트 수정 ]';
  document.getElementById('form-submit-btn').textContent = '[ UPDATE PROJECT // 작품 개정 등록 ]';

  // Toggle tabs automatically to show project editor
  showAdminTab('form');
}

function clearProjectForm() {
  editingProjectId = null;
  document.getElementById('form-title').value = '';
  document.getElementById('form-client').value = '';
  document.getElementById('form-period').value = '';
  document.getElementById('form-scope').value = '';
  document.getElementById('form-category').value = 'videography';
  document.getElementById('form-tools').value = '';
  document.getElementById('form-description').value = '';
  document.getElementById('form-cover-image').value = '';
  document.getElementById('form-video-url').value = '';
  document.getElementById('form-featured').checked = false;

  additionalImages = [];
  renderAdditionalImagesList();

  document.getElementById('form-section-header').textContent = '[ 📁 EXHIBITION ENTRY LOGS // 신규 전시 작품 등록 ]';
  document.getElementById('form-submit-btn').textContent = '[ BROADCAST ARCHIVE // 아카이브 전송 ]';
}

function showAdminTab(tabName) {
  const listPane = document.getElementById('admin-tab-list');
  const formPane = document.getElementById('admin-tab-form');
  const listBtn = document.getElementById('admin-btn-tab-list');
  const formBtn = document.getElementById('admin-btn-tab-form');

  if (tabName === 'list') {
    listPane.classList.remove('hidden');
    formPane.classList.add('hidden');
    listBtn.className = "flex items-center gap-1.5 px-4 py-2 border-b-2 border-accent text-accent font-mono text-[10px] font-black uppercase tracking-wider select-none cursor-pointer";
    formBtn.className = "flex items-center gap-1.5 px-4 py-2 border-b-2 border-transparent text-dark-muted font-mono text-[10px] font-medium uppercase tracking-wider select-none cursor-pointer hover:text-white";
    renderAdminProjectsList();
  } else {
    listPane.classList.add('hidden');
    formPane.classList.remove('hidden');
    formBtn.className = "flex items-center gap-1.5 px-4 py-2 border-b-2 border-accent text-accent font-mono text-[10px] font-black uppercase tracking-wider select-none cursor-pointer";
    listBtn.className = "flex items-center gap-1.5 px-4 py-2 border-b-2 border-transparent text-dark-muted font-mono text-[10px] font-medium uppercase tracking-wider select-none cursor-pointer hover:text-white";
  }
}

// Add a new link item to supplementary images list manually
function addSupplementaryImageInput() {
  additionalImages.push('');
  renderAdditionalImagesList();
}

function removeSupplementaryImage(index) {
  additionalImages = additionalImages.filter((_, idx) => idx !== index);
  renderAdditionalImagesList();
}

function setSupplementaryAsCover(index) {
  const targetUrl = additionalImages[index];
  if (!targetUrl) return;

  const currentCover = document.getElementById('form-cover-image').value.trim();
  document.getElementById('form-cover-image').value = targetUrl;

  if (currentCover) {
    additionalImages[index] = currentCover;
    showToast('대표 사진이 지정되었습니다. 기존 대표 사진은 추가 사진 목록으로 보존됩니다.', 'success');
  } else {
    additionalImages.splice(index, 1);
    showToast('대표 사진이 지정되었습니다.', 'success');
  }
  renderAdditionalImagesList();
}

function renderAdditionalImagesList() {
  const container = document.getElementById('additional-images-inputs-container');
  if (!container) return;

  if (additionalImages.length === 0) {
    container.innerHTML = `
      <div class="text-[9px] font-mono text-dark-muted py-2 text-center border border-dashed border-dark-border/40 bg-dark-bg/10 rounded-xs select-none">
        추가 등록된 세부 전시 사진이 없습니다.
      </div>
    `;
    return;
  }

  container.innerHTML = additionalImages.map((img, index) => {
    const previewBox = img && img.trim().startsWith('http') ? `
      <div class="flex items-center gap-3 mt-1.5 ml-7 p-1.5 bg-dark-bg/50 border border-dark-border/30 rounded-xs">
        <img src="${img.trim()}" alt="Supplementary image preview ${index + 1}" referrerpolicy="no-referrer" class="w-10 h-10 object-cover border border-dark-border/60 rounded-xs shrink-0" />
        <button type="button" onclick="setSupplementaryAsCover(${index})" class="px-2 py-1 bg-accent hover:bg-[#fa8743] text-black text-[8px] font-mono font-black rounded-xs tracking-wider uppercase transition-colors cursor-pointer">[ SET AS MAIN COVER // 대표 사진으로 지정 ]</button>
      </div>
    ` : '';

    return `
      <div class="flex flex-col gap-1.5 mt-2 p-2 bg-dark-bg/25 border border-dark-border/40 rounded-xs text-left">
        <div class="flex gap-2 items-center">
          <span class="font-mono text-[9px] text-accent font-bold shrink-0 min-w-[20px]">#${index + 1}</span>
          <input 
            type="url" 
            placeholder="추가 사진 링크 #${index + 1} (예시: https://...)" 
            value="${img}" 
            onchange="updateSupplementaryImageValue(${index}, this.value)"
            class="flex-grow bg-dark-bg border border-dark-border py-1.5 px-3 rounded-xs text-xs text-white focus:border-accent/50 focus:outline-none font-mono"
          />
          <button 
            type="button" 
            onclick="removeSupplementaryImage(${index})" 
            class="p-1.5 border border-red-500/30 hover:border-red-500 bg-red-500/5 hover:bg-red-500/10 text-red-500 hover:text-white rounded-xs transition-colors cursor-pointer shrink-0"
            title="삭제"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
          </button>
        </div>
        ${previewBox}
      </div>
    `;
  }).join('');
}

function updateSupplementaryImageValue(index, val) {
  additionalImages[index] = val.trim();
  renderAdditionalImagesList();
}

// Quick ImgBB multi-uploader
async function handleImgbbUploadClick() {
  const key = getImgbbApiKey();
  if (!key) {
    showToast('ImgBB API 키가 비어있습니다. 먼저 API Key를 등록하세요!', 'error');
    return;
  }
  document.getElementById('quick-imgbb-upload-input').click();
}

async function triggerImgbbMultiUpload(filesInput) {
  const files = filesInput.files;
  if (files.length === 0) return;

  const key = getImgbbApiKey();
  if (!key) {
    showToast('ImgBB API 키가 누락되었습니다. 등록해 주세요.', 'error');
    return;
  }

  isUploadingToImgBB = true;
  const progressText = document.getElementById('uploader-progress-text');
  if (progressText) {
    progressText.classList.remove('hidden');
    progressText.textContent = `0 / ${files.length} 전송 대기 중...`;
  }

  try {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (progressText) {
        progressText.textContent = `[${i + 1}/${files.length}] "${file.name}" 전송 중...`;
      }

      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const parsed = await res.json();
      if (parsed && parsed.success && parsed.data && parsed.data.url) {
        const uploadedUrl = parsed.data.url;
        
        // Push to additional images automatically or assign to cover if cover is blank
        const coverInput = document.getElementById('form-cover-image');
        if (!coverInput.value.trim()) {
          coverInput.value = uploadedUrl;
          showToast(`대표 사진으로 "${file.name}" 이미지가 지정되었습니다!`, 'success');
        } else {
          additionalImages.push(uploadedUrl);
          renderAdditionalImagesList();
          showToast(`추가 사진 #${additionalImages.length}에 "${file.name}"가 등록되었습니다.`, 'success');
        }
      } else {
        showToast(`"${file.name}" 업로드 에러: ${parsed?.error?.message || 'Unknown API Error'}`, 'error');
      }
    }
  } catch (err) {
    console.error('Multi uploader failure:', err);
    showToast('일부 혹은 전체 이미지 클라우드 전송에 실패했습니다.', 'error');
  } finally {
    isUploadingToImgBB = false;
    if (progressText) progressText.classList.add('hidden');
    filesInput.value = '';
  }
}

// Project Form Submission (CRUD Create / Update)
async function handleProjectFormSubmit(e) {
  e.preventDefault();

  const title = document.getElementById('form-title').value.trim();
  const client = document.getElementById('form-client').value.trim();
  const period = document.getElementById('form-period').value.trim();
  const scopeRaw = document.getElementById('form-scope').value.trim();
  const category = document.getElementById('form-category').value;
  const toolsRaw = document.getElementById('form-tools').value.trim();
  const description = document.getElementById('form-description').value.trim();
  const coverImage = document.getElementById('form-cover-image').value.trim();
  const videoUrl = document.getElementById('form-video-url').value.trim();
  const featured = document.getElementById('form-featured').checked;

  if (!title || !client || !coverImage) {
    showToast('프로젝트명, 클라이언트명, 대표 사진은 필수 입력 항목입니다.', 'error');
    return;
  }

  const cleanedScope = scopeRaw.split(',').map(s => s.trim()).filter(s => s.length > 0);
  const cleanedTools = toolsRaw.split(',').map(t => t.trim()).filter(t => t.length > 0);
  const cleanedAdditionals = additionalImages.map(img => img.trim()).filter(img => img.length > 0);
  const allVideoUrls = videoUrl ? [videoUrl] : [];

  const projectData = {
    id: editingProjectId || 'p_' + Date.now(),
    title,
    client,
    period: period || '진행 중',
    scope: cleanedScope.length > 0 ? cleanedScope : ['촬영', '보정'],
    category,
    tools: cleanedTools.length > 0 ? cleanedTools : ['Camera', 'Photoshop'],
    description: description || '등록된 프로젝트 세부 설명이 없습니다.',
    coverImage,
    additionalImages: cleanedAdditionals,
    videoUrl: videoUrl || undefined,
    videoUrls: allVideoUrls.length > 0 ? allVideoUrls : undefined,
    featured
  };

  if (editingProjectId) {
    // Update existing
    const idx = projects.findIndex(p => p.id === editingProjectId);
    if (idx !== -1) {
      projects[idx] = projectData;
      showToast('성공적으로 아카이브 수정이 반영되었습니다!', 'success');
    }
  } else {
    // Create new
    projects.push(projectData);
    showToast('성공적으로 신규 전시가 등록되었습니다!', 'success');
  }

  // Save to client browser storage
  saveProjectsToLocalStorage();

  // Try saving to backend file system so it locks into the downloaded ZIP!
  await syncProjectsToBackend();

  // Return to list and clear form
  clearProjectForm();
  showAdminTab('list');
  renderProjects();
}

// Delete project gate
let projectToDeleteId = null;
function triggerDeleteProject(projectId) {
  projectToDeleteId = projectId;
  const deleteOverlay = document.getElementById('delete-confirm-overlay');
  if (deleteOverlay) {
    deleteOverlay.classList.remove('hidden');
  }
}

function closeDeleteConfirm() {
  const deleteOverlay = document.getElementById('delete-confirm-overlay');
  if (deleteOverlay) {
    deleteOverlay.classList.add('hidden');
  }
  projectToDeleteId = null;
}

async function confirmDeleteProject() {
  if (!projectToDeleteId) return;

  projects = projects.filter(p => p.id !== projectToDeleteId);
  saveProjectsToLocalStorage();
  await syncProjectsToBackend();

  closeDeleteConfirm();
  renderAdminProjectsList();
  renderProjects();
  showToast('전시물이 아카이브에서 안전하게 영구 삭제되었습니다.', 'success');
}

// Backup / Import functions
async function handleDownloadWebsiteZip() {
  showToast('웹사이트 소스코드 압축 파일 생성 중...', 'info');
  try {
    if (typeof JSZip === 'undefined') {
      showToast('JSZip 라이브러리가 아직 로드되지 않았습니다. 잠시 후 다시 시도해 주세요.', 'error');
      return;
    }

    // 1. Fetch current index.html, style.css, and script.js from the server
    const [htmlRes, cssRes, jsRes] = await Promise.all([
      fetch('./index.html').then(r => r.text()),
      fetch('./style.css').then(r => r.text()),
      fetch('./script.js').then(r => r.text())
    ]);

    // 2. Initialize JSZip
    const zip = new JSZip();
    
    // Create the 'my-website' folder inside the ZIP file
    const rootFolder = zip.folder("my-website");
    
    // Add index.html, style.css, and script.js inside the my-website folder
    rootFolder.file("index.html", htmlRes);
    rootFolder.file("style.css", cssRes);
    rootFolder.file("script.js", jsRes);
    
    // Add empty assets directory inside my-website
    const assetsFolder = rootFolder.folder("assets");
    
    // Add a simple instructions/placeholder file inside assets
    assetsFolder.file("README_ASSETS.txt", "이 폴더(assets/)에 웹사이트에 사용될 이미지나 로고(logo.png, background.jpg 등)를 배치할 수 있습니다.\n");

    // 3. Generate the ZIP file blob asynchronously
    const content = await zip.generateAsync({ type: "blob" });
    
    // 4. Download the generated ZIP file
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(content);
    downloadLink.download = "my-website.zip";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    showToast('올바른 폴더 규격의 ZIP 다운로드가 완료되었습니다!', 'success');
  } catch (error) {
    console.error("Failed to generate code zip:", error);
    showToast('소스코드 ZIP 생성 및 다운로드에 실패했습니다.', 'error');
  }
}

function handleDownloadBackup() {
  try {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(projects, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `orange_archive_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('포트폴리오 백업 JSON 다운로드가 완료되었습니다!', 'success');
  } catch (err) {
    showToast('백업 다운로드 생성에 실패했습니다.', 'error');
  }
}

function triggerImportBackup() {
  document.getElementById('import-backup-file-input').click();
}

async function handleImportBackupFile(filesInput) {
  const file = filesInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      const parsed = JSON.parse(e.target.result);
      if (Array.isArray(parsed)) {
        projects = parsed;
        saveProjectsToLocalStorage();
        await syncProjectsToBackend();
        renderAdminProjectsList();
        renderProjects();
        showToast('성공적으로 백업본 포트폴리오들을 동기화하였습니다!', 'success');
      } else {
        showToast('유효하지 않은 백업 형식입니다. (배열 구조 필요)', 'error');
      }
    } catch (err) {
      showToast('백업 파일 로딩 및 분석에 실패했습니다.', 'error');
    } finally {
      filesInput.value = '';
    }
  };
  reader.readAsText(file);
}

function saveProjectsToLocalStorage() {
  try {
    localStorage.setItem('orange_archive_v2_portfolios', JSON.stringify(projects));
  } catch (err) {
    console.error('LocalStorage write failed:', err);
  }
}

// Synchronize projects directly back to `/script.js` so that unzipped code contains edits
async function syncProjectsToBackend() {
  try {
    const res = await fetch('/api/save-static-projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projects })
    });
    if (res.ok) {
      console.log('Successfully wrote active projects list to backend filesystem script.js');
    }
  } catch (err) {
    console.warn('Filesystem writing endpoint was offline, saved only in browser cache.', err);
  }
}

// Copy Code to Clipboard tool for easy local sync
function handleCopyStaticCode() {
  try {
    const jsonStr = JSON.stringify(projects, null, 2);
    const codeSnippet = `const initialProjects = ${jsonStr};`;
    navigator.clipboard.writeText(codeSnippet);
    showToast('프로젝트 배열 코드가 클립보드에 복사되었습니다!', 'success');
  } catch (e) {
    showToast('복사에 실패했습니다. 개발자 도구를 열어 로그를 확인하십시오.', 'error');
  }
}

// Expose functions globally to ensure inline HTML event handlers (onclick, onsubmit, onchange) work perfectly in Vite production builds
window.navigateToTab = navigateToTab;
window.openAdminAccess = openAdminAccess;
window.logoutAdmin = logoutAdmin;
window.setFilter = setFilter;
window.handleSearch = handleSearch;
window.showAdminTab = showAdminTab;
window.handleProjectFormSubmit = handleProjectFormSubmit;
window.addSupplementaryImageInput = addSupplementaryImageInput;
window.handleImgbbUploadClick = handleImgbbUploadClick;
window.triggerImgbbMultiUpload = triggerImgbbMultiUpload;
window.clearProjectForm = clearProjectForm;
window.handleDownloadWebsiteZip = handleDownloadWebsiteZip;
window.handleDownloadBackup = handleDownloadBackup;
window.triggerImportBackup = triggerImportBackup;
window.handleImportBackupFile = handleImportBackupFile;
window.handleCopyStaticCode = handleCopyStaticCode;
window.closeAdminGate = closeAdminGate;
window.handlePasswordSubmit = handlePasswordSubmit;
window.closeProjectDetail = closeProjectDetail;
window.closeZoomImage = closeZoomImage;
window.closeDeleteConfirm = closeDeleteConfirm;
window.confirmDeleteProject = confirmDeleteProject;
window.resetFilters = resetFilters;
window.openProjectDetail = openProjectDetail;
window.zoomImage = zoomImage;
window.startEditProject = startEditProject;
window.triggerDeleteProject = triggerDeleteProject;
window.setSupplementaryAsCover = setSupplementaryAsCover;
window.removeSupplementaryImage = removeSupplementaryImage;
