/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState, useEffect, useContext } from 'react';
import './styles.css';
import { Dialog } from 'primereact/dialog';
import { useTranslate } from '@tolgee/react';
import { Button } from 'primereact/button';
import {
	translate,
	createId,
	makeValueObject,
	performLockedAction,
} from '../../../../../../../../utils';
import dialogConfiguration from './configuration';
import { HelperContext } from '../../../../../../../../context';
import Field from '../../../../../../../../components/Field';

const TreatmentDialog = (props) => {
	const { helperContextValue } = useContext(HelperContext);

	const { t } = useTranslate();
	const { configuration, stepValues, setStepValues, treatmentDialogStatus, setTreatmentDialogStatus, currentEditItem, selectedTreatment, edit, treatmentIndex, setTreatmentIndex, selectedExperiment } = props;

	const [treatmentName, setTreatmentName] = useState('');
	const [isControlTreatment, setIsControlTreatment] = useState(false);
	const [treatmentNotes, setTreatmentNotes] = useState('');
	const [replicates, setReplicates] = useState(undefined);
	const [treatmentSite, setTreatmentSite] = useState([]);
	const [herdGroup, setHerdGroup] = useState();
	const [animalsRep, setAnimalsRep] = useState();

	const [valid, setValid] = useState({ treatment: true });

	useEffect(() => {
		if (treatmentDialogStatus && !edit) {
			clearDialogFields();
		}
	}, [treatmentDialogStatus]);

	useEffect(() => {
		if (currentEditItem) {
			const herds = Array.from(currentEditItem.get('herd-index').keys()).map((i) => {
				return { term: i };
			});

			setTreatmentName(currentEditItem.get('6d8e4d50-0816-478a-927b-83d131b75c40').value);
			setHerdGroup(herds);
			setTreatmentSite(currentEditItem.get('4f1cbd0c-92b7-44d1-b0d9-a844980bf061').value);
			setIsControlTreatment(currentEditItem.get('18b92fd4-6ad6-4547-a2de-6670f344c2ad').value);
			setReplicates(currentEditItem.get('d0e1df6c-5c8d-47d9-9817-651615a9403a').value);
			setAnimalsRep(currentEditItem.get('124f6b64-83f6-4f39-9110-1b6778214246').value);
			setTreatmentNotes(currentEditItem.get('3a35725a-b54a-4a8d-8b9a-ce811432e09f').value);
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

	const editTreatment = () => {
		const temp = new Map(stepValues);
		const treatmentRow = temp.get(selectedTreatment);
		const oldName = treatmentRow.get('536238f6-d1db-4186-96fb-8d1512b59fa6')?.value;

		updateLockedSites(treatmentRow, selectedTreatment, treatmentSite);

		const productRows = treatmentRow.get('7327aa17-85fc-40e8-a02f-46c6cbbcf88d');
		const productIndex = treatmentRow.get('herd-index');
		const productList = Array.from(productIndex.keys());

		const newProducts = herdGroup.filter((np) => !productList.find((p) => p === np.term));
		const deletedProducts = productList.filter((np) => !herdGroup.find((p) => p.term === np));
		newProducts.forEach((np) => {
			const pId = createId();

			productRows.set(pId, makeProductRow(np));
			productIndex.set(np.term, pId);
		});
		deletedProducts.forEach((dp) => {
			const pId = productIndex.get(dp);
			productRows.delete(pId);
			productIndex.delete(dp);
		});
		setTreatmentValues(treatmentRow, selectedTreatment, treatmentName, replicates, animalsRep, treatmentNotes, treatmentSite, productRows, productIndex);
		temp.set(selectedTreatment, treatmentRow);
		setStepValues(temp);

		const tempIndex = new Map(treatmentIndex);
		tempIndex.delete(oldName);
		tempIndex.set(treatmentName, selectedTreatment);
		setTreatmentIndex(tempIndex);
	};

	const updateLockedSites = (treatmentRow, rowId, treatmentSites) => {
		const oldSites = treatmentRow.get('4f1cbd0c-92b7-44d1-b0d9-a844980bf061')?.value;
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

	const setTreatmentValues = (treatmentRow, rowId, name, reps, repsNum, notes, site, herd, herdIndex) => {
		treatmentRow.set('6d8e4d50-0816-478a-927b-83d131b75c40', makeValueObject(name, rowId));
		treatmentRow.set('7327aa17-85fc-40e8-a02f-46c6cbbcf88d', herd);
		treatmentRow.set('herd-index', herdIndex);
		treatmentRow.set('4f1cbd0c-92b7-44d1-b0d9-a844980bf061', makeValueObject(site, rowId));
		treatmentRow.set('18b92fd4-6ad6-4547-a2de-6670f344c2ad', makeValueObject(isControlTreatment, rowId));
		treatmentRow.set('d0e1df6c-5c8d-47d9-9817-651615a9403a', makeValueObject(reps, rowId));
		treatmentRow.set('124f6b64-83f6-4f39-9110-1b6778214246', makeValueObject(repsNum, rowId));
		treatmentRow.set('3a35725a-b54a-4a8d-8b9a-ce811432e09f', makeValueObject(notes, rowId));
	};

	const makeProductRow = (crop) => {
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

	const addTreatment = () => {
		const u_id = createId();
		const temp = new Map(stepValues);
		const newTreatment = new Map();
		const tempIndex = new Map(treatmentIndex);
		tempIndex.set(treatmentName, u_id);
		setTreatmentIndex(tempIndex);

		const herdRows = new Map();
		const herdIndex = new Map();
		herdGroup.forEach((group) => {
			const cropId = createId();
			herdRows.set(cropId, makeProductRow(group.term));
			herdIndex.set(group.term, cropId);
		});

		const entityArr = [
			{
				entityParam: treatmentSite,
				entityType: 'treatmentSites',
				entityAssociate: u_id,
			},
		];
		performLockedAction(helperContextValue, [{ type: 'add', entityArr }]);
		setTreatmentValues(newTreatment, u_id, treatmentName, replicates, animalsRep, treatmentNotes, treatmentSite, herdRows, herdIndex);
		temp.set(u_id, newTreatment);
		setStepValues(temp);
	};

	const isFilledIn = () => {
		if (edit && treatmentName === '') return true;
		if (treatmentName === '') return true;
		if (!valid.treatment) return true;
		return treatmentSite?.length === 0;
	};

	const clearDialogFields = () => {
		setValid({ ...valid, treatment: true });
		setTreatmentName('');
		setHerdGroup([]);
		setIsControlTreatment(false);
		setTreatmentNotes('');
		setTreatmentSite([]);
		setReplicates(undefined);
		setAnimalsRep(undefined);
	};

	const treatmentDialogFooter = () => (
		<>
			<Button
				label={edit ? translate(t, 'Save') : translate(t, 'Add')}
				onClick={() => {
					if (edit) {
						editTreatment();
						setTreatmentDialogStatus(false);
					} else {
						addTreatment();
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
			<Field configuration={dialogConfiguration.treatment} fieldState={treatmentName} setFieldState={changeTreatmentName} externalState />
			{/* <CropsList crops={crops} setCrops={setCrops} edit={edit} treatmentIndex={treatmentIndex} treatmentName={treatmentName} stepValues={stepValues} tolgifyItem={tolgifyItem} /> */}
			{/* {crops.length > 1 ? <Field configuration={dialogConfiguration.intercrop} fieldState={intercrop} setFieldState={setIntercrop} externalState /> : null} */}
			<Field configuration={dialogConfiguration.herdGroup} fieldState={herdGroup} setFieldState={setHerdGroup} externalState id={selectedExperiment} />
			<Field configuration={dialogConfiguration.site} fieldState={treatmentSite} setFieldState={setTreatmentSite} externalState />
			<Field configuration={dialogConfiguration.control} fieldState={isControlTreatment} setFieldState={setIsControlTreatment} externalState />
			<Field configuration={dialogConfiguration.replicates} fieldState={replicates} setFieldState={setReplicates} externalState />
			<Field configuration={dialogConfiguration.animalsRep} fieldState={animalsRep} setFieldState={setAnimalsRep} externalState />
			<Field configuration={dialogConfiguration.notes} fieldState={treatmentNotes} setFieldState={setTreatmentNotes} externalState />
		</Dialog>
	);
};

export default TreatmentDialog;
