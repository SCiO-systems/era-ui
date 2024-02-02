const saveToMap = (contextMap, config, value) => {
	// take the context map, add value to it, return it.

	// if this is not a data field, return same map.
	if (!config.data) {
		return contextMap;
	}

	const customTermsCurrent = new Map(contextMap);

	customTermsCurrent.set(config.id, value);
	
	return customTermsCurrent;
};

export default saveToMap;
