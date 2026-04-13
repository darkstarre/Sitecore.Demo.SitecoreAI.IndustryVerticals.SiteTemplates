# Interstate — serialized content (permanent in Git)

Content is **durable** when it lives as YAML under this folder and is **committed**. CM-only edits disappear on a fresh environment unless you **pull** them here and push the repo.

## What is already configured

- **`interstate-content.module.json`** — includes site root, `home`, `Media`, `Data`, `Dictionary`, `Presentation` under `/sitecore/content/industry-verticals/interstate`.
- **`interstate-media.module.json`** — media library folder for Interstate.
- **`common.module.json`** — `sites-interstate` + `projectMediaFolders` rule for `/interstate`.
- **`xmcloud.build.json`** — `postActions.scsModules` lists `Project.Interstate-Content` and `Project.Interstate-Media`.

After the first successful **`sitecore ser pull`**, you should see `items/` appear (mirroring other verticals such as `gridwell`).

## Make CM content permanent (one-time workflow)

1. **Connect CLI** to the XM Cloud / SitecoreAI environment that has the Interstate content you care about (see repo root `README.md` → *Common CLI Commands*).
2. From the **repository root** (or wherever your Sitecore CLI project is configured):

   ```bash
   sitecore ser pull
   ```

   Pull only the Interstate modules if your CLI supports filtering; otherwise pull all and commit only the `interstate` paths.

3. **Review** new/changed files under `authoring/items/industry-verticals/sites/interstate/items/`.
4. **Commit and push** — XM Cloud deployment will apply **`Project.Interstate-Content`** / **`Project.Interstate-Media`** on the next build.

## After authors change content in CM

Repeat **`sitecore ser pull`** → diff → commit. That is how Interstate stays aligned with “source of truth” in Git instead of drifting.

## Docs

- [Serialization in Sitecore](https://doc.sitecore.com/sai/en/developers/sitecoreai/serialization-in-sitecore.html) (SitecoreAI)
