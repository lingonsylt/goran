<script lang="ts">
	import { resolve } from '$app/paths';
	import { getLiveVoteCount, getMotions, vote } from './remote';

	const motions = await getMotions();
</script>

<div class="flex flex-wrap">
	{#each motions as motion (motion.id)}
		{@const voteCount = getLiveVoteCount(motion.id)}
		{@const voteForm = vote.for(motion.id)}
		<div class="flex bg-green-300">
			<div class="flex-col">
				<a href={resolve('/(main)/motion/[id]', { id: motion.id })}>
					<h2 class="text-2xl">{motion.title}</h2>
				</a>
				<h3>{motion.description}</h3>
			</div>
			<p>{await voteCount}</p>
			<form {...voteForm}>
				<button {...voteForm.fields.action.as('submit', 'for')}>👍</button>
				<button {...voteForm.fields.action.as('submit', 'against')}>👎</button>
			</form>
		</div>
	{/each}
</div>
