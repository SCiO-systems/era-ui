const configuration = {
	header: 'Planting Dates',
	id: '84d46444-a7fd-41c7-9f69-2edad9ed3984',
	content: [
		{
			id: 'ef299ba9-11b7-4424-b00f-b280b6e58f76',
			type: 'header',
			text: 'Planting Date per Time Period',
			category: 'p',
			size: '19px',
			weight: '900',
		},
		{
			id: '25503ac7-a05e-4c41-8efe-6305112b28f6',
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
				// { field: 'date', header: 'Date of Occurrence', info: '' },
				{ field: 'planting_start', header: 'Planting Date (Start, dd/mm/yyyy)', info: '' },
				{ field: 'planting_end', header: 'Planting Date (End, dd/mm/yyyy)', info: '' },
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
						let treatmentSites;
						if (timeVocabs?.sitesVocab) {
							treatmentSites = timeVocabs.sitesVocab?.filter((site) => {
								return siteIds?.includes(site.id);
							});
						}
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
					id: '012e7415-1002-454e-a977-1d9029ed40a0',
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
				// {
				// 	id: 'afba0c86-2ffd-4778-b9fc-6df9dcc44eb3',
				// 	data: true,
				// 	type: 'calendar',
				// 	mandatory: false,
				// 	year: false,
				// 	valid: true,
				// 	maxDate: true,
				// 	col: 'date',
				// 	isDisabled(stepValues, id) {
				// 		if (stepValues.get(id)?.get('ba1f9141-54b1-4a35-9ef0-de026a926c16')?.value === 'Yes') {
				// 			return false;
				// 		}
				// 		return true;
				// 	},
				// },
				{
					id: '4a90a49f-1808-463d-bfe2-0ee7775ef4a0',
					data: true,
					type: 'calendar',
					mandatory: false,
					year: false,
					valid: true,
					maxDate: true,
					col: 'planting_start',
					isDisabled(stepValues, id) {
						return stepValues.get(id)?.get('ba1f9141-54b1-4a35-9ef0-de026a926c16')?.value?.term !== 'Yes';
					},
				},
				{
					id: '3e94895d-4883-4df9-93f4-ad7aa01ca540',
					data: true,
					type: 'calendar',
					mandatory: false,
					year: false,
					valid: true,
					maxDate: true,
					col: 'planting_end',
					isDisabled(stepValues, id) {
						return stepValues.get(id)?.get('ba1f9141-54b1-4a35-9ef0-de026a926c16')?.value?.term !== 'Yes';
					},
					validation: true,
				},
			],
		},
	],
};

export default configuration;
