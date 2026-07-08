<script lang="ts">
import { game } from "$lib/game.svelte";
import { formatNumber } from "$lib/helpers";
import { items } from "$lib/items";
</script>

<div class="shop-panel">
  <h2 class="shop-title">Shop</h2>
  <div class="shop-list">
    {#each items as item, i}
      {@const owned = game.itemsOwned[i]}
      {@const cost = game.getItemCost(i)}
      {@const affordable = game.cookies >= cost}
      <div class="shop-item" class:affordable>
        <span class="item-emoji">{item.emoji}</span>
        <div class="item-body">
          <div class="item-name">
            {item.name}
            <span class="item-count">[{owned}]</span>
          </div>
          <div class="item-cps">
            {item.clickBonus > 0 ? `+${item.clickBonus} per click` : `${formatNumber(item.cps)}/s each`}
          </div>
        </div>
        <button
          type="button"
          class="buy-btn"
          disabled={!affordable}
          onclick={() => game.buyItem(i)}
        >
          🍪 {formatNumber(cost)}
        </button>
      </div>
    {/each}
  </div>
</div>

<style>
.shop-panel {
  background: #18181b;
  border: 1px solid #27272a;
  border-radius: 0.75rem;
  padding: 1rem;
  width: 18rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.shop-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

.shop-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  overflow-y: auto;
  max-height: 70vh;
}

.shop-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem;
  border-radius: 0.5rem;
  background: #27272a;
  transition: background 0.15s;
}

.shop-item.affordable {
  background: #1e3a2f;
}

.item-emoji {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.item-body {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-weight: 500;
  font-size: 0.9rem;
  display: flex;
  align-items: baseline;
  gap: 0.35rem;
}

.item-count {
  color: #a1a1aa;
  font-weight: 400;
  font-size: 0.8rem;
}

.item-cps {
  font-size: 0.75rem;
  color: #71717a;
}

.buy-btn {
  flex-shrink: 0;
  padding: 0.375rem 0.625rem;
  border-radius: 0.375rem;
  border: 1px solid #3f3f46;
  background: #18181b;
  color: #e4e4e7;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.1s;
  white-space: nowrap;
}

.buy-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.buy-btn:not(:disabled):hover {
  background: #3f3f46;
}

.buy-btn:not(:disabled):active {
  background: #52525b;
}
</style>
