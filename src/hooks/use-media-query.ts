import { useEffect, useState } from "react";

// Motion entrances use repeated final-value keyframes with zero duration when reduced.
// This replaces in-flight targets when the preference changes, without remounting content.
// Subscribe to changes too: motion/device preferences can change without a reload.
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [query]);
  return matches;
}
