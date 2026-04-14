/**
 * Loaded only from sitecore.cli.config.ts (Sitecore CLI / Node).
 * Do not import from sitecore.config.ts — that file is bundled for the browser.
 */
import { loadEnvConfig } from '@next/env';

loadEnvConfig(process.cwd());
