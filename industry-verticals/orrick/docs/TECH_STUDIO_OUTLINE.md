# Tech Studio — build outline (starter)

Working doc for **Orrick Tech Studio**: what to build in the app + CM so the nav destination matches a real, editable experience (similar spirit to **Portal** + **custom template on People** for straightforward authoring).

---

## 1. Product intent (fill in after meeting)

- **Audience:** _e.g. attorneys, innovation, BD, clients_
- **Job to be done:** _e.g. discover tools, pilots, AI playbooks, contact the tech team_
- **Success for demo:** _e.g. “looks like a real internal hub,” editable without dev, links to 2–3 credible sub-areas_

---

## 2. Current codebase touchpoints

| Area | Location / notes |
|------|-------------------|
| Nav | `Navigation.tsx` — `createTechStudioItem()`, `item-tech-studio`, `/tech-studio-nav-bg.jpg` |
| Brand | `components/non-sitecore/TechStudioLogo.tsx` |
| Comparable pattern | `PortalDashboard` + `Layout.tsx` fallback when `portal` route has empty `headless-main` |
| People / bio pattern | `AttorneyDetails` — **custom Doctor template + rich text** for editor-friendly setup (no treelist required for demo) |

**Implemented:** `TechStudioDashboard` — **same field shape as `PortalDashboard`**. UI is rendered by client **`TechStudioExperience`**: card grids, **Lucide** icons, **SVG hero graphic**, **CSS motion** (`tech-studio-experience.module.css`: float, orbit, marquee, stagger; respects `prefers-reduced-motion`). Section **titles** still come from Sitecore; body copy for cards is **structured in code** for the demo, with optional **rich-text blocks** appended when CMS fields (`*Content`) have real HTML. Fallback + `Layout.tsx` when Tech Studio route and empty `headless-main`. Component map: **`TechStudioDashboard`**.

---

## 3. Recommended architecture (MVP)

### 3.1 Experience shape

- **Single primary page** (e.g. route name `tech-studio` or page title match — align with CM item name).
- **Same sections as Portal** (labels + rich text fields match `PortalDashboard` for easy copy of datasource template in CM).

### 3.2 Front end (Next.js / Orrick app)

1. **`TechStudioDashboard.tsx`** — structurally identical to `PortalDashboard.tsx`; Tech Studio–specific default copy only.
2. **Component map** — `TechStudioDashboard` next to `PortalDashboard`.
3. **Layout** — same condition as Portal: empty `headless-main` → **`TechStudioDashboardFallback`**.

### 3.3 Sitecore (authoring)

1. **Datasource template** — duplicate **Portal** dashboard template (same field names: `PortalLabel`, `WelcomeTitle`, `IntroText`, …) or one shared template with two renderings.
2. **Rendering item** — points at the React component name; **Datasource Location** set so authors can create/select one hub item.
3. **Page** — Tech Studio page uses a page design that includes the rendering on `headless-main` (or rely on layout fallback until then).
4. **Editing** — authors edit the **datasource item** (or page fields if you prefer **page-owned fields** like the custom People template — your call; datasource keeps the hub reusable).

---

## 4. Phased delivery

| Phase | Scope |
|-------|--------|
| **P0 — Demo-ready** | Static-looking hub with real Sitecore fields; nav lands on a page that always renders (fallback + one authored layout). |
| **P1** | Secondary routes or query params (`?view=…`) for sub-views if you want multiple “tabs” without many CM pages. |
| **P2** | Linked data (treelists / articles) **only if** demo needs “not manually typed” — defer until CM setup is easy. |

---

## 5. Open decisions (checklist)

- [ ] Final **URL / route item name** in CM (must match any `Layout` detection logic).
- [ ] **One datasource** vs **fields on the page item** (mirrors “custom template on People” simplicity).
- [ ] **Visual system** — reuse Portal card styles vs distinct Tech Studio art direction (logo + nav bg already imply a brand lane).
- [ ] **Serialized items** — add under `authoring/…` when template + rendering are stable (team convention).

---

## 6. Engineering tasks (scratch list)

- [x] Scaffold `TechStudioDashboard.tsx` (Portal parity).
- [x] Register `TechStudioDashboard`; verify in local + EE.
- [x] Add `TechStudioDashboardFallback` + `Layout.tsx` (same pattern as Portal).
- [ ] Authoring: template + rendering + sample datasource item (serialize when ready).
- [ ] Smoke test: nav → Tech Studio → edit in EE → publish → Edge.

---

## 7. References in this repo

- `src/components/portal-dashboard/PortalDashboard.tsx` — pattern source.
- `src/components/tech-studio-dashboard/TechStudioDashboard.tsx` — Portal-equivalent for Tech Studio.
- `src/Layout.tsx` — `shouldRenderPortalFallback` pattern.
- `src/components/attorney-details/AttorneyDetails.tsx` — merge/fallback patterns for optional CMS data.

---

*Last updated: starter outline for post-meeting fill-in.*
