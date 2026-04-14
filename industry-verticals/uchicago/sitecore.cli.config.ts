import './sitecore-env-bootstrap';
import scConfig from './sitecore.config';
import { defineCliConfig } from '@sitecore-content-sdk/nextjs/config-cli';
import {
  generateSites,
  generateMetadata,
  extractFiles,
  writeImportMap,
} from '@sitecore-content-sdk/nextjs/tools';

const hasEdgeContext =
  !!process.env.SITECORE_EDGE_CONTEXT_ID || !!process.env.NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID;
const hasLocalApi =
  (!!process.env.SITECORE_API_HOST || !!process.env.NEXT_PUBLIC_SITECORE_API_HOST) &&
  (!!process.env.SITECORE_API_KEY || !!process.env.NEXT_PUBLIC_SITECORE_API_KEY);

const buildCommands = [
  generateMetadata(),
  ...(hasEdgeContext || hasLocalApi ? [generateSites()] : []),
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
