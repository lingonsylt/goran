<script>
	import FormInput from '#lib/components/FormInput.svelte';
	import { login } from '../remote';
</script>

<form {...login} class="flex flex-col items-center gap-4">
	<FormInput field={login.fields.phoneNumber} label="Phone Number" type="text"></FormInput>
	<FormInput field={login.fields.password} label="Password" type="password"></FormInput>
	<button class="btn-primary">Login</button>
</form>
