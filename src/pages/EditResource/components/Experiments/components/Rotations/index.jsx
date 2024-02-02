import React, { useContext } from 'react';
import './styles.css';
import Field from '../../../../../../components/Field';
import configuration from './configuration';
import { GlobalDataContext, HelperContext } from '../../../../../../context';

const Rotations = (props) => {
	const { stepValues, setStepValues, selectedExperiment, compositeId } = props;
	const { globalDataContextValue } = useContext(GlobalDataContext);
	const { sitesData, timeData } = globalDataContextValue;

	const { helperContextValue } = useContext(HelperContext);
	const { timeVocabs } = helperContextValue;

	const bodyTemplate = (data, col, localState, setLocalState, config, id, compId) => {
		const assignConfig = () => {
			const experimentData = stepValues.get(selectedExperiment);
			// const [years, seasons] = populateDates();
			const tempField = config.content.find((field) => field.col === col.field);
			switch (col.field) {
			case 'rotation_treatments': {
				const selectedSite = experimentData.get('67076c1e-3e25-4fe4-94ac-a770400e974b').get(id).get('38ebb85d-8b5f-40ec-a3f1-182acffdd67c');
				if (selectedSite && selectedSite.value && sitesData.size > 0) {
					const opts = new Set();
					selectedSite.value?.forEach((site) => {
						experimentData.get('429a3146-ecd8-483f-bb84-e8a57f559726').forEach((treatment) => {
							const treatmentSites = treatment.get('255fb141-ee7b-4571-bc55-b75a00f3e899').value;
							if (treatmentSites.find((treatmentSite) => treatmentSite.id === site.id)) {
								opts.add(treatment.get('536238f6-d1db-4186-96fb-8d1512b59fa6').value);
							}
						});
					});
					tempField.options = Array.from(opts).map((i) => { return { term: i }; });
				} else {
					tempField.options = [];
				}
				break;
			}
			case 'time_period': {
				const selectedSites = experimentData.get('67076c1e-3e25-4fe4-94ac-a770400e974b').get(id).get('38ebb85d-8b5f-40ec-a3f1-182acffdd67c');
				if (selectedSites) {
					tempField.options = timeVocabs?.periodsVocab?.filter((prd) => {
						return prd.sites.find((site) => selectedSites.value?.find((selectedSite) => site.term === selectedSite.term));
					});
				} else {
					tempField.options = [];
				}
				break;
			}
			case 'year': {
				const selectedPeriod = data.value.get('3b17e0ab-efe0-4d24-b2d6-da992a8a238e');
				const timePeriods = timeData.get('cb718d89-dbbf-41d3-a2c5-044ef8578a21');
				if (timePeriods) {
					timePeriods.forEach((row) => {
						if (row.get('5fec44e2-cb3c-42ee-91cf-e29c2b1dae54').value === selectedPeriod?.value?.term) {
							const temp = new Map(localState);
							const tempRow = temp.get(data.key);
							tempRow.set('0bbef748-5f33-4cd3-8a5c-1761755bbf5d', row.get('966614d2-16ca-4743-b345-46e076474cc4'));
							temp.set(data.key, tempRow);
						}
					});
				}
				break;
			}
			case 'season': {
				const selectedPeriod = data.value.get('3b17e0ab-efe0-4d24-b2d6-da992a8a238e');
				if (selectedPeriod) {
					const timePeriods = timeData.get('cb718d89-dbbf-41d3-a2c5-044ef8578a21');
					if (timePeriods) {
						timePeriods.forEach((row) => {
							if (row.get('5fec44e2-cb3c-42ee-91cf-e29c2b1dae54').value === selectedPeriod?.value?.term) {
								const temp = new Map(localState);
								const tempRow = temp.get(data.key);
								tempRow.set('4059bd97-19ba-4d82-942a-fae039020c5f', row.get('d6fdb665-c507-4ace-9978-f473f2367bc1'));
								temp.set(data.key, tempRow);
							}
						});
					}
				}
				break;
			}
			default:
				break;
			}
			return tempField;
		};

		const newConfig = assignConfig();
		newConfig.colLabel = col.header;
		return <Field configuration={newConfig} stepValues={localState} setStepValues={setLocalState} id={data.key} compositeId={`${compId}_${data.key}`} parent="input-table" />;
	};

	const renderFields = () => configuration.content.map((item) =>
		<Field configuration={item} stepValues={stepValues} setStepValues={setStepValues} customFunctions={{ bodyTemplate }} id={selectedExperiment} compositeId={compositeId} />
	);

	return (
		<div>
			{renderFields()}
		</div>
	);
};

export default Rotations;
