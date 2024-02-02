const dialogConfiguration = {
	treatment: {
		id: '536238f6-d1db-4186-96fb-8d1512b59fa6',
		type: 'text',
		label: 'Treatment Name',
		fieldInformation: ' ',
	},
	intercrop: {
		id: '66531c4d-909d-4c0e-909e-dbdba2e27140',
		type: 'multi-list',
		label: 'Type of Intercropping',
		fieldInformation: ' ',
		valid: true,
		data: true,
	},
	cropsHeader: {
		type: 'header',
		text: 'Species',
		category: 'p',
		size: '16px',
		columnNumber: 1,
		weight: '600',
		data: true,
	},
	crops: {
		id: '3b54d21e-4852-42da-98fb-b2e3d2ba0f1a',
		type: 'multi-list',
		label: 'Common Name',
		fieldInformation: ' ',
		valid: true,
		data: true,
		customTermEditMode: 'manual',
		filter: true,
	},
	cropsScientific: {
		id: '4ffeade1-920c-491f-b232-b9de275bc799',
		type: 'multi-list',
		label: 'Scientific Name',
		fieldInformation: ' ',
		valid: true,
		data: true,
		customTermEditMode: 'manual',
		options: [],
		filter: true,
	},
	otherHeader: {
		type: 'header',
		text: 'Treatment Details',
		category: 'p',
		size: '16px',
		columnNumber: 1,
		weight: '600',
		data: true,
	},
	site: {
		type: 'multi-list',
		label: 'Sites',
		fieldInformation: ' ',
		valid: true,
		data: true,
		optionLabel: 'term',
		dataSource: 'sites',
		generatedVocab: true,
		editable: false,
		getOptions(data) {
			const { sitesData } = data;
			const options = [];
			if (sitesData?.size > 0) {
				sitesData.get('be7817c9-10ac-4669-b131-ae077e22855d').forEach((row, key) => {
					options.push({
						id: key,
						term: row.get('b6f2545f-c745-4902-a3e5-852f775a9190').value.term,
					});
				});
			}
			return options;
		},
	},
	control: {
		type: 'checkbox',
		label: 'Control Treatment',
		fieldInformation: ' ',
		data: true,
	},
	replicates: {
		type: 'number',
		label: 'Replicates',
		fieldInformation: ' ',
		data: true,
	},
	notes: {
		type: 'text area',
		label: 'Notes',
		fieldInformation: ' ',
		data: true,
	},
	// replicatesNumber: {
	// 	type: 'text',
	// 	label: 'Replicates',
	// 	fieldInformation: ' ',
	// 	data: true,
	// },
};

export default dialogConfiguration;
