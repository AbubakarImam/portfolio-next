export const profile = {
  name: "Abubakar Imam Abdulsalam",
  role: "Backend Software Engineer",
  tagline:
    "I build and modify internal APIs for MIZAN and SEABASS — Sterling Bank's Sharia-compliant and conventional core banking platforms — shipping transaction-critical features in C#, ASP.NET, and Entity Framework. Full-stack capable too, from Angular interfaces to Node.js services.",
  email: "salamabubakarimam@gmail.com",
  resumeHref:
    "https://drive.google.com/uc?export=download&id=10XfaJMUgPjqd-jEuAxrgvp4EiU5SOZI3",
  socials: {
    github: "https://github.com/AbubakarImam",
    linkedin: "https://linkedin.com/in/abdulsalam-abubakar-imam-a71273200",
    twitter: "https://twitter.com/Abubakar_Imam1",
    twitterHandle: "@abubakarImam1",
    whatsapp: "https://wa.me/+2347061069417",
    whatsappLabel: "+234 706 106 9417",
  },
};

export const bio =
  "I'm a backend software engineer at Sterling Bank, where I build and modify internal APIs for MIZAN and SEABASS — the bank's Sharia-compliant and conventional core banking platforms — in C#, ASP.NET, and Entity Framework. My work sits on transaction-critical ground: account enquiry middleware, customer mandate management, teller till operations, and automated receipt generation, all inside a regulated financial environment. I also integrate these systems with KUSALA, Sterling's internal BPM platform, building on earlier hands-on experience there as an Automation Engineer. Before backend work, I spent a year front-line at Ecobank as a Customer Service Officer — that direct exposure to how banking actually works now shapes how I design the systems behind it. I'm comfortable across the full stack too: as a Software Engineer Intern at Platr, I helped build an internal Jira-style task-management tool end-to-end with Angular and Node.js. I came into software through a Biology degree and self-taught C#/.NET coursework rather than a straight line — which is most of why I pick up new systems fast under regulated, deadline-driven constraints.";

export type Role = {
  title: string;
  org: string;
  period: string;
  location: string;
  note?: string;
  highlights: string[];
};

export const experience: Role[] = [
  {
    title: "Software Engineer",
    org: "Sterling Bank",
    period: "Nov 2024 — Present",
    location: "Lagos Island, Lagos State, Nigeria",
    note: "Started as Automation Engineer on KUSALA; transitioned into a Software Engineering role",
    highlights: [
      "Modify and extend internal APIs for MIZAN (Sharia-compliant) and SEABASS (conventional) — Sterling Group's two live core banking platforms",
      "Integrate MIZAN and SEABASS with KUSALA, Sterling's internal Business Process Management platform",
      "Built and maintain the account enquiry middleware service for real-time customer account access across both core banking systems",
      "Developed the customer mandate endpoint, used to manage account authorization rules",
      "Developed the tellers till endpoint, supporting cash handling and reconciliation for branch tellers",
      "Built an ASP.NET receipt-generation flow that automates transaction receipts for customers",
    ],
  },
  {
    title: "Customer Service Officer",
    org: "Ecobank Nigeria",
    period: "Jan 2024 — Nov 2024",
    location: "Lagos State, Nigeria",
    highlights: [
      "Front-line banking operations and customer service — direct exposure that now informs how I design backend systems for financial platforms",
    ],
  },
  {
    title: "Software Engineer Intern",
    org: "Platr",
    period: "Jul 2023 — Nov 2023",
    location: "Abuja, Federal Capital Territory, Nigeria",
    highlights: [
      "Contributed to an internal, Jira-style task-management system built for the technology team",
      "Worked across the stack — Angular frontend, Node.js backend — for full-stack experience",
    ],
  },
];

export type Material = {
  part: string;
  name: string;
  bin: "Frontend" | "Backend" | "Tooling";
};

export const materials: Material[] = [
  { part: "P-101", name: "React", bin: "Frontend" },
  { part: "P-102", name: "Next.js", bin: "Frontend" },
  { part: "P-103", name: "Angular", bin: "Frontend" },
  { part: "P-104", name: "JavaScript / TypeScript", bin: "Frontend" },
  { part: "P-105", name: "Tailwind CSS", bin: "Frontend" },
  { part: "P-106", name: "HTML / CSS", bin: "Frontend" },
  { part: "P-201", name: "Node.js / NestJS", bin: "Backend" },
  { part: "P-202", name: ".NET 8 / C#", bin: "Backend" },
  { part: "P-203", name: "PostgreSQL", bin: "Backend" },
  { part: "P-204", name: "gRPC / REST", bin: "Backend" },
  { part: "P-205", name: "RabbitMQ", bin: "Backend" },
  { part: "P-206", name: "Firebase", bin: "Backend" },
  { part: "P-301", name: "Git / GitHub", bin: "Tooling" },
  { part: "P-302", name: "Docker", bin: "Tooling" },
  { part: "P-303", name: "Figma", bin: "Tooling" },
  { part: "P-304", name: "Netlify / Vercel", bin: "Tooling" },
];

export type Assembly = {
  id: number;
  asm: string;
  title: string;
  year: string;
  category: "Frontend" | "Systems";
  stack: string;
  image?: string;
  layers?: string[];
  highlights?: string[];
  status: "Shipped" | "In service";
  github: string;
  demo?: string;
  demoIsPlaceholder?: boolean;
};

export const assemblies: Assembly[] = [
  {
    id: 1,
    asm: "ASM-10",
    title: "Paystack Payment Microservice",
    year: "2026",
    category: "Systems",
    stack: "NestJS · gRPC · RabbitMQ · Prisma · PostgreSQL · Docker",
    layers: ["gRPC + Webhook", "Application Core", "Infrastructure", "Postgres + RabbitMQ"],
    highlights: [
      "Hexagonal architecture — domain/application core has zero framework dependencies",
      "Inbound gRPC for internal callers, signed HTTPS webhook (HMAC-SHA512) from Paystack",
      "Idempotency keys prevent duplicate charges/refunds on retried calls",
      "Prometheus metrics, correlation IDs, liveness + readiness health checks",
      "Rate limiting, IP allow-listing, secrets never logged (deep redaction)",
    ],
    status: "Shipped",
    github: "https://github.com/AbubakarImam/payment",
  },
  {
    id: 2,
    asm: "ASM-11",
    title: "SpaceRent (ChangdiKiraya)",
    year: "2026",
    category: "Systems",
    stack: ".NET 8 · Clean Architecture · CQRS/MediatR · EF Core · PostgreSQL",
    layers: ["API", "Application (CQRS)", "Infrastructure", "Domain"],
    highlights: [
      "Onion architecture — Domain / Application / Infrastructure / API, dependencies point inward",
      "CQRS with MediatR + FluentValidation on every command and query",
      "Geospatial search: city, price range, capacity, and lat/lng radius filters",
      "Media pipeline for thumbnail, batch image, and video uploads (up to 200MB)",
      "Full booking + review + amenities domain modeled with EF Core migrations",
    ],
    status: "In service",
    github: "https://github.com/AbubakarImam/ChangdiKiraya",
  },
  {
    id: 3,
    asm: "ASM-12",
    title: "BookBazaar",
    year: "2025",
    category: "Systems",
    stack: "React · Express · TypeScript · Passport.js · Zod",
    layers: ["React Client", "Express REST API", "Passport.js Auth", "Storage"],
    highlights: [
      "Session-based auth with Passport.js across register/login/logout",
      "REST API for listings, purchases, comments, and direct messaging",
      "Shared Zod schema package keeps client and server types in lock-step",
      "Sequence-diagrammed flows for auth, purchase, comments, and messaging",
    ],
    status: "Shipped",
    github: "https://github.com/AbubakarImam/bookStore",
  },
  {
    id: 4,
    asm: "ASM-01",
    title: "Interno",
    year: "2023",
    category: "Frontend",
    stack: "React · Interior-design catalogue UI",
    image: "/images/projects/portfolio1.png",
    status: "Shipped",
    github: "https://github.com/AbubakarImam/interior-design",
    demo: "https://abubakarimaminterno.netlify.app/",
  },
  {
    id: 5,
    asm: "ASM-02",
    title: "Shoe Landing Page",
    year: "2022",
    category: "Frontend",
    stack: "HTML · CSS · JavaScript",
    image: "/images/projects/portfolio2.png",
    status: "Shipped",
    github: "https://github.com/AbubakarImam/shoepage",
    demo: "https://abubakarimam.github.io/shoepage/",
  },
  {
    id: 6,
    asm: "ASM-03",
    title: "City Tour",
    year: "2023",
    category: "Frontend",
    stack: "React · Firebase · Booking flow",
    image: "/images/projects/portfolio3.png",
    status: "Shipped",
    github: "https://github.com/AbubakarImam/tour-app",
    demo: "https://abubakarimamtour.netlify.app/",
  },
  {
    id: 7,
    asm: "ASM-04",
    title: "Travel Agency",
    year: "2022",
    category: "Frontend",
    stack: "React · Tailwind CSS",
    image: "/images/projects/portfolio4.png",
    status: "Shipped",
    github: "https://github.com/AbubakarImam/travel-agency",
    demo: "https://abubakarimamtravelagency.netlify.app/",
  },
  {
    id: 8,
    asm: "ASM-05",
    title: "ImamFits",
    year: "2023",
    category: "Frontend",
    stack: "React · E-commerce storefront",
    image: "/images/projects/portfolio5.png",
    status: "Shipped",
    github: "https://github.com",
    demo: "https://imamfits.netlify.app/",
    demoIsPlaceholder: true,
  },
  {
    id: 9,
    asm: "ASM-06",
    title: "Portfolio (2022)",
    year: "2022",
    category: "Frontend",
    stack: "React · React Bootstrap",
    image: "/images/projects/portfolio6.png",
    status: "Shipped",
    github: "https://github.com",
    demo: "https://abubakarimam.github.io/",
    demoIsPlaceholder: true,
  },
  {
    id: 10,
    asm: "ASM-07",
    title: "Restaurant Menu",
    year: "2023",
    category: "Frontend",
    stack: "React · Digital menu ordering UI",
    image: "/images/projects/portfolio7.png",
    status: "Shipped",
    github: "https://github.com/AbubakarImam/menu-app",
    demo: "https://abubakarimammenuapp.netlify.app/",
  },
  {
    id: 11,
    asm: "ASM-08",
    title: "Koya App",
    year: "2024",
    category: "Frontend",
    stack: "Next.js · Product application",
    image: "/images/projects/portfolio8.jpg",
    status: "Shipped",
    github: "https://github.com",
    demo: "https://koya-app-xqi1.vercel.app/",
    demoIsPlaceholder: true,
  },
  {
    id: 12,
    asm: "ASM-09",
    title: "Moviebox App",
    year: "2024",
    category: "Frontend",
    stack: "React · Movie discovery UI",
    image: "/images/projects/portfolio9.jpg",
    status: "Shipped",
    github: "https://github.com",
    demo: "https://moviebox-sooty.vercel.app/",
    demoIsPlaceholder: true,
  },
];

export const emailjs = {
  serviceId: "Portfolio Page",
  templateId: "template_fmifk0m",
  publicKey: "DVhPMNlK-3Z8unARc",
};
