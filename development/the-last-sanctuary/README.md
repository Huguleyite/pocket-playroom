# The Last Sanctuary

**Play Battle I:** open `battle.html` on the local preview server. Recover the relic and bring it home across the full 35-hex board. See [mission design](design/BATTLE-I.md). This mission is a local playtest and is not published.

Current review: **terrain.html** (terrain study 06). Approved miniatures are saved for the unified release; see release/PLAN.md. Normal index.html remains the original comparison board. New terrain test: index.html?miniature=company&terrain=illustrated.

Connected-water review: **water-study.html** (study 07). Try straight and bent rivers, a junction, lake and island, or click hexes to build a new water layout. The illustrated game board now uses the same connected-water system.

Working title. Art & Atmosphere study 02, October 23, 2026. This is a small interaction prototype, not a completed battle game.

A tactical fantasy board game with sculpted miniature tokens, command cards, and objectives that reward maneuver as well as combat. Choose an order through a card or through its miniature on the board. Both routes preview the same action before commitment.

## Open the study

Open **index.html** directly in Chrome or Edge, or serve this folder from any static web host. All runtime scripts and artwork are local. There is no backend, installation step, build step, account system or external runtime request. WebGL and JavaScript must be enabled. A local preview may be available at http://127.0.0.1:51974 while its server is running.

## Try both approaches

- **Card first:** choose Fold the Path, select a glowing destination and confirm Open the portal.
- **Board first:** select Seren and choose an empty land hex. Adjacent destinations preview a free move; destinations 2–4 hexes away select Fold the Path automatically.
- **Terrain:** select Living Rampart and an eligible empty land hex. Confirm to raise a barrier. The only bridge cannot be blocked.
- **Protection:** select Echo Ward, choose Aldric, then confirm. His ward follows him when he moves.
- **Miniatures:** use Inspect miniature to view and rotate each geometric sculpture study.
- **Story:** Between battles opens a small branching-choice sample.

Previews spend nothing. The study supplies three mana. Reset study restores the pieces, terrain and mana. No state is written to existing games or browser storage. Temporary effects remain until reset because this study has no turn engine. Keyboard controls use Tab and Enter; Escape cancels the active preview or closes a dialog. Reduced motion resolves orders instantly and disables idle effects.

## Scope and assets

The 35-hex diorama, mage and guardian are actual procedural 3D geometry. These are original geometric sculpture studies, not final high-detail production models. There are three illustrated cards, portal animation, a rising wall and an arcane shield. The main camera has two fixed angles, and the miniature inspector rotates the selected sculpture.

No opponent, attacks, victory rules, campaign progression, saves or online multiplayer are implemented. The story sample does not remove a miniature from this board and is not persisted. Existing Lineage, Hex-Gambit and Pocket Playroom sources are untouched. Nothing has been published.

Card artwork: original imagegen triptych in assets/command-triptych.png. The board, models and procedural effects are authored locally. Renderer: Three.js r160 (0.160.0), vendored with its MIT license in vendor/THREE-LICENSE.txt. Keeping it local makes this study self-contained.

## Verification

Run `node previews/verify.cjs` with the bundled Playwright installation and local Chrome. It checks both selection routes, confirmation/cancellation, resource costs, movement, shield persistence through a portal, blocked terrain, reset, dialogs, keyboard controls, animated and reduced-motion resolution, six viewport sizes from 320 to 1920 pixels, and absence of remote runtime requests. It saves results and screenshots in previews/. This is desktop Chromium testing with mobile-sized viewports, not a physical phone certification.

## Art & Atmosphere · study 02

The second local study refines moss/grass and stone surfaces, adds soil strata, grass tufts, wildflowers, reeds and pebbles, gives forests two tree silhouettes, and adds masonry supports and corner posts to the bridge. A slow river surface respects reduced motion. The board gains a small title plaque and engraved rail details.

The mage has pleated robes, layered mantle, segmented braids, clasp chains, gems and wrist guards. The guardian gains layered armor, shield rivets and engraving, a beveled sword, and finer face detail. Both remain stylized geometric sculpture studies. Generated studio reflection environments improve metal response in the board and inspection views. Card illustrations are retained with refined frames, parchment, cost gems and a restrained foil pass when selected.

Rules, target ranges, resource costs, confirmation flow and the approved portal/ward effects are retained. Art-only work lives in art-direction.js and polish.css, with miniature geometry in miniatures.js. The four original study-01 runtime source files are preserved in archive/study-01; that folder is a source snapshot, not a separately packaged game. Nineteen checks passed across six viewports, including a pixel comparison confirming the landscape is static under reduced motion. The HTTP preview was also checked in local Chrome.

## Miniature quality demonstration · study 03

Sim found study 02 too elementary and authorized a clearly different art-quality demonstration, one part at a time. This study focuses on Seren. Open **miniature-study.html** through the local server or a static host to compare the detailed illustrated miniature with the original geometric model on the same board. Direct full-board mode: **index.html?miniature=seren**. Normal index.html still uses the original 3D models.

The new asset is a transparent, imagegen-created miniature illustration in assets/seren-miniature-study-03.png. It is drawn as a camera-facing sprite in the existing 3D scene. Its board position, selection, mana costs, confirmation and portal animation use the same game state and handlers. Its illustrated surface lighting and pose do not change with the camera. It is **not a rotatable 3D sculpt**, and the image does not establish that a matching production model exists. The normal 3D guardian and the existing terrain are deliberately retained for comparison. No new board art or other miniature is approved by this demonstration.

Serve this mode over HTTP: browsers restrict local-file images used as WebGL textures. The original geometric study still supports direct file launch. The comparison page shows the artwork close up, offers original/detailed toggles, and has a full-size link. Inspection in illustrated mode opens the illustration instead of implying that it can rotate.

Ten study-03 checks cover image loading, free preview and committed portal movement, inspection labeling, comparison toggles, three viewport sizes and animated portal resolution. The nineteen base-study checks also remain passing. See previews/miniature-verification.json. This is a visual approach for review, not approval to replace all miniatures or publish.

## The Company · miniature phase 04

Sim approved Seren’s detailed miniature style and authorized the full five-role roster. His development order is **miniatures, terrain, architecture, rendering**. This phase creates the remaining Guardian, Commander, Rider and Ranger illustrations with Seren as the image reference. Terrain, architecture and rendering are not advanced in this pass.

Open **company.html** for all five miniatures, selectable close-ups with next/previous navigation, and a board-size silhouette check. The gallery supports ordinary file launch. The board test **index.html?miniature=company** uses the illustrated Seren and Aldric with their existing movement, inspection and spells; serve the board over HTTP. The Commander, Rider and Ranger have artwork and proposed tactical identities, not implemented gameplay classes. Default index.html remains the original geometric study, and the previous Seren comparison still works.

Assets: assets/seren-miniature-study-03.png (approved reference), guardian-miniature-04.png, commander-miniature-04.png, rider-miniature-04.png, ranger-miniature-04.png. All are original imagegen-created transparent PNG illustrations in one visual family, not rotatable 3D meshes. They are cataloged in miniature-asset.js. No alternate enemy army is created in this phase.

`node previews/company-verify.cjs` passes eighteen checks covering all five assets and inspections, keyboard navigation, display sizes, phase order, four viewports and the illustrated guardian’s ward/movement. The ten Seren-study and nineteen base-study checks remain passing. See previews/company-verification.json. The roster is ready for review before the terrain phase; no publishing has occurred.

## Terrain · study 06

After approving the miniatures, Sim authorized terrain next. The terrain review page shows four detailed illustrated hex treatments: meadow, woodland, rocky ground and riverbanks. The optional terrain URL places them onto the existing board with approved miniature art. Architecture remains geometric and is explicitly deferred to the next phase; final rendering follows architecture. The illustrated tile and miniature views use the fixed camera. The default comparison board and its existing camera remain available.

Seventeen terrain checks cover asset loading, inspections, responsive fit, spells and unchanged hashes of all five approved miniature files. Full notes and limitations: design/TERRAIN.md. No new gameplay rules are introduced, and nothing is published.

## Connected water · study 07

The repeated straight riverbank tile has been replaced on the illustrated board. Water now uses one indexed surface with world-coordinate texture mapping. Shared water edges are open; gravel shore strips appear only where water meets land. This supports arbitrary hex arrangements, bends, junctions, lakes and islands without banks across joins. Open water at the map border can continue off the board. Existing bridge architecture sits over connected water.

Run `node previews/water-topology-test.cjs` for 193 topology assertions, and `node previews/water-verify.cjs` for sixteen browser checks including editable layouts. The terrain and original base suites also pass. All five approved miniature hashes remain unchanged. Detailed scope and remaining refinements: design/WATER-CONNECTIONS.md. This is still the terrain phase; architecture and final rendering are deferred.

See [the design brief](design/CONCEPT.md). The concept artwork and proposed full-game rules remain review material. This study deliberately tests a mage moving herself through a portal; the fuller design also proposes moving allies.


## Architecture · study 08

Open architecture.html for four detailed structures and click to inspect. The board link adds architecture=illustrated to the approved company/terrain view. Previous structures remain available without it. The bridge is isolated from the connected water. These fixed-view illustrations retain the approved miniature technique. See design/ARCHITECTURE.md and design/ARCHITECTURE-PROMPTS.json for scope and generation prompts. Architecture awaits visual review; rendering follows. No publication.

## Unified rendering · study 09

Architecture approved October 24. Open `index.html?miniature=company&terrain=illustrated&architecture=illustrated&render=final` for the rendering review. Before, Daylight and Dusk buttons compare surface grading, contact/cast shadows, water highlights and practical glows in a closer composition. Details and fixed-view limits: design/RENDERING.md. Local only, awaiting visual review before a unified release.

## Current local review · study13

Open `index.html?miniature=company&terrain=illustrated&architecture=illustrated&render=final&board=compact&revision=13`. Drag a miniature/nameplate with touch or mouse, drop to preview, then confirm. Tap/keyboard remain. Living Rampart has detailed art and an inspection view. The compact25hex board links back to full35. Full scope, limitations and verification: design/STUDY-13.md. No publication.

## Play now · compact skirmish14

Open `index.html?miniature=company&terrain=illustrated&architecture=illustrated&render=final&board=compact&play=skirmish&revision=14`. Defeat2Ash Raiders with Seren/Aldric:2actions and3mana perround, attacks/health, enemyAI and victory/defeat/restart. See design/SKIRMISH.md. Local playtest only.

## Current playtest · study15

Open `index.html?miniature=company&terrain=illustrated&architecture=illustrated&render=final&board=compact&play=skirmish&revision=15`. Clear damage/health previews and ordered enemy actions, compact magic tray, and contextual Hold the Crossing / Press the Advantage cards. Mobile confirmation stays reachable while keeping action on the board. See design/STUDY-15.md. Local only.

## Current interface · study16

Open `index.html?miniature=company&terrain=illustrated&architecture=illustrated&render=final&board=compact&play=skirmish&revision=16`. Illustratedspellhand, tactilegold/bronzecontrols, polishedFieldDecisions and a cleanplayagainpanel. Mobilehandscrolls; confirmationdock and combatfeedbackremain. See design/STUDY-16.md. Localonly.
