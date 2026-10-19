import { form, getRequestEvent } from "$app/server";
import * as v from "valibot";
import { db } from "../../prisma/db";
import { createSession, deleteSession, deleteSessionCookie, deleteSessionsByUserId, getSession, setSessionCookie } from "#lib/server/sessions.ts";
import { invalid, redirect } from "@sveltejs/kit";
import { nonEmptyString, phoneNumberSchema } from "#lib/schemas.ts";

export const login = form(
	v.object({
		phoneNumber: phoneNumberSchema(),
		password: nonEmptyString(),
	}),
	async ({ phoneNumber, password }) => {
		const user = await db.orm.public.User.first({ phoneNumber });
		if (!user) invalid('Invalid credentials');

		const isCorrect = await Bun.password.verify(password, user.passwordHash)
		if (!isCorrect) invalid('Invalid credentials')

		const token = await createSession(user.id);
		setSessionCookie(token)
		return redirect(303, "/");
	},
);

export const register = form(
	v.object({
		phoneNumber: phoneNumberSchema(),
		name: nonEmptyString(),
		password: nonEmptyString(),
	}),
	async ({ phoneNumber, name, password }) => {
		const existingUser = await db.orm.public.User.first({ phoneNumber });
		if (existingUser) invalid('Username is taken');

		const passwordHash = await Bun.password.hash(password)
		const { id } = await db.orm.public.User.create({ phoneNumber, name, passwordHash });

		const token = await createSession(id);
		setSessionCookie(token)
		return redirect(303, "/");
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

		const ownedItems = await db.orm.public.Item.first({ sellerId: locals.userId })
		if (ownedItems) throw new Error('Account with active listings cannot be deleted')

		await db.orm.public.User.where({ id: locals.userId }).delete()
		await deleteSessionsByUserId(locals.userId)
	}
)

export const remoteSignout = form(
	v.object({
		id: nonEmptyString() // SessionToken, Make proper schema
	}),
	async ({ id }) => {
		const { locals } = getRequestEvent()
		const sessionToken = id

		const userId = await getSession(sessionToken)
		if (!userId || userId !== locals.userId) invalid('Session does not exist')

		await deleteSession(sessionToken)
	})

export const deleteAllSessions = form(
	async () => {
		const { locals } = getRequestEvent()
		await deleteSessionsByUserId(locals.userId)
	}
)
