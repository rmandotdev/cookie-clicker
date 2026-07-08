import {
  computeClickPower,
  computeCps,
  getItemCost,
  initialItemsOwned,
  isUnlocked,
  tryBuyItem,
} from "./game";
import { items } from "./items";

const SAVE_KEY = "cookie-clicker-save";

function createGameState() {
  let cookies = $state(0);
  let totalCookies = $state(0);
  let itemsOwned = $state<Record<string, number>>(initialItemsOwned());

  const cps = $derived(computeCps(itemsOwned));
  const clickPower = $derived(computeClickPower(itemsOwned));

  function click() {
    cookies += clickPower;
    totalCookies += clickPower;
  }

  function buyItem(itemId: string): boolean {
    const item = items.find((i) => i.id === itemId);
    if (!item) return false;

    const result = tryBuyItem(item, { itemsOwned, cookies, totalCookies });
    if (!result.success) return false;

    cookies = result.ctx.cookies;
    totalCookies = result.ctx.totalCookies;
    itemsOwned = result.ctx.itemsOwned;
    return true;
  }

  function checkUnlocked(itemId: string): boolean {
    const item = items.find((i) => i.id === itemId);
    if (!item) return false;
    return isUnlocked(item, { itemsOwned, cookies, totalCookies });
  }

  function itemCost(itemId: string): number {
    const item = items.find((i) => i.id === itemId);
    if (!item) return 0;
    return getItemCost(item, itemsOwned);
  }

  function tickGame(deltaSeconds: number) {
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
      itemsOwned = { ...initialItemsOwned(), ...state.itemsOwned };

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
    itemsOwned = initialItemsOwned();
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
    buyItem,
    checkUnlocked,
    itemCost,
    tick: tickGame,
    save,
    load,
    reset,
  };
}

export const game = createGameState();
