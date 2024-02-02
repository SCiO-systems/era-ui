const configuration = {
	header: 'Pasture',
	id: '35f22260-2bf3-46c5-8343-3e34ffb25e76',
	// description: true,
	// descriptionList: [
	// 	{
	// 		type: 'list',
	// 		content: [
	// 			{ name: 'fert-subdesc-1' },
	// 			{ name: 'fert-subdesc-2' },
	// 		],
	// 	},
	// 	{
	// 		type: 'p',
	// 		name: 'fert-subdesc-3',
	// 	},
	// ],
	content: [
		{
			id: '5bb56268-5ce8-44f0-8d10-ea81e11ddd90',
			data: true,
			type: 'text',
			label: 'Practice Name',
			fieldInformation: ' ',
		},
		{
			id: '6697af81-e704-4b20-8e33-ba2607cc2abb',
			type: 'input-table',
			label: '',
			fieldInformation: '',
			valid: true,
			headerButtonLabel: 'Add Row',
			placeholder: 'Press Add Row',
			deleteMessage: 'Do you want to delete this row?',
			data: 'table',
			columns: [
				{ field: 'name', header: 'Pasture Practice Name', info: '' },
				{ field: 'site', header: 'Site', info: '' },
				{ field: 'time_period', header: 'Time Period', info: '' },
				// { field: 'time_start', header: 'Time Start', info: '' },
				// { field: 'time_end', header: 'Time End', info: '' },
				{ field: 'description', header: 'Text Description', info: '' },
				{ field: 'cover', header: 'Total Vegetation Cover %', info: '' },
				{ field: 'bare', header: 'Bare Ground %', info: '' },
				{ field: 'biomass', header: 'Pasture Biomass', info: '' },
				{ field: 'condition', header: 'Is this the starting or pre-experimental condition of the pasture?', info: '' },
				{ field: 'notes', header: 'Notes', info: '' },
			],
			content: [
				{
					id: 'a0e18197-8f61-4920-a784-f9c4b555d416',
					type: 'list',
					label: '',
					fieldInformation: '',
					valid: false,
					col: 'name',
					data: true,
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
				// {
				// 	id: '3131bb80-b520-4bc8-990f-03665373a334',
				// 	data: true,
				// 	type: 'calendar',
				// 	mandatory: false,
				// 	year: false,
				// 	valid: true,
				// 	maxDate: true,
				// 	col: 'time_start',
				// },
				// {
				// 	id: '3c5fa95f-1731-4eeb-8287-29f4208b72de',
				// 	data: true,
				// 	type: 'calendar',
				// 	mandatory: false,
				// 	year: false,
				// 	valid: true,
				// 	maxDate: true,
				// 	col: 'time_end',
				// },
				{
					id: 'c7919dee-405c-4773-bca3-714cf8311fa8',
					type: 'text',
					label: '',
					fieldInformation: '',
					valid: false,
					col: 'description',
					data: true,
				},
				{
					id: 'f6e0f4f0-997a-44d3-826c-faad404b919e',
					type: 'number',
					label: '',
					fieldInformation: '',
					valid: false,
					col: 'cover',
					data: true,
					fractionDigits: 3,
				},
				{
					id: 'b1e4100b-8bba-4445-93e9-6ffd9f711dcf',
					type: 'number',
					label: '',
					fieldInformation: '',
					valid: false,
					col: 'bare',
					data: true,
					fractionDigits: 3,
				},
				{
					id: 'cb662170-6b7b-4605-bf0b-9311e1b92b4c',
					type: 'number',
					label: '',
					fieldInformation: '',
					valid: false,
					col: 'biomass',
					data: true,
					fractionDigits: 3,
					units: 'self',
					options: ['Work in progress'],
				},
				{
					id: 'feda8a40-e2f1-4754-9ed4-2c682562d8aa',
					type: 'list',
					label: '',
					fieldInformation: '',
					valid: false,
					col: 'condition',
					data: true,
					options: ['Work in progress'],
				},
				{
					id: 'f4a38f49-f946-44a9-a933-1b0d9f16469d',
					type: 'text',
					label: '',
					fieldInformation: '',
					valid: false,
					col: 'notes',
					data: true,
				},
			],
			subTable: {
				id: 'f50a5d56-7354-4a4b-937c-3b62a1f959f1',
				type: 'input-table',
				label: '',
				fieldInformation: '',
				valid: true,
				headerButtonLabel: 'Add Row',
				placeholder: 'Press Add Row',
				deleteMessage: 'Do you want to delete this row?',
				data: 'table',
				columns: [
					{ field: 'species', header: 'Species', info: '' },
					{ field: 'cover', header: 'Cover %', info: '' },
					{ field: 'description', header: 'Ordinal Description', info: '' },
				],
				extraFieldsLabel: 'Species Table',
				content: [
					{
						id: '0341047f-4daa-4f65-b8c9-3d8ffc8f5ebf',
						type: 'list',
						valid: false,
						data: true,
						col: 'species',
						options: ['Work in progress'],
					},
					{
						id: 'e735483f-6283-45f0-9236-60354d5aea77',
						type: 'number',
						valid: false,
						data: true,
						fractionDigits: 3,
						col: 'cover',
					},
					{
						id: 'c93727a1-2a09-43b4-a16b-d360207083cc',
						type: 'text',
						valid: false,
						data: true,
						col: 'description',
					},
				],
			},
		},
	],
};

export default configuration;
