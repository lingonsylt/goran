<script lang="ts">
	import type { RemoteFormField } from '$app/server';

	const {
		field,
		label,
		type
	}: {
		field: RemoteFormField<string>;
		label: string;
		type: 'text' | 'password';
	} = $props();
</script>

<label>
	<span class="text-lite">{label}</span>
	<input class="w-full" {...field.as(type)} />
</label>
