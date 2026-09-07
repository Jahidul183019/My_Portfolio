# Targeted optimization implementation

## Files and fixes

| Files | Implemented changes |
| --- | --- |
| `public/images/*-480.webp`, `*-800.webp`, `*-1200.webp`, `project-6-1024.webp`, `avatar-256.webp` | 19 optimized assets, generated from the active originals without upscaling or substituting project images. Original files retained. |
| `src/components/ProjectImage.tsx` | Responsive WebP sources and grid/modal sizes, lazy card images, eager modal images, intrinsic dimensions for local assets, and a local CSS/title fallback after an error. Removes reliance on a screenshot-service fallback. |
| `src/sections/Projects.tsx` | Semantic whole-card activation buttons; existing Radix dialog primitives with Motion entrances/exits, title/description/close label, focus management, Escape and scroll locking. Restores triggering button, or section heading if removed. Featured projects sort first; all filters remain, expose pressed state, and entrance delay caps at 250 ms. |
| `src/components/ui/dialog.tsx` | Exports unstyled Radix content as `DialogSurface`, allowing the existing custom modal layout to retain accessible primitive behavior. Existing styled dialog remains intact. |
| `src/components/Starfield.tsx` | Owns and cancels its rAF, prevents duplicate restarts, responds to visibility and motion preference, paints a static field for reduced motion and cleans up subscriptions. Decorative canvas is hidden from assistive technology. |
| `src/components/CustomCursor.tsx` | Coordinates use Motion values/springs; original stiffness/damping/mass retained. Pointer listeners only attach on desktop with a fine hover pointer and allowed motion. Handles preference changes, touch events on hybrid devices, pointer exit and cleanup. Native cursor remains enabled. |
| `src/hooks/use-media-query.ts` | Small shared subscription for live device/motion preference changes in cursor and Hero. |
| `src/App.tsx` | Removes unused Query/Tooltip root providers; retains installed packages and adds `MotionConfig reducedMotion="user"`. |
| `src/sections/Hero.tsx` | Pauses title interval offscreen, while document is hidden and for reduced motion; computes code highlighting once; labels social links; reserves a more forgiving title row; replaces unsupported rotation utilities with a scoped CSS hover rule; technology count now matches the 16 displayed skills. |
| `src/components/Navbar.tsx` | Cached section references, initial scroll synchronization, passive/rAF-coalesced scroll handling with cancellation, resize handling; accessible logo/theme controls; selected-section semantics; mobile menu focus/Escape/expanded state and bounded height. Header measurement keeps menu and anchors clear of the actual header. |
| `src/pages/Home.tsx`, `src/lib/scroll.ts` | Shared reduced-motion-aware scrolling and route-effect rAF cleanup. |
| `src/sections/About.tsx` | Lazy 256×339 avatar with one-time original-image fallback, then initials if both fail. Reserved circle remains. Single-column education timeline, semantic filter state, no pointer cursor on noninteractive skill tiles. |
| `src/sections/Contact.tsx` | Persistent visible labels, field/error associations, invalid states and alert messages; validated reply email; wrapping mailto; duplicate in-flight submission guard; bounded client wait with explicit uncertain-delivery message and no automatic retry. |
| `api/contact.js` | Zod type/length/email validation, malformed JSON rejection, header-newline protection, text-only email, SMTP `replyTo`, bounded SMTP waits. SMTP credentials remain server-side. |
| `index.html` | Accurate title/description and OG metadata; one Google font stylesheet with Inter 400/500/600/700 and Outfit 600/700; zoom restriction removed. Uses the existing portrait as the social image because `opengraph.jpg` contains outdated role/counters. No production hostname was invented. |
| `src/index.css`, `tailwind.config.js` | Removes duplicate font import; implements intended display font/perspective/hover; reduced-motion CSS disables pulse and CSS transitions; section offsets, shared keyboard focus outline. |
| `src/pages/not-found.tsx` | Clear 404 copy, themed colors and Wouter home action. |
| `tests/contact.test.mjs`, `tests/starfield.test.mjs`, `tests/cursor.test.mjs` | Focused mocked tests for API contracts, animation lifecycle and coordinate updates without React state writes. Uses installed dependencies and Node's test runner. |
| `README.md`, `docs/image-optimization.json`, this report | Updated operational notes, reproducible conversion command, exact asset measurements and verification record. |

## Image results

Decimal kB. These compare the six active project originals against one candidate per project; they are not a measured browser waterfall.

| Source | Original kB | 480px kB | 800px kB | Largest variant kB |
| --- | ---: | ---: | ---: | ---: |
| project-1.png | 6,820.11 | 21.99 | 44.88 | 73.98 (1200px) |
| project-4.png | 1,154.93 | 16.74 | 30.33 | 47.19 (1200px) |
| project-6.png | 446.43 | 12.82 | 23.72 | 26.61 (1024px) |
| project-7.png | 481.43 | 14.93 | 28.88 | 45.06 (1200px) |
| project-12.jpg | 486.82 | 16.95 | 34.00 | 63.87 (1200px) |
| project-13.png | 143.23 | 9.01 | 17.50 | 30.46 (1200px) |
| **Total** | **9,532.95** | **92.44** | **179.30** | **287.17** |

The 800px set is **98.1% smaller**. All 18 project variants together occupy **558.92 kB**. The avatar falls from **144.27 kB to 11.27 kB**. The largest original, project 1, falls from **6.82 MB to 73.98 kB** at the largest generated size, or **44.88 kB** at 800px.

The browser chooses a source according to viewport/DPR and may fetch nearby lazy images. Do not interpret these totals as guaranteed initial-page transfer. Original files remain in `public` and therefore `dist`; deployment storage has increased, while normal image requests use much smaller variants. Existing external YouTube/GitHub/social images remain and are not included in these totals.

Visually inspected the six optimized previews and compared project 1's 1200px WebP against its resized original. Screenshot identity and readable major labels are preserved; tiny screenshot text remains constrained by card display size. The existing 192px card image region and modal image region remain. Verified all 19 output widths and exact copies in `dist`. The first montage command reported a missing default font while producing a preview; later comparison generation and image inspection succeeded.

## Bundle results

| Build | JS kB | Gzip kB |
| --- | ---: | ---: |
| Audit baseline | 511.62 | 161.04 |
| After provider/motion/font group | 452.15 | 141.02 |
| Final implementation | **497.37** | **156.23** |

Net: **14.25 kB less JS**, **4.81 kB less gzip**. Accessible dialog machinery and new functionality add some code back. This is an intentional correctness tradeoff; the provider-only saving should not be presented as the final net saving. Final CSS is **83.06 kB / 14.00 kB gzip**. No new packages or indiscriminate splitting/memoization were introduced.

## Verification performed

- `pnpm typecheck` and `pnpm build` passed after each logical implementation group and again after final code adjustments. The >500 kB JS warning is gone; the existing stale Browserslist-data warning remains.
- `node --test tests/contact.test.mjs`: passed malformed/type/length/email validation, method handling, trimmed text-only mail, replyTo and one-attempt SMTP failure. SMTP was mocked; no live messages were sent.
- `node --test tests/starfield.test.mjs`: passed three mount/unmount cycles, one pending rAF, resize, repeated resume, hidden-page pause, reduced-motion static paint, and zero callbacks/listeners after cleanup. This uses mocked lifecycle/browser APIs, not a measured browser trace.
- `node --test tests/cursor.test.mjs`: 100 mouse-coordinate updates and a touch update cause zero React state writes; disabled cursor attaches no pointer listeners; cleanup removes all listeners. This is a behavioral harness, not a React DevTools recording.
- `git diff --check`: passed.
- Inspected generated assets, dimensions, build sizes, consolidated font configuration, responsive-source declarations and reduced-motion branches.
- Native Chrome production-preview checks: loaded `/projects` and `/contact`; project content appeared in the accessibility tree; opened a project dialog; observed initial close-button focus, reverse-Tab wrapping to the final link, Tab wrapping back, Escape dismissal and restored card focus. A subsequent keyboard activation reopened the dialog. Inspected the desktop hero/modal visually. Submitted an empty form and observed all three validation messages in the accessibility tree.
- Opened Chrome DevTools and observed the existing 500px responsive viewport. Attempts to set precise widths and run further inspections were unreliable because native browser state changed externally during automation. No complete target-width, network, performance or zoom matrix is claimed. Browser screenshots/state updates also arrived asynchronously; direct-route scroll alignment was not conclusively verified.

## Preserved choices and remaining verification

React 18, Vite, Wouter, Tailwind, Framer Motion 11, React Hook Form/Zod, Lucide, styling helpers, Nodemailer, project descriptions, all project filters, resume link, and visual identity remain. Package manifests/lockfiles and original raster assets are unchanged. The user's pre-existing `public/Resume.pdf` modification is preserved. Blur/shadows/star density remain because no paint trace justified reducing them. No deployment or real email was performed.

Still verify in a stable browser/device session:

1. All requested widths (320/375/430/768/1024/1440+), both themes, 200% zoom, menu reachability, modal scrolling and actual Android behavior.
2. `/`, `/about`, `/projects`, `/contact`, unknown route/back navigation and final anchored heading alignment; repeat direct routes after fonts finish loading.
3. Network initial request count and waterfall, currentSrc selection at several DPRs, distant lazy loading, modal-only requests, external-image errors and deployed cache/compression.
4. Complete keyboard/Enter/Space tests, dialog background scroll lock on touch, and restoration fallback after a trigger disappears. Radix supplies the behavior and the fallback is implemented, but those edge cases were not all exercised live.
5. Runtime preference changes, complete reduced-motion presentation, React Profiler commits and Performance traces for idle/scroll/filter/modal/menu/theme interactions. No FPS, long-task, LCP, CLS, INP or Lighthouse improvement is claimed.
6. Live contact delivery on Vercel with valid SMTP settings and the new email field. If using an external `VITE_CONTACT_FORM_ENDPOINT`, it must accept the updated payload. A client/SMTP timeout cannot prove nondelivery; there is deliberately no automatic retry.
7. Social metadata on the production hostname. Image URL is root-relative because the verified production origin was not available; validate crawler resolution and make it absolute when configuring the production origin.

Contrast review found existing palette limitations: mathematical contrast is about **2.76:1** for light-mode primary cyan on white, and **1.76:1** for white at the dark-mode gradient button's cyan endpoint. Actual gradient/text placement needs browser measurement. Colors were retained per the preservation requirement; no WCAG compliance is claimed. These are remaining design/accessibility issues, not performance improvements.
