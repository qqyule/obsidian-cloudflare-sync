import { Hono } from "hono";

import {
  CAPABILITIES,
  PROTOCOL_VERSION,
  SERVER_VERSION,
  type HealthResponse,
  type MetaResponse
} from "@obsidian-cloudflare-sync/shared";

export interface WorkerEnv {
  SYNC_BUCKET?: R2Bucket;
}

export const app = new Hono<{ Bindings: WorkerEnv }>();

app.get("/v1/health", (context) => {
  const storage: HealthResponse["storage"] = context.env?.SYNC_BUCKET ? "ready" : "unavailable";
  const response: HealthResponse = {
    service: "obsidian-cloudflare-sync",
    status: storage === "ready" ? "ok" : "degraded",
    protocolVersion: PROTOCOL_VERSION,
    storage
  };

  return context.json(response, storage === "ready" ? 200 : 503);
});

app.get("/v1/meta", (context) => {
  const response: MetaResponse = {
    serverVersion: SERVER_VERSION,
    protocolVersion: PROTOCOL_VERSION,
    capabilities: CAPABILITIES
  };

  return context.json(response);
});

app.notFound((context) => context.json({ error: "not_found" }, 404));

export default app;
