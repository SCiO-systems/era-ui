import React, { useContext, useEffect, useState } from 'react';
import './styles.css';
import { makeValueObject } from '../../../../../../utils';
import { GlobalDataContext } from '../../../../../../context';
// eslint-disable-next-line import/no-cycle
import Field from '../../../../index';

const CustomTerm = (props) => {
	const { configuration, stepValues, setStepValues, id, disabled } = props;
	const [value, setValue] = useState();
	const { globalDataContextValue } = useContext(GlobalDataContext);

	useEffect(() => {
		if (stepValues) {
			setValue(stepValues.get(id)?.value);
		}
	}, []);

	useEffect(() => {
		if (disabled) return;
		if (!value) return;

		const idArray = id.split('_');
		const { state, setState } = findSection(idArray[0], globalDataContextValue);
		const tempState = new Map(state);

		const searchMapExhaustive = (stateVar, idArr, ind) => {
			// recursively access Maps nested in other Maps from an array of keys
			const currId = idArr[ind];
			let newState = stateVar;
			if (stateVar instanceof Map) {
				stateVar.forEach((val, key) => {
					if (key === currId) {
						// eslint-disable-next-line no-param-reassign
						ind += 1;
						newState.set(key, searchMapExhaustive(val, idArr, ind));
					}
				});
			} else {
				newState = makeValueObject(value);
			}
			return newState;
		};

		const index = 1;
		const temp2 = searchMapExhaustive(tempState, idArray, index);
		setState(temp2);

		// finally update custom terms state
		const tempStep = new Map(stepValues);
		const temp3 = tempStep.get(id);
		temp3.value = value;
		tempStep.set(id, temp3);
		setStepValues(tempStep);
	}, [value, disabled]);

	const findSection = (baseId, contextValue) => {
		switch (baseId) {
		case '9fde36dd-a5ff-46d8-a592-04fcd88af346':
			return { state: contextValue.bibliographicData, setState: contextValue.setBibliographicData };
		case '6a271d18-686e-4a1a-bd79-95c30f94c922':
			return { state: contextValue.experimentsData, setState: contextValue.setExperimentsData };
		case 'a02a64ce-8637-46fb-ad52-301e5e616f2d':
			return { state: contextValue.sitesData, setState: contextValue.setSitesData };
		case '6d3e2ad7-97a6-4b3f-916a-62f5e00cc709':
			return { state: contextValue.timeData, setState: contextValue.setTimeData };
		case '42427846-00ac-4d36-b3b9-4ae2e9f4b0e9':
			return { state: contextValue.timeData, setState: contextValue.setTimeData };
		default:
			break;
		}
		return null;
	};

	return (
		<Field
			configuration={{ ...configuration, type: 'list', editable: configuration.customTermEditMode !== 'manual' }}
			fieldState={value}
			setFieldState={setValue}
			externalState
			disabled={disabled}
		/>
	);
};

export default CustomTerm;
