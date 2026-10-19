import * as v from 'valibot';

export const nonEmptyString = () => v.pipe(v.string(), v.nonEmpty())

export const uuid = (message = "Invalid UUID") =>
	v.pipe(v.string(), v.uuid(message));
