# Unified rendering · study 09

Authorized October 24, 2026, following approval of architecture. Local review only. Nothing published or pushed.

Open index.html?miniature=company&terrain=illustrated&architecture=illustrated&render=final.

The closer composition, higher pixel-density cap, wood-grain frame finish and quieter tile guides bring the approved pieces together. Contact shadows and flattened texture silhouettes ground figures and structures. These are approximations for a fixed-view illustrated board, not physically correct shadows from 3D sculpted models.

Daylight applies restrained warm upper lighting and darker lower surfaces. Dusk cools/darkens illustrated surfaces and dims physical scene lights. A restrained turquoise shrine glow, warm cottage light and twelve small relic motes support the atmosphere. Water highlights use continuous world coordinates, preserving the approved shared water topology and generated shores. Original source PNGs and approved terrain sources remain byte-identical.

The Before button bypasses surface grading, water shimmer, added shadows and glows, restores frame material and guide strength, and preserves the same closer camera for comparison. The architecture page still links the unified view; removing render=final gives the original architecture study composition.

Reduced-motion freezes water shimmer and motes. Existing portal, rampart, ward, reset, card-first and board-first selection paths remain in place. No combat, AI or campaign is added. No new external dependencies or generated images are required.

Review status: awaiting Sim's visual approval before any unified release. Future improvements requiring different asset technology (rotatable sculpts, true relighting or free camera) are outside this pass.

Verification: 24 rendering checks and 19 original-study checks passed, including all three spells, responsive layouts, comparison modes producing distinct canvas pixels, reduced-motion canvas stability, and unchanged approved miniature, terrain and architecture hashes. No console errors or added external runtime requests.

## Review corrections · October 24

Sim identified ward coverage, water-to-land gaps and a submerged-looking bridge. Echo Ward now uses the illustrated guardian dimensions and camera-facing enclosure and follows his movement. Solid textured land foundations and soil banks share the actual water lattice; 52 shoreline endpoints match. The approved bridge image is mapped onto a ground quad with near/far depth, preserving its appearance while preventing river clipping. Approved PNGs unchanged. terrain-assets.js is intentionally revised; its previous approved-source manifest remains historical, with corrected runtime hashes staged in release/rendering-corrections.json. Two agents handled shoreline and bridge concurrently at Sim’s request. Rendering regression passed 25 checks; topology 193 and water browser 16 also passed.

### Second correction review · revision 11

Sim still saw disconnected banks, moving-piece ground disappearance and a low bridge. Earlier endpoint-only checks were insufficient. Decorative terrain, architecture and miniature transparency now use explicit painter layers and no depth writes; opaque foundations keep depth. Bridge image plane raised .42 above tile surface; movement and hit positions use the same deck offset. Ward moves with its guardian. Index versions every runtime JS/CSS request with v=11 to prevent stale nested resources. Supplied recording was unavailable at the stated local path; movement was reproduced directly and five animation frames inspected. Mocked and actual HTTP server verification passed movement, ward persistence, bridge entry/exit, equal deck/feet height and script versions. Rendering suite passed25 checks. Fresh closeups show land foundations filling the reported wedges. No PNG artwork edited or publication performed.

### Revision 12 · base anchor and portal layer

Sim identified a miniature floating at the bridge exit and terrain covering portal previews. The illustrated mage/guardian board anchors now align the base footprint (0.10 image height rather than 0.008), avoiding visible lift above the highlighted surface. Portal components use an explicit effect layer6 without depth testing in illustrated terrain, above ground decorations. Checked raised bridge occupancy, far-bank exit, ward persistence, five movement frames and portal beside shrine/ruins at B5 through actual local HTTP. Runtime CSS/JS version12. Rendering regression25 checks passed. Art PNGs unchanged; local-only visual review remains pending.
