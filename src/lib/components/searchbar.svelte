<!-- <script lang="ts">
	let searchQuery: string = $state('');
	let searchResults: string[] = $state([]);
	let isSearching: boolean = $state(false);
</script>

<span>
	<input
		type="text"
		placeholder="Search worlds..."
		bind:value={searchQuery}
		on:input={() => {
			isSearching = true;
			// Simulate a search operation
			setTimeout(() => {
				searchResults = []; // Replace with actual search logic
				isSearching = false;
			}, 500);
		}}
		class="search-input"
	/>
</span> -->
