/* eslint-disable max-len */
import React, { useState, useEffect, useMemo, useContext } from 'react';
import { RadioButton } from 'primereact/radiobutton';
import { useTranslate } from '@tolgee/react';
import {
	translate,
	makeValueObject,
	createId,
} from '../../../../../../../../utils';
import allPracticeConfigurations from './configurations/allPracticeConfigurations';
import Field from '../../../../../../../../components/Field';
import './styles.css';
import DescriptionBox from '../../../../../../../../components/DescriptionBox';
import { HelperContext } from '../../../../../../../../context';

const Practice = (props) => {
	const { t } = useTranslate();
	const { stepValues, setStepValues, treatmentData, practice, crop, compositeId } = props;
	const [localFields, setLocalFields] = useState(new Map());
	const [status, setStatus] = useState();

	const { helperContextValue } = useContext(HelperContext);
	const { timeVocabs } = helperContextValue;

	const configuration = useMemo(() => {
		return allPracticeConfigurations.find((practiceConfig) => practiceConfig.id === practice);
	}, [practice]);

	const initializePractice = (tempPractice) => {
		if (tempPractice?.size > 0) {
			setLocalFields(tempPractice);
			setStatus(tempPractice.get('6da5f88c-d112-472d-b87e-91300186a2c1'));
		} else {
			const tempFields = new Map();
			configuration.content.forEach((field) => {
				if (field.data === 'table') {
					tempFields.set(field.id, new Map());
				} else if (field.data) {
					tempFields.set(field.id, makeValueObject());
				}
			});
			setLocalFields(tempFields);
		}
	};

	useEffect(
		() => {
			if (localFields.size === 0) {
				const temp = stepValues.get(treatmentData);
				if (temp.size > 0) {
					const cropRow = temp.get('b7dde218-8a82-484f-812d-8a5c49682462').get(crop);
					const tempPractice = cropRow.get(practice);
					initializePractice(tempPractice);
				}
			}
		}, []
	);

	useEffect(() => {
		if (localFields.size > 0) {
			const map = new Map(stepValues);
			const tempTreatment = map.get(treatmentData);
			const tempCrops = tempTreatment.get('b7dde218-8a82-484f-812d-8a5c49682462');
			const tempCrop = tempCrops.get(crop);
			tempCrop.set(practice, localFields);
			tempCrops.set(crop, tempCrop);
			tempTreatment.set('b7dde218-8a82-484f-812d-8a5c49682462', tempCrops);
			map.set(treatmentData, tempTreatment);
			setStepValues(map);
		}
	}, [localFields]);

	useEffect(() => {
		if (status === 'reported') {
			setCropHelper();
		}
	}, [status]);

	const makeRows = (setItems, siteId, genRow) => {
		const rows = new Map();
		const relevantPairs = timeVocabs?.pairedVocab?.filter((pair) => {
			return siteId?.includes(pair.siteId);
		});

		relevantPairs?.forEach((pair) => {
			const newRow = genRow();
			const u_id = createId();
			newRow.set('e05e0fc3-fe95-46d8-97e1-2acc0d77af93', makeValueObject(pair.value.site, pair.rowId));
			newRow.set('09981240-786b-4286-84b8-42b577622589', makeValueObject(pair.value.period, pair.rowId));
			rows.set(u_id, newRow);
		});
		setItems(rows);
	};

	// const refreshRows = (items, setItems, siteId, genRow) => {
	// 	const relevantPairs = timeVocabs?.pairedVocab?.filter((pair) => {
	// 		return siteId?.includes(pair.id);
	// 	});
	// 	const temp = new Map(items);
	// 	items?.forEach((row, key) => {
	// 		const field = row.get('e05e0fc3-fe95-46d8-97e1-2acc0d77af93');
	// 		const pair = relevantPairs.find((item) => item.rowId === field.id);
	// 		if (pair) {
	// 			field.value = pair.val;
	// 			row.set('e05e0fc3-fe95-46d8-97e1-2acc0d77af93', field);
	// 			temp.set(key, row);
	// 		} else {
	// 			temp.delete(key);
	// 		}
	// 	});
	//
	// 	relevantPairs?.forEach((pair) => {
	// 		let pairFound = false;
	// 		items.forEach((row) => {
	// 			const field = row.get('e05e0fc3-fe95-46d8-97e1-2acc0d77af93');
	// 			if (field.id === pair.rowId) {
	// 				pairFound = true;
	// 			}
	// 		});
	// 		if (!pairFound) {
	// 			const newRow = genRow();
	// 			newRow.set('e05e0fc3-fe95-46d8-97e1-2acc0d77af93', makeValueObject(pair.val, pair.rowId));
	// 			temp.set(createId(), newRow);
	// 		}
	// 	});
	// 	setItems(temp);
	// };

	const setCropHelper = () => {
		const crops = Array.from(stepValues?.get(treatmentData)?.get('crop-index'), (item) => {
			return { key: item[0], value: item[1] };
		});
		if (crops) {
			const selectedCrop = crops.find((c) => c.value === crop);
			helperContextValue.setHelperState({ ...helperContextValue.helperState, varietyCrop: selectedCrop.key });
		}
	};

	// const lockEntities = (row, rowId) => {
	// 	const siteVal = row.get('e05e0fc3-fe95-46d8-97e1-2acc0d77af93');
	// 	const periodVal = row.get('09981240-786b-4286-84b8-42b577622589');
	// 	const transformedPeriods = findPairedRows(helperContextValue, siteVal, periodVal);
	// 	addLockedEntities(helperContextValue, [{ entityParam: transformedPeriods, entityType: 'seasonalPairs', entityAssociate: [rowId, practice, treatmentData] }], 'add');
	// };

	const renderFields = () => {
		if (practice) {
			return configuration.content.map((item) => {
				if (item.id === '25503ac7-a05e-4c41-8efe-6305112b28f6' || item.id === '838a285c-c6ed-45be-982b-fa5490d89d76') {
					// item.customFunctions = { makeRows, refreshRows };
					// eslint-disable-next-line no-param-reassign
					item.customFunctions = { makeRows };
				}
				const tempData = stepValues.get(treatmentData);
				const cropCount = tempData.get('crop-index').size;
				const siteId = tempData.get('255fb141-ee7b-4571-bc55-b75a00f3e899').value?.map((selSite) => selSite.id);
				return <Field configuration={item} stepValues={localFields} setStepValues={setLocalFields} disabled={status !== 'reported'} compositeId={`${compositeId}_${practice}`} cropCount={cropCount} siteId={siteId} associates={{ treatmentId: treatmentData, practiceId: practice }} />;
			});
		} 
		return null;
	};

	const setPracticeStatus = (val) => {
		const temp = new Map(localFields);
		temp.set('6da5f88c-d112-472d-b87e-91300186a2c1', val);
		setLocalFields(temp);
		setStatus(val);
	};

	return (
		<div className="modal-practice p-grid">
			<DescriptionBox descriptionKey={configuration.description ? `${configuration.header}-desc` : null} descriptionList={configuration.descriptionList} />
			<div className="report">
				<div className="field-radiobutton status1">
					<RadioButton inputId="status1" name="status" value="reported" onChange={(e) => setPracticeStatus(e.value)} checked={status === 'reported'} />
					<label id="status1-label" htmlFor="status1">{translate(t, 'There is information on this practice')}</label>
				</div>
				<div className="field-radiobutton status2">
					<RadioButton inputId="status2" name="status" value="" onChange={(e) => setPracticeStatus(e.value)} checked={status === ''} />
					<label id="status2-label" htmlFor="status2">{translate(t, 'Practice is mentioned, but there are no details to collect')}</label>
				</div>
				<div className="field-radiobutton status3">
					<RadioButton inputId="status3" name="status" value="not reported" onChange={(e) => setPracticeStatus(e.value)} checked={status === 'not reported'} />
					<label id="status3-label" htmlFor="status3">{translate(t, 'Practice is not mentioned or irrelevant')}</label>
				</div>
			</div>
			{renderFields()}
		</div>
	);
};

export default Practice;
