/* eslint-disable max-len,jsx-a11y/no-static-element-interactions,react/jsx-no-useless-fragment,no-nested-ternary */
import React, { useEffect, useState, useContext, useRef, useMemo } from 'react';
import { Tooltip } from 'primereact/tooltip';
import { Dropdown } from 'primereact/dropdown';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import './styles.css';
import { useTranslate } from '@tolgee/react';
import { InputTextarea } from 'primereact/inputtextarea';
import {
	makeValidationData,
	makeValidationId,
	makeValueObject,
	translate,
	updateCustomTerms,
	validateValue,
} from '../../../../utils';
import { ReviewContext, GlobalDataContext, HelperContext, VocabulariesContext, ValidationContext } from '../../../../context';
import FieldInformation from '../../../FieldInformation';
// eslint-disable-next-line import/no-cycle
import Field from '../../index';
import validationArray from '../../../../pages/EditResource/validationArray';

const List = (props) => {
	const { configuration, fieldState, setFieldState, externalState, stepValues, setStepValues, id, disabled, customTerm, compositeId, parent, siteId } = props;

	const [value, setValue] = useState();
	const [definitionValue, setDefinitionValue] = useState(configuration.definition ? configuration.definition.placeholder : '');
	const { t } = useTranslate();

	const { globalDataContextValue } = useContext(GlobalDataContext);
	const { helperContextValue } = useContext(HelperContext);
	const { reviewContextValue } = useContext(ReviewContext);
	const { vocabulariesContextValue } = useContext(VocabulariesContext);
	const { validationContextValue } = useContext(ValidationContext);
	const { customTerms, setCustomTerms } = reviewContextValue;
	const dropdownRef = useRef();
	const op = useRef();
	const [renderTooltip, setRenderTooltip] = useState(false);
	const [disabledStatus, setDisabledStatus] = useState(disabled);
	const [customValue, setCustomValue] = useState();
	const [customDialog, setCustomDialog] = useState(false);
	const [valid, setValid] = useState(true);

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
		return validationArray?.find((field) => field.id === configuration.id);
	}, [validationArray]);

	const validationId = useMemo(() => {
		return makeValidationId(configuration.id, id);
	}, [id, configuration.id]);

	const validationData = useMemo(() => {
		return makeValidationData(validator, validationContextValue, stepValues, id, disabledStatus, compositeId);
	}, [stepValues, validator, disabledStatus]);

	useEffect(() => {
		if (validator?.validate && validator?.editValidationHelper) {
			validator?.editValidationHelper(stepValues, validationData);
		}
	}, [stepValues]);

	useEffect(() => {
		if (validator?.validate) {
			const v = new Map(validationContextValue.validationStatus);
			const result = validateValue(localState(), validator, setValid, validationData);
			v.set(validationId, result);
			validationContextValue.setValidationStatus(v);
		}
	}, [localState(), validationData, stepValues]);

	useEffect(() => {
		if (configuration.optionTooltips || parent === 'input-table') {
			if (dropdownRef.current) {
				const input = dropdownRef.current.getInput();
				if (input.nodeName === 'SPAN') {
					if (input.childNodes.length > 0) {
						const pNode = input.childNodes[0];
						const { scrollWidth, clientWidth } = pNode;
						if (scrollWidth > clientWidth) {
							pNode.setAttribute('data-pr-tooltip', pNode.innerText);
							pNode.setAttribute('data-pr-position', 'right');
							pNode.classList.add(id ? `id-${id}-${configuration.id}` : configuration.id);
							setRenderTooltip(true);
						} else if (typeof pNode.setAttribute === 'function') {
							pNode.setAttribute('data-pr-tooltip', '');
							setRenderTooltip(false);
						}
					}
				} else if (input.nodeName === 'INPUT') {
					const { scrollWidth, clientWidth } = input;
					if (scrollWidth > clientWidth) {
						input.setAttribute('data-pr-tooltip', input.value);
						input.setAttribute('data-pr-position', 'right');
						input.classList.add(id ? `id-${id}-${configuration.id}` : configuration.id);
						setRenderTooltip(true);
					} else {
						input.setAttribute('data-pr-tooltip', '');
						setRenderTooltip(false);
					}
				}
			}
		}
	}, [localState()]);

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

	const makeOptionTooltips = () => {
		if (configuration.optionTooltips || parent === 'input-table') {
			const opts = document.querySelectorAll('.targetable-item');
			opts.forEach((optionElement) => {
				if (optionElement.scrollWidth > optionElement.clientWidth) {
					optionElement.setAttribute('data-pr-tooltip', optionElement.textContent);
					// optionElement.setAttribute('data-pr-position', 'right');
				} else {
					optionElement.setAttribute('data-pr-tooltip', '');
				}
			});
		}
	};

	useEffect(
		() => {
			if (stepValues?.size > 0) {
				if (id) {
					// in this case the List is inside another data component with id.
					if (stepValues.has(id) && stepValues.get(id).has(configuration.id)) {
						const preset = stepValues.get(id).get(configuration.id);
						if (preset) {
							// {term: }
							if (preset.value?.term) {
								if (preset.value.term !== localState()?.term) {
									localSetState(preset.value);
								}
							// [] multiselect array
							} else if (preset.value instanceof Array) {
								if (preset.value.length !== localState()?.length) {
									localSetState(preset.value);
								}
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
				localSetState(configuration.options[0]);
			}
		}
	}, [stepValues]);

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
				parentVal = stepValues?.get(id)?.get(field?.parent)?.value?.term;
			} else {
				parentVal = stepValues?.get(field?.parent)?.value?.term;
			}
			return parentVal;
		} 
		return null;
	}, [stepValues, helperContextValue, helperContextValue.helperState]);

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
			return globalDataContextValue.sitesData;
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
	}, [globalDataContextValue, helperContextValue]);

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
	}, [vocabulary, localState(), configuration]);

	const tolgifyItem = (option) => {
		if (option) {
			if (option.term) {
				const index = vocabulary?.findIndex((opt) => { return opt.term === option.term; });
				return (
					<>
						{(configuration.optionTooltips || parent === 'input-table') ? <Tooltip target={`.option-${index}`} position="right" /> : null}
						<p className={`targetable-item option-${index}`}>{(translate(t, option.term))}</p>
					</>
				);
			}
		}
		return null;
	};

	const tolgifyValue = (option, propsHere) => {
		const { placeholder } = propsHere;
		if (option) {
			if (option.term) {
				return (
					<p>{translate(t, option.term)}</p>
				);
			}
			// return <p>{translate(t, localState())}</p>;
		}
		return (
			placeholder
		);
	};

	useEffect(() => {
		if (configuration.definition) {
			if (localState()?.description) {
				setDefinitionValue(localState().description);
			} else if (localState() && Object.hasOwn(localState(), 'term')) {
				const existingTerm = vocabulary.find((e) => e.term === localState().term);
				if (existingTerm) {
					localSetState(existingTerm);
				} else {
					setDefinitionValue(configuration.definition.placeholder);
				}
			}
		}
	}, [localState()]);

	const getRows = () => {
		if (configuration.definition.rows) {
			return configuration.definition.rows;
		} 
		if (configuration.definition) {
			return 2;
		} 
		return 3;
	};

	const renderDefinition = () => {
		return (
			<div className="field">
				<Tooltip target=".status" position="top" />
				<div className="p-inputgroup">
					<span className="p-float-label">
						<InputTextarea
							value={definitionValue}
							className="p-d-block definition"
							disabled={disabled}
							rows={getRows()}
						/>
						<label htmlFor="username">
							{`${translate(t, configuration.label)} ${translate(t, configuration.definition.label)}`}
						</label>
					</span>
					<FieldInformation configuration={configuration.definition} disabled={disabled} />
				</div>
			</div>
		);
	};

	const renderDefinitionIcon = () => {
		return (
			<>
				<Tooltip target=".addon-icon" />
				<span
					className={`p-inputgroup-addon addon-icon ${disabled ? 'p-disabled' : 'p-enabled'}`}
					onClick={(e) => { op.current.toggle(e); }}
					data-pr-tooltip={translate(t, 'View definition')}
				>
					<i className="fa-solid fa-memo" />
					<OverlayPanel ref={op} className="addon-overlay">
						<h4>{`${configuration.definition.label}: ${localState()?.term || ''}`}</h4>
						<p>{definitionValue}</p>
					</OverlayPanel>
				</span>
			</>
		);
	};

	const renderCustomTermIcon = () => {
		if (typeof configuration.editable === 'boolean' ? configuration.editable : true) {
			return (
				<>
					<Tooltip target={`.custom-term-${id ? `${id}-${configuration.id}` : configuration.id}`} />
					<span
						id="custom"
						className={`p-inputgroup-addon addon-icon custom-term-${id ? `${id}-${configuration.id}` : configuration.id} ${disabled ? 'p-disabled' : 'p-enabled'}`}
						onClick={() => { setCustomDialog(true); }}
						data-pr-tooltip={translate(t, 'Add custom term')}
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
									const term = { term: customValue, userInput: true };
									localSetState(term);
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
			{renderTooltip ? <Tooltip target={`.id-${id ? `${id}-${configuration.id}` : configuration.id}`} position="right" /> : null}
			<div className="p-inputgroup">
				<span className="p-float-label">
					<Dropdown
						ref={dropdownRef}
						id={id ? `${id}-${configuration.id}` : configuration.id}
						key={id ? `${id}-${configuration.id}` : configuration.id}
						className={`p-d-block dropdown ${valid ? 'valid' : 'p-invalid'}`}
						value={localState()}
						onChange={(e) => {
							const val = {};
							if (e.value) {
								val.value = e.value;
							} else {
								val.value = { term: '' };
							}
							localSetState(val.value);
						}}
						disabled={disabledStatus}
						options={dropdownOptions}
						optionLabel="term"
						itemTemplate={tolgifyItem}
						valueTemplate={tolgifyValue}
						showClear
						filter={configuration.filter}
						panelClassName={parent === 'input-table' ? 'dropdown-panel-small' : null}
						onShow={() => makeOptionTooltips()}
						appendTo={document.getElementById('edit-page')}
						placeholder={configuration.placeholder ? translate(t, configuration.placeholder) : null}
						tooltip={valid ? null : validator?.invalidText}
						tooltipOptions={{ position: 'top', className: 'red-tooltip' }}
					/>
					<label htmlFor="username">{translate(t, configuration.label)}</label>
				</span>
				{renderCustomTermIcon()}
				<FieldInformation configuration={configuration} disabled={disabled} />
				{configuration.definition && parent === 'input-table' ? renderDefinitionIcon(localState()) : null}
			</div>
			{configuration.definition && parent !== 'input-table' ? renderDefinition(localState()) : null}
		</div>
	);
};

export default List;
