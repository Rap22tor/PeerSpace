import { describe, expect, it } from "vitest";
import {
  validateGroupCapacity,
  validateGroupDescription,
  validateGroupTags,
  validateGroupTitle,
} from "../../src/client/src/validation/group";

describe("validateGroupTitle", () => {
  it("accepts a normal title, ignoring surrounding spaces", () => {
    expect(validateGroupTitle("Algorithms study group")).toBeUndefined();
    expect(validateGroupTitle("  Algorithms  ")).toBeUndefined();
  });

  it("rejects an empty or whitespace-only title", () => {
    expect(validateGroupTitle("")).toBeDefined();
    expect(validateGroupTitle("   ")).toBeDefined();
  });

  it("rejects a title that is too long", () => {
    expect(validateGroupTitle("a".repeat(100))).toBeUndefined();
    expect(validateGroupTitle("a".repeat(101))).toBeDefined();
  });
});

describe("validateGroupDescription", () => {
  it("accepts a blank description, since it is optional", () => {
    expect(validateGroupDescription("")).toBeUndefined();
    expect(validateGroupDescription("   ")).toBeUndefined();
  });

  it("rejects a description that is too long", () => {
    expect(validateGroupDescription("a".repeat(1000))).toBeUndefined();
    expect(validateGroupDescription("a".repeat(1001))).toBeDefined();
  });
});

describe("validateGroupTags", () => {
  it("accepts blank and comma-separated tags", () => {
    expect(validateGroupTags("")).toBeUndefined();
    expect(validateGroupTags("algorithms, exam prep")).toBeUndefined();
  });

  it("rejects tags that are too long", () => {
    expect(validateGroupTags("a".repeat(200))).toBeUndefined();
    expect(validateGroupTags("a".repeat(201))).toBeDefined();
  });
});

describe("validateGroupCapacity", () => {
  it("accepts whole numbers from 1 to 50", () => {
    expect(validateGroupCapacity("1")).toBeUndefined();
    expect(validateGroupCapacity("10")).toBeUndefined();
    expect(validateGroupCapacity(" 50 ")).toBeUndefined();
  });

  it("rejects numbers outside the range", () => {
    expect(validateGroupCapacity("0")).toBeDefined();
    expect(validateGroupCapacity("51")).toBeDefined();
    expect(validateGroupCapacity("-3")).toBeDefined();
  });

  it("rejects fractions, text and a blank value", () => {
    expect(validateGroupCapacity("2.5")).toBeDefined();
    expect(validateGroupCapacity("abc")).toBeDefined();
    expect(validateGroupCapacity("")).toBeDefined();
    expect(validateGroupCapacity("   ")).toBeDefined();
  });
});
