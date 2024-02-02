// eslint-disable-next-line import/no-cycle
import { createId } from '../index';

const genInputTableColumns = (config, stepValues, setSelectedColumns, setColumnsContent) => {
	const genColumns = stepValues.get(config.columns.targetTable);
	const genColsConfiguration = [
		{
			id: '91be326c-3962-4edd-bfc2-1c08889df222',
			type: 'list',
			label: '',
			fieldInformation: '',
			valid: false,
			col: 'diet',
			dataSource: 'helper',
			generatedVocab: true,
			getOptions(data) {
				if (data.helperData.relevantDiets) {
					return data.helperData.relevantDiets;
				}
				return [];
			},
			data: true,
		},
		{
			id: '6fd9d246-99fb-4da3-bb6c-b6e1f4b53cef',
			type: 'list',
			fieldInformation: '',
			valid: false,
			data: true,
			editable: false,
			optionLabel: 'term',
			dataSource: 'timeVocabs',
			col: 'site',
			getOptions(data) {
				const { timeVocabs, siteIds } = data;
				const treatmentSites = timeVocabs?.sitesVocab?.filter((site) => {
					return siteIds?.includes(site.id);
				});
				if (treatmentSites?.length > 1) {
					treatmentSites.push({ term: 'Same for all sites' });
				}
				return treatmentSites || [];
			},
			generatedVocab: true,
		},
		{
			id: '34664fad-950e-4746-acf3-a3bfc8e3e587',
			type: 'list',
			fieldInformation: '',
			valid: false,
			data: true,
			editable: false,
			optionLabel: 'term',
			dataSource: 'timeVocabs-experimentsData',
			col: 'time_period',
			getOptions(data) {
				const { timeVocabs, experimentsData } = data;
				const s = experimentsData.get('6fd9d246-99fb-4da3-bb6c-b6e1f4b53cef')?.value;
				if (s?.term === 'Same for all sites') {
					return [{ term: 'Same for all time periods' }];
				}
				const periods = timeVocabs?.periodsVocab?.filter((prd) => {
					return prd.sites.find((site) => site.term === s?.term);
				});
				if (periods?.length > 1) {
					periods.push({ term: 'Same for all time periods' });
				}
				if (!periods || periods.length === 0) {
					return [{ term: 'Unspecified' }];
				}
				return periods || [];
			},
			generatedVocab: true,
		},
	];
	const selectedCols = [
		{ field: 'diet', header: 'Diet or Diet Item Name', info: '' },
		{ field: 'site', header: 'Site', info: '' },
		{ field: 'time_period', header: 'Time Period', info: '' },
	];
	genColumns?.forEach((row, ind) => {
		const varName = row.get(config.columns.targetField)?.value?.term;
		if (varName) {
			genColsConfiguration.push(
				{
					id: createId(),
					type: 'number',
					label: '',
					fieldInformation: '',
					valid: false,
					col: `var_${ind}`,
					data: true,
					fractionDigits: 3,
				}
			);
			selectedCols.push({ field: `var_${ind}`, header: varName });
		}
	});
	setSelectedColumns(selectedCols);
	setColumnsContent(genColsConfiguration);
};

export default genInputTableColumns;
