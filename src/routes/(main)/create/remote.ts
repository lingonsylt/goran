import { nonEmptyString } from '#lib/schemas.ts'
import { form, getRequestEvent } from '$app/server'
import * as v from 'valibot'
import { db } from '../../../prisma/db'
import { redirect } from '@sveltejs/kit'

export const createMotion = form(
	v.object({
		title: nonEmptyString(),
		description: nonEmptyString()
	}),
	async ({ title, description }) => {
		const { locals } = getRequestEvent()

		const { id } = await db.orm.public.Motion.create({ title, description, creatorId: locals.userId })

		redirect(303, `/motion/${id}`)
	}
)
