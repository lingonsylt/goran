<script lang="ts">
	import type { LayoutProps } from '../$types';
	import { resolve } from '$app/paths';
	import { getIsLoggedIn, signout } from '../auth/remote';

	let { children }: LayoutProps = $props();

	const isLoggedIn = $derived(await getIsLoggedIn());
</script>

<nav class="shadow-m m-4 flex justify-between rounded-full bg-light p-3">
	<div class="flex gap-4 px-2">
		<a href={resolve('/')}>Motioner</a>
		<a href={resolve('/(main)/create')}>Skapa motion</a>
	</div>
	<div class="flex gap-4">
		<div class="rounded-full bg-dark p-1 px-3 text-light">
			{#if isLoggedIn}
				<form {...signout}>
					<button>Logga ut</button>
				</form>
			{:else}
				<a href={resolve('/auth')}>Jag är en ledamot</a>
			{/if}
		</div>
	</div>
</nav>
<div class="m-4">
	{@render children()}
</div>
