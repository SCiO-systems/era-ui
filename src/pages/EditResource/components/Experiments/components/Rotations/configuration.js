const configuration = {
	header: 'Rotations',
	id: 'c1f2ff6d-1059-4e59-a0d7-967403afd169',
	content: [
		{
			id: '67076c1e-3e25-4fe4-94ac-a770400e974b',
			type: 'expandable-table',
			label: '',
			fieldInformation: '',
			valid: false,
			editable: true,
			headerButtonLabel: 'Add Sequence',
			placeholder: 'Press Add Sequence',
			deleteMessage: 'Do you want to delete this sequence?',
			data: 'table',
			columns: [
				{
					id: 'd59ff545-246d-4add-91dc-ae64633ce9e9',
					data: true,
					type: 'text',
					label: 'Sequence Name',
				},
			],
			content: [
				{
					id: 'a245fb92-adc3-47a7-a61a-9a341ae4f5f7',
					type: 'list',
					label: 'Choose Practice',
					fieldInformation: ' ',
					valid: false,
					data: true,
					definition: {
						id: 'e17b9c57-847e-411f-b991-bb484b1b8e80',
						type: 'text area',
						label: 'Definition',
						fieldInformation: ' ',
						valid: false,
						disabled: true,
						placeholder: 'Practice has no value.',
						rows: 3,
					},
				},
				{
					id: '38ebb85d-8b5f-40ec-a3f1-182acffdd67c',
					type: 'multi-list',
					label: 'Site',
					fieldInformation: ' ',
					valid: false,
					data: true,
					editable: false,
					optionLabel: 'term',
					dataSource: 'experiments',
					getOptions(data) {
						const { experimentsData } = data;
						const opts = [];
						experimentsData.forEach((e) => {
							const mgmt = e?.get('429a3146-ecd8-483f-bb84-e8a57f559726');
							mgmt.forEach((t) => {
								const sites = t?.get('255fb141-ee7b-4571-bc55-b75a00f3e899');
								sites?.value.forEach((s) => {
									if (!opts.find((o) => o.term === s.term)) {
										opts.push(s);
									}
								});
							});
						});
						console.log(opts);
						return opts;
					},
					generatedVocab: true,
				},
				{
					id: '5051d514-70aa-47e3-b92e-933cd9cf8665',
					type: 'number',
					mandatory: false,
					// minNumber: 1,
					label: 'Reps',
					fieldInformation: ' ',
					valid: false,
					showButtons: true,
					data: true,
				},
				{
					id: '32a74d97-68b9-49d0-a8b0-3ecf521f3adc',
					type: 'list',
					label: 'Control?',
					fieldInformation: ' ',
					valid: false,
					data: true,
				},
				{
					id: 'b5fec683-8459-4e5c-b33f-a24b709a9150',
					type: 'list',
					label: 'All Phases?',
					fieldInformation: ' ',
					valid: false,
					data: true,
				},
				{
					id: '94e3bdcc-89f3-4955-9aec-0318a28ac049',
					type: 'calendar',
					mandatory: false,
					label: 'Start Year',
					fieldInformation: ' ',
					valid: true,
					year: true,
					data: true,
				},
				{
					id: 'be2e6085-8dd5-4e44-ab51-6056204eb471',
					type: 'text',
					label: 'Start Season',
					fieldInformation: ' ',
					valid: false,
					data: true,
				},
				{
					id: '92eaa8ec-25b4-4e76-bdbe-bb3da7c976e0',
					type: 'input-table',
					data: 'table',
					label: '',
					fieldInformation: '',
					valid: true,
					headerButtonLabel: 'Add Rotation',
					placeholder: 'Press Add Rotation',
					deleteMessage: 'Do you want to delete this row?',
					columns: [
						{ field: 'time_period', header: 'Time Period', info: '' },
						{ field: 'rotation_treatments', header: 'Treatment', info: '' },
						// { field: 'year', header: 'Year', info: '' },
						// { field: 'season', header: 'Season', info: '' },
						{ field: 'fate', header: 'Fate Crop Residues The Previous Season', info: '' },
					],
					content: [
						{
							id: 'cc6cd11c-dc7d-4eee-80c7-4b88efd277b1',
							type: 'list',
							label: '',
							maxWords: 1,
							fieldInformation: '',
							valid: false,
							col: 'rotation_treatments',
							data: true,
							generatedVocab: true,
						},
						{
							id: '3b17e0ab-efe0-4d24-b2d6-da992a8a238e',
							type: 'list',
							label: '',
							fieldInformation: '',
							valid: false,
							col: 'time_period',
							optionLabel: 'term',
							data: true,
							generatedVocab: true,
						},
						// {
						// 	id: '0bbef748-5f33-4cd3-8a5c-1761755bbf5d',
						// 	type: 'text',
						// 	label: '',
						// 	fieldInformation: '',
						// 	valid: false,
						// 	col: 'year',
						// 	disabled: true,
						// 	data: true,
						// },
						// {
						// 	id: '4059bd97-19ba-4d82-942a-fae039020c5f',
						// 	type: 'text',
						// 	label: '',
						// 	fieldInformation: '',
						// 	valid: false,
						// 	disabled: true,
						// 	col: 'season',
						// 	data: true,
						// },
						{
							id: '2e1d229e-6b7d-4212-a40f-90e961df25dc',
							type: 'list',
							label: '',
							fieldInformation: '',
							valid: false,
							col: 'fate',
							data: true,
						},
					],
				},
			],
		},
	],
};

export default configuration;
