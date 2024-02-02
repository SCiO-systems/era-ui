/* eslint-disable max-len,jsx-a11y/no-static-element-interactions,react/jsx-no-useless-fragment */
import React, { useEffect, useRef, useState } from 'react';
import { Tooltip } from 'primereact/tooltip';
import { InputTextarea } from 'primereact/inputtextarea';
import './styles.css';
import { useTranslate } from '@tolgee/react';
import { makeValueObject, translate } from '../../../../utils';
import FieldInformation from '../../../FieldInformation';

const TextArea = (props) => {
	const { configuration, stepValues, setStepValues, fieldState, setFieldState, externalState, id, disabled, parent } = props;

	const { t } = useTranslate();
	const getInitialValue = () => {
		if (configuration.target) {
			const temp = stepValues.get(id);
			if (temp) {
				const tempTarget = temp.get(configuration.target);
				if (tempTarget) {
					return tempTarget.value;
				}
			}
		}
		return null;
	};

	const [value, setValue] = useState(getInitialValue());
	const timer = useRef();

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
			if (configuration.data) {
				if (stepValues instanceof Map && stepValues.size > 0) {
					if (localState() == null) {
						const tempStep = new Map(stepValues);
						if (id) {
							const preset = tempStep.get(id).get(configuration.id);
							if (preset) {
								if (preset.value) {
									localSetState(preset.value);
								} else {
									localSetState(null);
								}
							}
						} else {
							const preset = stepValues.get(configuration.id);
							if (preset) {
								if (preset.value) {
									localSetState(preset.value);
								}
							}
						}
					}
				}
			}
		}, [stepValues]
	);

	const updateStepValues = () => {
		if (localState()) {
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
	};

	useEffect(
		() => {
			if (parent === 'input-table') {
				clearTimeout(timer.current);
				timer.current = setTimeout(() => {
					updateStepValues();
				}, 200);
			} else {
				updateStepValues();
			}
		}, [localState()]
	);

	return (
		<div className="field">
			<Tooltip target=".status" position="top" />
			<div className="p-inputgroup">
				<span className="p-float-label">
					<InputTextarea
						id={configuration.id}
						className="p-d-block"
						disabled={configuration.disabled || disabled}
						value={localState()}
						onChange={(e) => {
							localSetState(e.target.value);
						}}
						rows={3}
					/>
					<label htmlFor="username">
						{configuration.definition ? `${translate(t, configuration.definition)} ${translate(t, configuration.label)}` : translate(t, configuration.label)}
					</label>
				</span>
				<FieldInformation configuration={configuration} disabled={disabled} />
			</div>
		</div>
	);
};

export default TextArea;
