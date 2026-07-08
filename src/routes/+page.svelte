<script lang="ts">
import { onMount } from "svelte";
import Cookie from "$lib/components/Cookie.svelte";
import Shop from "$lib/components/Shop.svelte";
import Stats from "$lib/components/Stats.svelte";
import { game } from "$lib/game.svelte";

onMount(() => {
  game.load();

  let lastTime = performance.now();

  const gameLoop = setInterval(() => {
    const now = performance.now();
    const delta = (now - lastTime) / 1000;
    lastTime = now;
    game.tick(delta);
  }, 1000 / 60);

  const saveLoop = setInterval(() => game.save(), 10_000);

  return () => {
    clearInterval(gameLoop);
    clearInterval(saveLoop);
  };
});
</script>

<div class="game">
  <header class="header">
    <Stats />
  </header>

  <main class="main">
    <section class="cookie-section">
      <Cookie />
    </section>

    <aside class="shop-section">
      <Shop />
    </aside>
  </main>
</div>

<style>
.game {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #09090b;
  color: #e4e4e7;
  font-family: system-ui, -apple-system, sans-serif;
}

.header {
  padding: 1.5rem 1rem 0.5rem;
  display: flex;
  justify-content: center;
}

.main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3rem;
  padding: 1rem 2rem;
}

.cookie-section {
  display: flex;
  align-items: center;
  justify-content: center;
}

.shop-section {
  flex-shrink: 0;
}
</style>
