import { useEffect } from "react";
import { useLocation } from "wouter";
import { CustomCursor } from "@/components/CustomCursor";
import { Starfield } from "@/components/Starfield";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/sections/Hero";
import { About } from "@/sections/About";
import { Projects } from "@/sections/Projects";
import { Contact } from "@/sections/Contact";

export default function Home() {
  const [location] = useLocation();

  useEffect(() => {
    const section = location.replace("/", "");
    if (!section) return;

    // Wait for sections to mount before trying to scroll.
    requestAnimationFrame(() => {
      document
        .getElementById(section)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [location]);

  return (
    <>
      <Starfield />
      <CustomCursor />
      <Navbar />
      
      <main className="relative">
        <Hero />
        <About />
        <Projects />
        <Contact />
      </main>

      <footer className="py-8 text-center border-t border-white/5 relative bg-background/50 backdrop-blur-sm">
        <p className="text-muted-foreground text-sm">
          © {new Date().getFullYear()} MD. Jahidul Islam. All rights reserved.
        </p>
      </footer>
    </>
  );
}
