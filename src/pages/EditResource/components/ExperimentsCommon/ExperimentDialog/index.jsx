import React, { useContext, useMemo } from 'react';
import './styles.css';
import { Dialog } from 'primereact/dialog';
import { useTranslate } from '@tolgee/react';
import { Button } from 'primereact/button';
import { translate } from '../../../../../utils';
import Field from '../../../../../components/Field';
import { VocabulariesContext, HelperContext } from '../../../../../context';

const AddExperimentDialog = (props) => {
	const { addExperimentDialog, setAddExperimentDialog, experimentName, setExperimentName, category, setCategory, addExperiment, editExperiment, currentItem } = props;

	const { t } = useTranslate();

	const { vocabulariesContextValue } = useContext(VocabulariesContext);
	const { helperContextValue } = useContext(HelperContext);

	const addExperimentFooter = () => (
		<Button
			label={translate(t, 'Add')}
			icon="fa-solid fa-check"
			iconPos="left"
			onClick={() => {
				if (currentItem) {
					editExperiment();
				} else {
					addExperiment();
				}
			}}
		/>
	);

	const options = useMemo(() => {
		if (helperContextValue.editing.submissionType === 'crop') {
			return vocabulariesContextValue.vocabs.experiment_category;
		} if (helperContextValue.editing.submissionType === 'livestock') {
			return [{ term: 'Animals' }];
		}
		return [];
	}, [helperContextValue.editing]);

	return (
		<Dialog header={translate(t, 'Add Experiment')} visible={addExperimentDialog} style={{ width: '50vw' }} footer={addExperimentFooter} onHide={() => setAddExperimentDialog(false)}>
			<div className="add-experiment-fields">
				<Field
					configuration={{
						type: 'text',
						label: 'Experiment',
						fieldInformation: ' ',
					}}
					fieldState={experimentName}
					setFieldState={setExperimentName}
					externalState
				/>
				<Field
					configuration={{
						type: 'list',
						editable: true,
						label: 'Category',
						fieldInformation: ' ',
						options,
						autoFill: true,
					}}
					fieldState={category}
					setFieldState={setCategory}
					externalState
				/>
			</div>
		</Dialog>
	);
};

export default AddExperimentDialog;
