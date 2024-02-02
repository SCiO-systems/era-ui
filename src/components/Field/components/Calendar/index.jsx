/* eslint-disable max-len,jsx-a11y/no-static-element-interactions,react/jsx-no-useless-fragment */
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Tooltip } from 'primereact/tooltip';
import { useTranslate } from '@tolgee/react';
import { Calendar } from 'primereact/calendar';
import { translate, makeValueObject, validateValue, makeValidationId, makeValidationData } from '../../../../utils';
import './styles.css';
import FieldInformation from '../../../FieldInformation';
import { ValidationContext } from '../../../../context';
import validationArray from '../../../../pages/EditResource/validationArray';

const CalendarField = (props) => {
	const { t } = useTranslate();
	const { configuration, stepValues, setStepValues, id, disabled } = props;

	const [value, setValue] = useState();
	const [disabledStatus, setDisabledStatus] = useState(disabled);
	const { validationContextValue } = useContext(ValidationContext);
	const [valid, setValid] = useState(true);

	useEffect(
		() => {
			if (stepValues.size > 0) {
				if (!value) {
					if (id) {
						const preset = stepValues.get(id).get(configuration.id);
						if (preset) {
							if (preset.value) {
								setValue(new Date(preset.value));
							}
						}
					}
					const preset = stepValues.get(configuration.id);
					if (preset) {
						if (preset.value) {
							setValue(new Date(preset.value));
						}
					}
				}
			}
		}, [stepValues]
	);

	useEffect(
		() => {
			if (stepValues instanceof Map) {
				const newValues = new Map(stepValues);
				if (id) {
					const newField = newValues.get(id);
					newField.set(configuration.id, makeValueObject(value, id, configuration.mandatory));
					newValues.set(id, newField);
				} else {
					newValues.set(configuration.id, makeValueObject(value));
				}
				setStepValues(newValues);
			}
		}, [value]
	);

	const validator = useMemo(() => {
		return validationArray.find((field) => field.id === configuration.id);
	}, [validationArray]);

	const validationId = useMemo(() => {
		return makeValidationId(configuration.id, id);
	}, [id, configuration.id]);

	const validationData = useMemo(() => {
		return makeValidationData(validator, validationContextValue, stepValues, id, disabledStatus);
	}, [stepValues, validator, disabledStatus]);

	useEffect(() => {
		if (validator?.validate && validator?.editValidationHelper) {
			validator?.editValidationHelper(stepValues, validationData);
		}
	}, [stepValues]);

	useEffect(() => {
		if (validator?.validate) {
			const v = new Map(validationContextValue.validationStatus);
			const result = validateValue(value, validator, setValid, validationData);
			v.set(validationId, result);
			validationContextValue.setValidationStatus(v);
		}
	}, [value, validationData]);

	useEffect(() => {
		if (disabled) {
			setDisabledStatus(true);
		} else if (configuration.isDisabled) {
			setDisabledStatus(configuration.isDisabled(stepValues, id));
		} else if (configuration.disabled) {
			setDisabledStatus(configuration.disabled);
		} else {
			setDisabledStatus(false);
		}
	}, [stepValues, disabled]);

	return (
		<div className="field" style={configuration.style ? configuration.style : {}}>
			<Tooltip target=".status" position="top" />
			<div className="p-inputgroup">
				<span className="p-float-label">
					<Calendar
						id={configuration.id}
						className={`p-d-block ${valid ? 'valid' : 'p-invalid'}`}
						disabled={disabledStatus}
						selectionMode="single"
						value={value}
						onChange={(e) => {
							if (validator?.validate) {
								const v = new Map(validationContextValue.validationStatus);
								const result = validateValue(e, validator, setValid, validationData);
								setValue(e.value);
								v.set(validationId, result);
								validationContextValue.setValidationStatus(v);
							} else {
								setValue(e.value);
							}
						}}
						showIcon
						view={configuration.year ? 'year' : 'date'}
						dateFormat={configuration.year ? 'yy' : 'dd/mm/yy'}
						maxDate={configuration.maxDate ? new Date() : null}
						tooltip={valid ? null : validator?.invalidText}
						tooltipOptions={{ position: 'top', className: 'red-tooltip' }}
					/>
					<label htmlFor="username">{translate(t, configuration.label)}</label>
				</span>
				<FieldInformation configuration={configuration} disabled={disabled} />
			</div>
		</div>
	);
};

export default CalendarField;
