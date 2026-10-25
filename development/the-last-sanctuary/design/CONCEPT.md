# The Last Sanctuary — concept proposal

October 23, 2026 · Working title · Design only

## Agreed direction

Create a battle strategy board with fully designed, sculpted miniature pieces, inspired by the distinctive physical identities of Monopoly tokens. A wizard/mage is essential, enabling unusual cards and expressive effects on both cards and terrain. A spacious landscape board is the visual ambition. Story decisions belong between battles, drawing on Lineage's branching consequences. Do not build gameplay before visual review.

## Core promise

Think through your hand or through your battlefield. Selecting a card reveals eligible miniatures and targets. Selecting a miniature and destination reveals the matching available command. If several commands fit, show the alternatives and their costs; never silently spend a card. Preview paths, targets, resource costs and predictable outcomes. Confirm to commit. Cancel freely before commitment.

## Proposed first scenario: The Broken Crossing

A compact hex landscape has two home sanctuaries, a river, two crossings, woods, ruined walls and a central relic shrine. Five miniatures per side compete to retrieve the relic and return it to their own sanctuary. A dropped relic stays where its carrier falls. Carrier movement is reduced; teleportation cannot transport the relic. These are proposed rules requiring playtesting.

Target a 15–25 minute match. Begin with one battlefield and one opponent. A turn grants two orders, each activating a different miniature. Basic movement and basic attacks need no card. Draw toward a three-card hand; play at most one command card per turn. Spell cards also spend a small, capped mana reserve. All numbers are starting hypotheses, not balanced specifications.

## Miniature lineup

All figures are standing sculptural objects on shallow faction-colored bases, never flat checkers counters. Recognizable silhouettes and base symbols supplement color. Friendly pieces use antique brass, ivory and teal; rivals use dark silver and burgundy. Keep effects away from essential silhouettes.

| Figure | Sculpture | Tactical identity |
| --- | --- | --- |
| Commander | Cloaked officer with raised banner | Coordinates allies and controls objectives |
| Guardian | Broad armored figure with tower shield | Holds crossings and protects carriers |
| Rider | Mounted lancer with flowing pennant | Flanks and intercepts |
| Ranger | Hooded archer on a low rocky plinth | Controls open lanes; terrain blocks shots |
| Mage | Black woman with crescent staff, sweeping robes and a suspended crystal | Changes movement, terrain and tactical possibilities |

## Sample command cards

| Card | Actor | Proposed effect |
| --- | --- | --- |
| Fold the Path | Mage | Spend 2 mana to move a non-carrier ally between two visible, empty eligible hexes within spell range. Preview both endpoints. |
| Living Rampart | Mage | Spend 1 mana to raise a temporary barrier on one empty eligible hex for one enemy turn. Cannot seal every route to an objective. |
| Echo Ward | Mage | Spend 1 mana to shield an ally against the next hit until the start of your following turn. |
| Thunderwake | Mage | Spend 2 mana to strike a short line and push the first enemy one legal hex. Show the landing hex before committing; no push into occupied or impassable terrain. |
| Hold the Crossing | Guardian | Brace and intercept the next adjacent attack against an ally this round. |
| Ride Them Down | Rider | Advance along a clear path into a legal attack. |

Show actor, cost, target rules and duration clearly. Magic uses a shared mana pool; ordinary commands do not. A spell consumes the mage's activation and the turn's card allowance. Do not create a second hidden action economy.

## Presentation and effects

Camera: angled landscape view with clear hex boundaries, tangible miniature proportions and readable terrain. Bottom card hand; compact turn/objective strip; contextual unit details. The board is the primary focus. Start with a fixed camera and optional closer inspection rather than unrestricted camera controls.

Card hover or focus gives a restrained animated illustration and highlights the matching figure. A portal card folds a luminous ribbon between endpoints; the matching board preview uses the same symbol and color. Rampart raises translucent stone in preview, then solidifies on commitment. Ward produces a brief protective halo and a persistent shield marker. Thunderwake shows a clean projected line before lightning resolves. Support reduced motion, instant resolution, keyboard selection and persistent outcome text.

Concept illustrations communicate look and composition. They do not prove working 3D assets, interaction, animation or tactical readability at shipping size. A later prototype must test those separately.

## Between-battle story

Use Lineage's strength in short decisions with remembered consequences, outside tactical turns. Example: villagers ask for the captured bridge to remain guarded. Leave a Guardian and begin the next encounter without it, receiving a local defensive benefit; or keep the full squad and risk losing village support later. Display the immediate mechanical tradeoff and retain the choice for a later encounter. No dynasty meters or petition interruptions are proposed for the initial battle prototype.

## Reuse boundaries

Hex-Gambit offers patterns for card targeting, previews, AI turns, shields, freeze effects, animation, saves and reward drafting. Its checkers movement, mandatory capture, promotion and 8×8 topology do not directly fit this proposed hex battlefield. New movement, line of sight, objectives, attacks and AI evaluation will be needed. Lineage offers patterns for branching events and delayed consequences; adaptation still needs explicit design and testing. Keep both existing games untouched.

## Review before implementation

Review board atmosphere and readability, miniature silhouettes and material, mage identity, card treatment, magic intensity and the story panel. Then choose a rendering approach and create a small playable movement/card experiment. Campaign, additional maps, multiplayer and production miniature assets remain later scope.

## Visual study 01

See concept-study-01.png for the first coordinated art-direction proposal. The mage, faction materials, miniature silhouettes, terrain and card treatment establish a candidate look. Card wording in generated art is illustrative: Living Rampart appears as a defense buff in the image, while this brief proposes a terrain barrier. The brief is the rules reference; final card text and effects must be reconciled after visual review. The image is concept art, not production 3D models or a working interface.

## Interactive study 01 · October 23, 2026

Sim approved the small static-site prototype: one board section, mage and guardian, three cards, and a portal effect. Implemented at ../index.html with local scripts and artwork. Also includes barrier/ward effects, free adjacent movement, miniature inspection and the between-battle choice sample. Eighteen checks across six viewport sizes passed; no remote runtime requests. Geometric models are early sculpture studies rather than production assets. Combat, opponent AI, full turn rules, saves and campaign progression remain unbuilt. Nothing is published.

## Review feedback · October 23, 2026

Sim likes the interactive preview and confirms that its interactions match his intended game. He especially loves the portal and effects and reports that the features work well. Preserve those interactions and effects. He expects richer art, terrain/board and more polished miniatures in the eventual game. Work is stopping for now; he plans to resume at 11 pm EDT tonight. No new implementation or publication was requested in this feedback.

## Art & Atmosphere study 02 · October 23, 2026

Sim authorized the visual refinement pass. The local study now has richer landscape materials and small terrain details, two tree silhouettes, bridge supports, a reflective metal lighting environment, refined mage/guardian geometry and richer card frames. Approved order behavior and portal effects are retained. Nineteen checks passed at six viewports; reduced-motion landscape freeze and HTTP loading verified. Open ../index.html or the local preview at http://127.0.0.1:51974/?study=02. These remain geometric model studies, not final production sculpts. Nothing published.

## Miniature quality demonstration 03 · October 23, 2026

Sim rejected study 02 as essentially the same elementary appearance and authorized a distinctly higher-quality demonstration, working one part at a time before deciding on broader work. Demonstration 03 focuses on Seren: a new detailed transparent miniature illustration, shown close up and as an optional fixed-view sprite on the existing 3D board. Comparison page: miniature-study.html. Full-size option: index.html?miniature=seren. This is explicitly not a rotatable 3D sculpt; a corresponding production model has not been made. Existing default models, terrain, portal effects and game behavior remain. Ten demonstration checks and nineteen base checks passed. New art and rendering approach await Sim’s review; no publication authorized.

## The Company · miniature phase 04

Seren’s detailed illustrated style was approved. Completed matching Guardian, Commander, Rider and Ranger assets and a five-role review collection at company.html. The optional board test index.html?miniature=company uses both illustrated active pieces; the other three have art only, not gameplay classes. Passed eighteen collection checks, ten comparison checks and nineteen base checks. Terrain, architecture and rendering remain subsequent phases, in that exact order. Await review before moving to terrain. Nothing published.

## Terrain study 06 · October 24, 2026

Sim approved the revised miniature roster and requested saving it for one unified push. Asset hashes retained in release/approved-miniatures.json. Completed meadow, woodland, rocky-ground and riverbank terrain assets with a review gallery at terrain.html and optional board integration at index.html?miniature=company&terrain=illustrated. The underlying map and action rules are retained. Seventeen terrain, nineteen base and eighteen collection checks passed. The illustrated terrain has a fixed viewpoint; old architecture remains placeholder and final rendering is deferred. Terrain awaits review before architecture. Nothing published.

## Approved stopping point · October 24, 2026

Sim approved connected-water study 07 and instructed saving it for the overall update. Approved-terrain asset/source hashes are retained in release/approved-terrain.json. Miniatures are already retained in release/approved-miniatures.json. He is stopping because of daily credits and will return in the morning. No further implementation or push is authorized during the pause. Next planned phase: architecture, then rendering, retaining the approved miniatures, connected water and spell controls.

### October 24 · Architecture approval and rendering review

Sim approved the four architecture pieces and authorized rendering. Unified local rendering study 09 includes closer composition, surface grading, contact and silhouette shadows, daylight/dusk comparison, world-coordinate water highlights and practical shrine/cottage glows. Approved asset files remain unchanged. Rendering awaits visual review; unified publication is not authorized. See design/RENDERING.md.
