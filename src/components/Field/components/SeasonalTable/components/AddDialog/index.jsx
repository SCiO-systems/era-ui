import React from 'react';
import './styles.css';
import { Dialog } from 'primereact/dialog';
import { useTranslate } from '@tolgee/react';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { translate } from '../../../../../../utils';

const AddDialog = (props) => {
	const { addDialog, setAddDialog, addItem, getPeriods, getSites, periodValue, setPeriodValue, siteValue, setSiteValue } = props;
	const { t } = useTranslate();

	const addItemFooter = () => (
		<div>
			<Button label={translate(t, 'Cancel')} icon="pi pi-times" onClick={() => setAddDialog(false)} className="p-button-text" />
			<Button
				label={translate(t, 'Add')}
				icon="pi pi-check"
				onClick={() => addItem(siteValue, periodValue)}
				autoFocus
				disabled={!periodValue}
			/>
		</div>
	);

	return (
		<Dialog header={translate(t, 'Add Time Period')} visible={addDialog} style={{ width: '50vw' }} footer={addItemFooter} onHide={() => setAddDialog(false)}>
			<div className="add-item">
				<div className="p-inputgroup">
					<span className="p-float-label">
						<Dropdown
							className="dropdown"
							value={siteValue}
							onChange={(e) => setSiteValue(e.value)}
							options={getSites()}
							showClear
							optionLabel="term"
						/>
						<label htmlFor="username">{translate(t, 'Select Site')}</label>
					</span>
				</div>
				<div className="p-inputgroup">
					<span className="p-float-label">
						<MultiSelect
							className="dropdown"
							value={periodValue}
							onChange={(e) => setPeriodValue(e.value)}
							options={getPeriods(siteValue)}
							optionLabel="term"
							showClear
						/>
						<label htmlFor="username">{translate(t, 'Select Time Period')}</label>
					</span>
				</div>
			</div>
		</Dialog>
	);
};

export default AddDialog;
