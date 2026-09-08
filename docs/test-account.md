# Isolated Cloudflare test account

LEO-63 can be verified locally without a Cloudflare account, R2 bucket, token, or network request. `pnpm test`, `pnpm check`, the Worker fake adapter, and the Obsidian fixture are all local-only checks.

`tests/fixtures/fake-cloudflare-config.json` contains intentionally invalid example values for contract and redaction checks. It is not a credential file and must never be replaced with a real token or account ID.

## Authorized remote validation

Only after explicit authorization for a specific isolated resource:

1. Use a separate Cloudflare account or a dedicated test project and a bucket that contains no personal or production data.
2. Copy `worker/wrangler.example.toml` to the ignored local file `worker/wrangler.toml` and fill in only the isolated Worker and bucket names.
3. Keep tokens in the local secret manager or shell environment. Do not put them in the repository, Vault fixture, command arguments, screenshots, or test logs.
4. Run only the health and metadata checks needed for the baseline. The baseline has no vault, object, pairing, encryption, or synchronization API.
5. Revoke temporary credentials and remove the test resource when the authorized validation ends.

The plugin must never use a Cloudflare management token for routine sync requests. Remote validation is separate from the local acceptance path and is not required to run `pnpm check`.
