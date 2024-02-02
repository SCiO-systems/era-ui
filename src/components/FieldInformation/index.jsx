import React, { useState } from 'react';
import './styles.css';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { useTranslate } from '@tolgee/react';
import { translate } from '../../utils';

const FieldInformation = (props) => {
	const { configuration, disabled } = props;
	const [displayDialog, setDisplayDialog] = useState(false);
	const { t } = useTranslate();
	const renderQuesitonFooter = () => (
		<div>
			<Button label={translate(t, 'Ok')} icon="pi pi-check" onClick={() => setDisplayDialog(false)} autoFocus />
		</div>
	);
	if (configuration.fieldInformation) {
		return (
			<>
				{/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
				<span className={`p-inputgroup-addon ${disabled ? 'p-disabled' : 'p-enabled'}`} id="question" onClick={() => setDisplayDialog(true)}><i className="fad fa-question" /></span>
				<Dialog header={translate(t, configuration.label) || translate(t, configuration.title)} visible={displayDialog} style={{ width: '50vw' }} footer={renderQuesitonFooter('displayBasic')} onHide={() => setDisplayDialog(false)}>
					<p>{translate(t, configuration.fieldInformation, `${configuration.label}-info`)}</p>
				</Dialog>
			</>
		);
	} 
	return null;
};

export default FieldInformation;
