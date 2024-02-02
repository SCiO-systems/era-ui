import React, { useContext, useMemo, useState } from 'react';
import { Steps } from 'primereact/steps';
import { useTranslate } from '@tolgee/react';
import { translate } from '../../../../utils';
import { TimePeriods, TimeSites, StepButtons, TimeClimate } from './components';
import './styles.css';
import DescriptionBox from '../../../../components/DescriptionBox';
import { GlobalDataContext, HelperContext } from '../../../../context';

const Time = () => {
	const { t } = useTranslate();
	const { globalDataContextValue } = useContext(GlobalDataContext);
	const { timeData, setTimeData } = globalDataContextValue;
	const [activeIndex, setActiveIndex] = useState(0);

	const { helperContextValue } = useContext(HelperContext);

	// const items = [{ label: translate(t, 'Time Periods') }, { label: translate(t, 'Site & Period Association') }, { label: translate(t, 'Experienced Climate') }];

	const items = useMemo(() => {
		// if (helperContextValue.editing.submissionType === 'crop') {
		// 	return [{ label: translate(t, 'Time Periods') }, { label: translate(t, 'Site & Period Association') }, { label: translate(t, 'Experienced Climate') }];
		// } if (helperContextValue.editing.submissionType === 'livestock') {
		// 	return [{ label: translate(t, 'Time Periods') }];
		// }
		// return [];
		return [{ label: translate(t, 'Time Periods') }, { label: translate(t, 'Site & Period Association') }, { label: translate(t, 'Experienced Climate') }];
	}, [helperContextValue.editing]);

	const renderStep = () => {
		switch (activeIndex) {
		case 0: return <TimePeriods stepValues={timeData} setStepValues={setTimeData} />;
		case 1: return <TimeSites stepValues={timeData} setStepValues={setTimeData} />;
		case 2: return <TimeClimate stepValues={timeData} setStepValues={setTimeData} />;
		default: return null;
		}
	};
	const renderTime = () => {
		// if (helperContextValue.editing.submissionType === 'crop') {
		// 	return (
		// 		<>
		// 			<Steps model={items} activeIndex={activeIndex} onSelect={(e) => setActiveIndex(e.index)} readOnly={false} />
		// 			<div className="step-content">
		// 				{renderStep()}
		// 			</div>
		// 			<StepButtons activeStep={activeIndex} setActiveStep={setActiveIndex} />
		// 		</>
		// 	);
		// } if (helperContextValue.editing.submissionType === 'livestock') {
		// 	return <TimePeriods stepValues={timeData} setStepValues={setTimeData} />;
		// }
		// return null;
		return (
			<>
				<Steps model={items} activeIndex={activeIndex} onSelect={(e) => setActiveIndex(e.index)} readOnly={false} />
				<div className="step-content">
					{renderStep()}
				</div>
				<StepButtons activeStep={activeIndex} setActiveStep={setActiveIndex} />
			</>
		);
	};
	return (
		<div className="section time-tables">
			<div className="container card">
				<DescriptionBox header="Time" />
				{renderTime()}
				<div className="table" />
			</div>
		</div>
	);
};

export default Time;
