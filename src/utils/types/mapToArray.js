const mapToArray = (mapForConvert) => {
	if (mapForConvert instanceof Map) {
		return Array.from(mapForConvert, ([key, value]) => ({ key, value }));
	}
	return [];
};

export default mapToArray;
