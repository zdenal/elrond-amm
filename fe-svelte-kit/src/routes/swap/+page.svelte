<script>
	import { debounce } from 'lodash';
	import { form, field } from 'svelte-forms';
	import { required } from 'svelte-forms/validators';
	import { myHoldings } from '../../store/myHoldings';
	import { provider, contractData } from '../../stores';
	import { AmountInput, ActionButton, Title, Swap } from '../../components';
	import { getSwapToken1Estimate, getSwapToken2Estimate } from '../../contract';

	export let data;

	const token1Amount = field('token1Amount', undefined, [required()]);
	const token2Amount = field('token2Amount', undefined, [required()]);
	const myForm = form(token1Amount, token2Amount);

	$: token1Balance = $myHoldings?.token1Amount;
	$: token2Balance = $myHoldings?.token2Amount;

	function handleProvide() {}

	async function token1Estimate() {
		if (!$provider || $token1Amount.value <= 0 || !$token1Amount.value) {
			await token2Amount.reset();
			return;
		}

		if ($token1Amount.value > token1Balance) {
			await token1Amount.set(token1Balance);
		}

		const token2EstimatedAmount = await getSwapToken1Estimate({
			token1Amount: $token1Amount.value,
			...data.contractData
		});

		await token2Amount.set(token2EstimatedAmount);
	}

	async function token2Estimate() {
		if (!$provider || $token2Amount.value <= 0 || !$token2Amount.value) {
			await token1Amount.reset();
			return;
		}

		if ($token2Amount.value > token2Balance) {
			await token2Amount.set(token2Balance);
		}

		const token1EstimatedAmount = await getSwapToken2Estimate({
			token2Amount: $token2Amount.value,
			...data.contractData
		});

		await token1Amount.set(token1EstimatedAmount);
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
				<dt class="text-sm font-medium text-gray-500">Trading fee(1%)</dt>
				<dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">1 Token1</dd>
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
