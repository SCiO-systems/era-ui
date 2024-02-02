import React from 'react';
import './styles.css';
// eslint-disable-next-line import/no-cycle
import Field from '../../../../index';

const Intercropping = (props) => {
	const { configuration, id, stepValues, setStepValues, compositeId, disabled, cropCount } = props;
	const renderFields = () => {
		if (cropCount > 1) {
			return configuration.content.map((item) => {
				return <Field configuration={item} stepValues={stepValues} setStepValues={setStepValues} compositeId={compositeId} id={id} disabled={disabled} />;
			});
		}
		return null;
	};
	
	return (
		<>
			{renderFields()}
		</>
	);
};

export default Intercropping;
