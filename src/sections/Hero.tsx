import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Terminal, Download, ArrowRight, Code } from "lucide-react";
import { Button } from "@/components/ui/button";

const TITLES = [
  "Software Engineer",
  "Full Stack Developer",
  "Problem Solver",
  "Tech Enthusiast",
];

const CODE_SNIPPET = `const developer = {
  name: 'Jahidul Islam',
  role: 'Software Engineer',
  skills: ['C', 'C++', 'Java', 'Python'],
  passion: 'Building solutions',
  code: () => 'Clean & Efficient'
};
// Let's build something amazing! 🚀`;

export function Hero() {
  const [titleIndex, setTitleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTitleIndex((prev) => (prev + 1) % TITLES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home" className="min-h-screen pt-24 pb-12 flex items-center relative overflow-hidden">
      {/* Background Decorative Shapes */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border-primary/20 text-primary text-sm font-medium"
            >
              <Terminal className="w-4 h-4" />
              <span>Hello, I'm</span>
            </motion.div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold leading-tight">
              <span className="block text-foreground">MD. Jahidul</span>
              <span className="text-gradient">Islam</span>
            </h1>

            <div className="h-10 sm:h-12 flex items-center">
              <span className="text-xl sm:text-2xl lg:text-3xl text-muted-foreground font-medium">
                I am a{" "}
              </span>
              <motion.span
                key={titleIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="ml-2 text-xl sm:text-2xl lg:text-3xl font-display font-semibold text-foreground"
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
              <a href="/Resume.pdf" target="_blank" rel="noopener noreferrer">
                <Download className="w-4 h-4 mr-2" /> Resume
              </a>
            </Button>
          </div>

          <div className="flex items-center gap-6 pt-4">
            <div className="flex gap-4">
              <a href="https://github.com/Jahidul183019" target="_blank" rel="noreferrer" className="p-3 rounded-full glass-card hover:-translate-y-1 hover:text-primary transition-all">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://www.linkedin.com/in/md-jahidul-islam-231879321" target="_blank" rel="noreferrer" className="p-3 rounded-full glass-card hover:-translate-y-1 hover:text-primary transition-all">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="https://leetcode.com/u/Jahidul1/" target="_blank" rel="noreferrer" className="p-3 rounded-full glass-card hover:-translate-y-1 hover:text-primary transition-all flex items-center justify-center font-display font-bold text-sm">
                LC
              </a>
            </div>
            
            <div className="h-12 w-px bg-white/10 hidden sm:block" />
            
            <div className="hidden sm:flex gap-6 text-sm">
              <div>
                <span className="block text-xl font-bold text-foreground">3+</span>
                <span className="text-muted-foreground">Projects</span>
              </div>
              <div>
                <span className="block text-xl font-bold text-foreground">10+</span>
                <span className="text-muted-foreground">Technologies</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Content - Animated Code Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotateX: 10 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative hidden lg:block perspective-1000"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="glass-card rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative z-10 group hover:-translate-y-2 hover:rotate-x-2 hover:rotate-y-[-2deg] transition-all duration-500">
            {/* Window Controls */}
            <div className="bg-background/50 px-4 py-3 border-b border-white/5 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
              <div className="flex-1 text-center text-xs font-mono text-muted-foreground mr-8">
                developer.js
              </div>
            </div>
            {/* Code */}
            <div className="p-6 bg-[#0d1117] font-mono text-sm leading-loose">
              <pre className="text-gray-300">
                <code dangerouslySetInnerHTML={{
                  __html: CODE_SNIPPET
                    .replace(/const developer/g, '<span class="text-purple-400">const</span> <span class="text-blue-400">developer</span>')
                    .replace(/name:|role:|skills:|passion:|code:/g, match => `<span class="text-cyan-400">${match}</span>`)
                    .replace(/'Jahidul Islam'|'Software Engineer'|'C'|'C\+\+'|'Java'|'Python'|'Building solutions'|'Clean & Efficient'/g, match => `<span class="text-green-400">${match}</span>`)
                    .replace(/true/g, '<span class="text-orange-400">true</span>')
                    .replace(/function/g, '<span class="text-purple-400">function</span>')
                    .replace(/return/g, '<span class="text-purple-400">return</span>')
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
