import React, { useContext, useState } from 'react';
import { Button } from 'primereact/button';
import './styles.css';
import { Dialog } from 'primereact/dialog';
import { useTranslate } from '@tolgee/react';
import { useDispatch, useSelector } from 'react-redux';
import { translate, makeStudyJson, checkValidationStatus } from '../../../../utils';
import { Actions } from '../../../../reducer/actions';
import SubmissionService from '../../../../services/httpService/submissionService';
import { ReviewContext, GlobalDataContext, HelperContext, ValidationContext } from '../../../../context';
import { Divider } from '../../../../components/Field/components';

const NavigationMenu = (props) => {
	const { t } = useTranslate();

	const { globalDataContextValue } = useContext(GlobalDataContext);
	const { reviewContextValue } = useContext(ReviewContext);
	const { helperContextValue } = useContext(HelperContext);
	const { validationContextValue } = useContext(ValidationContext);

	const { setResponse } = props;

	const dispatch = useDispatch();

	const userId = useSelector((state) => state.userId);

	const setSelectedOption = (payload) => dispatch({ type: Actions.SetSelectedOption, payload });

	// const setReportState = (payload) => dispatch({ type: Actions.SetReportState, payload });

	const selectedOption = useSelector((state) => state.selectedOption);

	const [toggled, setToggled] = useState(true);

	const [toggleSubmitDialog, setToggleSubmitDialog] = useState(false);

	const options = [
		{
			icon: 'fa-solid fa-file-pen',
			text: 'Bibliographic',
		},
		{
			icon: 'fa-solid fa-file-pen',
			text: 'Sites',
		},
		{
			icon: 'fa-solid fa-file-pen',
			text: 'Time',
		},
		{
			icon: 'fa-solid fa-file-pen',
			text: 'Experiments',
		},
	];

	const changeWidth = () => {
		const menu = document.getElementById('side-menu');
		const page = document.getElementById('step-container');
		if (menu) {
			if (toggled) {
				menu.style.width = '0px';
				page.style.width = '100%';
				setToggled(false);
			} else {
				menu.style.width = '200px';
				page.style.width = 'calc(100% - 200px)';
				setToggled(true);
			}
		}
	};

	const submitForms = () => {
		const json = makeStudyJson(globalDataContextValue, reviewContextValue, helperContextValue);
		SubmissionService.editSubmission(json, userId || '212', helperContextValue.editing, checkValidationStatus(validationContextValue))
			.then((res) => {
				setResponse(res.data.result);
			});

		// setReportState(false);
		// clearActiveReport(globalDataContextValue, reviewContextValue, helperContextValue);
	};

	const renderDialogFooter = () => {
		return (
			<div>
				<Button
					icon="fa-duotone fa-file-arrow-up"
					label={translate(t, 'Save')}
					onClick={() => {
						setToggleSubmitDialog(false);
						helperContextValue.setEditing({ ...helperContextValue.editing, hasChanges: false });
						submitForms();
					}}
				/>
				<Button icon="fa-light fa-xmark" label={translate(t, 'Cancel')} onClick={() => setToggleSubmitDialog(false)} />
			</div>
		);
	};

	const renderOptions = () => {
		// if (helperContextValue.editing.submissionType === 'crop') {
		//
		// }
		if (helperContextValue.editing.editBy === 'reviewer' || helperContextValue.editing.reviewerId) {
			options.push({
				divider: true,
			});
			options.push({
				icon: 'fa-solid fa-file-pen',
				text: 'Review',
			});
		}
		return options.map((item) => {
			if (item.divider) {
				return <Divider configuration={{ horizontal: true }} />;
			} 
			return (
				<div
					className="option"
					role="button"
					tabIndex="0"
					onClick={() => {
						setSelectedOption(item.text);
					}}
					style={toggled ? { opacity: 1, zIndex: 1 } : { opacity: 0, zIndex: -1 }}
				>
					<i className={item.icon} style={selectedOption === item.text ? { color: '#f8c626' } : {}} />
					<p style={selectedOption === item.text ? { color: '#f8c626' } : {}}>{translate(t, item.text)}</p>
				</div>
			);
		}
		);
		// if (toggled) {
		// 	return options.map((item) => (
		// 		<div
		// 			className="option"
		// 			role="button"
		// 			tabIndex="0"
		// 			onClick={() => {
		// 				setNavigatingFrom(selectedOption);
		// 				setSelectedOption(item.text);
		// 			}}
		// 			style={toggled ? { opacity: 1 } : { opacity: 0 }}
		// 		>
		// 			<i className={item.icon} style={selectedOption === item.text ? { color: '#00A4D3' } : {}} />
		// 			<p style={selectedOption === item.text ? { color: '#00A4D3' } : {}}>{translate(t, item.text)}</p>
		// 		</div>
		// 	));
		// }
		// return null;
	};

	return (
		<div className="navigation-menu" id="side-menu">
			<Button id="toggle" icon={toggled ? 'fa-solid fa-angle-left' : 'fa-solid fa-angle-right'} onClick={() => changeWidth()} />
			<div className="options">
				{renderOptions()}
				<Button id="submit" disabled={helperContextValue.editing.status === 'APPROVED'} icon="fa-duotone fa-file-arrow-up" label={translate(t, 'Save')} onClick={() => setToggleSubmitDialog(true)} style={toggled ? { opacity: 1 } : { opacity: 0 }} />
			</div>
			<Dialog header={translate(t, 'Save')} modal visible={toggleSubmitDialog} style={{ width: '50vw' }} footer={renderDialogFooter()} onHide={() => setToggleSubmitDialog(false)}>
				<p>{translate(t, 'Are you sure you want to submit these forms?')}</p>
			</Dialog>
		</div>
	);
};

export default NavigationMenu;
