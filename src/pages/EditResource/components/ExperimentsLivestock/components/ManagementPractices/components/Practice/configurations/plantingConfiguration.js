const configuration = {
	header: 'Planting',
	id: '29cabd38-da72-4dde-bc7a-1047ac85b170',
	description: true,
	content: [
		{
			id: 'd59ff545-246d-4add-91dc-ae64633ce9e9',
			data: true,
			type: 'text',
			label: 'Practice Name',
			fieldInformation: ' ',
		},
		{
			id: '38147048-6dba-4294-98ee-f075469b0f25',
			type: 'list',
			label: 'Pasture Management Practice',
			fieldInformation: ' ',
			options: ['Work in progress'],
			valid: true,
			columnNumber: 0,
			data: true,
		},
		{
			id: '2e6c3872-0458-4632-81d6-50cf415c3404',
			type: 'text area',
			label: 'Notes',
			fieldInformation: ' ',
			valid: false,
			columnNumber: 1,
			data: true,
		},
		{
			id: '2dc1a26d-3257-49c4-b888-6cee3049f4e7',
			type: 'input-table',
			label: '',
			fieldInformation: ' ',
			valid: true,
			headerButtonLabel: 'Add Row',
			placeholder: 'Press Add Row',
			deleteMessage: 'Do you want to delete this row?',
			data: 'table',
			columns: [
				{ field: 'species', header: 'Species', info: '' },
				{ field: 'site', header: 'Site', info: '' },
				{ field: 'time_period', header: 'Time Period', info: '' },
				{ field: 'method', header: 'Planting or Sowing Method', info: '' },
				{ field: 'overseeding', header: 'Pasture Overseeding?', info: '' },
				{ field: 'rate', header: 'Planting  Density or Sowing Rate', info: '' },
				// { field: 'freq', header: 'Tillage Frequency Per Season', info: '' },
				// { field: 'percentage', header: '% Field Tilled', info: '' },
				// { field: 'tilled_width', header: 'Tilled Strip Width (cm)', info: '' },
				// { field: 'untilled_width', header: 'Untilled Strip Width (cm)', info: '' },
			],
			content: [
				{
					id: 'a1a11acf-11c7-4e3e-8116-f5ec06223b61',
					data: true,
					type: 'list',
					// preloadTarget: 'short_value',
					editable: false,
					col: 'species',
					options: ['Work in progress'],
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
				{
					id: '84f3c359-d10d-48dd-a5d7-f2a6f592bc1e',
					data: true,
					type: 'list',
					// preloadTarget: 'short_value',
					editable: false,
					col: 'method',
					options: ['Work in progress'],
					definition: {
						id: 'a89bb12e-24b6-4476-ab67-aac1094f1d74',
						type: 'text area',
						label: 'Definition',
						fieldInformation: ' ',
						valid: false,
						disabled: true,
						placeholder: 'Practice has no value.',
					},
				},
				{
					id: '05b38a7e-b243-461f-864b-f684282748b0',
					data: true,
					type: 'list',
					editable: false,
					col: 'overseeding',
					options: ['Work in progress'],
				},
				{
					id: 'ae0bd063-f736-4620-a822-3206a874c981',
					type: 'number',
					valid: false,
					data: true,
					options: ['Work in progress'],
					units: 'self',
					col: 'rate',
				},
			],
		},
	],
};

export default configuration;
