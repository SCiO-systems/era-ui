/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect, useState } from 'react';
import { useTranslate } from '@tolgee/react';
import { Checkbox } from 'primereact/checkbox';
import { makeValueObject, translate } from '../../../../utils';
import './styles.css';
import FieldInformation from '../../../FieldInformation';

const CheckBox = (props) => {
	const { configuration, stepValues, setStepValues, fieldState, setFieldState, externalState, id, disabled } = props;
	const { t } = useTranslate();
	const [value, setValue] = useState();

	const localState = () => {
		if (externalState) {
			return fieldState;
		}
		return value;
	};
	const localSetState = (setVal) => {
		if (externalState) {
			return setFieldState(setVal);
		}
		return setValue(setVal);
	};

	useEffect(
		() => {
			if (typeof localState() === 'undefined') {
				if (configuration.data && !configuration.target) {
					if (stepValues instanceof Map && stepValues.size > 0) {
						if (id) {
							const preset = stepValues.get(id).get(configuration.id);
							if (preset) {
								if (preset.value !== localState()) {
									localSetState(preset.value);
								}
							}
						} else {
							const preset = stepValues.get(configuration.id);
							if (preset) {
								if (preset.value !== localState()) {
									localSetState(preset.value);
								}
							}
						}
					}
				}
			}
		}, [stepValues]
	);

	useEffect(
		() => {
			if (typeof localState() !== 'undefined') {
				if (stepValues instanceof Map && stepValues.size > 0 && configuration.data) {
					const newValues = new Map(stepValues);
					if (id) {
						const subMap = newValues.get(id);
						subMap.set(configuration.id, makeValueObject(localState(), id, configuration.mandatory));
						newValues.set(id, subMap);
					} else {
						newValues.set(configuration.id, makeValueObject(localState()));
					}
					setStepValues(newValues);
				}
			}
		}, [localState()]
	);

	return (
		<div className="field" style={configuration.style ? configuration.style : {}}>
			<div className="p-inputgroup">
				<div className="flex align-items-center checkbox-label-group">
					<Checkbox inputId="isControl" checked={localState()} onChange={(e) => localSetState(e.checked)} />
					<label htmlFor="isControl" className="ml-2 checkbox-label">{translate(t, configuration.label)}</label>
				</div>
				<FieldInformation configuration={configuration} disabled={disabled} />
			</div>
		</div>
	);
};

export default CheckBox;
