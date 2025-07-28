<script lang="ts">
	import { toaster } from '$lib/toaster';

	function getTask() {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				if (Math.random() > 0.5) {
					resolve('Task completed successfully!');
				} else {
					reject('Task failed!');
				}
			}, 2000);
		});
	}
</script>

<div class="grid w-full max-w-72 grid-cols-2 gap-2">
	<button
		class="btn preset-filled"
		onclick={() => {
			toaster.info({
				title: 'This is a toast!'
			});
		}}>Info</button
	>
	<button
		class="btn preset-filled-success-500"
		onclick={() => {
			toaster.success({
				title: 'This is a toast!'
			});
		}}>Success</button
	>
	<button
		class="btn preset-filled-warning-500"
		onclick={() => {
			toaster.warning({
				title: 'This is a toast!'
			});
		}}>Warning</button
	>
	<button
		class="btn preset-filled-error-500"
		onclick={() => {
			toaster.error({
				title: 'This is a toast!'
			});
		}}>Error</button
	>
</div>

<button
	class="btn preset-filled"
	onclick={() => {
		toaster.promise(getTask(), {
			loading: {
				title: 'Loading...',
				description: 'Please wait while the task is being processed.'
			},
			success: () => ({
				title: 'Success',
				description: 'Your request has been completed'
			}),
			error: () => ({
				title: 'Error',
				description: 'An error has occurred'
			})
		});
	}}>Execute Task</button
>
