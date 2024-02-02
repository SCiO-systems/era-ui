import React, { useState, useEffect, useContext, useMemo } from 'react';
import configurationCrop from './configurationCrop';
import configurationLivestock from './configurationLivestock';
import Field from '../../../../../components/Field';
import './styles.css';
import { GlobalDataContext, HelperContext } from '../../../../../context';

const EnterData = (props) => {
	const { stepValues, setStepValues, selectedExperiment, compositeId } = props;

	const [localFields, setLocalFields] = useState(new Map());
	const { globalDataContextValue } = useContext(GlobalDataContext);
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
				}
			}
		}
	}, []);

	useEffect(() => {
		if (localFields.size > 0) {
			const tempStep = new Map(stepValues);
			const tempExperiment = tempStep.get(selectedExperiment);
			tempExperiment.set(configuration.id, localFields);
			tempStep.set(selectedExperiment, tempExperiment);
			setStepValues(tempStep);
		}
	}, [localFields]);

	const bodyTemplate = (data, col, localState, setLocalState, c, id, compId) => {
		const assignConfig = () => {
			const conf = configuration.content.find((item) => item.col === col.field);

			if (localState.size === 0) return { ...conf };
			if (!col.custom) return { ...conf };

			switch (col.field) {
			case 'site': {
				conf.options = conf.getOptions(stepValues, selectedExperiment, globalDataContextValue.sitesData, localState, data.key);
				break;
			}
			case 'time_period': {
				conf.options = conf.getOptions(stepValues, helperContextValue.timeVocabs, data);
				break;
			}
			case 'treatment': {
				conf.options = conf.getOptions(stepValues, selectedExperiment, data);
				break;
			}
			case 'product': {
				conf.options = conf.getOptions(stepValues, selectedExperiment, localState, data.key);
				break;
			}
			case 'rotation': {
				conf.options = conf.getOptions(stepValues, selectedExperiment);
				break;
			}
			case 'outcome': {
				conf.options = conf.getOptions(stepValues, selectedExperiment);
				break;
			}
			case 'outcome_unit': {
				const selectedOutcome = localState.get(data.key).get('42c266fb-b9a8-49f6-abdb-8caf9c989285')?.value;
				const outcomesTable = stepValues?.get(selectedExperiment)?.get('feec0c82-0fbf-475f-a3e4-3331ed601438')?.get('55c0c7f9-95b9-471c-bb51-a4ce0d1a4f4f');
				if (outcomesTable?.size > 0) {
					conf.placeholder = outcomesTable.get(selectedOutcome?.id)?.get('930e3bff-b271-440d-9767-053391e0d5f1').value;
				}
				break;
			}
			case 'comparison_treatment': {
				conf.options = conf.getOptions(stepValues, selectedExperiment);
				break;
			}
			default:
				break;
			}
			return { ...conf };
		};
		const config = assignConfig();
		config.colLabel = col.header;
		return <Field configuration={config} stepValues={localState} setStepValues={setLocalState} id={data.key} compositeId={`${compId}_${data.key}`} parent="input-table" />;
	};

	return (
		<Field configuration={configuration} stepValues={localFields} setStepValues={setLocalFields} customFunctions={{ bodyTemplate }} compositeId={`${compositeId}_${configuration.id}`} />
	);
};

export default EnterData;
