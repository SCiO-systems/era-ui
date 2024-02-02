// eslint-disable-next-line import/no-cycle
import { mapToObject } from '../index';

const makeStudyJson = (globalDataContextValue, reviewContextValue, helperContextValue) => {
	// extract pdf
	const bibData = globalDataContextValue.bibliographicData;

	// extract study title
	let studyTitle;
	if (bibData.has('1b8e2580-1db4-4645-b17c-de890d5483b6')) {
		studyTitle = bibData.get('1b8e2580-1db4-4645-b17c-de890d5483b6').value || '';
	}
	// const formData = {
	// 	studyData: {
	// 		bibliographic: globalDataContextValue.bibliographicData,
	// 		sites: globalDataContextValue.sitesData,
	// 		time: globalDataContextValue.timeData,
	// 		experiments: globalDataContextValue.experimentsData,
	// 		data: globalDataContextValue.enterData,
	// 	},
	// 	review: {
	// 		customTerms: reviewContextValue?.customTerms,
	// 		approvedTerms: reviewContextValue?.approvedTerms,
	// 		rejectedTerms: reviewContextValue?.rejectedTerms,
	// 		reviewerFields: reviewContextValue?.reviewerFields,
	// 	},
	// 	helper: {
	// 		timeVocabs: helperContextValue.timeVocabs,
	// 		lockedEntities: helperContextValue.lockedEntities,
	// 		submissionType: helperContextValue.editing.submissionType,
	// 		validationStatus: helperContextValue.validationStatus,
	// 	},
	// };

	const formData1 = {
		studyData: {
			bibliographic: mapToObject(globalDataContextValue.bibliographicData),
			sites: mapToObject(globalDataContextValue.sitesData),
			time: mapToObject(globalDataContextValue.timeData),
			experiments: mapToObject(globalDataContextValue.experimentsData),
			data: mapToObject(globalDataContextValue.enterData),
		},
		review: {
			customTerms: mapToObject(reviewContextValue?.customTerms),
			approvedTerms: mapToObject(reviewContextValue?.approvedTerms),
			rejectedTerms: mapToObject(reviewContextValue?.rejectedTerms),
			reviewerFields: mapToObject(reviewContextValue?.reviewerFields),
		},
		helper: {
			timeVocabs: helperContextValue.timeVocabs,
			lockedEntities: helperContextValue.lockedEntities,
			submissionType: helperContextValue.editing.submissionType,
			validationStatus: helperContextValue.validationStatus,
		},
	};

	// console.log(globalDataContextValue.bibliographicData);
	// testMap(globalDataContextValue.bibliographicData);
	// testMap(globalDataContextValue.sitesData);
	// testMap(globalDataContextValue.timeData);
	// testMap(globalDataContextValue.experimentsData);
	// testMap(globalDataContextValue.enterData);
	return { formData: JSON.stringify(formData1), studyTitle };
};

export default makeStudyJson;
