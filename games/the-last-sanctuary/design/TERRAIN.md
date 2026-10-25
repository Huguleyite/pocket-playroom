# Terrain phase · study 06

## Scope and sequence

Sim approved the miniature roster, including distinct Commander 05 and Rider 05 identities, and directed saving it for one unified release. Exact approved asset hashes are in release/approved-miniatures.json. Terrain is the current phase, followed by architecture and then rendering. Terrain assets below are review proposals, not approved release assets yet.

## Review entry points

- terrain.html: meadow, woodland, rocky ground and riverbank assets with close-up inspection.
- index.html?miniature=company&terrain=illustrated: optional playing-size board integration with the approved active miniatures and existing spells.
- index.html?miniature=company: previous geometric terrain for comparison.

## Asset family

| Treatment | File | Surface and purpose |
| --- | --- | --- |
| Meadow | assets/terrain-meadow-06.png | Grass, soil, moss, wildflowers and a clear standable center |
| Woodland | assets/terrain-woodland-06.png | Branching oak, birch, pine, leaf litter, roots and ferns |
| Rocky ground | assets/terrain-rocky-06.png | Layered slate outcrop, lichen and a clear foreground |
| Riverbanks | assets/terrain-river-06.png | Shallow water, submerged gravel, wet stones, reeds and natural banks |

Each asset is an individually generated original transparent PNG, made using imagegen. Prompts specified hand-painted miniature terrain quality, natural subdued colors, dark low soil/rock edges, a pointy hex footprint, a fixed elevated front view and warm upper-left light. Architecture, figures and text were excluded. The files are fixed-view illustrations; they do not establish new terrain geometry or PBR material maps.

## Board integration

terrain-assets.js owns the catalog, per-treatment texture cache and illustrated tile placement. Texture sprites replace the terrain appearance only in the optional terrain URL. The underlying 35-hex grid, walkability, unit positions, mana, preview/confirmation and spell behavior remain authoritative. Height/width fitting seats the artwork into the existing grid; fine tile-seam and lighting unification is still work for the final rendering phase. The demo camera is fixed to match the painted view. Source artwork in the gallery remains undistorted.

Selection rings and thin hex boundaries remain visible above the illustrated surfaces. The existing bridge, shrine, cottage and ruined walls are retained geometric architecture, explicitly awaiting the next phase. The approved miniature files are unchanged. River ripples in the illustrated asset are painted; final water animation/compositing is deferred with rendering. The geometric board's animated water still exists in the comparison view.

## Verification

Seventeen terrain checks pass: all four image loads and inspections, four gallery viewport sizes, desktop/mobile board fit, portal preview/cost/movement, barrier placement, ward application, animated portal resolution and SHA-256 checks of all five approved miniature files. Existing base and collection checks are also run after integration. Local HTTP hosting is required for board texture images, as in the miniature test. No publication occurred.

## Connected water update · study 07

The concern about angled river tiles is resolved by generating a shared water mesh and shores from adjacency. water-study.html provides editable rivers, bends, junctions, lakes and islands. The company board uses the same system. The original riverbank illustration remains a visual reference only. See WATER-CONNECTIONS.md for implementation, test results and remaining edge-dressing/rendering limits. This remains terrain work, awaiting review; no architecture work or publication.
