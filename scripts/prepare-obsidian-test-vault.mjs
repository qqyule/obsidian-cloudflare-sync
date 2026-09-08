import { cp, mkdir, stat } from "node:fs/promises";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const fixtureDir = join(rootDir, "tests", "fixtures", "obsidian-vault");
const artifactDir = join(rootDir, "plugin", "dist");
const localVaultRoot = resolve(rootDir, "ob-test");
const pluginId = "obsidian-cloudflare-sync";
const requiredArtifacts = ["main.js", "manifest.json", "versions.json"];
const args = process.argv.slice(2);
const targetIndex = args.indexOf("--target");
const targetArg = targetIndex >= 0 ? args[targetIndex + 1] : undefined;

if (!targetArg || targetArg.startsWith("--")) {
  throw new Error("usage: pnpm prepare:obsidian-test-vault -- --target ob-test/LEO-63");
}

const targetDir = resolve(rootDir, targetArg);
const relativeTarget = relative(localVaultRoot, targetDir);
if (relativeTarget.startsWith(`..${sep}`) || relativeTarget === ".." || relativeTarget.length === 0) {
  throw new Error("the target must be a new directory inside ob-test/");
}

try {
  await stat(targetDir);
  throw new Error("target already exists; choose a new directory inside ob-test/");
} catch (error) {
  if (error?.code !== "ENOENT") {
    throw error;
  }
}

await cp(fixtureDir, targetDir, { recursive: true });
const pluginDir = join(targetDir, ".obsidian", "plugins", pluginId);
await mkdir(pluginDir, { recursive: true });
for (const artifact of requiredArtifacts) {
  await cp(join(artifactDir, artifact), join(pluginDir, artifact));
}

console.log("Prepared a disposable Obsidian test Vault under ob-test/.");
