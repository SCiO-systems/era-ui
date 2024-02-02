const validateValue = (value, validator, setValid, validatorData) => {
	const validatorResult = validator?.validate(value, validatorData);

	setValid(validatorResult);

	return validatorResult;
};

export default validateValue;
