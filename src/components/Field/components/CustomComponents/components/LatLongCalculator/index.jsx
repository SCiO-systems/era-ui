import React, { useEffect, useState } from 'react';
import './styles.css';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { useTranslate } from '@tolgee/react';
// eslint-disable-next-line import/no-cycle
import Field from '../../../../index';
import { makeValueObject, translate } from '../../../../../../utils';

const LatLongCalculator = (props) => {
	const { configuration, stepValues, setStepValues, id } = props;
	const [displayDialog, setDisplayDialog] = useState(false);
	const [localFields, setLocalFields] = useState(new Map());
	const [calculatorReady, setCalculatorReady] = useState(true);
	const { t } = useTranslate();

	useEffect(() => {
		setCalculatorReady(!getCalculatorFields());
	}, [localFields]);

	const getCalculatorFields = () => {
		if (localFields.size === 0) return false;
		const latDegrees = localFields.get('075d8c9e-344b-4ded-92e4-0c57a72585f9').value;
		const latMinutes = localFields.get('52171869-c973-44bc-90c0-4b40decf3400').value;
		const latSeconds = localFields.get('9bc6a6d7-8d0f-41e2-844b-bd8aede1610f').value;
		const latHemisphere = localFields.get('f2bf4953-0435-4096-9dea-63bdd1b9464d').value;
		const lngDegrees = localFields.get('6149bba1-43e8-47e2-83e3-c471ecfa9700').value;
		const lngMinutes = localFields.get('b3730ff9-e33d-44b7-b3e4-acff1c8a3665').value;
		const lngSeconds = localFields.get('34d803bc-8724-43f0-b7a8-957ef9685328').value;
		const lngHemisphere = localFields.get('4eacfe8e-b717-4187-b340-e45311504b4f').value;

		if ((latDegrees || latDegrees === 0) &&
			(latMinutes || latMinutes === 0) &&
			(latHemisphere || latHemisphere === 0) &&
			(lngDegrees || lngDegrees === 0) &&
			(lngMinutes || lngMinutes === 0) &&
			(lngHemisphere || lngHemisphere === 0)) {
			return ({ latDegrees, latMinutes, latSeconds: latSeconds || 0, latHemisphere, lngDegrees, lngMinutes, lngSeconds: lngSeconds || 0, lngHemisphere });
		} 
		return false;
	};

	const setLatLng = () => {
		const fields = getCalculatorFields();
		const lat = calculateDecimalDegrees(fields.latDegrees, fields.latMinutes, fields.latSeconds, fields.latHemisphere);
		const lng = calculateDecimalDegrees(fields.lngDegrees, fields.lngMinutes, fields.lngSeconds, fields.lngHemisphere);
		const tempStep = new Map(stepValues);
		const temp = tempStep.get(id);
		temp.set('faa84f33-b3ea-443b-a682-7faf78e1d84f', {
			mandatory: true,
			valid: true,
			value: lat,
		});
		temp.set('6945fb73-3e26-403a-8d43-2cdab030b09b', {
			mandatory: true,
			valid: true,
			value: lng,
		});
		tempStep.set(id, temp);
		setStepValues(tempStep);
	};

	const calculateDecimalDegrees = (deg, min, sec, hemisphere) => {
		let sign;
		if (hemisphere === 'N' || hemisphere === 'E') {
			sign = 1;
		} else if (hemisphere === 'S' || hemisphere === 'W') {
			sign = -1;
		}
		return (deg + (min / 60) + (sec / 3600)) * sign;
	};

	const footer = (
		<div>
			<Button label={translate(t, 'Cancel')} onClick={() => setDisplayDialog(false)} />
			<Button
				label={translate(t, 'Calculate')}
				onClick={() => {
					setLatLng();
					setDisplayDialog(false);
				}
				}
				disabled={calculatorReady}
			/>
		</div>
	);

	const renderFields = () => {
		return (
			configuration.content.map((field) => {
				if (field.data) {
					if (!localFields.has(field.id)) {
						localFields.set(field.id, makeValueObject());
					}
				}
				return <Field configuration={field} stepValues={localFields} setStepValues={setLocalFields} />;
			}));
	};

	return (
		<div className="calculator">
			<Button label={translate(t, configuration.label)} icon="fa-solid fa-globe" onClick={() => setDisplayDialog(true)} />
			<Dialog
				className="calculator-dialog"
				header={translate(t, 'Decimal Latitude and Longitude Calculator')}
				visible={displayDialog}
				style={{ width: '50vw' }}
				onHide={() => setDisplayDialog(false)}
				footer={footer}
			>
				<p>{translate(t, 'Please fill in degrees/minutes/seconds and hemisphere for latitude and longitude. Decimal values will be calculated automatically.')}</p>
				{renderFields()}
			</Dialog>
		</div>
	);
};

export default LatLongCalculator;
