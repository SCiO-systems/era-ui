const clearActiveReport = (globalContext, ReviewContext, helperContext, validationContext) => {
	globalContext.setBibliographicData(new Map());
	globalContext.setSitesData(new Map());
	// globalContext.setPlantingData(new Map());
	// globalContext.setHarvestData(new Map());
	globalContext.setTimeData(new Map());
	globalContext.setExperimentsData(new Map());
	globalContext.setEnterData(new Map());
	ReviewContext.setCustomTerms(new Map());
	ReviewContext.setApprovedTerms(new Map());
	ReviewContext.setRejectedTerms(new Map());
	ReviewContext.setReviewerFields(new Map());
	helperContext.setTimeVocabs({});
	helperContext.setHelperState({});
	helperContext.setLockedEntities({ treatmentSites: [], timeSites: [], timePeriods: [], timePairs: [] });
	validationContext.setValidationStatus(new Map());
};

export default clearActiveReport;
