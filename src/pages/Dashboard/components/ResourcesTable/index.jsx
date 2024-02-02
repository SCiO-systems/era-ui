import React, { useState, useEffect, useContext, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode } from 'primereact/api';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslate } from '@tolgee/react';
import { Tooltip } from 'primereact/tooltip';
import { Dropdown } from 'primereact/dropdown';
import { Actions } from '../../../../reducer/actions';
import UserService from '../../../../services/httpService/userService';
import SubmissionService from '../../../../services/httpService/submissionService';
import './styles.css';
import { translate } from '../../../../utils';
import { HelperContext } from '../../../../context';

const ResourcesTable = () => {
	const { t } = useTranslate();
	const navigate = useNavigate();

	const dispatch = useDispatch();

	const userId = useSelector((state) => state.userId);
	const setSelectedOption = (payload) => dispatch({ type: Actions.SetSelectedOption, payload });
	const { helperContextValue } = useContext(HelperContext);

	const [filters, setFilters] = useState(null);
	const [globalFilterValue, setGlobalFilterValue] = useState('');
	const [submissions, setSubmissions] = useState([]);

	const fetched = useRef(false);

	useEffect(() => {
		if (fetched.current === false) {
			fetchSubmissions();
		}
		// eslint-disable-next-line consistent-return,no-return-assign
		return () => fetched.current = true;
	}, []);

	const fetchSubmissions = () => {
		UserService.getAllSubmissions(userId || '212')
			.then((res) => {
				if (res.errorMessage === 'Authorization failed') {
					console.log('Authorization failed');
				}
				setSubmissions(res);
			});

		setFilters({
			global: { value: null, matchMode: FilterMatchMode.CONTAINS },
			status: { value: null, matchMode: FilterMatchMode.EQUALS },
			studyTitle: { value: null, matchMode: FilterMatchMode.CONTAINS },
		});
		setGlobalFilterValue('');
	};

	const onGlobalFilterChange1 = (e) => {
		const { value } = e.target;
		// eslint-disable-next-line no-underscore-dangle
		const _filters1 = { ...filters };
		_filters1.global.value = value;

		setFilters(_filters1);
		setGlobalFilterValue(value);
	};

	const renderHeader = () => (
		<div className="p-d-flex p-jc-between">
			{/* <h4>My Resources</h4> */}
			<span className="p-input-icon-left">
				<i className="pi pi-search" />
				<InputText value={globalFilterValue} onChange={onGlobalFilterChange1} placeholder={translate(t, 'Keyword Search')} />
			</span>
		</div>
	);

	const nameTemplate = (data) => (
		<div>
			{data.studyTitle}
		</div>
	);

	const nameFilterTemplate = (options) => {
		return (
			<InputText
				value={options.value}
				onChange={(e) => {
					options.filterCallback(e.target.value);
				}}
				placeholder={translate(t, 'Search by title')}
				className="p-column-filter"
			/>
		);
	};

	const statusTemplate = (data) => {
		let classType = '';
		switch (data.status) {
		case 'READY':
			classType = 'status-badge ready';
			break;
		case 'APPROVED':
			classType = 'status-badge approved';
			break;
		case 'REJECTED':
			classType = 'status-badge rejected';
			break;
		case 'SUBMITTED':
			classType = 'status-badge submitted';
			break;
		case 'DRAFT':
			classType = 'status-badge draft';
			break;
		case 'EDITED BY REVIEWER':
			classType = 'status-badge rev-edited';
			break;
		default:
			break;
		}

		return (
			<div className="cell p-col-12" id="status">
				<div className={classType}>
					{translate(t, data.status)}
				</div>
			</div>
		);
	};

	const statusFilterTemplate = (options) => {
		return <Dropdown className="filter-dropdown" value={options.value} options={['APPROVED', 'READY', 'REJECTED', 'SUBMITTED', 'DRAFT', 'EDITED BY REVIEWER']} onChange={(e) => options.filterCallback(e.value, options.index)} itemTemplate={statusItemTemplate} placeholder={translate(t, 'Select a status')} showClear />;
	};

	const statusItemTemplate = (option) => {
		let classType = '';
		if (option === 'READY') {
			classType = 'status-badge ready';
		} else if (option === 'APPROVED') {
			classType = 'status-badge approved';
		} else if (option === 'REJECTED') {
			classType = 'status-badge rejected';
		} else if (option === 'SUBMITTED') {
			classType = 'status-badge submitted';
		} else if (option === 'DRAFT') {
			classType = 'status-badge draft';
		} else if (option === 'EDITED BY REVIEWER') {
			classType = 'status-badge rev-edited';
		}
		return <p className={`${classType} filter-dropdown-option`}>{translate(t, option)}</p>;
	};

	const dateTemplate = (data) => {
		const date = new Date(data.updated_at);
		return (
			<div className="last-update">
				<p>{date.toLocaleDateString('en-UK')}</p>
				<p>{date.toLocaleTimeString()}</p>
			</div>
		);
	};

	const toolkitTemplate = (data) => {
		const editSubmission = () => {
			SubmissionService.getSubmission(data.submissionId)
				.then((response) => {
					const respData = response.data;
					const formData = JSON.stringify({ studyData: respData.studyData, helper: respData.helper, review: respData.review });
					const dataObject = JSON.parse(formData);
					helperContextValue.setEditing({ ...helperContextValue.editing, editMode: 'edit', editBy: 'user', submissionId: data.submissionId, reviewerId: dataObject.review?.reviewerId, hasChanges: false, submissionType: dataObject?.helper?.submissionType || 'crop' });
					// setReportData(globalDataContextValue, reviewContextValue, helperContextValue, dataObject);
					setSelectedOption('Bibliographic');
					navigate('/EditResource', { replace: true, state: { dataObject } });
				});
		};

		const submitSubmission = () => {
			SubmissionService.submitSubmission(data.submissionId)
				.then(() => {
					fetchSubmissions();
				});
		};

		const deleteSubmission = () => {
			SubmissionService.deleteSubmission(data.submissionId)
				.then(() => {
					fetchSubmissions();
				});
		};

		if (data.status !== 'READY' && data.status !== 'DRAFT' && data.status !== 'REJECTED') return null;
		return (
			<div className="toolkit p-grid">
				<Tooltip target={`.action-${data.key}`} />
				<div
					aria-label="Edit study"
					className={`p-col-4 action-${data.key}`}
					data-pr-tooltip={translate(t, 'Edit study')}
					role="button"
					tabIndex="0"
					onClick={() => {
						// if (reportState) {
						// 	confirmPopup({
						// 		target: e.currentTarget,
						// 		message: translate(t, 'Are you sure you want to open this study for editing? Any unsaved data will be deleted.'),
						// 		icon: 'pi pi-info-circle',
						// 		acceptClassName: 'p-button-danger',
						// 		accept: () => editSubmission(),
						// 		reject: () => {},
						// 		acceptLabel: translate(t, 'Yes'),
						// 		rejectLabel: translate(t, 'No'),
						// 	});
						// } else {
						editSubmission();
					}}
				>
					<i className="fas fa-pen" id="edit" />
				</div>
				<div
					aria-label="Submit study"
					className={`p-col-4 action-${data.key} ${data.status === 'REJECTED' || data.status === 'DRAFT' ? 'p-disabled' : null}`}
					data-pr-tooltip={translate(t, 'Submit study')}
					role="button"
					tabIndex="0"
					onClick={(e) => {
						confirmPopup({
							target: e.currentTarget,
							message: translate(t, 'Are you sure you want to submit this study?'),
							icon: 'pi pi-info-circle',
							acceptClassName: 'p-button-danger',
							accept: () => submitSubmission(),
							reject: () => {},
							acceptLabel: translate(t, 'Yes'),
							rejectLabel: translate(t, 'No'),
						});
					}}
				>
					<i className="fas fa-upload" id="submit" />
				</div>
				<div
					aria-label="Delete study"
					className={`p-col-4 action-${data.key}`}
					data-pr-tooltip={translate(t, 'Delete study')}
					role="button"
					tabIndex="0"
					onClick={(e) => {
						confirmPopup({
							target: e.currentTarget,
							message: translate(t, 'Are you sure you want to delete this study?'),
							icon: 'pi pi-info-circle',
							acceptClassName: 'p-button-danger',
							accept: () => deleteSubmission(),
							reject: () => {},
							acceptLabel: translate(t, 'Yes'),
							rejectLabel: translate(t, 'No'),
						});
					}}
				>
					<i className="fas fa-trash" id="delete" />
				</div>
			</div>
		);
	};

	if (!submissions || !submissions.length) return null;

	return (
		<div className="table resources">
			<ConfirmPopup />
			<DataTable
				value={submissions}
				header={renderHeader}
				showGridlines
				paginator
				rows={20}
				rowsPerPageOptions={[20, 50, 100]}
				paginatorLeft
				paginatorRight
				filters={filters}
				globalFilterFields={['studyTitle', 'updated_at', 'status']}
				filterDisplay="menu"
			>
				<Column
					field="studyTitle"
					header={translate(t, 'Study Title')}
					sortable
					body={(data) => nameTemplate(data)}
					filterElement={nameFilterTemplate}
					filter
					showFilterMatchModes={false}
					style={{ width: '60%' }}
				/>
				<Column
					field="status"
					header={translate(t, 'Status')}
					sortable
					body={(data) => statusTemplate(data)}
					filter
					filterElement={statusFilterTemplate}
					showFilterMatchModes={false}
					style={{ width: '15%' }}
				/>
				<Column
					field="updated_at"
					sortField="updated_at"
					header={translate(t, 'Last Update')}
					sortable
					body={(data) => dateTemplate(data)}
					style={{ width: '15%' }}
				/>
				<Column field="toolkit" header={translate(t, 'Actions')} body={(data) => toolkitTemplate(data)} headerClassName="actions-header" style={{ width: '10%' }} />
			</DataTable>
		</div>
	);
};

export default ResourcesTable;
