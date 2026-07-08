export interface Item {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  cps: number;
  clickBonus: number;
  emoji: string;
}

export const items: Item[] = [
  {
    id: "reinforced-finger",
    name: "Reinforced Finger",
    description: "+1 cookie per click.",
    baseCost: 50,
    cps: 0,
    clickBonus: 1,
    emoji: "🖐️",
  },
  {
    id: "cursor",
    name: "Cursor",
    description: "Autoclicks once every 10 seconds.",
    baseCost: 15,
    cps: 0.1,
    clickBonus: 0,
    emoji: "🖱️",
  },
  {
    id: "grandma",
    name: "Grandma",
    description: "A nice grandma to bake more cookies.",
    baseCost: 100,
    cps: 1,
    clickBonus: 0,
    emoji: "👵",
  },
  {
    id: "farm",
    name: "Farm",
    description: "Grows cookie plants from cookie seeds.",
    baseCost: 1_100,
    cps: 8,
    clickBonus: 0,
    emoji: "🌾",
  },
  {
    id: "mine",
    name: "Mine",
    description: "Mines out cookie dough and chocolate chips.",
    baseCost: 12_000,
    cps: 47,
    clickBonus: 0,
    emoji: "⛏️",
  },
  {
    id: "factory",
    name: "Factory",
    description: "Produces large quantities of cookies.",
    baseCost: 130_000,
    cps: 260,
    clickBonus: 0,
    emoji: "🏭",
  },
];
