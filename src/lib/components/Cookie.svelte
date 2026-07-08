<script lang="ts">
import { game } from "$lib/game.svelte";

let holding = $state(false);

function handleClick() {
  game.click();
}

function handleKeyDown(e: KeyboardEvent) {
  if (e.repeat) {
    e.preventDefault();
    holding = true;
  }
}

function handleKeyUp() {
  holding = false;
}
</script>

<div class="cookie-wrapper">
  <button
    type="button"
    class="cookie-btn"
    onclick={handleClick}
    onkeydown={handleKeyDown}
    onkeyup={handleKeyUp}
    aria-label="Click to earn a cookie"
  >
    🍪
  </button>

  {#if holding}
    <div class="tooltip">Nice try! Holding Enter won't work here 😉</div>
  {/if}
</div>

<style>
.cookie-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

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

.tooltip {
  position: absolute;
  bottom: -2.5rem;
  white-space: nowrap;
  background: #27272a;
  color: #fef08a;
  padding: 0.4rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  pointer-events: none;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
