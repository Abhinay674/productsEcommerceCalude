GATE 1 VERDICT: APPROVE_PLAN
All checks passed. Tester can proceed.

LAYERING:
[YES] BackToTop is self-contained — no context imports, no data imports, no props
[YES] Scroll logic stays inside BackToTop's useEffect — not in App.js or a page
[YES] App.js change is only adding <BackToTop /> — no scroll logic in App.js

INTERFACE CONTRACTS:
[YES] Component name and signature match BACKLOG: BackToTop() with no props
[YES] Threshold is exactly window.scrollY > 300
[YES] Click handler is exactly window.scrollTo({ top: 0, behavior: 'smooth' })
[YES] aria-label="Back to top" planned

COMPLETENESS:
[YES] All 5 done criteria have at least one planned element addressing them
[YES] Style values present: position fixed, bottom 32px, right 32px, zIndex 99, colors #1a1a2e / #fff
[YES] Build order correct: BackToTop.js before App.js modification
