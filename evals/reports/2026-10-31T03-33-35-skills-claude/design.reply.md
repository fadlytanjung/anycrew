The three files exist and are consistent. `docs/README.md` already lists documents 11 and 12, so no index change was needed. Nothing was committed, matching the rest of the uncommitted docs on this branch.

**What was produced**

- `docs/11-frontend.md`: route table, flow diagram, app shell, and the three P0 screens (Sign in with a create-account mode, Workspace home, List) plus a Not found screen. Every screen has its exact words and a state table covering loading, empty, error variants and success, with where focus lands. Section 7 holds the 360–1600 px rules as four window classes.
- `docs/12-design-system.md`: principles, type, spacing, colour roles, a measured contrast table, eleven P0 components with variants and states, content style, accessibility rules, and ten UI quality gates the tester can automate.
- `contracts/design/tokens.json`: colour roles, type, spacing, sizes, radius, elevation, motion, breakpoints and a `contrast.pairs` block. I recomputed every stored ratio from the hex values and all 21 pairs pass AA.

**Design decisions worth knowing**

- The workspace ID is not in the URL. P0 has one workspace per user, so routes are `/`, `/lists/:listId`, `/sign-in`, `/sign-up`. A foreign or missing list ID shows the same Not found words, per FR-012.
- The assignee control is a menu even though P0 has one member, so P1 membership adds items rather than a redesign.
- Done tasks keep their position in the list so a row never jumps when ticked. State is shown by strike-through, muted text and hidden text, never colour alone.
- One light theme only. Dark mode, a two-pane home and display names are listed as open assumptions D-1 to D-4 in the frontend doc.

**Not done**

- Mocks under `design/mocks/` and screenshots at 390/834/1440 px were not produced. The skill's full "done" also requires a person to look at the mocks at three widths, which cannot happen in this run. Section 8 of the frontend doc records this and supplies the shared synthetic fixture the mocks and tests should use.
- Docs 05 (architecture) and 10 (API contract) do not exist yet, so error mapping assumes problem+json with a per-field `errors[]` array, as the conventions doc implies. When `/crew-architecture` writes doc 10, the error state rows in the frontend doc should be checked against it.