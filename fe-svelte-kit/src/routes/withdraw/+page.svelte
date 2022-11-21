<script>
	import { form, field } from 'svelte-forms';
	import { required, min } from 'svelte-forms/validators';
	import { TransactionWatcher, TransactionHash } from '@elrondnetwork/erdjs';
	import { debounce } from 'lodash';
	import { getNotificationsContext } from 'svelte-notifications';

	import { getWithdrawEstimate, withdraw } from '../../contract';
	import { Title, ActionButton, AmountInput, Table, Row } from '../../components';
	import { provider, contractData } from '../../stores';
	import { myHoldings, load as loadHoldings } from '../../store/myHoldings';
	import { present, watchSendTx } from '../../utils';

	export let data;

	const shareAmount = field('shareAmount', undefined, [required(), min(1)]);
	const myForm = form(shareAmount);

	let estimatedToken1Amount = '...';
	let estimatedToken2Amount = '...';

	$: myBalance = $myHoldings ? present($myHoldings.sharesAmount) : undefined;
	const { addNotification } = getNotificationsContext();

	async function handleWithdraw() {
		const txHash = await withdraw({
			shareAmount: $shareAmount.value,
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

	async function getEstimation() {
		if ($shareAmount.value > myBalance) {
			await shareAmount.set(myBalance);
		}

		const estimate = await getWithdrawEstimate({
			shareAmount: $shareAmount.value,
			...data.contractData
		});

		estimatedToken1Amount = estimate.token1Amount;
		estimatedToken2Amount = estimate.token2Amount;
	}

	const handleTyping = debounce(getEstimation, 500);
</script>

<div class="flex flex-col space-y-8">
	<div>
		<Title>Withdraw</Title>
	</div>
	<div>
		<AmountInput
			bind:value={$shareAmount.value}
			label="Amount of Shares"
			onTyping={handleTyping}
			currencyName="Balance: {myBalance || '...'}"
		/>
	</div>
	<div class="flex flex-col items-center">
		<ActionButton
			label="Withdraw"
			actionMethod={handleWithdraw}
			disabled={!$myForm.valid}
			{provider}
		/>
	</div>
	<div>
		<Table>
			<Row title="Amount of Token1">{present(estimatedToken1Amount)}</Row>
			<Row title="Amount of Token2">{present(estimatedToken2Amount)}</Row>
		</Table>
	</div>
</div>
