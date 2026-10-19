<script>
	import { resolve } from '$app/paths';
	import { page } from '$app/state';

	let { children } = $props();

	let isLogin = $derived(page.url.pathname.includes('login'));
</script>

<div class="absolute top-0 left-0 flex h-full w-full items-center justify-center">
	<main class="flex w-xs flex-col items-stretch justify-start border">
		<div class="flex h-10 items-stretch border-b">
			<a
				class="flex flex-1 items-center justify-center {isLogin ? 'bg-dark text-light' : ''}"
				href={resolve('/auth/login', {})}
				aria-disabled={isLogin}>Login</a
			>
			<a
				class="flex flex-1 items-center justify-center {!isLogin ? 'bg-dark text-light' : ''}"
				href={resolve('/auth/register', {})}
				aria-disabled={!isLogin}>Sign Up</a
			>
		</div>
		<div class="m-6">
			{@render children()}
		</div>
	</main>
</div>
