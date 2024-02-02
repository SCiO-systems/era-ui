import { makeStudyJson } from '../index';

const saveToLocalStorage = (global, review, helper) => {
	if (helper.editing?.editMode === 'edit' && helper.editing?.hasChanges) {
		const study = makeStudyJson(global, review, helper);
		localStorage.setItem('submissionContentCache', JSON.stringify(study.formData));
		localStorage.setItem('cachedSubmissionId', helper.editing.submissionId);
	}
};

export default saveToLocalStorage;
