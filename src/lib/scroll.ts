export function scrollToSection(element: Element | null) {
  element?.scrollIntoView({
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "instant" : "smooth",
    block: "start",
  });
}
