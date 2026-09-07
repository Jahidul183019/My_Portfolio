# End-to-end verification — 7 September 2026

**Final readiness: NOT READY.** Most requested browser checks now have real evidence. Remaining verification includes true hidden-tab pause/resume and manual contrast review for cases axe cannot resolve. This is not a claim that those behaviors are broken.

The production build was served from a fresh preview at `http://127.0.0.1:4174/`. Native Chrome/Edge control was retried after clipboard/state failures; the in-app browser was unavailable. With explicit user authorization, verification moved to isolated Playwright Chrome 152.0.7977.82. True 200% zoom used the installed Chrome for Testing and the browser's `chrome.tabs.setZoom(2)` API in a temporary isolated extension/profile, not CSS zoom, device scale alone, or pinch emulation. Project dependencies were not changed.

## Observed defects and fixes

1. **About entrance overflow at 200% browser zoom:** initial document width was 726 CSS pixels for a 720-pixel viewport. The offscreen skills entrance extended outside the section. Added `overflow-x-clip` to About. The repeated real zoom test reports document width 720/viewport 720; the dialog is inside the viewport at x=24, y=25, width=672, height=450 within 720×500 CSS pixels.
2. **Stale measured header offset:** actual header shrank to 69 pixels while section offset retained the initial 84+12 pixels. The resize observer tracked the content box, which did not change with padding. Observing `border-box` now updates it. Final six-width checks verify computed scroll margin equals actual header height +12 pixels; upward/downward navigation and active state pass.
3. **Error-toast contrast in both themes:** axe measured title ratios 3.62/3.59 and description ratios 3.19/3.16, below 4.5:1. Changed only the destructive background token to HSL 0 72% 40%. Repeated rendered toast contrast tests pass in both themes; the configured-color regression test now includes the title and 90%-opacity description.

No other application changes were made during this turn. API tests additionally verify the transport timeout options. Resume was not modified. No real email was sent; browser POSTs were blocked and successful/failed/slow submissions used mocked fetch responses.

## Final verification table

| Issue | Final status | Runtime evidence | Remaining action |
|---|---|---|---|
| Image optimization | ✅ VERIFIED FIXED | Actual currentSrc and requests at 320/375/430/768/1024/1440; local cards selected WebP, not original PNG/JPG; responsive modal sources; lazy images and forced-failure fallbacks tested; delayed image container stayed 382×192 | External services remain availability dependencies; no field CLS claim |
| Project keyboard access | ✅ VERIFIED FIXED | Enter/Space filter activation, pressed state and category counts; keyboard traversal to all 13 project controls; visible outlines; both motion modes | None within tested browser scope |
| Dialog accessibility | ✅ VERIFIED FIXED | 52 combinations: 13 projects × 1440/375 widths × normal/reduced motion. Initial focus, repeated Tab/Shift+Tab, Escape, trigger restoration, body lock, and scrollable long content pass | Screen-reader speech and physical-device coverage are not claimed |
| Starfield RAF cleanup | ⚠️ PARTIALLY FIXED | Three real SPA mount/unmount cycles: canvas paints stop and own listeners/intervals disappear; resize and dynamic reduction/resume pass; counts do not accumulate | Actual hidden-tab transition was not reliably exposed by test browser |
| Reduced motion | ✅ VERIFIED FIXED | Both directions without root/dialog remount; form value preserved; all section targets visible; pulse/scroll behavior changes; filter/menu/entrance/exit/modal transitions exercised; normal modal transforms resume | Results cover browser media emulation, not every physical OS/device |
| Custom cursor | ✅ VERIFIED FIXED | Browser React commit instrumentation: 100 coordinate-only moves add zero commits; cursor centers reach pointer within 1px; touch context excludes it; dynamic fine→touch→fine listeners 1→0→1; unmount cleanup passes | No FPS or universal physical-device jitter claim |
| Unused providers | ✅ VERIFIED FIXED | Production application exercises navigation, filters, dialogs, theme, menu and form flows without the removed providers; no page errors in successful runs | No dependency removal performed |
| Font loading | ✅ VERIFIED FIXED | Fresh browser contexts request Google CSS and font resources; all required faces available, actually used weights loaded, FontFace display=swap; forced font failure retains readable content | Unused mobile Inter 700 correctly need not load; no claimed waterfall improvement |
| Contact accessibility | ✅ VERIFIED FIXED | Empty/invalid input, field labels/error associations, maxlength enforcement and schema overlength rejection, pending/disabled state, 5 repeated submits→1 request, success reset, HTTP/network errors and real 30-second timeout recovery pass | Live delivery deliberately excluded; mailto href verified without composing/sending mail |
| Contact API security | ⚠️ PARTIALLY FIXED | Actual handler with mocked transport passes malformed/type/length/email/injection, trimming, text content, replyTo and success/failure tests; 10s connection/10s greeting/20s inactivity options asserted | No total transaction deadline exists; no deployed SMTP transaction was exercised |
| Navbar scroll | ✅ VERIFIED FIXED | Up/down anchors and active-section state pass at tested widths; listener count returns to baseline after unmount; measured header update regression passes | No CPU or scroll-handler duration benchmark claimed |
| Hero timer | ⚠️ PARTIALLY FIXED | Actual title changes onscreen; offscreen pauses for >3 seconds, returns to one interval on resume; reduction and unmount stop timer; repeated navigation stable | Actual hidden-tab pause/resume still needs a reliable visibility transition |
| Responsive layout | ✅ VERIFIED FIXED | Both themes at 320×740, 375×812, 430×932, 768×1024, 1024×768, 1440×900, plus 740×320, 812×375, 932×430; no page overflow or out-of-bounds interactive controls; mobile menu Escape/focus pass; final six-width regression passes | Emulated viewports do not replace all physical-device testing |
| Zoom | ✅ VERIFIED FIXED | Actual browser zoom 2.0 verified through tabs API; /, /projects, /contact at 720×500 CSS viewport; menu, keyboard dialog traversal/restoration and viewport bounds pass after overflow fix | None within this browser scenario |
| Scroll margin | ✅ VERIFIED FIXED | Direct routes and upward/downward anchor navigation settle below header; border-box offset checked against actual DOM geometry at all six widths | No claim that a heading is at its final position mid-scroll |
| Project stagger | ✅ VERIFIED FIXED | Rendered opacity sampled over real animation frames; stagger is short in normal mode and zero in reduced mode; visible cards reach full opacity; dynamic preference changes exercised | No FPS claim; raw timings in timing-reservation.json |
| SEO/meta | ⚠️ PARTIALLY FIXED | Fresh generated HTML has title, description, OG title/description/portrait and favicon; actual unknown route renders 404 and Back to home works | Verified deployment origin needed for absolute OG image; canonical not configured |
| CSS/Tailwind | ✅ VERIFIED FIXED | Real browser renders loaded fonts, focus outlines, perspective/transforms, both themes, pulse suppression, updated scroll offsets and clipped entrance overflow | Scope is existing active UI, not every unused component |
| Contrast | ⚠️ PARTIALLY FIXED | Six page/dialog/error axe runs plus hover/focus checks report zero violations in tested states. Separately observed toast failures fixed and rerun successfully | Axe marks gradient/transparency/image cases incomplete; manual contrast review remains. Disabled controls are not treated as normal-text WCAG failures |
| Build/typecheck | ✅ VERIFIED FIXED | Final typecheck, production build, 7 tests and whitespace checks all exit 0 | None |
| Runtime testing | ⚠️ PARTIALLY FIXED | Real production-browser matrix, fresh contexts, keyboard/device emulation, screenshots, network resources, mocked form flows and lifecycle instrumentation recorded | Hidden-tab verification and axe manual-review cases remain; no full browser/device/screen-reader certification |
| Lighthouse | ⏭️ NOT TESTABLE | `command -v lighthouse` returned exit 1; Lighthouse CLI unavailable; no audits run | Run repeated production Lighthouse audits when available |

**Verified fixed count: 15/22 = 68.2%.** This is an equal-weight verification-coverage measure, not a percentage of implementation quality. Partial and untestable rows do not count as fully verified.

## Evidence and failure disposition

Evidence lives in [runtime-evidence](runtime-evidence/). `results.json` records the broad run; `followup.json` resolves its three test-assumption failures. `lifecycle.json`, `assets-layout.json`, `zoom.json`, `motion-details.json`, `timing-reservation.json`, `visibility-hybrid.json` and `toast-contrast.json` record targeted checks. Screenshots and axe JSON retain detailed evidence. Diagnostic harness copies are included under `runtime-evidence/harness`.

Failures are not silently marked passed:

- Early scroll-lock and anchor checks sampled while a long smooth scroll was still settling. Longer settled measurements and independent screenshots confirmed correct lock/heading behavior. An open dialog after an assertion caused cascading locator timeouts; cleanup was corrected before rerunning all 52 combinations.
- One resize listener survives the first Home mount. Its function body is Framer's root projection resize handler; it remains one across three cycles. Home-specific listeners, timer and canvas work do not accumulate. This is not an accumulating application leak.
- Slow-form text matched both the visible toast and its accessibility live region; the selector was scoped and the full 30-second timeout rerun passed.
- Normal entry cannot exceed maxlength. Tests now verify that prevention, then remove the attribute only in the test DOM to verify schema rejection independently.
- A remaining image was legitimately offscreen/lazy. Scrolling every image into view before asserting forced-failure fallback resolved the test.
- Unused mobile font weights need not download; available faces and rendered weights are now checked separately.
- Framer's JS entrance animations were not visible through the attempted WAAPI inspection. Real frame-by-frame opacity sampling supplies the timing evidence instead.
- The actual headed visibility attempt remains unsuccessful: new tabs, minimization, removal of background-throttling flags, and a focus-emulation override still returned document.hidden=false. No synthetic property override is presented as actual hidden-tab verification. This is an unverified environment-dependent item, not an observed application defect.

## Measurements actually collected

- Final build: JS **499.69 kB / gzip 156.84 kB**; CSS **84.27 kB / gzip 14.16 kB**; HTML 1.38 / gzip 0.61 kB.
- Representative 1440px project-1 card: actual `project-1-480.webp`, encoded body **21,994 bytes**, Resource Timing transfer **22,294 bytes**. Modal uses `project-1-800.webp` at desktop; 320–430px mobile modal uses the appropriate 480w variant. Original 6.82 MB PNG was not requested by the tested cards.
- Delayed screenshot download: reserved container remains **382×192** before and after decode.
- Exact viewport dimensions, zoom factor, resource requests, currentSrc values, loaded font faces and opacity timing samples are recorded in JSON.
- No Lighthouse scores, LCP/FCP/CLS/TBT/INP/FPS improvements, field performance or CPU improvements are claimed. Resource timing is local-browser evidence, not a field performance benchmark. Some cross-origin timing details are unavailable.

No unexpected JavaScript page errors were captured in successful matrix runs. Intentional mocked network errors and blocked-image/font failure tests are recorded separately from normal-load requests. This does not certify all third-party assets will remain available.

## Final commands and Resume

- `pnpm typecheck` — exit 0.
- `pnpm build` — exit 0; Vite 5.4.21; 1,972 transformed modules. A stale Browserslist-data warning remains; no dependency update was performed.
- `node --test tests/*.test.mjs` — 7 passed, 0 failed. The logged mock SMTP failure is intentional.
- `git diff --check` — exit 0.
- `shasum -a 256 public/Resume.pdf` — unchanged: `927f5794f61c97fc2051595e40c90aae598ee64c3e5c35a49f7f7fe94ea20fba`.

**Confirmed unresolved application defects:** none from completed checks. **Unverified items:** actual hidden-tab behavior, axe manual-review contrast cases, physical-device/screen-reader coverage beyond browser emulation, deployed SMTP timing, absolute production OG URL, and Lighthouse. These limitations prevent declaring the requested full verification finished.
