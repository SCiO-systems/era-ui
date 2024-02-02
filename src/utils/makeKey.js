const makeKey = (txt) => {
	if (typeof txt === 'string' || txt instanceof String) {
		return txt.replace(/[^a-zA-Z0-9% ]/g, ' ')
			.replace(/\s\s+/g, ' ')
			.trimStart()
			.trimEnd()
			.replace(/\s+/g, '-')
			.replace(/-+$/, '')
			.toLowerCase();
	}
	return txt;
};

export default makeKey;
