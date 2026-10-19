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

	await redis.setex(`session:${sessionToken}`, SESSION_LIFETIME_SEC, userId);
	await redis.sadd(`user_sessions:${userId}`, sessionToken);

	return sessionToken;
};

export const getSession = async (sessionToken: string) => redis.get(`session:${sessionToken}`);

export const deleteSession = async (sessionToken: string) => {
	const userId = await redis.get(`session:${sessionToken}`);

	if (userId) {
		await redis.srem(`user_sessions:${userId}`, sessionToken);
	}
	await redis.del(`session:${sessionToken}`);

};

export const deleteSessionsByUserId = async (userId: string) => {
	const sessionTokens = await redis.smembers(`user_sessions:${userId}`);

	if (sessionTokens.length > 0) {
		const sessionKeys = sessionTokens.map((token: string) => `session:${token}`);
		await redis.del(...sessionKeys);
	}

	await redis.del(`user_sessions:${userId}`);
};
