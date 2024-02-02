/* eslint-disable max-len,jsx-a11y/no-static-element-interactions,react/jsx-no-useless-fragment */
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Tooltip } from 'primereact/tooltip';
import { InputText } from 'primereact/inputtext';
import './styles.css';
import { useTranslate } from '@tolgee/react';
import { makeValidationData, makeValidationId, makeValueObject, translate, validateValue } from '../../../../utils';
import FieldInformation from '../../../FieldInformation';
import { HelperContext, ValidationContext } from '../../../../context';
import validationArray from '../../../../pages/EditResource/validationArray';

const Text = (props) => {
	const { t } = useTranslate();
	const { configuration, fieldState, setFieldState, stepValues, setStepValues, id, disabled, parent, externalState, isValid } = props;
	const { helperContextValue } = useContext(HelperContext);
	const { validationContextValue } = useContext(ValidationContext);

	const getInitialValue = () => {
		// get pregenerated values from configuration
		if (configuration.generatedFrom?.field) {
			const temp = stepValues.get(id);
			if (temp) {
				const tempTarget = temp.get(configuration.target);
				if (tempTarget) {
					return tempTarget?.value?.term;
				}
			}
		} else if (configuration.generatedFrom?.outcomeNameFunc) {
			return configuration.generatedFrom.outcomeNameFunc(helperContextValue, stepValues);
		} else if (fieldState) {
			return fieldState;
		}
		return null;
	};
	const [value, setValue] = useState(getInitialValue());
	const [valid, setValid] = useState(typeof isValid == 'boolean' ? isValid : true);
	const timer = useRef();

	useEffect(() => {
		if (typeof isValid == 'boolean') {
			setValid(isValid);
		}
	}, [isValid]);

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

	const validator = useMemo(() => {
		return validationArray.find((field) => field.id === configuration.id);
	}, [validationArray]);

	const validationId = useMemo(() => {
		return makeValidationId(configuration.id, id);
	}, [id, configuration.id]);

	const validationData = useMemo(() => {
		return makeValidationData(validator, validationContextValue, stepValues, id, disabled);
	}, [stepValues, validator]);

	useEffect(() => {
		if (validator?.validate) {
			const v = new Map(validationContextValue.validationStatus);
			const result = validateValue(localState(), validator, setValid, validationData);
			v.set(validationId, result);
			validationContextValue.setValidationStatus(v);
		}
	}, [localState(), validationData]);

	const updateStepValues = () => {
		if (localState() || localState() === '') {
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
			if (configuration.data && !configuration.target) {
				if (stepValues instanceof Map && stepValues.size > 0) {
					if (id) {
						const preset = stepValues.get(id).get(configuration.id);
						if (preset) {
							if (!preset.value) {
								localSetState('');
							} else if (preset.value !== localState()) {
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
		}, [stepValues]
	);

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

	const disableInput = () => {
		if (configuration.linkedField) {
			const temp = stepValues.get(id);
			const linkedField = temp.get(configuration.linkedField.id);
			if (configuration.linkedField.targetValue.includes(linkedField.value)) {
				return false;
			}
		}
		return !!(configuration.disabled || disabled);
	};

	const assignValue = () => {
		if (configuration.disabled && !localState()) {
			return configuration.placeholder;
		}
		return localState();
	};

	return (
		<div className="field">
			<Tooltip target=".status" position="top" />
			<div className="p-inputgroup" style={configuration.style ? configuration.style : {}}>
				<span className="p-float-label">
					<InputText
						id={configuration.id}
						value={assignValue()}
						className={`p-d-block ${valid ? 'valid' : 'p-invalid'}`}
						disabled={disableInput()}
						onChange={(e) => {
							localSetState(e.target.value);
						}}
						placeholder={configuration.placeholder ? translate(t, configuration.placeholder) : ''}
						tooltip={valid ? null : validator?.invalidText}
						tooltipOptions={{ position: 'top', className: 'red-tooltip' }}
					/>
					<label htmlFor={configuration.id}>
						{configuration.definition ? `${translate(t, configuration.definition)} ${translate(t, configuration.label)}` : translate(t, configuration.label)}
					</label>
				</span>
				{configuration.preload ? <span role="button" id="copy" tabIndex={0} aria-label="reset" className="p-inputgroup-addon" onClick={() => navigator.clipboard.writeText(localState())}><i className="fa-solid fa-copy" /></span> : <></>}
				{configuration.addon ? configuration.addon() : null}
				<FieldInformation configuration={configuration} disabled={disabled} />
			</div>
		</div>
	);
};

export default Text;
