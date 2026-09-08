import { access, readFile } from "node:fs/promises";

const requiredFiles = [
  "plugin/dist/main.js",
  "plugin/dist/manifest.json",
  "plugin/dist/versions.json",
  "worker/dist/index.js"
];

for (const file of requiredFiles) {
  await access(file);
}

const manifest = JSON.parse(await readFile("plugin/dist/manifest.json", "utf8"));
if (manifest.id !== "obsidian-cloudflare-sync" || manifest.version !== "0.1.0") {
  throw new Error("plugin manifest does not match the package baseline");
}

const workerArtifact = await readFile("worker/dist/index.js", "utf8");
if (workerArtifact.includes("CLOUDFLARE_API_TOKEN") || workerArtifact.includes("VAULT_KEY")) {
  throw new Error("worker artifact contains a forbidden credential marker");
}

console.log(`Artifact check passed (${requiredFiles.length} files).`);
