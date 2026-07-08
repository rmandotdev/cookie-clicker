import { itemCost } from "./helpers";
import { items } from "./items";

const SAVE_KEY = "cookie-clicker-save";

function createGameState() {
  let cookies = $state(0);
  let totalCookies = $state(0);
  let itemsOwned = $state(items.map(() => 0));

  const cps = $derived(
    items.reduce((sum, item, i) => sum + item.cps * itemsOwned[i], 0),
  );

  const clickPower = $derived(
    items.reduce((sum, item, i) => sum + item.clickBonus * itemsOwned[i], 0) +
      1,
  );

  function click() {
    cookies += clickPower;
    totalCookies += clickPower;
  }

  function getItemCost(index: number): number {
    return itemCost(items[index].baseCost, itemsOwned[index]);
  }

  function buyItem(index: number): boolean {
    const cost = getItemCost(index);
    if (cookies >= cost) {
      cookies -= cost;
      itemsOwned[index] += 1;
      return true;
    }
    return false;
  }

  function tick(deltaSeconds: number) {
    const clamped = Math.min(deltaSeconds, 1);
    const gained = cps * clamped;
    cookies += gained;
    totalCookies += gained;
  }

  function save() {
    const state = {
      cookies,
      totalCookies,
      itemsOwned,
      timestamp: Date.now(),
    };
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    } catch {
      // storage full or unavailable
    }
  }

  function load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return;

      const state = JSON.parse(raw);
      cookies = state.cookies ?? 0;
      totalCookies = state.totalCookies ?? 0;
      const savedOwned = state.itemsOwned;
      itemsOwned = savedOwned
        ? items.map((_, i) => savedOwned[i] ?? 0)
        : items.map(() => 0);

      const elapsed = (Date.now() - (state.timestamp ?? Date.now())) / 1000;
      const offlineGain = cps * Math.min(elapsed, 3_600);
      cookies += offlineGain;
      totalCookies += offlineGain;
    } catch {
      // corrupt save
    }
  }

  function reset() {
    cookies = 0;
    totalCookies = 0;
    itemsOwned = items.map(() => 0);
    try {
      localStorage.removeItem(SAVE_KEY);
    } catch {
      // ignore
    }
  }

  return {
    get cookies() {
      return cookies;
    },
    get totalCookies() {
      return totalCookies;
    },
    get itemsOwned() {
      return itemsOwned;
    },
    get cps() {
      return cps;
    },
    get clickPower() {
      return clickPower;
    },
    click,
    getItemCost,
    buyItem,
    tick,
    save,
    load,
    reset,
  };
}

export const game = createGameState();
