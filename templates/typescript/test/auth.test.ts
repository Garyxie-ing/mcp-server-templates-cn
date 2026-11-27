import { describe, expect, it } from "vitest";
import { isAuthorized } from "../src/auth.js";

describe("isAuthorized", () => {
  it("allows all requests when no API key is configured", () => {
    expect(isAuthorized({}, undefined)).toBe(true);
    expect(isAuthorized({ "x-api-key": "anything" }, undefined)).toBe(true);
  });

  it("rejects requests without the header when a key is configured", () => {
    expect(isAuthorized({}, "test-key")).toBe(false);
  });

  it("rejects requests with a wrong key", () => {
    expect(isAuthorized({ "x-api-key": "wrong-key" }, "test-key")).toBe(false);
  });

  it("allows requests with the correct key", () => {
    expect(isAuthorized({ "x-api-key": "test-key" }, "test-key")).toBe(true);
  });
});
