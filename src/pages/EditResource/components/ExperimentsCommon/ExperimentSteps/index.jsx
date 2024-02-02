/* eslint-disable max-len */
import React, { useContext, useMemo, useState } from 'react';
import { useTranslate } from '@tolgee/react';
import { Steps } from 'primereact/steps';
import { translate } from '../../../../../utils';
// import { ExperimentalDesign, ManagementPractices, Rotations, StepButtons, Outcomes, EnterData } from './components';
import Outcomes from '../Outcomes';
import EnterData from '../EnterData';
import ExperimentalDesign from '../ExperimentalDesign';
import './styles.css';
import DescriptionBox from '../../../../../components/DescriptionBox';
import { HelperContext } from '../../../../../context';
import { HerdGroup, ManagementPractices as ManagementPracticesLivestock } from '../../ExperimentsLivestock/components';
import { Rotations, ManagementPractices as ManagementPracticesCrop } from '../../Experiments/components';
import { StepButtons } from './components';

const ExperimentSteps = (props) => {
	const { t } = useTranslate();

	const { selectedExperiment, setSelectedExperiment, stepValues, setStepValues, compositeId } = props;

	const [activeIndex, setActiveIndex] = useState(0);
	const { helperContextValue } = useContext(HelperContext);

	const items = useMemo(() => {
		if (helperContextValue.editing.submissionType === 'crop') {
			return [
				{ label: translate(t, 'Experimental Design') },
				{ label: translate(t, 'Management Practices') },
				{ label: translate(t, 'Crop Sequences') },
				{ label: translate(t, 'Outcomes') },
				{ label: translate(t, 'Enter Data') },
			];
		} if (helperContextValue.editing.submissionType === 'livestock') {
			return [
				{ label: translate(t, 'Experimental Design') },
				{ label: translate(t, 'Herd Group') },
				{ label: translate(t, 'Management Practices') },
				// { label: translate(t, 'Crop Sequences') },
				{ label: translate(t, 'Outcomes') },
				{ label: translate(t, 'Enter Data') },
			];
		}
		return [];
	}, [helperContextValue]);

	const renderStep = () => {
		if (helperContextValue.editing.submissionType === 'crop') {
			switch (activeIndex) {
			case 0: return <ExperimentalDesign selectedExperiment={selectedExperiment} stepValues={stepValues} setStepValues={setStepValues} compositeId={compositeId} />;
			case 1: return <ManagementPracticesCrop selectedExperiment={selectedExperiment} stepValues={stepValues} setStepValues={setStepValues} compositeId={compositeId} />;
			case 2: return <Rotations selectedExperiment={selectedExperiment} stepValues={stepValues} setStepValues={setStepValues} compositeId={compositeId} />;
			case 3: return <Outcomes selectedExperiment={selectedExperiment} stepValues={stepValues} setStepValues={setStepValues} compositeId={compositeId} />;
			case 4: return <EnterData selectedExperiment={selectedExperiment} stepValues={stepValues} setStepValues={setStepValues} compositeId={compositeId} />;
			default: return null;
			}
		} else if (helperContextValue.editing.submissionType === 'livestock') {
			switch (activeIndex) {
			case 0: return <ExperimentalDesign selectedExperiment={selectedExperiment} stepValues={stepValues} setStepValues={setStepValues} />;
			case 1: return <HerdGroup selectedExperiment={selectedExperiment} stepValues={stepValues} setStepValues={setStepValues} />;
			case 2: return <ManagementPracticesLivestock selectedExperiment={selectedExperiment} stepValues={stepValues} setStepValues={setStepValues} />;
				// case 2: return <Rotations selectedExperiment={selectedExperiment} stepValues={stepValues} setStepValues={setStepValues} />;
			case 3: return <Outcomes selectedExperiment={selectedExperiment} stepValues={stepValues} setStepValues={setStepValues} />;
			case 4: return <EnterData selectedExperiment={selectedExperiment} stepValues={stepValues} setStepValues={setStepValues} />;
			default: return null;
			}
		}
		return null;
	};

	return (
		<div className="section">
			<div className="container card">
				<DescriptionBox header={`${stepValues.get(selectedExperiment).get('5be57eb5-6e6a-4a41-914d-94964588707e').value}`} />
				<div className="steps-container">
					<Steps model={items} activeIndex={activeIndex} onSelect={(e) => setActiveIndex(e.index)} readOnly={false} />
					<div className="step-content">
						{renderStep()}
					</div>
					<StepButtons activeStep={activeIndex} setActiveStep={setActiveIndex} setSelectedExperiment={setSelectedExperiment} />
				</div>
			</div>
		</div>
	);
};

export default ExperimentSteps;
