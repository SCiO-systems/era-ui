import React, { useEffect, useMemo, useState } from 'react';
import './styles.css';
import { Dialog } from 'primereact/dialog';
import { useTranslate } from '@tolgee/react';
import { Button } from 'primereact/button';
import { configurationTimeAlt, configurationTime } from './configuration';
// eslint-disable-next-line import/no-cycle
import Field from '../../../../index';
import { createId, makeValueObject, translate } from '../../../../../../utils';
import Divider from '../../../Divider';

const TimeDialog = (props) => {
	const { configuration, stepValues, setStepValues, id, compositeId, showDialog, setShowDialog, siteId } = props;
	const { t } = useTranslate();
	const [rows, setRows] = useState([]);
	const [localFields, setLocalFields] = useState(new Map());
	const [otherFields, setOtherFields] = useState('load');

	useEffect(
		() => {
			if (localFields.size === 0 && showDialog) {
				let tempLocal = new Map(localFields);
				if (stepValues && stepValues.size > 0 && stepValues.has(id) && tempLocal.size === 0) {
					tempLocal = stepValues.get(id).get('e99475b7-9baa-487d-9265-60b35fad0671');
					const tempOther = stepValues.get(id).get('alt');
					if (tempLocal && tempLocal.size > 0) {
						setRows(Array.from(tempLocal.keys()));
						setLocalFields(tempLocal);
						setOtherFields(tempOther);
					}
				}
			}
		}, [stepValues, showDialog]
	);

	useEffect(() => {
		if (!showDialog) return;
		const temp = new Map(stepValues);
		const tempRow = temp.get(id);
		if (tempRow && tempRow.size > 0) {
			tempRow.set('e99475b7-9baa-487d-9265-60b35fad0671', new Map(localFields));
			tempRow.set('alt', otherFields);
			temp.set(id, tempRow);
			setStepValues(temp);
		}
	}, [localFields, otherFields]);

	const config = useMemo(() => {
		if (configuration === 'simple') {
			return { content: configurationTime };
		} if (configuration === 'alt') {
			return { content: configurationTime, other: configurationTimeAlt };
		}
		return [];
	}, [configuration]);

	const addOtherFields = () => {
		const rowId = createId();
		const newStep = new Map();
		const rowMap = new Map();
		config.other.forEach((field) => {
			if (field.data) {
				rowMap.set(field.id, makeValueObject());
			}
		});
		newStep.set(rowId, rowMap);
		setLocalFields(newStep);
		setRows([rowId]);
		setOtherFields('other');
	};

	const deleteOtherFields = () => {
		setLocalFields(new Map());
		setRows([]);
		setOtherFields('time');
	};

	const addRow = () => {
		const rowId = createId();
		const newStep = new Map(localFields);
		const rowMap = new Map();
		config.content?.forEach((field) => {
			if (field.data) {
				rowMap.set(field.id, makeValueObject());
			}
		});
		newStep.set(rowId, rowMap);
		setLocalFields(newStep);
		setRows([...rows, rowId]);
		setOtherFields('time');
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
		if (otherFields === 'time') {
			return rows.map((row) => {
				return (
					<>
						<div className="fields-row row-item" id={`id-${row}`}>
							{config.content.map((item) => {
								return (
									<Field
										configuration={item}
										stepValues={localFields}
										setStepValues={setLocalFields}
										id={row}
										compositeId={`${compositeId}_${id}`}
										siteId={siteId}
										disabled={configuration.isDisabled ? configuration.isDisabled(stepValues, id) : false}
									/>
								);
							})}
						</div>
						<Divider configuration={{ horizontal: true }} />
					</>
				);
			});
		} if (otherFields === 'other') {
			return rows.map((row) => {
				return (
					<>
						<div className="fields-column" id={`id-${row}`}>
							{config.other.map((item) => {
								return (
									<Field
										configuration={item}
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
		}
		return null;
	};

	const headerTemplate = () => {
		return (
			<div>
				<div className="p-dialog-title">{translate(t, 'Timing of Practice Applications')}</div>
			</div>
		);
	};

	return (
		<Dialog
			className="time-dialog"
			visible={showDialog}
			onHide={() => {
				setShowDialog(false);
				setTimeout(() => {
					setLocalFields(new Map());
					setRows([]);
					setOtherFields('load');
				}, 200);
			}}
			header={headerTemplate}
		>
			{renderFields()}
			<div className="button-group">
				<Button className="add-button" label={translate(t, 'Add Occurrence')} icon="fa-solid fa-plus" onClick={() => addRow()} disabled={otherFields === 'other'} />
				<Button className="add-button" label={translate(t, 'Remove Occurrence')} icon="fa-solid fa-minus" onClick={() => deleteRow()} disabled={rows.length === 0 || otherFields === 'other'} />
				{configuration === 'alt' && otherFields !== 'other' ? <Button className="alt-button" label={translate(t, 'Alternative Time Format')} icon="fa-solid fa-calendar-lines-pen" onClick={() => addOtherFields()} /> : null}
				{configuration === 'alt' && otherFields === 'other' ? <Button className="alt-button" label={translate(t, 'Alternative Time Format')} icon="fa-solid fa-calendar-lines-pen" onClick={() => deleteOtherFields()} /> : null}
			</div>
		</Dialog>
	);
};

export default TimeDialog;
