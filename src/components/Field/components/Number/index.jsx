/* eslint-disable max-len,jsx-a11y/no-static-element-interactions,react/jsx-no-useless-fragment, import/no-cycle */
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Tooltip } from 'primereact/tooltip';
import { InputNumber } from 'primereact/inputnumber';
import './styles.css';
import { useTranslate } from '@tolgee/react';
import { makeValueObject, translate, validateValue, makeValidationData, makeValidationId } from '../../../../utils';
import FieldInformation from '../../../FieldInformation';
import List from '../List';
import { ValidationContext } from '../../../../context';
import validationArray from '../../../../pages/EditResource/validationArray';

const Number = (props) => {
	const { configuration, stepValues, setStepValues, fieldState, setFieldState, externalState, id, disabled, parent } = props;

	const [value, setValue] = useState(null);
	const [selectedSuffix, setSelectedSuffix] = useState();
	const [disabledStatus, setDisabledStatus] = useState(disabled);
	const { validationContextValue } = useContext(ValidationContext);
	const [valid, setValid] = useState(true);
	const timer = useRef();
	const { t } = useTranslate();

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
					if (id) {
						if (stepValues.has(id) && stepValues.get(id).has(configuration.id)) {
							const preset = stepValues.get(id).get(configuration.id);
							if (preset) {
								if (preset.value || preset.value === 0) {
									localSetState(preset.value);
								} else {
									localSetState(null);
								}
								if (preset.units) {
									setSelectedSuffix(preset.units);
								}
							}
						}
					} else {
						const preset = stepValues.get(configuration.id);
						if (preset) {
							if (preset.value || preset.value === 0) {
								localSetState(preset.value);
							}
							if (preset.units) {
								setSelectedSuffix(preset.units);
							}
						}
					}
				}
			}
		}, [stepValues]
	);

	const updateStepValues = () => {
		if (localState() || localState() === 0) {
			if (stepValues instanceof Map && stepValues.size > 0 && configuration.data) {
				const newValues = new Map(stepValues);
				if (id) {
					const subMap = newValues.get(id);
					const tempObject = makeValueObject(localState(), id);
					if (selectedSuffix) {
						tempObject.units = selectedSuffix;
					}
					subMap.set(configuration.id, tempObject);
					newValues.set(id, subMap);
				} else {
					const tempObject = makeValueObject(localState());
					if (selectedSuffix) {
						tempObject.units = selectedSuffix;
					}
					newValues.set(configuration.id, tempObject);
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
		}, [localState(), selectedSuffix]
	);

	const validator = useMemo(() => {
		return validationArray?.find((field) => field.id === configuration.id);
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

	useEffect(() => {
		if (validator?.validate && validator?.editValidationHelper) {
			validator?.editValidationHelper(stepValues, validationData);
		}
	}, [stepValues]);

	// this handles updating of units. the initial stepValues set only works on load.
	useEffect(
		() => {
			const units = getUnits();
			if (units) {
				setSelectedSuffix(units);
			}
		}, [stepValues]
	);

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

	const setUnitsScheme = (unitsConfig) => {
		if (unitsConfig) {
			if (unitsConfig === 'self') {
				return 'self';
			}
			if (unitsConfig === 'suffix') {
				return 'suffix';
			}
			return 'group';
		}
		return '';
	};

	const unitsScheme = setUnitsScheme(configuration.units);

	const getUnits = () => {
		if (stepValues?.size > 0) {
			if (unitsScheme === 'group') {
				if (id) {
					const temp = stepValues.get(id);
					const unitsVal = temp.get(configuration.units);
					return unitsVal.units;
				}
				const unitsVal = stepValues.get(configuration.units);
				if (unitsVal.units) {
					return unitsVal.units;
				}
			}
			if (unitsScheme === 'self') {
				return selectedSuffix;
			}
			if (unitsScheme === 'suffix') {
				return configuration.suffix.trimStart();
			}
		}
		return '';
	};

	const setSuffixGroup = (val) => {
		let unitVal;
		if (typeof val === 'undefined') {
			unitVal = 'N/A';
			setSelectedSuffix('N/A');
		} else {
			unitVal = val;
			setSelectedSuffix(val);
		}
		if (unitsScheme === 'group') {
			const temp = new Map(stepValues);
			if (id) {
				const targetRow = temp.get(id);
				const unitTarget = targetRow.get(configuration.units);
				unitTarget.units = unitVal;
				targetRow.set(configuration.units, unitTarget);
				temp.set(id, targetRow);
				setStepValues(temp);
			} else {
				const unitTarget = temp.get(configuration.units);
				unitTarget.units = unitVal;
				temp.set(configuration.units, unitTarget);
				setStepValues(temp);
			}
		}
	};

	const renderSuffixBox = () => {
		if (configuration.suffix) {
			return <span className={`p-inputgroup-addon suffix ${disabled ? 'p-disabled' : 'p-enabled'}`} id="info" style={{ textAlign: 'center' }}><p>{translate(t, configuration.suffix)}</p></span>;
		}
		return <div />;
	};
	
	const renderUnitsDropdown = () => {
		if (configuration.units && configuration.units !== 'suffix') {
			return (
				<div className="units-dropdown">
					<List
						configuration={{
							id: configuration.id,
							maxWords: 1,
							editable: false,
							placeholder: 'Unit',
						}}
						fieldState={selectedSuffix}
						setFieldState={setSuffixGroup}
						parent={parent}
						externalState
						disabled={disabled}
					/>
				</div>

			);
		}
		return <></>;
	};

	const renderUnitsIcon = () => {
		if (configuration.units && configuration.units !== 'suffix') {
			return (
				<span className={`p-inputgroup-addon units ${disabled ? 'p-disabled' : 'p-enabled'}`}>
					<i className="fa-solid fa-ruler units-icon" />
				</span>
			);
		}
		return <></>;
	};

	return (
		<div className="field" style={configuration.style ? configuration.style : {}}>
			<Tooltip target=".status" position="top" />
			<div className="p-inputgroup number-field">
				<span className="p-float-label">
					<InputNumber
						id={configuration.id}
						className={`p-d-block main-input ${valid ? 'valid' : 'p-invalid'}`}
						value={localState()}
						onChange={(e) => {
							if (e.value || e.value === 0) {
								localSetState(e.value);
							} else {
								// caught stepValues update. if field was just initialized, value is null. if it has
								// been emptied by a user change (onChange) it is ''.
								localSetState('');
							}
						}}
						minFractionDigits={0}
						maxFractionDigits={configuration.fractionDigits || 0}
						disabled={disabledStatus}
						tooltip={valid ? null : validator?.invalidText}
						tooltipOptions={{ position: 'top', className: 'red-tooltip' }}
					/>
					<label htmlFor={configuration.id}>{translate(t, configuration.label, configuration.tolgeeKey)}</label>
				</span>
				{renderUnitsIcon()}
				{renderSuffixBox()}
				{renderUnitsDropdown()}
				<FieldInformation configuration={configuration} disabled={disabled} />
			</div>
		</div>
	);
};

export default Number;
