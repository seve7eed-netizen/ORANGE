import { Project, ServiceDetail } from './types';

export const initialProjects: Project[] = [];

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
