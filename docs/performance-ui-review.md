# Portfolio performance and UI review

Reviewed September 7, 2026. Application source was inspected before any proposed changes. This deliverable is an audit and implementation plan; application code was not changed.

## A. Overall verdict

**The website has meaningful performance issues.** The clearest issue is unnecessary image transfer: six local project thumbnails total **9.53 MB**, including one **6.82 MB PNG**, and all project cards load their images eagerly. There is also avoidable initial JavaScript, continuous decorative work, and incomplete keyboard and reduced-motion support.

Keep the current architecture and make targeted optimizations. No evidence justifies a rewrite, migration to Next.js, or blanket memoization. Actual scroll jank, FPS, LCP, CLS, and INP remain **Needs runtime measurement**; asset sizes and problematic code paths are confirmed, not their precise timing impact.

## Architecture overview

| Area | Actual implementation |
| --- | --- |
| Framework | React **18.3.1**, TypeScript **5.9.3** installed locally |
| Build | Vite **5.4.21**, React plugin, `@` alias, React deduplication; standard production output to `dist` |
| Styling | Tailwind **3.4.19**, PostCSS/autoprefixer, CSS theme variables, dark/light root classes, glass cards and cyan/purple accents |
| Routing | Wouter **3.9.0**; `/`, `/about`, `/projects`, `/contact` all render `Home`; pathname effect scrolls to a section; fallback 404 |
| Components | Home composes Navbar, Starfield, CustomCursor, Hero, About, Projects, Contact; reusable UI primitives under `src/components/ui` |
| State | Local React state for filters, modal, theme, menu, cursor and submission; no complex prop drilling; globally mounted TanStack Query provider has no query consumers |
| Motion | Framer Motion **11.18.2**, viewport entrances, skill layout transitions, modal transitions, cursor springs; canvas starfield; CSS pulse and hover effects |
| Data | Static project/skill/education arrays; React Hook Form + Zod for contact validation; one fetch on submission |
| Backend | Vercel `api/contact.js`, server-only Nodemailer and SMTP environment variables |
| Assets/fonts | Public raster screenshots, avatar, PDF; Google Inter/Outfit; external social favicons, YouTube thumbnails, GitHub SVG |
| Deployment | Vercel Vite build and SPA rewrites; explicit API rewrite. Local Vite preview does not run the serverless contact handler |

The UI library directory contains many unused components. Its package count is not the browser payload: production module inspection confirms Recharts, date-fns, react-icons, carousel/calendar packages, and Nodemailer are absent from the client bundle. Tailwind still scans unused UI source, so unused component class names can contribute CSS.

## Measurements and limits

`pnpm build` and `pnpm typecheck` both passed. Build emits a >500 kB chunk warning and a stale Browserslist data warning. Neither alone proves slow interactions.

| Production output | Minified bytes, decimal kB | Gzip kB |
| --- | ---: | ---: |
| JavaScript, one initial chunk | 511.62 | 161.04 |
| CSS | 82.99 | 13.89 |
| HTML | 0.74 | 0.41 |

These are build sizes, not measured deployed transfer sizes; fonts, images, protocol overhead and CDN compression differ.

An in-memory Vite experiment removed unused providers without writing application files:

| Experiment | JS kB | Gzip kB | Approximate gzip saving |
| --- | ---: | ---: | ---: |
| Remove Query provider/import | 483.12 | 152.55 | 8.49 kB |
| Remove unused Tooltip provider/import | 477.24 | 148.82 | 12.22 kB |
| Remove both | 448.72 | 140.25 | **20.79 kB / 12.9%** |

The combined saving differs slightly from summing individual results because of shared code and compression. A production preview started successfully, but the available browser tool reported **no browser available**. No Lighthouse run, screenshots, React profile, actual device test, deployed cache inspection, or email submission was performed. All visual judgments below are source-based.

## B. Top 10 issues, ranked by impact

| Rank / priority | Evidence and impact |
| --- | --- |
| **1 🔴 Critical** | `public/images/project-1.png` is 3024×1898 and 6.82 MB. Together, eagerly loaded local project thumbnails are 9.53 MB. `Projects.tsx` uses neither lazy loading nor responsive sources. This is confirmed excess transfer for small cards and can compete with initial content; LCP impact **Needs runtime measurement**. |
| **2 🟠 High** | `Projects.tsx` uses clickable `motion.div` cards, a noninteractive “View Details” span, and a custom modal without dialog semantics, focus trapping/restoration, Escape handling or scroll lock. Keyboard users cannot normally open cards; dialog focus can remain behind the overlay. This is a functional accessibility issue, not a claimed performance bottleneck. |
| **3 🟠 High** | `Starfield.tsx` recursively schedules animation frames but only removes its resize listener on cleanup. Unmounting Home leaves the loop alive; returning can add another loop. It paints continuously across the page, with about 518 stars at 1920×1080 and 2073 at 3840×2160. Leak is confirmed; severity on real navigation and GPU/CPU cost **Needs runtime measurement**. |
| **4 🟠 High** | No site policy for reduced motion. Canvas, cursor, three-second title changes, smooth scrolling and education pulse all ignore the preference. Also consider a pause mechanism for continuous decoration independently of the OS preference. |
| **5 🟠 High** | `CustomCursor.tsx` creates a new position object and schedules React state on every mousemove, then retargets two springs. CSS hides it below `md`, but listeners still attach. Updates are local to CustomCursor, not the entire app. Render frequency and noticeable lag **Needs runtime measurement**. |
| **6 🟡 Medium** | `App.tsx` eagerly includes unused Query and Tooltip providers. In-memory removal saves 20.79 kB gzip. Contact validation and all sections also share the entry chunk. The providers are a confirmed saving; broader splitting benefit **Needs runtime measurement**. |
| **7 🟡 Medium** | Google Fonts is requested through both `index.html` and a CSS `@import`. Inter ranges overlap; the import also discovers Outfit later. There are two stylesheet paths, not proof that identical font binaries download twice. Both use `display=swap`, which is good, but fallback swaps and LCP impact **Needs runtime measurement**. |
| **8 🟡 Medium** | `Contact.tsx` has placeholder-only fields and no associated error descriptions. There is no reply email field, yet success promises a reply. The displayed email is plain text and can overflow a narrow contact card. Navbar theme buttons, Hero GitHub/LinkedIn links, and modal close button lack accessible names. |
| **9 🟡 Medium** | `Navbar.tsx` queries up to four sections and reads their rectangles for every scroll event, without rAF coalescing or initial synchronization. This is small bounded work, not confirmed layout thrashing. Header padding transitions affect geometry. `Hero.tsx` keeps its interval running offscreen and repeats static code highlighting. Actual scroll/render cost **Needs runtime measurement**. |
| **10 🟡 Medium** | Responsive and perceived-speed rough edges: About's timeline switches to half-width cards at `md`, then its containing column becomes narrow at `lg`; project stagger reaches **1.2 seconds** on the thirteenth card; fixed navigation has no section scroll margin; viewport uses `maximum-scale=1`. Exact clipping, overlap, CLS and browser zoom behavior **Needs runtime measurement**. |

Critical here reflects an unambiguously oversized page resource, not a measured Core Web Vitals failure.

## C. Top 10 improvements / before → after plan

Ranks correspond to the issues above. Expected time depends on verification; phase 1 entries are individually small changes, not a promise that the whole phase takes 30 minutes.

| Phase / rank | Files | Before → exact recommended change | Expected impact / verification | Regression risk |
| --- | --- | --- | --- | --- |
| 2 / **1** | `public/images/*`, `src/sections/Projects.tsx`, `About.tsx` | Export visually checked WebP variants, e.g. 480/800/1200 widths where originals permit; do not upscale. Use `srcSet` and grid-aware `sizes`, lazy/async card images, explicit intrinsic dimensions and existing reserved containers. Keep modal images eager when opened; use appropriate larger sources. Resize avatar to ~256 px wide for its ~120 px display. | Largest byte reduction. Aim for roughly 100–200 kB or less per card candidate where text quality permits; targets are not measured outputs. At ≤200 kB each, the six local card candidates would total ≤1.2 MB instead of 9.53 MB. Lazy loading defers distant requests, though browsers may prefetch nearby images. | Medium: screenshot text, crop, aspect ratio, source selection and direct `/projects` loads must be checked. Do not preload all screenshots. |
| 2 / **2** | `Projects.tsx`, existing `ui/dialog.tsx` | Use a native button for card activation and an accessible dialog primitive already installed, retaining the visual design and animations. Supply title, close label, focus return, Escape and background scroll handling. | Restores keyboard access and predictable mobile dialog behavior; measure bundle delta, not an assumed speed win. | Medium: focus restoration when filters change and exit animations need testing. |
| 1 / **3** | `Starfield.tsx` | Store/cancel the rAF ID on cleanup. Gate animation on visibility and motion preference, draw a static field when paused, and avoid duplicate restarts. | Zero orphan loops after unmount; reduced unnecessary work. Browser rAF is usually already suspended in background tabs, so do not claim hidden tabs necessarily run at 60 FPS. | Low for cleanup, medium for pause/resume. |
| 2 / **4** | `App.tsx`, `Starfield.tsx`, `CustomCursor.tsx`, `Hero.tsx`, `Navbar.tsx`, `Home.tsx`, `index.css` | Configure `MotionConfig reducedMotion="user"`; separately gate canvas/title/cursor and CSS pulse. Make explicit JS smooth-scroll calls preference-aware. Provide a visible pause control for ongoing decoration if retained. | Accessible motion behavior; reduced decorative work for affected users. Global Motion configuration alone does not disable all opacity animations, canvas, timers or CSS. | Low–medium: content must remain visible and keyboard focus stable. |
| 2 / **5** | `CustomCursor.tsx` | Replace coordinate React state with Motion values/springs. Retain React state only for hover mode. Subscribe only for a fine, hover-capable pointer at the intended breakpoint and when motion is allowed; handle media-query changes and cleanup. | Pointer movement stops triggering coordinate-driven React renders; preserve native pointer. Validate spring feel before altering stiffness/mass. | Medium: hybrid devices, first-pointer position, resize and hover targeting. |
| 1 / **6** | `App.tsx`, optionally `package.json` | Remove unused Query client/provider and Tooltip provider imports/wrappers. Keep packages needed by reusable components until consciously pruning them. | **Measured 20.79 kB gzip saving** in isolated builds. Rebuild after implementation. | Low: no active query/tooltip consumers found. |
| 1 / **7** | `index.html`, `index.css`, `tailwind.config.js` | Consolidate into one early font stylesheet link; remove CSS import; retain preconnect and swap. Active visible text needs Inter 400/500/600/700 and Outfit 600/700. Define `fontFamily.display` if `font-display` is intentional. Verify glyph/weight usage before dropping others. | One fewer font stylesheet path and earlier Outfit discovery. Actual font byte/FCP/CLS savings require Network measurement. Self-host WOFF2 only if the waterfall supports doing so. | Low–medium: appearance and fallback wrapping. |
| 2 / **8** | `Contact.tsx`, `api/contact.js`, `Navbar.tsx`, `Hero.tsx` | Add persistent labels, `aria-invalid` and error associations. Add a reply email field with matching server validation and SMTP `replyTo`; alternatively change the success promise if no reply is intended. Make email a wrapping `mailto:` link. Name icon controls. Add mobile menu `aria-expanded`/`aria-controls` and Escape/focus behavior. | Better completion and reliable replies; no performance gain claimed. | Medium for email schema/server changes; low for labels. Verify with mocks first; live sending is a separate test. |
| 2 / **9** | `Navbar.tsx`, `Hero.tsx`, `Home.tsx` | Cache section nodes, synchronize once on mount, coalesce reads to one rAF, cancel it on cleanup; use a passive scroll listener. Consider IntersectionObserver only if profiling warrants it. Pause title rotation offscreen; compute constant highlighted markup once at module scope. | Bounded scroll work and eliminated offscreen timer updates. rAF is coalescing, not necessarily a lower frequency than scroll; passive scroll registration alone is not a major speedup. | Medium: active section behavior, direct routes, resize; low for constant markup. |
| 1 / **10** | `About.tsx`, `Projects.tsx`, `index.css`, `index.html` | Keep education timeline single-column within the profile card; cap project stagger at ~0.2–0.3 seconds; add section `scroll-margin-top`; remove `maximum-scale=1`. | More readable education, faster perceived card availability, visible anchored headings, unrestricted zoom where supported. | Low–medium: check all target widths and scrolled/unscrolled header heights. |

**Phase 3 — only after measurements:** If JS evaluation still dominates after the above, defer Contact with a reserved-size boundary near the viewport while supporting direct `/contact`, or load its validation dependencies on intent. Do not immediately render every lazy component and call that deferred loading. If raster/paint dominates, compare mobile glass blur/shadow levels and star-density caps. If Motion remains a material bundle cost, evaluate compatible LazyMotion features using the installed v11 API; keep layout features required by skills/navigation. Do not introduce virtualization for 13 projects or a new state framework.

## Dependency decisions

| Dependency | Current purpose | Measured/approximate impact and recommendation |
| --- | --- | --- |
| TanStack Query | Unused root provider | Remove active use; isolated saving 8.49 kB gzip. Direct fetch already handles contact. |
| Radix Tooltip | Unused root provider | Remove active provider; isolated saving 12.22 kB gzip, including eliminated positioning code. Do not replace useful accessible tooltips with inaccessible hover-only text later. |
| Framer Motion | Most page animation and skill layout | Largest library by Rollup rendered-module size (~338 kB before final minification; **not transfer size**). Retain; selective feature loading only after profiling. Replacing it all with CSS would carry substantial behavior risk. |
| React Hook Form + Zod + resolver | Contact validation | ~214 kB aggregate rendered-module code before final minification, not independently gzip-additive. Retain validation; defer this section only if needed. A native form is possible but requires reimplementing errors and validation, so removal is not the first optimization. |
| Lucide | Active icons | ~11 kB rendered-module code; named imports are tree-shaken. Keep. |
| tailwind-merge / clsx / CVA | Shared styling helpers | Used by active primitives. Keep; replacing class-merging behavior risks styling regressions for uncertain gain. |
| Wouter | Small route mapping | Keep; no routing bottleneck identified. |
| Unused UI dependencies | Scaffolded calendar, charts, carousel, etc. | Observed client JS contribution of those unused packages is zero. Removing them is maintenance/install cleanup, not a claimed runtime gain. |
| Nodemailer | SMTP server handler | Correctly server-only; no client-byte saving from removing it. Keep. |

## Asset inventory and loading strategy

Sizes below are decimal kB; originals were measured with filesystem metadata and `sips`.

| Asset | Dimensions | kB | Current use / action |
| --- | --- | ---: | --- |
| `project-1.png` | 3024×1898 | 6,820.11 | Eager card + modal; first conversion priority |
| `project-4.png` | 1408×768 | 1,154.93 | Eager card + modal; second conversion priority |
| `project-6.png` | 1024×897 | 446.43 | Eager card + modal; responsive WebP |
| `project-7.png` | 1280×960 | 481.43 | Eager card + modal; responsive WebP |
| `project-12.jpg` | 1200×896 | 486.82 | Active card + modal; compare quality of smaller variants |
| `project-13.png` | 1280×960 | 143.23 | Active card + modal; lower priority than multi-MB files |
| `avatar.jpeg` | 771×1020 | 144.27 | Below-fold, eager; resize and lazy-load; its fixed circular container already reserves space |
| `project-12.png` | 1280×960 | 94.58 | Not referenced; do not assume equivalent content to JPG without visual comparison |
| `thumbnail.png` | 1408×768 | 939.38 | Not referenced by active source; no current page transfer |
| `opengraph.jpg` | 1280×720 | 58.70 | No OG metadata references it; optional social-preview asset, not a render-critical image |
| `favicon.svg` | SVG | 1.67 | Small, no meaningful optimization priority |
| `Resume.pdf` | PDF | 151.77 | Link only; not loaded with page. Existing user modification preserved |

There is no large hero photo, video, Lottie, WebGL scene, analytics script, or third-party iframe in the active portfolio. Technologies mentioned in project descriptions are not portfolio dependencies.

Three project thumbnails currently resolve to YouTube; ShareBox uses a remote GitHub SVG. These and three social favicons add external origins. The thum.io fallback exists, but the current data does not reach it: non-YouTube demo projects have explicit thumbnails. Do not call it an observed screenshot-service request. Prefer local, visually verified assets if external reliability becomes an issue. Avatar's error fallback points at absent `/me.jpeg` and lacks a guard; replace it with a one-time, existing fallback. Project images have no error fallback.

## React, animation, scroll and CLS assessment

Already good: local state boundaries, tiny derived filters (16 skills, 13 projects), stable project IDs, cleaned-up mouse/scroll/resize listeners, cleaned-up Hero interval, and `viewport={{ once: true }}` entrances. No render loop, expensive data processing, query waterfall, pervasive context rerender, or reason for broad `memo`/`useMemo` was found. Modal mounting only on demand is appropriate. The toast hook needlessly resubscribes on every state change and keeps dismissal timers for 1,000,000 ms; this is **🟢 Low**, not a major rendering concern.

Most motion uses opacity/transforms, appropriately. Exceptions worth inspecting are header padding and the project arrow's animated margin; these are brief local effects, not proof of severe jank. Glass-card backdrop blur behind a moving full-screen canvas may raise paint/compositing cost, especially on Android: **Needs runtime measurement**. Skill layout animation already uses Motion's layout feature; do not replace it with width/height animation. Project AnimatePresence currently lacks card exit animations, so its presence should not be mistaken for an expensive exit sequence.

CLS is not proven just because image width/height attributes are missing: project thumbnails sit in fixed-height wrappers and the avatar has a fixed circle. Preserve these reservations. Potential instability includes fallback-font swaps, the narrow rotating-title row, active-nav underline insertion, header padding change, and form error insertion. User-triggered filter reflow should be evaluated for usability separately from unexpected-load CLS. Measure actual layout-shift entries before assigning blame. Hero initially fades in over 0.8 seconds; test whether displaying its principal text immediately improves LCP/perceived loading.

## Network and contact behavior

No mount-time API fetches, analytics, GitHub API requests, polling, or duplicate per-render requests were found. The single POST is event-driven and its pending state disables the submit button. Caching contact POSTs is inappropriate. Static portfolio data already avoids a data-fetching dependency.

The pending state has no application timeout; a stalled fetch/SMTP path can leave “Sending…” visible for a long time. Add bounded timeout behavior only with care: a timed-out request may still have sent email, so blind retries risk duplicates. This is **🟡 Medium** reliability work, not first-render work. The server only checks nonempty strings, does not mirror length/type limits, and interpolates user text into HTML. Validate types/lengths and escape HTML or send text-only mail. This is **🟡 Medium** endpoint robustness work; no live exploit or delivery issue was tested.

Production cache headers/compression, actual SMTP latency and direct-route deployment behavior are **Needs runtime measurement**. Vite preview cannot verify the Vercel API.

## UI/UX and portfolio assessment

The name, developer role, work CTA, resume, education, skills, project descriptions, GitHub, LinkedIn and contact information are easy to locate structurally. The consistent color variables, spacing scale, responsive grids and repeated card treatment give the design a coherent identity. Preserve them. Three large hero CTAs compete somewhat; View My Work should remain visually primary.

The code-window says “Student” while the rotating text says “Full Stack Developer”; these are compatible, but a stable “Computer Science student & full-stack developer” introduction would be clearer. Thirteen projects support the “10+” claim; only 16 skills are explicitly listed under a “20+ Technologies” hero claim. This does not prove the claim false, but supporting it would improve credibility. Several projects already mention hackathons; add verified outcomes, personal contribution and engineering tradeoffs where available. No separate work experience or achievement results are provided. Do not invent them. These content refinements are **🟢 Low** performance priority.

“Featured Projects” displays all projects, including unfeatured items. Consider leading with the strongest featured work while retaining All/filter access. Skill tiles look clickable but perform no action; remove their pointer cursor (**🟢 Low**). Generic “Personal Portfolio” title, missing description/OG tags, and developer-facing 404 copy weaken presentation (**🟡 Medium** SEO/UX). Set an accurate title/description, reference the existing OG asset using the verified production origin, and add a home link on the 404. SPA prerendering is an optional later SEO improvement, not justification for a framework migration.

`font-display`, `perspective-1000`, and rotation utilities are used without matching definitions in the installed Tailwind configuration. Headings still receive Outfit from global CSS, but other `font-display` elements fall back to body font. Check intended appearance before defining or removing these classes (**🟢 Low**). Light-mode cyan text, gradient headings/buttons and colored code tokens need measured contrast against their actual backgrounds; no conformance pass is claimed.

| Width | Source-based responsive check |
| --- | --- |
| 320 px | Contact card leaves little width after padding + 48 px icon + gap; email can overflow. Title row and three wrapping CTAs need visual verification. Internal code horizontal scrolling is intentional. |
| 375 px | Verify email wrapping, menu reachability, role text height and modal scroll/keyboard behavior. |
| 430 px | Single-column projects; ensure screenshots remain useful at 192 px frame height and long titles wrap. |
| 768 px | Desktop navigation starts; two project columns; education becomes a two-sided timeline. Check hero social/stats row fits. |
| 1024 px | About becomes 1:2 columns while timeline remains split: particularly narrow education text. Hero switches to two columns and increases title sizes. |
| 1440 px+ | Max-width 1280 container limits content expansion; star count still scales with viewport area, including beyond the container. Profile at large/high-resolution windows. |

All six widths also need 200% zoom, both themes and reduced-motion testing. `overflow-x-hidden` may hide overflowing content rather than solve it.

## Scores

These are provisional engineering-review ratings of the **current** code, not Lighthouse scores or measured post-fix outcomes.

| Category | Score / 10 | Reason |
| --- | ---: | --- |
| Initial Load | 4 | Eager multi-MB thumbnails, one JS entry and overlapping font stylesheets |
| Runtime Performance | 6 | Simple local state, but cursor updates and orphan canvas loop |
| Animation Performance | 5 | Mostly transforms/opacity; continuous canvas and absent motion policy |
| Mobile Performance | 5 | Responsive structure; asset load, contact overflow and effects need work |
| Bundle Efficiency | 6 | Tree-shaking works; measured unused provider overhead and eager form code |
| Image Optimization | 2 | Oversized screenshots, no responsive sources or lazy project images |
| Code Quality | 7 | Build/typecheck pass and sensible architecture; cleanup/accessibility gaps |
| Accessibility | 4 | Keyboard/modal/form/control-label and zoom issues |
| UI/UX | 6 | Coherent identity and clear work CTA; timeline, contact and content rough edges |
| Overall | **5** | Rounded average; strong foundation with fixable delivery and usability issues |

## D. Runtime testing checklist

Use the production build, not Vite development mode. Save the baseline commit, test conditions and traces. Compare at least three cold runs using the same browser/device/network settings; use median lab results and keep individual regressions visible.

1. **Lighthouse:** Run mobile and desktop on `/`, plus direct `/projects` and `/contact`, with cache cleared and extensions disabled. Record LCP, FCP, CLS, TBT, accessibility findings and request bytes. Mobile lab targets: LCP ≤2.5 s, CLS ≤0.1; use FCP ≤1.8 s and TBT ≤200 ms as initial lab budgets. Budgets do not substitute for field evidence. Track the actual LCP element, not an assumed hero image.
2. **Performance panel:** Record 10–15 seconds each of idle hero, pointer movement, full-page scroll, rapid skill/project filters, mobile menu, theme changes and modal open/close. Inspect scripting, long tasks >50 ms, style/layout, paints, raster work and dropped frames. Target smooth ~60 FPS on a 60 Hz display (~16.7 ms/frame), allowing for actual display refresh rate. Compare effects individually only if traces show they dominate.
3. **Lifecycle check:** Navigate Home → unknown route → Home repeatedly and inspect callbacks/heap. Expect only one active starfield loop when Home is mounted and none afterward. Hide/show the tab and change reduced-motion preferences while running; check animation resumes once without accumulated work.
4. **Network panel:** Disable cache, reload without scrolling, sort by transfer size and inspect image initiators. Record total JS (baseline 511.62 kB raw / 161.04 kB build gzip), actual compressed transfer, total page transfer, request counts and font waterfall. Confirm optimized distant images defer, `srcset` selects sensible candidates, modal requests are appropriate, and existing wrappers prevent jumps. Do a separate cache-enabled reload to check deployment compression and cache policy. An initial-image budget below 300 kB on `/` is a reasonable starting project goal, not a guaranteed result.
5. **React DevTools Profiler:** Use development or a React profiling build for attribution; do not compare its timings directly with normal production Lighthouse. Record cursor movement, title ticks and filtering. After cursor changes, coordinate motion should cause zero coordinate-driven React commits. Verify navbar and filters remain localized; do not optimize merely because a small component renders.
6. **Real mobile device:** Use a low/mid-range Android Chrome device as well as desktop emulation. Check cold load on constrained network, scroll with effects enabled, repeated modal opening, touch menu, keyboard appearance and contact validation. Repeat at 320/375/430/768/1024/1440+ widths, both themes, reduced motion, portrait/landscape and 200% zoom.
7. **Accessibility/functional:** Tab through logo, nav, social links, project cards, dialog and form; test Enter/Space, Escape, focus containment/restoration, accessible names, selected-filter state and error announcements. Confirm no blocked background focus in the modal, no clipped anchored headings, no missing images and direct route navigation works. Mock contact success/error/slow responses; do not send live test email without an intentional delivery test.
8. **Field responsiveness:** Collect actual interactions over time to assess INP; Lighthouse TBT is not INP. Target INP ≤200 ms, LCP ≤2.5 s and CLS ≤0.1 at the 75th percentile, separating mobile and desktop. A single local trace cannot establish field performance. [Google Web Vitals](https://web.dev/articles/vitals)

Motion's global reduced-motion behavior and its limits are documented in [MotionConfig](https://www.motion.dev/docs/react-motion-config); verify implementation against installed Framer Motion v11 rather than migrating imports to a newer package incidentally.

## E. Final recommendation

Keep React/Vite, Wouter, Tailwind and the existing visual identity. Implement the measured asset and provider savings first, fix keyboard/motion access and animation cleanup, then profile. Refactor only the cursor, starfield lifecycle and project dialog where the evidence warrants it. No larger architectural change is justified.

Application source and dependencies remain unchanged. The production build regenerated ignored `dist` output. The pre-existing `public/Resume.pdf` modification was preserved. This report is the only new tracked-source artifact.
