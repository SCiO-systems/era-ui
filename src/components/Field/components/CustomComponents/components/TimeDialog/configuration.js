const configurationTime = [
	{
		id: '6fd9d246-99fb-4da3-bb6c-b6e1f4b53cef',
		type: 'list',
		fieldInformation: '',
		label: 'Site',
		valid: false,
		data: true,
		editable: false,
		optionLabel: 'term',
		dataSource: 'timeVocabs',
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
		label: 'Time Period',
		valid: false,
		data: true,
		editable: false,
		optionLabel: 'term',
		dataSource: 'timeVocabs-experimentsData',
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
		id: 'ac64cfa9-3d5b-4e85-9827-4b90fe183617',
		data: true,
		type: 'calendar',
		fieldInformation: ' ',
		label: 'Date of Occurrence',
		mandatory: false,
		year: false,
		valid: true,
		maxDate: true,
		isDisabled(stepValues, id) {
			return !(stepValues.get(id)?.get('6fd9d246-99fb-4da3-bb6c-b6e1f4b53cef')?.value && stepValues.get(id)?.get('34664fad-950e-4746-acf3-a3bfc8e3e587')?.value);
		},
	},
	{
		id: '63d7326c-efb5-4f76-94f6-946f883f3037',
		type: 'number',
		fieldInformation: ' ',
		label: 'Days After Planting',
		showButtons: true,
		valid: false,
		data: true,
		isDisabled(stepValues, id) {
			return !(stepValues.get(id)?.get('6fd9d246-99fb-4da3-bb6c-b6e1f4b53cef')?.value && stepValues.get(id)?.get('34664fad-950e-4746-acf3-a3bfc8e3e587')?.value);
		},
	},
	{
		id: '9c2f61cf-8474-4377-b9a2-d041dce71e55',
		type: 'number',
		fieldInformation: ' ',
		label: 'Days After Germination',
		valid: false,
		data: true,
		isDisabled(stepValues, id) {
			return !(stepValues.get(id)?.get('6fd9d246-99fb-4da3-bb6c-b6e1f4b53cef')?.value && stepValues.get(id)?.get('34664fad-950e-4746-acf3-a3bfc8e3e587')?.value);
		},
	},
];

const configurationTimeAlt = [
	{
		id: 'acf8db23-8728-42f5-a14c-830f31bae840',
		type: 'text',
		label: 'dd/mm',
		fieldInformation: ' ',
		valid: false,
		data: true,
	},
	{
		id: '3878e37e-00ef-4262-a8fc-2c8e13df4f75',
		type: 'text',
		label: 'Crop Stage',
		fieldInformation: ' ',
		valid: false,
		data: true,
	},
	{
		id: 'ccd9aa7d-d4ea-4e59-9843-1009287f7661',
		type: 'text',
		label: 'Days Before/After Planting',
		fieldInformation: ' ',
		valid: false,
		data: true,
	},
	{
		id: '7c25f625-a9fe-495d-8ba2-a076589522b3',
		type: 'text',
		label: 'Days Before/After Emergence',
		fieldInformation: ' ',
		valid: false,
		data: true,
	},
	{
		id: '283e072b-366b-4132-badd-771a4d71df76',
		type: 'text area',
		label: 'Other Description',
		fieldInformation: ' ',
		valid: false,
		data: true,
	},
];

export { configurationTime, configurationTimeAlt };
