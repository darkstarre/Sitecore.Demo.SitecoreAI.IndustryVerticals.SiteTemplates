import scConfig from './sitecore.config';
import { defineCliConfig } from '@sitecore-content-sdk/nextjs/config-cli';
import { generateMetadata, extractFiles, writeImportMap } from '@sitecore-content-sdk/nextjs/tools';

export default defineCliConfig({
  config: scConfig,
  build: {
    commands: [
      generateMetadata(),
      extractFiles(),
      writeImportMap({
        paths: ['src/components'],
      }),
    ],
  },
  componentMap: {
    paths: ['src/components'],
    exclude: ['src/components/content-sdk/*', 'src/components/non-sitecore/*'],
  },
});
