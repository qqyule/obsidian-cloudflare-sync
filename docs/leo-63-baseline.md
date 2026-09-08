# LEO-63 baseline

## Actual state

| Area | Present in this baseline | Explicitly not implemented |
| --- | --- | --- |
| Workspace | pnpm workspace, strict TypeScript project references, ESLint, Vitest | Remote CI, GitHub Actions, release automation |
| Plugin | Obsidian lifecycle, persisted local settings, baseline status command, side-load artifact | OAuth, provisioning, SecretStorage integration, sync engine, production settings UI |
| Worker | Hono app with `/v1/health`, `/v1/meta`, 404 contract, injected `StorageAdapter`, bundled artifact | Device auth, vault/object APIs, pairing, encryption, manifest CAS |
| Shared protocol | Version 1 constants, health/meta response types, baseline capabilities | Final manifest/envelope, error catalog, pairing and device contracts |
| Test isolation | In-memory Hono requests, fake storage adapter, sanitized `tests/fixtures/obsidian-vault`, and disposable Vaults under ignored `ob-test/`; no credentials or real Vault paths | Real Cloudflare account, R2 bucket, mobile and production sync flows |

## Verification entry points

```sh
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm check:artifacts
pnpm check:fixtures
```

`pnpm check` runs all of the commands above in order. `plugin/dist/` is the side-load artifact directory; `worker/dist/index.js` is the standalone Worker artifact. If the configured package mirror is unavailable, use `CI=true pnpm install --frozen-lockfile --registry=https://registry.npmjs.org/`.

## Safety notes

- The Worker returns `503` with `status: degraded` when the R2 binding is absent. This is infrastructure health, not the future product `Ready to sync` state.
- The Worker health route reads storage state through an injected `StorageAdapter`; the baseline R2 adapter only checks whether the binding exists and does not perform storage I/O.
- The plugin does not contain a Cloudflare token, Vault key, OAuth callback, or daily sync implementation.
- Tests use fake storage adapters, local requests, a sanitized fixture, and disposable local Vaults only. No production or personal Cloudflare resource is touched.
- Use `pnpm prepare:obsidian-test-vault -- --target ob-test/LEO-63` to create a repeatable desktop smoke-test Vault. The `ob-test/` directory is local test data and remains outside the source artifact; do not treat it as production Vault content.
- The desktop smoke passed on 2026-09-08 with Obsidian 1.13.7 and the user-provided `ob-test/Test` Vault; the repeatable fixture path is documented above for future acceptance evidence.
- See [`docs/test-account.md`](test-account.md) for the rules governing any separately authorized remote validation.
