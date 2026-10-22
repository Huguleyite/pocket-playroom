# Lineage: Kingdom Architect

Version 3 · October 22, 2026. A standalone, offline-capable HTML5 dynasty game.

Open `index.html` in a modern browser. All game code, styling and synthesized sound are inline. The game also publishes as `games/lineage/index.html` in Pocket Playroom, through the Big Screen Games section.

## A shorter, rewarding loop

- Five chapters of five decrees each. A special four-choice crisis ends each chapter.
- Year 5: choose a one-use royal favor: postpone the nearest obligation two years, redraw a regular petition, or move a meter up to 12 toward 50. Favors cost no year, cannot skip crises, and cap at three per type.
- Year 10: earn a title and a permanent balance ward for a chosen meter. The ward moves its meter toward 50 by up to two points per decree; repeated wards cap at four.
- Year 15: select one active landmark. The Royal Archive grants redraw favors at future rewards; the Commons Hall grants balance favors; the Crown Bank halves negative delayed Treasury payments, rounding toward zero. Selecting a different landmark in a later reign replaces the existing one.
- Year 20: train an heir. Choosing that heir at succession grants two inherited traits rather than one. The annual house-trait cap remains +3 per meter.
- Year 25: victory celebration, reign rating, and an explicit choice to finish or continue through an heir. Rating measures average meter balance across the 25 decisions. Ending honors a victory and freezes the run; it does not delete the saved chronicle.
- Continuing retains kingdom meters, obligations, favors, upgrades, title and landmark. It begins a fresh 25-decision goal and reward schedule. An early ruler death retains chapter progress.
- Surviving 75 dynasty decisions remains an optional achievement.

There are 24 regular petitions and five chapter crises, with four responses each (116 responses). Era pressure increases after every 25 dynasty decisions. Both extremes (0 and 100) of any core meter end the dynasty, taking priority over a reward or victory.

## Persistence and deferred subscriptions

Version 3 writes to `lineage.kingdom.v3` and migrates compatible v1/v2 saves while retaining their original keys. Reward selection, victory, retirement, favor inventory, chapter progress and obligations survive reload. Saved progress belongs to the browser origin, so a localhost save will not appear on GitHub Pages.

Beehiiv subscription options are removed from this release: no newsletter banner, email form, subscription endpoint, local membership preview, or subscription unlock control. New dynasties use the standard starting meters. The previous integration is preserved in a local authoring archive for possible later work. Compatible previous saves retain their already-applied state.

## Verification

The authoring workspace includes browser regression tests in the standalone game’s previews/rewards-qa.cjs and the collection’s tests/lineage-page-qa.cjs. These development-only files and historical snapshots are not published here. Game source remains a self-contained HTML file; the collection adds a return link.
