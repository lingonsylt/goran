import parsePhoneNumberFromString from 'libphonenumber-js';
import * as v from 'valibot';


const DEFAULT_COUNTRY = 'SE'

export const phoneNumberSchema = () => v.pipe(
	v.string(),
	v.trim(),
	v.rawTransform(({ dataset, addIssue, NEVER }) => {
		const phone = parsePhoneNumberFromString(dataset.value, DEFAULT_COUNTRY);

		if (!phone?.isValid()) {
			addIssue({ message: 'Invalid phone number' });
			return NEVER;
		}

		return phone.number;
	})
);

export const nonEmptyString = () => v.pipe(v.string(), v.nonEmpty())
