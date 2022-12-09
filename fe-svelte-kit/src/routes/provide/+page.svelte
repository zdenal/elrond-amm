<script>
	import { debounce } from 'lodash';
	import { form, field } from 'svelte-forms';
	import { required } from 'svelte-forms/validators';
	import { TransactionWatcher, TransactionHash } from '@elrondnetwork/erdjs';
	import { getNotificationsContext } from 'svelte-notifications';
	import { myHoldings } from '../../store/myHoldings';
	import { provider, contractData } from '../../stores';
	import { AmountInput, ActionButton, Title } from '../../components';
	import { provide, getToken1ProvideEstimate, getToken2ProvideEstimate } from '../../contract';
	import { load as loadHoldings } from '../../store/myHoldings';
	import { watchSendTx, present, toWei } from '../../utils';
	import { TOKEN1, TOKEN2, TOKEN1_TICKER, TOKEN2_TICKER } from '../../constants.js';

	export let data;

	const token1Amount = field('token1Amount', undefined, [required()]);
	const token2Amount = field('token2Amount', undefined, [required()]);
	const myForm = form(token1Amount, token2Amount);
	const { addNotification } = getNotificationsContext();

	$: token1Balance = present($myHoldings?.token1Amount);
	$: token2Balance = present($myHoldings?.token2Amount);

	async function handleProvide() {
		console.log($token1Amount.value);
		console.log($token2Amount.value);
		const txHash = await provide({
			token1Amount: toWei($token1Amount.value),
			token2Amount: toWei($token2Amount.value),
			provider: $provider,
			...data.contractData
		});
		console.log(txHash);

		watchSendTx({
			txHash,
			contractData: $contractData,
			onSuccess: () => {
				loadHoldings($provider, $contractData);
			},
			addNotification: addNotification
		});
	}

	async function getToken2Estimation() {
		const amount = $token1Amount.value;
		if (amount) {
			const token2EstimateAmount = await getToken2ProvideEstimate({
				token1Amount: toWei(amount),
				provider: $provider,
				...data.contractData
			});
			token2Amount.set(present(token2EstimateAmount));
		} else {
			token2Amount.set(0);
		}
	}

	async function getToken1Estimation() {
		const amount = $token2Amount.value;
		if (amount) {
			const token1EstimateAmount = await getToken1ProvideEstimate({
				token2Amount: toWei(amount),
				provider: $provider,
				...data.contractData
			});
			token1Amount.set(present(token1EstimateAmount));
		} else {
			token1Amount.set(0);
		}
	}

	const handleToken1Typing = debounce(getToken2Estimation, 500);
	const handleToken2Typing = debounce(getToken1Estimation, 500);
</script>

<div class="flex flex-col space-y-8">
	<div>
		<Title>Provide</Title>
	</div>
	<div>
		<AmountInput
			disabled={!$provider}
			bind:value={$token1Amount.value}
			label="Amount of {TOKEN1}"
			currencyTicker={TOKEN1_TICKER}
			onTyping={handleToken1Typing}
			currencyName="Balance: {token1Balance}"
		/>
	</div>
	<div>
		<AmountInput
			disabled={!$provider}
			bind:value={$token2Amount.value}
			label="Amount of {TOKEN2}"
			currencyTicker={TOKEN2_TICKER}
			onTyping={handleToken2Typing}
			currencyName="Balance: {token2Balance}"
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
