import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// The journal editor and the Home symbol picker are private tools: they exist
// only under `npm run dev` and are never part of the published site.
const editorLocalOnly = {
  name: 'editor-local-only',
  hooks: {
    'astro:config:setup': ({ command, injectRoute, injectScript }) => {
      if (command !== 'dev') return;
      injectRoute({ pattern: '/editor', entrypoint: './src/editor/editor.astro' });
      injectScript('page', `import '/src/dev/symbol-picker.js';`);
    },
  },
};

// GitHub Pages serves the site at marktalevski.github.io/markt/
export default defineConfig({
  site: 'https://marktalevski.github.io',
  base: '/markt',
  trailingSlash: 'always',
  integrations: [react(), editorLocalOnly],
});
