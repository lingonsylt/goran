import { uuid } from "#lib/schemas.ts";
import { query } from "$app/server";
import { error } from "@sveltejs/kit";
import { db } from "../../../prisma/db";
import { event } from "#lib/server/events.ts";

export const getMotionDetails = query(uuid(), async (motionId) => {
	const motion = await db.orm.public.Motion.first({ id: motionId })
	if (!motion) error(404, 'Motion does not exist')

	return motion
})

export const getLiveMotionVotes = query.live(uuid(), async function* (motionId) {
	const votes = await db.orm.public.Vote.where({ motionId }).all()

	yield votes

	for await (const _ of event('newVote', motionId)) {
		const votes = await db.orm.public.Vote.where({ motionId }).all()

		yield votes
	}
})
