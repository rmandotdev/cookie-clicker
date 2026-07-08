import { itemCost } from "./helpers";
import { type Item, items, type UnlockContext } from "./items";

export function computeCps(itemsOwned: Record<string, number>): number {
  let total = 0;
  for (const item of items) {
    total += item.cps * (itemsOwned[item.id] ?? 0);
  }
  return total;
}

export function computeClickPower(itemsOwned: Record<string, number>): number {
  let total = 1;
  for (const item of items) {
    total += item.clickBonus * (itemsOwned[item.id] ?? 0);
  }
  return total;
}

export function getItemCost(
  item: Item,
  itemsOwned: Record<string, number>,
): number {
  return itemCost(item.baseCost, itemsOwned[item.id] ?? 0);
}

export function isUnlocked(item: Item, ctx: UnlockContext): boolean {
  if (!item.requires) return true;
  return item.requires(ctx);
}

export function tryBuyItem(
  item: Item,
  ctx: UnlockContext,
):
  | { success: false; ctx: UnlockContext }
  | { success: true; ctx: UnlockContext } {
  if (!isUnlocked(item, ctx)) return { success: false, ctx };

  const cost = getItemCost(item, ctx.itemsOwned);
  if (ctx.cookies < cost) return { success: false, ctx };

  return {
    success: true,
    ctx: {
      ...ctx,
      cookies: ctx.cookies - cost,
      totalCookies: ctx.totalCookies,
      itemsOwned: {
        ...ctx.itemsOwned,
        [item.id]: (ctx.itemsOwned[item.id] ?? 0) + 1,
      },
    },
  };
}

export function tick(ctx: UnlockContext, deltaSeconds: number): UnlockContext {
  const clamped = Math.min(deltaSeconds, 1);
  const gained = computeCps(ctx.itemsOwned) * clamped;
  return {
    ...ctx,
    cookies: ctx.cookies + gained,
    totalCookies: ctx.totalCookies + gained,
  };
}

export function initialItemsOwned(): Record<string, number> {
  return Object.fromEntries(items.map((item) => [item.id, 0]));
}

export function gatherUnlockContext(
  itemsOwned: Record<string, number>,
  cookies: number,
  totalCookies: number,
): UnlockContext {
  return { itemsOwned, cookies, totalCookies };
}
