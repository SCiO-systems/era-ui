const makeValueObject = (value = undefined, id = undefined) => {
	if ((value || value === '' || value === 0) && id) {
		return {
			value,
			id,
		};
	} if (value || value === '' || value === 0) {
		return {
			value,
		};
	}
	if (!id) {
		return {
			empty: true,
		};
	}
	return {
		id,
	};
};

export default makeValueObject;
