<script>
  /** @type {import('./$types').PageData} */
  export let data;
  import { Modals, closeModal, openModal } from 'svelte-modals'
  import { fade } from 'svelte/transition'

  import WalletConnect from "./../components/WalletConnect.svelte";

    function handleClick() {
        openModal(WalletConnect, { title: "Title of the Modal", message: "This is an alert using Svelte-Modal" })
    }
</script>

<Modals>
  <div
    slot="backdrop"
    class="backdrop"
    transition:fade
    on:click={closeModal}
  />
</Modals>

<Modals>
    <div slot="backdrop" on:click={closeModal}></div>
</Modals>

<div>
  <div class="mb-6">
    <div class="flex justify-between">
      <h3 class="text-2xl leading-6 font-medium text-gray-900">Account Information</h3>
      <button on:click={handleClick} type="button" class="justify-center inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-1 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
        Connect
      </button>
    </div>
    <p class="mt-1 max-w-2xl text-sm text-gray-500">xxxxx</p>
  </div>
  <div>
    <h3 class="text-lg leading-6 font-medium text-gray-900">Assets</h3>
  </div>
  <div class="mt-5 border-t border-gray-200 mb-6">
    <dl class="sm:divide-y sm:divide-gray-200">
      <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
        <dt class="text-sm font-medium text-gray-500">Amount of Token1</dt>
        <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">....</dd>
      </div>
      <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
        <dt class="text-sm font-medium text-gray-500">Amount of Token2</dt>
        <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">...</dd>
      </div>
      <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
        <dt class="text-sm font-medium text-gray-500">Amount of share</dt>
        <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">...</dd>
      </div>
    </dl>
  </div>
  <div>
    <h4 class="text-lg leading-6 font-medium text-gray-900">Pool Details</h4>
  </div>
  <div class="mt-5 border-t border-gray-200">
    <dl class="sm:divide-y sm:divide-gray-200">
      <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
        <dt class="text-sm font-medium text-gray-500">Total Token1</dt>
        <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{data.token1Total}</dd>
      </div>
      <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
        <dt class="text-sm font-medium text-gray-500">Total Token2</dt>
        <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{data.token2Total}</dd>
      </div>
      <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
        <dt class="text-sm font-medium text-gray-500">Total Share</dt>
        <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{data.sharesTotal}</dd>
      </div>
      <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
        <dt class="text-sm font-medium text-gray-500">Trading Fee</dt>
        <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{data.fee}%</dd>
      </div>
    </dl>
  </div>
</div>

<style>
  .backdrop {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    background: rgba(0,0,0,0.50)
  }
</style>
