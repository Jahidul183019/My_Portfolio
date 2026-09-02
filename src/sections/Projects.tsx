import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, ExternalLink, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type ProjectLink = {
  label: string;
  href: string;
  kind: "github" | "demo" | "source";
};

type Project = {
  id: number;
  title: string;
  description: string;
  longDescription: string;
  category: string;
  technologies: string[];
  thumbnail?: string;
  featured: boolean;
  links: ProjectLink[];
};

const PROJECTS: Project[] = [
  {
    id: 1,
    title: "MediMart Full Stack",
    description: "Full-stack medical store management system modernizing pharmacy operations with real-time workflows and secure access.",
    longDescription: "A full-stack medical store management system designed to modernize pharmacy operations. It combines a React and Vite frontend with a Spring Boot backend, MySQL persistence, JWT-based authentication, WebSocket updates, and REST APIs for a responsive workflow.",
    category: "Full Stack",
    technologies: ["React", "Vite", "Spring Boot", "MySQL", "JWT", "WebSocket", "REST API"],
    thumbnail: "project-1.png",
    featured: true,
    links: [
      { label: "Backend", href: "https://github.com/Jahidul183019/medimart-backend", kind: "github" },
      { label: "Frontend", href: "https://github.com/Jahidul183019/medimart-frontend", kind: "github" },
      { label: "Demo", href: "https://medimart-frontend-coral.vercel.app/", kind: "demo" },
    ],
  },
  {
    id: 2,
    title: "MediMart JavaFX",
    description: "Object Oriented Design and Programming Lab academic pharmacy management system built for desktop workflows and structured inventory handling.",
    longDescription: "An academic pharmacy management system built with JavaFX and SQLite for the Object Oriented Design and Programming Lab course. The project demonstrates desktop application design, sockets, multithreading, and object-oriented programming while solving core store management tasks.",
    category: "Academic",
    technologies: ["Java", "JavaFX", "SQLite", "Sockets", "Multithreading", "OOP"],
    featured: true,
    links: [
      { label: "Code", href: "https://github.com/Jahidul183019/MediMart", kind: "github" },
      { label: "Demo", href: "https://youtu.be/5leGbDB31lU", kind: "demo" },
    ],
  },
  {
    id: 3,
    title: "Escape Room Conquest",
    description: "Structured Programming Course multi-level escape room game focused on puzzle solving, AI behavior, and interactive game logic.",
    longDescription: "A multi-level escape room game built with C++ and SDL2 for the Structured Programming Course. It includes an AI system, game logic, and graphics work to create an interactive academic game project with layered challenges.",
    category: "Academic",
    technologies: ["C++", "SDL2", "AI System", "Game Logic", "Graphics"],
    featured: false,
    links: [
      { label: "Code", href: "https://github.com/Jahidul183019/CSE-1-2-Project-", kind: "github" },
      { label: "Demo", href: "https://youtu.be/cIk5d49OHYo", kind: "demo" },
    ],
  },
  {
    id: 4,
    title: "DSA - Data Structures & Algorithms in C++",
    description: "Personal DSA collection covering reusable implementations and algorithm practice in C++.",
    longDescription: "A personal collection of data structures and algorithms implemented in C++. The repository serves as a study and reference resource for common problem-solving patterns, STL usage, and reusable algorithm templates.",
    category: "Resources",
    technologies: ["C++", "Data Structures", "Algorithms", "STL"],
    thumbnail: "project-4.png",
    featured: false,
    links: [
      { label: "Code", href: "https://github.com/Jahidul183019/DSA", kind: "github" },
    ],
  },
  {
    id: 5,
    title: "ShareBox",
    description: "Ephemeral real-time sharing app to exchange text, code, images and videos via rooms.",
    longDescription: "ShareBox is an ephemeral sharing app: create a room, hand someone the 6-character code, and exchange text, code snippets, images, and videos in real time. It combines a Vite/React frontend with a FastAPI backend and WebSocket-powered rooms; easy to run locally or deploy to Render.",
    category: "Web App",
    technologies: ["React", "Vite", "FastAPI", "WebSockets", "Python"],
    thumbnail: "https://raw.githubusercontent.com/Jahidul183019/ShareBox/main/frontend/public/icon.svg",
    featured: false,
    links: [
      { label: "Code", href: "https://github.com/Jahidul183019/ShareBox", kind: "github" },
      { label: "Demo", href: "https://share-box-blush.vercel.app/", kind: "demo" },
    ],
  },
  {
    id: 6,
    title: "PoishaGo",
    description: "DBMS Lab Full-stack Mobile Financial Service platform with fraud detection, loyalty rewards, and live support.",
    longDescription: "PoishaGo is a full-stack, state-of-the-art Mobile Financial Service (MFS) application engineered for the Database Management Systems (DBMS) Lab course. Built with a React dashboard and FastAPI backend sharing one PostgreSQL source of truth, it features peer-to-peer transfers, merchant payments, utility bill processing, agent banking, a real-time fraud detection engine with 5 configurable rules, tiered loyalty rewards (Bronze → Platinum), 4-role admin RBAC, dual-factor money movement (PIN + email OTP), festival cashback campaigns, and WebSocket-powered live support chat — all deployed on Vercel, Render, and Supabase.",
    category: "Academic",
    technologies: ["React", "FastAPI", "PostgreSQL", "WebSockets", "JWT", "Supabase", "Vercel"],
    thumbnail: "project-6.png",
    featured: true,
    links: [
      { label: "Code", href: "https://github.com/Jahidul183019/PoishaGo", kind: "github" },
      { label: "Demo", href: "https://poisha-go.vercel.app", kind: "demo" },
      { label: "Video", href: "https://youtu.be/awSXqrr5GCM?si=JjkWrgGme4-V84wp", kind: "demo" },
    ],
  },
  {
    id: 7,
    title: "VitalsCare",
    description: "AI-powered community health risk radar for non-communicable disease screening in underserved communities.",
    longDescription: "VitalsCare is an AI-powered HealthTech platform for non-communicable disease screening in rural and underserved communities, built for THE INFINITY AI BUILDFEST 2026 at Brac University. It combines XGBoost ML models (hypertension, diabetes, CVD, malnutrition risk scoring), a RAG pipeline grounded in WHO and Bangladesh DGHS clinical guidelines, a knowledge graph for multi-morbidity interaction detection, and Gemini LLM for personalized recommendations — all wrapped in a bilingual (English & Bengali) React dashboard with real-time conversational Health Agent and PDF report generation.",
    category: "Hackathon",
    technologies: ["React", "FastAPI", "XGBoost", "Gemini", "RAG", "Knowledge Graph", "Vite"],
    thumbnail: "project-7.png",
    featured: true,
    links: [
      { label: "Code", href: "https://github.com/Jahidul183019/VitalsCare", kind: "github" },
      { label: "Demo", href: "https://health-risk-radar.vercel.app", kind: "demo" },
    ],
  },
  {
    id: 8,
    title: "QueueStorm",
    description: "AI-powered support-ticket analysis API for digital finance platforms with hybrid rule + LLM architecture.",
    longDescription: "QueueStorm is an AI-powered support-ticket analysis API for digital finance platforms. It classifies complaints, cross-references transaction evidence, and generates structured responses for routing and resolution. Built with a hybrid 9-step pipeline: rule-based language detection, prompt injection pre-screening, evidence extraction, case classification, and safety filtering — with Groq API (Llama 3.3 70B) handling only natural language text generation. Dockerized and production-ready.",
    category: "Hackathon",
    technologies: ["Python", "FastAPI", "Groq API", "Llama 3", "Docker"],
    featured: false,
    links: [
      { label: "Code", href: "https://github.com/Jahidul183019/QueueStorm", kind: "github" },
    ],
  },
  {
    id: 10,
    title: "CoWork — Room Booking API",
    description: "Multi-tenant coworking space room booking REST API with JWT auth, dynamic pricing, and concurrency handling.",
    longDescription: "A REST API for managing bookable rooms inside a coworking space across multiple tenant organizations. Built for the ICT Fest Hackathon with FastAPI + SQLite + JWT auth + Docker. Features multi-tenant isolation, robust concurrency handling against double-booking and quota violations, tiered refund logic based on cancellation notice period, rate-limited endpoints, comprehensive date-range usage reports, and CSV export. Zero-config SQLite database with automatic schema provisioning.",
    category: "Hackathon",
    technologies: ["Python", "FastAPI", "SQLite", "JWT", "Docker", "Pytest"],
    featured: false,
    links: [
      { label: "Code", href: "https://github.com/Jahidul183019/ICT_Fest_Hackathon_Preliminary", kind: "github" },
    ],
  },
  {
    id: 11,
    title: "STM-32 Labs",
    description: "Step-by-step STM32 labs for NUCLEO-F446RE covering both HAL and bare-metal embedded programming.",
    longDescription: "A collection of step-by-step STM32 labs for the NUCLEO-F446RE board. Covers both HAL-based programming (using STM32CubeMX code generation and STM32CubeIDE) and bare-metal programming (direct register manipulation without HAL). Includes assignments on GPIO, timers, interrupts, UART, and more with detailed setup instructions for macOS and Windows.",
    category: "Embedded",
    technologies: ["C", "STM32", "ARM Cortex-M4", "HAL", "Bare Metal"],
    featured: false,
    links: [
      { label: "Code", href: "https://github.com/Jahidul183019/STM-32", kind: "github" },
    ],
  },
  {
    id: 12,
    title: "Vantage Robotics",
    description: "High-performance 3D digital twin of a 6-DOF robotic arm with IK solver and voice command copilot.",
    longDescription: "A high-performance digital twin and 3D simulation suite for a 6-DOF robotic arm, built for the IUT Techathon Final Round. Features real-time WebGL visualization using Three.js and React Three Fiber at 60 FPS, a Coordinate Descent Inverse Kinematics solver, 2cm path interpolation for smooth joint transitions, a voice copilot integrating Web Speech API with Groq LLM (Llama 3.1) for natural language commands, and a Wokwi ESP32/Arduino circuit simulation for hardware integration.",
    category: "Hackathon",
    technologies: ["TypeScript", "React", "Three.js", "Zustand", "Groq API", "Wokwi"],
    thumbnail: "project-12.jpg",
    featured: true,
    links: [
      { label: "Code", href: "https://github.com/Jahidul183019/IUT_TECHATHON_FINAL", kind: "github" },
      { label: "Demo", href: "https://techrun-topaz.vercel.app/", kind: "demo" },
      { label: "Wokwi", href: "https://wokwi.com/projects/469130364647577601", kind: "demo" },
    ],
  },
  {
    id: 13,
    title: "Smart Office IoT Monitor",
    description: "Real-time smart office energy and device-monitoring platform with dashboard, Discord bot, and IoT simulation.",
    longDescription: "A real-time smart office energy and device-monitoring platform built for the IUT Techathon preliminary round. Features a FastAPI backend with shared in-memory device store, React dashboard with WebSocket live updates, and a Discord operations bot — all sharing one live IoT state. Simulates 15 devices across 3 rooms with time-of-day bias, automated after-hours alerts, power insight analytics, and a Wokwi ESP32 hardware circuit simulation. Deployed on Render.",
    category: "Hackathon",
    technologies: ["React", "FastAPI", "WebSockets", "Discord.js", "Wokwi", "Vite"],
    thumbnail: "project-13.png",
    featured: false,
    links: [
      { label: "Code", href: "https://github.com/Jahidul183019/Techathon2026-DU_AlgoArchitects", kind: "github" },
      { label: "Dashboard", href: "https://iot-smart-home-dashboard.onrender.com", kind: "demo" },
      { label: "Wokwi", href: "https://wokwi.com/projects/468536088941998081", kind: "demo" },
    ],
  },
  {
    id: 14,
    title: "Guessing Number Game",
    description: "A simple Java guessing game — first project practicing core Java fundamentals and logic building.",
    longDescription: "A simple Java project — a Guessing Number Game designed to practice Java programming, problem-solving, and logic-building skills. The computer randomly selects a number, the player guesses with high/low feedback, and the game tracks attempts. Demonstrates Java syntax fundamentals, user input handling, conditional logic, loops, and random number generation.",
    category: "Mock Project",
    technologies: ["Java", "OOP"],
    featured: false,
    links: [
      { label: "Code", href: "https://github.com/Jahidul183019/Guessing-Number-Game", kind: "github" },
      { label: "Demo", href: "https://www.youtube.com/watch?v=xHvuDeWcaHk", kind: "demo" },
    ],
  },
];

export function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", ...Array.from(new Set(PROJECTS.map((p) => p.category)))];

  const filteredProjects = activeCategory === "All"
    ? PROJECTS
    : PROJECTS.filter((p) => p.category === activeCategory);

  const getYouTubeVideoId = (href: string) => {
    try {
      const url = new URL(href);

      if (url.hostname.includes("youtu.be")) {
        return url.pathname.split("/").filter(Boolean)[0] ?? null;
      }

      if (url.hostname.includes("youtube.com")) {
        if (url.pathname === "/watch") {
          return url.searchParams.get("v");
        }

        if (url.pathname.startsWith("/shorts/")) {
          return url.pathname.split("/").filter(Boolean)[1] ?? null;
        }
      }
    } catch {
      return null;
    }

    return null;
  };

  const getProjectThumbnail = (project: Project) => {
    const localThumbnail = getImageSrc(project.thumbnail);

    if (localThumbnail) {
      return localThumbnail;
    }

    const demoLink = project.links.find((link) => link.kind === "demo")?.href;

    if (demoLink) {
      const videoId = getYouTubeVideoId(demoLink);

      if (videoId) {
        return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      }

      return `https://image.thum.io/get/width/1280/crop/900/noanimate/${encodeURIComponent(demoLink)}`;
    }

    return null;
  };

  const getImageSrc = (thumbnail?: string) => {
    if (!thumbnail) {
      return null;
    }

    if (thumbnail.startsWith("http")) {
      return thumbnail;
    }

    return `${import.meta.env.BASE_URL}images/${thumbnail}`;
  };

  return (
    <section id="projects" className="py-16 sm:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold inline-block relative">
            Featured <span className="text-gradient">Projects</span>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-secondary rounded-full" />
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            A selection of full-stack, academic, and systems-focused work built around practical problem solving.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`
                px-5 py-2 rounded-full text-sm font-medium transition-all duration-300
                border
                ${activeCategory === cat
                  ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/25"
                  : "bg-white/5 text-muted-foreground border-white/10 hover:border-primary/40 hover:text-foreground"
                }
              `}
            >
              {cat}
              <span className={`
                ml-2 text-xs px-1.5 py-0.5 rounded-full
                ${activeCategory === cat
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-white/10 text-muted-foreground"
                }
              `}>
                {cat === "All" ? PROJECTS.length : PROJECTS.filter((p) => p.category === cat).length}
              </span>
            </button>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          <AnimatePresence mode="popLayout">
          {filteredProjects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-2xl overflow-hidden group cursor-pointer flex flex-col h-full hover:border-primary/40 transition-colors duration-300"
              onClick={() => setSelectedProject(project)}
            >
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent z-10" />
                {getProjectThumbnail(project) ? (
                  <img
                    src={getProjectThumbnail(project) as string}
                    alt={project.title}
                    className="max-w-full max-h-full object-contain mx-auto transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 via-secondary/20 to-background flex items-end p-5">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-primary/80 mb-2">{project.category}</p>
                      <h3 className="text-xl font-display font-bold text-foreground">{project.title}</h3>
                    </div>
                  </div>
                )}
                {project.featured && (
                  <span className="absolute top-4 left-4 z-20 px-3 py-1 rounded-full text-xs font-semibold bg-primary text-primary-foreground shadow-lg">
                    Featured
                  </span>
                )}
              </div>
              
              <div className="p-6 flex flex-col flex-grow relative z-20 -mt-6">
                <div className="flex items-center justify-between gap-4 mb-2">
                  <span className="text-xs uppercase tracking-[0.25em] text-primary/80">{project.category}</span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
                <p className="text-muted-foreground text-xs sm:text-sm mt-1 mb-4 flex-grow leading-relaxed">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.technologies.slice(0, 3).map((tech) => (
                    <span key={tech} className="text-xs font-medium px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-primary">
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-muted-foreground">
                      +{project.technologies.length - 3}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between mt-auto">
                  <span className="text-sm font-medium text-foreground flex items-center gap-1 group-hover:text-primary transition-colors">
                    View Details <ArrowRight className="w-4 h-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-1 transition-all" />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center p-0 sm:p-6 isolate">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-[300] bg-background/80 backdrop-blur-sm"
              onClick={() => setSelectedProject(null)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-[310] w-full max-w-3xl glass-card rounded-t-2xl sm:rounded-2xl overflow-hidden border border-white/10 shadow-2xl flex flex-col max-h-[95dvh] sm:max-h-[90vh]"
            >
              <button 
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 text-white hover:bg-primary hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="h-48 sm:h-64 md:h-80 relative shrink-0 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10" />
                {getProjectThumbnail(selectedProject) ? (
                  <img
                    src={getProjectThumbnail(selectedProject) as string}
                    alt={selectedProject.title}
                    className="max-w-full max-h-full object-contain mx-auto"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 via-secondary/20 to-background" />
                )}
              </div>

              <div className="p-6 sm:p-8 flex-grow overflow-y-auto relative z-20 bg-card">
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-4">
                  {selectedProject.title}
                </h2>

                <p className="text-sm uppercase tracking-[0.3em] text-primary mb-5">
                  {selectedProject.category}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedProject.technologies.map((tech) => (
                    <span key={tech} className="text-sm font-medium px-3 py-1 rounded-md bg-primary/10 border border-primary/20 text-primary">
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="prose prose-invert max-w-none mt-2">
                  <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                    {selectedProject.longDescription}
                  </p>
                </div>

                <div className="flex flex-wrap gap-4 mt-8 pt-6 border-t border-white/10">
                  {selectedProject.links.map((link) => (
                    <Button
                      key={link.label}
                      asChild
                      variant={link.kind === "demo" ? "outline" : "default"}
                      className="gap-2"
                    >
                      <a href={link.href} target="_blank" rel="noreferrer">
                        {link.kind === "demo" ? <ExternalLink className="w-4 h-4" /> : <Github className="w-4 h-4" />}
                        {link.label}
                      </a>
                    </Button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

// Just for icon typing in Projects preview
function ArrowRight(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
