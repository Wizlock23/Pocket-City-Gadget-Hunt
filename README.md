# Pocket City: Gadget Hunt — v1.1

A single-player, Roblox-inspired 3D browser playground. Explore a city, robot park, beach, and mountain playground. Find a grappling hook, bubble blaster, and super bounce, and collect 32 stars.

## Updating an existing GitHub game

Replace `index.html`, `style.css`, and `game.js` in the same location in your repository. Upload the rest of this package if you want the updated instructions and self-check script too. The Three.js library has not changed. Commit the changes, wait for Pages to finish publishing, then reload the game. On Windows, Ctrl+F5 refreshes cached files.

Keep the same repository and Pages address to retain this browser's saved progress. Version 1.1 uses the existing `pocketCity-v1` save key and the same star and gadget IDs.

## Put the game on GitHub

1. Extract this ZIP on your computer.
2. Create a repository on GitHub, for example `pocket-city`.
3. Choose **Add file → Upload files** (or the upload link on a new repository).
4. Upload the **contents** of this folder, including all four game files and the Three.js license. `index.html` must be at the top level of the repository, not inside another folder. Upload the extracted files, not the ZIP.
5. Commit the uploaded files.

## Make it playable with GitHub Pages

1. Open the repository's **Settings → Pages**.
2. Under **Source**, choose **Deploy from a branch**.
3. Choose the `main` branch and **/(root)**, then click **Save**.
4. Wait for publishing to finish. Your game link will appear on the Pages settings screen, usually `https://YOUR-USERNAME.github.io/pocket-city/`.

A public repository works with GitHub Free. GitHub Pages normally makes the game publicly accessible. This export uses relative paths, so it supports repository-based Pages URLs without editing the code. No npm install or build step is needed.

Official instructions: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Run on your computer

With Python 3 installed, open a terminal in this folder and run:

```sh
python -m http.server 8000
```

On systems where Python uses the `python3` command, use `python3 -m http.server 8000` instead. Open http://localhost:8000 in your browser. You can also use an editor's local HTTP server, such as Live Server.

Do not double-click `index.html`: browsers may block JavaScript modules when opened as local files. Use the local server or GitHub Pages. A browser with WebGL 2 support is required.

## Controls

- **WASD / arrow keys:** move
- **Drag the world:** turn the camera
- **Shift:** hold to sprint (or toggle Sprint on a phone)
- **Q / Dash button:** short speed dash
- **Space:** jump, press again to double-jump, or release the grapple
- **Click / E:** use the selected gadget; hold E or the phone Use button to keep firing bubbles
- **1–4:** select a gadget
- **Escape:** pause or resume
- **Phone / tablet:** left joystick to move, drag the world to look, and tap Jump, Use, or Dash. Sprint toggles faster running

Walk into gadget crates to collect them. Aim at a glowing blue ring to grapple. Face a nearby robot to use the bubble blaster. Use super bounce on the ground, with one additional boost while airborne. Purple launch pads bounce automatically. Collect 3 stars within a short streak for a 5-second speed boost. The optional City Sprint button starts a repeatable checkpoint race and saves your best time locally.

## Source files

| File | Purpose |
| --- | --- |
| `index.html` | Game screen, menus, and controls |
| `style.css` | Desktop and mobile interface styling |
| `game.js` | World, characters, physics, gadgets, and progress |
| `three.module.js` | Bundled Three.js 0.170.0 rendering library |
| `THREE-LICENSE.txt` | Required Three.js MIT license notice |
| `.nojekyll` | Optional GitHub Pages static-file marker |

All game dependencies are included. The game makes no API calls and needs no keys, account system, backend, or database.

## Progress and current scope

Progress saves in this browser's local storage under `pocketCity-v1`. It does not sync across devices or between the original hosted game and GitHub Pages. Clearing site data clears progress.

This is version 1.1, with single-player exploration, a checkpoint race, and friendly robot targets. It is not a Roblox Studio project and has no multiplayer or online leaderboard.

## If play feels slow

Pause and switch **Graphics** to **Smooth**. Auto mode starts at a conservative resolution and adjusts rendering resolution when sustained frames are slow. Crisp mode uses higher resolution. These options do not change game speed or progress. The game pauses when hidden or unfocused.

## Self-checks

Optional, with Node.js 22 or newer installed:

```sh
node checks/verify-game.mjs
```

The checks run the real scene and game logic with a stub renderer and document. They cover consistent movement from simulated 5 to 120 FPS, sprint, dash, collision, double jump, jump buffering, gadget pickup, grapple, bubble hit and repeat fire, fixed-size effect pools, star boosts, race completion, pause/resume, saved progress, and automatic graphics scaling.

53 checks passed with a fresh save and malformed saved data; 55 passed with an existing save containing both valid and invalid IDs. Static scenery was grouped from 504 separate objects into 115 batches. That reduces rendering submissions; it is not a measured FPS improvement. No real-device GPU or browser frame-rate measurements have been made. Please playtest on your target devices.

## Third-party license

Three.js is distributed under the MIT license. Keep `THREE-LICENSE.txt` and the existing license header with that library when redistributing it. No separate open-source license has been selected for the game-specific files; choose one before inviting reuse or contributions if desired.
