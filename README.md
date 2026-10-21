# Pocket Playroom

**Big fun. Pocket edition.** Independent browser games by Sim Floyd, Jr.

Eight games, including the Night Play exclusive Signal Flow. No account required. Progress and preferences are saved in the visitor's browser.

## GitHub Pages

This repository contains the ready-to-serve website. Publish from the `main` branch and the `/ (root)` folder in Settings → Pages. The `.nojekyll` file disables Jekyll processing.

All styles, scripts, and game files are included. Routes use hash fragments and relative asset paths so the site works under a repository subpath. No package installation or build step is required here.

The About and Privacy sections are in HTML templates in `index.html`, opened by `app.js`. The privacy notice includes planned GitHub Pages hosting, browser storage, Google Fonts, and planned CJ affiliate activity. No affiliate tracking or analytics is connected.

## Updating

The authoring project is `Game-Development/Room-for-Play` in the local workspace. Run its `build.mjs`, then replace this repository's website files with the contents of its generated `dist/` directory. Keep this README. Development previews, screenshots, and workspace notes are excluded.

Before enabling affiliate tracking, update the privacy notice for the selected partners and configure any required consent controls.

## Ad-supported play

Game routes check for blocked ad elements and a small local ad probe before loading. Detected blocking shows a support message and retry button. No third-party advertising or tracking is connected by this check. Connectivity failures and missing probe files do not lock games. Direct game links return through the collection route. This browser-side gate is not server-enforced access control.

