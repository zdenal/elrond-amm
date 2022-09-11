<script>
  import {closeModal} from 'svelte-modals'
  import { ExtensionProvider } from "@elrondnetwork/erdjs-extension-provider";

  export let isOpen;
  export let provider;

  async function useDeFiWallet() {
    const extProvider = ExtensionProvider.getInstance();
    await extProvider.init();
    await extProvider.login();

    /*console.log("Account:", extProvider.account);*/
    provider.set(extProvider);
    closeModal();
  }
</script>

{#if isOpen}
  <div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

    <div class="fixed inset-0 z-10 overflow-y-auto">
      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div class="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
          <div>
            <div class="mt-3 text-center sm:mt-5">
              <h3 class="text-lg font-medium leading-6 text-gray-900" id="modal-title">
                Connect to a wallet
              </h3>
              <div class="mt-2 flex flex-col space-y-4">
                <p class="text-sm text-gray-500">Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur amet labore.</p>
                <button on:click={useDeFiWallet} type="button" class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                  Maiar DeFi Wallet
                </button>
              </div>
            </div>
          </div>
          <div class="mt-5 sm:mt-6 text-center">
            <button on:click={closeModal} type="button" class="w-1/2 justify-center inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}
