const configuration = {
	header: 'Veterinary',
	id: '5d1b70cc-29a9-4b91-80e3-3771fa9bfdf3',
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
			id: 'f0e9665f-7a74-410a-a893-1b1e159de0e1',
			data: true,
			type: 'text',
			label: 'Practice Name',
			fieldInformation: ' ',
		},
		{
			id: 'b13a23ca-ca7c-4f6a-bc47-107b8d48bab5',
			type: 'list',
			label: 'Can we compare experimental results between different veterinary management practices?',
			fieldInformation: ' ',
			valid: false,
			data: true,
			options: ['Work in progress'],
		},
		{
			id: '4d04a27f-1504-46c9-893b-7d6848972639',
			type: 'input-table',
			label: '',
			fieldInformation: '',
			valid: true,
			headerButtonLabel: 'Add Row',
			placeholder: 'Press Add Row',
			deleteMessage: 'Do you want to delete this row?',
			data: 'table',
			columns: [
				{ field: 'name', header: 'Name of product, drug or chemical applied', info: '' },
				// { field: 'time', header: 'Time Period', info: '' },
				{ field: 'target', header: 'What is the product being applied to? (Herd, Subherd,Species,Breed or Pasture)?', info: '' },
				{ field: 'brand', header: 'Is the name a brand, trade or commerical name? or the name of a chemical or active ingredient?', info: '' },
				{ field: 'administered', header: 'How is the product administered?', info: '' },
				{ field: 'rate', header: 'Product Application Rate or Amount', info: '' },
				{ field: 'number', header: 'Total Number of Applications (per experimental cycle)', info: '' },
				{ field: 'dd', header: 'dd/mm', info: '' },
				{ field: 'stage', header: 'Animal Age or Stage', info: '' },
				{ field: 'before_start', header: 'Days before/after start of experiment', info: '' },
				{ field: 'date_description', header: 'Date Text Description', info: '' },
				{ field: 'notes', header: 'Notes', info: '' },
			],
			timeFields: 'simple',
			content: [
				{
					id: '9ba48ceb-a94c-4e0e-bf3f-a7d1f7080d17',
					type: 'list',
					label: '',
					fieldInformation: '',
					valid: false,
					col: 'name',
					data: true,
					options: ['Work in progress'],
				},
				// {
				// 	id: '40338d53-5a6e-4d80-a30c-7a9070a9a342',
				// 	type: 'list',
				// 	label: '',
				// 	fieldInformation: '',
				// 	valid: false,
				// 	col: 'time',
				// 	data: true,
				// 	options: ['Work in progress'],
				// },
				{
					id: 'a9a54584-6a50-4ac2-a2ec-850341999a98',
					type: 'list',
					label: '',
					fieldInformation: '',
					valid: false,
					col: 'target',
					data: true,
					options: ['Work in progress'],
				},
				{
					id: 'd7cede9c-0f81-4eb4-bab1-29c3c7214b06',
					type: 'list',
					label: '',
					fieldInformation: '',
					minWords: 1,
					maxWords: 1,
					valid: false,
					col: 'brand',
					data: true,
					options: ['Work in progress'],
				},
				{
					id: 'c15aa121-90bc-41ce-9aea-6ca4f9b1f761',
					type: 'list',
					label: '',
					fieldInformation: '',
					minWords: 1,
					maxWords: 1,
					valid: false,
					col: 'administered',
					data: true,
					options: ['Work in progress'],
				},
				{
					id: '6c209a25-9c72-4b10-83fd-c85739a4f13d',
					type: 'number',
					label: '',
					fieldInformation: '',
					valid: false,
					col: 'rate',
					data: true,
					fractionDigits: 3,
					units: 'self',
					options: ['Work in progress'],
				},
				{
					id: '244b01e8-3edb-4c33-96cb-b7f9b5a55622',
					type: 'number',
					label: '',
					fieldInformation: '',
					valid: false,
					col: 'number',
					data: true,
					fractionDigits: 3,
				},
				{
					id: '700da35c-acf4-4d23-85a4-a4217925857f',
					type: 'text',
					label: '',
					fieldInformation: '',
					valid: false,
					col: 'dd',
					data: true,
				},
				{
					id: '77359629-9131-4cf6-8909-28eda7ef2502',
					type: 'text',
					label: '',
					fieldInformation: '',
					valid: false,
					col: 'stage',
					data: true,
				},
				{
					id: '0cd8d931-4520-46f4-8b78-0642acb8c41a',
					type: 'number',
					label: '',
					fieldInformation: '',
					valid: false,
					col: 'before_start',
					data: true,
					fractionDigits: 3,
				},
				{
					id: '841d195a-a331-4d1d-848b-8ab6cc832536',
					type: 'text',
					label: '',
					fieldInformation: '',
					valid: false,
					col: 'date_description',
					data: true,
				},
				{
					id: '0cd0f252-7d95-4c86-8579-436a3adad3b1',
					type: 'text',
					label: '',
					fieldInformation: '',
					valid: false,
					col: 'notes',
					data: true,
				},
			],
			extraFields: [
				{
					id: '79266f42-f0d2-4190-842f-33e884cd5510',
					type: 'text',
					label: 'Product Name',
					fieldInformation: ' ',
					// target: '5a6a7582-3bb0-43bb-9398-43dbec4f545a',
					valid: false,
					data: true,
					// generatedFrom: { field: '5a6a7582-3bb0-43bb-9398-43dbec4f545a' },
				},
				{
					id: '732a5f1e-a612-4261-9cb0-92ae170eab28',
					type: 'list',
					label: 'Type of Product',
					fieldInformation: ' ',
					minWords: 1,
					maxWords: 1,
					valid: false,
					data: true,
					options: ['Work in progress'],
				},
				{
					id: 'e85c74f6-d14e-45d4-8646-0575d0b45239',
					type: 'text',
					label: 'Disease/Pest/Condition Targeted',
					fieldInformation: ' ',
					valid: false,
					data: true,
				},
				{
					id: '219ff030-413f-46e7-9017-6528229bca30',
					type: 'list',
					label: 'Active Ingredient (AI)',
					fieldInformation: ' ',
					minWords: 1,
					maxWords: 1,
					valid: false,
					data: true,
					options: ['Work in progress'],
				},
				{
					id: 'a12b1e94-5fb6-4236-9270-aba8d839e9b2',
					type: 'number',
					label: 'AI Amount in Product',
					fieldInformation: ' ',
					valid: false,
					col: 'before_start',
					data: true,
					fractionDigits: 3,
					units: 'self',
					options: ['Work in progress'],
				},
				{
					id: '4cbafe3c-3b06-43df-8542-a621d4ace288',
					type: 'text',
					label: 'Notes',
					fieldInformation: ' ',
					valid: false,
					data: true,
				},
			],
			extraFieldsLabel: 'Product',
		},
	],
};

export default configuration;
