/* eslint-disable max-len */
import React, { useContext, useEffect, useState } from 'react';
import './styles.css';
import configuration from './configuration';
import Field from '../../../../components/Field';
import { GlobalDataContext, HelperContext } from '../../../../context';
import DescriptionBox from '../../../../components/DescriptionBox';
import { makeValueObject } from '../../../../utils';

const Sites = () => {
	const { globalDataContextValue } = useContext(GlobalDataContext);
	const { sitesData, setSitesData } = globalDataContextValue;
	const { helperContextValue } = useContext(HelperContext);
	const { timeVocabs, setTimeVocabs } = helperContextValue;
	const [localFields, setLocalFields] = useState(new Map());

	useEffect(
		() => {
			if (localFields.size === 0) {
				const temp = sitesData;
				if (temp.size > 0) {
					setLocalFields(new Map(temp));
				} else {
					const values = new Map();
					configuration.content.forEach((item) => {
						if (item.data === 'table') {
							values.set(item.id, new Map());
						} else if (item.data && item.data !== 'map') {
							values.set(item.id, makeValueObject());
						}
					});
					setLocalFields(values);
				}
			}
		}, []
	);

	useEffect(() => {
		if (localFields.size > 0) {
			const map = new Map(localFields);
			setSitesData(map);
			const sitesVocab = [];
			map.get('be7817c9-10ac-4669-b131-ae077e22855d')?.forEach((row) => {
				sitesVocab.push({ term: row.get('b6f2545f-c745-4902-a3e5-852f775a9190').value.term, id: row.get('b6f2545f-c745-4902-a3e5-852f775a9190').id });
			});
			setTimeVocabs({ ...timeVocabs, sitesVocab });
		}
	}, [localFields]);

	const lockedEntitiesFunction = (lockedState, rowId) => {
		return lockedState.treatmentSites?.find((site) => site.id === rowId) || lockedState.timeSites?.includes(rowId);
	};

	return (
		<div className="section">
			<div className="card">
				<DescriptionBox header="Sites" descriptionKey="sites-desc" />
				<div className="table">
					<Field configuration={configuration.content[0]} stepValues={localFields} setStepValues={setLocalFields} compositeId={configuration.id} customFunctions={{ lockedEntitiesFunction }} />
				</div>
			</div>
		</div>
	);
};

export default Sites;
