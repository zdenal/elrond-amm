<script>
  import { form, field } from 'svelte-forms';
  import { required } from 'svelte-forms/validators';
  import { TransactionWatcher, TransactionHash } from '@elrondnetwork/erdjs';
  import { getNotificationsContext } from 'svelte-notifications';

  import { faucet } from '../../contract';
  import { provider, contractData } from '../../stores';
  import AmountInput from "../../components/AmountInput.svelte";
  import { load as loadHoldings } from '../../store/myHoldings';

  export let data;

  const { addNotification } = getNotificationsContext();

  const token1Amount = field('token1Amount', 50, [required()]);
  const token2Amount = field('token2Amount', 50, [required()]);
  const myForm = form(token1Amount, token2Amount);

  async function handleFaucet() {
    if($provider) {
      const txHash = await faucet({token1Amount: $token1Amount.value, token2Amount: $token2Amount.value, provider: $provider, ...data.contractData})
      addNotification({text: "Transaction send", position: "top-right", removeAfter: 2000})
      console.log("hash: ", txHash);
      let watcher = new TransactionWatcher($contractData.networkProvider);
      watcher.awaitCompleted({ getHash: () => new TransactionHash(txHash) }).then(res => {
        console.log("Tx watcher result", res);
        loadHoldings($provider, $contractData);
        addNotification({text: "Transaction success", position: "top-right", type: "success", removeAfter: 2000})
      });
    } else {
      console.warn('Provider not set');
    }
  }
</script>

<div class="flex flex-col space-y-8">
  <div>
    <h3 class="text-2xl leading-6 font-medium text-gray-900">Faucet</h3>
  </div>
  <div>
    <AmountInput bind:value={$token1Amount.value} label="Amount of Token1" currencyName="Token1" />
  </div>
  <div>
    <AmountInput bind:value={$token2Amount.value} label="Amount of Token2" currencyName="Token2" />
  </div>
  <div class="flex flex-col items-center">
    <button on:click={handleFaucet} disabled={!$myForm.valid} type="button" class="w-1/2 justify-center inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">Fund</button>
  </div>
</div>
