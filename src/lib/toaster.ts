import { createToaster } from '@skeletonlabs/skeleton-svelte';

export const toaster = createToaster({
	placement: 'top-end',
	duration: 3000
});

export function toast(
	message: string,
	type: 'info' | 'success' | 'warning' | 'error' = 'info',
	duration?: number,
	title?: string
) {
	toaster.create({
		type,
		duration: duration || 3000,
		title: title || type.charAt(0).toUpperCase() + type.slice(1),
		description: message
	});
}
