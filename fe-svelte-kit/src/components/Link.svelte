<script>
  export let href;
  export let text;
  export let active;
</script>

{#if active}
  <a {href} class="text-gray-300 bg-gray-900 px-3 py-2 rounded-md text-sm font-medium">{text}</a>
{:else}
  <a {href} class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">{text}</a>
{/if}
