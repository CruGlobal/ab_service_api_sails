# Audit upgrades: socket-safe strategy

We fix npm audit warnings in two phases so socket/session behavior stays unchanged.

## Phase 1: Do NOT upgrade (socket/session path)

These packages are in the socket and session path. **Do not run `npm audit fix --force`**—it would upgrade `sails-hook-sockets` to 3.x and others, which can break session-over-sockets.

| Package | Role |
|---------|------|
| `sails` | Core app; uses glob, ejs |
| `sails-hook-sockets` | Socket.io integration (2.x; 3.x is breaking) |
| `@sailshq/connect-redis` | Session store (sessions over sockets) |
| `@sailshq/socket.io-redis` | Socket adapter (Redis pub/sub) |
| `redis` | Used by connect-redis and socket.io-redis |
| `socket.io` (2.x under sails-hook-sockets) | Real-time transport |
| `engine.io` / `engine.io-client` | Under socket.io |
| `parseuri` | Under engine.io-client; has ReDoS advisory (fix needs sails-hook-sockets 3.x) |

**Config that uses them:** `config/sockets.js` (adapter: `@sailshq/socket.io-redis`), `config/session.js` (adapter: `@sailshq/connect-redis`).

## Phase 2 (later): Socket stack upgrades

When you are ready to risk socket/session changes and re-test:

- Consider upgrading `sails-hook-sockets` to 3.x (breaking; would fix parseuri/ms and modernize socket.io).
- Then re-run `npm audit` and address any remaining advisories in `sails`, `@sailshq/connect-redis`, `@sailshq/socket.io-redis`, and `redis`.

## Phase 1: Safe to upgrade

`npm audit fix` (without `--force`) only applies semver-compatible fixes. It will **not** upgrade:

- `sails-hook-sockets` to 3.x (that would require `--force`)
- `sails` to 2.x
- `passport` to 0.7.x (audit marks it as breaking)

So it is safe for the socket stack. Everything else (lodash, async, grunt tooling, eslint tree, redis patch versions, etc.) may be updated by `npm audit fix`.

## How to apply phase 1 (run locally)

1. **Optional:** If you use the `ab-cli` Git dependency and see `Host key verification failed` for github.com, update SSH known_hosts (e.g. `ssh-keygen -R github.com` then reconnect, or add the key your Git host uses).
2. From `developer/api_sails` run:
   ```bash
   npm audit fix
   ```
   Do **not** use `npm audit fix --force`.
3. Run the app and confirm session-over-sockets still works.
4. Run `npm audit` again. Remaining issues should be only in the socket/session stack or in packages that need breaking upgrades (e.g. eslint, passport).
