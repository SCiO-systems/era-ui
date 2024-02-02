const dialogConfiguration = {
	treatment: {
		id: '6d8e4d50-0816-478a-927b-83d131b75c40',
		type: 'text',
		label: 'Treatment Name',
		fieldInformation: ' ',
	},
	herdGroup: {
		id: '7327aa17-85fc-40e8-a02f-46c6cbbcf88d',
		type: 'multi-list',
		label: 'Herd/Group Product Name',
		fieldInformation: ' ',
		valid: true,
		data: true,
		dataSource: 'experiments',
		generatedVocab: true,
		getOptions(data) {
			const options = [];
			const { experimentsData, id } = data;
			if (experimentsData?.size > 0) {
				experimentsData.get(id)?.get('a3f88dd5-0286-40d6-bbc3-cbbf874e5f03')?.forEach((row) => {
					options.push({ term: row.get('4bbb20e9-296f-4639-b7ee-d543c792c1fc')?.value });
				});
			}
			return options;
		},
	},
	site: {
		id: '4f1cbd0c-92b7-44d1-b0d9-a844980bf061',
		type: 'multi-list',
		label: 'Sites',
		fieldInformation: ' ',
		valid: true,
		data: true,
		optionLabel: 'term',
		dataSource: 'sites',
		generatedVocab: true,
		getOptions(data) {
			const { sitesData } = data;
			const options = [];
			if (sitesData.size > 0) {
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
		id: '18b92fd4-6ad6-4547-a2de-6670f344c2ad',
		type: 'checkbox',
		label: 'Control Treatment',
		fieldInformation: ' ',
		data: true,
	},
	replicates: {
		id: 'd0e1df6c-5c8d-47d9-9817-651615a9403a',
		type: 'text',
		label: 'Replicates',
		fieldInformation: ' ',
		data: true,
	},
	animalsRep: {
		id: '124f6b64-83f6-4f39-9110-1b6778214246',
		type: 'number',
		label: 'Animals/Rep',
		fieldInformation: ' ',
		data: true,
	},

	notes: {
		id: '3a35725a-b54a-4a8d-8b9a-ce811432e09f',
		type: 'text area',
		label: 'Notes',
		fieldInformation: ' ',
		data: true,
	},
};

export default dialogConfiguration;
