import React, { useContext, useEffect, useMemo, useState } from 'react';
import './styles.css';
import { useTranslate } from '@tolgee/react';
import { useSelector } from 'react-redux';
import { ProgressSpinner } from 'primereact/progressspinner';
import { makeValueObject, translate } from '../../../../../../utils';
import FieldInformation from '../../../../../FieldInformation';
import SubmissionService from '../../../../../../services/httpService/submissionService';
import { HelperContext } from '../../../../../../context';
import validationArray from '../../../../../../pages/EditResource/validationArray';

const Uploader = (props) => {
	const { stepValues, setStepValues, configuration } = props;
	const { t } = useTranslate();
	const userId = useSelector((state) => state.userId);
	const { helperContextValue } = useContext(HelperContext);
	const [selectedFile, setSelectedFile] = useState();
	const [isSelected, setIsSelected] = useState(false);
	const [isValid, setIsValid] = useState(true);
	const [isSubmitted, setIsSubmitted] = useState('');

	const validator = useMemo(() => {
		return validationArray?.find((field) => field.id === configuration.id);
	}, [validationArray]);

	useEffect(() => {
		if (!selectedFile && stepValues?.size > 0) {
			const temp = stepValues.get(configuration.id);
			if (temp?.value) {
				setIsSelected(temp.value);
				setIsSubmitted('complete');
			}
		}
	}, [stepValues]);

	useEffect(() => {
		if (!selectedFile) return;
		SubmissionService.uploadPdf(selectedFile, userId, helperContextValue.editing.submissionId)
			.then(() => {
				const temp = new Map(stepValues);
				temp.set(configuration.id, makeValueObject(isSelected));
				setStepValues(temp);
				setIsSubmitted('complete');
			});
	}, [selectedFile]);

	const handleUpload = (event) => {
		if (event.target.files.length > 0) {
			const file = event.target.files[0];
			const result = validator.validate(file);
			if (result) {
				setIsSubmitted('loading');
				setSelectedFile(event.target.files[0]);
				setIsSelected(event.target.files[0].name);
				setIsValid(true);
			} else {
				setSelectedFile(null);
				setIsSelected(null);
				setIsValid(false);
			}
		} else {
			setSelectedFile(null);
			setIsSelected(null);
		}
	};

	return (
		<div className="field">
			<div className="p-inputgroup">
				<div className={`uploader ${isValid ? 'valid' : 'invalid'} ${isSubmitted === 'complete' ? 'submitted' : null} ${isSubmitted === 'loading' ? 'loading' : null}`}>
					<p>{translate(t, configuration.label)}</p>
					<label className="custom-file-upload">
						<input type="file" onChange={handleUpload} />
						<i className="fa-solid fa-file-pdf" />
						{isSelected ? (
							<p className="file-name">{isSelected}</p>
						)
							: null}
						{isValid ? null
							: <p className="error-message">{translate(t, 'File must be in PDF format.')}</p>}
					</label>
					{isSubmitted === 'loading' ? <ProgressSpinner className="status progress" strokeWidth="5" /> : null}
					{isSubmitted === 'complete' ? <i className="status fa-solid fa-check" /> : null}
				</div>
				<FieldInformation configuration={configuration} />
			</div>
		</div>
	);
};

export default Uploader;
