---
name: crew-design
description: "Defines screens, states and flows (docs/11) and the design system (docs/12 + tokens): information architecture, words first, tokens, components, responsive and accessibility rules, low-fidelity mocks and UI quality gates. Use before any UI spec and whenever a screen is added or changed."
license: MIT
metadata:
  anycrew-agent: designer
  anycrew-phase: design
---

# Screens and design system

Delegate to the **designer** (balanced tier). Templates: `templates/docs/11-frontend.md`,
`templates/docs/12-design-system.md`.

1. Inputs: `docs/03` journeys, `docs/05`, `docs/10`.
2. Outputs: `docs/11-frontend.md` (routes, screens, states, flows), `docs/12-design-system.md`
   (principles, tokens, components, content style, gates), `contracts/design/tokens.json`,
   mocks under `design/mocks/` with screenshots at 390/834/1440 px in `docs/assets/`.
3. Gate: every screen has words for empty, loading, error and success; every token contrast
   pair passes AA; no screen scrolls horizontally at 360 px.

Done when the docs exist and the person has looked at the mocks at three widths.
