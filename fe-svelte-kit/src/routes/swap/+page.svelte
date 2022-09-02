<script>
  import AmountInput from "../../components/AmountInput.svelte";
</script>

<div class="flex flex-col space-y-8 justify-items-center">
  <div>
    <h3 class="text-2xl leading-6 font-medium text-gray-900">Swap</h3>
  </div>
  <div>
    <AmountInput label="From: Token1" currencyName="Balance: 1000" />
  </div>
  <div class="text-center">
    <button type="button" class="inline-flex items-center rounded-full border border-transparent p-3 text-white shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
      <svg class="text-gray-500"  width="30" height="30" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <path d="M3 9l4-4l4 4m-4 -4v14" />  <path d="M21 15l-4 4l-4-4m4 4v-14" /></svg>
    </button>
  </div>
  <div>
    <AmountInput label="To: Token2" currencyName="Balance: 1000" />
  </div>
  <div class="text-center">
    <label class="block text-sm font-medium text-gray-700">Slippage tolerance</label>
    <span class="isolate inline-flex rounded-md shadow-sm">
      <button type="button" class="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
        0.5%
      </button>
      <button type="button" class="relative -ml-px inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
        1%
      </button>
      <button type="button" class="relative -ml-px inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
        2%
      </button>
      <button type="button" class="relative -ml-px inline-flex items-center rounded-r-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
        5%
      </button>
    </span>
  </div>
  <div class="mt-5 border-t border-b border-gray-200 mb-6">
    <dl class="sm:divide-y sm:divide-gray-200">
      <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
        <dt class="text-sm font-medium text-gray-500">Trading fee(1%)</dt>
        <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">1 Token1</dd>
      </div>
      <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
        <dt class="text-sm font-medium text-gray-500">Minimum Token2 you receive</dt>
        <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">1232.23</dd>
      </div>
    </dl>
  </div>
  <div class="text-center">
    <button type="button" class="w-1/2 justify-center inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
      Provide
    </button>
  </div>
</div>

