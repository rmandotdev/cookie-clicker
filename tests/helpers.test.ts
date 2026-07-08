import { describe, expect, test } from "bun:test";
import { formatNumber, itemCost } from "#lib/helpers";

describe("itemCost", () => {
  test("returns base cost when none owned", () => {
    expect(itemCost(15, 0)).toBe(15);
    expect(itemCost(100, 0)).toBe(100);
    expect(itemCost(50, 0)).toBe(50);
  });

  test("scales exponentially with owned count", () => {
    expect(itemCost(15, 1)).toBe(17); // 15 * 1.15 = 17.25 → 17
    expect(itemCost(15, 2)).toBe(19); // 17.25 * 1.15 ≈ 19.83 → 19
    expect(itemCost(100, 5)).toBe(201); // 100 * 1.15^5 ≈ 201.13 → 201
  });

  test("floating point edge cases", () => {
    // 100 * 1.15 = 114.999... in IEEE 754, floor gives 114
    expect(itemCost(100, 1)).toBe(114);
  });

  test("rounds down to nearest integer", () => {
    expect(itemCost(1, 1)).toBe(1); // 1 * 1.15 = 1.15 → 1
    expect(itemCost(3, 1)).toBe(3); // 3 * 1.15 = 3.45 → 3
    expect(itemCost(5, 1)).toBe(5); // 5 * 1.15 = 5.75 → 5
  });

  test("handles zero base cost", () => {
    expect(itemCost(0, 0)).toBe(0);
    expect(itemCost(0, 10)).toBe(0);
  });
});

describe("formatNumber", () => {
  test("returns whole number for values under 1000", () => {
    expect(formatNumber(0)).toBe("0");
    expect(formatNumber(5)).toBe("5");
    expect(formatNumber(999)).toBe("999");
  });

  test("preserves fractional values under 1000", () => {
    expect(formatNumber(0.1)).toBe("0.1");
    expect(formatNumber(1.5)).toBe("1.5");
    expect(formatNumber(0)).toBe("0");
  });

  test("uses K suffix for thousands", () => {
    expect(formatNumber(1_000)).toBe("1.0K");
    expect(formatNumber(1_500)).toBe("1.5K");
    expect(formatNumber(10_000)).toBe("10K");
    expect(formatNumber(999_900)).toBe("1.0M");
  });

  test("uses M suffix for millions", () => {
    expect(formatNumber(1_000_000)).toBe("1.0M");
    expect(formatNumber(2_500_000)).toBe("2.5M");
  });

  test("uses B suffix for billions", () => {
    expect(formatNumber(1_000_000_000)).toBe("1.0B");
    expect(formatNumber(1_234_567_890)).toBe("1.2B");
  });

  test("rounds near tier boundaries gracefully", () => {
    // 999.95M rounds up to 1.0B
    expect(formatNumber(999_950_000)).toBe("1.0B");
  });
});
