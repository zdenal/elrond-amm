<script>
	import { form, field } from 'svelte-forms';
	import { required } from 'svelte-forms/validators';
	import { TransactionWatcher, TransactionHash } from '@elrondnetwork/erdjs';
	import { getNotificationsContext } from 'svelte-notifications';
	import { myHoldings } from '../../store/myHoldings';
	import { provider, contractData } from '../../stores';
	import { AmountInput, ActionButton, Title } from '../../components';
	import { provide } from '../../contract';
	import { load as loadHoldings } from '../../store/myHoldings';

	export let data;

	const { addNotification } = getNotificationsContext();
	const token1Amount = field('token1Amount', 50, [required()]);
	const token2Amount = field('token2Amount', 50, [required()]);
	const myForm = form(token1Amount, token2Amount);

	async function handleProvide() {
		const txHash = await provide({
			token1Amount: $token1Amount.value,
			token2Amount: $token2Amount.value,
			provider: $provider,
			...data.contractData
		});
		addNotification({ text: 'Transaction send', position: 'top-right', removeAfter: 2000 });

		let watcher = new TransactionWatcher($contractData.networkProvider);
		watcher.awaitCompleted({ getHash: () => new TransactionHash(txHash) }).then((res) => {
			console.log('Tx watcher result', res);
			if (res.contractResults.items.length > 0) {
				loadHoldings($provider, $contractData);
				addNotification({
					text: 'Transaction success',
					position: 'top-right',
					type: 'success',
					removeAfter: 2000
				});
			} else {
				addNotification({
					text: 'Transaction failed',
					position: 'top-right',
					type: 'error',
					removeAfter: 2000
				});
			}
		});
	}
</script>

<div class="flex flex-col space-y-8">
	<div>
		<Title>Provide</Title>
	</div>
	<div>
		<AmountInput
			bind:value={$token1Amount.value}
			label="Amount of Token1"
			currencyName="Balance: {$myHoldings ? $myHoldings.token1Amount : '...'}"
		/>
	</div>
	<div>
		<AmountInput
			bind:value={$token2Amount.value}
			label="Amount of Token2"
			currencyName="Balance: {$myHoldings ? $myHoldings.token2Amount : '...'}"
		/>
	</div>
	<div class="flex flex-col items-center">
		<ActionButton
			label="Provide"
			actionMethod={handleProvide}
			disabled={!$myForm.valid}
			{provider}
		/>
	</div>
</div>
