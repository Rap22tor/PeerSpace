import { describe, expect, it } from "vitest";
import {
  getPasswordStrength,
  MAX_PASSWORD_STRENGTH,
  validateEmail,
  validateLoginPassword,
  validateName,
  validateRegisterPassword,
} from "../../src/client/src/validation/auth";
import { getRedirectTarget } from "../../src/client/src/auth/redirect";

describe("validateName", () => {
  it("accepts a normal name", () => {
    expect(validateName("Alex Kim")).toBeUndefined();
  });

  it("rejects an empty or whitespace-only name", () => {
    expect(validateName("")).toBeDefined();
    expect(validateName("   ")).toBeDefined();
  });

  it("rejects a name that is too long", () => {
    expect(validateName("a".repeat(51))).toBeDefined();
  });
});

describe("validateEmail", () => {
  it("accepts a normal address, ignoring surrounding spaces", () => {
    expect(validateEmail("name@school.com")).toBeUndefined();
    expect(validateEmail("  name@school.com ")).toBeUndefined();
  });

  it("rejects empty and malformed addresses", () => {
    expect(validateEmail("")).toBeDefined();
    expect(validateEmail("name")).toBeDefined();
    expect(validateEmail("name@school")).toBeDefined();
    expect(validateEmail("na me@school.com")).toBeDefined();
  });
});

describe("validateRegisterPassword", () => {
  it("accepts 8 or more characters with a number", () => {
    expect(validateRegisterPassword("abcdefg1")).toBeUndefined();
  });

  it("rejects an empty password", () => {
    expect(validateRegisterPassword("")).toBeDefined();
  });

  it("rejects a password that is too short or has no number", () => {
    expect(validateRegisterPassword("abc1")).toBeDefined();
    expect(validateRegisterPassword("abcdefghij")).toBeDefined();
  });
});

describe("validateLoginPassword", () => {
  it("only requires that something was entered", () => {
    expect(validateLoginPassword("x")).toBeUndefined();
    expect(validateLoginPassword("")).toBeDefined();
  });
});

describe("getPasswordStrength", () => {
  it("counts met rules, plus one for a long password that meets all", () => {
    expect(getPasswordStrength("")).toBe(0);
    expect(getPasswordStrength("abcdefghij")).toBe(1);
    expect(getPasswordStrength("abcdefg1")).toBe(2);
    expect(getPasswordStrength("abcdefghijk1")).toBe(MAX_PASSWORD_STRENGTH);
  });
});

describe("getRedirectTarget", () => {
  it("returns a stored local path", () => {
    expect(getRedirectTarget({ from: "/groups" })).toBe("/groups");
  });

  it("falls back to the home page for anything else", () => {
    expect(getRedirectTarget(null)).toBe("/");
    expect(getRedirectTarget({})).toBe("/");
    expect(getRedirectTarget({ from: 42 })).toBe("/");
    expect(getRedirectTarget({ from: "https://evil.example" })).toBe("/");
    expect(getRedirectTarget({ from: "//evil.example" })).toBe("/");
  });
});
