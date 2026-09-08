import type { StorageStatus } from "@obsidian-cloudflare-sync/shared";

export interface WorkerEnv {
  SYNC_BUCKET?: R2Bucket;
}

export interface StorageAdapter {
  getStatus(): StorageStatus;
}

export type StorageAdapterFactory = (env: WorkerEnv | undefined) => StorageAdapter;

export class R2StorageAdapter implements StorageAdapter {
  private readonly bucket: R2Bucket | undefined;

  constructor(bucket: R2Bucket | undefined) {
    this.bucket = bucket;
  }

  getStatus(): StorageStatus {
    return this.bucket ? "ready" : "unavailable";
  }
}

export const createR2StorageAdapter: StorageAdapterFactory = (env) =>
  new R2StorageAdapter(env?.SYNC_BUCKET);
