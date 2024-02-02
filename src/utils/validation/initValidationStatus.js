import validationArray from '../../pages/EditResource/validationArray';

const initValidationStatus = (validationContextValue) => {
	const statusMap = new Map();
	validationArray.forEach((field) => {
		if (field.mandatory && !field.nested) {
			statusMap.set(field.id, false);
		}
	});
	validationContextValue.setValidationStatus(statusMap);
};

export default initValidationStatus;
