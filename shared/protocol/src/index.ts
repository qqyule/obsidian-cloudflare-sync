export const PROTOCOL_VERSION = 1 as const;
export const SERVER_VERSION = "0.1.0" as const;

export const CAPABILITIES = ["health", "meta"] as const;
export type Capability = (typeof CAPABILITIES)[number];

export type StorageStatus = "ready" | "unavailable";

export interface HealthResponse {
  service: "obsidian-cloudflare-sync";
  status: "ok" | "degraded";
  protocolVersion: typeof PROTOCOL_VERSION;
  storage: StorageStatus;
}

export interface MetaResponse {
  serverVersion: typeof SERVER_VERSION;
  protocolVersion: typeof PROTOCOL_VERSION;
  capabilities: readonly Capability[];
}
