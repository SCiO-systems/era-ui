import React from 'react';
// eslint-disable-next-line import/no-cycle
import {
	LatLongCalculator,
	Selector,
	Uploader,
	BreedDialog,
	Intercropping,
	CustomTerm, OutcomeFields,
} from './components';

const CustomComponents = (props) => {
	const { configuration, stepValues, setStepValues, id, compositeId, disabled, cropCount } = props;
	const renderComponent = () => {
		switch (configuration.custom) {
		case ('latlong'):
			return (
				<LatLongCalculator
					configuration={configuration}
					stepValues={stepValues}
					setStepValues={setStepValues}
					id={id}
				/>
			);
		case ('selector'):
			return (
				<Selector
					configuration={configuration}
					stepValues={stepValues}
					setStepValues={setStepValues}
				/>
			);
		case ('custom-term'):
			return (
				<CustomTerm
					configuration={configuration}
					stepValues={stepValues}
					id={id}
					setStepValues={setStepValues}
					disabled={disabled}
				/>
			);
		case ('uploader'):
			return (
				<Uploader
					configuration={configuration}
					stepValues={stepValues}
					setStepValues={setStepValues}
				/>
			);
		// case ('preloadedText'):
		// 	return (
		// 		<PreloadedText
		// 			configuration={configuration}
		// 			stepValues={stepValues}
		// 			setStepValues={setStepValues}
		// 			id={id}
		// 		/>
		// 	);
		case ('planting-intercrop'):
			return (
				<Intercropping
					configuration={configuration}
					stepValues={stepValues}
					setStepValues={setStepValues}
					id={id}
					compositeId={compositeId}
					disabled={disabled}
					cropCount={cropCount}
				/>
			);
		case ('breed-dialog'):
			return (
				<BreedDialog
					configuration={configuration}
					stepValues={stepValues}
					setStepValues={setStepValues}
					id={id}
					compositeId={compositeId}
					disabled={disabled}
				/>
			);
		case ('outcome-fields'):
			return (
				<OutcomeFields
					configuration={configuration}
					stepValues={stepValues}
					setStepValues={setStepValues}
					id={id}
					compositeId={compositeId}
					disabled={disabled}
				/>
			);
		default:
			return null;
		}
	};
	return (
		<>
			{renderComponent()}
		</>
	);
};

export default CustomComponents;
