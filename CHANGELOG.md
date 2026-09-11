# v1.2.0 — Big World Update

## World

- Expanded the playable playground from a compact city into a 570 × 570 world with nine named districts and connected long-distance roads.
- Added Moonbase Marshmallow, Prism Canyon, Gigglecap Grove, Neon Boardwalk, and Cloudtop Islands.
- Added 50 new stars for 82 total, floating islands, crater rocks, mushroom caps, neon towers, crystal mesas, relays, a treasure vault, and a sky beacon.
- Added a world atlas with fast travel so younger players can always find a new place to explore.

## Things to do

- Repair three Moonbase relays, then launch from the rocket in low gravity.
- Collect six Prism Canyon crystals to open the treasure vault and earn a temporary speed boost.
- Rescue five lost robot buddies in Gigglecap Grove and bounce across giant mushroom caps.
- Claim the Neon Boardwalk hoverboard and race the new Neon Loop checkpoint course.
- Grapple up Cloudtop Islands and light the highest sky beacon.

## Play and performance

- Preserved the v1.1 fixed-step movement, faster run speed, sprint, dash, double jump, pooled effects, and instanced scenery.
- Kept the original star and gadget IDs and the `pocketCity-v1` save key, so existing progress carries forward.
- Expanded the minimap to show the full world and district markers; paused and atlas screens stop simulation work.
- Added keyboard shortcuts: `M` atlas, `F` interact, and `B` hoverboard toggle.

## Verification

- 61 self-checks pass with the real game logic and a stub renderer.
- Checks cover 82 stars, nine districts, new crystals, relays, and rescue activities, plus the v1.1 movement and performance safeguards.
- Movement remains consistent at simulated 5, 15, 20, 30, 60, and 120 FPS; scenery is grouped into 333 draw batches from 968 static meshes.

# v1.1 — Dash & Discover

## Performance

- Fixed frame-dependent slow motion: movement now advances in fixed 1/120-second steps, catching up ordinary slow frames up to 200 ms. Longer stalls are bounded to avoid runaway catch-up.
- Grouped static scenery meshes into spatial drawing batches.
- Shared geometry and simpler lit materials; removed realtime shadow-map rendering in favor of a small contact shadow.
- Reduced initial pixel density, with automatic resolution adjustment and Smooth / Crisp options.
- Reused 96 particle slots and 12 bubble slots instead of creating new effect meshes while playing.
- Cached camera collision bounds, minimap background, and interface references.
- Minimap and HUD updates run at 10 Hz; rendering stops while paused or hidden.
- Debounced progress writes, with flush on pause and page exit.

## Play

- Run speed increased from 11 to 18 units/second; sprint is 27 units/second.
- Added a short 45-unit/second dash with a cooldown.
- Added double jumping, a short grace period at ledges, and buffered landing jumps.
- Faster arcing grapple, more generous aim assistance, and blue rings that face the camera.
- Faster bubble projectiles with hold-to-fire, forgiving aim, line-of-sight checks, and short robot dance cooldowns.
- Super bounce can chain into one midair boost.
- Three quick star pickups grant a five-second speed boost.
- Optional City Sprint checkpoint course with a device-local best time.

## Compatibility

- Existing star, gadget, and race progress is preserved on the same origin.
- Three.js remains bundled locally, with no build step or API keys required.
