<script>
	import { debounce } from 'lodash';
	import { form, field } from 'svelte-forms';
	import { required } from 'svelte-forms/validators';
	import { getNotificationsContext } from 'svelte-notifications';
	import { myHoldings, load as loadHoldings } from '../../store/myHoldings';
	import { provider } from '../../stores';
	import { AmountInput, ActionButton, Title, Swap } from '../../components';
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

	let feeAmount = '...';

	async function handleProvide() {
		const txHash = await swapToken1({
			amount: $token1Amount.value,
			/*minAmount: $token2Amount.value,*/
			minAmount: 1,
			provider: $provider,
			...contractData
		});

		watchSendTx({
			txHash,
			contractData: contractData,
			onSuccess: () => {
				loadHoldings($provider, contractData);
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
		<span class="isolate inline-flex rounded-md shadow-sm">
			<button
				type="button"
				class="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
			>
				0.5%
			</button>
			<button
				type="button"
				class="relative -ml-px inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
			>
				1%
			</button>
			<button
				type="button"
				class="relative -ml-px inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
			>
				2%
			</button>
			<button
				type="button"
				class="relative -ml-px inline-flex items-center rounded-r-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
			>
				5%
			</button>
		</span>
	</div>
	<div class="mt-5 border-t border-b border-gray-200 mb-6">
		<dl class="sm:divide-y sm:divide-gray-200">
			<div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
				<dt class="text-sm font-medium text-gray-500">Trading fee ({poolDetail.fee}%)</dt>
				<dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{feeAmount} Token1</dd>
			</div>
			<div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
				<dt class="text-sm font-medium text-gray-500">Minimum Token2 you receive</dt>
				<dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">1232.23</dd>
			</div>
		</dl>
	</div>
	<div class="text-center">
		<ActionButton
			label="Provide"
			actionMethod={handleProvide}
			disabled={!$myForm.valid}
			{provider}
		/>
	</div>
</div>
