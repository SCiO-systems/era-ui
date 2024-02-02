/* eslint-disable max-len */
import React from 'react';
import configuration from './configuration';
import Field from '../../../../../../components/Field';
import './styles.css';

const HerdGroup = (props) => {
	const { selectedExperiment, stepValues, setStepValues } = props;

	const renderFields = () => {
		return (configuration.content.map((item) => {
			return <Field configuration={item} stepValues={stepValues} setStepValues={setStepValues} disabled={item.disabled} id={selectedExperiment} compositeId={`${selectedExperiment}_${configuration.id}`} />;
		})
		);
	};

	return (
		<div className="outcomes">
			{renderFields()}
		</div>
	);
};

export default HerdGroup;
