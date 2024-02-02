/* eslint-disable import/no-cycle */
import makeKey from './makeKey';
import translate from './translate';
import saveToMap from './terms/saveToMap';
import createId from './createId';
import replacer from './types/replacer';
import reviver from './types/reviver';
import clearActiveReport from './study/clearActiveReport';
import mapToArray from './types/mapToArray';
import setReportData from './study/setReportData';
import updateCustomTerms from './terms/updateCustomTerms';
import makeValueObject from './types/makeValueObject';
import makeStudyJson from './study/makeStudyJson';
import performLockedAction from './terms/lockedEntities';
import { replaceValue, replaceAll } from './components/managementPracticesCopy';
import fetchVocabularies from './study/fetchVocabularies';
import genInputTableColumns from './components/genInputTableColumns';
import initValidationStatus from './validation/initValidationStatus';
import validateValue from './validation/validateValue';
import checkValidationStatus from './validation/checkValidationStatus';
import makeValidationData from './validation/makeValidationData';
import makeValidationId from './validation/makeValidationId';
import validateInputTableFields from './validation/validateInputTableFields';
import mapToObject from './types/mapToObject';
import objectToMap from './types/ObjectToMap';

export {
	makeKey,
	translate,
	saveToMap,
	createId,
	replacer,
	reviver,
	clearActiveReport,
	mapToArray,
	setReportData,
	updateCustomTerms,
	makeValueObject,
	makeStudyJson,
	replaceValue,
	replaceAll,
	performLockedAction,
	fetchVocabularies,
	genInputTableColumns,
	initValidationStatus,
	validateValue,
	checkValidationStatus,
	makeValidationData,
	makeValidationId,
	validateInputTableFields,
	mapToObject,
	objectToMap,
};
