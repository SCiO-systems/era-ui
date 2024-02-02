/* eslint-disable max-len */
import React, { useContext, useEffect, useMemo, useState } from 'react';
import './styles.css';
import configurationCrop from './configurationCrop';
import configurationLivestock from './configurationLivestock';
import Field from '../../../../../components/Field';
import { makeValueObject } from '../../../../../utils';
import { HelperContext } from '../../../../../context';

const Outcomes = (props) => {
	const { selectedExperiment, stepValues, setStepValues, compositeId } = props;
	const [localFields, setLocalFields] = useState(new Map());
	const { helperContextValue } = useContext(HelperContext);

	const configuration = useMemo(() => {
		if (helperContextValue.editing.submissionType === 'crop') {
			return configurationCrop;
		} if (helperContextValue.editing.submissionType === 'livestock') {
			return configurationLivestock;
		}
		return [];
	}, [helperContextValue.editing]);

	useEffect(() => {
		if (localFields.size === 0) {
			const temp = stepValues.get(selectedExperiment);
			if (temp.size > 0 && temp.has(configuration.id)) {
				const tempLocal = temp.get(configuration.id);
				if (tempLocal?.size > 0) {
					setLocalFields(new Map(tempLocal));
				} else {
					const values = new Map();
					configuration.content.forEach((item) => {
						if (item.data === 'table') {
							values.set(item.id, new Map());
						} else if (item.data) {
							values.set(item.id, makeValueObject());
						}
					});
					setLocalFields(values);
				}
			}
		}
	}, []);

	useEffect(() => {
		if (localFields.size > 0) {
			const tempStep = new Map(stepValues);
			const tempExperiment = tempStep.get(selectedExperiment);
			tempExperiment.set(configuration.id, localFields);
			const outcomes = localFields.get('55c0c7f9-95b9-471c-bb51-a4ce0d1a4f4f').size;
			helperContextValue.setHelperState({ ...helperContextValue.helperState, outcomeId: outcomes + 1 });
			tempStep.set(selectedExperiment, tempExperiment);
			setStepValues(tempStep);
		}
	}, [localFields]);

	const renderFields = () => {
		return (configuration.content.map((item) => {
			return <Field configuration={item} stepValues={localFields} setStepValues={setLocalFields} disabled={item.disabled} compositeId={`${compositeId}_${configuration.id}`} />;
		})
		);
	};

	return (
		<div className="outcomes">
			{renderFields()}
		</div>
	);
};

export default Outcomes;
