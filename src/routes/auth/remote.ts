import { form, getRequestEvent } from "$app/server";
import * as v from "valibot";
import { db } from "../../prisma/db";
import { createSession, deleteSession, deleteSessionCookie, getSession, setSessionCookie } from "#lib/server/sessions.ts";
import { invalid, redirect } from "@sveltejs/kit";
import { nonEmptyString } from "#lib/schemas.ts";

export const auth = form(
	v.object({
		name: nonEmptyString(),
		password: nonEmptyString(),
		action: v.picklist(['login', 'register'])
	}),
	async ({ name, password, action }) => {
		if (action === 'login') {
			const user = await db.orm.public.User.first({ name });
			if (!user) invalid('Invalid credentials');

			const isCorrect = await Bun.password.verify(password, user.passwordHash)
			if (!isCorrect) invalid('Invalid credentials')

			const token = await createSession(user.id);
			setSessionCookie(token)
			redirect(303, "/");
		} else {
			const passwordHash = await Bun.password.hash(password)
			try {
				const newUser = await db.orm.public.User.create({ name, passwordHash });
				const token = await createSession(newUser.id);
				setSessionCookie(token)
				redirect(303, "/");
			} catch (error) {
				if (error instanceof Error && 'sqlState' in error && error.sqlState === '23505') {
					invalid('Username is taken');
				}
				throw error;
			}
		}
	},
);

export const signout = form(async () => {
	const { cookies } = getRequestEvent();
	const sessionToken = cookies.get("sessionToken");
	if (sessionToken) {
		await deleteSession(sessionToken);
		deleteSessionCookie()
	}
});

export const deleteUser = form(
	async () => {
		const { locals } = getRequestEvent();

		await db.orm.public.User.where({ id: locals.userId }).delete()
		const session = await getSession(locals.userId)
		if (session) await deleteSession(session)
	}
)
