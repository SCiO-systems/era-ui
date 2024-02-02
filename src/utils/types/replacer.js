const replacer = (key, value) => {
	if (value instanceof Map) {
		return {
			dataType: 'Map',
			value: Array.from(value.entries()), // or with spread: value: [...value]
		};
	} 
	return value;
};

export default replacer;
