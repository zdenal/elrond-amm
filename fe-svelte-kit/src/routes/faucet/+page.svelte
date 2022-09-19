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
			addNotification({ text: 'Transaction send', position: 'top-right', removeAfter: 2000 });

			let watcher = new TransactionWatcher($contractData.networkProvider);
			watcher.awaitCompleted({ getHash: () => new TransactionHash(txHash) }).then((res) => {
				console.log('Tx watcher result', res);
				loadHoldings($provider, $contractData);
				addNotification({
					text: 'Transaction success',
					position: 'top-right',
					type: 'success',
					removeAfter: 2000
				});
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
		<AmountInput bind:value={$token1Amount.value} label="Amount of Token1" currencyName="Token1" />
	</div>
	<div>
		<AmountInput bind:value={$token2Amount.value} label="Amount of Token2" currencyName="Token2" />
	</div>
	<div class="flex flex-col items-center">
		<ActionButton label="Fund" actionMethod={handleFaucet} disabled={!$myForm.valid} {provider} />
	</div>
</div>
