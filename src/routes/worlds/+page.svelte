<script lang="ts">
	interface World {
		modpack: string;
		version: string;
		season: string;
		worldName: string;
		filename: string;
	}

	interface PageData {
		worlds: World[];
	}

	const { data }: { data: PageData } = $props();

	// SvelteKit 5 runes for reactive state
	let searchTerm = $state('');
	let sortField = $state<keyof World>('worldName');
	let sortDirection = $state<'asc' | 'desc'>('asc');
	let selectedModpack = $state('all');

	// console.table(data.worlds);

	// Get unique modpacks for filter dropdown
	const uniqueModpacks = $derived(() => {
		const modpacks = [...new Set(data.worlds.map((world) => world.modpack))];
		return modpacks.sort();
	});

	// Filtered and sorted worlds
	const filteredWorlds = $derived(() => {
		let filtered = data.worlds;

		// Filter by search term
		if (searchTerm.trim()) {
			filtered = filtered.filter(
				(world) =>
					world.worldName.toLowerCase().includes(searchTerm.toLowerCase()) ||
					world.modpack.toLowerCase().includes(searchTerm.toLowerCase()) ||
					world.season.toLowerCase().includes(searchTerm.toLowerCase()) ||
					world.version.toLowerCase().includes(searchTerm.toLowerCase())
			);
		}

		// Filter by modpack
		if (selectedModpack !== 'all') {
			filtered = filtered.filter((world) => world.modpack === selectedModpack);
		}

		// Sort
		filtered.sort((a, b) => {
			const aVal = a[sortField] as string;
			const bVal = b[sortField] as string;
			const comparison = aVal.localeCompare(bVal);
			return sortDirection === 'asc' ? comparison : -comparison;
		});

		return filtered;
	});

	function handleSort(field: keyof World) {
		if (sortField === field) {
			sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
		} else {
			sortField = field;
			sortDirection = 'asc';
		}
	}

	function getSortIcon(field: keyof World) {
		if (sortField !== field) return '↕️';
		return sortDirection === 'asc' ? '↑' : '↓';
	}

	function getModpackColor(modpack: string) {
		// Generate consistent colors for modpacks
		const colors = [
			'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
			'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
			'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
			'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
			'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
			'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
			'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
		];
		const hash = modpack.split('').reduce((a: number, b: string) => {
			a = (a << 5) - a + b.charCodeAt(0);
			return a & a;
		}, 0);
		return colors[Math.abs(hash) % colors.length];
	}
</script>

<div class="mx-auto max-w-7xl space-y-6 p-6">
	<!-- Header -->
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h1
				class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent"
			>
				🌍 Worlds
			</h1>
			<p class="mt-2 text-gray-600 dark:text-gray-400">
				Manage your {data.worlds.length} worlds across different modpacks
			</p>
		</div>

		<div class="flex items-center gap-2">
			<span
				class="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300"
			>
				{filteredWorlds.length} of {data.worlds.length} worlds
			</span>
		</div>
	</div>

	<!-- Filters and Search -->
	<div
		class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
	>
		<div class="flex flex-col gap-4 sm:flex-row">
			<!-- Search -->
			<div class="flex-1">
				<label for="search" class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
					Search worlds
				</label>
				<div class="relative">
					<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
						<span class="text-gray-400">🔍</span>
					</div>
					<input
						id="search"
						type="text"
						placeholder="Search by name, modpack, group, or version..."
						bind:value={searchTerm}
						class="block w-full rounded-md border border-gray-300 bg-white py-2 pr-10 pl-10
                               text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2
                               focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700
                               dark:text-gray-100 dark:placeholder-gray-400"
					/>
					{#if searchTerm}
						<button
							onclick={() => (searchTerm = '')}
							class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
						>
							✕
						</button>
					{/if}
				</div>
			</div>

			<!-- Modpack Filter -->
			<div class="w-full sm:w-48">
				<label
					for="modpack-filter"
					class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
				>
					Filter by modpack
				</label>
				<select
					id="modpack-filter"
					bind:value={selectedModpack}
					class="block w-full rounded-md border border-gray-300 bg-white px-3
                           py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500
                           dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
				>
					<option value="all">All modpacks</option>
					{#each uniqueModpacks() as modpack (modpack)}
						<option value={modpack}>{modpack}</option>
					{/each}
				</select>
			</div>
		</div>
	</div>

	<!-- Table -->
	<div
		class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
	>
		<div class="overflow-x-auto">
			<table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
				<thead class="bg-gray-50 dark:bg-gray-900">
					<tr>
						<th class="px-6 py-3 text-left">
							<button
								onclick={() => handleSort('modpack')}
								class="flex items-center gap-2 text-xs font-medium tracking-wider text-gray-500 uppercase transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
							>
								Modpack <span>{getSortIcon('modpack')}</span>
							</button>
						</th>
						<th class="px-6 py-3 text-left">
							<button
								onclick={() => handleSort('season')}
								class="flex items-center gap-2 text-xs font-medium tracking-wider text-gray-500 uppercase transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
							>
								Season <span>{getSortIcon('season')}</span>
							</button>
						</th>
						<th class="px-6 py-3 text-left">
							<button
								onclick={() => handleSort('version')}
								class="flex items-center gap-2 text-xs font-medium tracking-wider text-gray-500 uppercase transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
							>
								Version <span>{getSortIcon('version')}</span>
							</button>
						</th>
						<th class="px-6 py-3 text-left">
							<button
								onclick={() => handleSort('worldName')}
								class="flex items-center gap-2 text-xs font-medium tracking-wider text-gray-500 uppercase transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
							>
								World Name <span>{getSortIcon('worldName')}</span>
							</button>
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
						>
							Actions
						</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
					{#each filteredWorlds() as world (world.worldName + world.modpack)}
						<tr class="transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-gray-700">
							<td class="px-6 py-4 whitespace-nowrap">
								<span
									class="inline-flex rounded-full px-2 py-1 text-xs font-semibold {getModpackColor(
										world.modpack
									)}"
								>
									{world.modpack}
								</span>
							</td>
							<td
								class="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900 dark:text-gray-100"
							>
								{world.season}
							</td>
							<td class="px-6 py-4 whitespace-nowrap">
								<code
									class="rounded bg-gray-100 px-2 py-1 font-mono text-xs text-gray-900 dark:bg-gray-700 dark:text-gray-100"
								>
									{world.version}
								</code>
							</td>
							<td
								class="px-6 py-4 text-sm font-semibold whitespace-nowrap text-gray-900 dark:text-gray-100"
							>
								{world.worldName}
							</td>
							<td class="px-6 py-4 text-sm font-medium whitespace-nowrap">
								<div class="flex gap-2">
									<button
										class="rounded p-1 text-blue-600 transition-colors hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
										title="Launch World"
									>
										🚀
									</button>
									<button
										class="rounded p-1 text-green-600 transition-colors hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
										title="Edit World"
									>
										✏️
									</button>
									<button
										class="rounded p-1 text-purple-600 transition-colors hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
										title="World Info"
									>
										ℹ️
									</button>
								</div>
							</td>
						</tr>
					{:else}
						<tr>
							<td colspan="5" class="px-6 py-12 text-center">
								<div class="flex flex-col items-center gap-3">
									<span class="text-4xl">🔍</span>
									<p class="text-gray-500 dark:text-gray-400 text-lg">
										No worlds found matching your criteria
									</p>
									{#if searchTerm || selectedModpack !== 'all'}
										<button
											onclick={() => {
												searchTerm = '';
												selectedModpack = 'all';
											}}
											class="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
										>
											Clear filters
										</button>
									{/if}
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>

	<!-- Stats Footer -->
	<div
		class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
	>
		<div class="grid grid-cols-1 gap-6 text-center sm:grid-cols-3">
			<div class="flex flex-col">
				<div class="text-3xl font-bold text-blue-600 dark:text-blue-400">
					{uniqueModpacks().length}
				</div>
				<div class="mt-1 text-sm text-gray-500 dark:text-gray-400">Modpacks</div>
			</div>
			<div class="flex flex-col">
				<div class="text-3xl font-bold text-green-600 dark:text-green-400">
					{data.worlds.length}
				</div>
				<div class="mt-1 text-sm text-gray-500 dark:text-gray-400">Total Worlds</div>
			</div>
			<div class="flex flex-col">
				<div class="text-3xl font-bold text-purple-600 dark:text-purple-400">
					{filteredWorlds().length}
				</div>
				<div class="mt-1 text-sm text-gray-500 dark:text-gray-400">Filtered Results</div>
			</div>
		</div>
	</div>
</div>
