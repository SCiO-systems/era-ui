/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useRef, useState } from 'react';
import './styles.css';
import { useTranslate } from '@tolgee/react';
import { ContextMenu } from 'primereact/contextmenu';
import { translate, replaceAll, replaceValue } from '../../../../../../../../utils';

const BodyCell = (props) => {
	const { stepValues, setStepValues, openPracticeDialog, cellTreatment, practice, setNoCopyDialogVisible, copySource, setCopySource, setCopyTarget } = props;
	const { t } = useTranslate();

	const initialItems = [
		{
			label: 'Copy to',
			icon: 'fa-regular fa-file-import',
			items: [],
		},
	];

	const cm = useRef(null);

	const [contextItems, setContextItems] = useState([...initialItems]);

	const getContextMenuItems = (treat, prac, crop) => {
		if (stepValues.size > 0) {
			const clickedCellData = {
				treatmentId: cellTreatment.key,
				practiceId: prac,
				cropId: crop,
			};
			const newContextItems = [];
			const treatmentSites = cellTreatment.value?.get('255fb141-ee7b-4571-bc55-b75a00f3e899')?.value;
			const currentPractice = treat.value.get('b7dde218-8a82-484f-812d-8a5c49682462').get(clickedCellData.cropId).get(clickedCellData.practiceId);
			stepValues.forEach((treatment, treatmentKey) => {
				treatment.get('crop-index').forEach((treatmentCrop, cropKey) => {
					if (!(treatmentKey === clickedCellData.treatmentId && treatmentCrop === clickedCellData.cropId)) {
						const newCopyToItem = {
							label: `${treatment.get('536238f6-d1db-4186-96fb-8d1512b59fa6').value} - ${translate(t, cropKey)}`,
							icon: '',
							command: () => replaceValue(stepValues, setStepValues, setNoCopyDialogVisible, treatmentKey, clickedCellData.practiceId, currentPractice, treatmentCrop, treatmentSites, 'crop'),
						};
						newContextItems.push(newCopyToItem);
					}
				});
			});

			const itms = initialItems;
			itms.push({
				label: translate(t, 'Delete Cell'),
				icon: 'fa-regular fa-trash',
				className: 'delete-menu-item',
				command: () => deletePractice(cellTreatment.key, clickedCellData.practiceId, clickedCellData.cropId),
			});
			itms.push({
				label: translate(t, 'Copy to All'),
				icon: 'fa-regular fa-copy',
				command: () => replaceAll(stepValues, setStepValues, setNoCopyDialogVisible, currentPractice, clickedCellData.practiceId, treatmentSites, 'crop'),
			});
			itms[0].items = newContextItems;
			setContextItems(itms);
		}
	};

	const deletePractice = (treatmentKey, practiceId, cropKey) => {
		const temp = new Map(stepValues);

		const targetTreatment = temp.get(treatmentKey);
		const cropRows = targetTreatment.get('b7dde218-8a82-484f-812d-8a5c49682462');
		const targetCrop = cropRows.get(cropKey);
		targetCrop.set(practiceId, new Map());
		cropRows.set(cropKey, targetCrop);
		targetTreatment.set('b7dde218-8a82-484f-812d-8a5c49682462', cropRows);
		temp.set(treatmentKey, targetTreatment);

		setStepValues(temp);
	};
	
	const getBasePracticeName = (prac, crop) => {
		if (prac.id) {
			const cropRows = cellTreatment.value.get('b7dde218-8a82-484f-812d-8a5c49682462');
			const cropRow = cropRows.get(crop);
			const currentPrac = cropRow.get(prac.id);
			if (currentPrac instanceof Map && currentPrac.size > 0) {
				const practiceName = currentPrac.get('d59ff545-246d-4add-91dc-ae64633ce9e9');
				if (practiceName && practiceName.value) {
					return practiceName.value;
				}
			}
		}
		return '';
	};

	const renderCells = (crops, assignColor) => {
		const cellsArray = [];
		crops.forEach((practicesMap, cropId) => {
			const currentPractice = { id: practice.id, value: practicesMap.get(practice.id) };
			let practiceStatus;
			if (currentPractice?.value) {
				practiceStatus = currentPractice.value.get('6da5f88c-d112-472d-b87e-91300186a2c1');
			}

			cellsArray.push(
				<div
					className="button-cell"
					id={`${cellTreatment.id}/${practice.id}/${cropId}`}
					draggable
					onClick={() => {
						openPracticeDialog(currentPractice?.id, cellTreatment.key, cropId);
					}}
					onDragStart={() => {
						const temp = { treatmentId: cellTreatment.key, practiceId: currentPractice?.id, cropId };
						setCopySource({ ...temp });
					}}
					onDragOver={(event) => {
						event.target.classList.add('dragover');
					}}
					onDragLeave={(event) => {
						event.target.classList.remove('dragover');
					}}
					onDrop={(event) => {
						const temp = { treatmentId: cellTreatment.key, practiceId: currentPractice?.id, cropId };
						if (copySource.practiceId === temp.practiceId) {
							setCopyTarget(temp);
						} else {
							event.target.classList.add('pulse');
							setTimeout(() => {
								event.target.classList.remove('pulse');
							}, 500);
						}
						event.target.classList.remove('dragover');
					}}
					onContextMenu={(e) => {
						getContextMenuItems(cellTreatment, currentPractice?.id, cropId);
						cm.current.show(e);
					}}
					style={assignColor(practiceStatus)}
				>
					<p
						className="body-cell-text"
					>
						{getBasePracticeName(practice, cropId)}
					</p>
				</div>
			);
		});
		return cellsArray;
	};
	
	const bodyTemplate = () => {
		// const practice = cellTreatment.practices.find((item) => item.id === practiceId);
		const crops = cellTreatment.value.get('b7dde218-8a82-484f-812d-8a5c49682462');
		const assignColor = (status) => {
			switch (status) {
			case 'reported': return { backgroundColor: '#375a63', color: 'white' };
			// case 'reported': return { backgroundColor: '#ffffff' };
			case '': return { backgroundColor: '#d7d7d7', color: 'black' };
			case 'not reported': return { backgroundColor: '#D32F2F', color: 'white' };
			default: return { backgroundColor: '#d7d7d7', color: 'white' };
			}
		};
		return (
			<div key={`${cellTreatment.key}${practice.id}`} className="body">
				{renderCells(crops, assignColor)}
			</div>
		);
	};

	return (
		<div>
			{/* <Tooltip target=".body-cell-text" autoHide /> */}
			<ContextMenu model={contextItems} ref={cm} />
			{bodyTemplate()}
		</div>
	);
};

export default BodyCell;
