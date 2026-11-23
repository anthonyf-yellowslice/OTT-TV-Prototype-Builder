# Lessons learned (read before building)

Every item here cost time on the Home prototype. Add new ones as modules are built.

## Contents
1. Working with the designer
2. Figma and MCP
3. Images and video
4. Layout and engine
5. Testing and tooling

## 1. Working with the designer
- **Wait for the go-ahead.** After "tell me what you understood", report and stop. The user answers doubts in a numbered list; apply those answers exactly.
- **Read replies.** A reply on a comment often says which of two variants to use, supplies a link to the correct frame, or corrects a typo ("opens from the left" was a typo; the drawing showed the right).
- **Overrides:** "use this variation" beats the other versions; "for now use stock videos instead of trailers" is a scope decision, not a suggestion.
- **Static frames are placeholders.** A frame showing every card locked, or the same description under every title, does not define the rule.
- **Focus-state frames cover types, not every section.** Extend the closest type and say so.
- **Ask only what changes the build.** Everything else gets a stated default; the user prefers a short list.
- **Say what you did not test.** The user reviews on their own screen and will notice anything you glossed over.

## 2. Figma and MCP
- Whole-page `get_metadata` can be 600k+ characters; it is saved to a file. Parse with Python instead of reading it.
- `download_assets` returns at most 20 raw images per node. Call it on rail-sized frames.
- Temporary asset URLs expire quickly; download immediately in one script.
- Frame names can be wrong ("Not Logged In" frames showing logged-in states). Verify against screenshots and comments.
- `get_comments` without a filter returns every thread; filter by `threadId` or `nodeId`, and use `createdAt` to find the newest round.
- `preview_start` / launch.json servers fail for folders under macOS Desktop; run `python3 -m http.server` from Bash in the background.

## 3. Images and video
- **Blurry images came from three things:** upscaling small sources to a fixed size, a deliberately blurred, stretched poster used as the backdrop, and low-res art blown up to full screen. Fix: largest raw source, never upscale, crisp portrait poster on the right with a blurred colour wash behind, full-bleed only for real landscape art.
- Different raw files can be the same artwork at different resolutions (different hashes); pick the biggest.
- **Baked-in black bars:** the Sintel trailer is 2.35:1 inside 16:9 and showed black bands. Measure or eyeball each clip and crop with a scale (`CLIP_SCALE`).
- Moving a `<video>` element in the DOM pauses it: call `play()` again. Only muted autoplay works.
- Some sample-video URLs (the Google gtv bucket) return 403; use Blender's official files or test-videos.co.uk.
- Pixel-art-like images (QR codes) need `image-rendering: pixelated` to stay sharp when scaled.
- A logo lockup inside a huge transparent canvas must be cropped (`sips -c`), otherwise it renders tiny.

## 4. Layout and engine
- Compute section Y positions from data (heights + anchor), not from DOM measurements; it keeps transitions smooth and predictable.
- In backdrop-with-details mode hide everything above the focused rail, otherwise the hero and selector row show through the details area.
- The hero background layer must fade out when focus is below the selector row, or it overlaps the backdrop.
- A selected-but-unfocused element (selected OTT) needs its own class separate from the focus class.
- Focused cards overlap their right neighbour by design; do not push neighbours apart.
- For a card that changes shape on focus (9:16 to 16:9), grow the face inside a slot and re-flow the slot widths with a CSS `left/width` transition; keep the focused card fixed and slide the row.
- Soft masks for cards leaving the screen: a CSS `mask-image` gradient on a wrapper, sized to include card shadows.
- Throttle held arrow keys or transitions pile up; keep the Enter long-press state machine free of races (the key-up after a long press must not select).
- Esc must not map to Back (designer decision); both Delete and Backspace must.

## 5. Testing and tooling
- zsh does not split unquoted variables in `for x in $var`; run loops with `bash script.sh`.
- `sips -c H W --cropOffset 0 0` centres the crop; use an offset of 1 for the top-left.
- macOS has no ffmpeg or PIL by default; stick to `sips`, Python stdlib, `curl`.
- Browser-pane screenshots right after navigation or a state change can be stale; wait 1.5-3 s (plus 3 s for dwell timers).
- Add a version query (`?v=N`) to CSS/JS links whenever you change them while iterating.
- Check every image URL with `fetch(..., {method:'HEAD'})` and read console errors before saying "done".
- Console errors left over from an earlier server restart can be stale; reload and re-check before worrying.
