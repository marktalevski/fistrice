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

The journal editor (`src/components/Editor.jsx`, page `src/editor/editor.astro`) is private: it only exists on your own computer while `npm run dev` is running, at <http://localhost:4321/markt/editor/>. It is never published.

Each component is the Claude Design prototype's own logic class, unchanged except for page links, plus its template rewritten as JSX. `src/lib/dc.js` supplies the small base class they expect.

## Journal entries

The published entries are in `src/data/site.json`. To change them, run `npm run dev`, open the editor at <http://localhost:4321/markt/editor/>, edit (changes save in that browser only), click **Export JSON**, and save the file over `src/data/site.json`.

## Design files

`Mark-T-Website/` holds the Claude Design handoff the site was built from. When a new design version arrives there, run [`tools/convert-design.mjs`](tools/convert-design.mjs) into a scratch folder (`node tools/convert-design.mjs Mark-T-Website ../scratch-site`) and port only what changed. Never point it at this repo's `src/`: it would overwrite the site's own edits.

## Running it locally

```bash
npm install
npm run dev
```
