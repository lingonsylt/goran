<script>
	import FormInput from '#lib/components/FormInput.svelte';
	import { createMotion } from './remote';
</script>

<div class="absolute top-0 left-0 flex h-full w-full items-center justify-center">
	<form {...createMotion} class="flex w-xs flex-col items-stretch gap-4 border">
		<FormInput field={createMotion.fields.title} label="Title" type="text"></FormInput>
		<FormInput field={createMotion.fields.description} label="Description" type="text"></FormInput>
		<button class="btn-primary">Create</button>
	</form>
</div>
