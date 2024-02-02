const weightGainFields = [
	{
		id: 'c053bad1-9865-4602-bd60-91564c1c1b4b',
		type: 'header',
		text: 'Weight Gain',
		category: 'p',
		size: '16px',
		weight: '500',
		data: true,
	},
	{
		id: 'e52d631b-2892-4134-acd2-d8554d06d918',
		type: 'text',
		label: 'Mean Starting Weight',
		fieldInformation: ' ',
		valid: false,
		linkedField: { id: 'c9a5bdbe-044d-40fd-9b46-4cee6d2b9256', targetValue: ['Weight Gain', 'Meat Yield'] },
		disabled: true,
		data: true,
	},
	{
		id: '0c2c838f-1de4-43f6-9a46-27819447a3ad',
		type: 'text',
		label: 'Starting Weight Unit',
		fieldInformation: ' ',
		valid: false,
		linkedField: { id: 'c9a5bdbe-044d-40fd-9b46-4cee6d2b9256', targetValue: ['Weight Gain', 'Meat Yield'] },
		disabled: true,
		data: true,
	},
	{
		id: '67c062ff-b823-4bd6-aee6-0858ed11014b',
		type: 'text',
		label: 'Duration (Days)',
		fieldInformation: ' ',
		valid: false,
		linkedField: { id: 'c9a5bdbe-044d-40fd-9b46-4cee6d2b9256', targetValue: ['Weight Gain', 'Meat Yield'] },
		disabled: true,
		data: true,
	},
];

const npvFields = [
	{
		id: '250aa80e-b78f-48f4-95da-aed9cf251570',
		type: 'header',
		text: 'NPV',
		category: 'p',
		size: '16px',
		weight: '500',
	},
	{
		id: 'dc78bb50-a193-4078-9536-96b873adc8f3',
		type: 'text',
		label: 'Discount Rate (%)',
		fieldInformation: ' ',
		valid: false,
		linkedField: { id: 'c9a5bdbe-044d-40fd-9b46-4cee6d2b9256', targetValue: ['Net Present Value'] },
		disabled: true,
		data: true,
	},
	{
		id: '426d20e2-fd1c-4e07-8532-fc22d81ba8b9',
		type: 'text',
		label: 'Period (Year)',
		fieldInformation: ' ',
		valid: false,
		linkedField: { id: 'c9a5bdbe-044d-40fd-9b46-4cee6d2b9256', targetValue: ['Net Present Value'] },
		linkedValue: 'Net Present Value',
		disabled: true,
		data: true,
	},
];

const soilFields = [
	{
		id: '7a00ecfd-4dbb-4e2a-8a84-9c0d2783f6e8',
		type: 'header',
		text: 'Soil Outcome Depths (cm)',
		category: 'p',
		size: '16px',
		weight: '500',
	},
	{
		id: 'e964b054-7339-4272-8ea4-eaaf8fbb5b77',
		type: 'number',
		label: 'Upper',
		fieldInformation: ' ',
		valid: false,
		data: true,
		fractionDigits: 3,
	},
	{
		id: 'de5266a6-db3c-4f38-9753-49074af9afe2',
		type: 'number',
		label: 'Lower',
		fieldInformation: ' ',
		valid: false,
		data: true,
		fractionDigits: 3,
	},
];

const economicFields = [
	{
		id: 'c2e90f46-20cb-4660-8356-8f0951da34f7',
		type: 'list',
		label: 'Economic Data Calculation Method',
		fieldInformation: ' ',
		filter: false,
		data: true,
		options: ['Work in progress.'],
	},
	{
		id: '5d9897ec-1af6-43c4-a36f-740f15f7d128',
		type: 'list',
		label: 'Currency',
		fieldInformation: ' ',
		filter: true,
		data: true,
		options: ['Work in progress.'],
	},
	{
		id: '4b308e18-2118-488d-bca8-1b41c327e54a',
		type: 'number',
		label: 'USD Exchange Rate',
		data: true,
		fieldInformation: ' ',
		fractionDigits: 3,
	},
];

export { weightGainFields, economicFields, npvFields, soilFields };
