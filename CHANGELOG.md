# v1.1 — Dash & Discover

## Performance

- Fixed frame-dependent slow motion: movement now advances in fixed 1/120-second steps, catching up ordinary slow frames up to 200 ms. Longer stalls are bounded to avoid runaway catch-up.
- Grouped 504 static scenery meshes into 115 spatial drawing batches.
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
- Optional City Sprint checkpoint course with a device-local best time; no forced countdown or penalty for stopping.
- Full collected crates disappear, including their bands and signs.
- Existing star/gadget progress is preserved on the same origin.

## Verification

- 53 logic checks passed on fresh and malformed save fixtures; 55 on an existing-save fixture.
- One second of forward movement covered 17.3225 units (including acceleration) at every simulated rate tested: 5, 15, 20, 30, 60, and 120 FPS.
- Verified relative asset paths and UI element references.
- GPU performance and phone ergonomics still need real-device playtesting; no FPS multiplier is claimed.
