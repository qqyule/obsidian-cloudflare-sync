import { describe, expect, it } from "vitest";

import { CAPABILITIES, PROTOCOL_VERSION, SERVER_VERSION } from ".";

describe("shared protocol baseline", () => {
  it("exposes a versioned, intentionally small capability set", () => {
    expect(PROTOCOL_VERSION).toBe(1);
    expect(SERVER_VERSION).toBe("0.1.0");
    expect(CAPABILITIES).toEqual(["health", "meta"]);
  });
});
