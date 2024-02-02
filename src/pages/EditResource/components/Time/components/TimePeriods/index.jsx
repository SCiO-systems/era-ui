import React, { useContext, useMemo } from 'react';
import './styles.css';
import configurationLivestock from './configurationLivestock';
import configurationCrop from './configurationCrop';
import Field from '../../../../../../components/Field';
import { HelperContext } from '../../../../../../context';

const TimePeriods = (props) => {
	const { stepValues, setStepValues } = props;
	const { helperContextValue } = useContext(HelperContext);

	const configuration = useMemo(() => {
		// if (helperContextValue.editing.submissionType === 'crop') {
		// 	return configurationCrop;
		// } if (helperContextValue.editing.submissionType === 'livestock') {
		// 	return configurationLivestock;
		// }
		// return [];
		return configurationCrop;
	}, [helperContextValue.editing]);
	
	const bodyTemplate = (data, col, localState, setLocalState) => {
		const tempFieldConfig = configuration.content.find((field) => field.col === col.field);
		const isDisabled = () => {
			if (tempFieldConfig.id === '5fec44e2-cb3c-42ee-91cf-e29c2b1dae54') {
				return !!helperContextValue.lockedEntities.timePeriods?.includes(data.key);
			} 
			return false;
		};

		return <Field configuration={tempFieldConfig} stepValues={localState} setStepValues={setLocalState} disabled={isDisabled()} id={data.key} parent="input-table" />;
	};

	const isLocked = (data) => {
		return helperContextValue.lockedEntities.timePeriods?.includes(data.key);
	};

	return (
		<Field configuration={configuration} stepValues={stepValues} setStepValues={setStepValues} customFunctions={{ bodyTemplate, isLocked }} />
	);
};

export default TimePeriods;
