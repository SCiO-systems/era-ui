import React, { useState, useEffect, useRef, useContext, useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Toast } from 'primereact/toast';
import { useBeforeUnload, useLocation, useNavigate } from 'react-router-dom';
import { NavigationMenu,
	ReviewTerms,
	Bibliographic,
	Experiments,
	Sites,
	Time,
	ExperimentsLivestock } from './components';
import './styles.css';
import { HelperContext, GlobalDataContext, ReviewContext, VocabulariesContext, ValidationContext } from '../../context';
import { clearActiveReport, fetchVocabularies, initValidationStatus, makeStudyJson, setReportData } from '../../utils';

const EditResource = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const dataObject = useMemo(() => {
		const studyData = location.state?.dataObject;
		if (studyData) {
			return studyData;
		}
		return null;
	}, [location.state]);

	const { helperContextValue } = useContext(HelperContext);
	const [studyInitialized, setStudyInitialized] = useState(false);
	const [response, setResponse] = useState('');
	const selectedOption = useSelector((state) => state.selectedOption);
	const accessToken = useSelector((state) => state.accessToken);
	const toast = useRef(null);

	// region context definitions for ReviewContext, GlobalDataContext, VocabulariesContext
	const [customTerms, setCustomTerms] = useState();
	const [approvedTerms, setApprovedTerms] = useState(new Map());
	const [rejectedTerms, setRejectedTerms] = useState(new Map());
	const [reviewerFields, setReviewerFields] = useState(new Map());

	const reviewContextValue = useMemo(() => ({
		customTerms,
		setCustomTerms,
		approvedTerms,
		setApprovedTerms,
		rejectedTerms,
		setRejectedTerms,
		reviewerFields,
		setReviewerFields,
	}), [customTerms, approvedTerms, rejectedTerms, reviewerFields]);

	const [bibliographicData, setBibliographicData] = useState(new Map());
	const [sitesData, setSitesData] = useState(new Map());
	const [timeData, setTimeData] = useState(new Map());
	const [experimentsData, setExperimentsData] = useState(new Map());
	const [enterData, setEnterData] = useState(new Map());

	const globalDataContextValue = useMemo(() => ({
		bibliographicData,
		setBibliographicData,
		sitesData,
		setSitesData,
		timeData,
		setTimeData,
		experimentsData,
		setExperimentsData,
		enterData,
		setEnterData,
	}), [bibliographicData, sitesData, timeData, experimentsData, enterData]);

	const [validationStatus, setValidationStatus] = useState();
	const [validationHelper, setValidationHelper] = useState();

	const validationContextValue = useMemo(() => ({
		validationStatus,
		setValidationStatus,
		validationHelper,
		setValidationHelper,
	}), [validationStatus, validationHelper]);

	const [fields, setFields] = useState([]);
	const [vocabs, setVocabs] = useState([]);

	const vocabulariesContextValue = useMemo(() => ({
		fields,
		setFields,
		vocabs,
		setVocabs,
	}), [fields, vocabs]);

	// endregion

	useEffect(() => {
		if (!globalDataContextValue) return;
		if (!reviewContextValue) return;
		if (studyInitialized) return;
		if (dataObject && Object.keys(dataObject).length > 0) {
			setReportData(globalDataContextValue, reviewContextValue, helperContextValue, validationContextValue, dataObject);
		} else {
			clearActiveReport(globalDataContextValue, reviewContextValue, helperContextValue, validationContextValue);
			initValidationStatus(validationContextValue);
		}
		fetchVocabularies(vocabulariesContextValue);
		setStudyInitialized(true);
	}, [globalDataContextValue, reviewContextValue]);

	useEffect(() => {
		if (!helperContextValue.editing.hasChanges) {
			helperContextValue.setEditing({ ...helperContextValue.editing, hasChanges: true });
		}
	}, [globalDataContextValue]);

	// useEffect(() => {
	// 	console.log(globalDataContextValue);
	// }, [globalDataContextValue]);

	useBeforeUnload(
		useCallback(() => {
			if (helperContextValue.editing?.editMode === 'edit' && helperContextValue.editing?.hasChanges) {
				const study = makeStudyJson(globalDataContextValue, reviewContextValue, helperContextValue);
				localStorage.setItem('submissionContentCache', JSON.stringify(study.formData));
				localStorage.setItem('cachedSubmissionId', helperContextValue.editing.submissionId);
			}
		}, [globalDataContextValue, helperContextValue, reviewContextValue])
	);

	useEffect(
		() => {
			if (!accessToken) {
				navigate('/Home');
			}
			if (!helperContextValue.editing.submissionId) {
				navigate('/Dashboard');
			}
		}, [accessToken, helperContextValue.editing]
	);

	useEffect(
		() => {
			if (response === 'ok') {
				toast.current.show({ severity: 'success', summary: 'Success Message', detail: 'Submission saved', life: 2000 });
				setResponse('');
				// setTimeout(() => navigate('/Dashboard'), 3000);
			}
		}, [response]
	);

	const renderStep = () => {
		if (studyInitialized) {
			switch (selectedOption) {
			case 'Review':
				return <ReviewTerms />;
			case 'Bibliographic':
				return <Bibliographic />;
			case 'Experiments':
				if (helperContextValue.editing.submissionType === 'crop') {
					return <Experiments />;
				} if (helperContextValue.editing.submissionType === 'livestock') {
					return <ExperimentsLivestock />;
				}
				return null;
			case 'Sites':
				return <Sites />;
			case 'Time':
				return <Time />;
			default:
				return null;
			}
		}
		return null;
	};

	return (
		<GlobalDataContext.Provider
			value={{
				globalDataContextValue,
			}}
		>
			<ReviewContext.Provider
				value={{
					reviewContextValue,
				}}
			>
				<VocabulariesContext.Provider
					value={{
						vocabulariesContextValue,
					}}
				>
					<ValidationContext.Provider
						value={{
							validationContextValue,
						}}
					>
						<div className={`edit-resource ${helperContextValue.editing.submissionType}`} id="edit-page">
							<NavigationMenu setResponse={setResponse} />
							<div id="step-container">
								<Toast ref={toast} />
								{renderStep()}
							</div>
						</div>
					</ValidationContext.Provider>

				</VocabulariesContext.Provider>
			</ReviewContext.Provider>
		</GlobalDataContext.Provider>
	);
};

export default EditResource;
