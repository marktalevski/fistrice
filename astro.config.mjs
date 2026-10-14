import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// The journal editor is a private tool: it exists only under `npm run dev`
// and is never part of the published site.
const editorLocalOnly = {
  name: 'editor-local-only',
  hooks: {
    'astro:config:setup': ({ command, injectRoute }) => {
      if (command === 'dev') injectRoute({ pattern: '/editor', entrypoint: './src/editor/editor.astro' });
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
