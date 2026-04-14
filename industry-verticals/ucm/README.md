# ucm

## Overview

**ucm** is a healthcare-style demo site (cloned from the Nova Medical / healthcare vertical). The **rendering host** in Deploy is still **`ucm`** (`xmcloud.build.json`). Until the **ucm** site item tree exists in CM, this app is wired to use the **Nova Medical** site (`nova-medical`) for Edge content — same pages and styling as `industry-verticals/healthcare`. Then set **`NEXT_PUBLIC_DEFAULT_SITE_NAME=ucm`** and multisite will follow.

## Run site locally

1. From the repo root: `cd industry-verticals/ucm`
2. In **this folder** (`industry-verticals/ucm`), copy `.env.container.example` to **`.env.local`** (gitignored) and set Edge / site variables. `sitecore-tools` and Next both read env from here, not from the repo root.
3. `npm install`
4. `npm run dev`
5. Open http://localhost:3000 (middleware usually sends you to a locale path such as `/en`).

### White or blank page locally

- Use **`NEXT_PUBLIC_DEFAULT_SITE_NAME=nova-medical`** (default in `.env.container.example`) so you load the same site as the healthcare app. After CM has a **ucm** site, switch to **`ucm`**.
- Confirm Edge **`SITECORE_EDGE_CONTEXT_ID`** / **`NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID`** match the environment that includes Nova Medical.
- Clear the **`sc_site`** cookie or try **`?site=nova-medical`** if you previously hit the app with another default site.

## Editing host

In XM Cloud / SitecoreAI Deploy, the editing / rendering host name should match **`ucm`** (see `xmcloud.build.json`).
