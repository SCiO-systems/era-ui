/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState, useEffect, useContext } from 'react';
import './styles.css';
import { Dialog } from 'primereact/dialog';
import { useTranslate } from '@tolgee/react';
import { Button } from 'primereact/button';
import {
	translate,
	createId,
	updateCustomTerms,
	makeValueObject,
	performLockedAction,
} from '../../../../../../../../utils';
import dialogConfiguration from './configuration';
import { ReviewContext, HelperContext } from '../../../../../../../../context';
import Field from '../../../../../../../../components/Field';

const TreatmentDialog = (props) => {
	const { reviewContextValue } = useContext(ReviewContext);
	const { helperContextValue } = useContext(HelperContext);
	const { customTerms, setCustomTerms } = reviewContextValue;

	const { t } = useTranslate();
	const { configuration, stepValues, setStepValues, treatmentDialogStatus, setTreatmentDialogStatus, currentEditItem, selectedTreatment, edit, treatmentIndex, setTreatmentIndex, compositeId } = props;

	const [treatmentName, setTreatmentName] = useState('');
	const [crops, setCrops] = useState([]);
	const [isControlTreatment, setIsControlTreatment] = useState(false);
	const [treatmentNotes, setTreatmentNotes] = useState('');
	const [replicates, setReplicates] = useState(undefined);
	const [intercrop, setIntercrop] = useState();
	const [treatmentSite, setTreatmentSite] = useState([]);

	const [valid, setValid] = useState({ treatment: true, intercrop: false });

	useEffect(() => {
		if (treatmentDialogStatus && !edit) {
			clearDialogFields();
		}
	}, [treatmentDialogStatus]);

	useEffect(() => {
		if (currentEditItem) {
			const editItemCrops = Array.from(currentEditItem.get('crop-index').keys());
			const customCrops = currentEditItem.get('custom-crops');
			const newCrops = [];
			editItemCrops.forEach((crop) => {
				if (customCrops.find((c) => c === crop)) {
					newCrops.push({ term: crop, userInput: true });
				} else {
					newCrops.push({ term: crop, description: '' });
				}
			});
			setTreatmentName(currentEditItem.get('536238f6-d1db-4186-96fb-8d1512b59fa6').value);
			setCrops(newCrops);
			setIsControlTreatment(currentEditItem.get('ed985b23-9e7f-4bdf-bcbf-1a7e6915bf14').value);
			setTreatmentNotes(currentEditItem.get('fdd4db4e-ef9a-4d7e-8cae-8b00bba2988e').value);
			setReplicates(currentEditItem.get('ef1f8d05-13b0-4bbd-881c-f592b4ab6d7d').value);
			setTreatmentSite(currentEditItem.get('255fb141-ee7b-4571-bc55-b75a00f3e899').value);
			setIntercrop(currentEditItem.get('66531c4d-909d-4c0e-909e-dbdba2e27140').value);
		}
	}, [treatmentDialogStatus]);

	const changeTreatmentName = (val) => {
		if (val) {
			if (edit) {
				setTreatmentName(val);
			} else {
				const existingTreatments = Array.from(treatmentIndex.keys());
				if (existingTreatments.includes(val)) {
					setValid({ ...valid, treatment: false });
				} else {
					setValid({ ...valid, treatment: true });
				}
				setTreatmentName(val);
			}
		} else {
			setTreatmentName(val);
			setValid({ ...valid, treatment: true });
		}
	};

	const setIntercropping = (val) => {
		if (val) {
			if (val?.length > 0) {
				setIntercrop(val);
				setValid({ ...valid, intercrop: true });
			} else {
				setIntercrop(val);
				setValid({ ...valid, intercrop: false });
			}
		} else {
			setValid({ ...valid, intercrop: false });
		}
	};

	const editTreatment = () => {
		const temp = new Map(stepValues);
		const treatmentRow = temp.get(selectedTreatment);
		const oldName = treatmentRow.get('536238f6-d1db-4186-96fb-8d1512b59fa6')?.value;
		const cropRows = treatmentRow.get('b7dde218-8a82-484f-812d-8a5c49682462');
		const cropIndex = treatmentRow.get('crop-index');
		const customCrops = treatmentRow.get('custom-crops');
		const cropList = Array.from(cropIndex.keys());

		const newCrops = crops.filter((crop) => !cropList.find((oldCrop) => oldCrop === crop.term));
		const deletedCrops = cropList.filter((crop) => !crops.find((oldCrop) => oldCrop.term === crop));
		const newCustomTerms = new Map(customTerms);
		let isCustomFlag = false;
		newCrops.forEach((crop) => {
			const cropId = createId();
			if (crop.userInput) {
				customCrops.push(crop.term);
				isCustomFlag = true;
			}
			cropRows.set(cropId, makeCropRow(crop.term));
			cropIndex.set(crop.term, cropId);
		});
		if (isCustomFlag) {
			updateCustomTerms(newCustomTerms, null, 'add', `${compositeId}_${selectedTreatment}`, dialogConfiguration.crops, newCrops, true);
		}

		deletedCrops.forEach((crop) => {
			const cropId = cropIndex.get(crop);
			updateCustomTerms(newCustomTerms, null, 'delete', cropId);
			cropRows.delete(cropId);
			cropIndex.delete(crop);
			const customIndex = customCrops.findIndex((c) => c === crop);
			if (customIndex > 0) {
				customCrops.splice(customIndex, 1);
			}
		});
		setCustomTerms(newCustomTerms);

		updateLockedSites(treatmentRow, selectedTreatment, treatmentSite);

		setTreatmentValues(treatmentRow, selectedTreatment, treatmentName, cropRows, cropIndex, replicates, treatmentNotes, intercrop, treatmentSite, customCrops);
		temp.set(selectedTreatment, treatmentRow);
		setStepValues(temp);

		const tempIndex = new Map(treatmentIndex);
		tempIndex.delete(oldName);
		tempIndex.set(treatmentName, selectedTreatment);
		setTreatmentIndex(tempIndex);
	};

	const updateLockedSites = (treatmentRow, rowId, treatmentSites) => {
		const oldSites = treatmentRow.get('255fb141-ee7b-4571-bc55-b75a00f3e899')?.value;
		const deletedSites = oldSites.filter((s) => treatmentSites.find((s2) => s2.id !== s.id));
		const newSites = treatmentSites.filter((s) => oldSites.find((s2) => s2.id !== s.id));

		const addEntityArr = [
			{
				entityParam: newSites,
				entityType: 'treatmentSites',
				entityAssociate: rowId,
			},
		];
		const deleteEntityArr = [
			{
				entityParam: deletedSites,
				entityType: 'treatmentSites',
				entityAssociate: rowId,
			},
		];

		performLockedAction(helperContextValue, [
			{
				type: 'add',
				entityArr: addEntityArr,
			},
			{
				type: 'delete-target-associates',
				entityArr: deleteEntityArr,
			},
		]);
	};

	const makeCropRow = (crop) => {
		const row = new Map();
		configuration.practices.content.forEach((field) => {
			if (field.data === 'table') {
				row.set(field.id, new Map());
			} else if (field.data) {
				row.set(field.id, crop);
			}
		});
		return row;
	};

	const setTreatmentValues = (treatmentRow, rowId, name, cropRows, cropIndex, reps, notes, intercropping, site, customCrops) => {
		treatmentRow.set('536238f6-d1db-4186-96fb-8d1512b59fa6', makeValueObject(name, rowId));
		treatmentRow.set('b7dde218-8a82-484f-812d-8a5c49682462', cropRows);
		treatmentRow.set('crop-index', cropIndex);
		treatmentRow.set('custom-crops', customCrops);
		treatmentRow.set('66531c4d-909d-4c0e-909e-dbdba2e27140', makeValueObject(intercropping, rowId));
		treatmentRow.set('ed985b23-9e7f-4bdf-bcbf-1a7e6915bf14', makeValueObject(isControlTreatment, rowId));
		treatmentRow.set('ef1f8d05-13b0-4bbd-881c-f592b4ab6d7d', makeValueObject(reps, rowId));
		treatmentRow.set('fdd4db4e-ef9a-4d7e-8cae-8b00bba2988e', makeValueObject(notes, rowId));
		treatmentRow.set('255fb141-ee7b-4571-bc55-b75a00f3e899', makeValueObject(site, rowId));
	};

	const addTreatment = () => {
		const u_id = createId();
		const temp = new Map(stepValues);
		const newTreatment = new Map();
		configuration.content.forEach((field) => {
			if (field.data === 'table') {
				newTreatment.set(field.id, new Map());
			} else if (field.data) {
				newTreatment.set(field.id, makeValueObject());
			}
		});

		const cropRows = new Map();
		const cropIndex = new Map();
		const customCrops = [];
		const newCustomTerms = new Map(customTerms);
		let isCustomFlag;
		crops.forEach((crop) => {
			const cropId = createId();
			if (crop.userInput) {
				isCustomFlag = true;
				customCrops.push(crop.term);
			}
			cropRows.set(cropId, makeCropRow(crop.term));
			cropIndex.set(crop.term, cropId);
		});
		if (isCustomFlag) {
			updateCustomTerms(newCustomTerms, null, 'add', `${compositeId}_${selectedTreatment}`, dialogConfiguration.crops, crops, true);
		}
		updateCustomTerms(newCustomTerms, null, 'add', `${compositeId}_${u_id}`, dialogConfiguration.intercrop, intercrop, true);

		setCustomTerms(newCustomTerms);
		const tempIndex = new Map(treatmentIndex);
		tempIndex.set(treatmentName, u_id);
		setTreatmentIndex(tempIndex);

		const entityArr = [
			{
				entityParam: treatmentSite,
				entityType: 'treatmentSites',
				entityAssociate: u_id,
			},
		];
		performLockedAction(helperContextValue, [{ type: 'add', entityArr }]);

		setTreatmentValues(newTreatment, u_id, treatmentName, cropRows, cropIndex, replicates, treatmentNotes, intercrop, treatmentSite, customCrops);
		temp.set(u_id, newTreatment);
		setStepValues(temp);
	};

	const isFilledIn = () => {
		if (crops?.length === 0) return true;
		if (edit && treatmentName === '') return true;
		if (treatmentName === '') return true;
		if (!valid.treatment) return true;
		if (crops.length > 1 && !valid.intercrop) return true;
		return treatmentSite?.length === 0;
	};

	const clearDialogFields = () => {
		setValid({ ...valid, treatment: true });
		setTreatmentName('');
		setCrops([]);
		setIntercrop();
		setIsControlTreatment(false);
		setTreatmentNotes('');
		setTreatmentSite([]);
		setReplicates(undefined);
	};

	const treatmentDialogFooter = () => (
		<>
			<Button
				label={edit ? translate(t, 'Save') : translate(t, 'Add')}
				onClick={() => {
					if (edit) {
						editTreatment(treatmentName, crops, isControlTreatment, treatmentName);
						setTreatmentDialogStatus(false);
					} else {
						addTreatment(treatmentName, crops, isControlTreatment);
						setTreatmentDialogStatus(false);
					}
				}}
				disabled={isFilledIn()}
			/>
			<Button
				label={translate(t, 'Cancel')}
				onClick={() => {
					setTreatmentDialogStatus(false);
				}}
			/>
		</>
	);

	return (
		<Dialog
			className="dialog-add-treatment field"
			header={translate(t, edit ? 'Edit Treatment' : 'Add Treatment')}
			visible={treatmentDialogStatus}
			footer={treatmentDialogFooter}
			onHide={() => {
				setTreatmentDialogStatus(false);
			}}
		>
			<Field configuration={dialogConfiguration.treatment} fieldState={treatmentName} setFieldState={changeTreatmentName} externalState isValid={valid.treatment} />
			{/* <CropsList crops={crops} setCrops={setCrops} edit={edit} treatmentIndex={treatmentIndex} treatmentName={treatmentName} stepValues={stepValues} tolgifyItem={tolgifyItem} /> */}
			<Field configuration={dialogConfiguration.cropsHeader} />
			<Field configuration={dialogConfiguration.crops} fieldState={crops} setFieldState={setCrops} externalState />
			<Field configuration={dialogConfiguration.cropsScientific} />
			<Field configuration={dialogConfiguration.otherHeader} />
			{crops?.length > 1 ? <Field configuration={dialogConfiguration.intercrop} fieldState={intercrop} setFieldState={setIntercropping} externalState isValid={valid.intercrop} /> : null}
			<Field configuration={dialogConfiguration.site} fieldState={treatmentSite} setFieldState={setTreatmentSite} externalState />
			<Field configuration={dialogConfiguration.control} fieldState={isControlTreatment} setFieldState={setIsControlTreatment} externalState />
			<Field configuration={dialogConfiguration.replicates} fieldState={replicates} setFieldState={setReplicates} externalState />
			<Field configuration={dialogConfiguration.notes} fieldState={treatmentNotes} setFieldState={setTreatmentNotes} externalState />
		</Dialog>
	);
};

export default TreatmentDialog;
