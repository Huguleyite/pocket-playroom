# Daily Stars

7×7 daily star-placement puzzle, reset at midnight America/New_York. Launch date: 2026-11-01.

Includes 400 static unique puzzles verified by enumeration and an independent backtracking solver. Generate with node scripts/generate-daily-stars.mjs; the script writes games/daily-stars/puzzles.json, matching bank.js, and docs/daily-stars-verification.log only after every puzzle passes.

Optional manual dots and hold-a-star row/column marking, undo, reset, hints, conflict checks, pause-on-hidden timing, spoiler-free results and exact-puzzle friend challenges. Progress is local to the browser, with safe failure when storage is blocked.

Board rewards: 3-day Prismatic Starboard; 10-day Moonstone Observatory; 25-day Aurora Garden; 50-day Celestial Orrery; 100-day Eclipse Starforge; 200-day Nebula Outline. Daily solves count once per Eastern date; hints allowed; challenges and previews do not count. Earned boards remain unlocked after a streak breaks. Select under Settings → Your boards.

Direct Shorts recording: games/daily-stars/index.html?short=1. Optional reveal=1, static=1, loop=0 and day=N parameters. Important content stays outside the bottom 23% and right 14%.

This is a fully static game. The preview date guard and browser-saved rewards are convenience features, not server-enforced access controls; static assets expose the full puzzle bank.

Release verification covers gameplay, midnight/DST, storage failure, native touch/copy challenge flows, and narrow/foldable layouts including Galaxy Z Fold6 cover-screen emulation. Physical-device certification is not claimed.
