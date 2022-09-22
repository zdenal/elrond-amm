<script>
	let state = 'from';

	function swap() {
		state = state == 'from' ? 'to' : 'from';
	}
</script>

<h3 class="text-lg font-medium leading-6 text-gray-900">From</h3>
{#if state == 'from'}
	<slot name="from" />
{:else}
	<slot name="to" />
{/if}
<div class="text-center">
	<button
		on:click={swap}
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

<h3 class="text-lg font-medium leading-6 text-gray-900">To</h3>
{#if state != 'from'}
	<slot name="from" />
{:else}
	<slot name="to" />
{/if}
