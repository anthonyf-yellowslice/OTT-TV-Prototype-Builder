# Interaction model: the keyboard is the remote

## Contents
1. Key mapping
2. Focus zones and movement rules
3. What OK does
4. Long-press OK
5. Back
6. Overlays
7. Mouse and other input
8. Implementation notes (reference implementation)

## 1. Key mapping
| Keyboard | Remote | Notes |
|---|---|---|
| Arrow Up / Down / Left / Right | D-Pad | Holding repeats; repeats are throttled (about 95 ms horizontal, 230 ms vertical) so animations keep up |
| Enter / Return | OK | Short press = select; hold about 0.6 s = long-press |
| Delete **and** Backspace | Back | On a Mac the "Delete" key sends `Backspace`; handle both and `preventDefault` so the browser never navigates back |
| Esc | none | Deliberately ignored (the designer decided Esc is not Back) |

Only these keys do anything. Space, Tab, Page Up/Down, Home, End are swallowed so the page never scrolls.

## 2. Focus zones and movement rules
Three zones: **page** (sections), **nav** (sidebar), **overlay** (drawer, menu, placeholder).
- **One focused element at a time.** The user focuses with the D-Pad and only then presses OK. Nothing activates on focus except designer-specified behaviours (a stream card starts playing, a dwell timer, a rail swapping its backdrop).
- **Left/Right** moves within a section. Left on the first item moves focus to the sidebar (home item). Right on the last item does nothing (end of rail). Right in the sidebar returns to the page.
- **Up/Down** moves between sections. A section remembers its last focused index; first visit lands on index 0. The hero always re-enters on its first button.
- The page layout follows focus: the focused section is placed where the design puts it, neighbours move with it (see `04-layout-and-focus-engine.md`).
- Selecting one element can change another element's content (moving across the OTT row swaps the rail below). Keep the "selected" look on the previous element when focus leaves it (a selected OTT stays large and red).

## 3. What OK does
Default table used in the Home prototype (change per the designer's notes):
| Element | OK does |
|---|---|
| Hero primary button | Placeholder screen ("Playback") |
| Hero secondary button | Placeholder screen ("Details") |
| Selector row item (OTT) | Move focus down into the rail it controls |
| Card, unlocked | Placeholder screen ("Playback: <title>") |
| Card, locked | Open the subscription drawer |
| Subscription banner | Open the subscription drawer |
| Upcoming card | Toggle Remind Me / Reminder Set (card is the focus target, the pill is not separately focusable) |
| Genre card, live channel tile | Placeholder screen |
| Sidebar home | Focus the hero; other sidebar items open a placeholder |

The **placeholder screen** says "Not part of this demo", names the destination, and closes with Back.

## 4. Long-press OK
Hold Enter about 0.6 s on a card to open the side menu (More Details, Don't Like, Like, Love, Add to watchlist). Rules:
- It only exists on card types that have it; elsewhere a long press is treated as a normal select on key release.
- When the menu opens while Enter is still down, the later key-up must **not** select the first menu item.
- Menu actions show a short toast; "More Details" opens a placeholder.

## 5. Back
- Overlay open: close it.
- Otherwise on the page: move focus to the sidebar. In the sidebar: nothing.
- Back never leaves the prototype and never navigates the browser.

## 6. Overlays
- Side drawers slide in from the **right** (710 px wide in the Home design), the page dims behind a scrim and the focused card keeps its size but loses its focus ring.
- Drawer content is focusable only where the design needs it (plan cards, menu items); Up/Down moves, OK acts, Back closes.
- While an overlay is open, auto-playing media (trailers, stream previews) stops.

## 7. Mouse and other input
Ignore the mouse completely so testers cannot "cheat" the D-Pad model: `pointer-events: none` on everything, `cursor: none`, and cancel wheel, mousedown, click, double-click and context-menu events. Touch is out of scope.

## 8. Implementation notes (reference implementation)
- One capture-phase `keydown`/`keyup` listener on `window`.
- Enter state machine: `enterTimer` (600 ms) + `pendingSelect` + `heldDone`. Key-up selects if the timer is still pending, or if a hold started on an element that does not support it; otherwise it only clears `heldDone`.
- Clear timers on window `blur`.
- State object `S`: `zone`, `sec`, `idx{sectionId}`, `nav`, `overlay`, `ov`, plus feature flags (carousel slide, trailer, selected OTT).
- `window.__tv` exposes `S`, `SECS` and `setFocus(sec, idx)` for testing from the console.
