// eslint-disable-next-line import/no-cycle
import { makeKey } from './index';

const translate = (tolgee, defaultString, customKey) => {
	if (customKey) {
		return tolgee(makeKey(customKey), defaultString);
	}
	return tolgee(makeKey(defaultString), defaultString);
};

export default translate;
