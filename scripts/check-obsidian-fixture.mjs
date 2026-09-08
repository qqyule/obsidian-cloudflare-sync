import { cp, mkdir, mkdtemp, readFile, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const fixtureDir = join(rootDir, "tests", "fixtures", "obsidian-vault");
const fakeConfigPath = join(rootDir, "tests", "fixtures", "fake-cloudflare-config.json");
const artifactDir = join(rootDir, "plugin", "dist");
const pluginId = "obsidian-cloudflare-sync";
const requiredArtifacts = ["main.js", "manifest.json", "versions.json"];
const forbiddenMarkers = [
  "CLOUDFLARE_API_TOKEN",
  "VAULT_KEY",
  "/Users/",
  "/home/",
  "\\\\Users\\\\"
];

const assertFile = async (filePath, label) => {
  try {
    await stat(filePath);
  } catch (error) {
    throw new Error(`${label} is missing`, { cause: error });
  }
};

const readJson = async (filePath, label) => {
  await assertFile(filePath, label);

  try {
    return JSON.parse(await readFile(filePath, "utf8"));
  } catch (error) {
    throw new Error(`${label} is not valid JSON`, { cause: error });
  }
};

const temporaryRoot = await mkdtemp(join(tmpdir(), "obsidian-cloudflare-sync-fixture-"));

try {
  const vaultDir = join(temporaryRoot, "vault");
  await cp(fixtureDir, vaultDir, { recursive: true });

  const pluginDir = join(vaultDir, ".obsidian", "plugins", pluginId);
  await mkdir(pluginDir, { recursive: true });
  for (const artifact of requiredArtifacts) {
    await cp(join(artifactDir, artifact), join(pluginDir, artifact));
  }

  const communityPlugins = await readJson(
    join(vaultDir, ".obsidian", "community-plugins.json"),
    "community plugin configuration"
  );
  if (!Array.isArray(communityPlugins) || !communityPlugins.includes(pluginId)) {
    throw new Error("the fixture does not enable the baseline plugin");
  }

  const manifest = await readJson(join(pluginDir, "manifest.json"), "plugin manifest");
  if (manifest.id !== pluginId || manifest.version !== "0.1.0") {
    throw new Error("the fixture plugin manifest does not match the baseline");
  }

  const fakeConfig = await readJson(fakeConfigPath, "fake Cloudflare configuration");
  if (
    fakeConfig.accountId !== "fake-account-id" ||
    fakeConfig.apiToken !== "fake-token-do-not-use" ||
    fakeConfig.bucketName !== "fake-sync-bucket"
  ) {
    throw new Error("the fake Cloudflare configuration must keep its non-secret sentinel values");
  }

  for (const artifact of requiredArtifacts) {
    await assertFile(join(pluginDir, artifact), `plugin artifact ${artifact}`);
  }

  const fixtureFiles = [
    join(vaultDir, ".obsidian", "app.json"),
    join(vaultDir, ".obsidian", "community-plugins.json"),
    join(vaultDir, "Smoke.md"),
    fakeConfigPath,
    join(pluginDir, "main.js"),
    join(pluginDir, "manifest.json"),
    join(pluginDir, "versions.json")
  ];

  for (const filePath of fixtureFiles) {
    const contents = await readFile(filePath, "utf8");
    for (const marker of forbiddenMarkers) {
      if (contents.includes(marker)) {
        throw new Error(`fixture contains a forbidden credential or machine-path marker: ${marker}`);
      }
    }
  }
} finally {
  await rm(temporaryRoot, { recursive: true, force: true });
}

console.log("Obsidian fixture check passed.");
