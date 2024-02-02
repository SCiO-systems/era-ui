const cropIds = {
	sites: '255fb141-ee7b-4571-bc55-b75a00f3e899',
	practiceData: 'b7dde218-8a82-484f-812d-8a5c49682462',
};

const livestockIds = {
	sites: '4f1cbd0c-92b7-44d1-b0d9-a844980bf061',
	practiceData: '7327aa17-85fc-40e8-a02f-46c6cbbcf88d',
};

const replaceAll = (stepValues, setStepValues, setNoCopyDialogVisible, practiceValue, practiceId, treatmentSites, configuration) => {
	const ids = configuration === 'crop' ? cropIds : livestockIds;
	const temp = new Map(stepValues);
	const newTreatments = new Map();
	let strictCopy = false;

	if (practiceId === '84d46444-a7fd-41c7-9f69-2edad9ed3984' || practiceId === '6ec6d9e3-8bca-4166-98bd-b8321e209280') {
		strictCopy = true;
	}

	temp.forEach((targetTreatment, targetTreatmentKey) => {
		let allowCopy = false;
		if (strictCopy) {
			const targetSites = targetTreatment.get(ids.sites).value;
			const extraSites = targetSites.filter((s1) => !(treatmentSites.find((s2) => s1.id === s2.id)));
			if (extraSites.length === 0) {
				allowCopy = true;
			}
		} else {
			allowCopy = true;
		}

		if (allowCopy) {
			const cropRows = targetTreatment.get(ids.practiceData);
			const newCropRows = new Map();
			cropRows.forEach((crop, id) => {
				const newCrop = new Map(crop);
				newCrop.set(practiceId, practiceValue);
				newCropRows.set(id, newCrop);
			});
			targetTreatment.set(ids.practiceData, newCropRows);
		}

		newTreatments.set(targetTreatmentKey, targetTreatment);
	});

	setStepValues(newTreatments);
};

const replaceValue = (stepValues, setStepValues, setNoCopyDialogVisible, treatmentKey, practiceId, practiceValue, cropKey, treatmentSites, configuration) => {
	const ids = configuration === 'crop' ? cropIds : livestockIds;
	const temp = new Map(stepValues);
	const targetTreatment = temp.get(treatmentKey);
	let allowCopy = false;
	if (practiceId === '84d46444-a7fd-41c7-9f69-2edad9ed3984' || practiceId === '6ec6d9e3-8bca-4166-98bd-b8321e209280') {
		const targetSites = targetTreatment.get(ids.sites).value;
		const extraSites = targetSites.filter((s1) => !(treatmentSites.find((s2) => s1.id === s2.id)));
		if (extraSites.length === 0) {
			allowCopy = true;
		}
	} else {
		allowCopy = true;
	}
	if (allowCopy) {
		const cropRows = targetTreatment.get(ids.practiceData);
		const targetCrop = cropRows.get(cropKey);
		targetCrop.set(practiceId, practiceValue);
		cropRows.set(cropKey, targetCrop);
		targetTreatment.set(ids.practiceData, cropRows);
		temp.set(treatmentKey, targetTreatment);
		setStepValues(temp);
	} else {
		setNoCopyDialogVisible(true);
	}
};

export { replaceAll, replaceValue };
