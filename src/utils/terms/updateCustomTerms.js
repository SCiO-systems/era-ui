const updateCustomTerms = (termsMap, setTermsMap, operation, compositeId, config, val, options, parentVal, vocabName) => {
	let fieldId;
	let fullId;
	if (config?.generatedVocab) {
		return;
	}
	if (config) {
		fieldId = config.id;
	}
	if (compositeId) {
		fullId = `${compositeId}_${fieldId}`;
	} else {
		fullId = fieldId;
	}

	const isCustom = (value) => {
		if (termsMap.has(fullId)) {
			return true;
		}
		if (value instanceof Array) {
			let flag = false;
			value.forEach((e) => {
				if (e.userInput) {
					flag = true;
				}
			});
			return flag;
		}
		if (value) {
			return !!value.userInput;
		}
		return false;
	};

	const addOrUpdateTerm = (termId, newMap) => {
		const currentTerm = newMap.get(termId);
		if (currentTerm) {
			currentTerm.value = val;
			currentTerm.parentValue = parentVal;
			currentTerm.vocabulary = vocabName;
			newMap.set(termId, currentTerm);
		} else {
			const configuration = { ...config };
			delete configuration.definition;
			configuration.type = 'custom';
			configuration.custom = 'custom-term';
			configuration.editable = false;
			if (config.colLabel) {
				configuration.label = config.colLabel;
				delete configuration.colLabel;
			}
			newMap.set(termId, { value: val, parentValue: parentVal, configuration, vocabulary: vocabName });
		}
	};

	const deleteTerms = (termId, newMap) => {
		const iterationMap = new Map(newMap);
		iterationMap.forEach((value, key) => {
			if (key.includes(termId)) {
				newMap.delete(key);
			}
		});
	};

	const updateTerm = (newMap) => {
		if (operation === 'add' && options) {
			if (isCustom(val)) {
				addOrUpdateTerm(fullId, newMap);
			} else {
				deleteTerms(fieldId, newMap);
			}
		} else if (operation === 'delete' && options) {
			deleteTerms(compositeId, newMap);
		}
	};

	if (setTermsMap) {
		const newTermsMap = new Map(termsMap);
		updateTerm(newTermsMap);
		setTermsMap(newTermsMap);
	} else {
		updateTerm(termsMap);
	}
};

export default updateCustomTerms;
