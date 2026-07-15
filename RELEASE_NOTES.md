# TypeType 1.0.2

TypeType 1.0.2 is a stability update for SABR playback. It fixes a Chromium MediaSource failure that could happen during rapid seeks or when replacing an active player session.

## What changed

- Prevent `SourceBuffer.abort()` while an asynchronous removal is active.
- Improve playback stability during rapid forward and backward seeks.
- Preserve cancellation of obsolete SABR segment requests.
- Keep existing API contracts and self-hosting configuration unchanged.

## Updating

Follow the [update guide](https://priveetee.github.io/Docs-TypeType/self-hosting/maintenance).

If necessary, follow the [rollback guide](https://priveetee.github.io/Docs-TypeType/self-hosting/rollback).

