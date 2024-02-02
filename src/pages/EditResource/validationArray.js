const validationArray = [
	{
		id: 'f9e7c4b6-2236-47ee-b307-f89a18b4fa63',
		validate(val) {
			function isValidHttpUrl(string) {
				let url;
				try {
					url = new URL(string);
				} catch (_) {
					return false;
				}
				return !!url;
			}
			if (!val) {
				return false;
			}
			const doiPattern = /(10[.][0-9]{4,}[^\s"/<>]*\/[^\s"<>]+)/;
			const doiTest = doiPattern.test(val);
			if (!doiTest) {
				return isValidHttpUrl(val);
			}
			return true;
		},
		invalidText: 'Please enter a valid DOI',
		mandatory: false,
	},
	{
		id: '9d292d42-0f25-4f77-b3b1-8c11fb37f0a3',
		validate(val) {
			return val?.type === 'application/pdf';
		},
	},
	{
		id: '1b8e2580-1db4-4645-b17c-de890d5483b6',
		validate(val) {
			return !!val;
		},
		mandatory: true,
		invalidText: 'The property is mandatory',
	},
	{
		id: '19a461fc-491e-48a7-8f3d-9223bad0bcd3',
		validate(val) {
			return !!val;
		},
		mandatory: true,
		invalidText: 'The property is mandatory',
	},
	{
		id: '50c0f85e-5fbf-4d75-b8ba-012a869bba23',
		validate(val) {
			return !!val;
		},
		mandatory: true,
		invalidText: 'The property is mandatory',
	},
	{
		id: 'b128c1b8-5094-4347-bef5-5f192685dbb8',
		validate(val) {
			return !!val?.term;
		},
		mandatory: true,
		invalidText: 'The property is mandatory',
	},
	{
		id: '65204e6e-022b-42f1-b50c-e7028f857243',
		validate(val) {
			return !!val?.term;
		},
		mandatory: true,
		nested: true,
		invalidText: 'The property is mandatory',
	},
	{
		id: 'cf23b727-9e04-48b7-ba64-b2b7bd02ffc1',
		validate(val) {
			return !!val?.term;
		},
		mandatory: true,
		nested: true,
		invalidText: 'The property is mandatory',
	},
	{
		id: '6945fb73-3e26-403a-8d43-2cdab030b09b',
		validate(val) {
			if (val || val === 0) {
				return true;
			}
			return false;
		},
		mandatory: true,
		nested: true,
		invalidText: 'The property is mandatory',
	},
	{
		id: 'faa84f33-b3ea-443b-a682-7faf78e1d84f',
		validate(val) {
			if (val || val === 0) {
				return true;
			}
			return false;
		},
		mandatory: true,
		nested: true,
		invalidText: 'The property is mandatory',
	},
	{
		id: 'c6e5c14d-5f0f-433e-9f0f-a57c0c369a18',
		validate(val, validationData) {
			const { validationContextValue, id } = validationData;
			let valid = true;
			if (validationContextValue?.validationHelper) {
				validationContextValue.validationHelper[this.helperTarget]?.forEach((row, key) => {
					if (key !== id) {
						if (val <= row.lower && val >= row.upper) {
							valid = false;
						}
					}
				});
			}
			return valid;
		},
		helperTarget: 'soil-bounds',
		editValidationHelper(stepValues, validationData) {
			const { validationContextValue, id } = validationData;
			const value = stepValues.get(id).get(this.id);
			const helperData = { ...validationContextValue.validationHelper };
			const thisHelper = helperData[this.helperTarget] || new Map();

			let helperVal = {};
			if (thisHelper.has(id)) {
				helperVal = thisHelper.get(id);
			}
			helperVal.upper = value.value;
			thisHelper.set(id, helperVal);

			helperData[this.helperTarget] = thisHelper;
			validationContextValue.setValidationHelper(helperData);
		},
		mandatory: true,
		nested: true,
		validationData: ['stepValues', 'id'],
		invalidText: 'Soil Records for a site should not have overlapping depth records.',
	},
	{
		id: 'aabfb140-ca68-4d48-98f7-cba77296c844',
		validate(val, validationData) {
			const { validationContextValue, id } = validationData;
			let valid = true;
			if (validationContextValue?.validationHelper) {
				validationContextValue.validationHelper[this.helperTarget]?.forEach((row, key) => {
					if (key !== id) {
						if (val <= row.lower && val >= row.upper) {
							valid = false;
						}
					}
				});
			}
			return valid;
		},
		editValidationHelper(stepValues, validationData) {
			const { validationContextValue, id } = validationData;
			const value = stepValues.get(id).get(this.id);
			const helperData = { ...validationContextValue.validationHelper };
			const thisHelper = helperData[this.helperTarget] || new Map();

			let helperVal = {};
			if (thisHelper.has(id)) {
				helperVal = thisHelper.get(id);
			}
			helperVal.lower = value.value;
			thisHelper.set(id, helperVal);

			helperData[this.helperTarget] = thisHelper;
			validationContextValue.setValidationHelper(helperData);
		},
		helperTarget: 'soil-bounds',
		mandatory: true,
		nested: true,
		validationData: ['stepValues', 'id'],
		invalidText: 'Soil Records for a site should not have overlapping depth records.',
	},
	{
		id: '588cb6dd-7384-406f-9583-d47dcdd242fb',
		validate(val, validationData) {
			if (validationData?.disabled) {
				return true;
			}
			return !!val?.term;
		},
		validationData: ['stepValues', 'id', 'disabled'],
		mandatory: true,
		nested: true,
		invalidText: 'The property is mandatory',
	},
	{
		id: 'bdd1b82f-9327-424a-9904-c418329e8aa4',
		validate(val, validationData) {
			if (validationData?.disabled) {
				return true;
			}
			return !!val?.term;
		},
		mandatory: true,
		nested: true,
		validationData: ['stepValues', 'id', 'disabled'],
		invalidText: 'The property is mandatory',
	},
	{
		id: 'c08eb05b-3222-4f86-bdf6-b3aaebcec647',
		validate(val, validationData) {
			if (validationData?.disabled) {
				return true;
			}
			return !!val?.term;
		},
		mandatory: true,
		nested: true,
		validationData: ['stepValues', 'id', 'disabled'],
		invalidText: 'The property is mandatory',
	},
	{
		id: 'efb5aa2a-89c3-40c0-8b8c-42fdeb09f374',
		validate(val, validationData) {
			if (validationData?.disabled) {
				return true;
			}
			return !!val?.term;
		},
		mandatory: true,
		nested: true,
		validationData: ['stepValues', 'id', 'disabled'],
		invalidText: 'The property is mandatory',
	},
	{
		id: '3e94895d-4883-4df9-93f4-ad7aa01ca540',
		validate(val, validationData) {
			if (validationData.disabled) {
				return true;
			}
			if (!val) {
				return true;
			}
			const otherDate = validationData.stepValues?.get(validationData.id)?.get('4a90a49f-1808-463d-bfe2-0ee7775ef4a0')?.value;
			if (!otherDate) {
				return true;
			}
			const d1 = new Date(val);
			const d2 = new Date(otherDate);
			return d1.getTime() > d2.getTime();
		},
		helperTarget: 'plantingDates',
		editValidationHelper(stepValues, validationData) {
			const { validationContextValue, id } = validationData;
			const helperData = { ...validationContextValue.validationHelper };
			const thisHelper = helperData[this.helperTarget] || new Map();

			const helperVal = {};
			helperVal.site = stepValues.get(id).get('e05e0fc3-fe95-46d8-97e1-2acc0d77af93').value;
			helperVal.time = stepValues.get(id).get('012e7415-1002-454e-a977-1d9029ed40a0').value;
			helperVal.plantingDate = stepValues.get(id).get('3e94895d-4883-4df9-93f4-ad7aa01ca540').value;
			thisHelper.set(id, helperVal);

			helperData[this.helperTarget] = thisHelper;
			validationContextValue.setValidationHelper(helperData);
		},
		mandatory: true,
		nested: true,
		validationData: ['stepValues', 'id', 'disabled'],
		invalidText: 'End Date must be after Start Date',
	},
	{
		id: 'ad087c02-df3f-47e1-9157-2c829c040f55',
		validate(val, validationData) {
			if (validationData.disabled) {
				return true;
			}
			if (!val) {
				return true;
			}
			const otherDate = validationData.stepValues?.get(validationData.id)?.get('4a90a49f-1808-463d-bfe2-0ee7775ef4a0')?.value;
			if (!otherDate) {
				return true;
			}
			const d1 = new Date(val);
			const d2 = new Date(otherDate);
			return d1.getTime() > d2.getTime();
		},
		mandatory: true,
		nested: true,
		validationData: ['stepValues', 'id', 'disabled'],
		invalidText: 'End Date must be after Start Date',
	},
	{
		id: '28f23aed-921b-4baa-8070-022001f94a67',
		validate(val, validationData) {
			if (validationData.disabled) {
				return true;
			}
			if (!val) {
				return true;
			}

			const { validationContextValue, id, stepValues } = validationData;
			const selectedSite = stepValues.get(id).get('e05e0fc3-fe95-46d8-97e1-2acc0d77af93').value;
			const selectedTime = stepValues.get(id).get('09981240-786b-4286-84b8-42b577622589').value;
			if (validationContextValue.validationHelper) {
				const foundRow = Array.from(validationContextValue.validationHelper[this.helperTarget].values()).find((plantingDateRow) => {
					return plantingDateRow.site.term === selectedSite.term && plantingDateRow.time.term === selectedTime.term;
				});
				if (foundRow) {
					const d1 = new Date(val);
					const d2 = foundRow.plantingDate;
					return d1.getTime() > d2.getTime();
				}
			}
			return true;
		},
		mandatory: true,
		nested: true,
		validationData: ['disabled', 'stepValues', 'id'],
		invalidText: 'Harvest Date Start must be after Planting Date End for this Site and Time Period',
		helperTarget: 'plantingDates',
	},
	{
		id: '89b4a69a-0334-45e9-ade4-da02eac59037',
		validate(val, validationData) {
			if (validationData?.disabled) {
				return true;
			}
			return !!val?.term;
		},
		mandatory: true,
		nested: true,
		validationData: ['stepValues', 'id', 'disabled'],
		invalidText: 'The property is mandatory',
	},
	{
		id: 'a51dc45b-8fc5-4d98-93f2-c4326d5aeb4c',
		validate(val, validationData) {
			if (validationData?.disabled) {
				return true;
			}
			return !!val?.term;
		},
		mandatory: true,
		nested: true,
		validationData: ['stepValues', 'id', 'disabled'],
		invalidText: 'The property is mandatory',
	},
	// {
	// 	id: '66531c4d-909d-4c0e-909e-dbdba2e27140',
	// 	validate(val, validationData) {
	// 		if (validationData?.disabled) {
	// 			return true;
	// 		}
	// 		return !!val?.term;
	// 	},
	// 	mandatory: true,
	// 	nested: true,
	// 	validationData: ['stepValues', 'id', 'disabled'],
	// 	invalidText: 'The property is mandatory',
	// },
	{
		id: '536238f6-d1db-4186-96fb-8d1512b59fa6',
		mandatory: true,
		nested: true,
		invalidText: 'Treatment name already exists',
	},
	{
		id: '66531c4d-909d-4c0e-909e-dbdba2e27140',
		mandatory: true,
		nested: true,
		invalidText: 'This property is mandatory',
	},
	{
		id: '5051d514-70aa-47e3-b92e-933cd9cf8665',
		validate(val) {
			return !!(val || val === 0);
		},
		mandatory: true,
		nested: true,
		validationData: ['stepValues', 'id', 'disabled'],
		invalidText: 'The property is mandatory',
	},
	{
		id: 'b5fec683-8459-4e5c-b33f-a24b709a9150',
		validate(val) {
			return !!val?.term;
		},
		mandatory: true,
		nested: true,
		validationData: ['stepValues', 'id', 'disabled'],
		invalidText: 'The property is mandatory',
	},
	{
		id: '94e3bdcc-89f3-4955-9aec-0318a28ac049',
		validate(val) {
			return !!val;
		},
		mandatory: true,
		nested: true,
		validationData: ['stepValues', 'id', 'disabled'],
		invalidText: 'The property is mandatory',
	},
	{
		id: '32a74d97-68b9-49d0-a8b0-3ecf521f3adc',
		validate(val, validationData) {
			if (!val?.term) {
				this.invalidText = 'The property is mandatory';
				return false;
			} if (val?.term === 'Yes') {
				const { validationContextValue, compositeId, id } = validationData;
				const helperData = { ...validationContextValue.validationHelper };
				const thisHelper = helperData[this.helperTarget] || new Map();

				const experimentId = compositeId.split('_')[1];
				const experimentData = thisHelper.get(experimentId) || new Map();

				let valid = true;
				experimentData.forEach((rowVal, rowKey) => {
					if (id !== rowKey) {
						if (rowVal) {
							this.invalidText = 'Only one practice should be declared as the control';
							valid = false;
						}
					}
				});
				return valid;
			}
			return true;
		},
		helperTarget: 'rotationControl',
		editValidationHelper(stepValues, validationData) {
			const { validationContextValue, compositeId, id } = validationData;
			const helperData = { ...validationContextValue.validationHelper };
			const thisHelper = helperData[this.helperTarget] || new Map();

			const experimentId = compositeId.split('_')[1];
			const experimentData = thisHelper.get(experimentId) || new Map();

			const isControl = stepValues.get(id).get('32a74d97-68b9-49d0-a8b0-3ecf521f3adc')?.value?.term;
			if (isControl === 'Yes') {
				experimentData.set(id, true);
			} else {
				experimentData.set(id, false);
			}
			thisHelper.set(experimentId, experimentData);
			helperData[this.helperTarget] = thisHelper;
			validationContextValue.setValidationHelper(helperData);
		},
		mandatory: true,
		nested: true,
		validationData: ['stepValues', 'compositeId', 'id'],
		invalidText: 'The property is mandatory',
	},
];

export default validationArray;
