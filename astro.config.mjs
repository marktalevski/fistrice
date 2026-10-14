import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// GitHub Pages serves the site at marktalevski.github.io/markt/
export default defineConfig({
  site: 'https://marktalevski.github.io',
  base: '/markt',
  trailingSlash: 'always',
  integrations: [react()],
});
