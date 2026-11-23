# playboxtv-tv-prototype

A Claude skill for building **PlayboxTV TV prototypes** that run in a web browser, from a designer's Figma screens and focus states.

Figma cannot prototype TV (TV is D-Pad driven: no cursor, hover or scrolling), so this skill builds a faithful HTML prototype where the **keyboard acts as the TV remote**:

| Key | Remote |
|---|---|
| Arrow keys | D-Pad |
| Enter | OK (hold = long-press) |
| Delete / Backspace | Back |

The mouse is ignored on purpose. The skill is for **prototyping, not visual design**: the designer's Figma file is the source of truth.

## What is in this repo
```
SKILL.md                         the skill (rules, workflow, when to trigger)
references/
  01-playboxtv-context.md        product, plans, content types, TV conventions
  02-designer-intake.md          what to expect and ask from a designer + brief template
  03-interaction-model.md        keys, focus zones, long-press, Back, overlays
  04-layout-and-focus-engine.md  how focus states become layout (geometry table, modes)
  05-assets-and-media.md         imagery, logos, fonts, stock video, mock content
  06-build-test-deliver.md       Figma MCP workflow, testing, delivery, handling comments
  07-lessons-learned.md          traps hit so far
reference-implementation/home/   a complete Home prototype (code only)
```

## Install
**Claude Code** (personal or project skill):
```bash
git clone <this-repo-url> ~/.claude/skills/playboxtv-tv-prototype
# or, per project: <project>/.claude/skills/playboxtv-tv-prototype
```
**Claude.ai / Cowork:** zip the folder (so `SKILL.md` is at the top level of the zip) and upload it under Settings, Capabilities, Skills.

## How to use it
Give Claude a Figma link that contains the screen variations and focus states, and ask in plain words, for example:
- "Use the PlayboxTV TV prototype skill. Here is the Figma for the Details page. Go through it and tell me what you understood, don't build yet."
- "Start building." (after you have answered its questions)
- "Fix these two Figma comments in the prototype: <links>."

A good handoff (see `references/02-designer-intake.md`, which also has a brief template) contains:
1. **Screen variations** for each user state (not logged in / logged in unsubscribed / subscribed ...) and which one is the demo base.
2. **Focus-state frames** for each type of section (default focus, moving along a rail, end of rail, press and hold, open drawers, toggled states).
3. **Rules and comments** in Figma: where the focused element sits, what moves, timers, what OK does, where Back goes.
4. Real images and logos in the Figma file (stock video is used for trailers).

## What the skill produces
A folder with `index.html`, `styles.css`, `data.js`, `app.js`, an `assets/` folder (images, logos, fonts, stock video) and a short README. Open `index.html` in a browser (or serve the folder with `python3 -m http.server`) and press F11 for full screen.

## The reference implementation
`reference-implementation/home/` is the Home prototype this skill was written from (engine, styles and mock data). It is code only: the `assets/` folder (about 36 MB of images, fonts and video) is not committed. To run it, create `assets/` as described in `references/05-assets-and-media.md`, or use it as a starting point for a new module and replace the data and special cases.

## Maintaining the skill
After each module, add new traps to `references/07-lessons-learned.md`, new geometry to the table in `references/04-layout-and-focus-engine.md`, and any new designer conventions to `references/01-playboxtv-context.md`.

## Credits
Stock footage used in the Home prototype: *Sintel* and *Big Buck Bunny* (c) Blender Foundation, CC BY 3.0; a jellyfish clip from test-videos.co.uk. Fonts: Zalando Sans (Google Fonts, SIL OFL).
