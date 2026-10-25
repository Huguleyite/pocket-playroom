# Connected water · terrain study 07

## User direction

Sim identified that the straight painted river tile would not connect at arbitrary angles and authorized solving this during the current terrain phase. Water must form continuous areas with land-facing shorelines, rather than repeated pictures containing their own banks. Miniatures remain approved and held for a unified release. Architecture and rendering remain later phases.

## Review

Open water-study.html over the local HTTP server. Six presets demonstrate a straight river, 60-degree bend, 120-degree bend, three-way junction, lake and island. Click any hex to add or remove water. Reset restores the selected preset. Hex guides are optional and do not create shorelines. The company board’s illustrated-terrain URL also uses connected water.

## Implementation

- water-topology.js: axial/offset conversion, exact shared corner coordinates, six-neighbor adjacency, connected components, shared water edges, land-facing shore edges and open map edges. Each corner uses an integer lattice key to avoid independent floating-point edge calculations.
- connected-water.js: indexed triangle mesh for all water faces at one level, sharing vertices and one material. UVs come from world coordinates across the full board. The surface does not reset, rotate or repeat per hex. The original straight river tile is no longer used as water geometry.
- Shores are narrow gravel strips generated only along water-to-land edges. Corner insets are calculated from incident edge normals so adjacent shore strips meet. Edges against another water hex have no shore geometry. Open map-edge water remains open, allowing river entrances/exits.
- The bridge counts as water beneath its existing architecture, keeping the river connected under the crossing. It remains walkable under the original game rules.
- Water and bank textures: original imagegen assets assets/water-surface-07.png and assets/shore-material-07.png. They have no baked land/water layout. The earlier terrain-river-06.png remains an art reference in the gallery, not a repeated board segment.
- Existing illustrated meadow/woodland/rock art remains in place. Terrain texture caching handles scenario rebuilds. Old scene geometry/materials are released, while shared textures remain cached. Mouse picking updates scene transforms before raycasting, including immediately after a rebuild.

## Scope limits

This resolves water connectivity and shoreline placement. Banks still follow hex boundaries; finer organic edge dressing, depth transitions, flow direction and animated surface compositing are future refinement, not a completed final rendering pass. Water is at one level: waterfalls, elevation changes and a hydrological simulation are not implemented. The demonstration does not add combat or change movement/spell rules. The miniature assets are unchanged, and no architecture work or publication occurred.

## Verification

- 193 topology assertions: coordinate round trips, exact shared corners in all six directions, all 64 neighbor masks, edge accounting, no banks against water, islands and separate water bodies.
- 16 browser checks: all six presets, editable island creation/removal, whole-hex mouse picking, reset and guides, four viewport sizes, connected-water game integration and portal movement. Screenshots cover presets and screen sizes.
- The 17 terrain and 19 base checks also pass, including approved miniature hashes and existing spells.

Results: previews/water-verification.json and retained preset screenshots. Nothing is published; terrain remains in review.
