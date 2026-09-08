import { describe, expect, it } from "vitest";

import { app, createApp } from "./index";

describe("worker baseline contract", () => {
  it("returns degraded health until the R2 binding exists", async () => {
    const response = await app.request("http://localhost/v1/health");

    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({
      service: "obsidian-cloudflare-sync",
      status: "degraded",
      protocolVersion: 1,
      storage: "unavailable"
    });
  });

  it("reports ready health when an R2 binding exists", async () => {
    const response = await app.request("http://localhost/v1/health", {}, { SYNC_BUCKET: {} as R2Bucket });

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ status: "ok", storage: "ready" });
  });

  it("allows a fake storage adapter to drive health without an R2 binding", async () => {
    const fakeApp = createApp(() => ({ getStatus: () => "ready" }));
    const response = await fakeApp.request("http://localhost/v1/health");

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ status: "ok", storage: "ready" });
  });

  it("keeps meta capabilities limited to the baseline", async () => {
    const response = await app.request("http://localhost/v1/meta");

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      serverVersion: "0.1.0",
      protocolVersion: 1,
      capabilities: ["health", "meta"]
    });
  });

  it("does not expose an unimplemented endpoint as available", async () => {
    const response = await app.request("http://localhost/v1/vaults/example/manifest");

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ error: "not_found" });
  });
});
