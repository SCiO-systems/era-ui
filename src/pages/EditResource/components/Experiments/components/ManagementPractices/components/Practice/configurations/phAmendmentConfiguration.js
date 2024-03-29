const configuration = {
	header: 'pH Amendment',
	id: 'acd7cdc3-de0c-45a7-b0f8-649d692688a4',
	description: true,
	content: [
		{
			id: 'd59ff545-246d-4add-91dc-ae64633ce9e9',
			data: true,
			type: 'text',
			fieldInformation: ' ',
			label: 'Practice Name',
		},
		{
			id: 'd2df248e-2ea4-4811-916d-f2f2fd13b53a',
			type: 'text area',
			label: 'Notes',
			fieldInformation: ' ',
			valid: false,
			data: true,
		},
		{
			id: 'cf974b60-8446-47e0-90d0-8ac3b798ae26',
			type: 'input-table',
			label: '',
			fieldInformation: '',
			valid: true,
			headerButtonLabel: 'Add Row',
			placeholder: 'Press Add Row',
			deleteMessage: 'Do you want to delete this row?',
			data: 'table',
			columns: [
				{ field: 'practice', header: 'Practice', info: '' },
				{ field: 'material', header: 'Material Applied', info: '' },
				{ field: 'eff_cal_car_eq', header: 'Effective Calcium Carbonate Equivalent (ECCE)', info: '' },
				{ field: 'cal_car_eq', header: 'Calcium Carbonate Equivalent (CCE)', info: '' },
				{ field: 'per_cal_car', header: '% Calcium Carbonate (CaCO3', info: '' },
				{ field: 'per_mag_car', header: '% Magnesium Carbonate (MgCO3)', info: '' },
				{ field: 'amount', header: 'Amount Applied', info: '' },
			],
			timeFields: 'simple',
			content: [
				{
					id: 'bd041340-c400-424c-9d89-33070858e848',
					data: true,
					type: 'list',
					editable: false,
					definition: {
						id: 'bb80e6b7-49f6-46c3-87e9-49f31341cb91',
						type: 'text area',
						label: 'Definition',
						fieldInformation: ' ',
						valid: false,
						disabled: true,
						placeholder: 'Practice has no value.',
					},
					col: 'practice',
				},
				{
					id: '83a3bba3-4c74-4b4f-be20-2dde9bcbbb10',
					type: 'list',
					label: '',
					fieldInformation: '',
					valid: false,
					col: 'material',
					data: true,
				},
				{
					id: '02ea52ed-bc54-4f44-95c8-1793bfb6c9d8',
					type: 'number',
					mandatory: false,
					minNumber: 1,
					label: '',
					fieldInformation: '',
					valid: false,
					showButtons: true,
					// keyword: 'mulch_organic_unit_of_measurement',
					col: 'eff_cal_car_eq',
					// units: 'self',
					data: true,
					fractionDigits: 3,
				},
				{
					id: '868eadf0-e277-47c3-8499-17a70068a156',
					type: 'number',
					mandatory: false,
					minNumber: 1,
					label: '',
					fieldInformation: '',
					valid: false,
					showButtons: true,
					// keyword: 'mulch_organic_unit_of_measurement',
					col: 'cal_car_eq',
					// units: 'self',
					data: true,
					fractionDigits: 3,
				},
				{
					id: '17d5b7c9-11c0-4eef-a9d8-fe70c98ab31d',
					type: 'number',
					mandatory: false,
					minNumber: 1,
					label: '',
					fieldInformation: '',
					valid: false,
					showButtons: true,
					col: 'per_cal_car',
					units: 'suffix',
					suffix: '%',
					data: true,
					fractionDigits: 3,
				},
				{
					id: '4d165208-6789-4f3b-9bfe-313c653f7df4',
					type: 'number',
					mandatory: false,
					minNumber: 1,
					label: '',
					fieldInformation: '',
					valid: false,
					showButtons: true,
					col: 'per_mag_car',
					units: 'suffix',
					suffix: '%',
					data: true,
					fractionDigits: 3,
				},
				{
					id: 'f67a4a9c-dfcd-4ff3-b344-952f5a3b3c46',
					type: 'number',
					mandatory: false,
					minNumber: 1,
					label: '',
					fieldInformation: '',
					valid: false,
					showButtons: true,
					col: 'amount',
					units: 'self',
					data: true,
					fractionDigits: 3,
				},
			],
		},
	],
};

export default configuration;
