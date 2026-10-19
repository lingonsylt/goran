<script>
	import FormInput from '#lib/components/FormInput.svelte';
	import { auth } from './remote';
</script>

<div class="absolute top-0 left-0 flex h-full w-full items-center justify-center">
	<form {...auth} class="flex w-xs flex-col items-stretch gap-4 border">
		<FormInput field={auth.fields.name} label="Name" type="text"></FormInput>
		<FormInput field={auth.fields.password} label="Password" type="password"></FormInput>
		<div class="flex gap-4">
			<button class="btn-primary" {...auth.fields.action.as('submit', 'login')}>Login</button>
			<button class="btn-secondary" {...auth.fields.action.as('submit', 'register')}
				>Register</button
			>
		</div>
	</form>
</div>
