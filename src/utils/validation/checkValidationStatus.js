const checkValidationStatus = (validationContextValue) => {
	let valid = true;
	validationContextValue.validationStatus.forEach((result) => {
		if (!result) {
			valid = false;
		}
	});
	return valid;
};

export default checkValidationStatus;
