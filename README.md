# Obsidian Cloudflare Sync

Private, end-to-end encrypted Obsidian synchronization on the user's own Cloudflare account.

## Current baseline

This repository is the LEO-63 engineering baseline. It intentionally contains only the boundaries needed to validate the workspace:

- `plugin/`: minimal Obsidian plugin lifecycle and local status command.
- `worker/`: Hono Worker with `health` and `meta` endpoints.
- `shared/protocol/`: versioned protocol constants and response types.

`worker/wrangler.example.toml` shows the local shape of a Worker deployment. The R2 binding remains commented until provisioning creates an account-owned bucket; account-specific names must not be committed.

OAuth provisioning, device authentication, encryption, pairing, file scanning, and synchronization are later milestones. The baseline must not imply that those features are available.

## Development

```sh
pnpm install
pnpm check
```

`pnpm check` runs lint, TypeScript project checks, unit/integration tests, and all three package builds. The plugin build produces a side-loadable artifact under `plugin/dist/`; the Worker build produces `worker/dist/index.js`.

The current acceptance evidence covers automated checks and build artifacts. Loading the plugin in a real Obsidian test vault is a separate validation item and is not claimed by this baseline.

## Safety boundaries

- Do not put Cloudflare credentials, Vault keys, real paths, or test-account secrets in examples or logs.
- Do not use a Cloudflare OAuth token for daily sync requests.
- Keep the Worker health response separate from a future `Ready to sync` product state.
