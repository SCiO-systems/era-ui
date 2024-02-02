import React from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import './styles.css';

const SearchBar = () => (
	<div className="search-bar p-grid p-justify-center">
		<div className="p-col-10">
			<InputText />
		</div>
		<div className="button p-col-1">
			<Button label="Search" icon="pi pi-search" className="p-button" />
		</div>
	</div>
);

export default SearchBar;
