/* eslint-disable max-len,import/no-cycle */
import React, { useContext, useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { Button } from 'primereact/button';
import { useTranslate } from '@tolgee/react';
import { Tooltip } from 'primereact/tooltip';
import Field from '../../index';
import './styles.css';
import { translate, createId, mapToArray, updateCustomTerms, makeValueObject } from '../../../../utils';
import { ReviewContext, HelperContext, ValidationContext } from '../../../../context';
import validationArray from '../../../../pages/EditResource/validationArray';

const ExpandableTable = (props) => {
	const { configuration, stepValues, setStepValues, id, disabled, compositeId, customFunctions } = props;

	const [expandedRows, setExpandedRows] = useState(null);
	const [addItemDialog, setAddItemDialog] = useState(false);
	const [items, setItems] = useState();
	const { t } = useTranslate();
	const [filters, setFilters] = useState(new Map());
	const [currentItem, setCurrentItem] = useState(null);
	const [editItemDialog, setEditItemDialog] = useState(false);

	const { reviewContextValue } = useContext(ReviewContext);
	const { helperContextValue } = useContext(HelperContext);
	const { validationContextValue } = useContext(ValidationContext);
	const { customTerms, setCustomTerms } = reviewContextValue;

	const resetFilters = () => {
		const newFilters = new Map();
		configuration.columns.forEach((item) => {
			newFilters.set(item.id, makeValueObject());
		});
		setFilters(newFilters);
	};

	useEffect(
		() => {
			if (stepValues instanceof Map && stepValues.size > 0) {
				if (!(items instanceof Map)) {
					if (id) {
						const temp = stepValues.get(id);
						if (temp) {
							const tempStep = temp.get(configuration.id);
							if (tempStep) {
								setItems(tempStep);
							}
						}
					} else {
						const tempStep = stepValues.get(configuration.id);
						if (tempStep) {
							setItems(tempStep);
						}
					}
				}
				if (filters.size === 0) {
					const tempFilters = new Map();
					if (id) {
						const temp = stepValues.get(id);
						if (temp) {
							const tempStep = temp.get(configuration.id);
							if (tempStep?.size > 0) {
								configuration.columns.forEach((column) => {
									tempFilters.set(column.id, tempStep.get(column.id));
								});
								setFilters(tempFilters);
							} else {
								resetFilters();
							}
						}
					} else {
						const tempStep = stepValues.get(configuration.id);
						if (tempStep) {
							if (tempStep.size > 0) {
								configuration.columns.forEach((column) => {
									tempFilters.set(column.id, tempStep.get(column.id));
								});
								setFilters(tempFilters);
							} else {
								resetFilters();
							}
						}
					}
				}
			}
		}, [stepValues]
	);

	useEffect(
		() => {
			if (stepValues instanceof Map && items instanceof Map) {
				const newValues = new Map(stepValues);
				if (id) {
					const temp = newValues.get(id);
					temp.set(configuration.id, items);
					newValues.set(id, temp);
					setStepValues(newValues);
				} else {
					newValues.set(configuration.id, items);
					setStepValues(newValues);
				}
			}
		}, [items]
	);

	const deleteItem = (key) => {
		const newItems = new Map(items);
		newItems.delete(key);
		setItems(newItems);
	};

	const editItem = () => {
		const newItem = items.get(currentItem);
		const newCustomTerms = new Map(customTerms);
		filters.forEach((value, key) => {
			if (value && value.value) {
				const newValue = { ...value };
				if (newValue?.config?.type === 'list') {
					updateCustomTerms(newCustomTerms, null, 'add', `${compositeId}_${configuration.id}_${currentItem}_${key}`, newValue.config, newValue.value, newValue.custom);
				}

				delete newValue.custom;
				delete newValue.config;
				newValue.id = currentItem;
				newItem.set(key, newValue);
			}
		});
		setCustomTerms(newCustomTerms);

		const newItems = new Map(items);
		newItems.set(currentItem, newItem);
		setItems(newItems);
		resetFilters();
		setEditItemDialog(false);
	};

	const addContent = (container, rowValues, statusMap) => {
		container.content.forEach((c) => {
			if (c.data === 'table') {
				rowValues.set(c.id, new Map());
			} else if (c.data === 'map') {
				addContent(c, rowValues, statusMap);
			} else if (c.data) {
				rowValues.set(c.id, makeValueObject());
				if (c.validation) {
					const val = validationArray.find((field) => field.id === c.id);
					if (val?.mandatory) {
						statusMap.set(`${currentItem}_${val.id}`, false);
					}
				}
			}
		});
	};

	const addItem = () => {
		const newItems = new Map(items);
		const rowValues = new Map();
		const statusMap = new Map(validationContextValue.validationStatus);

		configuration.content.forEach((item) => {
			if (item.data === 'table') {
				rowValues.set(item.id, new Map());
			} else if (item.data === 'tab') {
				item.tabs.forEach((tab) => {
					addContent(tab, rowValues, statusMap);
				});
			} else if (item.data) {
				rowValues.set(item.id, makeValueObject());
			}
		});

		const newCustomTerms = new Map(customTerms);
		filters.forEach((value, key) => {
			const newValue = { ...value };
			newValue.id = currentItem;
			rowValues.set(key, newValue);
		});

		setCustomTerms(newCustomTerms);
		newItems.set(currentItem, rowValues);
		setItems(newItems);
		validationContextValue.setValidationStatus(statusMap);
		resetFilters();
		setAddItemDialog(false);
	};

	const addItemFooter = () => (
		<div>
			<Button label={translate(t, 'Cancel')} icon="pi pi-times" onClick={() => setAddItemDialog(false)} className="p-button-text" />
			<Button
				label={translate(t, 'Add')}
				icon="pi pi-check"
				onClick={addItem}
				autoFocus
				disabled={isDisabled()}
			/>
		</div>
	);

	const isDisabled = () => {
		let dis = false;
		filters?.forEach((f) => {
			if (f?.value) {
				if (Object.hasOwn(f.value, 'term')) {
					if (!f?.value?.term) {
						dis = true;
					}
				}
			} else {
				dis = true;
			}
		});
		return dis;
	};

	const editItemFooter = () => {
		return (
			<div>
				<Button label={translate(t, 'Cancel')} icon="pi pi-times" onClick={() => setEditItemDialog(false)} className="p-button-text" />
				<Button
					label={translate(t, 'Save')}
					icon="pi pi-check"
					onClick={() => editItem()}
					autoFocus
					disabled={isDisabled()}
				/>
			</div>
		);
	};

	const header = (
		<div className="table-header">
			<Button
				icon="pi pi-plus"
				disabled={disabled}
				label={translate(t, configuration.headerButtonLabel)}
				className="p-mr-2"
				onClick={() => {
					setAddItemDialog(true);
					setCurrentItem(createId());
				}}
			/>
		</div>
	);

	const splitColumns = (colData) => {
		const fieldArray = [];
		for (let i = 0; i < configuration.multiColumn; i += 1) {
			fieldArray.push(
				<div className={`custom-column column-${i}`}>
					{configuration.content.map((item) => {
						if (item.columnNumber === i) {
							return <Field configuration={item} stepValues={items} setStepValues={setItems} id={colData.key} disabled={disabled} compositeId={`${compositeId}_${configuration.id}_${colData.key}`} />;
						}
						return null;
					}
					)}
				</div>
			);
		}
		return fieldArray;
	};
	const renderFields = (data) => {
		if (configuration.multiColumn) {
			return splitColumns(data);
		}
		return configuration.content.map((item) => {
			return (
				<Field configuration={item} stepValues={items} setStepValues={setItems} id={data.key} disabled={disabled} compositeId={`${compositeId}_${configuration.id}_${data.key}`} customFunctions={customFunctions} />
			);
		});
	};

	const columnComponents = configuration.columns.map((col) => {
		if (col.label === 'Site Name') {
			return ((<Column key={col.field} field={col.label} header={translate(t, col.label)} body={(data) => practiceColumnTemplate(data, col.id)} />));
		}
		if (col.type === 'text') {
			return (<Column key={col.field} field={col.label} header={translate(t, col.label)} body={(data) => practiceColumnTemplate(data, col.id)} />);
		}

		return (
			<Column key={col.field} field={col.label} header={translate(t, col.label)} body={(data) => practiceColumnTemplate(data, col.id)} />
		);
	});
	
	const practiceColumnTemplate = (data, colId) => {
		if (data.value instanceof Map) {
			const colValue = data.value.get(colId).value;
			if (colValue?.term) {
				return translate(t, colValue.term);
			}
			return translate(t, colValue);
		} if (data.value) {
			return data.value.value;
		}
		return null;
	};
	const rowExpansionTemplate = (data) => {
		return (
			<div className={configuration.multiColumn ? 'forms p-grid multi-column' : 'forms p-grid'}>
				{renderFields(data)}
			</div>
		);
	};
	
	const showEditButton = (data) => {
		if (configuration.editable) {
			return (
				<Button
					id="edit"
					icon="fa-regular fa-pen"
					className="edit-button"
					onClick={() => {
						setEditItemDialog(true);
						setCurrentItem(data.key);
						presetFilters(data.value);
					}}
				/>
			);
		}
		return null;
	};

	const presetFilters = (data) => {
		const newFilters = new Map(filters);
		filters.forEach((filter, key) => {
			newFilters.set(key, data.get(key));
		});
		setFilters(newFilters);
	};
	
	const deleteRow = (data) => {
		if (customFunctions?.lockedEntitiesFunction) {
			const isLocked = customFunctions?.lockedEntitiesFunction(helperContextValue?.lockedEntities, data.key);
			if (isLocked) {
				return (
					<>
						<Tooltip target={`.actions.key${data.key}`} />
						<div className={`actions key${data.key}`} data-pr-tooltip="Site is in use. Row headers cannot be edited or deleted.">
							<Button
								id="locked"
								icon="fa-solid fa-lock"
								className="locked-button"
								outlined
								rounded
								disabled
							/>
						</div>
					</>
				);
			}
		}
		return (
			<div className="actions">
				{showEditButton(data)}
				<Button
					id="delete"
					icon="fa-solid fa-xmark"
					className="delete-button"
					onClick={(e) => confirmPopup({
						target: e.currentTarget,
						message: translate(t, configuration.deleteMessage),
						icon: 'pi pi-info-circle',
						acceptClassName: 'p-button-danger',
						accept: () => {
							updateCustomTerms(customTerms, setCustomTerms, 'delete', data.key, true);
							deleteItem(data.key);
						},
						reject: () => {
						},
						acceptLabel: translate(t, 'Yes'),
						rejectLabel: translate(t, 'No'),
					})}
				/>
			</div>
		);
	};

	const renderMultiSelects = () => {
		return (
			configuration.columns.map((item) => {
				return <Field configuration={item} stepValues={filters} setStepValues={setFilters} compositeId={`${compositeId}_${configuration.id}_${currentItem}`} />;
			})
		);
	};

	return (
		<div className="expandable-table">
			<ConfirmPopup />
			<DataTable
				value={mapToArray(items)}
				expandedRows={expandedRows}
				onRowToggle={(e) => setExpandedRows(e.data)}
				rowExpansionTemplate={rowExpansionTemplate}
				dataKey="key"
				header={configuration.headerButtonLabel ? header : null}
				id="expandable"
				emptyMessage={translate(t, 'No results found')}
			>
				{configuration.editable ? <Column key="deleteRow" body={deleteRow} style={configuration.editable ? { width: '100px' } : { width: '70px' }} /> : null}
				<Column expander style={{ width: '3em' }} />
				{columnComponents}
			</DataTable>
			<Dialog header={translate(t, configuration.headerButtonLabel)} visible={addItemDialog} style={{ width: '50vw' }} footer={addItemFooter} onHide={() => setAddItemDialog(false)}>
				<div className="add-item">
					{renderMultiSelects(false)}
				</div>
			</Dialog>
			<Dialog header={translate(t, 'Edit Values')} visible={editItemDialog} style={{ width: '50vw' }} footer={editItemFooter} onHide={() => setEditItemDialog(false)}>
				<div className="add-item">
					{renderMultiSelects(true)}
				</div>
			</Dialog>
		</div>
	);
};

export default ExpandableTable;
