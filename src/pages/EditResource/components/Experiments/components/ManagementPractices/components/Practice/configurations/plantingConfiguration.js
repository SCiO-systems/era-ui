const configuration = {
	header: 'Planting Dates',
	id: '0396ff25-fa7b-4e2d-b8a3-df96c1b5ebed',
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
			id: '243c2e4f-bcd2-4be9-9732-96f6b8c15841',
			type: 'list',
			label: 'Does the Practice Structure (or Constrain) Outcome Comparisons?',
			fieldInformation: ' ',
			valid: true,
			columnNumber: 0,
			data: true,
		},
		{
			id: '6541e923-7f08-4f63-8e90-ea4e41835970',
			type: 'text area',
			label: 'General Notes',
			fieldInformation: ' ',
			valid: false,
			columnNumber: 1,
			data: true,
		},
		{
			id: '6cefeaf7-0169-4fe2-a1ca-13b77b2a6176',
			type: 'seasonal-table',
			data: 'table',
			label: '',
			fieldInformation: '',
			valid: false,
			editable: true,
			headerButtonLabel: 'Add Time Period',
			placeholder: 'Press Time Period',
			deleteMessage: 'Do you want to delete this time period?',
			columns: [
				{
					id: '23e0fce5-a056-4478-a835-192071766c0e',
					type: 'text',
					label: 'Site Name',
					fieldInformation: ' ',
					columnNumber: 1,
					valid: false,
					data: true,
				},
				{
					id: '1a7ce77c-a32e-4ef5-ab3d-f313d89a530f',
					type: 'text',
					label: 'Time Period',
					fieldInformation: ' ',
					columnNumber: 1,
					valid: false,
					data: true,
				},
			],
			content: [
				{
					id: 'c08eb05b-3222-4f86-bdf6-b3aaebcec647',
					type: 'list',
					label: 'Practice Method',
					fieldInformation: ' ',
					valid: true,
					columnNumber: 0,
					data: true,
					editable: false,
					definition: {
						id: '8cba2bb1-e54f-4791-9f6a-2998f940d5bd',
						type: 'text area',
						label: 'Definition',
						fieldInformation: ' ',
						valid: false,
						disabled: true,
						placeholder: 'Practice Method has no value.',
					},
					validation: true,
				},
				// {
				// 	id: '2.2.1.23.3.3',
				// 	type: 'text',
				// 	label: 'Definition',
				// 	fieldInformation: ' ',
				// 	valid: false,
				// 	disabled: true,
				// },
				{
					id: '0fa0b1e2-045a-49a7-8ee4-543eb5cbdd9f',
					type: 'number',
					label: 'Planting Density',
					fieldInformation: ' ',
					valid: false,
					columnNumber: 0,
					data: true,
					fractionDigits: 3,
				},
				{
					id: '88ac5658-9ead-42eb-8cf2-c317ed8ce5fe',
					type: 'list',
					label: 'Planting Density Unit',
					fieldInformation: ' ',
					columnNumber: 0,
					valid: true,
					data: true,
				},
				{
					id: '471a6ee9-9d67-4385-bf9a-0135c6e0e505',
					type: 'number',
					label: 'Row Width/Spacing (in cm)',
					fieldInformation: ' ',
					columnNumber: 0,
					showButtons: true,
					valid: false,
					data: true,
					suffix: ' cm',
					units: 'suffix',
				},
				{
					id: 'ccafcc7e-d403-4fa7-8cc3-8bce4c22628a',
					type: 'number',
					label: 'Spacing of Planting Stations (in cm)',
					fieldInformation: ' ',
					valid: false,
					columnNumber: 0,
					data: true,
					suffix: ' cm',
					units: 'suffix',
				},
				{
					id: '4a3ee4cd-19fa-4a19-8ac5-96f02754c8dc',
					type: 'number',
					label: 'Seeds/Station',
					fieldInformation: ' ',
					columnNumber: 0,
					valid: false,
					data: true,
				},
				{
					id: '85e14e05-b48c-4b1f-8ff6-405f787da77d',
					type: 'number',
					label: 'Plants/Station after Thinning',
					fieldInformation: ' ',
					columnNumber: 0,
					valid: false,
					data: true,
				},
				{
					id: '236bbcd6-a2f3-4472-81d0-db7e81ab9a10',
					type: 'header',
					text: 'Tramlines or Paired Rows',
					category: 'p',
					size: '16px',
					columnNumber: 1,
					weight: '600',
					data: true,
				},
				{
					id: 'f67a9600-47e9-43e9-92bc-aabcb104bae4',
					type: 'number',
					label: '"Paired" Row Width/Spacing',
					fieldInformation: ' ',
					columnNumber: 1,
					valid: false,
					data: true,
				},
				{
					id: '4b31b7f3-4dce-48be-ab32-a33cbb4c14b3',
					type: 'number',
					label: 'Number of Rows In "Pairing"',
					fieldInformation: ' ',
					columnNumber: 1,
					valid: false,
					data: true,
				},
				{
					id: '0e1bf562-7427-4009-9bfd-f934f0633d04',
					type: 'custom',
					text: 'Intercropping',
					custom: 'planting-intercrop',
					content: [
						{
							id: '0e1bf562-7427-4009-9bfd-f934f0633d04',
							type: 'header',
							text: 'Intercropping',
							category: 'p',
							size: '16px',
							columnNumber: 1,
							weight: '600',
							data: true,
						},
						{
							id: '4f3c6a3b-a416-4851-92ed-a7073fdb01bb',
							type: 'number',
							label: 'Number of Rows In Block/Alley',
							columnNumber: 1,
							fieldInformation: ' ',
							valid: false,
							data: true,
						},
						{
							id: '1efc9694-f71a-4397-a06d-887d4a07ea23',
							type: 'number',
							minNumber: 1,
							maxNumber: 100,
							showButtons: true,
							label: '% of plot of Block/Alley',
							fieldInformation: ' ',
							valid: false,
							columnNumber: 1,
							data: true,
						},
						{
							id: 'cae2deb5-e937-459e-95a1-8d3d0f3b8959',
							type: 'number',
							label: 'Width of Block/Alley',
							fieldInformation: ' ',
							minNumber: 1,
							showButtons: true,
							valid: false,
							columnNumber: 1,
							suffix: ' cm',
							units: 'suffix',
							data: true,
						},
					],
				},
			],
		},
	],
};

export default configuration;
