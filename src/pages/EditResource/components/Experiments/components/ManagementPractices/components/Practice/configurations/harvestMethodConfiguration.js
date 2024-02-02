const configuration = {
	header: 'Harvest Method',
	id: '6ec6d9e3-8bca-4166-98bd-b8321e209280',
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
			id: '8c9c0738-e28c-4369-802e-d6fc41c18e02',
			type: 'text area',
			label: 'Notes',
			fieldInformation: ' ',
			valid: false,
			data: true,
		},
		{
			id: '838a285c-c6ed-45be-982b-fa5490d89d76',
			type: 'input-table',
			label: '',
			fieldInformation: '',
			valid: true,
			headerButtonLabel: 'Add Row',
			placeholder: 'Press Add Row',
			deleteMessage: 'Do you want to delete this row?',
			columns: [
				{ field: 'site', header: 'Site', info: '' },
				{ field: 'time_period', header: 'Time Period', info: '' },
				{ field: 'did_practice', header: 'Did practice occur?', info: '' },
				{ field: 'harvest_practice', header: 'Practice', info: '' },
				// { field: 'date', header: 'Date of Occurrence', info: '' },
				{ field: 'harvest_start', header: 'Harvest Date (Start)', info: '' },
				{ field: 'harvest_end', header: 'Harvest Date (End)', info: '' },
				{ field: 'harvest_days', header: 'Harvest Days After Planting', info: '' },
			],
			content: [
				{
					id: 'e05e0fc3-fe95-46d8-97e1-2acc0d77af93',
					type: 'list',
					fieldInformation: '',
					valid: false,
					data: true,
					editable: false,
					optionLabel: 'term',
					dataSource: 'timeVocabs',
					getOptions(data) {
						const { timeVocabs, siteIds } = data;
						const treatmentSites = timeVocabs.sitesVocab?.filter((site) => {
							return siteIds?.includes(site.id);
						});
						if (!treatmentSites) {
							return [];
						}
						if (treatmentSites.length > 1) {
							treatmentSites.push({ term: 'Same for all sites' });
						}
						return treatmentSites;
					},
					col: 'site',
					generatedVocab: true,
				},
				{
					id: '09981240-786b-4286-84b8-42b577622589',
					type: 'list',
					fieldInformation: '',
					valid: false,
					data: true,
					editable: false,
					optionLabel: 'term',
					dataSource: 'timeVocabs-experimentsData',
					getOptions(data) {
						const { timeVocabs, experimentsData } = data;
						const s = experimentsData.get('e05e0fc3-fe95-46d8-97e1-2acc0d77af93')?.value;
						if (s?.term === 'Same for all sites') {
							return [{ term: 'Same for all time periods' }];
						}
						const periods = timeVocabs?.periodsVocab?.filter((prd) => {
							return prd.sites.find((site) => site.term === s?.term);
						});
						if (!periods || periods.length === 0) {
							return [{ term: 'Unspecified' }];
						}
						if (periods.length > 1) {
							periods.push({ term: 'Same for all periods' });
						} else {
							periods.push({ term: 'Unspecified' });
						}
						return periods.map((per) => { return { term: per.term, id: per.id }; });
					},
					col: 'time_period',
					generatedVocab: true,
				},
				{
					id: 'ba1f9141-54b1-4a35-9ef0-de026a926c16',
					type: 'list',
					valid: false,
					data: true,
					col: 'did_practice',
					editable: false,
				},
				{
					id: 'a1b70ba4-84df-41ab-9f7f-d722e652bb24',
					data: true,
					type: 'list',
					// preloadTarget: 'short_value',
					unique: 'Practice',
					editable: false,
					definition: {
						id: 'fcf72d85-f657-4435-acc2-caf2995251f3',
						type: 'text area',
						label: 'Definition',
						fieldInformation: ' ',
						valid: false,
						disabled: true,
						placeholder: 'Practice has no value.',
					},
					col: 'harvest_practice',
					isDisabled(stepValues, id) {
						return stepValues.get(id)?.get('ba1f9141-54b1-4a35-9ef0-de026a926c16')?.value?.term !== 'Yes';
					},
				},
				{
					id: '28f23aed-921b-4baa-8070-022001f94a67',
					data: true,
					type: 'calendar',
					mandatory: false,
					year: false,
					valid: true,
					maxDate: true,
					col: 'harvest_start',
					isDisabled(stepValues, id) {
						return stepValues.get(id)?.get('ba1f9141-54b1-4a35-9ef0-de026a926c16')?.value?.term !== 'Yes';
					},
					validation: true,
				},
				{
					id: 'ad087c02-df3f-47e1-9157-2c829c040f55',
					data: true,
					type: 'calendar',
					mandatory: false,
					year: false,
					valid: true,
					maxDate: true,
					col: 'harvest_end',
					isDisabled(stepValues, id) {
						return stepValues.get(id)?.get('ba1f9141-54b1-4a35-9ef0-de026a926c16')?.value?.term !== 'Yes';
					},
					validation: true,
				},
				{
					id: 'f051408a-cd33-4936-971f-288d50f7e4a0',
					type: 'number',
					showButtons: true,
					valid: false,
					data: true,
					col: 'harvest_days',
					isDisabled(stepValues, id) {
						return stepValues.get(id)?.get('ba1f9141-54b1-4a35-9ef0-de026a926c16')?.value?.term !== 'Yes';
					},
				},
			],
		},
	],
};

export default configuration;
