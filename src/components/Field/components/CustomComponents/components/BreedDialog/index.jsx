import React, { useEffect, useState } from 'react';
import './styles.css';
import { Dialog } from 'primereact/dialog';
import { useTranslate } from '@tolgee/react';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
// eslint-disable-next-line import/no-cycle
import Field from '../../../../index';
import { createId, makeValueObject, translate } from '../../../../../../utils';
import Divider from '../../../Divider';
import breedsConfiguration from './configuration';

const BreedDialog = (props) => {
	const { stepValues, setStepValues, id, compositeId, siteId, disabled } = props;
	const { t } = useTranslate();
	const [rows, setRows] = useState([]);
	const [localFields, setLocalFields] = useState();
	const [value, setValue] = useState();
	const [showDialog, setShowDialog] = useState(false);
	const [textDisabled, setTextDisabled] = useState(true);

	useEffect(
		() => {
			if (!(localFields instanceof Map) && showDialog) {
				let tempLocal = new Map(localFields);
				if (stepValues && stepValues.size > 0 && stepValues.has(id) && tempLocal.size === 0) {
					tempLocal = stepValues.get(id).get('0954fd92-9232-42d9-bdb5-e15ec41530ec');
					if (tempLocal && tempLocal.size > 0) {
						setRows(Array.from(tempLocal.keys()));
						setLocalFields(tempLocal);
					}
				}
			} else if (stepValues && stepValues.size > 0 && stepValues.has(id) && !value) {
				const tempValue = stepValues.get(id).get('9edfafcd-47ee-4265-af75-e9f72e201c07');
				if (tempValue?.value || tempValue?.value === '') {
					setValue(tempValue.value);
					setTextDisabled(false);
				}
			}
		}, [stepValues, showDialog]
	);

	useEffect(() => {
		const temp = new Map(stepValues);
		const tempRow = temp.get(id);
		if (tempRow && tempRow.size > 0 && (value || value === '')) {
			tempRow.set('9edfafcd-47ee-4265-af75-e9f72e201c07', makeValueObject(value));
			temp.set(id, tempRow);
			setStepValues(temp);
		}
	}, [value]);

	useEffect(() => {
		const temp = new Map(stepValues);
		const tempRow = temp.get(id);
		if (tempRow && tempRow.size > 0 && localFields instanceof Map) {
			tempRow.set('0954fd92-9232-42d9-bdb5-e15ec41530ec', new Map(localFields));
			temp.set(id, tempRow);
			setStepValues(temp);
		}
	}, [localFields]);

	const generateBreedName = () => {
		const val = [];
		localFields.forEach((row) => {
			const name = row.get('94407068-fb38-4109-8a7f-9aa74a256e34').value;
			const percent = row.get('9652f146-ce44-47c0-b6f1-0171490402aa').value;
			val.push(`${percent}%${name}`);
		});
		return val.join('***');
	};

	const addRow = () => {
		const rowId = createId();
		const newStep = new Map(localFields);
		const rowMap = new Map();
		breedsConfiguration.forEach((field) => {
			if (field.data) {
				rowMap.set(field.id, makeValueObject());
			}
		});
		newStep.set(rowId, rowMap);
		setLocalFields(newStep);
		setRows([...rows, rowId]);
	};

	const deleteRow = () => {
		const [rowId] = rows.slice(-1);
		const newRows = [...rows];
		newRows.pop();

		const newStep = new Map(localFields);
		newStep.delete(rowId);
		setLocalFields(newStep);
		setRows(newRows);
	};

	const renderFields = () => {
		return rows.map((row, index) => {
			return (
				<>
					<div className="fields-row row-item" id={`id-${row}`}>
						{breedsConfiguration.map((item) => {
							return (
								<Field
									configuration={{ ...item, label: `${item.label} ${index + 1}` }}
									stepValues={localFields}
									setStepValues={setLocalFields}
									id={row}
									compositeId={`${compositeId}_${id}`}
									siteId={siteId}
								/>
							);
						})}
					</div>
					<Divider configuration={{ horizontal: true }} />
				</>
			);
		});
	};

	const headerTemplate = () => {
		return (
			<div>
				<div className="p-dialog-title">{translate(t, 'Breeds Dialog')}</div>
			</div>
		);
	};

	const renderAddon = () => {
		return (
			<>
				<Tooltip target=".breed-icon" />
				<span
					role="button"
					aria-label="breed-button"
					tabIndex={0}
					className={`p-inputgroup-addon breed-icon ${disabled ? 'p-disabled' : 'p-enabled'}`}
					onClick={() => setShowDialog(true)}
					data-pr-tooltip={translate(t, 'Enter herd breed information')}
				>
					<i className="fa-solid fa-cow" />
				</span>
			</>
		);
	};

	return (
		<>
			<Field
				configuration={{
					type: 'text',
					id: '3baaf8dc-35f3-4fa0-8b15-48241494d864',
					data: true,
					addon: renderAddon,
				}}
				fieldState={value}
				setFieldState={setValue}
				disabled={textDisabled}
			/>

			<Dialog
				className="time-dialog"
				visible={showDialog}
				onHide={() => {
					setShowDialog(false);
					setValue(generateBreedName());
					setTextDisabled(false);
					setTimeout(() => {
						setLocalFields(undefined);
						setRows([]);
					}, 200);
				}}
				header={headerTemplate}
			>
				{renderFields()}
				<div className="button-group">
					<Button className="add-button" label={translate(t, 'Add Breed')} icon="fa-solid fa-plus" onClick={() => addRow()} disabled={(rows.length === 4)} />
					<Button className="add-button" label={translate(t, 'Remove Breed')} icon="fa-solid fa-minus" onClick={() => deleteRow()} disabled={rows.length === 0} />
				</div>
			</Dialog>
		</>

	);
};

export default BreedDialog;
