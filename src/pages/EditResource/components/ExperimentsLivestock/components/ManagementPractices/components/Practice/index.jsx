/* eslint-disable max-len */
import React, { useState, useEffect, useMemo, useContext } from 'react';
import { RadioButton } from 'primereact/radiobutton';
import { useTranslate } from '@tolgee/react';
import {
	translate,
	makeValueObject,
} from '../../../../../../../../utils';
import allPracticeConfigurations from './configurations/allPracticeConfigurations';
import Field from '../../../../../../../../components/Field';
import './styles.css';
import DescriptionBox from '../../../../../../../../components/DescriptionBox';
import { HelperContext } from '../../../../../../../../context';

const Practice = (props) => {
	const { t } = useTranslate();
	const { stepValues, setStepValues, treatmentData, practice, product, compositeId } = props;
	const [localFields, setLocalFields] = useState(new Map());
	const [status, setStatus] = useState();

	const { helperContextValue } = useContext(HelperContext);

	const configuration = useMemo(() => {
		return allPracticeConfigurations.find((practiceConfig) => practiceConfig.id === practice);
	}, [practice]);

	const initializePractice = (tempPractice) => {
		if (tempPractice.size > 0) {
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
					const prodRow = temp.get('7327aa17-85fc-40e8-a02f-46c6cbbcf88d').get(product);
					const tempPractice = prodRow.get(practice);
					initializePractice(tempPractice);
				}
			}
		}, []
	);

	useEffect(() => {
		console.log(practice);
		if (status === 'reported' && (practice === '47f30473-e49b-4068-9ab0-48f743eff6c4' || 'practice' === '23964cc6-185a-4e4f-85c6-8fe66e2eef89')) {
			setDietHelper(stepValues, helperContextValue);
		}
	}, [stepValues]);

	const setDietHelper = (step, helperContext) => {
		const diets = [];
		const rows = step.get(treatmentData).get('7327aa17-85fc-40e8-a02f-46c6cbbcf88d').get(product).get('4c3ef6d5-fce5-4161-a612-73f27f255100')
			.get('688bcf0d-5cc2-4729-82f9-8651a23a695a');
		rows?.forEach((row) => {
			const dietName = row.get('cf746550-5e3b-4f0f-88c4-8dba5b6391e2').value;
			if (dietName) {
				diets.push({ term: dietName });
			}
		});
		helperContext.setHelperState({ ...helperContext.helperState, relevantDiets: diets });
	};

	useEffect(() => {
		if (localFields.size > 0) {
			const map = new Map(stepValues);
			const tempTreatment = map.get(treatmentData);
			const tempCrops = tempTreatment.get('7327aa17-85fc-40e8-a02f-46c6cbbcf88d');
			const tempCrop = tempCrops.get(product);
			tempCrop.set(practice, localFields);
			tempCrops.set(product, tempCrop);
			tempTreatment.set('7327aa17-85fc-40e8-a02f-46c6cbbcf88d', tempCrops);
			map.set(treatmentData, tempTreatment);
			setStepValues(map);
		}
	}, [localFields]);

	const renderFields = () => {
		if (practice) {
			return configuration.content.map((item) => {
				const tempData = stepValues.get(treatmentData);

				const siteId = tempData.get('4f1cbd0c-92b7-44d1-b0d9-a844980bf061').value?.map((selSite) => selSite.id);
				return <Field configuration={item} stepValues={localFields} setStepValues={setLocalFields} disabled={status !== 'reported'} compositeId={`${compositeId}_${practice}`} siteId={siteId} associates={{ treatmentId: treatmentData, practiceId: practice }} />;
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
