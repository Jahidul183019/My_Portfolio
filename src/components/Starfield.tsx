import { useEffect, useRef } from "react";

export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let stars: { x: number; y: number; radius: number; vx: number; vy: number; glow: number }[] = [];

    const initStars = () => {
      stars = [];
      const numStars = Math.floor((width * height) / 4000);
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 1.5,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          glow: Math.random() * 0.5 + 0.1,
        });
      }
    };

    initStars();

    let frame: number | null = null;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");

    const draw = (moving: boolean) => {
      ctx.clearRect(0, 0, width, height);
      
      stars.forEach((star) => {
        if (moving) {
          star.x += star.vx;
          star.y += star.vy;

          if (star.x < 0) star.x = width;
          if (star.x > width) star.x = 0;
          if (star.y < 0) star.y = height;
          if (star.y > height) star.y = 0;

          // Pulsing glow effect
          star.glow += (Math.random() - 0.5) * 0.05;
          if (star.glow < 0.1) star.glow = 0.1;
          if (star.glow > 0.8) star.glow = 0.8;

        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        
        // Cyan and Purple subtle stars
        const isPurple = Math.random() > 0.5;
        ctx.fillStyle = isPurple 
          ? `rgba(123, 47, 247, ${star.glow})` 
          : `rgba(0, 212, 255, ${star.glow})`;
          
        ctx.fill();
      });

    };

    const stop = () => {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
    };
    const animate = () => {
      frame = null;
      if (document.hidden || media.matches) return;
      draw(true);
      frame = requestAnimationFrame(animate);
    };
    const synchronize = () => {
      stop();
      if (document.hidden) return;
      draw(false);
      if (!media.matches) frame = requestAnimationFrame(animate);
    };
    synchronize();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initStars();
      synchronize();
    };

    window.addEventListener("resize", handleResize);
    document.addEventListener("visibilitychange", synchronize);
    media.addEventListener("change", synchronize);
    return () => {
      stop();
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", synchronize);
      media.removeEventListener("change", synchronize);
    };
  }, []);

  return (
    <canvas
      aria-hidden="true"
      ref={canvasRef}
      className="fixed inset-0 z-[-1] pointer-events-none opacity-60"
    />
  );
}
