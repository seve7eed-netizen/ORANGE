import { Project, ServiceDetail } from './types';

export const initialProjects: Project[] = [
  {
    id: 'p1',
    title: 'VACIA Jewelry Brand Visuals',
    client: 'VACIA',
    period: '2025.09.10 - 2025.09.28',
    scope: ['제품 촬영', '스튜디오 비주얼 디렉션', '컬러 매칭 리터칭'],
    description: '미니멀한 구도와 감성적인 컬러 밸런스를 통해 브랜드의 분위기와 제품의 디테일을 동시에 담아낸 작업입니다. 단순한 제품 기록 목적의 촬영을 넘어, 브랜드의 철학과 감각적인 결을 전달할 수 있는 독보적인 메인 비주얼 중심으로 연출했습니다. 차가운 금속성 텍스처와 부드러운 패키지의 대비를 세밀하고 유려하게 다듬어 완성했습니다.',
    tools: ['Hasselblad X2D 100C', 'Profoto D2 Duos', 'Photoshop CC', 'Capture One'],
    coverImage: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&q=80&w=1200',
    additionalImages: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&q=80&w=800'
    ],
    category: 'photography',
    featured: true
  },
  {
    id: 'p2',
    title: 'Neclar Serum Cosmetic Series',
    client: 'Neclar',
    period: '2025.09.26',
    scope: ['화장품 제품 촬영', '액체 제형 매크로 촬영', '빛 투과 및 굴절 제어'],
    description: '자연스러운 천연 유래 스킨케어 제형의 선명한 투명성과 패키지가 가진 기하학적 형태감을 극대화한 보습 세럼 상업 포토그래피입니다. 고속 스트로브 광을 활용해 중성을 띤 앰플 방울과 스킨케어 액체의 동적 점성을 크리스탈처럼 투명하고 맑은 고주파 질감으로 포획하고, 옐로우와 그린의 감성적이고 감각적인 색채 밸런스를 수립했습니다.',
    tools: ['Sony A7R V', 'Sony FE 90mm F2.8 Macro G', 'Broncolor Siros 800S', 'Lightroom Classic'],
    coverImage: 'https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&q=80&w=1200',
    additionalImages: [
      'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800'
    ],
    category: 'photography',
    featured: true
  },
  {
    id: 'p3',
    title: '한복 대여점 브랜드 야외 룩북 촬영',
    client: '한복 대여점 (익명)',
    period: '2025.04.10 - 2025.04.20',
    scope: ['야외 컨셉 인물 사진', '자연광 라이팅 컨설팅', '색채 밸런스 및 보정'],
    description: '따스한 자연광과 계절 본연의 공기 분위기를 깊이 있게 포착하여, 한복 특유의 유려하고 우아한 실루엣과 감성적인 전통 무드를 드라마틱하게 담아냈습니다. 순도 높은 수채화 색채 마냥 부드럽게 번지는 파스텔 무드의 톤온톤 보정을 거쳐, 고즈넉하면서도 세련미 가득한 비주얼을 정교하게 다듬었습니다.',
    tools: ['Canon EOS R5', 'RF 85mm F1.2 L USM', '자연 산란광 디퓨저', 'Photoshop Camera Raw'],
    coverImage: 'https://images.unsplash.com/photo-1614082242765-7c98cd0f3df3?auto=format&fit=crop&q=80&w=1200',
    additionalImages: [
      'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?auto=format&fit=crop&q=80&w=800'
    ],
    category: 'photography',
    featured: true
  },
  {
    id: 'p4',
    title: '가가호호김치 푸드 브랜딩 비주얼',
    client: '가가호호김치',
    period: '2025.11.05 - 2025.11.20',
    scope: ['푸드 스타일링 촬영', '다이내믹 클로즈업', '음식 텍스처 강조 리터칭'],
    description: '전통적인 한국 고유의 김치 문화를 현대적이고 모던한 모노톤 테이블 디자인과 강한 일방향 스포트라이트를 통해 감각적이고 고급스럽게 재해석한 프로젝트입니다. 신선하게 버무려진 배추의 풍부한 붉은 텍스처와 정갈한 식도구에서 묻어나는 자연광에 가까운 미세 명암비와 깊이 있는 컬러 텍스처의 균형감을 최상으로 이끌어냈습니다.',
    tools: ['Fujifilm GFX 100S', 'GF 120mm F4 Macro R LM OIS WR', 'Profoto Pro-11 2400'],
    coverImage: 'https://images.unsplash.com/photo-1583224964978-2257b960c3d3?auto=format&fit=crop&q=80&w=1200',
    additionalImages: [],
    category: 'photography',
    featured: false
  },
  {
    id: 'p5',
    title: '마루연 떡볶이 다이내믹 푸드 아트웍',
    client: '마루연',
    period: '2025.10.23 - 2025.10.27',
    scope: ['메뉴 비주얼 촬영', '고선명 리터칭', '컬러 매칭 연출'],
    description: '강렬하고 선명한 붉은 컬러와 쫄깃한 한국 대표 길거리 음식인 떡볶이 자체의 찰진 입자 텍스처를 시각적으로 가시화해 극적이고 입맛을 돋우는 대비를 확보했습니다. 고대비 다이내믹 구도를 통해 오브제 고유의 신선함과 세련된 분위기를 강조하는 보정과 최상급 앵클 조리 명암을 적용해 식욕을 직관적이고 자극적이도록 극대화시켰습니다.',
    tools: ['Nikon Z9', 'Nikkor Z MC 105mm f/2.8 VR S', 'Elinchrom FIVE Studio Monolight'],
    coverImage: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&q=80&w=1200',
    additionalImages: [],
    category: 'photography',
    featured: false
  },
  {
    id: 'p6',
    title: '자연안에 프리미엄 한방차 포토그라피',
    client: '자연안에',
    period: '2025.10.30 - 2025.11.10',
    scope: ['전통 한방 패키지 디테일 촬영', '오가닉 감성 무드 디렉션', '소품 구도 배치 설계'],
    description: '전통 한방 약재의 자욱하고 깊이 있는 컬러 톤과 목재 트레이, 다도 도구들을 결합하여 현대적인 웰니스 트렌드에 어울리는 프리미엄 차 브랜드를 묘사했습니다. 차분하고 고요하게 내려앉는 음영 처리를 기초로 정갈한 오가닉 무드와 정제된 기하 배치 구도를 적용해 내적 섭생과 여유를 강조했습니다.',
    tools: ['Sony A7R V', 'FE 50mm F1.2 GM', 'Aputure Amaran 200d', 'Capture One Pro'],
    coverImage: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&q=80&w=1200',
    additionalImages: [],
    category: 'photography',
    featured: false
  },
  {
    id: 'p7',
    title: '용산시장 제철 과일 프레시 스틸컷',
    client: '용산시장',
    period: '2025.12.01 - 2025.12.10',
    scope: ['과일 접사 촬영', '수중 굴절 액션 디렉팅', '스플래시 하이퍼 촬영'],
    description: '계절 과일 본연의 산뜻하고 생생한 색감과 고유 무스카트 텍스처를 하이 엔드 푸드 사진 기법으로 접근했습니다. 물속에 아지랑이 치는 미세 기포 텍스처와 과일의 싱그러움을 깔끔하고 청명한 백라이팅 조리감 속에 입체적으로 연출함으로써, 마치 갓 수확해 물에 씻어내는 수려한 청량감을 완성했습니다.',
    tools: ['Canon EOS R5', 'RF 100mm F2.8 L Macro IS USM', 'Godox AD1200 Pro Strobe'],
    coverImage: 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?auto=format&fit=crop&q=80&w=1200',
    additionalImages: [],
    category: 'photography',
    featured: false
  },
  {
    id: 'p8',
    title: 'OR D’OR 핸드메이드 골드 렉스 주얼리',
    client: 'OR D’OR',
    period: '2025.10.16 - 2025.10.25',
    scope: ['악세서리 패키지 연출', '미니멀 소품 매칭', '매크로 광택 조각 조정'],
    description: '미세하고 섬세한 럭셔리 수공예 주얼리의 보존 가치를 극대화하고자 정제되고 고상한 우아함, 여백이 공간 중심을 메우는 극도의 미니멀 구도를 적용했습니다. 금 본연의 세련된 황금빛 텍스처에 매치한 루비 로즈의 가넷 붉은빛이 고급스럽고 눈부시게 매칭되어 세련미 넘치는 럭셔리 화보를 구사했습니다.',
    tools: ['Hasselblad X2D 100C', 'XCD 120mm Macro Lens', 'Profoto D2 Duos', 'Photoshop CC'],
    coverImage: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1200',
    additionalImages: [],
    category: 'photography',
    featured: true
  },
  {
    id: 'p9',
    title: 'Floret 플로럴 감성 다큐먼트 사진',
    client: 'Floret',
    period: '2025.02.19 - 2025.02.25',
    scope: ['플라워 가니쉬 디렉션', '실루엣 극단 콘트라스트 조명', '감성 무드 조색'],
    description: '신선한 생화 꽃들의 격조 있는 배치와 활기찬 컬러 텍스처를 짙은 대조 속 예술적인 구도로 끌어낸 작업입니다. 극단에 배치된 스틸 짙은 그림자 음영 기조와 자연 산란광을 응축해, 피어나는 화예 본연의 유기적인 형상과 신비로우면서도 영롱한 생명력을 현대적인 플로럴 아트 형태로 아카이빙했습니다.',
    tools: ['Canon EOS R5', 'RF 50mm F1.2 L USM', 'Godox TT685II Speedlite'],
    coverImage: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&q=80&w=1200',
    additionalImages: [],
    category: 'photography',
    featured: false
  },
  {
    id: 'p10',
    title: 'Orange Taste 푸드 스타일링 및 상업 썸네일',
    client: 'Orange Taste',
    period: '2020.12.20 - 2022.03.22',
    scope: ['푸드 사진 보정', '스타일링 연출 지휘', '유튜브 비주얼 콘텐츠 썸네일 아트'],
    description: '맛의 오감을 하나의 정지 뷰 프레임에 입체적으로 수용하고자 촬영, 플레이트 스타일링, 보정까지 종합 디렉팅을 추진한 프로젝트입니다. 각 브랜드 고유 감성을 매핑하는 화사한 백그라운드 위 활기찬 푸드 스냅 연출과 깊고 어두운 백그라운드 배경에서 뿜어져 나오는 극상의 맛과 텍스처 자체에 집중하여 고감도로 담아냈습니다.',
    tools: ['Sony A7 III', 'FE 24-70mm F2.8 GM', 'Aputure Amaran 100x', 'Lightroom Classic'],
    coverImage: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=1200',
    additionalImages: [],
    category: 'photography',
    featured: false
  },
  {
    id: 'p11',
    title: '개인 프로필 젠-아트 스타일 포트레이트',
    client: '개인프로필',
    period: '2024.09.21 - 2024.09.25',
    scope: ['인물 성향 촬영', '스튜디오 조색 보정', '피부 및 텍스처 리터칭'],
    description: '인공적인 미사여구를 최대한 배제하고, 모델 본연의 개성 가득한 표정과 감지하기 힘든 잔잔한 감성을 오롯이 정면 조명의 굴절을 이용해 잡아낸 미니멀 초상 사진입니다. 인물의 실루엣과 부드러운 살결 톤온톤 입자감을 극적으로 매끄러우면서도 선명하게 유지해 차분하고 정제된 시각적 예술을 도출했습니다.',
    tools: ['Canon EOS R5', 'RF 85mm F1.2 L USM', 'Profoto B10X Duo', 'Photoshop CC'],
    coverImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1200',
    additionalImages: [],
    category: 'photography',
    featured: true
  },
  {
    id: 'p12',
    title: 'Performance Artist 야외 행위 예술 스틸',
    client: '개인 아티스트',
    period: '2024.08.25 - 2024.08.28',
    scope: ['야외 액션 포착', '동적 모멘텀 클로즈업 사진', '계절 대조 하늘 그레이딩'],
    description: '끝없고 드넓은 푸른 초원과 아스라이 고개를 치켜든 고전 고딕 스타일 타워 등, 구조 대조 디자인 아래에서 행위 예술가의 무한한 고독과 기쁨을 역동적으로 구현했습니다. 몸짓의 선과 신체의 흐름을 수평선 끝에 정밀 대치시켜 자유를 갈망하는 행위예술 특유의 경이감을 표현한 현대 고밀도 아카이브아트입니다.',
    tools: ['Sony A7R V', 'FE 70-200mm F2.8 GM OSS II', '고속 연사 셔터 싱킹', 'Capture One CC'],
    coverImage: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=1200',
    additionalImages: [],
    category: 'photography',
    featured: false
  },
  {
    id: 'p13',
    title: 'Newlyweds 시네마틱 라이트 웨딩 포토',
    client: '신혼부부 (개인)',
    period: '2025.10.25 - 2025.11.29',
    scope: ['웨딩 필름 메이킹 정밀 캡처', '소프트 하이라이트 발색', '인물 피부 연출'],
    description: '둘만의 따뜻한 첫 걸음과 로맨틱한 시선 교차, 면사포 속에 영글어가는 부드러운 사랑의 맹세를 영화 속 한 프레임인듯 낭만적이고 부드러운 라이트 브라운 톤 라이팅으로 포획했습니다. 촛불과 백라이트 조명을 오밀조밀하게 혼합하여 자연스러우며 고급스러운 웜 브라운 시네마틱 미학을 달성시켰습니다.',
    tools: ['Sony A7R V', 'Sony FE 50mm F1.2 GM', 'Profoto A10 On-Camera Strobe'],
    coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200',
    additionalImages: [],
    category: 'photography',
    featured: false
  },
  {
    id: 'p14',
    title: '해양환경공단 에코 캠페인 메이킹 스냅',
    client: '해양환경공단',
    period: '2025.04.25 - 2025.04.26',
    scope: ['메이킹 현장 스틸 촬영', '지속가능성 가치 디렉팅', '네이쳐 리치 컬러 리터칭'],
    description: '바다 쓰레기를 수령하고 해변을 복구시키는 에코 캠페인의 일련적인 현장 비하인드 활동을 생생하게 다큐멘터리 구도로 아카이빙했습니다. 제주 천연 바다의 청량한 진푸른 바닷바람과 인물들의 유기적 행동들을 거친 질감 대신 보더리스 내추럴 라이트로 녹여내 건강한 감성을 확보했습니다.',
    tools: ['Canon EOS R5', 'RF 24-70mm F2.8 L IS USM', '라이트 보정 프로세스'],
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200',
    additionalImages: [],
    category: 'photography',
    featured: false
  },
  {
    id: 'p15',
    title: '라이브 스튜디오 대칭적 비주얼 아카이빙',
    client: '한국중소벤처기업유통원',
    period: '2025.12.10',
    scope: ['인테리어 건축 촬영', '원근 대칭 평행 구도 디렉팅', '실내 고감도 다이나믹 렌즈 촬영'],
    description: '소상공인 전문 4K 스튜디오 인프라 전반의 광범위한 기하학적 인테리어와 수려한 레이아웃을 조명 플로우 제어를 결합해 명확하게 정리한 공간 스냅입니다. 원근 대칭 평행 구도를 응결시켜, 신뢰적 완성도와 차분하고 모던함 가득한 지식 아카이빙 공간을 세련되게 부조했습니다.',
    tools: ['Canon EOS R5', 'TS-E 24mm F3.5L II (틸트시프트)', 'Godox VL300 LED'],
    coverImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1200',
    additionalImages: [],
    category: 'photography',
    featured: false
  },
  {
    id: 'p16',
    title: 'DO IT STUDIO & GS건설 현장 액션 영상',
    client: 'DO IT STUDIO, GS건설',
    period: '2024.09.28 - 2025.06.17',
    scope: ['고속 트랙 비주얼 촬영', '대형 건설 빌딩 프레이밍', '동적 편집 러닝 디렉션'],
    description: '박진감 넘치는 오프로드 스포츠 트랙 카의 파열적 액션과 건물이 수직 상승하는 대형 건설 공종의 위대함을 한 편의 고속 영상 다큐멘터리로 실사화시켰습니다. 극적인 속도감 제어를 바탕으로 비하인드 씬의 긴박감 넘치는 앵글을 수립해 독보적인 스포츠 다이내믹 캠페인을 창조했습니다.',
    tools: ['RED Komodo 6K', 'DJI Ronin 4D 8K', 'DaVinci Resolve Studio'],
    coverImage: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=1200',
    additionalImages: [],
    category: 'videography',
    featured: true
  },
  {
    id: 'p17',
    title: 'LG tiiun mini 브랜드 홈가든 라이프스토리 필름',
    client: 'LG 전자',
    period: '2024.11.17',
    scope: ['가정용 스마트 식물재배기 촬영', '자연 산란광 실내 연출', '인물 뷰티 리터칭 시너'],
    description: '가정 속 푸른 화단이 가져다주는 작은 영감과 식물이 피어나는 시각 성장을 아주 포근하고 온유한 라이팅 구도를 적용해 하나의 감성 테마 필름으로 아카이빙했습니다. 제품 특유의 실버&화이트 클린함을 극대화하여 거대한 자연이 세심히 수렴하는 아름다움을 정갈히 보증시켰습니다.',
    tools: ['Sony FX6 Cine Camera', 'Zeiss Supreme Prime 50mm', 'Aputure 600d Pro', 'Premiere Pro'],
    coverImage: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=1200',
    additionalImages: [],
    category: 'videography',
    featured: true
  },
  {
    id: 'p18',
    title: 'Le Coq Sportif Tennis Commercial Film',
    client: 'My Creation (개인 커머셜)',
    period: '2025.02.26',
    scope: ['테니스 브랜드 컨셉 필름 연출', '스포츠 고속 모션 제어', '시네마틱 사운드 트랙 사절'],
    description: '르꼬끄 고유의 테니스 핏 에너지와 도약을 기반으로 스포츠 테니스의 정점을 포착한 고강도 비주얼 브랜딩 필름입니다. 경기에 돌입하는 긴박 비장 무드부터, 공이 바닥을 치고 강하게 날아가 라인을 점하는 숨막히는 순간순간을 고속 120fps 초정밀 앵글로 믹싱하여 압도적 시네마 임팩트를 전해줍니다.',
    tools: ['RED V-Raptor 8K VV', 'Arri Signature Prime 35mm', 'Sfere Gimbal', 'Resolve 18'],
    coverImage: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&q=80&w=1200',
    additionalImages: [],
    category: 'videography',
    featured: true
  },
  {
    id: 'p19',
    title: '단편영화 ‘THE LEGACY’ (살인청부와 복수의 예고)',
    client: 'My Creation (개인 연출작)',
    period: '2024.11.01 - 2024.12.15',
    scope: ['메인 시네마 디렉터', '스릴러 조명 고정', '시네마 그레이딩 및 컷편집'],
    description: '부모를 여읜 외로운 여고생이 어둠 속 청부 살인 브로커를 만나 무수히 무너지고 격분하는 복수의 비틀린 심리 묘사를 그린 단편 영화 프로젝트입니다. 어둡고 묵직한 가학적 세피아 블랙 그레이딩 기법을 바탕으로 일발의 격발 전까지 이르는 깊고 밀도 깊은 공포와 불안의 연출 미학을 다각도로 확보했습니다.',
    tools: ['RED Komodo 6K', 'Zeiss CP3 Lenses', 'DaVinci Resolve Studio', 'ProTools HD'],
    coverImage: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=1200',
    additionalImages: [],
    category: 'videography',
    featured: true
  },
  {
    id: 'p20',
    title: '청춘 시네마 단편영화 ‘SUMMER REMINDER’',
    client: 'My Creation (개인 연출작)',
    period: '2024.08.17 - 2024.10.07',
    scope: ['드라마 연출 및 캐스팅 지휘', '아날로그 필름 컬러 그레이딩', '사운드 믹싱'],
    description: '필름 카메라 하나를 소리없이 부감하며 매개로 여름 속 부서지며 피어나는 여고생들의 투명한 갈등과 아득한 우정을 기록한 복고풍 청춘 필름입니다. 자전거 바퀴 살에 부서지는 황금빛 노을 풍경과 영롱한 자연광의 기조를 한층 필름룩 특유 of 감색 보정 기작을 활용해 눈이 편안히 수려하도록 매만졌습니다.',
    tools: ['Arri Alexa Mini LF', 'Cooke Anamorphic /i Prime', 'DaVinci Resolve'],
    coverImage: 'https://images.unsplash.com/photo-1517685352821-92cf88aee5a5?auto=format&fit=crop&q=80&w=1200',
    additionalImages: [],
    category: 'videography',
    featured: false
  },
  {
    id: 'p21',
    title: '심리 예술 단편영화 ‘THE PIANIST’ (마왕의 강박)',
    client: 'My Creation (개인 연출작)',
    period: '2025.05.10 - 2025.07.05',
    scope: ['시각 극 연출 디렉터', '무대 조명 설계', '슈베르트 음악 사운드 연동 편집'],
    description: '불안 장애의 어두운 나락 속으로 굴러 떨어지는 전천재 피아니스트의 강박적이고 불온한 무리를 그린 세밀 단편영화입니다. 환청처럼 몰고 오르는 슈베르트 웅장 "마왕" 피아노 연타 연주와 화면 대치 구도를 100% 동조하여 깊은 명장 면모를 다듬고 비극적인 몰락 과정을 미려하고 비장하게 승화시켰습니다.',
    tools: ['RED Monstro 8K VV', 'Angenieux Optimo Zoom', 'ProTools HD', 'Premiere Pro'],
    coverImage: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&q=80&w=1200',
    additionalImages: [],
    category: 'videography',
    featured: true
  },
  {
    id: 'p22',
    title: '프리미엄 자막 가니쉬 및 커머셜 유튜브 편집',
    client: 'Other Multi-Brands',
    period: '2025.05.10 - 2025.07.05',
    scope: ['자막 모션 그래픽스 디자인', '빠른 리듬 컷편집', '효과음 사운드 코레이션'],
    description: '촬영된 다채로운 원형 스틸 비주얼 클립을 기초로 현대 유튜브 스위프트 소비 경향에 맞는 템포감 있고 박진감 넘치는 편집과 고급스럽고 세련된 타이포 그래픽 모션을 구현했습니다. 정보 기조 전달력을 저해하지 않으면서 세련됨을 보장하는 현대 포스트 디자이닝 기법입니다.',
    tools: ['Adobe After Effects CC', 'Premiere Pro CC', 'Logic Pro X sound FX'],
    coverImage: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=1200',
    additionalImages: [],
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
