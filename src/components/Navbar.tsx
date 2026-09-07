import { useMediaQuery } from "@/hooks/use-media-query";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";

import { scrollToSection } from "@/lib/scroll";

const NAV_LINKS = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Projects", href: "#projects" },
  { name: "Contact", href: "#contact" },
];

export function Navbar() {
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") return true;
    const root = document.documentElement;
    if (root.classList.contains("light")) return false;
    if (root.classList.contains("dark")) return true;
    return true;
  });
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const sections = NAV_LINKS.map((link) => document.getElementById(link.href.slice(1)));
    let frame: number | null = null;
    const update = () => {
      frame = null;
      const scrolled = window.scrollY > 50;
      let current = "";
      for (const element of sections) {
        if (!element) continue;
        const rect = element.getBoundingClientRect();
        if (rect.top <= 150 && rect.bottom >= 150) { current = element.id; break; }
      }
      setIsScrolled(scrolled);
      if (current) setActiveSection(current);
    };
    const schedule = () => { if (frame === null) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const observer = new ResizeObserver(([entry]) => {
      document.documentElement.style.setProperty("--header-height", `${entry.target.getBoundingClientRect().height}px`);
    });
    observer.observe(header, { box: "border-box" });
    return () => { observer.disconnect(); document.documentElement.style.removeProperty("--header-height"); };
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    menuRef.current?.querySelector("button")?.focus();
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    const focusin = (event: FocusEvent) => {
      if (event.target instanceof Node && !menuRef.current?.contains(event.target) && !menuButtonRef.current?.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("keydown", keydown);
    document.addEventListener("focusin", focusin);
    return () => {
      document.removeEventListener("keydown", keydown);
      document.removeEventListener("focusin", focusin);
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", isDark);
    root.classList.toggle("light", !isDark);
  }, [isDark]);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const scrollTo = (href: string) => {
    if (isMobileMenuOpen) menuButtonRef.current?.focus();
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      scrollToSection(element);
    }
  };

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-[70] transition-all duration-300 ${
          isScrolled ? "glass-nav py-3" : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <motion.button
            type="button"
            aria-label="Go to home section"
            initial={reducedMotion ? false : { opacity: 0, x: -20 }}
            animate={reducedMotion ? { opacity: [1, 1], x: [0, 0] } : { opacity: 1, x: 0 }}
            className="text-2xl font-display font-bold cursor-pointer"
            onClick={() => scrollTo("#home")}
            transition={reducedMotion ? { duration: 0, delay: 0 } : undefined}
          >
            <span className="text-gradient">&lt;JI /&gt;</span>
          </motion.button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex space-x-6">
              {NAV_LINKS.map((link, i) => (
                <motion.button
                  key={link.name}
                  initial={reducedMotion ? false : { opacity: 0, y: -10 }}
                  animate={reducedMotion ? { opacity: [1, 1], y: [0, 0] } : { opacity: 1, y: 0 }}
                  transition={reducedMotion ? { duration: 0, delay: 0 } : { delay: i * 0.1 }}
                  onClick={() => scrollTo(link.href)}
                  aria-current={activeSection === link.href.slice(1) ? "location" : undefined}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    activeSection === link.href.substring(1)
                      ? "text-primary"
                      : "text-foreground/70"
                  }`}
                >
                  {link.name}
                  {activeSection === link.href.substring(1) && (
                    <motion.div
                      layoutId={reducedMotion ? undefined : "activeNav"}
                      transition={reducedMotion ? { duration: 0, delay: 0 } : undefined}
                      className="h-0.5 w-full bg-primary mt-1 rounded-full"
                    />
                  )}
                </motion.button>
              ))}
            </nav>

            <motion.div
              initial={reducedMotion ? false : { opacity: 0 }}
              animate={reducedMotion ? { opacity: [1, 1] } : { opacity: 1 }}
              transition={reducedMotion ? { duration: 0, delay: 0 } : { delay: 0.4 }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
                className="rounded-full"
              >
                {isDark ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </Button>
            </motion.div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden relative z-[80] flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
                aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
              className="rounded-full"
            >
              {isDark ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation"
              ref={menuButtonRef}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Nav — rendered OUTSIDE header to avoid clipping */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={reducedMotion ? false : { opacity: 0 }}
              animate={reducedMotion ? { opacity: [1, 1] } : { opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={reducedMotion ? { duration: 0, delay: 0 } : undefined}
              className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm md:hidden"
              onClick={() => { setIsMobileMenuOpen(false); menuButtonRef.current?.focus(); }}
            />

            {/* Dropdown panel */}
            <motion.div
              key="mobile-menu"
              id="mobile-navigation"
              ref={menuRef}
              style={{ top: "calc(var(--header-height, 84px) + 8px)" }}
              initial={reducedMotion ? false : { opacity: 0, y: -12 }}
              animate={reducedMotion ? { opacity: [1, 1], y: [0, 0] } : { opacity: 1, y: 0 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
              transition={reducedMotion ? { duration: 0, delay: 0 } : { duration: 0.2, ease: "easeOut" }}
              className="fixed left-0 right-0 z-50 md:hidden mx-4 rounded-2xl border border-white/10 bg-card/80 backdrop-blur-xl shadow-2xl overflow-y-auto max-h-[calc(100dvh-var(--header-height,84px)-16px)]"
            >
              <nav className="flex flex-col p-3 gap-1">
                {NAV_LINKS.map((link) => (
                  <button
                    key={link.name}
                    onClick={() => scrollTo(link.href)}
                  aria-current={activeSection === link.href.slice(1) ? "location" : undefined}
                    className={`w-full text-left text-base font-medium px-4 py-3 rounded-xl transition-colors ${
                      activeSection === link.href.substring(1)
                        ? "bg-primary/15 text-primary"
                        : "text-foreground/80 hover:bg-white/8 hover:text-foreground"
                    }`}
                  >
                    {link.name}
                  </button>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
