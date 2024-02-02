/* eslint-disable import/no-cycle */
import React from 'react';
import './styles.css';
import Field from '../../../../index';

const Forms = (props) => {
	const { items, setItems, configuration, id } = props;

	const renderFields = () => configuration.content.map((item) =>
		<Field configuration={item} stepValues={items} setStepValues={setItems} id={id} />
	);

	return (
		<div className="map-forms p-grid">
			{renderFields()}
		</div>
	);
};

export default Forms;
