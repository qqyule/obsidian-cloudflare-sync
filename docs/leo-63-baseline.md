# LEO-63 baseline

## Actual state

| Area | Present in this baseline | Explicitly not implemented |
| --- | --- | --- |
| Workspace | pnpm workspace, strict TypeScript project references, ESLint, Vitest | Remote CI, GitHub Actions, release automation |
| Plugin | Obsidian lifecycle, persisted local settings, baseline status command, side-load artifact | OAuth, provisioning, SecretStorage integration, sync engine, production settings UI |
| Worker | Hono app with `/v1/health`, `/v1/meta`, 404 contract, bundled artifact | Device auth, vault/object APIs, pairing, encryption, manifest CAS |
| Shared protocol | Version 1 constants, health/meta response types, baseline capabilities | Final manifest/envelope, error catalog, pairing and device contracts |
| Test isolation | In-memory Hono requests and protocol fixtures; no credentials or real Vault paths | Real Cloudflare account, R2 bucket, and Obsidian test-vault smoke |

## Verification entry points

```sh
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm check:artifacts
```

`pnpm check` runs all of the commands above in order. `plugin/dist/` is the side-load artifact directory; `worker/dist/index.js` is the standalone Worker artifact.

## Safety notes

- The Worker returns `503` with `status: degraded` when the R2 binding is absent. This is infrastructure health, not the future product `Ready to sync` state.
- The plugin does not contain a Cloudflare token, Vault key, OAuth callback, or daily sync implementation.
- Tests use fake bindings and local requests only. No production or personal Cloudflare resource is touched.
- Loading the built plugin in a real Obsidian vault is still an explicit follow-up validation item.
