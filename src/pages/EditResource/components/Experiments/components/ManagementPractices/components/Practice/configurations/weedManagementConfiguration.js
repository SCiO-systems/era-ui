const configuration = {
	header: 'Manual Weeding',
	id: 'b7545acd-57ea-4840-b62d-bbd2435ffadf',
	description: true,
	descriptionList: [{
		type: 'p',
		name: 'weeding-subdesc-1',
	}],
	content: [
		{
			id: 'd59ff545-246d-4add-91dc-ae64633ce9e9',
			data: true,
			type: 'text',
			label: 'Practice Name',
			fieldInformation: ' ',
		},
		{
			id: 'efb5aa2a-89c3-40c0-8b8c-42fdeb09f374',
			data: true,
			type: 'list',
			label: 'Structure Outcome Reporting',
			fieldInformation: ' ',
		},
		{
			id: 'a8e7c435-e261-4e9b-a6dc-f86bfebfae92',
			type: 'text area',
			label: 'Notes',
			fieldInformation: ' ',
			valid: false,
			data: true,
		},
		{
			id: 'b714d535-a6f4-4b31-bd45-b2d818d0984b',
			type: 'input-table',
			label: '',
			fieldInformation: ' ',
			valid: true,
			headerButtonLabel: 'Add Row',
			placeholder: 'Press Add Row',
			deleteMessage: 'Do you want to delete this row?',
			data: 'table',
			columns: [
				{ field: 'weeding_method', header: 'Weeding Method', info: '' },
				{ field: 'frequency', header: 'Frequency', info: '' },
				{ field: 'frequency_time_unit', header: 'Frequency Time Unit', info: '' },
			],
			timeFields: 'simple',
			content: [
				{
					id: '4d1e214b-8cf4-4c29-9b2d-efc0d8d127b9',
					type: 'list',
					valid: false,
					data: true,
					col: 'weeding_method',
				},
				{
					id: '62f6030e-898b-4e8d-a4ce-7d3378821c18',
					type: 'number',
					valid: false,
					data: true,
					col: 'frequency',
					fractionDigits: 3,
				},
				{
					id: '9897548f-e692-4d5f-b15f-54340786eb31',
					type: 'list',
					valid: false,
					data: true,
					col: 'frequency_time_unit',
				},
			],
		},
	],
};

export default configuration;
