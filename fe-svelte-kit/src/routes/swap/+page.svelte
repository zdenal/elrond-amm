<script>
	import { form, field } from 'svelte-forms';
	import { required } from 'svelte-forms/validators';
	import { myHoldings } from '../../store/myHoldings';
	import { provider, contractData } from '../../stores';
	import { AmountInput, ActionButton, Title } from '../../components';

	const token1Amount = field('token1Amount', 50, [required()]);
	const token2Amount = field('token2Amount', 50, [required()]);
	const myForm = form(token1Amount, token2Amount);

	$: fromBalance = $myHoldings ? $myHoldings.token1Amount + 2222 : '...';
	$: toBalance = $myHoldings ? $myHoldings.token2Amount : '...';
	$: fromField = { amount: token1Amount, balance: fromBalance, name: 'Token1' };
	$: toField = { amount: token2Amount, balance: toBalance, name: 'Token2' };

	function handleProvide() {}

	function switchFromTo() {
		[fromField, toField] = [toField, fromField];
	}
</script>

<div class="flex flex-col space-y-8 justify-items-center">
	<div>
		<Title>Swap</Title>
	</div>
	<div>
		<AmountInput
			bind:value={fromField.amount.$value}
			label="From: {fromField.name}"
			currencyName="Balance: {fromField.balance}"
		/>
	</div>
	<div class="text-center">
		<button
			on:click={switchFromTo}
			type="button"
			class="inline-flex items-center rounded-full border border-transparent p-3 text-white shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
		>
			<svg
				class="text-gray-500"
				width="30"
				height="30"
				viewBox="0 0 24 24"
				stroke-width="2"
				stroke="currentColor"
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path stroke="none" d="M0 0h24v24H0z" /> <path d="M3 9l4-4l4 4m-4 -4v14" />
				<path d="M21 15l-4 4l-4-4m4 4v-14" /></svg
			>
		</button>
	</div>
	<div>
		<AmountInput
			bind:value={toField.amount.$value}
			label="To: {toField.name}"
			currencyName="Balance: {toField.balance}"
		/>
	</div>
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
