const migrateTimeVocabs = (timeVocabs) => {
	let migration;

	const checkVal = (arr) => {
		if (arr?.length > 0) {
			return Object.hasOwn(arr[0], 'val');
		}
		return false;
	};

	const renameProperty = (obj) => {
		if (!obj) return {};
		const newObj = { ...obj };
		if (Object.hasOwn(newObj, 'term') && Object.hasOwn(newObj, 'val')) {
			Object.defineProperty(newObj, 'value', Object.getOwnPropertyDescriptor(newObj, 'val'));
			delete newObj.val;
			if (Object.hasOwn(newObj, 'value')) {
				newObj.value.site = renameProperty(newObj.value.site);
				newObj.value.period = renameProperty(newObj.value.period);
			}
		} else if (Object.hasOwn(newObj, 'val')) {
			Object.defineProperty(newObj, 'term', Object.getOwnPropertyDescriptor(newObj, 'val'));
			delete newObj.val;
		}

		if (Object.hasOwn(newObj, 'sites')) {
			newObj.sites = newObj.sites.map((e) => renameProperty(e));
		}
		return newObj;
	};

	migration = checkVal(timeVocabs.pairedVocab);
	migration = migration || checkVal(timeVocabs.periodsVocab);
	migration = migration || checkVal(timeVocabs.sitesVocab);
	if (migration) {
		return {
			pairedVocab: timeVocabs.pairedVocab.map((e) => renameProperty(e)),
			sitesVocab: timeVocabs.sitesVocab.map((e) => renameProperty(e)),
			periodsVocab: timeVocabs.periodsVocab.map((e) => renameProperty(e)),
		};
	}
	return timeVocabs;
};

export default migrateTimeVocabs;
