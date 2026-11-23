# Designer intake: what to expect and what to ask for

A TV prototype can only be as good as the focus states it is built from. This file lists what a complete handoff contains, what to check, and what to ask when something is missing. A copy-paste brief for the designer is at the end.

## Contents
1. What a complete handoff looks like
2. Checklist: screens and variations
3. Checklist: focus states
4. Checklist: behaviours and timings
5. Checklist: content rules
6. Checklist: scope, assets, output
7. Common ambiguities and good default answers
8. Designer brief template

## 1. What a complete handoff looks like
- One Figma file with **full-length screens for every user-state variation** (not logged in / logged in unsubscribed / subscribed, or whatever the module needs) at 1920 wide.
- A **Focus States** area with one 1920x1080 frame per *type* of section when it is the active section (not necessarily every section), including the in-between states (moving along a rail, end of rail, press and hold, an open drawer).
- A short **rules** area (e.g. "focus card always stays on the left and the rail moves through it", "next rail peeks in at the bottom under a gradient").
- **Comments and developer notes** in Figma explaining behaviour. They are instructions to you: read all of them, including replies.
- Real imagery inside the file (posters, backdrops, logos) so assets can be exported.

## 2. Checklist: screens and variations
- [ ] Which user-state variations exist, and **which one is the demo base** (the designer usually says "currently for the demo build this one").
- [ ] Section order for that variation, and which sections only appear in some states.
- [ ] Alternate versions of one section ("use this variation of Continue Watching / Live Channels"): which wins.
- [ ] Sidebar items and which are functional in the demo.
- [ ] Any section whose design exists only as a wireframe (no UI yet): confirm you may compose it from existing patterns.

## 3. Checklist: focus states
For every section type ask: default focus (first element), what the focused element looks like (size, ring, glow), what happens to neighbours, and:
- [ ] **Hero / CTAs:** which buttons are focusable, primary and secondary focus looks, whether the banner itself is focusable.
- [ ] **Rail focus:** where the focused card sits, how much the next card is covered, whether the page behind changes (backdrop, title, metadata).
- [ ] **Moving along a rail:** does the focused card stay put while the rail slides (usual), what happens to cards that leave on the left (hidden under the sidebar, or masked), what happens at the **end of the rail**.
- [ ] **Moving between rails:** how far the page moves, whether a sliver of the next/previous rail stays visible, gradient/dimming style.
- [ ] **Shape-changing cards** (e.g. portrait to landscape on focus): sizes and the transition.
- [ ] **Press and hold** states and the menu's side and contents.
- [ ] **Selected vs focused** (e.g. a selected OTT stays highlighted when focus moves away).
- [ ] **Toggle states** (Remind Me to Reminder Set, Like, Add to watchlist) and what a second OK does.
- [ ] **Overlays/drawers:** side, width, content, which items are focusable, how they close.
- [ ] Sidebar focus look and how focus enters/leaves it.

## 4. Checklist: behaviours and timings
- [ ] Dwell timers ("stay 3 seconds then the trailer plays", carousel rotation interval, when rotation pauses).
- [ ] What OK does on **every** element type (card, locked card, CTA, banner, genre card, channel tile).
- [ ] Where Back goes from each place.
- [ ] Long-press duration if different from 0.6 s.
- [ ] Transition feel ("make transitions smooth"), any specific durations or easing.
- [ ] Which videos play where (hero, backdrops, stream cards) and whether audio is needed (prototype default: muted).

## 5. Checklist: content rules
- [ ] Lock logic (random mix? whole rails locked? depends on a plan?) and where locked items lead.
- [ ] Live badge logic, tags ("New Movie", "Recently Added"), date labels.
- [ ] How the rail under a selector (e.g. Explore by OTTs) changes per selection.
- [ ] Mock-content depth: how many rails and cards the demo needs.
- [ ] Is there real text the designer wants kept (titles, descriptions) or is invented text fine?

## 6. Checklist: scope, assets, output
- [ ] Screens/flows in scope for this build, and what should show "Not part of this demo".
- [ ] Brand assets: logos, fonts (names), colours; access to the Figma file for exports.
- [ ] Stock video acceptable instead of real trailers (default yes).
- [ ] Output format (default: a folder with `index.html` + assets, opened by double-click or a local server) and any sharing need (hosted link?).
- [ ] Target resolution (default 1920x1080) and key mapping (default as in SKILL.md).

## 7. Common ambiguities and good default answers
| Ambiguity | Default (state it, let the user override) |
|---|---|
| Vertical move lands on which card? | The remembered card of that rail, else the first |
| Back from a rail | Move focus to the sidebar; from the sidebar do nothing |
| OK on a locked title | Open the subscription drawer |
| OK on unbuilt destinations | "Not part of this demo" screen, Back closes |
| Carousel | Auto-rotates about every 7 s; pauses when focus leaves or a trailer plays |
| Hold-OK menu side | The side the drawing shows; confirm if a comment contradicts it |
| Frames that show every card locked | Treat as placeholder; mix locks unless told otherwise |
| Section with no focus-state frame | Extend the nearest type of rail and say so |
| Wireframe-only section | Build from existing UI patterns; keep it plain |

## 8. Designer brief template
Copy this to the designer when starting a new module.

```
Module: <e.g. Details page>
Figma link: <file link>

1. Screen variations (full length, 1920 wide)
   - <State A: e.g. Not logged in>  | demo base? y/n
   - <State B>                       | demo base? y/n
2. Focus states (1920x1080), one per section type, including:
   - default focus of each section type
   - moving along a rail / end of rail
   - moving between sections (what peeks, what dims)
   - press and hold, open drawers/menus, toggled states
3. Rules (write them on the canvas or as comments)
   - where the focused element sits and what moves
4. Behaviours
   - timers (dwell, rotation), what OK does per element, where Back goes
5. Content rules
   - locks, live badges, tags, dates, per-selection rails
6. Scope
   - what is in this demo, what should say "Not part of this demo"
7. Assets
   - real images/logos are in the Figma file; stock video is fine for trailers
```
