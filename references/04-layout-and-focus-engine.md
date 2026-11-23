# Layout and focus engine

How the reference implementation (`reference-implementation/home/app.js`) turns a designer's focus-state frames into behaviour. Read this before adding a rail/card type or changing a focus layout.

## Contents
1. Stage
2. Sections, types and geometry
3. Vertical layout: anchors
4. Horizontal layout: rails
5. Modes: backdrop-with-details vs plain
6. Dimming and hiding
7. Timers, trailers and video
8. Home special cases
9. Adding a new rail type or module
10. Mapping Figma frames to engine settings

## 1. Stage
A fixed `1920x1080` element centred in the window and scaled with `transform: scale(min(w/1920, h/1080))`. Everything is positioned in design pixels, so measurements read straight off Figma. Letterbox bars outside the stage are plain black.

## 2. Sections, types and geometry
The page is a list of **sections** (hero, selector row, rails, banners). Each has a **type** that defines card geometry (design px):

| Type | Card | Focused card | `cy`* | Mode | Notes |
|---|---|---|---|---|---|
| `poster` | 240x352 | 326x442 | 805 | a | portrait posters |
| `posterSm` | 240x300 | 312x390 | 805 | a | "Trending on <OTT>" rails |
| `ottrail` | 240x356 | 326x442 | 805 | a | panel when unfocused, titled rail when focused |
| `sports` | 372x209 | 474x265 | 693 | a | caption under focused card (+70 section height) |
| `upcoming` | 504x315 | 554x347 | 830 | a | card is the focus target, reminder pill toggles |
| `cw` | 240x352 / 504x352 | x1.15 | 520 | b | mixed card widths, title + progress text below |
| `stream` | 636x400 | 771x487 | 506 | b | plays video inside the focused card |
| `genre` | 240x327 | 326x442 | 518 | b | tinted label bar |
| `live` | 174x174 | 217x217 | 520 | b | logo tiles |
| `banner` | 1568x591 | same | n/a | b | ring only; section top at y=204 when focused |
| `spot` | 220x300 | 600x338 (16:9) | n/a | b | see special cases |
| `hero`, `otts` | n/a | n/a | n/a | h | see special cases |

*`cy` = screen Y of the vertical centre of the card row when that section is focused. Gap between cards is 24; the left edge of rails is x=180.

Section heights (design px): title block = 48 top padding + 52 title + 24 gap = **124**; bottom padding **48**.
- Collapsed height = `124 + cardBandHeight + 48` (e.g. poster 524, streams 572, genre 499, sports 381).
- Focused (expanded) height = `124 + (bandHeight - cardHeight) + focusedCardHeight + extra + 48`.
These numbers came straight from the Figma "full-length" frames; keep using the designer's collapsed heights.

## 3. Vertical layout: anchors
Every section is absolutely positioned with `translate3d(0, y, 0)` and a CSS transition. `layout()`:
1. Pick the focused section `f` and compute its screen top `S_f` (its **anchor**):
   `S_f = cy - 124 - focusedCardHeight / 2` for titled rails (hero = 0, selector row = 86, banner = 204, spotlight = -20).
2. Place later sections by adding heights (focused one uses its expanded height); earlier ones by subtracting collapsed heights.
This reproduces the designer's frames: the focused rail sits at a fixed screen position and the next rail peeks in at the bottom. Derive `cy` for a new type from a focus-state frame: measure the card row's vertical centre in the 1920x1080 frame.

## 4. Horizontal layout: rails
- Each item sits in a **slot** (absolute `left = running sum of widths + 24`). The visible card (**face**) is vertically centred in the slot and may be larger than the slot, overlapping its right neighbour (that overlap is how the Figma frames look).
- The row is translated so the **focused slot's left edge is at x=180**: `translateX = 180 - slotLeft(focus)`. Earlier cards slide off to the left under the sidebar, later cards follow. The focused card never moves; the rail moves through it.
- Face size, left/right growth and ring/glow are CSS transitions on `width/height/box-shadow` (about 0.3-0.4 s, ease `cubic-bezier(.22,.8,.24,1)`).
- Sidebar: translucent dark panel with blur and a right-edge fade so cards sliding under it look "partially hidden" like the design.

## 5. Modes: backdrop-with-details vs plain
- **Mode a** (movie/show rails): the page behind becomes the focused item's backdrop with its title, metadata, tags and description above the rail; they change as focus moves. Backdrop rules:
  - genuinely high-res landscape art (hero backdrops, sports stills) is full-bleed;
  - portrait posters are shown **crisp on the right** with a heavily blurred copy of the same image as a colour wash behind (never stretch a low-res poster);
  - a left-to-right dark gradient keeps text readable.
  Everything above the focused section is hidden (opacity 0) in this mode so only backdrop + details + rail show.
- **Mode b** (streams, genre, continue watching, banners): plain dark page; the previous section peeks dimmed at the top and the next at the bottom.

## 6. Dimming and hiding
Non-focused sections get `opacity .5`; sections above a mode-a focus get `opacity 0`; the hero background is hidden whenever the focus is below the selector row. This is the "partially visible sections get a gradient so emphasis stays on the focus" rule.

## 7. Timers, trailers and video
- **Hero carousel:** rotates every ~7 s while the hero (or selector row) is on screen; paused when a trailer plays or the hero is off-screen. Slides cross-fade the background and the details block.
- **Hero trailer:** after 3 s of focus on the hero, stock footage fades in behind the details; leaving the hero stops it.
- **Backdrop trailer (mode-a rails):** stay on one card for 3 s and a clip fades in over the backdrop, full-screen; moving focus stops it and restarts the 3 s timer. The same card key (`section:index`) never restarts the timer on re-render.
- **Stream cards:** one shared `<video>` is moved into the focused stream card and starts immediately; other stream cards show their poster.
- All video is muted, looping, `playsinline`. Crop clips that have baked-in black bars (see `05-assets-and-media.md`).

## 8. Home special cases
- **Explore by OTTs row:** 108px circles (gap 48) top-aligned; the **selected** one is a 160px red circle with glow and stays that way when focus leaves. Changing selection rebuilds the rail below (different titles per OTT, seeded).
- **OTT rail:** collapsed = maroon rounded panel under the logos (no title). When focus enters it, the panel fades out and it becomes a "Top Picks"-style titled mode-a rail (row drops 76px, title fades in).
- **Hero:** only the two buttons are focusable (the banner is not). Primary focus = white ring + red glow; secondary = ring + stronger glass.
- **Continue Watching (mixed):** portrait and landscape cards; caption and progress text under each card shift down with the focused card.
- **Streams:** "STREAM" pill, "Currently Playing" + title bottom-left, play glyph, equaliser and progress bar when playing.
- **Upcoming:** date tag top-left, OTT badge top-right, Remind Me pill bottom-right; OK toggles to Reminder Set (check mark).
- **Subscription banner:** QR code + OTT circles + fan of posters; OK opens the right drawer.
- **Spotlight (featured collection):** full-bleed banner with logo lockup; cards are 9:16 until focused, then the focused card becomes **16:9** and **stays fixed at x=657** while the others slide left behind it; cards that pass left are partially masked with a soft horizontal gradient mask (transparent below x=500 to opaque at x=655).
- **Premium Live Channels (logos only):** 174px tiles with a 120px plate; focused tile grows and its plate turns white.
- **Genre:** tinted card with a label bar; focused card 326x442.
- **Sports rails:** Live badge only on live items, caption (title + subtitle) under the focused card.

## 9. Adding a new rail type or module
1. Add an entry to `TYPES` (card size, focused size, `cy`, mode, optional `notitle`, `fx`, `ch`, `k`).
2. Add a branch in `cardInner` (the card's inner HTML).
3. If it needs custom focus behaviour, add a small branch in `applyFocus` (see the `spot`, `ottrail` and `otts` branches for examples).
4. Add the section to the data list, then test that Up/Down/Left/Right, the peek of neighbours and the details panel behave as in the designer's frame.
New modules (Details, Search, Player, Library...) reuse the stage, key handling, overlay system, assets pipeline and testing approach; only the sections and their geometry change.

## 10. Mapping Figma frames to engine settings
| In the Figma frame | Engine setting |
|---|---|
| Card size when unfocused/focused | `w,h` / `fw,fh` |
| Y of the card row centre in the focus frame | `cy` |
| Backdrop + title/description appear above the rail | mode `a` |
| Plain dark page, neighbours peek | mode `b` |
| Focused card x position | row anchor (180 by default, or a fixed `focusX`) |
| Pin comments like "cards move left, focus stays" | rail slide behaviour |
| Partial rail at top/bottom with gradient | dimming rules |
