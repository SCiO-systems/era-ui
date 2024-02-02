/* eslint-disable max-len */
import React, { useContext, useMemo } from 'react';
import Field from '../../../../../../components/Field';
import configurationCrop from './configurationCrop';
import configurationLivestock from './configurationLivestock';
import './styles.css';
import { HelperContext } from '../../../../../../context';

const ExperimentalDesign = (props) => {
	const { selectedExperiment, stepValues, setStepValues, compositeId } = props;
	const { helperContextValue } = useContext(HelperContext);

	const configuration = useMemo(() => {
		if (helperContextValue.editing.submissionType === 'crop') {
			return configurationCrop;
		} if (helperContextValue.editing.submissionType === 'livestock') {
			return configurationLivestock;
		}
		return [];
	}, [helperContextValue.editing]);
	
	const renderFields = () => configuration.content.map((item) => <Field configuration={item} stepValues={stepValues} setStepValues={setStepValues} id={selectedExperiment} compositeId={compositeId} />);

	return (
		<div className="experimental-design">
			{renderFields()}
		</div>
	);
};

export default ExperimentalDesign;
