const configurationCrop = {
	id: 'b3c2cdd3-9c3b-453a-a3f0-fafbcd664b84',
	type: 'input-table',
	paginator: true,
	label: '',
	mandatory: false,
	columns: [
		{ field: 'rotation', header: 'Rotation', info: '', custom: true },
		{ field: 'treatment', header: 'Treatment', info: '', custom: true },
		{ field: 'site', header: 'Site', info: '', custom: true },
		{ field: 'time_period', header: 'Time Period', info: '', custom: true },
		{ field: 'crop', header: 'Crop', info: '', custom: true },
		{ field: 'product_component', header: 'Product Component', info: '' },
		{ field: 'outcome', header: 'Outcome', info: '', custom: true },
		{ field: 'outcome_unit', header: 'Outcome Unit', info: '', custom: true },
		{ field: 'value', header: 'Value', info: '' },
		{ field: 'error', header: 'Error', info: '' },
		{ field: 'error_type', header: 'Error Type', info: '' },
		{ field: 'publication_figure_table', header: 'Publication Figure/Table', info: '' },
		{ field: 'sampling_start', header: 'Sampling Date Start', info: '' },
		{ field: 'sampling_end', header: 'Sampling Date End', info: '' },
		{ field: 'days_after_planting', header: 'Days after Planting', info: '' },
		{ field: 'irrigation_rainfall_intensity_amount', header: 'Irrigation/Rainfall Intensity: Amount Applied', info: '' },
		{ field: 'irrigation_rainfall_intensity_unit', header: 'Irrigation/Rainfall Intensity: Unit of Application', info: '' },
		{ field: 'comparison_treatment', header: 'Comparison Treatment', info: 'e.g. for fertilizer use efficiency outcomes', custom: true },
	],
	content: [
		{
			id: '79f8b0b8-0779-4bbb-b1bf-190aea541071',
			type: 'multi-list',
			valid: false,
			col: 'treatment',
			data: true,
			editable: false,
			autoFill: true,
			generatedVocab: true,
			genMethod: 'optionsProperty',
			getOptions(stepValues, selectedExperiment, data) {
				if (stepValues.size > 0) {
					const experimentRow = stepValues.get(selectedExperiment);
					const opts = new Set();
					if (experimentRow) {
						const rotationsTable = experimentRow.get('67076c1e-3e25-4fe4-94ac-a770400e974b');
						const selectedRotation = data.value.get('f98b8392-286d-4a6e-9ac5-0d356cc54450');
						if (selectedRotation?.value && selectedRotation?.value.term !== 'None') {
							rotationsTable?.forEach((row, key) => {
								if (selectedRotation.value.id === key) {
									const inputTable = row.get('92eaa8ec-25b4-4e76-bdbe-bb3da7c976e0');
									if (inputTable && inputTable.size > 0) {
										inputTable?.forEach((inputTableRow) => {
											const rowTreatment = inputTableRow?.get('cc6cd11c-dc7d-4eee-80c7-4b88efd277b1')?.value;
											if (rowTreatment) {
												opts.add(rowTreatment);
											}
										});
									}
								}
							});
						} else {
							const treatments = experimentRow.get('treatment-index');
							if (treatments) {
								Array.from(treatments.keys()).forEach((treatment) => {
									opts.add({ term: treatment });
								});
							}
						}
					}
					return Array.from(opts);
				}
				return [];
			},
		},
		{
			id: '704140b8-3353-4bc0-88e1-907459f63e18',
			type: 'multi-list',
			valid: false,
			col: 'site',
			data: true,
			editable: false,
			autoFill: true,
			generatedVocab: true,
			genMethod: 'optionsProperty',
			getOptions(stepValues, selectedExperiment, sitesData, localState, dataKey) {
				if (stepValues.size > 0) {
					const opts = new Set();
					const selectedTreatments = localState.get(dataKey).get('79f8b0b8-0779-4bbb-b1bf-190aea541071')?.value;
					const experimentRow = stepValues.get(selectedExperiment);
					const treatmentIds = selectedTreatments?.map((treatment) => experimentRow.get('treatment-index')?.get(treatment.term));
					const treatments = experimentRow.get('429a3146-ecd8-483f-bb84-e8a57f559726');
					if (treatments.size > 0) {
						treatmentIds?.forEach((id) => {
							const treatment = treatments.get(id);
							const sites = treatment?.get('255fb141-ee7b-4571-bc55-b75a00f3e899');
							const sitesTable = sitesData?.get('be7817c9-10ac-4669-b131-ae077e22855d');
							sites?.value?.forEach((site) => {
								opts.add(sitesTable.get(site.id)?.get('b6f2545f-c745-4902-a3e5-852f775a9190')?.value.term);
							});
						});
					}

					return Array.from(opts).map((o) => { return { term: o }; });
				}
				return [];
			},
		},
		{
			id: '4574f980-a30d-4e5b-b0cf-f4b9ea98fb82',
			type: 'multi-list',
			valid: false,
			col: 'time_period',
			data: true,
			editable: false,
			autoFill: true,
			generatedVocab: true,
			genMethod: 'optionsProperty',
			getOptions(stepValues, timeVocabs, data) {
				const options = [];
				if (stepValues?.size > 0) {
					const selectedSites = data.value.get('704140b8-3353-4bc0-88e1-907459f63e18');
					selectedSites?.value?.forEach((selSite) => {
						const filtered = timeVocabs?.periodsVocab?.filter((prd) => {
							return prd.sites.find((site) => site.term === selSite.term);
						});
						filtered?.forEach((per) => {
							options.push({ term: per.term });
						});
					});
				}
				return options;
			},
		},
		{
			id: '04885af5-31d5-412b-8d8e-4a84a2ac6732',
			type: 'list',
			valid: false,
			col: 'crop',
			data: true,
			editable: false,
			autoFill: true,
			generatedVocab: true,
			genMethod: 'optionsProperty',
			getOptions(stepValues, selectedExperiment, localState, dataKey) {
				let options = [];
				if (stepValues.size > 0) {
					const selectedTreatments = localState.get(dataKey).get('79f8b0b8-0779-4bbb-b1bf-190aea541071')?.value;
					const experimentRow = stepValues.get(selectedExperiment);
					const treatmentIds = selectedTreatments?.map((treatment) => experimentRow.get('treatment-index')?.get(treatment.term));
					const treatments = experimentRow.get('429a3146-ecd8-483f-bb84-e8a57f559726');
					if (treatments.size > 0) {
						treatmentIds?.forEach((id) => {
							const treatment = treatments.get(id);
							if (treatment) {
								options = Array.from(treatment.get('crop-index').keys());
								if (options.length > 1) {
									options.unshift('Entire Intercrop');
								}
							}
						});
					}
					return options.map((o) => { return { term: o }; });
				}
				return [];
			},
		},
		{
			id: '50c0f85e-5fbf-4d75-b8ba-012a869bba23',
			type: 'list',
			valid: false,
			data: true,
			col: 'product_component',
		},
		{
			id: 'f98b8392-286d-4a6e-9ac5-0d356cc54450',
			type: 'list',
			valid: false,
			col: 'rotation',
			optionLabel: 'term',
			data: true,
			editable: false,
			autoFill: true,
			generatedVocab: true,
			genMethod: 'optionsProperty',
			getOptions(stepValues, selectedExperiment) {
				const options = [];
				if (stepValues.size > 0) {
					options.push({ term: 'None' });
					const experimentRow = stepValues.get(selectedExperiment);
					if (experimentRow) {
						const rotationsTable = experimentRow.get('67076c1e-3e25-4fe4-94ac-a770400e974b');
						rotationsTable.forEach((rotation) => {
							const temp = rotation.get('d59ff545-246d-4add-91dc-ae64633ce9e9');
							options.push({ term: temp.value, id: temp.id });
						});
					}
				}
				return options;
			},
		},
		{
			id: '42c266fb-b9a8-49f6-abdb-8caf9c989285',
			type: 'list',
			valid: false,
			col: 'outcome',
			optionLabel: 'term',
			data: true,
			editable: false,
			autoFill: true,
			generatedVocab: true,
			genMethod: 'optionsProperty',
			getOptions(stepValues, selectedExperiment) {
				const options = [];
				const outcomesData = stepValues?.get(selectedExperiment)?.get('feec0c82-0fbf-475f-a3e4-3331ed601438');
				if (outcomesData?.size > 0) {
					const outcomesTable = outcomesData.get('55c0c7f9-95b9-471c-bb51-a4ce0d1a4f4f');
					if (outcomesTable.size > 0) {
						outcomesTable.forEach((value) => {
							// options.push(value.get('c2c639af-446d-4d51-a80f-870b74e67ac8').value);
							options.push({ term: value.get('c2c639af-446d-4d51-a80f-870b74e67ac8').value });
							// options.push(`${value.get('c9a5bdbe-044d-40fd-9b46-4cee6d2b9256').value} - ${value.get('c2c639af-446d-4d51-a80f-870b74e67ac8').value}`);
						});
					}
				}
				return options;
			},
		},
		{
			id: 'c3559b15-78be-4116-8e3e-d954a6659187',
			type: 'text',
			label: '',
			fieldInformation: '',
			valid: false,
			col: 'outcome_unit',
			optionLabel: 'term',
			disabled: true,
			data: true,
			autoFill: true,
		},
		{
			id: '1db0e04c-cd8e-427f-bb55-84037e755dde',
			type: 'number',
			mandatory: false,
			label: '',
			fieldInformation: '',
			valid: false,
			fractionDigits: 3,
			col: 'value',
			data: true,
		},
		{
			id: 'a91d2169-0a7c-4720-baf5-f6a3e4a048d4',
			type: 'number',
			mandatory: false,
			label: '',
			fieldInformation: '',
			valid: false,
			fractionDigits: 3,
			col: 'error',
			data: true,
		},
		{
			id: '3cc5b368-876b-41d5-bbbc-25886823906a',
			type: 'list',
			valid: false,
			col: 'error_type',
			data: true,
		},
		{
			id: '2caa1cc7-ebef-4af4-af80-8328b97c2efb',
			type: 'text',
			label: '',
			fieldInformation: '',
			valid: false,
			col: 'publication_figure_table',
			data: true,
		},
		{
			id: '2e589cf9-6f37-499e-a87d-0157a6134afa',
			type: 'text',
			label: '',
			fieldInformation: '',
			valid: false,
			col: 'sampling_start',
			data: true,
		},
		{
			id: '144a2db4-01cf-4084-b357-295cb0a29b90',
			type: 'text',
			label: '',
			fieldInformation: '',
			valid: false,
			col: 'sampling_end',
			data: true,
		},
		{
			id: '2ef20ecd-1d0d-4002-88cd-d16fd84ca369',
			type: 'text',
			label: '',
			fieldInformation: '',
			valid: false,
			col: 'days_after_planting',
			data: true,
		},
		{
			id: '5d3c1f17-450f-40a4-a67d-89c80509cd8e',
			type: 'number',
			label: '',
			fieldInformation: '',
			valid: false,
			col: 'irrigation_rainfall_intensity_amount',
			data: true,
			fractionDigits: 3,
		},
		{
			id: '79f8b0b8-0779-4bbb-b1bf-190aea5410710',
			type: 'list',
			valid: false,
			col: 'irrigation_rainfall_intensity_unit',
			data: true,
		},
		{
			id: 'e1f91447-ac2c-4b2b-9bec-832f44e232af',
			type: 'list',
			valid: false,
			col: 'comparison_treatment',
			data: true,
			generatedVocab: true,
			editable: false,
			genMethod: 'optionsProperty',
			getOptions(stepValues, selectedExperiment) {
				if (stepValues.size > 0) {
					const experimentRow = stepValues.get(selectedExperiment);
					const opts = new Set();
					const treatments = experimentRow.get('treatment-index');
					if (treatments) {
						Array.from(treatments.keys()).forEach((treatment) => {
							opts.add({ term: treatment });
						});
					}
					return Array.from(opts);
				}
				return [];
			},
		},
	],
};

export default configurationCrop;
