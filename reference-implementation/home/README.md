# Home prototype (reference implementation)

The working PlayboxTV TV Home prototype the skill was written from. **Code only**: the `assets/` folder is not committed (images, logos, fonts and stock video, about 36 MB).

Files: `index.html`, `styles.css`, `data.js` (mock catalog, rails, hero slides, lock rules), `app.js` (focus engine).

To run it you need an `assets/` folder next to `index.html` with the subfolders and file names that `data.js` and `app.js` reference:
- `assets/p/<key>.jpg` posters and stills (one per catalog key in `data.js`)
- `assets/b/<name>.jpg` backdrops (`gadar`, `f1`, `interstellar`, `tehran`, `sports`, `godzilla`)
- `assets/l/<name>.png` logos (title lockups, OTT logos, channel logos, `playbox`, `qr`)
- `assets/v/trailer.mp4`, `stream1.mp4`, `stream2.mp4` stock clips
- `assets/fonts/ZalandoSans-latin.woff2`, `ZalandoSansSemiExpanded-latin.woff2`

See `../../references/05-assets-and-media.md` for how to produce them. To reuse the engine for another module, keep `app.js`, `styles.css` and `index.html`, and replace the catalog and `SECTIONS` in `data.js`; add card types in `TYPES` and `cardInner` as described in `../../references/04-layout-and-focus-engine.md`.
