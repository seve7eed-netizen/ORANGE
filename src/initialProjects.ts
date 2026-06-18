import { Project, ServiceDetail } from './types';

export const initialProjects: Project[] = [
  {
    id: 'p1',
    title: 'Silent Resonance (고요한 조명)',
    client: 'AETHER Studio',
    period: '2026.01 - 2026.02',
    scope: ['영상 촬영', '현장 연출', '컬러 그레이딩', '종합 편집'],
    description: '도시의 정적과 밤의 호흡, 그리고 어둠 속에서 드러나는 인공적인 빛의 불완전한 움직임을 시각화한 미니멀 필름 프로젝트입니다. 아나모픽 렌즈의 독특한 플레어 기법과 초정밀 오디오 레코딩을 통해, 한 편의 고요하고 평온한 시적 전시관 같은 분위기를 이끌어냈습니다. 저조도 콘트라스트를 극대화한 다빈치 리졸브 그레이딩으로 완성되었습니다.',
    tools: ['Sony FX-3 Cine', 'Anamorphic 35mm', 'DaVinci Resolve Studio', 'Premiere Pro'],
    coverImage: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=1200',
    additionalImages: [
      'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=800'
    ],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    category: 'videography',
    featured: true
  },
  {
    id: 'p2',
    title: 'The Light Path (빛의 잔상)',
    client: 'SÉANCE Magazine',
    period: '2026.03',
    scope: ['사진 촬영', '스튜디오 조명 설계', '사진 정밀 보정'],
    description: '빛과 의상이 상호 작용하는 순간적인 구도를 포획한 하이패션 인물 화보집입니다. 인물의 기하학적 포지셔닝에 일방향 스트로브 광을 결합하여, 실크 패브릭 특유의 질감과 피부 결의 미세한 온도를 보존하는 정교무비한 리터칭을 적용했습니다. 하셀블라드의 중형 센서 깊이감을 최대한 살린 아트웍입니다.',
    tools: ['Hasselblad X2D 100C', 'Profoto D2 Duos', 'Lightroom Classic', 'Photoshop CC'],
    coverImage: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=1200',
    additionalImages: [
      'https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800'
    ],
    category: 'photography',
    featured: true
  },
  {
    id: 'p3',
    title: 'Echoes of Silence (음악 필름)',
    client: 'LUNA Collective',
    period: '2025.11 - 2025.12',
    scope: ['영상 전체 편집', '리듬 몬타주', '사운드 디자인', '필름 이펙트'],
    description: '리듬의 미세조정에 초점을 맞춘 내러티브 패스트 컷 편집 프로젝트입니다. 아티스트의 고독한 발걸음과 악기 선율의 데시벨에 맞춰 컷을 극단적이고 과감하게 중첩시키는 몬타주 기법을 메인으로 차용했습니다. 정밀한 폴리 사운드 조작으로 시각에서 청각적 온도를 생생하게 느낄 수 있도록 조율했습니다.',
    tools: ['Adobe Premiere Pro CC', 'After Effects', 'ProTools Studio'],
    coverImage: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&q=80&w=1200',
    additionalImages: [
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1543536448-d209d2d13a1c?auto=format&fit=crop&q=80&w=800'
    ],
    videoUrl: 'https://www.youtube.com/embed/377gJ0K9Fbg',
    category: 'editing',
    featured: true
  },
  {
    id: 'p4',
    title: 'Monolith Redux (건축 파인아트)',
    client: 'Studio K Architects',
    period: '2026.02',
    scope: ['사진 톤 보정', '투시 기하 왜곡 수정', '디지털 파인아트 리터칭'],
    description: '초현대주의 건축물이 가진 압도적인 질감과 완벽한 선의 미학을 전례 없이 깊고 서늘한 회색조로 보정한 리터칭 작업입니다. 캡쳐 원의 픽셀 전용 스케일에서부터 포토샵 마스킹 레이어를 수십 층 레이어링하여 대칭을 맞추고, 하늘의 콘트라스트를 정형화하여 차갑고 묵직한 거석 고유의 무게감을 묘사했습니다.',
    tools: ['Capture One Studio', 'Adobe Photoshop', 'Wacom Intuos Pro'],
    coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200',
    additionalImages: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800'
    ],
    category: 'retouching',
    featured: false
  },
  {
    id: 'p5',
    title: 'Crafted Hands (세대의 기록 장인)',
    client: 'D&C Leather Federation',
    period: '2026.04',
    scope: ['다큐멘터리 촬영', '조명 지휘', '장인 인터뷰 테이킹', '컷 편집'],
    description: '수십 년간 침묵 속에 자신만의 가죽 제작 가도를 달려온 명장의 섬세하고도 강인한 육체적 손짓을 다큐멘터리 구도로 수집했습니다. 현장 소음(가죽이 문질러지는 소리, 가위 날의 쇠 소리 등)을 초정지 윈드스크린 마이크로 수렴하고, 거친 작업대 칼자국 하나하나에 자연스러운 명암비와 깊은 오렌지빛 시네마틱 톤을 정립했습니다.',
    tools: ['RED Komodo 6K', 'Zeiss CP3 Prime Lenses', 'DaVinci Resolve', 'Adobe Premiere'],
    coverImage: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=1200',
    additionalImages: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800'
    ],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    category: 'videography',
    featured: false
  },
  {
    id: 'p6',
    title: 'Neon Kinetic (네온 키네틱 패션필름)',
    client: 'VERGE Seoul',
    period: '2026.05 - 2026.06',
    scope: ['브랜드 필름 편집', '사운드 큐레이팅', '네온 톤 색채 그레이딩'],
    description: '사이버펑크 무드의 네온 조명이 번뜩이는 서울의 화려한 밤거리를 캔버스로 하여, 버츄얼 크리에이터와의 협업 패션 필름을 연출한 후반 에디팅 프로젝트입니다. 순간적인 글리치 이펙트, 입체적인 플래시백 전환, 심장 박동에 맞춘 다이내믹한 템포 조정을 통해, 초감각적이고 세련된 아방가르드 아카이브를 완성했습니다.',
    tools: ['Adobe After Effects', 'Premiere Pro', 'DaVinci Resolve Studio', 'Boris FX Continuum'],
    coverImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1200',
    additionalImages: [
      'https://images.unsplash.com/photo-1543536448-d209d2d13a1c?auto=format&fit=crop&q=80&w=800'
    ],
    videoUrl: 'https://www.youtube.com/embed/377gJ0K9Fbg',
    category: 'editing',
    featured: false
  }
];

export const services: ServiceDetail[] = [
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
  },
  {
    id: 's3',
    title: '영상 편집',
    englishTitle: 'POST-PRODUCTION EDITING',
    description: '프레임 단위의 타이밍 절삭과 청각적인 사운드 조작을 극단적으로 동기화하여 완결성 높은 몰입을 구현합니다. 서사의 속도를 매혹적으로 연출하며, 필름 이펙트와 타이포 무브먼트를 심도 있게 배열합니다.',
    capabilities: ['타이밍 오리엔티드 매치컷', '필름 이펙추얼 디자인', '오디오 폴리 사운드 메이킹', '시네마틱 컬러 조율']
  },
  {
    id: 's4',
    title: '사진 보정',
    englishTitle: 'FINE-ART RETOUCHING',
    description: '엄격한 하이엔드 픽셀 조율을 바탕으로 하는 하이엔드 보정 솔루션입니다. 렌즈 수차 왜곡을 완벽에 수렴하게 환원하고 피부 질감 본연의 결과 섬세한 섀도 색감을 다채롭게 가공하여 기조를 유지시킵니다.',
    capabilities: ['상업 인물 정밀 스킨 리터칭', '건축물 고정 수차 리덕션', '중형 센서 디테일 레벨 강화', '톤 보정 & 시안 제작']
  }
];
