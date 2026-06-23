import { Project, ServiceDetail } from './types';

export const initialProjects: Project[] = [
  {
    id: 'p1',
    title: 'ECHOS OF ARCHITECTURE',
    client: 'SEUL DESIGN HOUSE',
    period: '2026.04',
    scope: ['Space Photography', 'Lighting Design', 'Color Grading'],
    description: '콘크리트 건조물 구조와 자연이 만나는 변곡점을 담았습니다. 시시각각 변화하는 자연광의 각도와 실내 인공 광원을 정교하게 믹싱하여 건축 미학적 절제미를 시각화한 시리즈입니다.',
    tools: ['Hasselblad H6D-100c', 'Broncolor Move 1200L'],
    coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
    additionalImages: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=800'
    ],
    category: 'photography',
    featured: true
  },
  {
    id: 'p2',
    title: 'THE CHRONO VISUALS',
    client: 'STUDIO TEMPO',
    period: '2026.05',
    scope: ['Fashion Lookbook', 'Editorial Art Direction'],
    description: '하이 패션 브랜드의 가을 컬렉션을 위한 하이엔드 룩북 작업물입니다. 인물의 동적인 호흡과 뉴트럴한 인테리어 스튜디오 톤을 아우르는 절묘한 셔터 스피드 제어로 완성하였습니다.',
    tools: ['Phase One IQ4 150MP', 'Profoto Pro-11'],
    coverImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1200',
    additionalImages: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800'
    ],
    category: 'photography',
    featured: true
  },
  {
    id: 'p3',
    title: 'CINEMATIC SILENCE',
    client: 'ORANGE INDEPENDENTS',
    period: '2026.03',
    scope: ['Cinema Recording', 'Audio Synced Loop', 'Main Editing'],
    description: '도시의 새벽 소음과 고독을 시적 비주얼로 기록한 4K RAW 단편 무드 시네마 필름입니다. 조리개의 얕은 보케 심도를 극대화하고, 미시적인 일상의 프레임을 정적인 고화질 컷으로 아카이빙했습니다.',
    tools: ['RED V-Raptor 8K', 'Arri Signature Primes'],
    coverImage: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=1200',
    additionalImages: [
      'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800'
    ],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    category: 'videography',
    featured: true
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
