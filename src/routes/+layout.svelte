<script lang="ts">
	import '../app.css';
	import Header from '$lib/Header.svelte';
	import Footer from '$lib/Footer.svelte';

	let { children } = $props();
	import { Toaster } from '@skeletonlabs/skeleton-svelte';
	import { toaster } from '$lib/toaster';
</script>

<Header />
<main class="flex min-h-screen flex-col p-4 text-center">
	{@render children()}
</main>
<Footer />
<Toaster {toaster}></Toaster>
