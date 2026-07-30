<script lang="ts">
import "./layout.css";
import favicon from "$lib/assets/favicon.svg";

let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  <meta
    name="description"
    content="A fun cookie-clicking incremental game built with Svelte"
  />
</svelte:head>
{@render children()}
