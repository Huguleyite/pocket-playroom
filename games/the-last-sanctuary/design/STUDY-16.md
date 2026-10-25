# Study16 · illustrated hand and tactile interface

Approved by Sim after reviewing study15. Local-only update; nothing published.

Play: index.html?miniature=company&terrain=illustrated&architecture=illustrated&render=final&board=compact&play=skirmish&revision=16

The large artwork-led spells return as a medium-height illustrated hand below the board. Each card shows its existing artwork, prominent title, mana badge and short effect description. Desktop keeps the hand in the board column while the inspector spans both rows. Mobile uses a horizontal scrollable hand with205px-wide cards; the board and confirmationdock remain available.

Confirm buttons use warm ivory/antiquegold with beveled edges, shadows and pressed/focus states. Endturn is bronze; quieter cancel/inspection controls remain comfortably sized. Attack confirmation reads Strike plus actualdamage. The mobile dock retains explicit action costs. Rosters and panels use restrained layered finishes, gold dividers and improved spacing.

Field Decisions preserve the approved text and mechanics. Their visual finish adds an engraved double border, tactical star emblem and separate cost ribbon. No new cards or rule changes.

Victory/defeat clears the obsolete destination notice, hides the disabled orderbutton and irrelevant fieldchoices, and presents one prominent Begin another battle button. The main restart affordance is hidden at battleend; the new button restarts a fresh encounter. Optional battlehistory remains accessible. Original artwork, terrain, miniatures, combatfeedback and tacticalrules are unchanged.

Validation: desktop1920/1366 and phone390/320 layouts inspected; artworkvisible, minimumcard200px height and no page overflow. Spell selection/cancellation, no previewmana spend, FieldDecisionavailability, exactattacklabel/cost and mobilecostsummary checked. Full29desktop/mobile win/loss/restart regressions pass, including actual Begin another battle and clearedvictorynotice. Combatclarity/touch regression rerun. Sources saved with a priorversionbackup; visualreview remains pending.
