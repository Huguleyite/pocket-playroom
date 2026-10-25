# Study 13 · drag, conjured architecture and compact board

Resumed by Sim October24,2026. Local review only. No publishing or push authorized.

Preview: index.html?miniature=company&terrain=illustrated&architecture=illustrated&render=final&board=compact&revision=13

## Controls

Touch and mouse can drag a miniature or its nameplate. A temporary illustrated ghost follows the pointer; the real miniature remains in place. Release on valid open ground to preview the matching move. Nearby moves are free; Seren’s distant drops select Fold the Path. Confirm completes the move and spends mana if applicable. Tap/click and keyboard controls remain. Invalid water/occupied/blocked/out-of-range drops make no change. Escape, pointer cancellation and busy state cancel dragging. Board touch gestures are reserved for pieces; scroll using the surrounding page.

## Card-created pieces

Living Rampart now uses a detailed transparent illustrated wall with weathered limestone, bronze inlays, teal banners and a restrained ground rune. Preview is translucent, confirmed wall blocks its hex, reset clears it. Select Living Rampart and use Inspect Living Rampart for a close-up. Texture/memory cleanup retains the shared image. The other two cards create portal and ward effects; their approved appearance and controls are retained. No additional physical card devices exist in the current three-card study.

Built-in image generation and one cleanup edit produced assets/rampart-13.png. Prompt set: RAMPART-PROMPT.txt. Reference architecture used for materials/style only. Other approved PNGs are unchanged. This remains the approved fixed-view illustration approach, not a rotatable sculpt.

## Smaller board

Optional compact layout has25hexes instead of35 and a12x9.9 frame instead of15.6x9.9:23% less physical frame area. Same starts, landmarks, art, bridge/water,3mana and card mechanics.18walkable hexes connect through the bridge, with13potential distant portal targets from the start. The compact/full link switches layouts and starts a fresh study; it does not transfer the current turn. Mobile framing includes the whole board. This is a smaller interactive tactical study; no combat/AI/campaign was added.

## Verification

11controller browser checks and28integrated board checks passed: actual CDP touch and mouse across both layouts, invalid-drop rollback, confirmation, mana, mage portal selection and post-drag ward taps.14compact configuration checks and10compact browser checks passed, including1366/390/320views, all3spells and return-to-full link. Detailed rampart preview/cast/block/reset/inspection checked through actual localHTTP. Original19base and25rendering checks passed during integration;18company checks also passed. Screenshots inspected for desktop/mobile board fit and rampart appearance. No page errors in final live compact/rampart check. Revised runtime hashes staged in release/rendering-corrections.json, preserving historical approvals.

Awaiting Sim’s visual review before any release.
