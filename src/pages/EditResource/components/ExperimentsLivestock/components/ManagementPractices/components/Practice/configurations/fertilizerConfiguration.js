const configuration = {
	header: 'Fertilizer',
	id: '8f5017d6-7bbc-48e0-8cb6-65b85460d1b5',
	description: true,
	descriptionList: [
		{
			type: 'list',
			content: [
				{ name: 'fert-subdesc-1' },
				{ name: 'fert-subdesc-2' },
			],
		},
		{
			type: 'p',
			name: 'fert-subdesc-3',
		},
	],
	content: [
		{
			id: 'd59ff545-246d-4add-91dc-ae64633ce9e9',
			data: true,
			type: 'text',
			label: 'Practice Name',
			fieldInformation: ' ',
		},
		{
			id: 'ba273c13-edf2-4aac-97e5-29a328a20b4d',
			type: 'text area',
			label: 'General Notes',
			fieldInformation: ' ',
			valid: false,
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
					id: '243c2e4f-bcd2-4be9-9732-96f6b8c15841',
					type: 'header',
					text: 'Total Organic Elemental NPK',
					category: 'p',
					size: '19px',
					weight: '900',
				},
				{
					id: 'd4b09cc3-57a9-4f4b-95a0-42eb39b60227',
					type: 'number',
					mandatory: false,
					label: 'Elemental N',
					fieldInformation: ' ',
					valid: false,
					showButtons: true,
					style: { width: '32%' },
					units: 'd4b09cc3-57a9-4f4b-95a0-42eb39b60227',
					data: true,
					fractionDigits: 3,
				},
				{
					id: 'c16e562c-adf0-406d-93bb-8127f222206e',
					type: 'number',
					mandatory: false,
					label: 'Elemental P',
					fieldInformation: ' ',
					valid: false,
					showButtons: true,
					style: { width: '32%' },
					units: 'd4b09cc3-57a9-4f4b-95a0-42eb39b60227',
					data: true,
					fractionDigits: 3,
				},
				{
					id: '9e00c0bd-d139-4ccf-8fed-28b8ed62dd52',
					type: 'number',
					mandatory: false,
					label: 'Elemental K',
					fieldInformation: ' ',
					valid: false,
					showButtons: true,
					style: { width: '32%' },
					units: 'd4b09cc3-57a9-4f4b-95a0-42eb39b60227',
					data: true,
					fractionDigits: 3,
				},
				{
					id: '753dc9c4-cdad-4391-8f3d-17402c549e7b',
					type: 'header',
					text: 'Total Inorganic NPK',
					category: 'p',
					size: '19px',
					weight: '900',
				},
				{
					id: '56af4b37-9ed2-4b3a-b01a-7100209df6c3',
					type: 'number',
					mandatory: false,
					label: 'Elemental N',
					fieldInformation: ' ',
					valid: false,
					showButtons: true,
					// style: { width: '32%' },
					units: '56af4b37-9ed2-4b3a-b01a-7100209df6c3',
					data: true,
					fractionDigits: 3,
				},
				{
					id: '9950d16e-946b-4c36-b564-4747c58ecd28',
					type: 'number',
					mandatory: false,
					label: 'Elemental P',
					fieldInformation: ' ',
					valid: false,
					showButtons: true,
					style: { width: '49%' },
					units: '56af4b37-9ed2-4b3a-b01a-7100209df6c3',
					data: true,
					fractionDigits: 3,
				},
				{
					id: '9f94640c-7c2d-45b8-ab49-b3e684b38304',
					type: 'number',
					mandatory: false,
					label: 'P2O5',
					fieldInformation: ' ',
					valid: false,
					showButtons: true,
					style: { width: '49%' },
					units: '56af4b37-9ed2-4b3a-b01a-7100209df6c3',
					data: true,
					fractionDigits: 3,
				},
				{
					id: 'f74f2d0a-744b-4c87-85cb-ae68e2389785',
					type: 'number',
					mandatory: false,
					label: 'Elemental K',
					fieldInformation: ' ',
					valid: false,
					showButtons: true,
					style: { width: '49%' },
					units: '56af4b37-9ed2-4b3a-b01a-7100209df6c3',
					data: true,
					fractionDigits: 3,
				},
				{
					id: '87b701e0-3298-43f8-b38b-f1d0bdc243a7',
					type: 'number',
					mandatory: false,
					label: 'K2O',
					fieldInformation: ' ',
					valid: false,
					showButtons: true,
					style: { width: '49%' },
					units: '56af4b37-9ed2-4b3a-b01a-7100209df6c3',
					data: true,
					fractionDigits: 3,
				},
			],
		},
		{
			id: 'd71b494d-69cf-4265-ba4c-cea122795b86',
			type: 'input-table',
			label: '',
			fieldInformation: '',
			valid: true,
			headerButtonLabel: 'Add Row',
			placeholder: 'Press Add Row',
			deleteMessage: 'Do you want to delete this row?',
			data: 'table',
			columns: [
				{ field: 'nutrient_class', header: 'Nutrient Class', info: '' },
				{ field: 'name', header: 'Name', info: '' },
				{ field: 'rating', header: 'N-P-K Rating (N-P2O5-K20)', info: '' },
				{ field: 'amount', header: 'Amount Applied', info: '' },
				{ field: 'unit_application', header: 'Unit of Application', info: '' },
				{ field: 'method', header: 'Application Method', info: '' },
				{ field: 'source_material', header: 'Source of Material', info: '' },
				{ field: 'fate', header: 'Fate', info: '' },
				// { field: 'dd_mm', header: 'dd/mm', info: '' },
				// { field: 'stage', header: 'Crop Stage', info: '' },
				// { field: 'days_before_after', header: 'Days Before/After Planting', info: '' },
				// { field: 'emergence', header: 'Days After Emergence', info: '' },
				{ field: 'description', header: 'Text Description', info: '' },
			],
			content: [
				{
					id: '820cdc7f-fc67-4ff9-bbbc-4bcf8cb3cb3f',
					type: 'list',
					label: '',
					fieldInformation: '',
					valid: false,
					col: 'nutrient_class',
					data: true,
				},
				{
					id: '5a6a7582-3bb0-43bb-9398-43dbec4f545a',
					type: 'list',
					label: '',
					fieldInformation: '',
					target: '820cdc7f-fc67-4ff9-bbbc-4bcf8cb3cb3f',
					targetProperty: 'practices',
					valid: false,
					col: 'name',
					data: true,
				},
				{
					id: '30eba185-0604-4bc3-9f41-cfffe15d44e3',
					type: 'text',
					label: '',
					fieldInformation: '',
					valid: false,
					col: 'rating',
					data: true,
				},
				{
					id: '765ed2be-2080-4f9e-b3f0-b733346afc00',
					type: 'number',
					label: '',
					fieldInformation: '',
					valid: false,
					col: 'amount',
					data: true,
					fractionDigits: 3,
				},
				{
					id: '945395a9-8eaa-4cd2-8b68-64885645f082',
					type: 'list',
					label: '',
					fieldInformation: '',
					valid: false,
					col: 'unit_application',
					data: true,
				},
				{
					id: 'c0f6148f-f5d6-4d84-a6cf-eefe5b98449f',
					type: 'list',
					label: '',
					fieldInformation: '',
					valid: false,
					col: 'method',
					data: true,
				},
				{
					id: '460eccaa-dd34-498d-bf36-cc76fde9cdad',
					type: 'list',
					label: '',
					fieldInformation: '',
					valid: false,
					col: 'source_material',
					data: true,
				},
				{
					id: '5f7aa9ca-a6cb-4cfa-b604-159ba9e2fa5c',
					type: 'list',
					label: '',
					fieldInformation: '',
					valid: false,
					col: 'fate',
					data: true,
				},
				{
					id: 'f4b8f1dc-83b0-4055-b221-f5548a35c5c6',
					type: 'text',
					label: '',
					fieldInformation: '',
					valid: false,
					col: 'description',
					data: true,
				},
			],
			extraFields: [
				{
					id: 'f4e19eba-24e9-48ee-829f-8aa8225e6ae5',
					type: 'text',
					label: 'Nutrient',
					fieldInformation: ' ',
					target: '5a6a7582-3bb0-43bb-9398-43dbec4f545a',
					valid: false,
					data: true,
					generatedFrom: { field: '5a6a7582-3bb0-43bb-9398-43dbec4f545a' },
				},
				{
					id: 'e439ecd4-5e95-4c13-86d3-d2ecdb2ea153',
					type: 'list',
					label: 'Dry Weight?',
					fieldInformation: ' ',
					valid: false,
					data: true,
				},
				{
					id: '668612ce-33f2-4b06-8b29-4eaf11984b77',
					type: 'number',
					label: 'Dry Matter',
					fieldInformation: ' ',
					valid: false,
					showButtons: true,
					units: 'self',
					data: true,
					fractionDigits: 3,
				},
				{
					id: '052c32d9-fe36-4438-af81-784e2ac2776a',
					type: 'number',
					label: 'Organic Carbon (OC)',
					fieldInformation: ' ',
					valid: false,
					showButtons: true,
					units: 'self',
					data: true,
					fractionDigits: 3,
				},
				{
					id: 'aa4afdb1-2afc-4263-a41e-a9a05458e01a',
					type: 'number',
					label: 'Nitrogen (Unspecified)',
					fieldInformation: ' ',
					valid: false,
					showButtons: true,
					units: 'self',
					data: true,
					fractionDigits: 3,
				},
				{
					id: '7d340e40-7d31-4321-9b0f-6095e0c5547a',
					type: 'number',
					label: 'Total Nitrogen (TN)',
					fieldInformation: ' ',
					valid: false,
					showButtons: true,
					units: 'self',
					data: true,
					fractionDigits: 3,
				},
				{
					id: 'd2fd1808-d902-4426-93fa-f28fc913880d',
					type: 'number',
					label: 'Available Nitrogen (AN)',
					fieldInformation: ' ',
					valid: false,
					showButtons: true,
					units: 'self',
					data: true,
					fractionDigits: 3,
				},
				{
					id: 'fb495241-1e45-487d-802c-51be0015afe9',
					type: 'number',
					label: ' Carbon: Nitrogen (C/N) Ratio',
					fieldInformation: ' ',
					valid: false,
					data: true,
					fractionDigits: 3,
				},
				{
					id: '86e772a1-e2c0-4c8a-9822-9f692bb4508d',
					type: 'number',
					label: 'Phosphorous (Unspecified)',
					fieldInformation: ' ',
					valid: false,
					showButtons: true,
					units: 'self',
					data: true,
					fractionDigits: 3,
				},
				{
					id: '9fb415a4-b91b-40a4-be76-822ecc1dcb17',
					type: 'number',
					label: 'Total Phosphorous (TP)',
					fieldInformation: ' ',
					valid: false,
					showButtons: true,
					units: 'self',
					data: true,
					fractionDigits: 3,
				},
				{
					id: '4b6e53ac-451d-486f-87f0-9566e335597b',
					type: 'number',
					label: 'Available Phosphorous (AP)',
					fieldInformation: ' ',
					valid: false,
					showButtons: true,
					units: 'self',
					data: true,
					fractionDigits: 3,
				},
				{
					id: '21f2c5da-3ad5-4f2e-bbde-baa536c7d6f8',
					type: 'number',
					label: ' Potassium (K)',
					fieldInformation: ' ',
					valid: false,
					showButtons: true,
					units: 'self',
					data: true,
					fractionDigits: 3,
				},
				{
					id: '72d254a0-5cb1-4e2d-aa65-d6e7fa41bca5',
					type: 'number',
					label: 'pH',
					fieldInformation: ' ',
					valid: false,
					showButtons: true,
					units: 'self',
					data: true,
					fractionDigits: 3,
				},
			],
			extraFieldsLabel: 'Composition',
			timeFields: 'simple',
		},
	],
};

export default configuration;
