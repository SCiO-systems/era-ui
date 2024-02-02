import React, { useContext, useEffect, useMemo, useState } from 'react';
import './styles.css';
import { Button } from 'primereact/button';
import { HelperContext, ReviewContext, VocabulariesContext } from '../../../../context';
import Field from '../../../../components/Field';

const ReviewTerms = () => {
	const { reviewContextValue } = useContext(ReviewContext);
	const { customTerms, setCustomTerms, approvedTerms, setApprovedTerms, rejectedTerms, setRejectedTerms, reviewerFields, setReviewerFields } = reviewContextValue;
	const { helperContextValue } = useContext(HelperContext);
	const { vocabulariesContextValue } = useContext(VocabulariesContext);
	const [localFields, setLocalFields] = useState(new Map());

	useEffect(() => {
		if (localFields.size === 0 && reviewerFields instanceof Map && reviewerFields.size > 0) {
			setLocalFields(reviewerFields);
		} else if (localFields.size === 0) {
			const temp = new Map();
			temp.set('4eacfe8e-b717-4187-b340-e45311504b4f', null);
			setLocalFields(temp);
		}
	}, []);

	useEffect(() => {
		if (localFields.size > 0) {
			setReviewerFields(new Map(localFields));
		}
	}, [localFields]);

	const isDisabled = () => {
		if (helperContextValue.editing.editBy === 'user') {
			return true;
		} if (helperContextValue.editing.editBy === 'review') {
			return false;
		}
		return false;
	};

	const renderFields = () => {
		const fieldsArray = [];
		customTerms.forEach((field, key) => {
			fieldsArray.push(
				<div className="review-field">
					<Button
						id="approve"
						icon="fa-regular fa-check"
						className={`approve-button ${approvedTerms.has(key) ? 'filled' : null}`}
						onClick={() => {
							const temp = new Map(approvedTerms);
							const vocabObject = vocabulariesContextValue.fields?.find((f) => f.uuid === field.configuration.id);
							temp.set(key, { term: field.value.term, parentValue: field.parentValue, vocabulary: vocabObject?.vocabulary });
							setApprovedTerms(temp);

							const temp2 = new Map(rejectedTerms);
							temp2.delete(key);
							setRejectedTerms(temp2);
						}}
						disabled={isDisabled()}
					/>
					<Button
						id="reject"
						icon="fa-solid fa-xmark"
						className={`reject-button ${rejectedTerms.has(key) ? 'filled' : null}`}
						onClick={() => {
							const temp = new Map(rejectedTerms);
							temp.set(key, { term: field.value.term, parentValue: field.parentValue, vocabulary: field.vocabulary });
							setRejectedTerms(temp);

							const temp2 = new Map(approvedTerms);
							temp2.delete(key);
							setApprovedTerms(temp2);
						}
						}
						disabled={isDisabled()}
					/>
					<Field
						configuration={field.configuration}
						stepValues={customTerms}
						disabled={(!rejectedTerms.has(key)) || field.configuration.customTermEditMode === 'manual'}
						setStepValues={setCustomTerms}
						customTerm={key}
						id={key}
					/>
				</div>
			);
		});
		return fieldsArray;
	};

	return (
		<div className="review-terms">
			<div className="card">
				<Field configuration={{
					type: 'header',
					text: 'Reviewer Feedback',
					category: 'p',
					size: '19px',
					weight: '900',
				}}
				/>
				<Field
					configuration={{
						id: '4eacfe8e-b717-4187-b340-e45311504b4f',
						type: 'text area',
						label: 'General Comments',
						fieldInformation: ' ',
						valid: false,
						data: true,
					}}
					stepValues={localFields}
					setStepValues={setLocalFields}
					disabled={isDisabled()}
				/>
				{reviewContextValue.customTerms?.size > 0 ? (
					<Field configuration={{
						type: 'header',
						text: 'Custom Terms',
						category: 'p',
						size: '19px',
						weight: '900',
					}}
					/>
				) : null}
				{ renderFields() }
			</div>
		</div>
	);
};

export default ReviewTerms;
