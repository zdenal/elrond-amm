<script>
	/** @type {import('./$types').PageData} */
	export let data;

	import { openModal } from 'svelte-modals';
	import { provider } from '../stores.js';
	import { toDecimal, feeInPerc, present } from '../utils.js';
	import { myHoldings } from '../store/myHoldings';

	import { ActionButton, WalletConnect, Table, Row } from '../components';

	function handleClick() {
		openModal(WalletConnect, { provider });
	}
</script>

<div>
	<div class="mb-6">
		<div class="flex justify-between">
			<h3 class="text-2xl leading-6 font-medium text-gray-900">Account Information</h3>
			{#if !$provider}
				<button
					on:click={handleClick}
					type="button"
					class="justify-center inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-1 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
				>
					Connect
				</button>
			{/if}
		</div>
		{#if $provider}
			<p class="mt-1 max-w-2xl text-sm text-gray-500">{$provider.account.address}</p>
		{/if}
	</div>
	<div>
		<h3 class="text-lg leading-6 font-medium text-gray-900">Assets</h3>
	</div>
	<div>
		<Table>
			<Row title="Amount of Token1">
				{present($myHoldings?.token1Amount)}
			</Row>
			<Row title="Amount of Token2">
				{present($myHoldings?.token2Amount)}
			</Row>
			<Row title="Amount of Shares">
				{present(toDecimal($myHoldings?.sharesAmount))}
			</Row>
		</Table>
	</div>

	<div>
		<h4 class="text-lg leading-6 font-medium text-gray-900">Pool Details</h4>
	</div>
	<div>
		<Table>
			<Row title="Total Token1">
				{data.token1Total}
			</Row>
			<Row title="Total Token2">
				{data.token2Total}
			</Row>
			<Row title="Total Share">
				{toDecimal(data.sharesTotal)}
			</Row>
			<Row title="Trading Fee">
				{feeInPerc(data.fee)}%
			</Row>
		</Table>
	</div>
</div>
