const ObjectToMap = (object) => {
	const map = new Map();
	if (!object) {
		return map;
	}
	Object.entries(object).forEach(([k, v]) => {
		if (v?.value?.dataType === 'MapType') {
			const innerObj = ObjectToMap(v.value);
			map.set(k, { value: innerObj });
		} else if (v?.dataType === 'MapType') {
			const innerObj = ObjectToMap(v);
			map.set(k, innerObj);
		} else if (k !== 'dataType') {
			map.set(k, v);
		}
	});
	return map;
};

export default ObjectToMap;
