import { describe, expect, test } from "bun:test";
import {
  computeClickPower,
  computeCps,
  gatherUnlockContext,
  getItemCost,
  initialItemsOwned,
  isUnlocked,
  tick,
  tryBuyItem,
} from "#lib/game";
import { items } from "#lib/items";

function owned(overrides: Record<string, number> = {}): Record<string, number> {
  return { ...initialItemsOwned(), ...overrides };
}

function ctx(
  itemsOwned: Record<string, number>,
  cookies = 0,
  totalCookies = 0,
) {
  return gatherUnlockContext(itemsOwned, cookies, totalCookies);
}

describe("computeCps", () => {
  test("zero when nothing owned", () => {
    expect(computeCps(owned())).toBe(0);
  });

  test("sums cps from all owned items", () => {
    expect(computeCps(owned({ cursor: 5 }))).toBeCloseTo(0.5);
    expect(computeCps(owned({ cursor: 1, grandma: 2 }))).toBeCloseTo(2.1);
  });
});

describe("computeClickPower", () => {
  test("base click power is 1", () => {
    expect(computeClickPower(owned())).toBe(1);
  });

  test("adds clickBonus per item owned", () => {
    expect(computeClickPower(owned({ "reinforced-finger": 3 }))).toBe(4);
    expect(
      computeClickPower(owned({ "reinforced-finger": 1, "iron-knuckles": 2 })),
    ).toBe(6);
  });
});

describe("getItemCost", () => {
  test("base cost when none owned", () => {
    expect(getItemCost(items[0], owned())).toBe(15);
    expect(getItemCost(items[2], owned())).toBe(100);
  });

  test("scales with owned count", () => {
    const own = owned({ cursor: 5 });
    expect(getItemCost(items[0], own)).toBe(30);
  });
});

describe("isUnlocked", () => {
  test("first item is always unlocked", () => {
    expect(isUnlocked(items[0], ctx(owned()))).toBe(true);
  });

  test("item requires owning at least one of its prerequisite", () => {
    const unlockContext = ctx(owned({ cursor: 1 }));
    expect(isUnlocked(items[1], unlockContext)).toBe(true);
  });

  test("locked when prerequisite not owned", () => {
    expect(isUnlocked(items[1], ctx(owned()))).toBe(false);
  });

  test("chain: each item unlocks after buying previous", () => {
    expect(isUnlocked(items[0], ctx(owned()))).toBe(true);
    expect(isUnlocked(items[1], ctx(owned()))).toBe(false);

    const afterCursor = ctx(owned({ cursor: 1 }));
    expect(isUnlocked(items[1], afterCursor)).toBe(true);
    expect(isUnlocked(items[2], afterCursor)).toBe(false);

    const afterReinforced = ctx(owned({ cursor: 1, "reinforced-finger": 1 }));
    expect(isUnlocked(items[2], afterReinforced)).toBe(true);
    expect(isUnlocked(items[3], afterReinforced)).toBe(false);
  });
});

describe("tryBuyItem", () => {
  test("fails when locked", () => {
    const result = tryBuyItem(items[1], ctx(owned(), 9999));
    expect(result.success).toBe(false);
  });

  test("fails when not enough cookies", () => {
    const result = tryBuyItem(items[0], ctx(owned(), 10));
    expect(result.success).toBe(false);
  });

  test("deducts cost and increments owned", () => {
    const result = tryBuyItem(items[0], ctx(owned(), 100));
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.ctx.cookies).toBe(85);
      expect(result.ctx.itemsOwned.cursor).toBe(1);
    }
  });

  test("cost scales after buying", () => {
    const r1 = tryBuyItem(items[0], ctx(owned(), 100));
    expect(r1.success).toBe(true);
    if (r1.success) {
      const r2 = tryBuyItem(items[0], ctx(r1.ctx.itemsOwned, r1.ctx.cookies));
      expect(r2.success).toBe(true);
      if (r2.success) {
        expect(r2.ctx.itemsOwned.cursor).toBe(2);
        expect(r2.ctx.cookies).toBe(68);
      }
    }
  });
});

describe("tick", () => {
  test("adds cps * delta to cookies and totalCookies", () => {
    const result = tick(ctx(owned({ grandma: 1 }), 0, 0), 0.5);
    expect(result.cookies).toBeCloseTo(0.5);
    expect(result.totalCookies).toBeCloseTo(0.5);
  });

  test("clamps delta to 1 second", () => {
    const result = tick(ctx(owned({ grandma: 1 }), 0), 60);
    expect(result.cookies).toBeCloseTo(1);
  });
});

describe("initialItemsOwned", () => {
  test("returns all zeros for every item", () => {
    const map = initialItemsOwned();
    for (const item of items) {
      expect(map[item.id]).toBe(0);
    }
  });
});
