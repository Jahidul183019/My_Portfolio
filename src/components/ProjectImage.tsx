import { useState } from "react";

const LOCAL_IMAGES: Record<string, { width: number; height: number; widths: number[] }> = {
  "project-1.png": { width: 3024, height: 1898, widths: [480, 800, 1200] },
  "project-4.png": { width: 1408, height: 768, widths: [480, 800, 1200] },
  "project-6.png": { width: 1024, height: 897, widths: [480, 800, 1024] },
  "project-7.png": { width: 1280, height: 960, widths: [480, 800, 1200] },
  "project-12.jpg": { width: 1200, height: 896, widths: [480, 800, 1200] },
  "project-13.png": { width: 1280, height: 960, widths: [480, 800, 1200] },
};

type ImageProject = {
  title: string;
  category: string;
  thumbnail?: string;
  links: { href: string; kind: string }[];
};

function thumbnailFor(project: ImageProject) {
  if (project.thumbnail) return project.thumbnail.startsWith("https://")
    ? project.thumbnail : `${import.meta.env.BASE_URL}images/${project.thumbnail}`;
  for (const link of project.links) {
    if (link.kind !== "demo") continue;
    try {
      const url = new URL(link.href);
      const id = url.hostname === "youtu.be" ? url.pathname.split("/")[1]
        : ["youtube.com", "www.youtube.com"].includes(url.hostname) ? url.searchParams.get("v") : null;
      if (id && /^[\w-]+$/.test(id)) return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
    } catch { /* Invalid URLs use the local visual fallback below. */ }
  }
  return undefined;
}

export function ProjectImage({ project, modal = false }: { project: ImageProject; modal?: boolean }) {
  const [failed, setFailed] = useState(false);
  const source = thumbnailFor(project);
  const local = project.thumbnail ? LOCAL_IMAGES[project.thumbnail] : undefined;
  const variant = (width: number) => `${import.meta.env.BASE_URL}images/${project.thumbnail!.replace(/\.[^.]+$/, "")}-${width}.webp`;
  if (failed || !source) return (
    <div className="w-full h-full bg-gradient-to-br from-primary/20 via-secondary/20 to-background flex items-end p-5">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-foreground mb-2">{project.category}</p>
        <p className="text-xl font-display font-bold text-foreground">{project.title}</p>
      </div>
    </div>
  );
  return (
    <img
      src={local ? variant(modal ? local.widths[local.widths.length - 1] : 800) : source}
      srcSet={local ? local.widths.map((width) => `${variant(width)} ${width}w`).join(", ") : undefined}
      sizes={modal ? "(min-width: 816px) 768px, (min-width: 640px) calc(100vw - 48px), 100vw"
        : "(min-width: 1280px) 384px, (min-width: 1024px) calc((100vw - 128px) / 3), (min-width: 640px) calc((100vw - 72px) / 2), calc(100vw - 32px)"}
      width={local?.width}
      height={local?.height}
      alt={project.title}
      loading={modal ? "eager" : "lazy"}
      decoding="async"
      className="max-w-full max-h-full object-contain mx-auto transition-transform duration-300"
      onError={() => setFailed(true)}
    />
  );
}
