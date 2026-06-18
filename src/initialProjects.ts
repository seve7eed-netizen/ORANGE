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
  }
];
