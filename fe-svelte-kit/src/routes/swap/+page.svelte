<script>
	import { debounce } from 'lodash';
	import { form, field } from 'svelte-forms';
	import { required } from 'svelte-forms/validators';
	import { getNotificationsContext } from 'svelte-notifications';
	import { myHoldings, load as loadHoldings } from '../../store/myHoldings';
	import { provider } from '../../stores';
	import {
		AmountInput,
		ActionButton,
		Title,
		Swap,
		ButtonGroupSelect,
		Table,
		Row
	} from '../../components';
	import { getSwapToken1Estimate, getSwapToken2Estimate, swapToken1 } from '../../contract';
	import { watchSendTx } from '../../utils';

	export let data;

	const { contractData, poolDetail } = data;
	const token1Amount = field('token1Amount', undefined, [required()]);
	const token2Amount = field('token2Amount', undefined, [required()]);
	const myForm = form(token1Amount, token2Amount);
	const { addNotification } = getNotificationsContext();

	$: token1Balance = $myHoldings?.token1Amount;
	$: token2Balance = $myHoldings?.token2Amount;

	let feeAmount = undefined;
	$: minAmount =
		fromTo[1] == 'Token2'
			? Math.floor(((100 - slippage) * $token2Amount.value) / 100)
			: Math.floor(((100 - slippage) * $token1Amount.value) / 100);
	let slippage = 1;
	let fromTo = ['Token1', 'Token2'];

	async function handleProvide() {
		const txHash = await swapToken1({
			amount: $token1Amount.value,
			minAmount: minAmount,
			provider: $provider,
			...contractData
		});

		watchSendTx({
			txHash,
			contractData: contractData,
			onSuccess: () => {
				loadHoldings($provider, contractData);
				token1Amount.reset();
				token2Amount.reset();
				feeAmount = undefined;
			},
			addNotification: addNotification
		});
	}

	async function token1Estimate() {
		if (!$provider || $token1Amount.value <= 0 || !$token1Amount.value) {
			feeAmount = '...';
			await token2Amount.reset();
			return;
		}

		if ($token1Amount.value > token1Balance) {
			await token1Amount.set(token1Balance);
		}

		const { estimatedToken2Amount, feeAmount: _feeAmount } = await getSwapToken1Estimate({
			token1Amount: $token1Amount.value,
			...contractData
		});

		feeAmount = _feeAmount;
		await token2Amount.set(estimatedToken2Amount);
	}

	async function token2Estimate() {
		if (!$provider || $token2Amount.value <= 0 || !$token2Amount.value) {
			await token1Amount.reset();
			return;
		}

		if ($token2Amount.value > token2Balance) {
			await token2Amount.set(token2Balance);
		}

		const { estimatedToken1Amount, feeAmount: _feeAmount } = await getSwapToken2Estimate({
			token2Amount: $token2Amount.value,
			...contractData
		});

		feeAmount = _feeAmount;
		await token1Amount.set(estimatedToken1Amount);

		minAmount =
			fromTo[1] == 'Token2'
				? (100 - slippage) * $token2Amount.value
				: (100 - slippage) * $token1Amount.value;
	}
</script>

<div class="flex flex-col space-y-8 justify-items-center">
	<div>
		<Title>Swap</Title>
	</div>
	<Swap>
		<div slot="from" style="margin-top: .5rem !important;">
			<AmountInput
				bind:value={$token1Amount.value}
				onTyping={debounce(token1Estimate, 500)}
				label="Token1"
				currencyName="Balance: {token1Balance}"
			/>
		</div>
		<div slot="to" style="margin-top: .5rem !important;">
			<AmountInput
				bind:value={$token2Amount.value}
				onTyping={debounce(token2Estimate, 500)}
				label="Token2"
				currencyName="Balance: {token2Balance}"
			/>
		</div>
	</Swap>
	<div class="text-center">
		<label class="block text-sm font-medium text-gray-700">Slippage tolerance</label>
		<ButtonGroupSelect items={[0.5, 1, 2, 5]} bind:selected={slippage} let:item>
			{item}%
		</ButtonGroupSelect>
	</div>
	<Table>
		<Row title="Trading fee ({poolDetail.fee}%)">
			{feeAmount} Token1
		</Row>
		<Row title="Minimum {fromTo[1]} you receive">
			{minAmount}
		</Row>
	</Table>
	<div class="text-center">
		<ActionButton
			label="Provide"
			actionMethod={handleProvide}
			disabled={!$myForm.valid}
			{provider}
		/>
	</div>
</div>
