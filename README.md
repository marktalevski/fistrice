# markt

Mark's personal site: <https://marktalevski.github.io/markt/>

Built with [Astro](https://astro.build). Every push to `main` publishes the site through GitHub Pages (`.github/workflows/deploy.yml`).

## Pages

| Address | File |
|---|---|
| `/markt/` | Home, the brush-painted symbol (`src/components/Home.jsx`) |
| `/markt/freediving/` | Dive log (`src/components/Freediving.jsx`) |
| `/markt/sound/` | Placeholder (`src/components/Sound.jsx`) |
| `/markt/journal/` | Placeholder (`src/components/Journal.jsx`) |
| `/markt/editor/` | Journal editor, hidden from search engines (`src/components/Editor.jsx`) |

Each component is the Claude Design prototype's own logic class, unchanged except for page links, plus its template rewritten as JSX. `src/lib/dc.js` supplies the small base class they expect.

## Journal entries

The published entries are in `src/data/site.json`. To change them, open `/markt/editor/`, edit (changes save in that browser only), click **Export JSON**, and save the file over `src/data/site.json`.

## Design files

`Mark-T-Website/` holds the Claude Design handoff the site was built from. When a new design version arrives there, run `tools/convert-design.mjs` into a scratch folder and port only what changed.

## Running it locally

```bash
npm install
npm run dev
```
