# ucm

## Overview

**ucm** is a healthcare-style demo site (cloned from the Nova Medical / healthcare vertical). Use **`ucm`** as the rendering host key in `xmcloud.build.json` and set **`NEXT_PUBLIC_DEFAULT_SITE_NAME`** to the CM **SiteName** for `/sitecore/content/industry-verticals/ucm`.

## Run site locally

1. From the repo root: `cd industry-verticals/ucm`
2. Copy `.env.container.example` to `.env.local` (or use your team’s remote env template) and set Edge / site variables.
3. `npm install`
4. `npm run dev`
5. Open http://localhost:3000

## Editing host

In XM Cloud / SitecoreAI Deploy, the editing / rendering host name should match **`ucm`** (see `xmcloud.build.json`).
