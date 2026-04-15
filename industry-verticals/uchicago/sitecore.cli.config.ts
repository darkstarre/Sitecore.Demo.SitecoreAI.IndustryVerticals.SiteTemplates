import './sitecore-env-bootstrap';
import scConfig from './sitecore.config';
import { defineCliConfig } from '@sitecore-content-sdk/nextjs/config-cli';
import { generateMetadata, extractFiles, writeImportMap } from '@sitecore-content-sdk/nextjs/tools';

const buildCommands = [
  generateMetadata(),
  // Omit generateSites(): it overwrites .sitecore/sites.json with every Edge tenant and blows up
  // getStaticPaths / multisite for this single-site app. sites.json is committed for uchicago only.
  extractFiles(),
  writeImportMap({
    paths: ['src/components'],
  }),
];

export default defineCliConfig({
  config: scConfig,
  build: {
    commands: buildCommands,
  },
  componentMap: {
    paths: ['src/components'],
    // Exclude content-sdk and other auxillary components
    exclude: ['src/components/content-sdk/*', 'src/components/non-sitecore/*'],
  },
});
