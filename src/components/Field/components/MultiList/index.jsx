import React, { useContext, useEffect, useMemo, useState } from 'react';
import './styles.css';
import { Tooltip } from 'primereact/tooltip';
import { MultiSelect } from 'primereact/multiselect';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { useTranslate } from '@tolgee/react';
import {
	makeValidationData,
	makeValidationId,
	makeValueObject,
	translate,
	updateCustomTerms,
	validateValue,
} from '../../../../utils';
import FieldInformation from '../../../FieldInformation';
import {
	GlobalDataContext,
	HelperContext,
	ReviewContext,
	ValidationContext,
	VocabulariesContext,
} from '../../../../context';
// eslint-disable-next-line import/no-cycle
import Field from '../../index';
import validationArray from '../../../../pages/EditResource/validationArray';

const MultiList = (props) => {
	const { configuration, fieldState, setFieldState, externalState, stepValues, setStepValues, id, disabled, customTerm, compositeId, parent, siteId, isValid } = props;
	const [value, setValue] = useState();
	const [disabledStatus, setDisabledStatus] = useState(disabled);
	const { t } = useTranslate();
	
	const { globalDataContextValue } = useContext(GlobalDataContext);
	const { helperContextValue } = useContext(HelperContext);
	const { reviewContextValue } = useContext(ReviewContext);
	const { validationContextValue } = useContext(ValidationContext);
	const { customTerms, setCustomTerms } = reviewContextValue;
	const { vocabulariesContextValue } = useContext(VocabulariesContext);
	const [customValue, setCustomValue] = useState();
	const [customDialog, setCustomDialog] = useState(false);

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

	const [valid, setValid] = useState(typeof isValid == 'boolean' ? isValid : true);

	useEffect(() => {
		if (typeof isValid == 'boolean') {
			// console.log('effect 1');
			setValid(isValid);
		}
	}, [isValid]);

	// useEffect(() => {
	// 	console.log('effect 2');
	// 	console.log(valid);
	// });

	const validator = useMemo(() => {
		return validationArray.find((field) => field.id === configuration.id);
	}, [validationArray]);

	const validationId = useMemo(() => {
		return makeValidationId(configuration.id, id);
	}, [id, configuration.id]);

	const validationData = useMemo(() => {
		return makeValidationData(validator, validationContextValue, stepValues, id, disabled, compositeId);
	}, [stepValues, validator]);

	useEffect(() => {
		if (validator?.validate) {
			const v = new Map(validationContextValue.validationStatus);
			const result = validateValue(localState(), validator, setValid, validationData);
			v.set(validationId, result);
			validationContextValue.setValidationStatus(v);
		}
	}, [localState(), validationData, valid]);

	useEffect(
		() => {
			if (stepValues?.size > 0) {
				if (id) {
					// in this case the List is inside another data component with id.
					if (stepValues.has(id) && stepValues.get(id).has(configuration.id)) {
						const preset = stepValues.get(id).get(configuration.id);
						if (preset) {
							// {term: }
							if (preset.value instanceof Array) {
								localSetState(preset.value);
								// string
							} else if (preset.value !== localState()) {
								localSetState(preset.value);
							}
						}
					}
				} else if (customTerm) {
					// the list is showing a custom term in the review terms page.
					const preset = stepValues.get(customTerm);
					if (preset.value?.term) {
						if (preset.value.term !== localState()?.term) {
							localSetState(preset.value);
						}
					}
				} else {
					// the list is not contained in a parent data component.
					const preset = stepValues.get(configuration.id);
					if (preset) {
						if (preset.value?.term) {
							if (preset.value.term !== localState()?.term) {
								localSetState(preset.value);
							}
						}
					}
				}
			}
		}, [stepValues]);

	useEffect(
		() => {
			if (localState() || localState() === '') {
				if (setStepValues) {
					if (stepValues instanceof Map && stepValues.size > 0 && configuration.data) {
						const newValues = new Map(stepValues);
						if (id) {
							const subMap = newValues.get(id);
							const currentValue = subMap.get(configuration.id);
							if (currentValue) {
								subMap.set(configuration.id, makeValueObject(localState(), currentValue.id, configuration.mandatory));
							} else {
								subMap.set(configuration.id, makeValueObject(localState(), id, configuration.mandatory));
							}
							newValues.set(id, subMap);
						} else {
							newValues.set(configuration.id, makeValueObject(localState()));
						}
						updateCustomTerms(customTerms, setCustomTerms, 'add', compositeId, configuration, localState(), dropdownOptions, parentValue, field?.vocabulary);
						setStepValues(newValues);
					}
				}
			}
		}, [localState()]
	);

	useEffect(() => {
		if (!localState() && configuration.autoFill && dropdownOptions?.length === 1) {
			if (dropdownOptions[0]) {
				localSetState([configuration.options[0]]);
			}
		}
	}, [stepValues]);

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

	const field = useMemo(() => {
		return vocabulariesContextValue.fields?.find((f) => f.uuid === configuration.id);
	}, [vocabulariesContextValue.fields, helperContextValue.helperState]);

	const parentValue = useMemo(() => {
		if (field?.parent !== 'N/A') {
			let parentVal;
			if (configuration.customParentFunction) { // && configuration.dataSource === 'helper') {
				const { helperState } = helperContextValue;
				parentVal = configuration.customParentFunction(helperState);
			} else if (id) {
				parentVal = stepValues?.get(id).get(field?.parent)?.value?.term;
			} else {
				parentVal = stepValues?.get(field?.parent)?.value?.term;
			}
			return parentVal;
		}
		return null;
	}, [stepValues, helperContextValue]);

	const vocabulary = useMemo(() => {
		if (!field) return [];
		if (field?.parent !== 'N/A') {
			if (parentValue) {
				const vocab = vocabulariesContextValue.vocabs[field.vocabulary];
				const temp = vocab.find((v) => v.parent_value === parentValue);
				return temp?.terms;
			}
		} else {
			return vocabulariesContextValue.vocabs[field.vocabulary];
		}
		return [];
	}, [vocabulariesContextValue.vocabs, parentValue, stepValues, helperContextValue.helperState]);

	const generatedVocabData = useMemo(() => {
		if (configuration.dataSource === 'sites') {
			return { sitesData: globalDataContextValue.sitesData };
		}
		if (configuration.dataSource === 'experiments') {
			return { experimentsData: globalDataContextValue.experimentsData, id };
		}
		if (configuration.dataSource === 'timeVocabs') {
			return { timeVocabs: helperContextValue.timeVocabs, siteIds: siteId };
		}
		if (configuration.dataSource === 'timeVocabs-experimentsData') {
			return { timeVocabs: helperContextValue.timeVocabs, experimentsData: stepValues.get(id) };
		}
		if (configuration.dataSource === 'helper') {
			return { helperData: helperContextValue.helperState, vocabulariesContextValue, field };
		}
		return new Map();
	}, [globalDataContextValue, helperContextValue.helperState]);

	const dropdownOptions = useMemo(() => {
		// generated vocabularies
		if (configuration.generatedVocab && configuration?.getOptions && configuration?.genMethod !== 'optionsProperty') {
			return configuration.getOptions(generatedVocabData);
		}

		// pre-specified vocabularies
		let vocab;
		// either passed in configuration as options property
		if (configuration.options) {
			vocab = [...configuration.options];
		} else {
			// or through vocabularies mongo
			vocab = vocabulary ? [...vocabulary] : [];
		}
		// if localState value is custom, add it to vocabulary so that it can be displayed by prime react.
		if (localState()?.userInput) {
			vocab.unshift(localState());
		}

		return vocab;
	}, [vocabulary, localState(), configuration, helperContextValue.helperState]);

	const renderCustomTermIcon = () => {
		if (typeof configuration.editable === 'boolean' ? configuration.editable : true) {
			return (
				<>
					<Tooltip target={`.custom-term-${id ? `${id}-${configuration.id}` : configuration.id}`} />
					<span
						aria-label="Add custom term"
						id="custom"
						className={`p-inputgroup-addon addon-icon custom-term-${id ? `${id}-${configuration.id}` : configuration.id} ${disabled ? 'p-disabled' : 'p-enabled'}`}
						onClick={() => { setCustomDialog(true); }}
						data-pr-tooltip={translate(t, 'Add custom term')}
						role="button"
						tabIndex={0}
					>
						<i className="fa-solid fa-list-dropdown" />
					</span>
					<Dialog className="custom-term-dialog" visible={customDialog} onHide={() => setCustomDialog(false)} header="Add Custom Term">
						<Field
							configuration={{
								type: 'text',
								label: 'Custom Term',
							}}
							fieldState={customValue}
							setFieldState={setCustomValue}
							parent={parent}
							externalState
							disabled={disabled}
						/>
						<div className="button-row">
							<Button
								label={translate(t, 'Add term')}
								onClick={() => {
									setCustomDialog(false);
									const currentState = localState() ? [...localState()] : [];
									currentState.push({ term: customValue, userInput: true });
									localSetState(currentState);
									setCustomValue('');
								}}
							/>
							<Button
								label={translate(t, 'Cancel')}
								outlined
								onClick={() => {
									setCustomDialog(false);
									setCustomValue('');
								}}
							/>
						</div>
					</Dialog>
				</>
			);
		}
		return null;
	};

	return (
		<div className="field" style={configuration.style ? configuration.style : {}}>
			<div className="p-inputgroup">
				<span className="p-float-label">
					<MultiSelect
						className={`p-d-block test ${valid ? 'valid' : 'p-invalid'}`}
						id={id ? `${id}-${configuration.id}` : configuration.id}
						key={id ? `${id}-${configuration.id}` : configuration.id}
						value={localState()}
						onChange={(e) => localSetState(e.value)}
						optionLabel="term"
						options={dropdownOptions}
						filter={configuration.filter}
						disabled={disabledStatus}
						display="chip"
						showClear
						tooltip={valid ? null : validator?.invalidText}
						tooltipOptions={{ position: 'top', className: 'red-tooltip' }}
					/>
					<label htmlFor="username">{translate(t, configuration.label)}</label>
				</span>
				{renderCustomTermIcon()}
				<FieldInformation configuration={configuration} disabled={disabled} />
			</div>
		</div>
	);
};

export default MultiList;
