---
name: new-vertical-demo
description: Scaffolds a new industry-vertical Next.js demo and matching Sitecore authoring modules from user-provided names. Use when the user wants a new demo site, new vertical app, clone from retail/starter/vistra, add a rendering host, or wire xmcloud.build.json and Project.*-Content/-Media modules.
---

# New vertical demo (repo scaffold)

## Goal

Create a **new demo Next.js app** under `industry-verticals/<app-folder>/` and wire **XM Cloud build + item serialization** so CM and Deploy stay in sync—without reusing another brand’s content by accident.

## Collect these inputs first (ask if missing)

| Input | Example | Notes |
|--------|---------|--------|
| `renderingHostKey` | `acme` | Lowercase; must match **Rendering Host** name in CM and the key in `xmcloud.build.json`. |
| `appFolder` | `acme` | Usually same as `renderingHostKey`; use a different folder only if intentional (e.g. shared app). |
| `contentFolder` | `acme` | CM path segment: `/sitecore/content/industry-verticals/<contentFolder>`. Often same as app. |
| `modulePascal` | `Acme` | For `Project.<Pascal>-Content` / `Project.<Pascal>-Media`. |
| `baseApp` | `vistra` \| `retail` \| `starter` | Which existing app to copy as template. Prefer **vistra** for recent patterns (middleware static files, `outputFileTracingRoot`). |
| `displayName` | `Acme Corp` | Human label for Site Grouping / docs. |
| `siteName` (CM) | `acme` | `SiteName` field on Site Grouping; often matches `contentFolder`. |

Confirm whether **one app serves one site** (normal) or **one app serves multiple sites** (document exceptions only).

## Execution order (do not skip)

1. **Copy frontend**  
   Copy `industry-verticals/<baseApp>/` → `industry-verticals/<appFolder>/`.  
   Remove copied `.next/`, `node_modules/`, lockfiles if present (do not commit them).

2. **Rename app-local strings**  
   - `package.json`: update `name` / `description` if needed; fix `prepare` husky path to `industry-verticals/<appFolder>/.husky` when present.  
   - `.env.remote.site` (or template): `NEXT_PUBLIC_DEFAULT_SITE_NAME` and related vars must match the **CM site**, not another brand.  
   - Search for the **old** site key / folder name under the new folder and replace only what belongs to the template (avoid blanket replace across unrelated strings).

3. **Next.js config**  
   Keep `outputFileTracingRoot: path.join(__dirname)` in `next.config.js` when using this monorepo layout.  
   Align `images.remotePatterns` with Edge/media hosts you use.

4. **Middleware**  
   If the site serves **root-level** files from `public/` (logos, manifests), ensure `middleware.ts` `matcher` excludes those paths so multisite middleware does not intercept them (see `industry-verticals/vistra`).

5. **Sitecore CLI / multisite**  
   Regenerate or edit **`.sitecore` outputs** as this repo expects (`sitecore-tools:build`, component/import maps). Do not hand-edit generated maps unless the project already does.

6. **`xmcloud.build.json`**  
   Add a `renderingHosts.<renderingHostKey>` entry pointing at `./industry-verticals/<appFolder>` (mirror an existing host’s shape: `nodeVersion`, `buildCommand`, `runCommand`, `enabled`).  
   Append `Project.<modulePascal>-Content` and `Project.<modulePascal>-Media` to `postActions.actions.scsModules.modules` (order with peers).

7. **Authoring modules**  
   Under `authoring/items/industry-verticals/sites/<appFolder>/` (or a name aligned with repo convention), add:  
   - `<slug>-content.module.json` → namespace `Project.<modulePascal>-Content`, includes for `/sitecore/content/industry-verticals/<contentFolder>` (mirror `vistra-content.module.json`).  
   - `<slug>-media.module.json` → namespace `Project.<modulePascal>-Media`, path `/sitecore/Media Library/Project/industry-verticals/<contentFolder>`.  
   Add serialized items for site root, Settings/Site Grouping, home/Data/Presentation as needed—**copy from the closest existing site**, then rename IDs/paths consistently.

8. **`common.module.json`**  
   - Under `projectMediaFolders` rules, add a `SingleItem` rule for `/<contentFolder>` (see existing `vistra` entry).  
   - If other sites use a full `sites-<name>` include block, add one for the new content tree (mirror `sites-forma-lux` / `sites-gridwell` pattern).

9. **Media library folder item**  
   Add `authoring/items/industry-verticals/common/items/projectMediaFolders/industry-verticals/<contentFolder>.yml` if missing (mirror `vistra.yml`).

10. **Validate**  
    From `industry-verticals/<appFolder>/`: `npm install` (if needed), `npm run build`.  
    Grep repo for old template names in the new folder to catch stragglers.

## CM / Deploy (agent assists; user often performs)

- Create or select **Rendering Host** item named exactly `renderingHostKey`; point Site Grouping **Rendering Host** field to it.  
- SitecoreAI Deploy: project name typically matches `renderingHostKey`.  
- Publish relevant items.

## After completion

Summarize: new paths, module namespaces added, `xmcloud.build.json` keys, and any **manual CM** steps left.

## More detail

See [reference.md](reference.md) for file paths, naming, and common mistakes.
