import { getRequestEvent } from '$app/server';
import { randomBytes } from "crypto";
import { redis } from "bun";
const SESSION_LIFETIME_SEC = 60 * 60 * 24;

const generateSessionToken = () => randomBytes(32).toString('hex');

export const setSessionCookie = (sessionToken: string) => {
	const { cookies } = getRequestEvent();

	cookies.set('sessionToken', sessionToken, {
		path: '/',
		expires: new Date(Date.now() + SESSION_LIFETIME_SEC * 1000),
		httpOnly: true
	});
}

export const deleteSessionCookie = () => {
	const { cookies } = getRequestEvent();
	cookies.delete('sessionToken', {});

}

export const createSession = async (userId: string) => {
	const sessionToken = generateSessionToken();

	const previousSessionToken = await redis.get(`user_session:${userId}`);

	if (previousSessionToken) {
		await redis.del(`session:${sessionToken}`);
	}

	await redis.setex(`session:${sessionToken}`, SESSION_LIFETIME_SEC, userId);
	await redis.set(`user_session:${userId}`, sessionToken);

	return sessionToken;
};

export const getSession = async (sessionToken: string) => redis.get(`session:${sessionToken}`);

export const deleteSession = async (sessionToken: string) => {
	const userId = await redis.get(`session:${sessionToken}`);

	if (userId) {
		await redis.del(`user_session:${userId}`);
	}
	await redis.del(`session:${sessionToken}`);

};
