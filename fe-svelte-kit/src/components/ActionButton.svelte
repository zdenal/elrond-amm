<script>
  import { openModal } from 'svelte-modals'
  import WalletConnect from "./WalletConnect.svelte";

  export let actionMethod;
  export let disabled;
  export let provider;
  export let label;

  function handleConnect() {
    console.log(provider);
    openModal(WalletConnect, {provider})
  }
</script>


{#if $provider}
  <button on:click={actionMethod} {disabled} type="button" class="w-1/2 justify-center inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">{label}</button>
{:else}
  <button on:click={handleConnect} type="button" class="w-1/2 justify-center inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">Connect</button>
{/if}
