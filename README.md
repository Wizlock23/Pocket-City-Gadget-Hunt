# Pocket City: Gadget Hunt — v1.2.0

A kid-friendly, single-player, Roblox-inspired 3D browser playground. Run, dash, grapple, bounce, rescue robot buddies, and explore a huge colorful world with nine districts and 82 stars.

## What is new in v1.2.0

- A 570 × 570 open world with long roads between nine places.
- Moonbase Marshmallow: repair three relays, then ride the rocket in low gravity.
- Prism Canyon: collect six crystals and open the treasure vault.
- Gigglecap Grove: rescue five lost robot buddies and hop across giant mushrooms.
- Neon Boardwalk: claim a hoverboard and race the Neon Loop.
- Cloudtop Islands: grapple upward and light the sky beacon.
- 50 new stars (82 total), new landmarks, an expanded minimap, and a world atlas.
- Press **M** or tap **ATLAS** to fast travel between districts.

## Put it on GitHub Pages

1. Extract this ZIP.
2. Create a repository on GitHub, such as `pocket-city`.
3. Upload the **contents of the extracted `pocket-city` folder** so `index.html` is at the repository root.
4. Commit the files.
5. Open **Settings → Pages**, choose **Deploy from a branch**, select `main` and `/(root)`, and save.
6. Open the Pages URL after GitHub finishes publishing.

The game uses relative asset paths and has no build step, API keys, backend, or account system. Keep `expansion.js` beside `game.js`; it contains the new world districts.

## Run locally

Use a local HTTP server so browser modules can load:

```sh
python3 -m http.server 8000
```

Open <http://localhost:8000>. Do not double-click `index.html` because browsers can block JavaScript modules loaded from `file://` URLs.

## Controls

- **WASD / arrow keys:** move
- **Drag the world:** turn the camera
- **Shift:** sprint
- **Q / Dash button:** dash
- **Space:** jump, double-jump, or release the grapple
- **E / click / Use:** use the selected gadget or interact nearby
- **F:** interact with a nearby activity
- **B:** toggle the hoverboard after claiming it
- **M:** open or close the atlas
- **1–4:** select a gadget
- **Escape:** pause or resume
- **Phone / tablet:** joystick, drag-to-look, Jump, Use, Dash, Sprint, and Atlas

Walk into gadget crates to collect them. Aim toward a blue ring to grapple. Face a robot and hold Use to fire bubbles. Use Super Bounce on the ground, then jump once more in the air. Collect three stars quickly for a speed boost. The checkpoint races are optional and save best times locally.

## Updating an existing game

Replace `index.html`, `style.css`, and `game.js`, and add the new `expansion.js` file beside them. Keep `three.module.js` and `checks/verify-game.mjs`. Version 1.2 keeps the `pocketCity-v1` save key and the original star and gadget IDs, so existing progress on the same site address carries forward.

## Source files

| File | Purpose |
| --- | --- |
| `index.html` | Game screen, atlas, menus, and controls |
| `style.css` | Desktop and mobile interface styling |
| `game.js` | Movement, gadgets, save data, races, map, and HUD |
| `expansion.js` | New districts, landmarks, activities, islands, and stars |
| `three.module.js` | Bundled Three.js 0.170.0 renderer |
| `checks/verify-game.mjs` | Node self-checks using the real game logic |
| `THREE-LICENSE.txt` | Required Three.js MIT license notice |
| `VERSION.txt` | Current release number |

## Self-checks

With Node.js 22 or newer installed:

```sh
node checks/verify-game.mjs
```

The suite runs the real scene and game logic with a stub renderer. The v1.2.0 suite has 61 checks covering the 82-star world, nine districts, new activity interactions, consistent movement at simulated 5–120 FPS, collision, double jump, dash, grapple, bubble effects, races, save data, pause behavior, and automatic graphics scaling.

## Progress and scope

Progress is saved in this browser's local storage under `pocketCity-v1`. It does not sync between devices or between a hosted game and GitHub Pages. This is a single-player browser game; it is not a Roblox Studio project and has no multiplayer or online leaderboard.

Three.js is distributed under the MIT license. Keep `THREE-LICENSE.txt` with the library when redistributing it.
