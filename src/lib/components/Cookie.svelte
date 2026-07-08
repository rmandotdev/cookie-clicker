<script lang="ts">
import { game } from "$lib/game.svelte";

function handleClick() {
  game.click();
}
</script>

<button
  type="button"
  class="cookie-btn"
  onclick={handleClick}
  aria-label="Click to earn a cookie"
>
  🍪
</button>

<style>
.cookie-btn {
  font-size: clamp(120px, 30vw, 240px);
  cursor: pointer;
  background: none;
  border: none;
  line-height: 1;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  transform: scale(1);
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.cookie-btn:hover {
  transform: scale(1.04);
}

.cookie-btn:active {
  transform: scale(0.95);
  transition: transform 0.05s;
}
</style>
