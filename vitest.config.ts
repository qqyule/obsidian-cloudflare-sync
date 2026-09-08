import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["shared/**/*.test.ts", "worker/**/*.test.ts", "plugin/**/*.test.ts"],
    environment: "node",
    passWithNoTests: false
  }
});
