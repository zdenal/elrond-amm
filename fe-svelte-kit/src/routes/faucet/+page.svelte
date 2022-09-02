<script>
  import AmountInput from "../../components/AmountInput.svelte";
</script>

<div class="flex flex-col space-y-8">
  <div>
    <h3 class="text-2xl leading-6 font-medium text-gray-900">Faucet</h3>
  </div>
  <div>
    <AmountInput label="Amount of Token1" currencyName="Token1" />
  </div>
  <div>
    <AmountInput label="Amount of Token2" currencyName="Token2" />
  </div>
  <div class="flex flex-col items-center">
    <button type="button" class="w-1/2 justify-center inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">Fund</button>
  </div>
</div>
