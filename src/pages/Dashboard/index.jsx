/* eslint-disable max-len */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { TabView, TabPanel } from 'primereact/tabview';
import { useTranslate } from '@tolgee/react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Actions } from '../../reducer/actions';
import { ResourcesTable, AdminTable } from './components';
import './styles.css';
import { translate, reviver } from '../../utils';
import { HelperContext } from '../../context';
import SubmissionService from '../../services/httpService/submissionService';

const Dashboard = () => {
	const { t } = useTranslate();

	const navigate = useNavigate();

	const dispatch = useDispatch();

	const accessToken = useSelector((state) => state.accessToken);

	const role = useSelector((state) => state.role);

	const setCurrentPage = (payload) => dispatch({ type: Actions.SetCurrentPage, payload });
	const setSelectedOption = (payload) => dispatch({ type: Actions.SetSelectedOption, payload });
	const userId = useSelector((state) => state.userId);

	const buttonNew = useRef(null);

	const [cachedSubmission, setCachedSubmission] = useState(localStorage.getItem('cachedSubmissionId'));
	const [dialogButtonsDisabled, setDialogButtonsDisabled] = useState(false);

	const { helperContextValue } = useContext(HelperContext);

	useEffect(
		() => {
			if (!accessToken) {
				navigate('/Home');
			}
		}, [accessToken]
	);

	// useEffect(() => {
	// 	const cachedStudy = localStorage.getItem('studyCache');
	// }, []);

	const goToNewResource = (submissionType) => {
		setSelectedOption('Bibliographic');
		setCurrentPage('EditResource');
		// clearActiveReport(globalDataContextValue, reviewContextValue, helperContextValue);
		SubmissionService.addNewSubmission(userId || '212')
			.then((res) => {
				helperContextValue.setEditing({
					...helperContextValue.editing,
					editMode: 'edit',
					editBy: 'user',
					submissionId: res.data.submissionId,
					hasChanges: false,
					submissionType,
				});
				navigate('/EditResource');
			});
	};

	const cachedFooter = () => {
		return (
			<div>
				<Button
					className="p-button-text"
					label={translate(t, 'Delete Unsaved Data')}
					icon="pi pi-times"
					onClick={() => {
						localStorage.setItem('cachedSubmissionId', '');
						localStorage.setItem('submissionContentCache', '');
						setCachedSubmission('');
					}}
					disabled={dialogButtonsDisabled}
				/>
				<Button
					label={translate(t, 'Continue Editing')}
					icon="pi pi-check"
					disabled={dialogButtonsDisabled}
					onClick={() => {
						setDialogButtonsDisabled(true);
						const dataObject = JSON.parse(JSON.parse(localStorage.getItem('submissionContentCache'), reviver), reviver);
						SubmissionService.checkSubmission(cachedSubmission)
							.then((res) => {
								if (res.data.result === 'failed') {
									SubmissionService.addNewSubmission(userId || '212')
										.then((res2) => {
											helperContextValue.setEditing({
												...helperContextValue.editing,
												editMode: 'edit',
												editBy: 'user',
												submissionId: res2.data.submissionId,
												submissionType: dataObject?.helper?.submissionType || 'crop' });
										});
								} else {
									helperContextValue.setEditing({
										...helperContextValue.editing,
										editMode: 'edit',
										editBy: 'user',
										submissionId: cachedSubmission,
										submissionType: dataObject?.helper?.submissionType || 'crop' });
								}

								localStorage.setItem('cachedSubmissionId', '');
								localStorage.setItem('submissionContentCache', '');
								setCachedSubmission('');

								setSelectedOption('Bibliographic');
								setCurrentPage('EditResource');
								setDialogButtonsDisabled(false);
								navigate('/EditResource', { replace: true, state: { dataObject } });
							});
					}}
				/>
			</div>
		);
	};

	return (
		<div className="dashboard">
			<div className="cell p-col-12" id="header">
				<div className="header">
					<p>{translate(t, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit, vulputate eu pharetra nec, mattis ac neque. Duis vulputate commodo lectus, ac blandit elit tincidunt id. Sed rhoncus, tortor sed eleifend tristique, tortor mauris molestie elit, et lacinia ipsum quam nec dui. Quisque nec mauris sit amet elit iaculis pretium sit amet quis magna.', 'dashboard-body')}</p>
				</div>
			</div>
			<TabView
				activeIndex={helperContextValue.activeDashboard}
				onTabChange={(e) => {
					helperContextValue.setActiveDashboard(e.index);
				}}
			>
				<TabPanel header={translate(t, 'My Studies')}>
					<div className="create-new-container">
						<div
							ref={buttonNew}
							className="create-new crop"
							role="button"
							tabIndex="0"
							onClick={() => {
								goToNewResource('crop');
							}
							}
						>
							<h4>{translate(t, 'Add Crop Study')}
							</h4>
							<i className="far fa-plus-circle" />
						</div>
						<div
							ref={buttonNew}
							className="create-new livestock"
							role="button"
							tabIndex="0"
							onClick={() => {
								goToNewResource('livestock');
							}
							}
						>
							<h4>{translate(t, 'Add Livestock Study')}
							</h4>
							<i className="far fa-plus-circle" />
						</div>
						<Dialog
							className="cache-dialog"
							visible={cachedSubmission}
							onHide={() => setCachedSubmission('')}
							footer={cachedFooter}
							showHeader={false}
						>
							{translate(t, 'We have recovered unsaved study data from a previous session. Would you like to continue editing that study or delete the unsaved data?')}
						</Dialog>
					</div>
					<div className="cell p-col-12" id="table">
						<ResourcesTable />
					</div>
				</TabPanel>
				{role === 'Era-Admin'
					? 			(
						<TabPanel header={translate(t, 'Manage Studies')}>
							<div className="cell p-col-12" id="table">
								<AdminTable modal showheader={false} />
							</div>
						</TabPanel>
					)
					: null}
			</TabView>
		</div>
	);
};

export default Dashboard;
