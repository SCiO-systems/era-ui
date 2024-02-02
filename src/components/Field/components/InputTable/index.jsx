/* eslint-disable import/no-cycle */
import React, { useContext, useEffect, useMemo, useState } from 'react';
import './styles.css';
import { MultiSelect } from 'primereact/multiselect';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { useTranslate } from '@tolgee/react';
import { Tooltip } from 'primereact/tooltip';
import {
	createId,
	makeValueObject,
	mapToArray,
	translate,
	updateCustomTerms,
	genInputTableColumns,
	validateInputTableFields,
} from '../../../../utils';
import { ReviewContext, ValidationContext, HelperContext } from '../../../../context';
import Field from '../../index';
import { TimeDialog } from '../CustomComponents/components';

const InputTable = (props) => {
	const { configuration, customFunctions, stepValues, setStepValues, id, disabled, compositeId, siteId } = props;

	const { t } = useTranslate();
	const [selectedColumns, setSelectedColumns] = useState();
	const [columnsContent, setColumnsContent] = useState();
	const [columnInformation, setColumnInformation] = useState('');
	const [infoDialog, setInfoDialog] = useState(false);
	const [localFields, setLocalFields] = useState();
	const [extraFieldsDialog, setExtraFieldsDialog] = useState(false);
	const [currentRow, setCurrentRow] = useState(null);
	const [showTimeDialog, setShowTimeDialog] = useState(false);

	const { reviewContextValue } = useContext(ReviewContext);
	const { validationContextValue } = useContext(ValidationContext);
	const { helperContextValue } = useContext(HelperContext);
	const { helperState } = helperContextValue;
	const { customTerms, setCustomTerms } = reviewContextValue;

	useEffect(() => {
		if (configuration.columns instanceof Array) {
			if (!selectedColumns && !columnsContent) {
				setSelectedColumns(configuration.columns);
				setColumnsContent(configuration.content);
			}
		} else {
			genInputTableColumns(configuration, stepValues, setSelectedColumns, setColumnsContent);
		}
	}, [stepValues]);

	useEffect(
		() => {
			if (stepValues instanceof Map && stepValues.size > 0) {
				if (!(localFields instanceof Map)) {
					if (id) {
						const preset = stepValues.get(id).get(configuration.id);
						if (preset) {
							setLocalFields(preset);
						}
					} else {
						const tempStep = stepValues.get(configuration.id);

						if (tempStep) {
							if (configuration.customFunctions?.refreshRows) {
								configuration.customFunctions.refreshRows(tempStep, setLocalFields, siteId, genRow);
							} else {
								setLocalFields(tempStep);
							}
						} else {
							configuration.customFunctions?.makeRows(setLocalFields, siteId, genRow);
						}
					}
				}
			}
		}, [stepValues]
	);
	
	useEffect(
		() => {
			if (stepValues instanceof Map && localFields instanceof Map) {
				const newValues = new Map(stepValues);
				if (id) {
					const temp = newValues.get(id);
					temp.set(configuration.id, localFields);
					newValues.set(id, temp);
				} else {
					newValues.set(configuration.id, localFields);
				}
				validateInputTableFields(configuration, validationContextValue, localFields, disabled);
				setStepValues(newValues);
			}
		}, [localFields]
	);

	useEffect(() => {
		validateInputTableFields(configuration, validationContextValue, localFields, disabled);
	}, [disabled]);

	const rowPreset = useMemo(() => {
		if (!(columnsContent instanceof Array)) return null;
		const rowValues = new Map();
		columnsContent.forEach((item) => {
			if (item.data) {
				rowValues.set(item.id, makeValueObject());
			}
		});
		return rowValues;
	}, [configuration]);

	const genRow = () => {
		const rowValues = new Map();
		columnsContent.forEach((item) => {
			if (item.data === 'table') {
				rowValues.set(item.id, new Map());
			} else if (item.data) {
				rowValues.set(item.id, makeValueObject());
			}
		});
		if (configuration.extraFields) {
			configuration.extraFields.forEach((item) => {
				if (item.data) {
					rowValues.set(item.id, makeValueObject());
				}
			});
		}
		return rowValues;
	};

	const onColumnToggle = (event) => {
		if (event.value) {
			const newSelectedColumns = event.value;
			const orderedSelectedColumns = configuration.columns.filter((col) => newSelectedColumns.some((sCol) => sCol.field === col.field));
			setSelectedColumns(orderedSelectedColumns);
			helperContextValue.setHelperState({ ...helperState, selectedColumnsTracker: !helperState.selectedColumnsTracker });
		} else {
			setSelectedColumns([]);
		}
	};

	const addItem = () => {
		const u_id = createId();
		const newItems = new Map(localFields);
		const rowValues = genRow();
		// if tabs, create a column with the tab ID. value will be a map of the fields the tab contains.
		newItems.set(u_id, rowValues);
		setLocalFields(newItems);
	};

	const addManyItems = () => {
		const temp = new Map(localFields);
		for (let i = 0; i < 10; i += 1) {
			temp.set(createId(), new Map(rowPreset));
		}
		setLocalFields(temp);
	};

	const tolgifyItem = (option) => {
		return (
			translate(t, option.header)
		);
	};

	const removeColumn = (field) => {
		const arr = [...selectedColumns];
		const index = arr.findIndex((item) => item.field === field);
		arr.splice(index, 1);
		const orderedSelectedColumns = configuration.columns.filter((col) => arr.some((sCol) => sCol.field === col.field));
		setSelectedColumns(orderedSelectedColumns);
	};

	const tolgifyValue = (option) => {
		if (option) {
			return (
				<div className="p-multiselect-token">
					<span className="p-multiselect-token-label ignore-click">
						{translate(t, option.header)}
					</span>
					<span
						className="p-multiselect-token-icon pi pi-times-circle"
						onClick={() => removeColumn(option.field)}
						role="button"
						tabIndex="0"
						aria-label="remove-column"
					/>
				</div>
			);
		}
		return <div />;
	};

	const header = (
		<div className="table-header">
			<span className="p-float-label">
				<MultiSelect
					inputId="multiselect"
					value={selectedColumns instanceof Array ? selectedColumns : []}
					options={configuration.columns instanceof Array ? configuration.columns : []}
					optionLabel="header"
					onChange={onColumnToggle}
					style={{ width: '100%' }}
					display="chip"
					itemTemplate={tolgifyItem}
					selectedItemTemplate={tolgifyValue}
					showClear
					disabled={disabled}
				/>
				{/* <label htmlFor="multiselect">{configuration.floatingLabel}</label> */}
			</span>
			<Button label={translate(t, 'Add Row')} icon="fa-solid fa-plus" iconPos="left" onClick={addItem} disabled={disabled} />
			{configuration.paginator ? <Button label={translate(t, 'Add 10 Rows')} icon="fa-solid fa-plus" iconPos="left" onClick={addManyItems} disabled={disabled} /> : null}
		</div>
	);

	const bodyTemplate = (data, col) => {
		const config = columnsContent.find((item) => item.col === col.field);
		config.colLabel = col.header;
		return (
			<Field
				configuration={config}
				stepValues={localFields}
				setStepValues={setLocalFields}
				id={data.key}
				compositeId={`${compositeId}_${configuration.id}_${data.key}`}
				disabled={disabled}
				parent="input-table"
				siteId={siteId}
			/>
		);
	};

	const columnHeaderTemplate = (col) => (
		<div className="column-header">
			<p>{translate(t, col.header)}</p>
			<Button
				icon="fa-solid fa-circle-info"
				onClick={() => {
					setColumnInformation({ header: translate(t, col.header), info: translate(t, col.info) });
					setInfoDialog(true);
				}}
			/>
		</div>
	);

	const columnComponents = () => {
		if (selectedColumns instanceof Array) {
			return (selectedColumns.map((col) => {
				return (
					<Column
						key={col.field}
						body={(data) => {
							if (customFunctions?.bodyTemplate) {
								return customFunctions.bodyTemplate(data, col, localFields, setLocalFields, configuration, id, `${compositeId}_${configuration.id}`);
							}
							return bodyTemplate(data, col);
						}}
						header={() => columnHeaderTemplate(col)}
					/>
				);
			}
			));
		} if (selectedColumns?.targetTable) {
			return null;
		}
		return null;
	};

	const emptyTemplate = () => (
		<p style={{ padding: '12px' }}>{translate(t, 'Press Add Row')}</p>
	);

	const deleteItem = (data) => {
		const temp = new Map(localFields);
		if (customFunctions?.unlockEntities) {
			customFunctions.unlockEntities(data);
		}
		temp.delete(data.key);
		setLocalFields(temp);
	};

	const actionsTemplate = (data) => {
		if (customFunctions?.isLocked) {
			const locked = customFunctions.isLocked(data);
			if (locked) {
				return (
					<>
						<Tooltip target={`.input-table-actions.key${data.key}`} />
						<div className={`input-table-actions key${data.key}`} data-pr-tooltip="Entity is in use. Row cannot be deleted.">
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
		let targetField;
		if (configuration.extraFields) {
			if (data.value.has('820cdc7f-fc67-4ff9-bbbc-4bcf8cb3cb3f')) {
				const field = data.value.get('820cdc7f-fc67-4ff9-bbbc-4bcf8cb3cb3f');
				if (field.value) {
					targetField = field.value;
				}
			}
		}
		return (
			<div className="input-table-actions">
				<Tooltip target={`.action-button-${data.key}`} />
				<Button
					id="delete"
					icon="fa-solid fa-xmark"
					className={`action-button-${data.key}`}
					data-pr-tooltip="Delete table row"
					onClick={(e) => confirmPopup({
						target: e.currentTarget,
						message: translate(t, configuration.deleteMessage),
						icon: 'pi pi-info-circle',
						acceptClassName: 'p-button-danger',
						accept: () => {
							deleteItem(data);
							updateCustomTerms(customTerms, setCustomTerms, 'delete', data.key);
						},
						reject: () => {},
						acceptLabel: translate(t, 'Yes'),
						rejectLabel: translate(t, 'No'),
					})}
					disabled={disabled}
				/>
				{configuration.timeFields ? (
					<Button
						id="copy"
						className={`action-button-${data.key}`}
						data-pr-tooltip={translate(t, 'Enter time data')}
						icon="fa-solid fa-calendar-days"
						onClick={() => {
							setShowTimeDialog(true);
							setCurrentRow(data.key);
						}}
						disabled={disabled}
					/>
				) : null}
				{configuration.extraFields && targetField !== 'Inorganic'
					? (
						<Button
							id="other"
							className={`action-button-${data.key}`}
							data-pr-tooltip={translate(t, 'Enter composition data')}
							// label={configuration.extraFieldsLabel}
							icon="fa-solid fa-flask"
							onClick={() => {
								setCurrentRow(data.key);
								setExtraFieldsDialog(true);
							}}
							disabled={disabled}
						/>
					)
					: null}
				{configuration.subTable ? (
					<Button
						id="other"
						className={`action-button-${data.key}`}
						data-pr-tooltip={translate(t, 'Enter additional data')}
						// label={configuration.extraFieldsLabel}
						icon="fa-solid fa-table"
						onClick={() => {
							setCurrentRow(data.key);
							setExtraFieldsDialog(true);
						}}
						disabled={disabled}
					/>
				) : null}
			</div>
		);
	};

	const renderExtraFields = () => {
		if (configuration.extraFields && currentRow) {
			return configuration.extraFields.map((item) => (
				<Field
					configuration={item}
					stepValues={localFields}
					setStepValues={setLocalFields}
					id={currentRow}
					compositeId={`${compositeId}_${configuration.id}_${currentRow}`}
				/>
			)
			);
		} if (configuration.subTable) {
			return (
				<Field
					configuration={configuration.subTable}
					stepValues={localFields}
					setStepValues={setLocalFields}
					id={currentRow}
					compositeId={`${compositeId}_${currentRow}`}
				/>
			);
		}
		return null;
	};

	return (
		<div className="treatments input-table-custom">
			<ConfirmPopup />
			<DataTable
				value={mapToArray(localFields)}
				header={header}
				showGridlines
				resizableColumns
				columnResizeMode="expand"
				selectionMode="single"
				size="small"
				stripedRows
				emptyMessage={emptyTemplate}
				id="inputs"
				paginator={configuration.paginator}
				rows={5}
				alwaysShowPaginator={false}
				rowsPerPageOptions={[5, 10, 15, 20]}
			>
				<Column key="deleteRow" body={actionsTemplate} header={translate(t, 'Actions')} />
				{columnComponents()}
			</DataTable>
			<Dialog header={columnInformation.header} visible={infoDialog} style={{ width: '50vw' }} onHide={() => setInfoDialog(false)}>
				<p>{columnInformation.info}</p>
			</Dialog>
			<Dialog className="input-table-extra-fields" header={configuration.extraFieldsLabel} visible={extraFieldsDialog} style={{ width: '50vw' }} onHide={() => setExtraFieldsDialog(false)}>
				<div className="forms">
					{renderExtraFields()}
				</div>
			</Dialog>
			{configuration.timeFields ? <TimeDialog stepValues={localFields} id={currentRow} setStepValues={setLocalFields} configuration={configuration.timeFields} siteId={siteId} showDialog={showTimeDialog} setShowDialog={setShowTimeDialog} /> : null}
		</div>
	);
};

export default InputTable;
