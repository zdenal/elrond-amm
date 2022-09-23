<script>
	export let items;
	export let selected = undefined;

	const activeClass = 'z-10 border-indigo-500 outline-none ring-1 ring-indigo-500';
</script>

<span class="isolate inline-flex rounded-md shadow-sm">
	{#each items as item}
		<button
			type="button"
			on:click={() => (selected = item)}
			class="relative -ml-px inline-flex items-center first:rounded-l-md last:rounded-r-md
      border border-gray-300 bg-white px-4 py-2 text-sm font-medium
      text-gray-700 hover:bg-gray-50 {item == selected ? activeClass : ''}"
		>
			<slot {item} />
		</button>
	{/each}
</span>
