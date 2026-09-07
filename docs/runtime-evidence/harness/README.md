# Runtime harness evidence

These are the exact diagnostic scripts used in this verification. They use temporary Playwright and axe dependencies installed outside the portfolio. They are evidence/diagnostic scripts, not a new project test suite. They contain local paths for this workspace and Chrome installations.

Production preview: `pnpm preview --host 127.0.0.1 --port 4174 --strictPort`.
Tool installation: `npm install --prefix /private/tmp/portfolio-e2e-tools playwright @axe-core/playwright --no-audit --no-fund`.
Copy the desired script to that temporary tools directory and execute with Node. The zoom script additionally uses the temporary extension recorded alongside this README; copy it to the script's expected path.

`verify.mjs` preserves the broad run, including three test-assumption failures later corrected in `followup.mjs`. `motion-details.mjs` preserves a WAAPI inspection that could not see Framer's JS animation; `timing.mjs` measures rendered opacity instead. `visibility.mjs` records an environment limitation, not a confirmed application failure. See the main end-to-end report for the disposition of each result.

All real POST requests are blocked; form fetches are explicitly mocked. No SMTP delivery occurs. The visibility test deliberately does not spoof document.hidden or dispatch a synthetic event and call that real tab verification.
