<script lang="ts">
	import './layout.css';
	import favicon from '#lib/assets/favicon.svg';
	import type { LayoutProps } from './$types';
	import { resolve } from '$app/paths';

	let { children }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<nav class="flex gap-4 p-4">
	<a href={resolve('/')}>Home</a>
	<a href={resolve('/create')}>Create Motion</a>
	<a href={resolve('/auth')}>Login/Register</a>
</nav>
{@render children()}
