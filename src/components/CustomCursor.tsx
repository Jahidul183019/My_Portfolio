import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useMediaQuery } from "@/hooks/use-media-query";

const DOT_SPRING = { stiffness: 500, damping: 28, mass: 20 };
const RING_SPRING = { stiffness: 250, damping: 20, mass: 15 };

export function CustomCursor() {
  const enabled = useMediaQuery("(min-width: 768px) and (pointer: fine) and (hover: hover) and (prefers-reduced-motion: no-preference)");
  const [isHovering, setIsHovering] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const visible = useMotionValue(0);
  const dotX = useSpring(x, DOT_SPRING);
  const dotY = useSpring(y, DOT_SPRING);
  const ringX = useSpring(x, RING_SPRING);
  const ringY = useSpring(y, RING_SPRING);

  useEffect(() => {
    visible.set(0);
    if (!enabled) return;
    let positioned = false;
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") { visible.set(0); return; }
      x.set(event.clientX);
      y.set(event.clientY);
      if (!positioned) {
        dotX.jump(event.clientX); dotY.jump(event.clientY);
        ringX.jump(event.clientX); ringY.jump(event.clientY);
        positioned = true;
      }
      visible.set(1);
    };
    const over = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      setIsHovering(event.target instanceof Element && !!event.target.closest("button, a, .cursor-pointer"));
    };
    const hide = () => visible.set(0);
    const out = (event: PointerEvent) => { if (!event.relatedTarget) hide(); };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    window.addEventListener("pointerout", out);
    window.addEventListener("blur", hide);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      window.removeEventListener("pointerout", out);
      window.removeEventListener("blur", hide);
      visible.set(0);
      dotX.stop(); dotY.stop(); ringX.stop(); ringY.stop();
    };
  }, [enabled, x, y, visible, dotX, dotY, ringX, ringY]);

  if (!enabled) return null;
  return (
    <motion.div aria-hidden="true" style={{ opacity: visible }} className="pointer-events-none fixed inset-0 z-[9999]">
      <motion.div
        className="fixed -top-2 -left-2 w-4 h-4 bg-primary rounded-full pointer-events-none mix-blend-screen"
        style={{ x: dotX, y: dotY }}
        animate={{ scale: isHovering ? 2.5 : 1, opacity: isHovering ? 0.5 : 1 }}
        transition={{ type: "spring", ...DOT_SPRING }}
      />
      <motion.div
        className="fixed -top-4 -left-4 w-8 h-8 border border-secondary rounded-full pointer-events-none"
        style={{ x: ringX, y: ringY }}
        animate={{ scale: isHovering ? 1.5 : 1, opacity: isHovering ? 0 : 0.5 }}
        transition={{ type: "spring", ...RING_SPRING }}
      />
    </motion.div>
  );
}
