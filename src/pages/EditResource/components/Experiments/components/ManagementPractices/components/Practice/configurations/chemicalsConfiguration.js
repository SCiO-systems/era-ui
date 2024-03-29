const configuration = {
	header: 'Chemicals',
	id: 'd21d057d-301a-454f-a7bb-6ef0dde04c10',
	description: false,
	content: [
		{
			id: 'd59ff545-246d-4add-91dc-ae64633ce9e9',
			data: true,
			type: 'text',
			label: 'Practice Name',
			fieldInformation: ' ',
		},
		{
			id: 'e84f90e8-47f2-448e-9e49-979cbdf2201c',
			data: true,
			type: 'list',
			label: 'Structure Outcome Reporting',
			fieldInformation: ' ',
		},
		{
			id: '5e3cecfc-0ee3-484f-8f10-0df5bbcb67bc',
			type: 'input-table',
			label: '',
			fieldInformation: '',
			valid: true,
			headerButtonLabel: 'Add Row',
			placeholder: 'Press Add Row',
			deleteMessage: 'Do you want to delete this row?',
			data: 'table',
			columns: [
				{ field: 'type_of_chemical', header: 'Type of Chemical Applied', info: '' },
				{ field: 'name_of_chemical', header: 'Name of Chemical/Product Applied', info: '' },
				// { field: 'iupac_name_of_chemical', header: 'IUPAC Name of Chemical/Product Applied', info: '' },
				{ field: 'active_ing_amount', header: 'Active Ingredient Amount in Product', info: '' },
				{ field: 'active_ing_unit', header: 'Active Ingredient Unit', info: '' },
				{ field: 'app_rate', header: 'Application Rate or Amount', info: '' },
				{ field: 'app_unit', header: 'Unit of Application', info: '' },
				{ field: 'app_number', header: 'Total Number of Applications', info: '' },
				// { field: 'dd_mm', header: 'dd/mm', info: '' },
				// { field: 'crop_stage', header: 'Crop Stage', info: '' },
				// { field: 'days_be_af', header: 'Days before/after planting', info: '' },
				{ field: 'desc', header: 'Text Description', info: '' },
			],
			timeFields: 'alt',
			content: [
				{
					id: '25d691e2-40ca-483b-93b5-3bffb93e7fc6',
					type: 'list',
					label: '',
					fieldInformation: '',
					valid: false,
					col: 'type_of_chemical',
					data: true,
				},
				{
					id: '7de6ae92-85a4-4b89-9066-4b29e65f83a0',
					type: 'list',
					label: '',
					fieldInformation: '',
					valid: false,
					col: 'name_of_chemical',
					data: true,
				},
				{
					id: '30c22b0c-b230-4b93-b73f-f2377bfea5e5',
					type: 'number',
					label: '',
					fieldInformation: '',
					valid: false,
					col: 'active_ing_amount',
					data: true,
					fractionDigits: 3,
				},
				{
					id: '24deac74-2fed-44e5-b62e-d6887bbebbe0',
					type: 'list',
					label: '',
					fieldInformation: '',
					valid: false,
					col: 'active_ing_unit',
					data: true,
				},
				{
					id: '1b8472e6-88cd-4f85-9ede-0210538e3af8',
					type: 'number',
					label: '',
					fieldInformation: '',
					valid: false,
					col: 'app_rate',
					data: true,
					fractionDigits: 3,
				},
				{
					id: '682b329e-cb6e-48a1-8caf-02c7e565501c',
					type: 'list',
					label: '',
					fieldInformation: '',
					valid: false,
					col: 'app_unit',
					data: true,
				},
				{
					id: '0a8f2d9d-de3c-4bd1-8720-007fb4e5ce89',
					type: 'number',
					label: '',
					fieldInformation: '',
					valid: false,
					col: 'app_number',
					data: true,
					fractionDigits: 3,
				},
				{
					id: '935ee0b3-15ab-4d48-bb6f-7b5f0b7a8416',
					type: 'text',
					label: '',
					fieldInformation: '',
					valid: false,
					data: true,
					col: 'desc',
				},
			],
		},
	],
};

export default configuration;
