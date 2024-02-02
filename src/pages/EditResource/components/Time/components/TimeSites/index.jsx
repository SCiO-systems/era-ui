import React, { useContext, useEffect } from 'react';
import './styles.css';
import { GlobalDataContext, HelperContext } from '../../../../../../context';
import configuration from './configuration';
import Field from '../../../../../../components/Field';
import { performLockedAction } from '../../../../../../utils';

const TimeSites = (props) => {
	const { stepValues, setStepValues } = props;

	const { globalDataContextValue } = useContext(GlobalDataContext);
	const { sitesData } = globalDataContextValue;

	const { helperContextValue } = useContext(HelperContext);
	const { timeVocabs, setTimeVocabs } = helperContextValue;

	useEffect(() => {
		if (!stepValues || stepValues.size === 0) return;
		
		const periodsVocab = [];
		const pairedVocab = [];
		const rows = stepValues.get('42427846-00ac-4d36-b3b9-4ae2e9f4b0e9');
		rows?.forEach((row, rowId) => {
			const site = row.get('a616b6d7-3ea5-4259-b1da-90ca26aa7c08')?.value;
			const period = row.get('f13c9e93-a91a-4e21-a6b4-8b4d0f85adcb')?.value;
			if (site && period) {
				const periodIndex = periodsVocab.findIndex((prd) => prd.term === period.term);
				if (periodIndex >= 0) {
					const sites = [...periodsVocab[periodIndex].sites, site];
					periodsVocab[periodIndex] = { ...periodsVocab[periodIndex], sites };
				} else {
					periodsVocab.push({ term: period.term, sites: [site], id: period.id });
				}
				const term = `${site.term} - ${period.term}`;
				if (!pairedVocab.find((pair) => pair.term === term)) {
					pairedVocab.push({ value: { site, period }, siteId: site.id, rowId, term });
				}
			}
		});

		setTimeVocabs({ ...timeVocabs, periodsVocab, pairedVocab });
	}, [stepValues]);

	useEffect(() => {
		if (!(stepValues instanceof Map && stepValues.size > 0)) return;
		const rows = stepValues.get('42427846-00ac-4d36-b3b9-4ae2e9f4b0e9');
		const periodArr = [];
		const siteArr = [];
		rows?.forEach((row) => {
			const period = row.get('f13c9e93-a91a-4e21-a6b4-8b4d0f85adcb')?.value;
			const site = row.get('a616b6d7-3ea5-4259-b1da-90ca26aa7c08')?.value;
			if (period || period === '') {
				periodArr.push(period);
			}
			if (site || site === '') {
				siteArr.push(site);
			}
		});
		const newEntityArr = [
			{
				entityParam: periodArr, entityType: 'timePeriods',
			},
			{
				entityParam: siteArr, entityType: 'timeSites',
			},
		];
		performLockedAction(helperContextValue, [{ type: 'rebuild', entityArr: newEntityArr }]);
	}, [stepValues]);

	const unlockEntities = (data) => {
		const period = data.value.get('f13c9e93-a91a-4e21-a6b4-8b4d0f85adcb')?.value;
		const site = data.value.get('a616b6d7-3ea5-4259-b1da-90ca26aa7c08')?.value;

		const newEntityArr = [];
		if (period) {
			newEntityArr.push({ entityParam: period, entityType: 'timePeriods' });
		}
		if (site) {
			newEntityArr.push({ entityParam: site, entityType: 'timeSites' });
		}
		performLockedAction(helperContextValue, [{ type: 'delete', entityArr: newEntityArr }]);
	};

	const bodyTemplate = (data, col, localState, setLocalState) => {
		const assignConfig = () => {
			const tempFieldConfig = configuration.content.find((field) => field.col === col.field);
			switch (col.field) {
			case 'period_name': {
				const periodsTable = stepValues.get('cb718d89-dbbf-41d3-a2c5-044ef8578a21');
				if (periodsTable) {
					const opts = [];
					periodsTable.forEach((periodRow) => {
						const period = periodRow.get('5fec44e2-cb3c-42ee-91cf-e29c2b1dae54');
						if (period) {
							opts.push({ term: period.value, id: period.id } || '');
						}
					});
					tempFieldConfig.options = opts;
				} else {
					tempFieldConfig.options = [];
				}
				break;
			}
			case 'site': {
				const opts = [];
				const sites = new Map(sitesData.get('be7817c9-10ac-4669-b131-ae077e22855d'));
				sites.forEach((s) => {
					opts.push({ term: s.get('b6f2545f-c745-4902-a3e5-852f775a9190').value.term, id: s.get('b6f2545f-c745-4902-a3e5-852f775a9190').id });
				});
				tempFieldConfig.options = opts;
				break;
			}
			default:
				break;
			}
			return tempFieldConfig;
		};

		const isDisabled = () => {
			if (helperContextValue.lockedEntities.timePairs?.includes(data.key)) {
				return true;
			}
			if (data.value?.get('a616b6d7-3ea5-4259-b1da-90ca26aa7c08')?.value && data.value?.get('f13c9e93-a91a-4e21-a6b4-8b4d0f85adcb')?.value) {
				if (helperContextValue.lockedEntities.treatmentSites?.find((s) => s.id === data.value?.get('a616b6d7-3ea5-4259-b1da-90ca26aa7c08')?.value?.id)) {
					return true;
				}
			}
			return false;
		};

		const newConfig = assignConfig();
		newConfig.colLabel = col.header;
		return <Field configuration={newConfig} stepValues={localState} setStepValues={setLocalState} disabled={isDisabled()} id={data.key} parent="input-table" />;
	};

	const isLocked = (data) => {
		if (helperContextValue.lockedEntities.timePairs?.includes(data.key)) {
			return true;
		}
		if (data.value?.get('a616b6d7-3ea5-4259-b1da-90ca26aa7c08')?.value && data.value?.get('f13c9e93-a91a-4e21-a6b4-8b4d0f85adcb')?.value) {
			if (helperContextValue.lockedEntities.treatmentSites?.find((s) => s.id === data.value?.get('a616b6d7-3ea5-4259-b1da-90ca26aa7c08')?.value?.id)) {
				return true;
			}
		}
		return false;
	};

	return (
		<Field configuration={configuration} stepValues={stepValues} setStepValues={setStepValues} customFunctions={{ bodyTemplate, unlockEntities, isLocked }} />
	);
};

export default TimeSites;
