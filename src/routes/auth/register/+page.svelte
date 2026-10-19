<script>
	import FormInput from '#lib/components/FormInput.svelte';
	import { register } from '../remote';
</script>

<form {...register} class="flex flex-col items-center gap-4">
	<FormInput field={register.fields.name} label="Name" type="text"></FormInput>
	<FormInput field={register.fields.phoneNumber} label="Phone Number" type="text"></FormInput>
	<FormInput field={register.fields.password} label="Password" type="password"></FormInput>
	<button class="btn-primary">register</button>
</form>
