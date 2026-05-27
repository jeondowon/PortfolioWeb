export const ABOUT = {
  en: {
    bio: "I'm a developer who believes the best software starts from imagination. I explore broadly — web, app, and beyond — \nchasing ideas worth building and turning them into real things. Keep dreaming. Develop imagination. Make it real.\nThat's DJ, drops masterpieces.",
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
    bio: "저는 한동대학교 AI·컴퓨터전자공학부에서 AI·컴퓨터공학심화 전공을 하고 있습니다. 컴퓨터공학심화 전공은 한국공학교육인증원에서 인증을 받은 프로그램이며, 저는 이 교육과정을 이수하여 졸업 후 실제 공학 현장에 효과적으로 투입될 수 있도록 준비 중에 있습니다. 소프트웨어 개발자라는 꿈을 가지고있으나 보다 세부적인 진로계획은 더욱 많은 경험과 지식을 쌓으며 세워나갈 예정입니다. 저의 웹사이트에 방문해주셔서 감사합니다. ",
    education: [
      {
        school: "한동대학교",
        description: "South Korea, Pohang · AI·컴퓨터공학심화 (ABEEK)",
        year: "2023 – 현재",
      },
      {
        school: "Faith Academy Manila International School",
        description: "Philippines, Manila",
        year: "2017 – 2023",
      },
    ],
  },
};

export const EXPERIENCE_DATA = {
  work: [],
  teams: [
    { date: "2023.09 — Present", title: "CRA", subtitle: "한동대학교 전산 동아리", isActive: true },
    { date: "2024.03 — 2025.11", title: "대한민국 해군 제2함대 지휘통신대대", subtitle: "전산병 복무 · 병장 만기전역", isActive: false },
    { date: "2023.03 — 2023.08", title: "CHERK", subtitle: "한동대학교 영화 학회", isActive: false },
    { date: "2023.09 — Present", title: "sk8erz", subtitle: "한동대학교 스케이트보드 크루", isActive: true },
  ],
  achievements: [
    { date: "2026", title: "Google AI Agent Challenge", subtitle: "본선 진출", isActive: false },
    { date: "2023", title: "한동대학교 1학년 소프트웨어 공모전", subtitle: "장려상", isActive: false },
  ],
};

export const PROJECTS = [
  {
    id: 1,
    title: "Check Team Mate",
    category: "Mobile App",
    description:
      "Helps you connect with university group projects more efficiently. Create a team and find collaborators easily!",
    github: "https://github.com/dowon-9102",
    available: true,
  },
  {
    id: 2,
    title: "Portfolio Website",
    category: "Web",
    description:
      "Personal portfolio website that shows the history of Dowon Jeon's work and experiences.",
    github: "https://github.com/dowon-9102",
    available: true,
  },
  {
    id: 3,
    title: "Waiting for the update...",
    category: "",
    description: "I'm working on it",
    github: null,
    available: false,
  },
  {
    id: 4,
    title: "Waiting for the update...",
    category: "",
    description: "I'm working on it",
    github: null,
    available: false,
  },
];

export const SKILLS = [
  {
    id: "languages",
    title: "Languages",
    items: ["C/C++", "Java", "JavaScript", "Python"],
  },
  {
    id: "frameworks",
    title: "Frameworks & Libraries",
    items: ["React", "React Native", "Flutter", "Spring Boot"],
  },
  {
    id: "tools",
    title: "Tools",
    items: ["Git", "Vite", "Figma"],
  },
  {
    id: "spoken",
    title: "Spoken",
    items: ["Korean (Native)", "English (Proficient · TOEIC 970)"],
  },
];

export const SOCIAL = {
  email: "dowon.9102@gmail.com",
  phone: "010-5956-0629",
  phoneDisplay: "+82 10-5956-0629",
  instagram: "https://instagram.com",
  youtube: "https://youtube.com",
  github: "https://github.com/dowon-9102",
};
