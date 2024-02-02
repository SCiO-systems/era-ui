const mapToObject = (map = new Map()) => {
	const object = Object.fromEntries(Array.from(map.entries(), ([k, v]) => {
		if (v?.value instanceof Map) {
			return [k, { value: mapToObject(v.value) }];
		} if (v instanceof Map) {
			return [k, mapToObject(v)];
		}
		return [k, v];
	}
	));
	object.dataType = 'MapType';
	return object;
};

export default mapToObject;
