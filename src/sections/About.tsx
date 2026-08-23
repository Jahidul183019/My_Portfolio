import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Code2, Database, Layout, Server, Wrench, Trophy } from "lucide-react";

const SKILL_CATEGORIES = ["All", "Frontend", "Backend", "Programming", "Database", "Tools"];

const SKILLS = [
  { name: "React", category: "Frontend", icon: Layout },
  { name: "Vite", category: "Frontend", icon: Layout },
  { name: "JavaScript", category: "Frontend", icon: Code2 },
  { name: "FastAPI", category: "Backend", icon: Server },
  { name: "Spring Boot", category: "Backend", icon: Server },
  { name: "Node.js", category: "Backend", icon: Server },
  { name: "C", category: "Programming", icon: Code2 },
  { name: "C++", category: "Programming", icon: Code2 },
  { name: "Java", category: "Programming", icon: Code2 },
  { name: "Python", category: "Programming", icon: Code2 },
  { name: "PostgreSQL", category: "Database", icon: Database },
  { name: "MySQL", category: "Database", icon: Database },
  { name: "SQLite", category: "Database", icon: Database },
  { name: "Git", category: "Tools", icon: Wrench },
  { name: "IntelliJ", category: "Tools", icon: Wrench },
  { name: "VS Code", category: "Tools", icon: Wrench },
];

const EDUCATION = [
  {
    degree: "Bachelor of Science in Computer Science and Engineering",
    institution: "University of Dhaka",
    year: "2024-Present",
    status: "active"
  },
  {
    degree: "Secondary & Higher Secondary Education",
    institution: "Ispahani Public School & College",
    year: "Completed",
    status: "completed"
  }
];

const ACHIEVEMENTS = [
  {
    title: "Finalist",
    competition: "THE INFINITY AI BUILDFEST 2026",
    institution: "Brac University",
    project: "VitalsCare"
  },
  {
    title: "Finalist",
    competition: "IUT Techathon",
    institution: "Islamic University of Technology",
    project: "Vantage Robotics"
  },
  {
    title: "21st out of 702 teams",
    competition: "Ramadan CTF 2026",
    institution: "DU_CyberPhantoms",
    project: "Web Exploitation, Crypto, RevEng"
  },
  {
    title: "52nd Place",
    competition: "Al Khwarizmi CTF 2025",
    institution: "DU_CyberPhantoms",
    project: "Web Exploitation & Crypto"
  }
];

export function About() {
  const [activeTab, setActiveTab] = useState("All");

  const filteredSkills = SKILLS.filter(
    (skill) => activeTab === "All" || skill.category === activeTab
  );

  return (
    <section id="about" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold inline-block relative">
            About <span className="text-gradient">Me</span>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary rounded-full" />
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_2fr] gap-12 items-start">
          
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-3xl p-6 text-center relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-primary/20 to-secondary/20 z-0" />
            
            <div className="relative z-10 w-32 h-32 mx-auto mt-4 mb-6 rounded-full p-1 bg-gradient-to-tr from-primary to-secondary">
              <div className="w-full h-full rounded-full overflow-hidden bg-background relative">
                <img 
                  src={`${import.meta.env.BASE_URL}images/avatar.jpeg`}
                  onError={(e) => {
                    e.currentTarget.src = "/me.jpeg";
                  }}
                  alt="MD. Jahidul Islam" 
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>

            <h3 className="text-xl font-bold text-foreground">MD. Jahidul Islam</h3>
            {/* <p className="text-primary font-medium mt-1 mb-4">Aspiring Software Engineer</p> */}
            <div className="mt-1 mb-4" />
            
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              I'm a Computer Science student at the University of Dhaka with a deep passion for software engineering.
              I specialize in building full-stack web applications using modern technologies like React, Next.js, Node.js, and Spring Boot.
              Beyond web development, I actively participate in competitive programming on LeetCode, Codeforces, and CodeChef,
              sharpening my algorithmic thinking every day.
            </p>

            {/* Education Timeline */}
            <div className="text-left mt-8">
              <h4 className="flex items-center gap-2 font-display font-semibold mb-4 text-foreground">
                <BookOpen className="w-5 h-5 text-primary" /> Education
              </h4>
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
                {EDUCATION.map((edu, i) => (
                  <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className={`flex items-center justify-center w-5 h-5 rounded-full border-4 border-background bg-primary shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 ${edu.status === 'active' ? 'animate-pulse' : ''}`} />
                    <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] glass-card p-4 rounded-xl border border-white/5 hover:border-primary/30 transition-colors">
                      <div className="text-xs text-primary mb-1">{edu.year}</div>
                      <div className="font-semibold text-foreground text-sm">{edu.degree}</div>
                      <div className="text-xs text-muted-foreground mt-1">{edu.institution}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements Timeline */}
            <div className="text-left mt-8">
              <h4 className="flex items-center gap-2 font-display font-semibold mb-4 text-foreground">
                <Trophy className="w-5 h-5 text-yellow-500" /> Awards & Achievements
              </h4>
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
                {ACHIEVEMENTS.map((ach, i) => (
                  <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-5 h-5 rounded-full border-4 border-background bg-yellow-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2" />
                    <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] glass-card p-4 rounded-xl border border-white/5 hover:border-yellow-500/30 transition-colors">
                      <div className="text-xs text-yellow-500 mb-1">{ach.competition}</div>
                      <div className="font-semibold text-foreground text-sm">{ach.title}</div>
                      <div className="text-xs text-muted-foreground mt-1">{ach.project} • {ach.institution}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Skills Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex flex-wrap gap-2 mb-8">
              {SKILL_CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveTab(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeTab === category
                      ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(0,212,255,0.4)]"
                      : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground border border-white/5"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <motion.div 
              layout
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
            >
              <AnimatePresence mode="popLayout">
                {filteredSkills.map((skill) => {
                  const Icon = skill.icon;
                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                      key={skill.name}
                      className="glass-card rounded-xl p-4 flex flex-col items-center justify-center gap-3 group hover:-translate-y-1 hover:border-primary/50 transition-all duration-300 cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                        <Icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors">
                        {skill.name}
                      </span>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
