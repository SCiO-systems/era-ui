import React, { useState, useEffect, useContext, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode } from 'primereact/api';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslate } from '@tolgee/react';
import { useNavigate } from 'react-router-dom';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { Tooltip } from 'primereact/tooltip';
import { Dropdown } from 'primereact/dropdown';
import { translate, reviver } from '../../../../utils';
import { Actions } from '../../../../reducer/actions';
import AdministratorServices from '../../../../services/httpService/administratorServices';
import SubmissionService from '../../../../services/httpService/submissionService';
import { HelperContext } from '../../../../context';

const AdminTable = () => {
	const { t } = useTranslate();
	const navigate = useNavigate();

	const dispatch = useDispatch();
	const setSelectedOption = (payload) => dispatch({ type: Actions.SetSelectedOption, payload });

	const userId = useSelector((state) => state.userId);

	const [filters, setFilters] = useState(null);
	const [globalFilterValue, setGlobalFilterValue] = useState('');

	const [submissions, setSubmissions] = useState([]);

	const { helperContextValue } = useContext(HelperContext);

	const fetched = useRef(false);

	useEffect(() => {
		if (fetched.current === false) {
			fetchSubmissions();
		}
		// eslint-disable-next-line consistent-return,no-return-assign
		return () => fetched.current = true;
	}, []);

	const fetchSubmissions = () => {
		AdministratorServices.getAllSubmissions()
			.then((res) => {
				setSubmissions(res);
			});
		setFilters({
			global: { value: null, matchMode: FilterMatchMode.CONTAINS },
			status: { value: null, matchMode: FilterMatchMode.EQUALS },
			studyTitle: { value: null, matchMode: FilterMatchMode.CONTAINS },
			userName: { value: null, matchMode: FilterMatchMode.CONTAINS },
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
			{/* <h4>Manage Resources</h4> */}
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

	const userNameTemplate = (data) => (
		<div>
			{data.user?.userName}
		</div>
	);

	const userNameFilterTemplate = (options) => {
		return (
			<InputText
				value={options.value}
				onChange={(e) => {
					options.filterCallback(e.target.value);
				}}
				placeholder={translate(t, 'Search by user name')}
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
		case 'EDITED BY REVIEWER':
			classType = 'status-badge rev-edited';
			break;
		case 'REVIEWER DRAFT':
			classType = 'status-badge draft';
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
		return <Dropdown value={options.value} options={['APPROVED', 'READY', 'REJECTED', 'SUBMITTED', 'EDITED BY REVIEWER', 'REVIEWER DRAFT']} onChange={(e) => options.filterCallback(e.value, options.index)} itemTemplate={statusItemTemplate} placeholder={translate(t, 'Select a status')} className="filter-dropdown" showClear />;
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
		} else if (option === 'REVIEWER DRAFT') {
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
		const viewSubmission = () => {
			SubmissionService.getSubmission(data.submissionId)
				.then((response) => {
					const respData = response.data;
					const formData = JSON.stringify({ studyData: respData.studyData, helper: respData.helper, review: respData.review });
					const dataObject = JSON.parse(formData, reviver);
					helperContextValue.setEditing({ ...helperContextValue.editing, editMode: 'edit', status: data.status, editBy: 'reviewer', submissionId: data.submissionId, hasChanges: false, submissionType: dataObject?.helper?.submissionType || 'crop' });
					setSelectedOption('Review');
					navigate('/EditResource', { replace: true, state: { dataObject } });
				});
		};

		const approveSubmission = () => {
			SubmissionService.approveSubmission(data.submissionId, userId)
				.then(() => {
					fetchSubmissions();
				});
		};

		const rejectSubmission = () => {
			SubmissionService.rejectSubmission(data.submissionId, userId)
				.then(() => {
					fetchSubmissions();
				});
		};
		return (
			<div className="toolkit p-grid">
				<Tooltip target={`.action-${data.key}`} />
				<div
					aria-label="View study"
					className={`p-col-4 action-${data.key} ${data.status !== 'SUBMITTED' && data.status !== 'REVIEWER DRAFT' && data.status !== 'EDITED BY REVIEWER' && data.status !== 'APPROVED' ? 'p-disabled' : null}`}
					data-pr-tooltip={translate(t, 'View study')}
					role="button"
					tabIndex="0"
					onClick={() => viewSubmission()}
				>
					<i className="fa-duotone fa-newspaper" style={{ color: '#375a63', fontSize: '18px' }} />
				</div>
				<div
					aria-label="Approve study"
					className={`p-col-4 action-${data.key} ${data.status !== 'SUBMITTED' && data.status !== 'REVIEWER DRAFT' && data.status !== 'EDITED BY REVIEWER' ? 'p-disabled' : null}`}
					role="button"
					tabIndex="0"
					data-pr-tooltip={translate(t, 'Approve study')}
					onClick={(e) => {
						confirmPopup({
							target: e.currentTarget,
							message: translate(t, 'Are you sure you want to approve this submission?'),
							icon: 'pi pi-info-circle',
							acceptClassName: 'p-button-danger',
							accept: () => approveSubmission(),
							reject: () => {},
							acceptLabel: translate(t, 'Yes'),
							rejectLabel: translate(t, 'No'),
						});
					}}
				>
					<i className="fa-solid fa-check" style={{ color: 'green', fontSize: '18px' }} />
				</div>
				<div
					aria-label="Reject study"
					className={`p-col-4 action-${data.key} ${data.status !== 'SUBMITTED' && data.status !== 'REVIEWER DRAFT' && data.status !== 'EDITED BY REVIEWER' ? 'p-disabled' : null}`}
					data-pr-tooltip={translate(t, 'Reject study')}
					role="button"
					tabIndex="0"
					onClick={(e) => {
						confirmPopup({
							target: e.currentTarget,
							message: translate(t, 'Are you sure you want to reject this submission?'),
							icon: 'pi pi-info-circle',
							acceptClassName: 'p-button-danger',
							accept: () => rejectSubmission(),
							reject: () => {},
							acceptLabel: translate(t, 'Yes'),
							rejectLabel: translate(t, 'No'),
						});
					}}
				>
					<i className="fa-solid fa-xmark" style={{ color: 'red', fontSize: '18px' }} />
				</div>
			</div>
		);
	};

	if (!submissions.length) return null;

	return (
		<div className="table resources">
			<ConfirmPopup />
			<DataTable
				value={submissions}
				header={renderHeader}
				showGridlines
				// responsiveLayout="scroll"
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
					style={{ width: '35%' }}
				/>
				<Column
					field="userName"
					header={translate(t, 'Submitted By')}
					sortable
					body={(data) => userNameTemplate(data)}
					filterElement={userNameFilterTemplate}
					filter
					showFilterMatchModes={false}
					style={{ width: '25%' }}
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
				<Column field="date" sortField="updated_at" header={translate(t, 'Last Update')} sortable body={(data) => dateTemplate(data)} style={{ width: '15%' }} />
				<Column field="toolkit" header={translate(t, 'Actions')} body={(data) => toolkitTemplate(data)} headerClassName="actions-header" style={{ width: '10%' }} />
			</DataTable>
		</div>
	);
};

export default AdminTable;
