# UCM

## Overview

UCM is a clean scaffold of the **Nova Medical** (healthcare) demo: same components and IA under `/sitecore/content/industry-verticals/ucm`, with its own item IDs and rendering host **`ucm`**.

## Run locally

1. From the repository root: `cd industry-verticals/ucm`
2. Create `.env.local` (see `.env.container.example` for variable names) and set:
   - `SITECORE_EDGE_CONTEXT_ID` / `NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID`
   - `NEXT_PUBLIC_DEFAULT_SITE_NAME=ucm`
   - `SITECORE_EDITING_SECRET`
3. `npm install`
4. `npm run dev` → http://localhost:3000

## XM Cloud / editing host

Editing host name must be **`ucm`** (see `xmcloud.build.json`). Site Grouping **SiteName** and **RenderingHost** are set for `ucm` in serialized items under `authoring/.../sites-ucm`.

[Content SDK for XM Cloud](https://doc.sitecore.com/xmc/en/developers/content-sdk/sitecore-content-sdk-for-xm-cloud.html)
