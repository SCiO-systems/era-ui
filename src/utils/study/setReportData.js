import ObjectToMap from '../types/ObjectToMap';
import migrateTimeVocabs from './migrateTimeVocabs';

const setReportData = (globalContext, ReviewContext, helperContextValue, validationContextValue, dataObject) => {
	globalContext.setBibliographicData(ObjectToMap(dataObject.studyData.bibliographic));
	globalContext.setSitesData(ObjectToMap(dataObject.studyData.sites));
	globalContext.setTimeData(ObjectToMap(dataObject.studyData.time));
	globalContext.setExperimentsData(ObjectToMap(dataObject.studyData.experiments));

	ReviewContext.setCustomTerms(ObjectToMap(dataObject.review?.customTerms));
	ReviewContext.setApprovedTerms(ObjectToMap(dataObject.review?.approvedTerms));
	ReviewContext.setRejectedTerms(ObjectToMap(dataObject.review?.rejectedTerms));
	ReviewContext.setReviewerFields(ObjectToMap(dataObject.review?.reviewerFields));
	helperContextValue.setTimeVocabs(migrateTimeVocabs(dataObject.helper?.timeVocabs));
	helperContextValue.setLockedEntities(dataObject.helper?.lockedEntities);
	validationContextValue.setValidationStatus(dataObject.helper?.validationStatus);
};

export default setReportData;
