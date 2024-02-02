import React from 'react';
import './styles.css';
import { ProgressSpinner } from 'primereact/progressspinner';

const Overlay = () => {
	return (
		<div className="overlay">
			<ProgressSpinner />
		</div>
	);
};

export default Overlay;
