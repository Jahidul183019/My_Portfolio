import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";

const NAV_LINKS = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Projects", href: "#projects" },
  { name: "Contact", href: "#contact" },
];

export function Navbar() {
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
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      const sections = NAV_LINKS.map((link) => link.href.substring(1));
      let current = "";

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            current = section;
            break;
          }
        }
      }

      if (current) setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
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
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-display font-bold cursor-pointer"
            onClick={() => scrollTo("#home")}
          >
            <span className="text-gradient">&lt;JI /&gt;</span>
          </motion.div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex space-x-6">
              {NAV_LINKS.map((link, i) => (
                <motion.button
                  key={link.name}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => scrollTo(link.href)}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    activeSection === link.href.substring(1)
                      ? "text-primary"
                      : "text-foreground/70"
                  }`}
                >
                  {link.name}
                  {activeSection === link.href.substring(1) && (
                    <motion.div
                      layoutId="activeNav"
                      className="h-0.5 w-full bg-primary mt-1 rounded-full"
                    />
                  )}
                </motion.button>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Dropdown panel */}
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed top-[92px] left-0 right-0 z-50 md:hidden mx-4 rounded-2xl border border-white/10 bg-card/80 backdrop-blur-xl shadow-2xl overflow-hidden"
            >
              <nav className="flex flex-col p-3 gap-1">
                {NAV_LINKS.map((link) => (
                  <button
                    key={link.name}
                    onClick={() => scrollTo(link.href)}
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
