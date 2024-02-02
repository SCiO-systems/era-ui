/* eslint-disable no-trailing-spaces,max-len */
import React, { useContext, useEffect, useState } from 'react';
import { useTranslate } from '@tolgee/react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import {
	translate,
	createId,
	mapToArray,
	updateCustomTerms,
	makeValueObject,
	performLockedAction,
} from '../../../../utils';
import ExperimentSteps from '../ExperimentsCommon/ExperimentSteps';
import './styles.css';
import { ReviewContext, GlobalDataContext, HelperContext } from '../../../../context';
import configuration from './configuration';
import DescriptionBox from '../../../../components/DescriptionBox';
import designConfiguration from '../ExperimentsCommon/ExperimentalDesign/configurationLivestock';
import ExperimentDialog from '../ExperimentsCommon/ExperimentDialog';

const Experiments = () => {
	const { t } = useTranslate();

	const { globalDataContextValue } = useContext(GlobalDataContext);
	const { experimentsData, setExperimentsData } = globalDataContextValue;
	const { reviewContextValue } = useContext(ReviewContext);
	const { customTerms, setCustomTerms } = reviewContextValue;

	const { helperContextValue } = useContext(HelperContext);

	const [addExperimentDialog, setAddExperimentDialog] = useState(false);

	const [experimentName, setExperimentName] = useState('');
	const [category, setCategory] = useState('');
	const [selectedExperiment, setSelectedExperiment] = useState(null);

	const [currentItem, setCurrentItem] = useState('');

	const [localFields, setLocalFields] = useState();

	const vocabulary = [{ value: 'Animals' }];

	useEffect(() => {
		if (!(localFields instanceof Map)) {
			const temp = new Map(experimentsData);
			if (temp.size > 0) {
				setLocalFields(new Map(temp));
			}
		}
	}, []);

	useEffect(
		() => {
			if (localFields instanceof Map) {
				const map = new Map(localFields);
				setExperimentsData(map);
			}
		}, [localFields]
	);

	const headerTemplate = () => (
		<Button label={translate(t, 'Add Experiment')} aria-label="Submit" icon="fa-solid fa-plus" iconPos="left" onClick={() => setAddExperimentDialog(true)} />
	);

	const populateRow = (rowMap) => {
		const configs = [configuration, designConfiguration];
		configs.forEach((config) => {
			config.content.forEach((field) => {
				if (field.data === 'table') {
					rowMap.set(field.id, new Map());
				} else if (field.data) {
					rowMap.set(field.id, makeValueObject());
				}
			});
		});
		return rowMap;
	};

	const addExperiment = () => {
		if (experimentName !== '' && category !== '') {
			const id = createId();
			let row = new Map();
			row = populateRow(row);
			row.set('5be57eb5-6e6a-4a41-914d-94964588707e', makeValueObject(experimentName, id));
			row.set('12841f10-62c6-439d-9290-4938ab1c124b', makeValueObject(category, id));
			updateCustomTerms(customTerms, setCustomTerms, 'add', id, configuration.content[1], category, vocabulary);

			const tempMap = new Map(localFields);
			tempMap.set(id, row);
			setLocalFields(tempMap);
			setExperimentName('');
			setCategory('');
			setAddExperimentDialog(false);
			setSelectedExperiment(id);
		}
	};

	const editExperiment = () => {
		if (experimentName !== '' && category !== '') {
			const tempMap = new Map(localFields);
			const beingEdited = tempMap.get(currentItem);
			const exp = beingEdited.get('5be57eb5-6e6a-4a41-914d-94964588707e');
			const cat = beingEdited.get('12841f10-62c6-439d-9290-4938ab1c124b');
			exp.value = experimentName;
			cat.value = category;
			beingEdited.set('5be57eb5-6e6a-4a41-914d-94964588707e', exp);
			beingEdited.set('12841f10-62c6-439d-9290-4938ab1c124b', cat);
			tempMap.set(currentItem, beingEdited);
			setLocalFields(tempMap);

			updateCustomTerms(customTerms, setCustomTerms, 'add', currentItem, configuration.content[1], category, vocabulary);
			setExperimentName('');
			setCategory('');
			setAddExperimentDialog(false);
		}
	};

	const deleteExperiment = (data) => {
		const tempMap = new Map(localFields);
		tempMap.delete(data.key);
		performLockedAction(helperContextValue, [{ type: 'delete-all-associates', entityType: ['treatmentSites'], entityArr: Array.from(data.value?.get('treatment-index')?.values()) }]);
		updateCustomTerms(customTerms, setCustomTerms, 'delete', data.key);
		setLocalFields(tempMap);
	};

	const detailsTemplate = (data) => (
		<Button icon="fa-solid fa-pen" label={translate(t, 'Enter Details')} onClick={() => setSelectedExperiment(data.key)} />
	);

	const actionsTemplate = (data) => (
		<div className="experiment-actions">
			<Button
				id="edit"
				icon="fa-regular fa-pen"
				className="edit-button"
				onClick={() => {
					setCategory(data.value.get('12841f10-62c6-439d-9290-4938ab1c124b').value);
					setExperimentName(data.value.get('5be57eb5-6e6a-4a41-914d-94964588707e').value);
					setAddExperimentDialog(true);
					setCurrentItem(data.key);
				}}
			/>
			<Button
				id="delete"
				icon="fa-solid fa-xmark"
				className="delete-button"
				onClick={(e) => confirmPopup({
					target: e.currentTarget,
					message: translate(t, 'Are you sure you want to delete the selected experiment?'),
					icon: 'pi pi-info-circle',
					acceptClassName: 'p-button-danger',
					accept: () => deleteExperiment(data),
					reject: () => {},
					acceptLabel: translate(t, 'Yes'),
					rejectLabel: translate(t, 'No'),
				})}
			/>
		</div>
	);

	const categoryTemplate = (data) => {
		return (
			<div>
				{translate(t, data.value.get('12841f10-62c6-439d-9290-4938ab1c124b').value)}
			</div>
		);
	};

	const experimentsTemplate = (data) => {
		return (
			<div>
				{translate(t, data.value.get('5be57eb5-6e6a-4a41-914d-94964588707e').value)}
			</div>
		);
	};

	const renderBody = () => {
		if (!selectedExperiment) {
			return (
				<div className="table card">
					<DescriptionBox header="Experiments" />
					<ConfirmPopup />
					<DataTable
						value={mapToArray(localFields)}
						paginator
						rows={5}
						rowsPerPageOptions={[5, 10]}
						header={headerTemplate}
						emptyMessage={translate(t, 'No results found')}
					>
						<Column field="actions" body={actionsTemplate} style={{ width: '60px' }} />
						<Column field="name" header={translate(t, 'Experiments')} sortable body={(data) => experimentsTemplate(data)} />
						<Column field="category" header={translate(t, 'Category')} sortable body={(data) => categoryTemplate(data)} />
						<Column header={translate(t, 'Experiment Details')} body={detailsTemplate} style={{ width: '30%' }} />
					</DataTable>
					<ExperimentDialog
						addExperimentDialog={addExperimentDialog}
						setAddExperimentDialog={setAddExperimentDialog}
						experimentName={experimentName}
						setExperimentName={setExperimentName}
						category={category}
						setCategory={setCategory}
						addExperiment={addExperiment}
						editExperiment={editExperiment}
						currentItem={currentItem}
					/>
				</div>
			);
		}
		return <ExperimentSteps selectedExperiment={selectedExperiment} setSelectedExperiment={setSelectedExperiment} stepValues={localFields} setStepValues={setLocalFields} />;
	};

	return (
		<div className="experiments">
			{renderBody()}
		</div>
	);
};

export default Experiments;
