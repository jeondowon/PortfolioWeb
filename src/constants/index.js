export const NAVBAR_H = 64;

export const ABOUT = {
  en: {
    bio: {
      desktop:
        "I'm a developer who believes every great software always starts from abstract imaginations. \nI explore broadly — web, app, and beyond — chasing ideas worth building and turning them into real things. \nKeep dreaming. Develop imaginations, and make it real. That's DJ, drops masterpieces.",
      mobile:
        "I'm a developer who believes every great software always starts from abstract imaginations. \nI explore broadly — web, app, and beyond — chasing ideas worth building and turning them into real things. \nKeep dreaming. Develop imaginations, and make it real. \nThat's DJ, drops masterpieces.",
    },
    education: [
      {
        school: "Handong Global University",
        description: "South Korea, Pohang · B.S. in AI·CSEE (ABEEK)",
        year: "2023 – Present",
      },
      {
        school: "Faith Academy Manila International School",
        description: "Philippines, Manila",
        year: "2017 – 2023",
      },
    ],
  },
  ko: {
    bio: {
      desktop:
        "저는 모든 좋은 소프트웨어가 언제나 추상적 상상으로부터 시작한다고 믿는 개발자입니다. 웹, 앱, 그 너머까지 폭넓게 탐구하며, \n가치 있는 아이디어를 쫓아 현실로 만들어 냅니다. 꿈을 품고, 상상을 구체화하여 이에 실체를 부여합니다.\nDJ로서, 걸작을 만들어 세상에 들려주겠습니다.",
      mobile:
        "저는 모든 좋은 소프트웨어가 언제나 추상적 상상으로부터 시작한다고 믿는 개발자입니다. 웹, 앱, 그 너머까지 폭넓게 탐구하며, 가치 있는 아이디어를 쫓아 현실로 만들어 냅니다. \n꿈을 품고, 상상을 구체화하여 이에 실체를 부여합니다.\nDJ로서, 걸작을 만들어 세상에 들려주겠습니다.",
    },
    education: [
      {
        school: "한동대학교",
        description: "대한민국 포항 · AI·컴퓨터공학심화 (공학인증)",
        year: "2023 – 현재",
      },
      {
        school: "Faith Academy Manila 국제학교",
        description: "필리핀 마닐라",
        year: "2017 – 2023",
      },
    ],
  },
};

export const EXPERIENCE_DATA = {
  work: [],
  teams: [
    {
      date: "2023.09 — Present",
      title: "CRA (Computer Research Association)",
      subtitle: {
        en: "Handong Global University Computer Science Club",
        ko: "한동대학교 전산 동아리",
      },
      isActive: true,
    },
    {
      date: "2024.03 — 2025.11",
      title: {
        en: "Republic of Korea Navy 2nd Fleet C4I Battalion",
        ko: "대한민국 해군 제2함대 지휘통신대대",
      },
      subtitle: {
        en: "Served as Computer/Network Administrator",
        ko: "전산병 복무 (병장 만기 전역)",
      },
      isActive: false,
    },
    {
      date: "2023.03 — 2023.08",
      title: "CHERK",
      subtitle: {
        en: "Handong Global University Academic Film Society",
        ko: "한동대학교 영화 학회",
      },
      isActive: false,
    },
    {
      date: "2023.09 — Present",
      title: "sk8erz",
      subtitle: {
        en: "Handong Global University Skateboard Crew",
        ko: "한동대학교 스케이트보드 크루",
      },
      isActive: true,
    },
  ],
  achievements: [
    {
      date: "2026",
      title: "Google AI Agent Challenge",
      subtitle: { en: "Advanced to Final Round", ko: "본선 진출" },
      isActive: false,
    },
    {
      date: "2023",
      title: {
        en: "Handong Global University Freshman Software Competition",
        ko: "한동대학교 1학년 소프트웨어 경진대회",
      },
      subtitle: { en: "Encouragement Award", ko: "장려상" },
      isActive: false,
    },
  ],
};

export const PROJECTS = [
  {
    id: 1,
    title: "Check Team Mate",
    category: ["App"],
    description: {
      en: "A to-do app built for teamwork: assign tasks to teammates, monitor progress, and keep group projects on track. Built with React Native, Firebase.",
      ko: "팀워크를 위한 투두 앱: 서로에게 할 일을 배분하고, 진행 상황을 모니터링하며, 그룹 프로젝트를 관리할 수 있습니다. React Native, Firebase로 개발하였습니다.",
    },
    github: "https://github.com/jeondowon/CheckTeamMate",
    image: "/images/CheckTeamMate.png",
    available: true,
  },
  {
    id: 2,
    title: "Portfolio Website",
    category: ["Web"],
    description: {
      en: "A personal portfolio showcasing projects, skills, and experiences. \nDesigned and built byself, via Figma, React, Vite.",
      ko: "현재 보고 계신 프로젝트와 기술, 개인 경험을 소개하는 포트폴리오 웹사이트입니다. Figma, React, Vite로 직접 디자인하고 개발하였습니다.",
    },
    github: "https://github.com/jeondowon/PortfolioWeb",
    image: "/images/PortfolioWeb.png",
    available: true,
  },
  {
    id: 3,
    title: "Candle",
    category: ["App", "Web", "Fintech"],
    description: {
      en: "A stock prediction challenge app for investors — go on a winning streak, earn points, and compete for prizes. The only cost to play is watching an ad. Available on both Web and Mobile.",
      ko: "투자자를 위한 주가 예측 챌린지 앱 — 포인트를 쌓거나 연승을 유지하여 상품을 노리세요. 참여 비용은 광고 시청 하나뿐입니다. 웹과 모바일 서비스를 모두 지원합니다.",
    },
    github: null,
    image: "/images/Candle.png",
    available: true,
  },
  {
    id: 4,
    title: "SpotLine",
    category: ["Web", "AI"],
    description: {
      en: "A Vision AI-powered SaaS dashboard for physical retail. Analyze CCTV footage, discover marketing strategies, and chat with SpotLine AI. Finalist at Google AI Agent Challenge.",
      ko: "오프라인 매장을 위한 vision AI 기반 SaaS 대시보드. CCTV 영상을 분석하고, 매장 고객의 데이터를 쌓아 마케팅 전략을 발굴할 수 있습니다. SpotLine AI와 대화하여 더욱 깊은 인사이트를 경험하세요. Google AI Agent Challenge 결선 진출작.",
    },
    github: "https://github.com/jeondowon/SpotLine-frontend",
    image: "/images/SpotLine.png",
    available: true,
  },
  {
    id: 5,
    title: "FA Alumni Network Web",
    category: ["Web"],
    description: {
      en: "An alumni networking platform for Faith Academy Manila — connect with graduates worldwide, ask for a coffee chat, seek advice, and stay in touch with your community.",
      ko: "Faith Academy Manila 동문 네트워킹 플랫폼 — 전 세계로 뻗어나간 34개국 이상의 졸업생들과 연결하고, 조언을 구하며, 당신의 소중한 커뮤니티와 소통하세요. 오늘, 커피챗 할까요?",
    },
    github: "https://github.com/jeondowon/FAReunion",
    image: "/images/FAReunion.png",
    available: true,
  },
  {
    id: 6,
    title: "Vinyl Room",
    category: ["Web"],
    description: {
      en: "A 3D vinyl turntable experience built with Three.js — search and play music via YouTube, watch the record spin, and enjoy your playlist in a virtual vinyl room.",
      ko: "Three.js로 만든 3D 바이닐 턴테이블 웹사이트. YouTube로 음악을 검색하고 재생하며, 레코드가 돌아가는 것을 감상할 수 있습니다. 아늑한 당신만의 공간 — 가상의 바이닐 룸에서 당신만의 플레이리스트를 즐기세요.",
    },
    github: "https://github.com/jeondowon/LP-Player-Web",
    image: "/images/VinylRoom.png",
    available: true,
  },
  {
    id: 7,
    title: "CRA Website",
    category: ["Web"],
    description: {
      en: "Maintained and enhanced the official CRA website — redesigned and improved key pages. Check out the wide range of projects built by CRA.",
      ko: "한동대학교 전산 동아리 CRA의 공식 웹사이트를 유지보수하고, 주요 페이지의 리디자인과 개선작업을 진행했습니다. CRA가 만든 다양한 프로젝트를 확인해보세요.",
    },
    github: "https://github.com/jeondowon/cra-web-frontend",
    image: "/images/CRA.png",
    available: true,
  },
  /*{
    id: 10,
    title: "",
    category: [],
    description: "I'm working on it",
    github: null,
    image: null,
    available: false,
  },*/
];

export const SKILLS = [
  {
    id: "languages",
    title: "Languages",
    description: {
      en: "From low-level C/C++ to scripting in Python — I pick the right language for the problem and dig in until I really understand and solve it.",
      ko: "C/C++부터 Python 스크립팅까지 문제에 맞는 언어를 선택하고 깊이 파고듭니다.",
    },
    items: ["C/C++", "Java", "JavaScript", "Python"],
  },
  {
    id: "frameworks",
    title: "Frameworks & Libraries",
    description: {
      en: "Comfortable across the stack — React on the web, React Native & Flutter on mobile, Spring Boot on the server. I focus on shipping things end-to-end.",
      ko: "풀스택에 익숙합니다 — 웹은 React, 모바일은 React Native & Flutter, 서버는 Spring Boot. 처음부터 끝까지 완성하는 것에 집중합니다.",
    },
    items: ["React", "React Native", "Flutter", "Spring Boot"],
  },
  {
    id: "tools",
    title: "Tools",
    description: {
      en: "Tools I work with daily — version control for clean history, a fast dev loop for tight iteration, and a design surface where I bring abstract ideas into form.",
      ko: "버전 컨트롤로 이력을 명확하게 관리하고, 신속한 개발 환경 속에서 반복 작업을 효율화하며, 디자인 툴을 사용하여 추상적 아이디어를 구체화합니다.",
    },
    items: ["Git", "Vite", "Figma"],
  },
  {
    id: "spoken",
    title: "Spoken",
    description: {
      en: "Bilingual in Korean and English. Six years at an international school in Manila made me equally comfortable working, presenting, and writing in both.",
      ko: "한국어와 영어를 모두 구사할 수 있습니다. 6년 동안의 국제학교 진학 경험을 통해 두 언어 모두 업무, 발표, 작문에 능숙합니다.",
    },
    items: ["Korean (Native)", "English (Proficient · TOEIC 970)"],
  },
];

export const LAB_ITEMS = [
  {
    id: "exp01",
    exp: "EXP-001",
    url: "/lab/001",
    title: "Gravity Well",
    date: "2025.04",
    tags: ["canvas", "physics"],
    thumbnail: "/lab/thumbnails/exp01.png",
    blurb:
      "Fling particles into the field and watch them spiral, collapse and scatter under a draggable point of attraction.",
  },
  {
    id: "exp02",
    exp: "EXP-002",
    url: "/lab/002",
    title: "Tic-Tac-Toe Neue",
    date: "2025.05",
    tags: ["game", "minimax"],
    blurb:
      "Three in a row, stripped to ink and paper. The bot never loses—your job is to force the draw.",
  },
  {
    id: "exp03",
    exp: "EXP-003",
    url: "/lab/003",
    title: "Chroma Mixer",
    date: "2025.06",
    tags: ["color", "ui"],
    blurb:
      "Pull three sliders and blend light like pigment. A small lab for learning how additive color actually behaves.",
  },
  {
    id: "exp04",
    exp: "EXP-004",
    url: "/lab/004",
    title: "Maze 01",
    date: "2025.07",
    tags: ["game", "algorithm"],
    blurb:
      "Generate a perfect maze with one keystroke, then let a solver flood through it in real time.",
  },
  {
    id: "exp05",
    exp: "EXP-005",
    url: "/lab/005",
    title: "Wave Field",
    date: "2025.08",
    tags: ["svg", "motion"],
    blurb:
      "A grid of dots breathing through layered sine waves. Move the cursor to push ripples across the surface.",
  },
  {
    id: "exp06",
    exp: "EXP-006",
    url: "/lab/006",
    title: "Snake.mono",
    date: "2025.09",
    tags: ["game", "canvas"],
    blurb:
      "The arcade classic rebuilt in under eighty lines, in nothing but black, white and one blinking pixel.",
  },
  {
    id: "exp07",
    exp: "EXP-007",
    url: "/lab/007",
    title: "Cursor Ghosts",
    date: "2025.10",
    tags: ["pointer", "motion"],
    blurb:
      "A chain of delayed followers trailing your pointer, each one a softer echo of the last.",
  },
  {
    id: "exp08",
    exp: "EXP-008",
    url: "/lab/008",
    title: "Memory Grid",
    date: "2025.11",
    tags: ["game", "dom"],
    blurb:
      "Flip tiles, hold the pattern in your head and clear the board before the timer runs dry.",
  },
  {
    id: "exp09",
    exp: "EXP-009",
    url: "/lab/009",
    title: "Pendulum Lab",
    date: "2026.01",
    tags: ["physics", "sim"],
    blurb:
      "Tune gravity, length and damping, release the bob and trace the long slow decay of its arc.",
  },
  {
    id: "exp10",
    exp: "EXP-010",
    url: "/lab/010",
    title: "Type Storm",
    date: "2026.02",
    tags: ["type", "motion"],
    blurb:
      "Words that shatter into letters and drift back into place as your cursor sweeps across the line.",
  },
  {
    id: "exp11",
    exp: "EXP-011",
    url: "/lab/011",
    title: "Brick Breaker",
    date: "2026.03",
    tags: ["game", "canvas"],
    blurb:
      "One paddle, one ball, an endless wall of bricks. A study in the smallest possible action loop.",
  },
  {
    id: "exp12",
    exp: "EXP-012",
    url: "/lab/012",
    title: "Orbit Clock",
    date: "2026.04",
    tags: ["time", "svg"],
    blurb:
      "The hour, minute and second told as three concentric rings sweeping silently around a shared center.",
  },
];

export const RESUME_AVAILABLE = false;

export const SOCIAL = {
  email: "dowon.9102@gmail.com",
  phone: "010-5956-0629",
  phoneDisplay: "+82 10-5956-0629",
  instagram: "https://www.instagram.com/jeondowon/",
  linkedin: "https://www.linkedin.com/in/jeondowon/",
  github: "https://github.com/jeondowon",
};
