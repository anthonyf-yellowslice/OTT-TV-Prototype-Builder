---
name: playboxtv-tv-prototype
description: Build clickable web prototypes of PlayboxTV's TV app (Android TV / Fire TV / Samsung / LG style, 1920x1080) where the keyboard simulates a TV remote D-Pad (arrow keys, Enter, Delete), from a designer's Figma screens and focus states. For prototyping only, not for visual design. Use whenever the user asks to build, extend, fix or review a PlayboxTV TV prototype, demo or module (Home, Details, Search, Player, Live TV, Library, Profile, Onboarding...), mentions TV focus states, D-Pad, remote navigation, Playbox TV Figma frames, or wants a TV demo they can test in a browser, even if they never say "skill". Also use when applying designer comments about focus states, trailers or rail behaviour to an existing PlayboxTV TV prototype.
---

# PlayboxTV TV prototype

Build web prototypes of PlayboxTV's TV experience so the team can test D-Pad navigation in a browser. Figma cannot prototype TV, because TV is focus-driven (no cursor, no hover, no scroll), so the prototype simulates a remote with the keyboard and renders the designer's screens faithfully.

**This skill is for prototyping, not design.** The designer owns every visual decision. Your job is to turn their screens and focus states into something that behaves like the real TV app. When the design is silent, extend the nearest existing pattern, keep it quiet, and tell the user what you assumed.

## About PlayboxTV (short version)
An Indian OTT aggregator: JioHotstar, SonyLIV, ZEE5, Sun NXT, Chaupal, ShortsTV and more in one subscription and one app (mobile, web, tablet, TV), plus live TV channels. Plans start at ₹99/month; content outside the user's plan shows a lock. Content types: movies, shows, sports (live and recorded), live TV, and **Streams** (looped content that plays like a live channel). Full detail in `references/01-playboxtv-context.md`.

## How the user works with you (expect this every time)
1. They send a Figma link containing **screen variations** (e.g. logged out / logged in unsubscribed / subscribed) and **focus-state frames** (how each section type looks when it is the active one), plus **comments and notes in Figma** that are instructions to you.
2. They say something like "go through it, tell me what you understood, don't build yet". Do exactly that: read everything, report your understanding, list real doubts, and **wait for "start building"**.
3. After the first build they send follow-up Figma comments or screenshots. Fix those precisely, test, and report briefly.

If the user gives you only a prompt with no Figma frames, ask for the intake items in `references/02-designer-intake.md` before building. Missing focus states are the most common gap.

## Rules that never change
- **Input = keyboard remote.** Arrow keys = D-Pad, Enter/Return = OK, **Delete and Backspace = Back**, **Esc does nothing**, **long-press Enter (~0.6 s) = long-press menu**. The **mouse is ignored completely** (no hover, no click, no cursor). Details: `references/03-interaction-model.md`.
- **Focus-driven UI.** Exactly one element is focused. No scrolling: the focused card stays at a fixed place and rails slide through it; rows move vertically so the focused section sits where the design puts it. Transitions between focus states must be smooth.
- **Fixed 1920x1080 stage**, scaled to fit the browser window (letterboxed). Design pixels = CSS pixels.
- **The Figma file is the source of truth.** Read every comment (including replies, they clarify and sometimes correct the root comment), every developer note, every variation. A "use this variation" comment overrides the other variants. Where two instructions conflict (e.g. "from the left" vs the drawing showing the right), follow the drawing only if the designer confirms; otherwise ask.
- **Use the designer's real assets** (posters, backdrops, logos, fonts, colours) pulled from the Figma file. Never upscale small images; blurry art ruins TV testing. See `references/05-assets-and-media.md`.
- **Video = stock footage** (muted, looping, true 16:9) wherever the design says a trailer or stream plays. Check clips for baked-in black bars and crop them.
- **Demo scope = what the designer says.** Anything that leads to an unbuilt screen (playback, details, search...) opens a simple "Not part of this demo" screen that Back closes, unless told otherwise.
- **Mock content is mock.** Invent titles, descriptions and dates only where Figma has none. Use a seeded random generator for lock states so the demo is the same on every load.
- **Never build before the user says so** after a "tell me what you understood" request, and never present something as verified that you did not actually test.

## Workflow
1. **Read the Figma file** (see `references/06-build-test-deliver.md` for the MCP tricks): list pages and top-level frames, read all comments, download screenshots of every variation and focus-state frame, extract developer notes and design tokens (fonts, colours).
2. **Report understanding**: file structure, which variation is the demo base, page/rail order, focus rules per section type, behaviours and timings, scope limits. Then list doubts with a default for each. Wait for the go-ahead. (Intake checklist: `references/02-designer-intake.md`.)
3. **Map the design to the engine**: each section becomes a rail *type* with geometry (card size, focused size, where the focused row sits) and a *mode* (backdrop with title/details above, or plain). See `references/04-layout-and-focus-engine.md`.
4. **Build the asset pack** (images, logos, fonts, stock video) following `references/05-assets-and-media.md`.
5. **Build the screen(s)**. Start from `reference-implementation/home/` (a complete Home prototype: engine + styles + data) and adapt rather than rewriting; the engine is generic, the data and a few special cases are Home-specific.
6. **Test in a browser with the keyboard**, compare against the Figma screenshots, check the console and every asset URL. Never report "done" without having walked the focus paths the designer described.
7. **Deliver**: a folder the user can open by double-click or serve locally, a short README (controls, what is built, credits for stock media), and an honest list of what is simulated or untested.
8. **Iterate on comments**: fetch each new comment thread and its frame, fix only what it says, re-test the affected states, report in plain language.

## Reference files (read when needed)
| File | Read it when |
|---|---|
| `references/01-playboxtv-context.md` | You need product facts, plans, content types, TV conventions, the Home rail list |
| `references/02-designer-intake.md` | Starting a new module, or the designer's handoff is incomplete. Includes a brief template to send them |
| `references/03-interaction-model.md` | Implementing or changing keys, focus zones, long-press, Back, overlays |
| `references/04-layout-and-focus-engine.md` | Adding a rail/card type, changing a focus layout, debugging positions |
| `references/05-assets-and-media.md` | Exporting images from Figma, choosing stock video, mock content rules |
| `references/06-build-test-deliver.md` | Setting up, testing, serving, delivering, handling Figma comments |
| `references/07-lessons-learned.md` | Always skim before building; it lists every trap hit so far |

`reference-implementation/home/` is the working Home prototype (code only; its `assets/` folder is not in the repo because of size, see its README).

## Communicating
The user is a product/design lead, not a developer. Write plainly, lead with what changed, say what you verified and what you did not, and keep summaries short. Quote a Figma comment only when it matters.
