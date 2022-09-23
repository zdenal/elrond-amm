<script>
	export let label;
	export let value;
	export let currencyName;
	export let disabled = false;
	export let currencyTicker = '₮';
	export let onTyping = undefined;
</script>

<div>
	<label for="price" class="block text-sm font-medium text-gray-700">{label}</label>
	<div class="relative mt-1 rounded-md shadow-sm">
		<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
			<span class="text-gray-500 sm:text-sm">{currencyTicker}</span>
		</div>
		<input
			bind:value
			{disabled}
			on:keyup={onTyping}
			type="number"
			name="price"
			class="block w-full rounded-md border-gray-300 pl-9 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
			placeholder="0"
			aria-describedby="price-currency"
		/>
		<div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
			<span class="text-gray-500 sm:text-sm" id="price-currency">{currencyName}</span>
		</div>
	</div>
</div>

<style>
	/* Chrome, Safari, Edge, Opera */
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	/* Firefox */
	input[type='number'] {
		-moz-appearance: textfield;
	}
</style>
