<script lang="ts">
	import { vote } from '../../remote';
	import { getLiveMotionVotes, getMotionDetails } from './remote';

	const { params } = $props();

	const motion = $derived(await getMotionDetails(params.id));
	const votes = $derived(getLiveMotionVotes(params.id));

	const voteForm = $derived(vote.for(motion.id));
</script>

<h1>{motion.title}</h1>
<p>{motion.description}</p>
<form {...voteForm}>
	<button {...voteForm.fields.action.as('submit', 'for')}>Vote for</button>
	<button {...voteForm.fields.action.as('submit', 'against')}>Vote against</button>
</form>
<ul>
	{#each await votes as vote (vote.id)}
		<li>
			{vote.voterId} voted {vote.forMotion ? 'for' : 'against'}
		</li>
	{/each}
</ul>
