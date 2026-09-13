export const profile = {
  name: "Farmaan Malik",
  role: "Software Developer",
  tagline: "Mobile-first engineer building large-scale React Native apps used in production.",
  location: "Srinagar, Jammu & Kashmir, India",
  email: "farmaanmalik6348@gmail.com",
  avatar: "https://avatars.githubusercontent.com/u/134799465?v=4",
  summary:
    "Software Developer with hands-on experience building large-scale React Native applications used in production. Specialized in mobile architecture, global state management, custom media playback, Android platform constraints, and performance optimization. Experienced in integrating backend-driven AI-assisted features, scheduling systems, and real-time UI workflows.",
  socials: {
    github: "https://github.com/Farmaan-Malik",
    linkedin: "https://www.linkedin.com/in/farmaan-malik",
    email: "mailto:farmaanmalik6348@gmail.com",
  },
};

export const stats = [
  { value: "4+", label: "Production RN apps" },
  { value: "100+", label: "Bugs squashed" },
  { value: "99.9%", label: "Release uptime" },
  { value: "10+", label: "Store releases shipped" },
];

export type Experience = {
  company: string;
  role: string;
  period: string;
  current?: boolean;
  points: string[];
};

export const experiences: Experience[] = [
  {
    company: "Wiingy",
    role: "App Developer",
    period: "Aug 2025 — Present",
    current: true,
    points: [
      "Own the frontend of CoTutor, an AI-powered study assistant, across both student and tutor React Native apps.",
      "Built a custom global audio playback system with a mini-player and full-screen modal architecture.",
      "Implemented VoIP with LiveKit for both tutor and student sides, natively displaying calls.",
      "Centralized audio, playback state, and learning modules into a global state architecture.",
      "Built tutor scheduling and availability modules supporting one-time and recurring sessions.",
      "Built a subscription & billing system with tutor-specific plans and a Stripe WebView checkout flow.",
      "Integrated OTA updates to improve release velocity and reduce dependency on store deployments.",
      "Shipped streak-based engagement features to encourage consistent student learning.",
    ],
  },
  {
    company: "MYCLNQ",
    role: "Software Development Engineer I",
    period: "Jan 2025 — Jul 2025",
    points: [
      "Contributed to 4 production React Native apps supporting provider and end-user workflows.",
      "Upgraded applications from React Native 0.64 to 0.74, reducing user-reported issues by 30%.",
      "Built and optimized in-app search, improving engagement and search performance by 15%.",
      "Delivered 10+ stable iOS and Android releases while maintaining 99.9% uptime.",
      "Designed and implemented 10+ backend APIs supporting core mobile workflows.",
    ],
  },
  {
    company: "MYCLNQ",
    role: "Software Developer Intern",
    period: "Mar 2024 — Jul 2024",
    points: [
      "Fixed 50+ bugs, improving app stability and reducing user disruptions.",
      "Implemented filtering features, reducing data access time by 20%.",
      "Revamped 10+ legacy UI components based on Figma designs and usability feedback.",
      "Integrated multiple APIs and debugged legacy backend logic to ensure smooth data flow.",
    ],
  },
];

export type Project = {
  name: string;
  blurb: string;
  stack: string[];
  repo: string;
  accent: string;
};

export const projects: Project[] = [
  {
    name: "Llama Sama",
    blurb:
      "AI quiz app delivering real-time, AI-generated questions over SSE. Built on MVVM + Clean Architecture with performant local state.",
    stack: ["React Native", "Expo", "SSE", "Zustand", "MMKV", "TanStack Query"],
    repo: "https://github.com/Farmaan-Malik/Llama-sama",
    accent: "from-emerald-500 to-teal-600",
  },
  {
    name: "Llama Sama Backend",
    blurb:
      "Go backend with Gin following MVC + Repository pattern. JWT auth, Ollama-powered quiz generation streamed via SSE, Redis sessions.",
    stack: ["Go", "Gin", "MongoDB", "Redis", "Ollama", "Docker"],
    repo: "https://github.com/Farmaan-Malik/Llama-backend",
    accent: "from-lime-500 to-emerald-600",
  },
  {
    name: "HealthBridge",
    blurb:
      "A role-based (Doctor/Patient) video-consultation app. Real-time video & audio over Agora, live in-call chat and call notifications via Socket.IO, backed by a Node/Express server.",
    stack: ["React Native", "Expo", "Agora", "Socket.IO", "Node.js", "Express"],
    repo: "https://github.com/Farmaan-Malik/HealthBridge",
    accent: "from-orange-500 to-amber-600",
  },
  {
    name: "That Pet Place",
    blurb:
      "Android app in Jetpack Compose with MVVM + Clean Architecture. Location-based clinic search, appointments, and robust API handling.",
    stack: ["Kotlin", "Jetpack Compose", "Retrofit", "Koin", "MVVM"],
    repo: "https://github.com/Farmaan-Malik/ThatPetPlace",
    accent: "from-[#2f8f7f] to-[#8bbb92]",
  },
];

export type SkillGroup = { title: string; items: string[] };

export const skillGroups: SkillGroup[] = [
  { title: "Languages", items: ["JavaScript", "TypeScript", "Go", "Kotlin"] },
  {
    title: "Frameworks & Mobile",
    items: ["React Native", "React.js", "Expo", "Jetpack Compose"],
  },
  {
    title: "State & Architecture",
    items: ["Redux Toolkit", "RTK Query", "Zustand", "MMKV", "Clean Architecture", "MVVM"],
  },
  {
    title: "Backend & APIs",
    items: ["Node.js", "Express", "REST", "JWT Auth", "Server-Sent Events"],
  },
  { title: "Databases", items: ["PostgreSQL", "MongoDB", "Redis", "Firebase"] },
  {
    title: "Cloud & DevOps",
    items: ["AWS", "Azure", "Docker", "CI/CD", "GitHub Actions", "OTA Updates"],
  },
];

export type Milestone = {
  date: string;
  title: string;
  org: string;
  detail: string;
  kind: "work" | "education";
};

// Chronological journey (earliest → latest) for the horizontal timeline.
export const journey: Milestone[] = [
  {
    date: "2019",
    title: "Tyndale Biscoe School",
    org: "SSC & HSC",
    detail:
      "Finished school and got properly hooked on building things with code.",
    kind: "education",
  },
  {
    date: "2020 — 2024",
    title: "University of Kashmir",
    org: "B.E. Computer Science",
    detail:
      "Bachelor of Engineering in Computer Science — the foundations: systems, algorithms, and software design.",
    kind: "education",
  },
  {
    date: "2024",
    title: "MYCLNQ",
    org: "Software Developer Intern",
    detail:
      "Fixed 50+ bugs, built filtering that cut data-access time by 20%, and revamped 10+ legacy UI components from Figma.",
    kind: "work",
  },
  {
    date: "2025",
    title: "MYCLNQ",
    org: "Software Development Engineer I",
    detail:
      "Shipped across 4 production React Native apps, upgraded RN 0.64 → 0.74 (−30% issues), and built 10+ backend APIs.",
    kind: "work",
  },
  {
    date: "2025 — Now",
    title: "Wiingy",
    org: "App Developer",
    detail:
      "Own CoTutor's React Native frontend — custom audio playback, LiveKit VoIP, tutor scheduling, and Stripe billing.",
    kind: "work",
  },
];

export const education = [
  {
    school: "University of Kashmir",
    detail: "Bachelor of Engineering, Computer Science",
    period: "2020 — 2024",
  },
  {
    school: "Tyndale Biscoe School",
    detail: "SSC & HSC",
    period: "2019",
  },
];

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];
