/* eslint-disable max-len */
import React, { useEffect } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import './styles.css';
import { useTranslate } from '@tolgee/react';
// eslint-disable-next-line import/no-cycle
import Field from '../../index';
import { makeValueObject, translate } from '../../../../utils';

const Tabs = (props) => {
	const { configuration, stepValues, setStepValues, id, disabled, compositeId } = props;
	const { t } = useTranslate();

	useEffect(
		() => {
			if (stepValues instanceof Map && stepValues.size > 0) {
				const newStep = new Map(stepValues);
				const rowMap = newStep.get(id);
				if (!rowMap.get(configuration.tabs[0].content[0])) {
					configuration.tabs.forEach((tab) => {
						tab.content.forEach((tabField) => {
							if (tabField.data === 'table') {
								const field = rowMap.get(tabField.id);
								if (!field) {
									rowMap.set(tabField.id, new Map());
								}
							} else if (tabField.data) {
								const field = rowMap.get(tabField.id);
								if (!field) {
									rowMap.set(tabField.id, makeValueObject());
								}
							}
						});
					});
					newStep.set(id, rowMap);
					setStepValues(newStep);
				}
			}
		}, []
	);

	const renderBody = (tab) => tab.content.map((item) => <Field configuration={item} stepValues={stepValues} setStepValues={setStepValues} id={id} disabled={disabled} compositeId={compositeId} />);

	const renderTabs = () => configuration.tabs.map((tab) => (
		<TabPanel key={tab.id} header={translate(t, tab.header)} contentClassName="tab-content">
			<div className="forms">
				{renderBody(tab)}
			</div>
		</TabPanel>
	));

	return (
		<TabView>
			{renderTabs()}
		</TabView>
	);
};

export default Tabs;
