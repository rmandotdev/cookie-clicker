<script lang="ts">
import { game } from "$lib/game.svelte";
import { formatNumber } from "$lib/helpers";
</script>

<div class="stats">
  <div class="cookie-count">{formatNumber(game.cookies)} 🍪</div>
  <div class="cps">per second: {formatNumber(game.cps)}</div>
  <div class="cps">per click: {formatNumber(game.clickPower)}</div>
  <div class="total">total baked: {formatNumber(game.totalCookies)}</div>
</div>

<style>
.stats {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.cookie-count {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.1;
}

.cps {
  font-size: 1rem;
  color: #a1a1aa;
}

.total {
  font-size: 0.875rem;
  color: #71717a;
}
</style>
