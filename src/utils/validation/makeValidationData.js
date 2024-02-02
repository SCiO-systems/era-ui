const makeValidationData = (validator, validationContextValue, stepValues, id, disabled, compositeId) => {
	if (validator?.validate) {
		const data = { validationContextValue };
		if (validator?.validationData?.includes('stepValues')) {
			data.stepValues = stepValues;
		}
		if (validator?.validationData?.includes('id')) {
			data.id = id;
		}
		if (validator?.validationData?.includes('disabled')) {
			data.disabled = disabled;
		}
		if (validator?.validationData?.includes('compositeId')) {
			data.compositeId = compositeId;
		}
		return data;
	}
	return new Map();
};

export default makeValidationData;
