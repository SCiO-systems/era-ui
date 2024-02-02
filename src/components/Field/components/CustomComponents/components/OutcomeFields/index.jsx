import React, { useMemo, useEffect } from 'react';
// eslint-disable-next-line import/no-cycle
import Field from '../../../../index';

const OutcomeFields = (props) => {
	const { stepValues, setStepValues, id, compositeId, disabled } = props;
    
	const configuration = useMemo(() => {
		console.log(stepValues);
		console.log(id);
		console.log(stepValues?.get(id).get('c9a5bdbe-044d-40fd-9b46-4cee6d2b9256'));
		const outcome = stepValues?.get(id).get('c9a5bdbe-044d-40fd-9b46-4cee6d2b9256')?.value?.term;
		console.log(outcome);
	}, [stepValues]);

	useEffect(() => {
		console.log(stepValues);
	}, [stepValues]);
	const renderFields = () => {
		return null;
		// return configuration.map((item) => {
		// 	return (
		// 		<Field configuration={item} stepValues={stepValues} setStepValues={setStepValues} id={id} disabled={disabled} compositeId={compositeId} />
		// 	);
		// });
	};
	return (
		renderFields()
	);
};

export default OutcomeFields;
