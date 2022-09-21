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
	import { watchSendTx } from '../../utils';

	export let data;

	const token1Amount = field('token1Amount', undefined, [required()]);
	const token2Amount = field('token2Amount', undefined, [required()]);
	const myForm = form(token1Amount, token2Amount);
	const { addNotification } = getNotificationsContext();

	async function handleProvide() {
		const txHash = await provide({
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

	async function getToken2Estimation() {
		const amount = $token1Amount.value;
		if (amount) {
			const token2EstimateAmount = await getToken2ProvideEstimate({
				token1Amount: amount,
				provider: $provider,
				...data.contractData
			});
			token2Amount.set(token2EstimateAmount);
		} else {
			token2Amount.set(0);
		}
	}

	async function getToken1Estimation() {
		const amount = $token2Amount.value;
		if (amount) {
			const token1EstimateAmount = await getToken1ProvideEstimate({
				token2Amount: amount,
				provider: $provider,
				...data.contractData
			});
			token1Amount.set(token1EstimateAmount);
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
			label="Amount of Token1"
			onTyping={handleToken1Typing}
			currencyName="Balance: {$myHoldings ? $myHoldings.token1Amount : '...'}"
		/>
	</div>
	<div>
		<AmountInput
			disabled={!$provider}
			bind:value={$token2Amount.value}
			label="Amount of Token2"
			onTyping={handleToken2Typing}
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
