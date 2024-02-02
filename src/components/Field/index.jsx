/* eslint-disable max-len */
import React from 'react';
// eslint-disable-next-line import/no-cycle
import {
	Text,
	Calendar,
	TextArea,
	Number,
	List,
	InputTable,
	ExpandableTable,
	Tabs,
	Header,
	MapGroup,
	Divider,
	CustomComponents,
	SeasonalTable,
	CheckBox,
	MultiList,
} from './components';
import './styles.css';

const Field = (props) => {
	const { configuration, fieldState, setFieldState, stepValues, setStepValues, id, disabled, customTerm, compositeId, parent, cropCount, siteId, customFunctions, associates, externalState, isValid } = props;

	switch (configuration?.type) {
	case 'text':
		return <Text configuration={configuration} parent={parent} fieldState={fieldState} setFieldState={setFieldState} stepValues={stepValues} setStepValues={setStepValues} id={id} disabled={disabled} compositeId={compositeId} externalState={externalState} isValid={isValid} />;
	case 'calendar':
		return <Calendar configuration={configuration} stepValues={stepValues} setStepValues={setStepValues} id={id} disabled={disabled} compositeId={compositeId} />;
	case 'text area':
		return <TextArea configuration={configuration} parent={parent} fieldState={fieldState} setFieldState={setFieldState} stepValues={stepValues} setStepValues={setStepValues} id={id} disabled={disabled} compositeId={compositeId} externalState={externalState} />;
	case 'number':
		return <Number configuration={configuration} parent={parent} stepValues={stepValues} setStepValues={setStepValues} fieldState={fieldState} setFieldState={setFieldState} id={id} disabled={disabled} compositeId={compositeId} externalState={externalState} />;
	case 'list':
		return <List configuration={configuration} parent={parent} fieldState={fieldState} setFieldState={setFieldState} stepValues={stepValues} setStepValues={setStepValues} id={id} disabled={disabled} customTerm={customTerm} compositeId={compositeId} siteId={siteId} externalState={externalState} />;
	case 'multi-list':
		return <MultiList configuration={configuration} parent={parent} fieldState={fieldState} setFieldState={setFieldState} stepValues={stepValues} setStepValues={setStepValues} id={id} disabled={disabled} customTerm={customTerm} compositeId={compositeId} siteId={siteId} externalState={externalState} isValid={isValid} />;
	case 'input-table':
		return <InputTable configuration={configuration} parent={parent} stepValues={stepValues} setStepValues={setStepValues} id={id} disabled={disabled} compositeId={compositeId} siteId={siteId} customFunctions={customFunctions} />;
	case 'expandable-table':
		return <ExpandableTable configuration={configuration} stepValues={stepValues} setStepValues={setStepValues} id={id} disabled={disabled} compositeId={compositeId} customFunctions={customFunctions} />;
	case 'tabs':
		return <Tabs configuration={configuration} stepValues={stepValues} setStepValues={setStepValues} id={id} disabled={disabled} compositeId={compositeId} />;
	case 'map':
		return <MapGroup configuration={configuration} stepValues={stepValues} setStepValues={setStepValues} id={id} disabled={disabled} compositeId={compositeId} />;
	case 'header':
		return <Header configuration={configuration} compositeId={compositeId} disabled={disabled} />;
	case 'divider':
		return <Divider configuration={configuration} compositeId={compositeId} />;
	case 'seasonal-table':
		return <SeasonalTable configuration={configuration} stepValues={stepValues} setStepValues={setStepValues} id={id} disabled={disabled} compositeId={compositeId} siteId={siteId} cropCount={cropCount} associates={associates} />;
	case 'custom':
		return <CustomComponents configuration={configuration} compositeId={compositeId} stepValues={stepValues} setStepValues={setStepValues} id={id} disabled={disabled} cropCount={cropCount} />;
	case 'checkbox':
		return <CheckBox configuration={configuration} stepValues={stepValues} setStepValues={setStepValues} fieldState={fieldState} setFieldState={setFieldState} id={id} disabled={disabled} compositeId={compositeId} externalState={externalState} />;
	default:
		return (<div />);
	}
};

export default Field;
