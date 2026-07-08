<script lang="ts">
import { game } from "$lib/game.svelte";
import {
  createParticle,
  PARTICLE_LIFETIME,
  type Particle,
} from "$lib/particles";

let holding = $state(false);

let particles: Particle[] = $state([]);
let wrapper: HTMLDivElement | null = $state(null);

function handleClick(e: MouseEvent) {
  game.click();

  if (!wrapper) return;

  const p = createParticle(e.clientX, e.clientY, wrapper);
  particles.push(p);

  setTimeout(() => {
    particles = particles.filter((q) => q.id !== p.id);
  }, PARTICLE_LIFETIME);
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

<div class="cookie-wrapper" bind:this={wrapper}>
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

  {#each particles as particle (particle.id)}
    <div
      class="particle"
      style="--sx: {particle.x}px; --sy: {particle.y}px; animation-delay: {particle.delay}s;"
    >
      🍪
    </div>
  {/each}

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

.particle {
  position: absolute;
  top: 0;
  left: 0;
  font-size: 1.25rem;
  pointer-events: none;
  z-index: 10;
  opacity: 0;
  animation: cookiePop 0.6s ease-out both;
}

@keyframes cookiePop {
  0% {
    transform: translate(calc(var(--sx) - 50%), calc(var(--sy) - 50%))
      translateY(0) scale(0.5);
    opacity: 1;
  }
  35% {
    transform: translate(calc(var(--sx) - 50%), calc(var(--sy) - 50%))
      translateY(-50px) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(calc(var(--sx) - 50%), calc(var(--sy) - 50%))
      translateY(50px) scale(0.3);
    opacity: 0;
  }
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
