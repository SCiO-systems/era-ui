const configuration = {
	header: 'Digestibility',
	id: '4c3ef6d5-fce5-4161-a612-73f27f255100',
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
			id: 'd59ff545-246d-4add-91dc-ae64633ce9e9',
			data: true,
			type: 'text',
			label: 'Practice Name',
			fieldInformation: ' ',
		},
		{
			type: 'header',
			text: 'Describe Entire Diet Feed Rate/Processing',
			category: 'p',
			size: '19px',
			weight: '900',
		},
		{
			id: '688bcf0d-5cc2-4729-82f9-8651a23a695a',
			type: 'input-table',
			label: '',
			fieldInformation: '',
			valid: true,
			headerButtonLabel: 'Add Row',
			placeholder: 'Press Add Row',
			deleteMessage: 'Do you want to delete this row?',
			data: 'table',
			columns: [
				// { field: 'herd', header: 'Herd or Group', info: '' },
				{ field: 'diet_name', header: 'Diet Name', info: '' },
				{ field: 'site', header: 'Site', info: '' },
				{ field: 'time_period', header: 'Time Period', info: '' },
				{ field: 'scavenge', header: 'Animals allowed to graze, scavenge or browse?', info: '' },
				{ field: 'grass', header: 'Animals fed grass or hay?', info: '' },
				{ field: 'amount_diet', header: 'Amount of diet fed', info: '' },
				{ field: 'unit_time', header: 'Unit Time', info: '' },
				{ field: 'unit_animals', header: 'Unit Animals', info: '' },
				{ field: 'dry_matter', header: 'Are amounts for dry matter?', info: '' },
				{ field: 'satiation', header: 'Ad Libitum or Feeding to Satiation?', info: '' },
				{ field: 'notes', header: 'Notes', info: '' },
			],
			content: [
				// {
				// 	id: '639e4d09-ffd8-446b-a884-318b80ec5a72',
				// 	type: 'list',
				// 	label: '',
				// 	fieldInformation: '',
				// 	valid: false,
				// 	col: 'herd',
				// 	data: true,
				// 	options: ['Work in progress'],
				// },
				{
					id: 'cf746550-5e3b-4f0f-88c4-8dba5b6391e2',
					type: 'text',
					label: '',
					fieldInformation: '',
					valid: false,
					col: 'diet_name',
					data: true,
				},
				// {
				// 	id: '48626f97-805e-41bd-91a7-8f882051e634',
				// 	type: 'list',
				// 	label: '',
				// 	fieldInformation: '',
				// 	valid: false,
				// 	col: 'time_period',
				// 	data: true,
				// 	options: ['Work in progress'],
				// },
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
					id: '709001c4-7348-4516-8724-aea6c51eaf0d',
					type: 'list',
					label: '',
					fieldInformation: '',
					valid: false,
					col: 'scavenge',
					data: true,
					options: ['Work in progress'],
				},
				{
					id: '109ef056-e824-4ed3-b6cf-52fe435deecc',
					type: 'list',
					label: '',
					fieldInformation: '',
					minWords: 1,
					maxWords: 1,
					valid: false,
					col: 'grass',
					data: true,
					options: ['Work in progress'],
				},
				{
					id: 'ea89a924-fa19-4b23-9152-8609b4adff08',
					type: 'number',
					label: '',
					fieldInformation: '',
					valid: false,
					col: 'amount_diet',
					data: true,
					fractionDigits: 3,
					options: [],
					units: 'self',
					// TODO units
				},
				{
					id: 'ca38c948-8171-4f80-a4aa-7766e23cfb4c',
					type: 'list',
					label: '',
					fieldInformation: '',
					minWords: 1,
					maxWords: 1,
					valid: false,
					col: 'unit_time',
					data: true,
					options: ['Work in progress'],
				},
				{
					id: '53070f5d-201e-46cf-9399-72b6c42c9e8d',
					type: 'list',
					label: '',
					fieldInformation: '',
					minWords: 1,
					maxWords: 1,
					valid: false,
					col: 'unit_animals',
					data: true,
					options: ['Work in progress'],
				},
				{
					id: 'f7f2f9f0-aa9f-445a-b44a-8f38cd152650',
					type: 'list',
					label: '',
					fieldInformation: '',
					minWords: 1,
					maxWords: 1,
					valid: false,
					col: 'dry_matter',
					data: true,
					options: ['Work in progress'],
				},
				{
					id: '9f7a2a69-07fb-45f3-917d-d0d17d6d1d9b',
					type: 'list',
					label: '',
					fieldInformation: '',
					minWords: 1,
					maxWords: 1,
					valid: false,
					col: 'satiation',
					data: true,
					options: ['Work in progress'],
				},
				{
					id: '0a5f21a5-e283-4413-9f63-5a29962c7be0',
					type: 'text',
					label: '',
					fieldInformation: '',
					valid: false,
					col: 'notes',
					data: true,
				},
			],
			extraFieldsLabel: 'Ingredients Table',
			subTable: {
				id: 'abede6f3-0dfe-4870-9469-3e0c4105b292',
				type: 'input-table',
				label: '',
				fieldInformation: '',
				valid: true,
				headerButtonLabel: 'Add Row',
				placeholder: 'Press Add Row',
				deleteMessage: 'Do you want to delete this row?',
				data: 'table',
				columns: [
					{ field: 'ingredient_type', header: 'Type of Ingredient', info: '' },
					{ field: 'ingredient_name', header: 'Ingredient Name', info: '' },
					{ field: 'ingredient_group', header: 'Ingredient Group', info: '' },
					{ field: 'source', header: 'Source', info: '' },
					{ field: 'mechanical_process', header: 'Mechanical Process', info: '' },
					{ field: 'chemical_process', header: 'Chemical Process', info: '' },
					{ field: 'biological_process', header: 'Biological Process', info: '' },
					{ field: 'thermal_process', header: 'Thermal Process', info: '' },
					{ field: 'dehydration_process', header: 'Dehydration Process', info: '' },
					{ field: 'other_process', header: 'Other Process', info: '' },
					{ field: 'start', header: 'Start (days from beginning of experiment)', info: '' },
					{ field: 'end', header: 'End (days from beginning of experiment)', info: '' },
					{ field: 'notes', header: 'Notes', info: '' },
				],
				content: [
					{
						id: 'db065e35-ac30-4cf0-9b50-dbbb570b5b96',
						type: 'list',
						label: '',
						fieldInformation: '',
						minWords: 1,
						maxWords: 1,
						valid: false,
						col: 'ingredient_type',
						data: true,
						options: ['Work in progress'],
					},
					{
						id: '3e8f6300-35a7-429a-b250-ea5e8213ece6',
						type: 'list',
						label: '',
						fieldInformation: '',
						minWords: 1,
						maxWords: 1,
						valid: false,
						col: 'ingredient_name',
						data: true,
						options: ['Work in progress'],
					},
					{
						id: '1db5d33c-aa57-4569-9a92-f289dd1ee0fe',
						type: 'text',
						label: '',
						fieldInformation: '',
						valid: false,
						col: 'ingredient_group',
						data: true,
					},
					{
						id: 'cb6c8105-c74a-4427-90e2-4631713a1262',
						type: 'list',
						label: '',
						fieldInformation: '',
						minWords: 1,
						maxWords: 1,
						valid: false,
						col: 'source',
						data: true,
						options: ['Work in progress'],
					},
					{
						id: 'f6c851eb-6189-42a6-a66c-ed0c9032ab2c',
						type: 'list',
						label: '',
						fieldInformation: '',
						minWords: 1,
						maxWords: 1,
						valid: false,
						col: 'mechanical_process',
						data: true,
						options: ['Work in progress'],
					},
					{
						id: 'bb2df246-7307-4653-b390-b4cafba4dbe1',
						type: 'list',
						label: '',
						fieldInformation: '',
						minWords: 1,
						maxWords: 1,
						valid: false,
						col: 'biological_process',
						data: true,
						options: ['Work in progress'],
					},
					{
						id: '285c00cf-51c2-4a6c-840b-0fc7ff1b198e',
						type: 'list',
						label: '',
						fieldInformation: '',
						minWords: 1,
						maxWords: 1,
						valid: false,
						col: 'thermal_process',
						data: true,
						options: ['Work in progress'],
					},
					{
						id: 'bbb75e70-f782-453f-bea5-f31aa18d2ea2',
						type: 'list',
						label: '',
						fieldInformation: '',
						minWords: 1,
						maxWords: 1,
						valid: false,
						col: 'dehydration_process',
						data: true,
						options: ['Work in progress'],
					},
					{
						id: '56a788c0-e70b-4bba-a8cf-4206ad4c6263',
						type: 'list',
						label: '',
						fieldInformation: '',
						minWords: 1,
						maxWords: 1,
						valid: false,
						col: 'chemical_process',
						data: true,
						options: ['Work in progress'],
					},
					{
						id: '5d91ff51-03c0-40b6-9318-a9f7c194bb1a',
						type: 'text',
						label: '',
						fieldInformation: '',
						valid: false,
						col: 'other_process',
						data: true,
					},
					{
						id: '363d78a8-9190-4304-91d9-4f5293955bde',
						type: 'number',
						label: '',
						fieldInformation: '',
						valid: false,
						col: 'start',
						data: true,
						fractionDigits: 3,
						// TODO units
					},
					{
						id: '1715ea18-4ef9-4f94-a22b-64c0ff50e86a',
						type: 'number',
						label: '',
						fieldInformation: '',
						valid: false,
						col: 'end',
						data: true,
						fractionDigits: 3,
						// TODO units
					},
					{
						id: 'b47ee997-1f2d-4831-9784-4c7b68ef59a6',
						type: 'text',
						label: '',
						fieldInformation: '',
						valid: false,
						col: 'notes',
						data: true,
					},
				],
			},
		},
	],
};

export default configuration;
