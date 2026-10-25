# Compact battlefield configuration

Optional `?board=compact` uses 25 hexes in five columns and five rows, compared with 35 hexes in the original study. All five rows remain so both riverbanks have room for movement. The frame narrows from 15.6 to 12 world units at the same 9.9 depth, reducing its physical surface by 23%.

The crossing, shrine, ruin, cottage, mage and guardian retain their existing positions and labels. Artwork is shared unchanged. The clipped outer columns remove four original woodland cells; the northwest woodland remains. No replacement obstacles are added. All 18 walkable cells remain connected through the bridge, with 13 initial mage destinations within portal range.

`compact-board.js` supplies configuration only. The main runtime reads its coordinate limits, tile types, labels, frame size and starting positions. The full study remains the default without the query option. The smaller board shares the same movement, portal, rampart and ward rules.

Validation: `previews/compact-config-test.cjs` checks dimensions, landmark positions, consistent labels, whole-board movement connectivity, adjacent movement, portal choices and barrier choices. Browser and visual integration are verified separately by the main task.

Browser integration: previews/compact-board-verify.cjs passes 10 checks, including all asset layers, 25-cell snapshot, all three spells, full/compact navigation and no horizontal overflow at 1366, 390 and 320 pixels. Screenshots saved for those widths. Initial mobile framing clips the decorative frame corners; main task is adjusting the mobile view margin before delivery.
