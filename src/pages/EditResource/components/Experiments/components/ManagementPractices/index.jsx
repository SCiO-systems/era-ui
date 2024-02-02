/* eslint-disable max-len,jsx-a11y/no-static-element-interactions */
import React, { useContext, useEffect, useState } from 'react';
import './styles.css';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { MultiSelect } from 'primereact/multiselect';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { useTranslate } from '@tolgee/react';
import { Practice, TreatmentDialog, BodyCell } from './components';
import {
	translate,
	mapToArray,
	updateCustomTerms,
	makeValueObject,
	replaceValue, performLockedAction,
} from '../../../../../../utils';
import configuration from './configuration';
import { HelperContext, ReviewContext } from '../../../../../../context';
import DescriptionBox from '../../../../../../components/DescriptionBox';

const ManagementPractices = (props) => {
	const { reviewContextValue } = useContext(ReviewContext);
	const { helperContextValue } = useContext(HelperContext);
	const { customTerms, setCustomTerms } = reviewContextValue;
	const { t } = useTranslate();

	const { selectedExperiment, stepValues, setStepValues, compositeId } = props;

	const [addTreatmentDialog, setAddTreatmentDialog] = useState(false);
	const [editing, setEditing] = useState(false);
	const [selectedTreatment, setSelectedTreatment] = useState({});
	const [selectedPractice, setSelectedPractice] = useState({});
	const [selectedCrop, setSelectedCrop] = useState(null);
	const [practiceDialog, setPracticeDialog] = useState(false);
	const [currentEditItem, setCurrentEditItem] = useState();
	const [noCopyDialogVisible, setNoCopyDialogVisible] = useState(false);

	const getPractices = () => {
		const practiceArray = [];
		configuration.practices.content.forEach((practice) => {
			practiceArray.push({ id: practice.id, name: practice.header });
		});
		return practiceArray;
	};

	const practiceNames = getPractices();
	const [selectedPracticeNames, setSelectedPracticeNames] = useState(practiceNames);

	const [localFields, setLocalFields] = useState();
	const [treatmentIndex, setTreatmentIndex] = useState(new Map());

	const [copySource, setCopySource] = useState({});
	const [copyTarget, setCopyTarget] = useState({});
	useEffect(
		() => {
			if (copySource.treatmentId && copyTarget.treatmentId) {
				const sourceValue = localFields.get(copySource.treatmentId);
				const sourceCrop = sourceValue.get('b7dde218-8a82-484f-812d-8a5c49682462').get(copySource.cropId);
				const treatmentSites = sourceValue.get('255fb141-ee7b-4571-bc55-b75a00f3e899')?.value;
				if (sourceCrop.has(copySource.practiceId)) {
					const sourcePractice = sourceCrop.get(copySource.practiceId);
					replaceValue(localFields, setLocalFields, setNoCopyDialogVisible, copyTarget.treatmentId, copyTarget.practiceId, sourcePractice, copyTarget.cropId, treatmentSites, 'crop');
					setCopySource({});
					setCopyTarget({});
				}
			}
		}, [copySource, copyTarget]
	);

	useEffect(() => {
		if (!(localFields instanceof Map)) {
			const temp = new Map(stepValues.get(selectedExperiment));
			const rowMap = temp.get(configuration.id);
			if (rowMap && rowMap.size > 0) {
				setLocalFields(rowMap);
				if (treatmentIndex.size === 0) {
					setTreatmentIndex(temp.get('treatment-index'));
				}
			} else {
				const tempFields = new Map(localFields);
				setLocalFields(tempFields);
			}
		}
	}, []);

	useEffect(() => {
		if (localFields instanceof Map) {
			const map = new Map(stepValues);
			const rowMap = map.get(selectedExperiment);
			rowMap.set('treatment-index', treatmentIndex);

			rowMap.set(configuration.id, localFields);
			map.set(selectedExperiment, rowMap);
			setStepValues(map);
		}
	}, [localFields]);

	const headerTemplate = () => (
		<div className="matrix-header">
			<MultiSelect
				value={selectedPracticeNames}
				options={practiceNames}
				onChange={(e) => {
					if (e.value) {
						setSelectedPracticeNames(e.value);
					} else {
						setSelectedPracticeNames([]);
					}
				}
				}
				style={{ width: '70%' }}
				display="chip"
				itemTemplate={tolgifyItem}
				selectedItemTemplate={tolgifyValueHeader}
				showClear
			/>
			<Button
				label={translate(t, 'Add Treatment')}
				onClick={() => {
					setAddTreatmentDialog(true);
					setEditing(false);
					setCurrentEditItem(undefined);
				}}
			/>
		</div>
	);

	const cropsBodyTemplate = (data) => {
		const dataCrops = data.value.get('crop-index');
		if (dataCrops) {
			return (
				<div className="crops">
					{Array.from(dataCrops.keys()).map((crop) => <p>{translate(t, crop)}</p>)}
				</div>
			);
		}
		return null;
	};

	const treatmentNameTemplate = (data) => (
		<div className="name">
			<div className="treatment-name">
				<p className="treatment-name-text">{translate(t, data.value.get('536238f6-d1db-4186-96fb-8d1512b59fa6').value)}</p>
				{data.value.get('ed985b23-9e7f-4bdf-bcbf-1a7e6915bf14').value ? <i className="fa-solid fa-circle-c treatment-control" /> : null}
			</div>
		</div>
	);

	const sitesBodyTemplate = (data) => {
		const dataSites = data.value.get('255fb141-ee7b-4571-bc55-b75a00f3e899').value?.map((site) => site.term);
		if (dataSites) {
			return (
				<div className="treatment-sites">
					<p>{dataSites.join(', ')}</p>
				</div>
			);
		}
		return null;
	};

	const columnWontBeReported = (colId) => {
		const temp = new Map(localFields);
		const newValues = new Map();
		if (colId === 'cedfd622-3e39-4154-9fa5-4988e0a29406') {
			temp.forEach((treatment, treatmentKey) => {
				const practiceFields = treatment.get('cedfd622-3e39-4154-9fa5-4988e0a29406');
				const newPracticeFields = new Map();
				const newTreatment = new Map(treatment);
				if (practiceFields.size > 0) {
					practiceFields.forEach((field, key) => {
						if (key === '6da5f88c-d112-472d-b87e-91300186a2c1') {
							newPracticeFields.set('6da5f88c-d112-472d-b87e-91300186a2c1', 'not reported');
						} else if (field instanceof Map) {
							newPracticeFields.set(key, new Map());
						} else {
							const object = makeValueObject();
							object.value = undefined;
							newPracticeFields.set(key, object);
						}
					});
				} else {
					newPracticeFields.set('6da5f88c-d112-472d-b87e-91300186a2c1', 'not reported');
				}
				newTreatment.set('cedfd622-3e39-4154-9fa5-4988e0a29406', newPracticeFields);
				newValues.set(treatmentKey, newTreatment);
			});
			setLocalFields(newValues);
		} else {
			temp.forEach((treatment, treatmentKey) => {
				const crops = treatment.get('b7dde218-8a82-484f-812d-8a5c49682462');
				const newCrops = new Map();
				crops.forEach((crop, cropKey) => {
					const practiceFields = crop.get(colId);
					const newPracticeFields = new Map();
					if (practiceFields.size > 0) {
						practiceFields.forEach((field, key) => {
							if (key === '6da5f88c-d112-472d-b87e-91300186a2c1') {
								newPracticeFields.set('6da5f88c-d112-472d-b87e-91300186a2c1', 'not reported');
							} else if (field instanceof Map) {
								newPracticeFields.set(key, new Map());
							} else {
								const newValue = field;
								newValue.value = undefined;
								newPracticeFields.set(key, newValue);
							}
						});
					} else {
						newPracticeFields.set('6da5f88c-d112-472d-b87e-91300186a2c1', 'not reported');
					}
					crop.set(colId, newPracticeFields);
					newCrops.set(cropKey, crop);
				});
				const newTreatment = new Map(treatment);
				newTreatment.set('b7dde218-8a82-484f-812d-8a5c49682462', newCrops);
				newValues.set(treatmentKey, newTreatment);
			});
			setLocalFields(newValues);
		}
		updateCustomTerms(customTerms, setCustomTerms, 'delete', colId);
	};

	const columnHeader = (practice) => (
		<div className="column-header">
			<p>{translate(t, practice.name)}</p>
			<Button
				icon="fa-solid fa-circle-xmark"
				tooltip={`${translate(t, 'Disable reporting')} ${translate(t, practice.name).toLowerCase()} ${translate(t, 'practice data.')}`}
				onClick={(e) => confirmPopup({
					target: e.currentTarget,
					message: translate(t, 'By disabling this practice all related data will be deleted. Are you sure?'),
					icon: 'pi pi-info-circle',
					acceptClassName: 'p-button-danger',
					accept: () => columnWontBeReported(practice.id, practice.name),
					reject: () => {},
					acceptLabel: translate(t, 'Yes'),
					rejectLabel: translate(t, 'No'),
				})}
			/>
		</div>
	);

	const tolgifyItem = (option) => {
		if (typeof option === 'string') {
			return translate(t, option);
		}
		return translate(t, option.name);
	};

	const removeCrop = (field) => {
		const arr = [...selectedPracticeNames];
		const index = arr.findIndex((item) => item === field);
		arr.splice(index, 1);
		setSelectedPracticeNames(arr);
	};

	const tolgifyValueHeader = (option) => {
		if (option) {
			return (
				<div className="p-multiselect-token">
					<span className="p-multiselect-token-label ignore-click">
						{translate(t, option.name)}
					</span>
					<span
						className="p-multiselect-token-icon pi pi-times-circle"
						onClick={() => removeCrop(option)}
						role="button"
						tabIndex="0"
						aria-label="remove-column"
					/>
				</div>
			);
		}
		return <div />;
	};

	const practiceDialogHeader = () => {
		const treatmentName = localFields.get(selectedTreatment).get('536238f6-d1db-4186-96fb-8d1512b59fa6')?.value;
		const prac = practiceNames.find((practice) => practice.id === selectedPractice);
		const cropIndex = localFields.get(selectedTreatment).get('crop-index');
		const cropName = mapToArray(cropIndex).find((crop) => crop.value === selectedCrop);
		return `${translate(t, 'Treatment')}: ${treatmentName || ''} - ${translate(t, 'Practice')}: ${translate(t, prac.name)} - ${translate(t, 'Crop')}: ${translate(t, cropName)}`;
	};

	const openPracticeDialog = (practice, cellTreatment, item) => {
		setSelectedPractice(practice);
		setSelectedTreatment(cellTreatment);
		setSelectedCrop(item);
		setPracticeDialog(true);
	};

	const renderColumns = () => {
		if (selectedPracticeNames.length) {
			return selectedPracticeNames.map((practice) => {
				return <Column field={practice.id} body={(data) => columnBodyTemplate(data, practice)} header={() => columnHeader(practice)} />;
			});
		}
		return null;
	};

	const columnBodyTemplate = (data, practice) => {
		return (
			<BodyCell 
				stepValues={localFields}
				setStepValues={setLocalFields}
				openPracticeDialog={openPracticeDialog}
				cellTreatment={data}
				practice={practice}
				setNoCopyDialogVisible={setNoCopyDialogVisible}
				copySource={copySource}
				setCopySource={setCopySource}
				setCopyTarget={setCopyTarget}
			/>
		);
	};

	const deleteRow = (key) => {
		const temp = new Map(localFields);
		const tempIndex = new Map(treatmentIndex);
		const treatmentName = temp.get(key).get('536238f6-d1db-4186-96fb-8d1512b59fa6');
		updateCustomTerms(customTerms, setCustomTerms, 'delete', key);
		performLockedAction(helperContextValue, [{ type: 'delete-all-associates', entityType: ['treatmentSites'], entityArr: key }]);
		temp.delete(key);
		tempIndex.delete(treatmentName.value);
		setLocalFields(temp);
		setTreatmentIndex(tempIndex);
	};

	const actionsTemplate = (data) => (
		<div className="actions">
			<Button
				id="edit"
				icon="fa-regular fa-pen"
				className="edit-button"
				onClick={() => {
					setEditing(true);
					setCurrentEditItem(data.value);
					setSelectedTreatment(data.key);
					setAddTreatmentDialog(true);
				}}
			/>
			<Button
				id="delete"
				icon="fa-solid fa-xmark"
				className="delete-button"
				onClick={(e) => confirmPopup({
					target: e.currentTarget,
					message: translate(t, 'Are you sure you want to delete this treatment?'),
					icon: 'pi pi-info-circle',
					acceptClassName: 'p-button-danger',
					accept: () => deleteRow(data.key),
					reject: () => {},
					acceptLabel: translate(t, 'Yes'),
					rejectLabel: translate(t, 'No'),
				})}
			/>
		</div>
	);

	const copyAdviceFooter = () => {
		return (
			<Button
				className="p-button"
				label={translate(t, 'Okay')}
				icon="pi pi-check"
				onClick={() => {
					setNoCopyDialogVisible(false);
				}}

			/>
		);
	};

	return (
		<div className="matrix">
			<DescriptionBox descriptionKey="management-practices-desc" />
			<ConfirmPopup />
			<DataTable
				value={mapToArray(localFields)}
				header={headerTemplate}
				showGridlines
				id="inputs"
				emptyMessage={translate(t, 'No results found')}
			>
				<Column field="actions" body={actionsTemplate} header={translate(t, 'Actions')} />
				<Column field="name" body={treatmentNameTemplate} header={translate(t, 'Treatment')} />
				<Column field="sites" body={sitesBodyTemplate} header={translate(t, 'Sites')} />
				<Column field="crops" body={cropsBodyTemplate} header={translate(t, 'Crop')} />
				{renderColumns()}
			</DataTable>
			<TreatmentDialog
				configuration={configuration}
				stepValues={localFields}
				setStepValues={setLocalFields}
				treatmentDialogStatus={addTreatmentDialog}
				setTreatmentDialogStatus={setAddTreatmentDialog}
				treatmentIndex={treatmentIndex}
				setTreatmentIndex={setTreatmentIndex}
				compositeId={`${compositeId}_${configuration.id}`}
				edit={editing}
				currentEditItem={currentEditItem}
				selectedTreatment={selectedTreatment}
			/>
			<Dialog
				className="practice"
				// header={`Treatment: ${selectedTreatment?.name || ''} - Practice: ${practices.find((item) => item.id === selectedPractice.id)?.name || ''} - Crop: ${selectedCrop?.name?.name || ''}`}
				// eslint-disable-next-line prefer-template
				header={practiceDialogHeader}
				visible={practiceDialog}
				onHide={() => setPracticeDialog(false)}
				draggable={false}
			>
				<Practice stepValues={localFields} setStepValues={setLocalFields} treatmentData={selectedTreatment} practice={selectedPractice} crop={selectedPractice === 'Intercropping' ? 'Multicrop' : selectedCrop} compositeId={`${compositeId}_${configuration.id}_${selectedTreatment}_${configuration.practices.id}_${selectedCrop}`} />
			</Dialog>
			<Dialog className="copy-advice" visible={noCopyDialogVisible} onHide={() => setNoCopyDialogVisible(false)} footer={copyAdviceFooter} showHeader={false}>
				{translate(t, 'For this practice you may only copy values between treatments associated with the same site or sites.')}
			</Dialog>
		</div>
	);
};

export default ManagementPractices;
