<script lang="ts">
	import { onMount } from 'svelte';
	import { Switch } from '@skeletonlabs/skeleton-svelte';
	import IconMoon from '@lucide/svelte/icons/moon';
	import IconSun from '@lucide/svelte/icons/sun';

	let checked = false;

	// Initialize checked once on mount
	onMount(() => {
		const mode = localStorage.getItem('mode') || 'dark';
		checked = mode === 'light';
		document.documentElement.setAttribute('data-mode', mode);
	});

	function onCheckedChange(event: { checked: boolean }) {
		const mode = event.checked ? 'light' : 'dark';
		document.documentElement.setAttribute('data-mode', mode);
		localStorage.setItem('mode', mode);
		checked = event.checked;
	}

	const pageLinks: { name: string; href: string; id: number }[] = [
		{ name: 'Home', href: '/', id: 1 },
		{ name: 'About', href: '/about', id: 2 },
		{ name: 'Contact', href: '/contact', id: 3 }
	];
</script>

<header class="bg-primary text-primary-full flex flex-row items-center p-4 px-12 pt-8">
	<div class="flex w-fit items-center space-x-4">
		<img src="favicon.png" alt="website logo" class="h-8 w-8" />
		<h1>Minecraft World Archive</h1>
	</div>
	<nav class="ml-auto">
		<ul class="flex space-x-4">
			{#each pageLinks as link (link.id)}
				<li class="btn-primary btn"><a href={link.href}>{link.name}</a></li>
			{/each}
		</ul>
	</nav>
	<Switch {checked} {onCheckedChange}>
		{#snippet inactiveChild()}<IconMoon size="14" />{/snippet}
		{#snippet activeChild()}<IconSun size="14" />{/snippet}
	</Switch>
</header>
