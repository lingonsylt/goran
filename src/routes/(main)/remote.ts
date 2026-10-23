import { uuid } from "#lib/schemas.ts";
import { form, getRequestEvent, query } from "$app/server";
import { error, redirect } from "@sveltejs/kit";
import { db } from "../../prisma/db";
import { emit, event } from "#lib/server/events.ts";
import * as v from 'valibot'

export const getMotions = query(async () => {
	const motions = await db.orm.public.Motion
		.include('creator', c => c.select('name'))
		.all()
	return motions
})

export const getLiveVoteCount = query.live(uuid(), async function* (motionId) {
	const motion = await db.orm.public.Motion.select('voteEstimate').where({ id: motionId }).first()
	if (!motion) error(404, 'Motion does not exist')
	yield motion.voteEstimate

	for await (const [newVoteCount] of event('newVote', motionId)) {
		yield newVoteCount
	}
})

export const vote = form(
	v.object({
		id: uuid(),
		action: v.picklist(['for', 'against'])
	}),
	async ({ id, action }) => {
		const { locals } = getRequestEvent()
		if (!locals.userId) redirect(303, '/auth')

		console.log('new vote')
		const motion = await db.orm.public.Motion.first({ id })
		if (!motion) error(404, 'Motion does not exist')

		const forMotion = action === 'for'
		let newVoteCount = motion.voteEstimate + (forMotion ? 1 : -1)

		const existingVote = await db.orm.public.Vote.first({ motionId: id, voterId: locals.userId })

		if (existingVote && existingVote.forMotion === forMotion) {
			await db.orm.public.Vote
				.where({ motionId: id, voterId: locals.userId })
				.delete()
			newVoteCount = motion.voteEstimate + (existingVote.forMotion ? -1 : 1)
		} else if (existingVote) {
			await db.orm.public.Vote.where({ motionId: id, voterId: locals.userId }).update({ forMotion })
			newVoteCount = motion.voteEstimate + (forMotion ? 2 : -2)
		} else {
			await db.orm.public.Vote.create({ motionId: id, voterId: locals.userId, forMotion })
		}
		console.log(newVoteCount)
		await db.orm.public.Motion.where({ id }).update({ voteEstimate: newVoteCount })
		emit('newVote', id, newVoteCount)
	}
)
