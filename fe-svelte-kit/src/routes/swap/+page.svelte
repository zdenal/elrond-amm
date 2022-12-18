<script>
	import { debounce } from 'lodash';
	import { form, field } from 'svelte-forms';
	import { required } from 'svelte-forms/validators';
	import { getNotificationsContext } from 'svelte-notifications';
	import { myHoldings, load as loadHoldings } from '../../store/myHoldings';
	import { provider } from '../../stores';
	import { TOKEN1, TOKEN2, TOKEN1_TICKER, TOKEN2_TICKER } from '../../constants.js';
	import {
		AmountInput,
		ActionButton,
		Title,
		Swap,
		ButtonGroupSelect,
		Table,
		Row
	} from '../../components';
	import {
		getSwapToken1Estimate,
		getSwapToken2Estimate,
		swapToken1,
		swapToken2
	} from '../../contract';
	import { watchSendTx, present, toWei, feeInPerc } from '../../utils';

	export let data;

	const { contractData, poolDetail } = data;
	const token1Amount = field('token1Amount', undefined, [required()]);
	const token2Amount = field('token2Amount', undefined, [required()]);
	const myForm = form(token1Amount, token2Amount);
	const { addNotification } = getNotificationsContext();

	$: token1Balance = present($myHoldings?.token1Amount);
	$: token2Balance = present($myHoldings?.token2Amount);
	$: fromTo = [TOKEN1, TOKEN2];

	let feeAmount = undefined;
	$: minAmount =
		fromTo[1] == TOKEN2
			? Math.floor(((100 - slippage) * toWei($token2Amount.value)) / 100)
			: Math.floor(((100 - slippage) * toWei($token1Amount.value)) / 100);
	let slippage = 1;

	async function executeSwap() {
		const method = fromTo[0] == TOKEN1 ? swapToken1 : swapToken2;
		const amount = fromTo[0] == TOKEN1 ? $token1Amount.value : $token2Amount.value;
		const txHash = await method({
			amount: toWei(amount),
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

		await token1Amount.reset();
		await token2Amount.reset();
	}

	async function token1Estimate() {
		if (!$provider || parseFloat($token1Amount.value) <= 0 || !$token1Amount.value) {
			feeAmount = '...';
			await token2Amount.reset();
			return;
		}

		if (parseFloat($token1Amount.value) > parseFloat(token1Balance)) {
			await token1Amount.set(token1Balance);
		}

		const { estimatedToken2Amount, feeAmount: _feeAmount } = await getSwapToken1Estimate({
			token1Amount: toWei($token1Amount.value),
			...contractData
		});

		feeAmount = _feeAmount;
		await token2Amount.set(present(estimatedToken2Amount));
	}

	async function token2Estimate() {
		if (!$provider || parseFloat($token2Amount.value) <= 0 || !$token2Amount.value) {
			await token1Amount.reset();
			return;
		}

		if (parseFloat($token2Amount.value) > parseFloat(token2Balance)) {
			await token2Amount.set(token2Balance);
		}

		const { estimatedToken1Amount, feeAmount: _feeAmount } = await getSwapToken2Estimate({
			token2Amount: toWei($token2Amount.value),
			...contractData
		});

		feeAmount = _feeAmount;
		await token1Amount.set(present(estimatedToken1Amount));
	}

	function handleSwap() {
		fromTo = fromTo.reverse();
		fromTo[0] == TOKEN1 ? token1Estimate() : token2Estimate();
	}
</script>

<div class="flex flex-col space-y-8 justify-items-center">
	<div>
		<Title>Swap</Title>
	</div>
	<Swap on:swap={handleSwap}>
		<div slot="from" style="margin-top: .5rem !important;">
			<AmountInput
				bind:value={$token1Amount.value}
				onTyping={debounce(token1Estimate, 500)}
				label="Amount of {TOKEN1}"
				currencyTicker={TOKEN1_TICKER}
				currencyName="Balance: {token1Balance}"
			/>
		</div>
		<div slot="to" style="margin-top: .5rem !important;">
			<AmountInput
				bind:value={$token2Amount.value}
				onTyping={debounce(token2Estimate, 500)}
				label="Amount of {TOKEN2}"
				currencyTicker={TOKEN2_TICKER}
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
		<Row title="Trading fee ({feeInPerc(poolDetail.fee)}%) {TOKEN1_TICKER}">
			{present(feeAmount)}
		</Row>
		<Row title="Minimum {fromTo[1]} you receive">
			{present(minAmount)}
		</Row>
	</Table>
	<div class="text-center">
		<ActionButton label="Swap" actionMethod={executeSwap} disabled={!$myForm.valid} {provider} />
	</div>
</div>
