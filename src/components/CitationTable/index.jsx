/* eslint-disable max-len,jsx-a11y/no-static-element-interactions,react/jsx-no-useless-fragment */
import React, { useState, useRef, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { useTranslate } from '@tolgee/react';
import { translate, createId } from '../../utils';
import Field from '../Field';
import './styles.css';

const CitationTable = (props) => {
	const { t } = useTranslate();

	const { configuration, stepValues, setStepValues } = props;

	const [citations, setCitations] = useState();
	const [selectedCitations, setSelectedCitations] = useState([]);
	const [selectedData, setSelectedData] = useState();

	const [deleteMultipleDialog, setDeleteMultipleDialog] = useState(false);
	const [createCitationDialog, setCreateCitationDialog] = useState(false);
	const [explanationDialog, setExplanationDialog] = useState(false);
	const [deleteItemDialog, setDeleteItemDialog] = useState(false);
	const [editItemDialog, setEditItemDialog] = useState(false);
	const [textField, setTextField] = useState('');

	useEffect(
		() => {
			if (stepValues.size > 0) {
				if (!(citations instanceof Array)) {
					const temp = stepValues.get(configuration.id);
					if (temp?.value) {
						const citationsArray = [...temp.value.get('3cc5b368-876b-41d5-bbbc-25886823906a')];
						setCitations(citationsArray);
					} else {
						const subMap = new Map();
						subMap.set(configuration.content[0].id, []);
						const newStep = new Map(stepValues);
						newStep.set(configuration.id, { ...temp, value: subMap });
						setStepValues(newStep);
					}
				}
			}
		}, [stepValues] // this dependency is because the initial stepValues is not loaded with the field information,
		// it's just an empty map. the useEffect catches the first time stepValues is actually set, then sets LocalFields but
		// then ignores all other subsequent changes (localFields size is not zero).
	);

	const dt = useRef(null);

	useEffect(
		() => {
			if (stepValues.length === 0) return;
			if (citations instanceof Array) {
				const newValues = new Map(stepValues);
				const newTable = newValues.get(configuration.id);
				const citationsCopy = [...citations];
				newTable.value.set('3cc5b368-876b-41d5-bbbc-25886823906a', citationsCopy);
				newValues.set(configuration.id, newTable);
				setStepValues(newValues);
			}
		}, [citations]
	);

	const editCitation = (doiOrWebsiteValue) => {
		const selectedCitation = citations.find((item) => item.id === selectedData.id);
		if (selectedCitation.value) {
			selectedCitation.value = doiOrWebsiteValue;
		}
		setEditItemDialog(false);
		setSelectedData();
	};
	const editItemFooter = () => (
		<div>
			<Button label={translate(t, 'Cancel')} icon="pi pi-times" onClick={() => setEditItemDialog(false)} className="p-button-text" />
			<Button
				label={translate(t, 'Confirm')}
				icon="pi pi-check"
				onClick={() => {
					const doiOrWebsiteValue = textField;
					if (doiOrWebsiteValue.length > 0) {
						editCitation(doiOrWebsiteValue);
						setCreateCitationDialog(false);
						setTextField('');
					}
				}}
				autoFocus
			/>
		</div>
	);

	const deleteCitation = () => {
		setCitations(citations.filter((item) => item.id !== selectedData.id));
		if (selectedCitations.length) {
			setSelectedCitations(selectedCitations.filter((item) => item.id !== selectedData.id));
		}
		setSelectedData();
	};

	const deleteItemFooter = () => (
		<div>
			<Button label={translate(t, 'No')} icon="pi pi-times" onClick={() => setDeleteItemDialog(false)} className="p-button-text" />
			<Button
				label={translate(t, 'Yes')}
				icon="pi pi-check"
				onClick={() => {
					deleteCitation();
					setDeleteItemDialog(false);
				}}
				autoFocus
			/>
		</div>
	);

	const deleteMultipleCitations = () => {
		let newCitations = citations;
		selectedCitations.map((item) => {
			newCitations = newCitations.filter((citation) => citation.id !== item.id);
		});
		setCitations(newCitations);
		setSelectedCitations([]);
	};

	const deleteMultipleFooter = () => (
		<div>
			<Button label={translate(t, 'No')} icon="pi pi-times" onClick={() => setDeleteMultipleDialog(false)} className="p-button-text" />
			<Button
				label={translate(t, 'Yes')}
				icon="pi pi-check"
				onClick={() => {
					deleteMultipleCitations();
					setDeleteMultipleDialog(false);
				}}
				autoFocus
			/>
		</div>
	);

	const createCitation = (doiOrWebsiteValue) => {
		const id = createId();
		const newCitation = {
			id,
			value: doiOrWebsiteValue,
		};
		setCitations([...citations, newCitation]);
	};

	const newItemFooter = () => (
		<div>
			<Button label={translate(t, 'No')} icon="pi pi-times" onClick={() => setCreateCitationDialog(false)} className="p-button-text" />
			<Button
				label={translate(t, 'Yes')}
				icon="pi pi-check"
				onClick={() => {
					const doiOrWebsiteValue = textField;
					if (doiOrWebsiteValue.length > 0) {
						createCitation(doiOrWebsiteValue);
						setCreateCitationDialog(false);
						setTextField('');
					}
				}}
				autoFocus
			/>
		</div>
	);

	const activityBody = (data) => (
		<div className="actions">
			<Button
				className="edit-button"
				icon="fa-regular fa-pen"
				onClick={() => {
					setEditItemDialog(true);
					setSelectedData(data);
					setTextField(data.value);
				}}
			/>
			<Button
				icon="fa-solid fa-xmark"
				className="p-button-danger delete-button"
				onClick={() => {
					setDeleteItemDialog(true);
					setSelectedData(data);
				}}
			/>
		</div>
	);

	const leftToolbar = (
		<div className="left-toolbar">
			<Button label={translate(t, 'New')} icon="fad fa-plus" className="p-button-success p-mr-2 p-mb-2 p-button-raised" onClick={() => setCreateCitationDialog(true)} />
			<Button label={translate(t, 'Delete')} icon="fad fa-trash" className="p-button-danger p-mb-2 p-button-raised" disabled={!selectedCitations || !selectedCitations.length || !citations} onClick={() => setDeleteMultipleDialog(true)} />
			{/* <div className='divider' /> */}
			{/* <Button label="Export" icon="fad fa-file-download" className="p-button-secondary p-mb-2 p-button-raised"  onClick={exportCSV} disabled={!citations.length} /> */}
		</div>
	);

	const rightToolbar = (
		<div className="right-toolbar">
			<Button
				icon="fad fa-question"
				className="p-button-outlined"
				onClick={() => setExplanationDialog(true)}
			/>
		</div>
	);

	const citationTemplate = (data) => {
		return <p>{data.value}</p>;
	};

	return (
		<div className="citation-table">
			<Toolbar left={leftToolbar} right={rightToolbar} />
			<DataTable
				value={citations}
				paginator
				className="p-datatable-striped p-datatable-sm p-datatable-customers"
				rows={10}
				dataKey="id"
				rowHover
				selection={selectedCitations}
				onSelectionChange={(e) => setSelectedCitations(e.value)}
				emptyMessage={translate(t, 'No DOIs/Websites found.')}
				ref={dt}
			>
				<Column selectionMode="multiple" headerStyle={{ width: '3em' }} />
				<Column field="doiOrWebsite" header={translate(t, 'DOI/Website')} sortable body={citationTemplate} />
				<Column style={{ width: '11%' }} body={activityBody} />
			</DataTable>
			<Dialog header={translate(t, 'Are you sure you want to delete the selected DOIs/Websites?')} visible={deleteMultipleDialog} style={{ width: '50vw' }} footer={deleteMultipleFooter()} onHide={() => setDeleteMultipleDialog(false)} />
			<Dialog header={translate(t, 'New DOI/Website')} visible={createCitationDialog} style={{ width: '50vw' }} footer={newItemFooter()} onHide={() => setCreateCitationDialog(false)}>
				<Field configuration={configuration.content[0]} fieldState={textField} setFieldState={setTextField} id={configuration.id} externalState />
			</Dialog>
			<Dialog header={translate(t, configuration.label)} visible={explanationDialog} style={{ width: '50vw' }} footer onHide={() => setExplanationDialog(false)}>
				<p>{translate(t, configuration.fieldInformation, `${configuration.label}-info`)}</p>
			</Dialog>
			<Dialog header={translate(t, 'Are you sure you want to delete this DOI/Website?')} visible={deleteItemDialog} style={{ width: '50vw' }} footer={deleteItemFooter()} onHide={() => setDeleteItemDialog(false)} />
			<Dialog header={translate(t, 'Edit DOI/Website')} visible={editItemDialog} style={{ width: '50vw' }} footer={editItemFooter()} onHide={() => setEditItemDialog(false)}>
				<Field configuration={configuration.content[0]} fieldState={textField} setFieldState={setTextField} id={configuration.id} externalState />
			</Dialog>
		</div>
	);
};

export default CitationTable;
