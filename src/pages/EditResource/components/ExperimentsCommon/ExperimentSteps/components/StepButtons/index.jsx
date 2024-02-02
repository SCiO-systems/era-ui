import React from 'react';
import './styles.css';
import { Button } from 'primereact/button';
import { useTranslate } from '@tolgee/react';
import { translate } from '../../../../../../../utils';

const StepButtons = (props) => {
	const { t } = useTranslate();
	const { activeStep, setActiveStep, setSelectedExperiment } = props;
	const incrementStep = (incrementValue) => {
		setActiveStep(activeStep + incrementValue);
	};

	const renderBackButton = () => {
		if (activeStep === 0) {
			return <Button label={translate(t, 'Back to Experiments')} icon="fa-solid fa-angle-left" iconPos="left" onClick={() => setSelectedExperiment(null)} />;
		}
		return <Button label={translate(t, 'Previous')} icon="fa-solid fa-angle-left" iconPos="left" disabled={activeStep === 0} onClick={() => incrementStep(-1)} />;
	};

	return (
		<div className="navigation-buttons">
			{renderBackButton()}
			<Button label={translate(t, 'Next')} icon="fa-solid fa-angle-right" iconPos="right" disabled={activeStep === 4} onClick={() => incrementStep(1)} />
		</div>
	);
};

export default StepButtons;
