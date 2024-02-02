import validationArray from '../../pages/EditResource/validationArray';
// eslint-disable-next-line import/no-cycle
import { makeValidationData, makeValidationId, validateValue } from '../index';

const validateInputTableFields = (configuration, validationContextValue, newStep, disabled) => {
	const valFields = configuration.content?.filter((c) => c.validation) || [];
	if (valFields.length > 0) {
		const valStatus = new Map(validationContextValue.validationStatus);
		newStep?.forEach((row, key) => {
			valFields.forEach((field) => {
				const validator = validationArray.find((f) => f.id === field.id);
				const validationId = makeValidationId(field.id, key);

				const validationData = makeValidationData(validator, validationContextValue, newStep, key, disabled);

				const empty = (a) => {
					return undefined;
				};
				if (row.get(field.id).value) {
					const result = validateValue(row.get(field.id), validator, empty, validationData);
					valStatus.set(validationId, result);
				}
			});
		});
		validationContextValue.setValidationStatus(valStatus);
	}
};

export default validateInputTableFields;
