import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Github, Linkedin, Terminal, Download, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

import { useMediaQuery } from "@/hooks/use-media-query";
import { scrollToSection } from "@/lib/scroll";

const TITLES = [
  "Full Stack Developer",
  "Problem Solver",
  "Tech Enthusiast",
];

const CODE_SNIPPET = `const developer = {
  name: 'Jahidul Islam',
  role: 'Student',
  skills: ['C', 'C++', 'Java', 'Python', 'JavaScript'],
  passion: 'Building solutions',
  code: () => 'Clean & Efficient'
};
// Let's build something amazing! `;

const HIGHLIGHTED_CODE = CODE_SNIPPET
  .replace(/const developer/g, '<span class="text-violet-700 dark:text-violet-300">const</span> <span class="text-sky-700 dark:text-sky-300">developer</span>')
  .replace(/name:|role:|skills:|passion:|code:/g, match => `<span class="text-cyan-700 dark:text-cyan-300">${match}</span>`)
  .replace(/'Jahidul Islam'|'Student'|'C'|'C\+\+'|'Java'|'Python'|'JavaScript'|'Building solutions'|'Clean & Efficient'/g, match => `<span class="text-emerald-700 dark:text-emerald-300">${match}</span>`)
  .replace(/true/g, '<span class="text-amber-700 dark:text-amber-300">true</span>')
  .replace(/function/g, '<span class="text-violet-700 dark:text-violet-300">function</span>')
  .replace(/return/g, '<span class="text-violet-700 dark:text-violet-300">return</span>');

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const inView = useInView(heroRef, { amount: 0.2 });
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [titleIndex, setTitleIndex] = useState(0);
  const resumeHref = `${import.meta.env.BASE_URL}Resume.pdf`;

  useEffect(() => {
    if (!inView || reducedMotion) return;
    let interval: ReturnType<typeof setInterval> | undefined;
    const synchronize = () => {
      clearInterval(interval);
      if (!document.hidden) interval = setInterval(() => {
        setTitleIndex((prev) => (prev + 1) % TITLES.length);
      }, 3000);
    };
    synchronize();
    document.addEventListener("visibilitychange", synchronize);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", synchronize);
    };
  }, [inView, reducedMotion]);

  const scrollTo = (href: string) => {
    scrollToSection(document.querySelector(href));
  };

  return (
    <section ref={heroRef} id="home" className="min-h-[100dvh] pt-20 sm:pt-24 pb-12 flex items-center relative overflow-hidden">
      {/* Background Decorative Shapes */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Left Content */}
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 30 }}
          animate={reducedMotion ? { opacity: [1, 1], y: [0, 0] } : { opacity: 1, y: 0 }}
          transition={reducedMotion ? { duration: 0, delay: 0 } : { duration: 0.8 }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <motion.div
              initial={reducedMotion ? false : { opacity: 0, x: -20 }}
              animate={reducedMotion ? { opacity: [1, 1], x: [0, 0] } : { opacity: 1, x: 0 }}
              transition={reducedMotion ? { duration: 0, delay: 0 } : { delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border-primary/20 text-primary text-sm font-medium"
            >
              <Terminal className="w-4 h-4" />
              <span>Hello, I'm</span>
            </motion.div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-tight">
              <span className="block text-foreground">MD. Jahidul</span>
              <span className="text-gradient">Islam</span>
            </h1>

            <div className="min-h-14 sm:min-h-12 flex items-center flex-wrap gap-x-2">
              <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-muted-foreground font-medium">
                I am a{" "}
              </span>
              <motion.span
                key={titleIndex}
                initial={reducedMotion ? false : { opacity: 0, y: 20 }}
                animate={reducedMotion ? { opacity: [1, 1], y: [0, 0] } : { opacity: 1, y: 0 }}
                exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -20 }}
                className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-display font-semibold text-foreground"
                transition={reducedMotion ? { duration: 0, delay: 0 } : undefined}
              >
                {TITLES[titleIndex]}
              </motion.span>
            </div>

            <p className="text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed">
              Building software that is clean, efficient, and practical. I focus on turning ideas into reliable solutions with a strong engineering mindset.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Button size="lg" onClick={() => scrollTo("#projects")} className="group">
              View My Work
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => scrollTo("#contact")}>
              Get In Touch
            </Button>
            <Button size="lg" variant="glass" asChild>
              <a href={resumeHref} target="_blank" rel="noopener noreferrer">
                <Download className="w-4 h-4 mr-2" /> Resume
              </a>
            </Button>
          </div>

          <div className="flex items-center gap-6 pt-4">
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <a href="https://github.com/Jahidul183019" target="_blank" rel="noreferrer" aria-label="GitHub profile" className="w-11 h-11 rounded-full glass-card hover:-translate-y-1 hover:text-primary transition-all flex items-center justify-center shrink-0">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://www.linkedin.com/in/md-jahidul-islam-231879321" target="_blank" rel="noreferrer" aria-label="LinkedIn profile" className="w-11 h-11 rounded-full glass-card hover:-translate-y-1 hover:text-primary transition-all flex items-center justify-center shrink-0">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="https://leetcode.com/u/Jahidul1/" target="_blank" rel="noreferrer" aria-label="LeetCode" className="w-11 h-11 rounded-full glass-card hover:-translate-y-1 hover:text-primary transition-all flex items-center justify-center shrink-0">
                <img
                  src="https://leetcode.com/favicon.ico"
                  alt="LeetCode"
                  className="w-5 h-5 rounded-sm"
                  loading="lazy"
                />
              </a>
              <a href="https://codeforces.com/profile/Jahidul1" target="_blank" rel="noreferrer" aria-label="Codeforces" className="w-11 h-11 rounded-full glass-card hover:-translate-y-1 hover:text-primary transition-all flex items-center justify-center shrink-0">
                <img
                  src="https://codeforces.org/s/0/favicon-32x32.png"
                  alt="Codeforces"
                  className="w-5 h-5 rounded-sm"
                  loading="lazy"
                />
              </a>
              <a href="https://www.codechef.com/users/jahidul1" target="_blank" rel="noreferrer" aria-label="CodeChef" className="w-11 h-11 rounded-full glass-card hover:-translate-y-1 hover:text-primary transition-all flex items-center justify-center shrink-0">
                <img
                  src="https://cdn.codechef.com/favicon.ico"
                  alt="CodeChef"
                  className="w-5 h-5 rounded-sm"
                  loading="lazy"
                />
              </a>
            </div>
            
            <div className="h-12 w-px bg-white/10 hidden sm:block" />
            
            <div className="hidden sm:flex gap-6 text-sm">
              <div>
                <span className="block text-xl font-bold text-foreground">10+</span>
                <span className="text-muted-foreground">Projects</span>
              </div>
              <div>
                <span className="block text-xl font-bold text-foreground">16</span>
                <span className="text-muted-foreground">Technologies</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Content - Animated Code Window */}
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, scale: 0.9, rotateX: 10 }}
          animate={reducedMotion ? { opacity: [1, 1], scale: [1, 1], rotateX: [0, 0] } : { opacity: 1, scale: 1, rotateX: 0 }}
          transition={reducedMotion ? { duration: 0, delay: 0 } : { duration: 0.8, delay: 0.3 }}
          className="relative perspective-1000 max-w-xl mx-auto w-full lg:max-w-none min-w-0"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="glass-card rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 shadow-2xl relative z-10 group code-window transition-all duration-500">
            {/* Window Controls */}
            <div className="bg-background/70 px-4 py-3 border-b border-black/10 dark:border-white/5 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
              <div className="flex-1 text-center text-xs font-mono text-muted-foreground mr-8">
                portfolio.js
              </div>
            </div>
            {/* Code */}
            <div className="p-3 sm:p-4 md:p-6 bg-card font-mono text-[11px] sm:text-xs md:text-sm leading-relaxed sm:leading-loose overflow-x-auto">
              <pre className="text-card-foreground">
                <code dangerouslySetInnerHTML={{
                  __html: HIGHLIGHTED_CODE
                }} />
              </pre>
            </div>
          </div>
          {/* Decorative glows behind window */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30 blur-2xl -z-10 rounded-3xl transform scale-105 opacity-50" />
        </motion.div>
      </div>
    </section>
  );
}
