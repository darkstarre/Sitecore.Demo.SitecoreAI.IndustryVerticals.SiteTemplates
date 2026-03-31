# New vertical demo — reference

## Canonical examples in this repo

| Concern | Example path |
|---------|----------------|
| Recent full-site app | `industry-verticals/vistra/` |
| Shared vertical app for a differently named CM site | `industry-verticals/energy/` + Gridwell content under `authoring/.../gridwell/` |
| XM Cloud hosts | `xmcloud.build.json` → `renderingHosts`, `postActions.actions.scsModules.modules` |
| Site item modules | `authoring/items/industry-verticals/sites/vistra/vistra-content.module.json`, `vistra-media.module.json` |
| Tenant-wide rules | `authoring/items/industry-verticals/common/common.module.json` |
| Media folder stub | `authoring/items/industry-verticals/common/items/projectMediaFolders/industry-verticals/vistra.yml` |

## Naming conventions

- **`renderingHostKey`**: lowercase, alphanumeric + hyphen; matches Deploy project / CM Rendering Host item name (e.g. `vistra`, `energy`, `retail`).
- **`contentFolder`**: lowercase segment under `/sitecore/content/industry-verticals/` (e.g. `vistra`, `gridwell`).
- **`modulePascal`**: PascalCase for module namespace suffix (e.g. `Vistra` → `Project.Vistra-Content`).
- **Mismatch is valid**: Gridwell content lives under `gridwell` while the rendering host may be `energy`—document this explicitly for each demo.

## `xmcloud.build.json` snippet shape

Copy an existing host block; change:

- Object key = `renderingHostKey`
- `path` = `./industry-verticals/<appFolder>`

Add both content and media module names to `scsModules.modules`.

## `common.module.json` touch points

1. **`projectMediaFolders` → `rules`**: new `path` like `/<contentFolder>` with `scope: SingleItem`, `allowedPushOperations: CreateOnly`.
2. **`sites-*` block** (optional but common for full sites): duplicate a peer block (e.g. `sites-skywings`), rename to `sites-<contentFolder>`, set `path` to `/sitecore/content/industry-verticals/<contentFolder>`, keep the same rule structure for `home`, `Media`, `Data`, `Dictionary`, `Presentation`, `Settings/Site Grouping`.

## Frontend checklist

- [ ] `next.config.js` includes `outputFileTracingRoot: path.join(__dirname)` when app lives under repo root with other `package-lock.json` files.
- [ ] `middleware.ts` excludes `/public` root static assets that must not pass through Sitecore multisite middleware.
- [ ] `.env` / `.env.remote.site`: `NEXT_PUBLIC_DEFAULT_SITE_NAME` matches the **site** being edited in CM.
- [ ] No committed `.next/` or `node_modules/`.

## Common mistakes

- Site Grouping **Rendering Host** points to another brand’s host → wrong layout/content.
- Forgetting **`scsModules.modules`** entries → items never deploy to CM.
- Forgetting **`common.module.json`** media rule → push errors or missing Media Library folder.
- Copying an app but leaving **old site name** in env or Sitecore config → headless resolves wrong site.

## Suggested user message to trigger the agent

> Run **new-vertical-demo**: rendering host `acme`, app folder `acme`, content folder `acme`, module `Acme`, copy from `vistra`, display name `Acme Corp`, site name `acme`.
