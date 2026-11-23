# Build, test and deliver

## Contents
1. Reading the Figma file (MCP)
2. Reporting understanding before building
3. Building
4. Testing in a browser
5. Handling new designer comments
6. Delivering
7. Remembering context

## 1. Reading the Figma file (MCP)
Order that worked:
1. `create_session(fileKey, description)` once per task, then pass the returned `sessionId` to every file tool.
2. `get_metadata` with **no node id** lists pages. With a page/section id it returns an XML tree; whole pages can exceed the output limit (600k+ characters). The tool saves the result to a file: load it with Python (`json.load` then `xml.etree`), print only the frames you need (names, ids, x/y/width/height; text nodes carry their text in `name`). Developer notes ("Note for Developer: ...") live in small frames; extract text nodes from them.
3. `get_comments(fileKey)` returns every comment with `parentId`, `position.nodeId` and `createdAt`. Replies (`parentId` set) are clarifications; read them with their root. Use `threadId` to read one thread and `nodeId` to read the comments pinned on a frame. Comments from a new round have recent `createdAt` values.
4. `get_screenshot(nodeId, maxDimension)` returns a short-lived URL; download it with `curl` and view the PNG. For very tall frames, request a large `maxDimension` and slice with `sips -c <h> <w> --cropOffset <y> 0` (use y>=1).
5. `download_assets` for images (see `05-assets-and-media.md`).
6. `get_variable_defs(nodeId)` for fonts, colours and spacing tokens. `get_design_context` returns React/Tailwind code and requires loading the Figma design-to-code guidance first; use it sparingly on small nodes when you need an exact style (e.g. a button) and never paste its output as the implementation, it is non-interactive absolute positioning.
7. Frame names can mislead (frames named "Not Logged In" may show logged-in states). Trust the comments and the screenshots.

## 2. Reporting understanding before building
When the user says "go through it, tell me what you understood, don't build yet":
- Do not write code. Describe: file structure (pages, sections, frames), the **demo base variation**, the section order, the focus rules per section type, behaviours and timers, scope limits, and which instructions you could not find.
- List doubts as numbered questions, each with the default you will use if unanswered. Keep the list short (the ones that change the build), and put minor assumptions in a separate list.
- Save the agreed decisions to memory/notes, then wait for "start building".

## 3. Building
- Start from `reference-implementation/home/` (copy the four files), then replace `data.js` content and adjust `TYPES` and `cardInner` for the new module.
- Order: assets pack, static layout of the first frame, focus engine (arrows, Enter, Back), each focus state from the designer's frames, overlays and placeholders, timers and video, then polish.
- Pull exact sizes and Y positions from the Figma metadata rather than eyeballing screenshots.
- Keep behaviour in the data/type tables, not scattered through code, so new designer comments can be applied by changing a number or one branch.

## 4. Testing in a browser
Serve the folder over HTTP and open it in the in-app browser pane (or any browser):
```bash
cd <prototype-folder> && python3 -m http.server 8124 --bind 127.0.0.1   # run in the background
```
- `preview_start` with a `launch.json` fails for folders under macOS Desktop/Documents (Python cannot read the working directory), so use a background Bash server instead and `navigate` to `http://127.0.0.1:8124/index.html`.
- Drive it like a user: use the `computer` tool's `key` action (`Down`, `Right`, `Return`, `BackSpace`, `Escape`). A real long press cannot be sent, so dispatch it in JS:
  `window.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter'})); setTimeout(()=>window.dispatchEvent(new KeyboardEvent('keyup',{key:'Enter'})),900)`.
- Jump straight to a deep state with the debug handle: `window.__tv.setFocus(sectionIndex, itemIndex)`; read state with `window.__tv.S`.
- **Wait before screenshots.** The pane throttles animations and shows stale mid-transition frames right after navigation or a state change; wait 1.5-3 s (more for dwell timers: 3 s + video load).
- The pane is small, so the 1920 stage is scaled down; that is fine for layout but resize the viewport (or open a real browser) for sharpness checks.
- Verify, do not assume: read console errors, `fetch(url, {method:'HEAD'})` every background image and `<img>` to confirm 200s, check that videos are `playing` (`paused === false`, `currentTime` moving), compare each focus state against the designer's frame screenshot, press Back/Esc and confirm Esc does nothing, press arrows past the ends of rails and the page.
- State clearly what you could not test (full-screen on a real TV-sized display, other browsers, `file://` double-click).

## 5. Handling new designer comments
1. `get_comments` with the thread id (or node id) from the link they send, plus `get_screenshot` of the referenced frame, and any reference frame mentioned in a reply.
2. Restate the instruction in one line, find the single place in the engine that controls it, change it, re-test the affected states and neighbouring states (a fix to one rail type can shift others).
3. Bump the `?v=N` query on the CSS/JS links so the browser reloads.
4. Reply in plain language: what changed, how to see it, what was and was not verified.

## 6. Delivering
- Folder with `index.html`, `styles.css`, `data.js`, `app.js`, `assets/`, `README.md` (controls, what is built, mock-content note, video credits, known limits).
- Tell the user how to open it (double-click `index.html`, or serve with `python3 -m http.server 8000` if fonts or video misbehave) and mention full-screen (F11) gives the best feel.
- Stop any server you started when the user is done; leave it running only while they preview.
- Do not publish or push anything without being asked.

## 7. Remembering context
After each round, save to memory: the Figma file key and key frame ids, designer decisions (what they chose where the design was ambiguous), the file layout, how to test, and known gaps. This is what lets the next session continue without re-asking.
