import React, { useEffect, useState } from 'react';
import './styles.css';
import { SelectButton } from 'primereact/selectbutton';
import { useTranslate } from '@tolgee/react';
import { makeValueObject, translate } from '../../../../../../utils';

const Selector = (props) => {
	const { configuration, stepValues, setStepValues, id } = props;
	const [selection, setSelection] = useState();
	const { t } = useTranslate();

	useEffect(
		() => {
			if (configuration.data) {
				if (stepValues instanceof Map && stepValues.size > 0) {
					const tempStep = new Map(stepValues);
					if (id) {
						const preset = tempStep.get(id).get(configuration.id);
						if (preset) {
							if (preset.value) {
								setSelection(preset.value);
							} else {
								setSelection(null);
							}
						}
					} else {
						const preset = stepValues.get(configuration.id);
						if (preset) {
							if (preset.value) {
								setSelection(preset.value);
							}
						}
					}
				}
			}
		}, [stepValues]
	);

	useEffect(() => {
		if (selection) {
			if (stepValues instanceof Map && stepValues.size > 0 && configuration.data) {
				const newValues = new Map(stepValues);
				if (id) {
					const subMap = newValues.get(id);
					subMap.set(configuration.id, makeValueObject(selection, id, configuration.mandatory));
					newValues.set(id, subMap);
				} else {
					newValues.set(configuration.id, makeValueObject(selection));
				}
				setStepValues(newValues);
			}
		}
	}, [selection]);

	return (
		<div className="selector">
			<p>{translate(t, configuration.label)}</p>
			<SelectButton
				className="button"
				value={selection}
				onChange={(e) => setSelection(e.value)}
				options={configuration.options}
				style={configuration.style}
			/>
		</div>
	);
};

export default Selector;
