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
    
    console.table(data.worlds);
    
    // Get unique modpacks for filter dropdown
    const uniqueModpacks = $derived(() => {
        const modpacks = [...new Set(data.worlds.map(world => world.modpack))];
        return modpacks.sort();
    });
    
    // Filtered and sorted worlds
    const filteredWorlds = $derived(() => {
        let filtered = data.worlds;
        
        // Filter by search term
        if (searchTerm.trim()) {
            filtered = filtered.filter(world => 
                world.worldName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                world.modpack.toLowerCase().includes(searchTerm.toLowerCase()) ||
                world.season.toLowerCase().includes(searchTerm.toLowerCase()) ||
                world.version.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        // Filter by modpack
        if (selectedModpack !== 'all') {
            filtered = filtered.filter(world => world.modpack === selectedModpack);
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
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a;
        }, 0);
        return colors[Math.abs(hash) % colors.length];
    }
</script>

<div class="max-w-7xl mx-auto p-6 space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
            <h1 class="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                🌍 Worlds
            </h1>
            <p class="text-gray-600 dark:text-gray-400 mt-2">
                Manage your {data.worlds.length} worlds across different modpacks
            </p>
        </div>
        
        <div class="flex items-center gap-2">
            <span class="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium">
                {filteredWorlds.length} of {data.worlds.length} worlds
            </span>
        </div>
    </div>

    <!-- Filters and Search -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div class="flex flex-col sm:flex-row gap-4">
            <!-- Search -->
            <div class="flex-1">
                <label for="search" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Search worlds
                </label>
                <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span class="text-gray-400">🔍</span>
                    </div>
                    <input 
                        id="search"
                        type="text" 
                        placeholder="Search by name, modpack, group, or version..."
                        bind:value={searchTerm}
                        class="block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                               focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                               placeholder-gray-500 dark:placeholder-gray-400"
                    />
                    {#if searchTerm}
                        <button 
                            onclick={() => searchTerm = ''}
                            class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                        >
                            ✕
                        </button>
                    {/if}
                </div>
            </div>
            
            <!-- Modpack Filter -->
            <div class="w-full sm:w-48">
                <label for="modpack-filter" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Filter by modpack
                </label>
                <select 
                    id="modpack-filter"
                    bind:value={selectedModpack}
                    class="block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md 
                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-gray-900">
                    <tr>
                        <th class="px-6 py-3 text-left">
                            <button 
                                onclick={() => handleSort('modpack')}
                                class="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                            >
                                Modpack <span>{getSortIcon('modpack')}</span>
                            </button>
                        </th>
                        <th class="px-6 py-3 text-left">
                            <button 
                                onclick={() => handleSort('season')}
                                class="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                            >
                                Season <span>{getSortIcon('season')}</span>
                            </button>
                        </th>
                        <th class="px-6 py-3 text-left">
                            <button 
                                onclick={() => handleSort('version')}
                                class="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                            >
                                Version <span>{getSortIcon('version')}</span>
                            </button>
                        </th>
                        <th class="px-6 py-3 text-left">
                            <button 
                                onclick={() => handleSort('worldName')}
                                class="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                            >
                                World Name <span>{getSortIcon('worldName')}</span>
                            </button>
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {#each filteredWorlds() as world (world.worldName + world.modpack)}
                        <tr class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full {getModpackColor(world.modpack)}">
                                    {world.modpack}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                {world.season}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <code class="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded text-xs font-mono">
                                    {world.version}
                                </code>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-gray-100">
                                {world.worldName}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div class="flex gap-2">
                                    <button 
                                        class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors p-1 rounded"
                                        title="Launch World"
                                    >
                                        🚀
                                    </button>
                                    <button 
                                        class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 transition-colors p-1 rounded"
                                        title="Edit World"
                                    >
                                        ✏️
                                    </button>
                                    <button 
                                        class="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300 transition-colors p-1 rounded"
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
                                            onclick={() => { searchTerm = ''; selectedModpack = 'all'; }}
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
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div class="flex flex-col">
                <div class="text-3xl font-bold text-blue-600 dark:text-blue-400">{uniqueModpacks().length}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">Modpacks</div>
            </div>
            <div class="flex flex-col">
                <div class="text-3xl font-bold text-green-600 dark:text-green-400">{data.worlds.length}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">Total Worlds</div>
            </div>
            <div class="flex flex-col">
                <div class="text-3xl font-bold text-purple-600 dark:text-purple-400">{filteredWorlds().length}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">Filtered Results</div>
            </div>
        </div>
    </div>
</div>