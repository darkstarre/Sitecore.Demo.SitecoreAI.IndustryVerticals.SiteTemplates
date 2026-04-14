import { loadEnvConfig } from '@next/env';

// Ensure sitecore-tools picks up .env.local/.env* during CLI execution.
loadEnvConfig(process.cwd(), process.env.NODE_ENV !== 'production');
