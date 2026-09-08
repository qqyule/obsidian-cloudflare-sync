import { Hono } from "hono";

import {
  CAPABILITIES,
  PROTOCOL_VERSION,
  SERVER_VERSION,
  type HealthResponse,
  type MetaResponse
} from "@obsidian-cloudflare-sync/shared";

import {
  createR2StorageAdapter,
  type StorageAdapterFactory,
  type WorkerEnv
} from "./storage";

export { createR2StorageAdapter, R2StorageAdapter } from "./storage";
export type { StorageAdapter, StorageAdapterFactory, WorkerEnv } from "./storage";

export const createApp = (storageAdapterFactory: StorageAdapterFactory = createR2StorageAdapter) => {
  const application = new Hono<{ Bindings: WorkerEnv }>();

  application.get("/v1/health", (context) => {
    const storage: HealthResponse["storage"] = storageAdapterFactory(context.env).getStatus();
    const response: HealthResponse = {
      service: "obsidian-cloudflare-sync",
      status: storage === "ready" ? "ok" : "degraded",
      protocolVersion: PROTOCOL_VERSION,
      storage
    };

    return context.json(response, storage === "ready" ? 200 : 503);
  });

  application.get("/v1/meta", (context) => {
    const response: MetaResponse = {
      serverVersion: SERVER_VERSION,
      protocolVersion: PROTOCOL_VERSION,
      capabilities: CAPABILITIES
    };

    return context.json(response);
  });

  application.notFound((context) => context.json({ error: "not_found" }, 404));

  return application;
};

export const app = createApp();

export default app;
