<script>
	import { form, field } from 'svelte-forms';
	import { required } from 'svelte-forms/validators';
	import { TransactionWatcher, TransactionHash } from '@elrondnetwork/erdjs';
	import { getNotificationsContext } from 'svelte-notifications';
	import { openModal } from 'svelte-modals';

	import { faucet } from '../../contract';
	import { provider, contractData } from '../../stores';
	import { myHoldings, load as loadHoldings } from '../../store/myHoldings';

	import { AmountInput, ActionButton, WalletConnect, Title } from '../../components';
	import { watchSendTx, present, toWei } from '../../utils';
	import { TOKEN1, TOKEN2, TOKEN1_TICKER, TOKEN2_TICKER } from '../../constants.js';

	export let data;

	const { addNotification } = getNotificationsContext();

	const token1Amount = field('token1Amount', 0, [required()]);
	const token2Amount = field('token2Amount', 0, [required()]);
	const myForm = form(token1Amount, token2Amount);

	$: token1Balance = present($myHoldings?.token1Amount);
	$: token2Balance = present($myHoldings?.token2Amount);

	async function handleFaucet() {
		if ($provider) {
			const txHash = await faucet({
				token1Amount: toWei($token1Amount.value),
				token2Amount: toWei($token2Amount.value),
				provider: $provider,
				...data.contractData
			});

			watchSendTx({
				txHash,
				contractData: $contractData,
				onSuccess: () => {
					loadHoldings($provider, $contractData);
				},
				addNotification: addNotification
			});
		}

		await token1Amount.reset();
		await token2Amount.reset();
	}

	function handleConnect() {
		openModal(WalletConnect, { provider });
	}
</script>

<div class="flex flex-col space-y-8">
	<div>
		<Title>Faucet</Title>
	</div>
	<div>
		<AmountInput
			bind:value={$token1Amount.value}
			label="Amount of {TOKEN1}"
			currencyTicker={TOKEN1_TICKER}
			currencyName="Balance: {token1Balance}"
		/>
	</div>
	<div>
		<AmountInput
			bind:value={$token2Amount.value}
			label="Amount of {TOKEN2}"
			currencyTicker={TOKEN2_TICKER}
			currencyName="Balance: {token2Balance}"
		/>
	</div>
	<div class="flex flex-col items-center">
		<ActionButton label="Fund" actionMethod={handleFaucet} disabled={!$myForm.valid} {provider} />
	</div>
</div>
