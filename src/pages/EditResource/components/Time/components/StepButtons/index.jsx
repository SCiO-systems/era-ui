import React from 'react';
import './styles.css';
import { Button } from 'primereact/button';
import { useTranslate } from '@tolgee/react';
import { translate } from '../../../../../../utils';

const StepButtons = (props) => {
	const { t } = useTranslate();
	const { activeStep, setActiveStep } = props;
	const incrementStep = (incrementValue) => {
		setActiveStep(activeStep + incrementValue);
	};

	return (
		<div className="navigation-buttons">
			<Button label={translate(t, 'Previous')} icon="fa-solid fa-angle-left" iconPos="left" disabled={activeStep === 0} onClick={() => incrementStep(-1)} />
			<Button label={translate(t, 'Next')} icon="fa-solid fa-angle-right" iconPos="right" disabled={activeStep === 2} onClick={() => incrementStep(1)} />
		</div>
	);
};

export default StepButtons;
