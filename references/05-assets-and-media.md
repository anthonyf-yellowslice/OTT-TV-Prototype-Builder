# Assets and media: images, logos, fonts, stock video, mock content

TV is a lean-back experience on a big screen: soft or stretched imagery is the first thing testers notice. This file says what to include and how to prepare it.

## Contents
1. What a TV prototype needs
2. Exporting images from Figma
3. Choosing, sizing and saving images
4. Logos, brand marks and fonts
5. Stock video
6. Mock content
7. Folder layout and budget

## 1. What a TV prototype needs
| Asset | Used for | Source |
|---|---|---|
| Portrait posters (2:3) | poster rails, focus cards, genre cards | Figma file (largest raw image) |
| Landscape stills / thumbnails (16:9) | sports, streams, upcoming, continue watching | Figma file |
| Hero and per-title backdrops (wide) | hero carousel, rail backdrops, spotlight | Figma file; only genuine high-res art goes full-bleed |
| Title logos (transparent PNG) | hero details, spotlight lockup | Figma file |
| OTT logos (SonyLIV, Sun NXT, ZEE5, JioHotstar, ShortsTV, Chaupal) | selector row, badges on cards | Figma file |
| Live channel logos | Premium Live Channels tiles | Figma file |
| Brand mark | sidebar logo | Figma file |
| QR code | subscription card and drawer | Figma raster (not scannable, fine for a prototype) |
| Fonts | all text | Google Fonts (Zalando Sans + SemiExpanded), ship the latin woff2 locally |
| Video clips | hero trailer, backdrop trailers, stream previews | stock footage (section 5) |
Prefer images that already live in the Figma file: the designer chose them and the card art often contains the title.

## 2. Exporting images from Figma (MCP)
Per node (a rail frame, the hero details frame, a drawer):
1. `download_assets(fileKey, nodeId)` returns `rawImages` (original uploaded images, **capped at 20 per node**, with a truncation flag), `svgAssets` (vectors, also capped) and an `export` render. Call it on **rail-sized frames**, not on whole pages; if a result says truncated, call it on child frames.
2. The response lists temporary URLs. Download them promptly into a scratch folder with a **bash** script (zsh does not word-split unquoted variables, which silently breaks `for id in $ids` loops). Name files `<rail>_<nn>` and detect the real type from the bytes (PNG/JPEG).
3. Hash (md5) to find exact duplicates; the same artwork often appears several times at different resolutions with different hashes, so also compare by eye.
4. Build a contact sheet (a small HTML page with thumbnails and file names, served locally and screenshotted) to identify what each file is. Zoom or paginate: 100px thumbnails are enough to read title art.
5. Keep raw files out of the delivered folder.

`download_assets` on small frames also returns title-logo lockups and channel logos as PNG with transparency. For a lockup that sits in a large transparent canvas, crop it with `sips -c <h> <w> --cropOffset <y> <x> in out`. (Offset 0 is treated as "unset" and centres the crop; use 1.)

## 3. Choosing, sizing and saving images
- **Pick the largest raw version** of each artwork; never use a smaller duplicate.
- **Never upscale.** If the source is smaller than the cap, convert without resizing. Upscaling small files (what the first version did) is the main cause of "blurry images".
- Caps (longest side): portrait posters 1100, landscape stills 1600, backdrops 3200, logos 1600; JPEG quality about 86-88 for photos, PNG for anything with transparency.
- At 1920x1080 on a 2x display a 326x442 focus card needs about 650x900 px, so 1000+ px posters are plenty; most Figma sources are smaller, which is a design-file limit worth telling the user about (e.g. one spotlight background was only 1376 px wide).
- Do not blur backdrops to hide softness. Show portrait posters crisp with a blurred colour wash behind (see `04-layout-and-focus-engine.md`). Keep a QR code crisp with `image-rendering: pixelated`.
- Tooling on macOS without extra installs: `sips` for resize/convert/crop, Python 3 (stdlib only) for batching and md5. There is no PIL or ffmpeg by default.

## 4. Logos, brand marks and fonts
- Sidebar mark: crop the left square of the wide brand logo with CSS (`background-size: auto 100%`).
- OTT badges on cards are small circles (about 38px) holding the platform logo; use the logo of the title's OTT, or the rail's OTT on "Trending on <OTT>" rails.
- Fonts: fetch the Google Fonts CSS with a desktop browser User-Agent, read the `latin` `@font-face` URL for each family, download the woff2 files into `assets/fonts/`, and declare them with a weight range (`font-weight: 200 900`). Do not rely on the network at demo time. Read the font names from `get_variable_defs` (they were `font/family/tittle` and `font/family/Body` variables).

## 5. Stock video
Used wherever the design says a trailer or stream plays. Requirements:
- **Muted, looping, 16:9, 720p**, each clip about 5-8 MB so the folder stays light. Three clips cycle across titles; that is enough for the demo.
- Prefer openly licensed footage (Blender open movies are CC BY). Do not use copyrighted film trailers. Record credits in the README.
- Clips used so far: the *Sintel* trailer 720p (`download.blender.org/durian/trailer/sintel_trailer-720p.mp4`, about 7.6 MB), *Big Buck Bunny* 720p 10 s and a *Jellyfish* 720p 10 s clip (both from `test-videos.co.uk`, about 5 MB each). The Google `gtv-videos-bucket` sample URLs returned 403 when tried, so do not rely on them.
- **Check every clip for baked-in black bars.** The Sintel trailer is 2.35:1 inside a 16:9 frame, which showed as black bands top and bottom; a `scale(1.36)` crop fixes it. Quick check: play the clip full-screen or draw frames to a canvas and look for rows that stay black. Register each cropped clip in a `CLIP_SCALE` map so every player applies it.
- Attach clips lazily (`preload="none"`, set `src` on first use) so the page loads fast.
- Browsers only autoplay **muted** video; call `play()` after moving a `<video>` element in the DOM (moving pauses it).
- Fetching media is a download from the internet: when the user has asked for stock footage that covers it, state in your report what you fetched and from where.

## 6. Mock content
- Put all text in one data file: a catalog (key, title, year, duration, rating, genres, OTT, description, optional backdrop/logo) and the rail definitions that reference catalog keys.
- Keep titles consistent with the art when the poster shows a title. Where the designer gave a sample title (e.g. in a wireframe), use it even if the art is a stand-in, and mention it.
- 6-12 items per rail is enough; reuse artwork across rails but vary order and content so rails do not look identical.
- **Locks:** use a seeded random generator (mulberry32) so the "random" pattern is identical on every load. Apply rail-level overrides the designer asked for (all locked / all unlocked / mixed).
- **Live badges:** only on items that are live; mix live and non-live.
- **Dates:** relative to today ("This Friday", then dated labels).
- **Selector-driven rails** (Explore by OTTs): generate a repeatable list per selector value, preferring titles from that platform.
- Mark everything invented as mock in the README.

## 7. Folder layout and budget
```
<prototype>/
  index.html  styles.css  data.js  app.js  README.md
  assets/
    p/  posters and stills (jpg)
    b/  backdrops (jpg)
    l/  logos, OTT/channel logos, brand mark, QR (png)
    v/  stock clips (mp4)
    fonts/  woff2
```
Aim for under ~60 MB total; the Home demo is about 36 MB (images ~16 MB, video ~17 MB, fonts and logos the rest). Version query strings on CSS/JS links (`?v=N`) avoid stale caches while iterating.
