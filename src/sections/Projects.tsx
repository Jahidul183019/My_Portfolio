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
    description: "Academic pharmacy management system built for desktop workflows and structured inventory handling.",
    longDescription: "An academic pharmacy management system built with JavaFX and SQLite. The project demonstrates desktop application design, sockets, multithreading, and object-oriented programming while solving core store management tasks.",
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
    description: "Multi-level escape room game focused on puzzle solving, AI behavior, and interactive game logic.",
    longDescription: "A multi-level escape room game built with C++ and SDL2. It includes an AI system, game logic, and graphics work to create an interactive academic game project with layered challenges.",
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
];

export function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

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
    <section id="projects" className="py-24 relative">
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PROJECTS.map((project, i) => (
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
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
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
                <p className="text-muted-foreground text-sm mb-4 flex-grow leading-relaxed">
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
        </div>
      </div>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setSelectedProject(null)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl glass-card rounded-2xl overflow-hidden border border-white/10 shadow-2xl flex flex-col max-h-[90vh]"
            >
              <button 
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 text-white hover:bg-primary hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="h-64 sm:h-80 relative shrink-0">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e27] to-transparent z-10" />
                {getProjectThumbnail(selectedProject) ? (
                  <img
                    src={getProjectThumbnail(selectedProject) as string}
                    alt={selectedProject.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 via-secondary/20 to-background" />
                )}
              </div>

              <div className="p-6 sm:p-8 flex-grow overflow-y-auto relative z-20 bg-[#0a0e27]">
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

                <div className="prose prose-invert max-w-none">
                  <p className="text-muted-foreground leading-relaxed text-base sm:text-lg">
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
