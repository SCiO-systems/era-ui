/* eslint-disable max-len,import/no-cycle */
import React, { useEffect, useState } from 'react';
import { Forms, MapComponent } from './components';
import './styles.css';
import { makeValueObject } from '../../../../utils';

const MapGroup = (props) => {
	const { configuration, stepValues, setStepValues, id } = props;
	const [latLng, setLatLng] = useState();

	useEffect(
		() => {
			if (stepValues instanceof Map) {
				const newStep = new Map(stepValues);
				const rowMap = newStep.get(id);
				if (!rowMap.get(configuration.content[0])) {
					configuration.content.forEach((item) => {
						if (item.data) {
							const field = rowMap.get(item.id);
							if (!field) {
								rowMap.set(item.id, makeValueObject());
							}
						}
					});
					newStep.set(id, rowMap);
					setStepValues(newStep);
				}
			}
		}, []
	);

	useEffect(() => {
		if (stepValues.has(id)) {
			const temp = stepValues.get(id);
			let customPos = false;
			const coords = [0, 0];
			const tempLat = temp.get('faa84f33-b3ea-443b-a682-7faf78e1d84f');
			if (typeof tempLat?.value === 'number') {
				coords[0] = tempLat.value;
				customPos = true;
			}
			const tempLng = temp.get('6945fb73-3e26-403a-8d43-2cdab030b09b');
			if (typeof tempLng?.value === 'number') {
				coords[1] = tempLng.value;
				customPos = true;
			}
			if (customPos) {
				setLatLng(coords);
			}
		}
	}, [stepValues]);

	useEffect(() => {
		if (stepValues.size === 0) return;
		if (!latLng) return;
		const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${latLng[0]}%2C${latLng[1]}`;
		const tempStep = new Map(stepValues);
		const temp = tempStep.get(id);
		if (temp.get('b266e5a1-473e-46a6-8eac-9544db697846').value !== mapsUrl) {
			temp.set('b266e5a1-473e-46a6-8eac-9544db697846', makeValueObject(mapsUrl, id));
			tempStep.set(id, temp);
			setStepValues(tempStep);
		}
	}, [latLng]);

	return (
		<div className="map">
			<Forms configuration={configuration} items={stepValues} setItems={setStepValues} id={id} />
			<MapComponent latLng={latLng} />
		</div>
	);
};

export default MapGroup;
