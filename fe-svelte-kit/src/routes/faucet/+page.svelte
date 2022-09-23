<script>
	import { form, field } from 'svelte-forms';
	import { required } from 'svelte-forms/validators';
	import { TransactionWatcher, TransactionHash } from '@elrondnetwork/erdjs';
	import { getNotificationsContext } from 'svelte-notifications';
	import { openModal } from 'svelte-modals';

	import { faucet } from '../../contract';
	import { provider, contractData } from '../../stores';
	import { load as loadHoldings } from '../../store/myHoldings';

	import { AmountInput, ActionButton, WalletConnect, Title } from '../../components';
	import { watchSendTx } from '../../utils';

	export let data;

	const { addNotification } = getNotificationsContext();

	const token1Amount = field('token1Amount', 50, [required()]);
	const token2Amount = field('token2Amount', 50, [required()]);
	const myForm = form(token1Amount, token2Amount);

	async function handleFaucet() {
		if ($provider) {
			const txHash = await faucet({
				token1Amount: $token1Amount.value,
				token2Amount: $token2Amount.value,
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
			label="Amount of Token1"
			currencyName="Token1"
			currencyTicker="₮1"
		/>
	</div>
	<div>
		<AmountInput
			bind:value={$token2Amount.value}
			label="Amount of Token2"
			currencyName="Token2"
			currencyTicker="₮2"
		/>
	</div>
	<div class="flex flex-col items-center">
		<ActionButton label="Fund" actionMethod={handleFaucet} disabled={!$myForm.valid} {provider} />
	</div>
</div>
