import React, { useContext, useEffect } from 'react';
import './styles.css';
import { HelperContext } from '../../../../../../context';
import configuration from './configuration';
import Field from '../../../../../../components/Field';
import { performLockedAction } from '../../../../../../utils';

const TimeClimate = (props) => {
	const { stepValues, setStepValues } = props;
	// const [localFields, setLocalFields] = useState(new Map());

	const { helperContextValue } = useContext(HelperContext);
	const { timeVocabs } = helperContextValue;

	useEffect(() => {
		if (!(stepValues instanceof Map && stepValues.size > 0)) return;
		const rows = stepValues.get('6d3e2ad7-97a6-4b3f-916a-62f5e00cc709');
		const newEntityArr = [];
		rows?.forEach((row) => {
			const pair = row.get('841a4461-caa0-4e28-b585-3aabc3a32817')?.value;
			if (pair || pair === '') {
				newEntityArr.push(pair);
			}
		});
		performLockedAction(helperContextValue, [{ type: 'rebuild', entityArr: [{ entityParam: newEntityArr, entityType: 'timePairs' }] }]);
	}, [stepValues]);

	// useEffect(() => {
	// 	if (!stepValues || stepValues.size === 0) return;
	//
	// 	const sitesVocab = [];
	// 	const periodsVocab = [];
	// 	const pairedVocab = new Set();
	//
	// 	const rows = stepValues.get('42427846-00ac-4d36-b3b9-4ae2e9f4b0e9');
	// 	rows?.forEach((row, rowId) => {
	// 		const site = row.get('a616b6d7-3ea5-4259-b1da-90ca26aa7c08');
	// 		const period = row.get('f13c9e93-a91a-4e21-a6b4-8b4d0f85adcb')?.value;
	// 		if (site && period) {
	// 			const siteIndex = sitesVocab.findIndex((st) => st.val === site.value.val);
	// 			if (siteIndex < 0) {
	// 				sitesVocab.push(site?.value);
	// 			}
	//
	// 			const periodIndex = periodsVocab.findIndex((prd) => prd.val === period);
	// 			if (periodIndex >= 0) {
	// 				const sites = [...periodsVocab[periodIndex].sites, site.value];
	// 				periodsVocab[periodIndex] = { ...periodsVocab[periodIndex], sites };
	// 			} else {
	// 				periodsVocab.push({ val: period, sites: [site?.value] });
	// 			}
	//
	// 			pairedVocab.add({ val: `${site.value.val} - ${period}`, id: site.value.id, rowId });
	// 		}
	// 	});
	//
	// 	setTimeVocabs({ sitesVocab: Array.from(sitesVocab), periodsVocab, pairedVocab: Array.from(pairedVocab) });
	// }, [stepValues]);

	const bodyTemplate = (data, col, localState, setLocalState) => {
		const assignConfig = () => {
			const tempFieldConfig = configuration.content.find((field) => field.col === col.field);
			switch (col.field) {
			case 'site_period': {
				const opts = [];
				timeVocabs?.pairedVocab?.forEach((pair) => {
					opts.push({ term: pair.term, id: pair.rowId });
				});
				tempFieldConfig.options = opts;
				break;
			}
			default:
				break;
			}
			return tempFieldConfig;
		};

		const newConfig = assignConfig();
		newConfig.colLabel = col.header;
		return <Field configuration={newConfig} stepValues={localState} setStepValues={setLocalState} id={data.key} parent="input-table" />;
	};

	return (
		<Field configuration={configuration} stepValues={stepValues} setStepValues={setStepValues} customFunctions={{ bodyTemplate }} />
	);
};

export default TimeClimate;
