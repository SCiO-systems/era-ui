import React from 'react';
import './styles.css';
import { Button } from 'primereact/button';
import DataService from '../../services/httpService/dataService';

const Data = () => {
	const handleDownloadData = () => {
		DataService.getDataLink()
			.then((response) => {
				// const url = window.URL.createObjectURL(new Blob([response.data]));
				const link = document.createElement('a');
				link.href = response.data;
				// link.setAttribute('download'); // or any other extension
				document.body.appendChild(link);
				link.click();
				link.remove();
			});
	};

	return (
		<div className="data-page">
			<div className="download-button-container">
				<Button label="Download Data" onClick={handleDownloadData} />
			</div>
		</div>
	);
};

export default Data;
