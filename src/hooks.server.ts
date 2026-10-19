import type { Handle } from "@sveltejs/kit/hooks";
import { getSession } from "#lib/server/sessions.ts";
import { redirect } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
	const sessionToken = event.cookies.get("sessionToken")

	if (sessionToken) {
		const userId = await getSession(sessionToken)
		if (!userId) {
			event.cookies.delete("sessionToken", {});
		} else {
			event.locals.userId = userId;
		}
	}
	if (!event.locals.userId && event.url.pathname.includes('auth')) redirect(303, "/auth/login");

	const response = await resolve(event);
	return response;
}
