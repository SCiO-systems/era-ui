import React from 'react';
import './styles.css';
import { useTolgee } from '@tolgee/react';
import { Dropdown } from 'primereact/dropdown';
import 'flag-icons/css/flag-icons.min.css';

const LangSelector = () => {
	const tolgee = useTolgee(['language']);

	const languageSelectItems = [
		{ label: 'English', value: 'en', code: 'gb' },
		{ label: 'Spanish', value: 'es-ES', code: 'es' },
	];

	const countryOptionTemplate = (option) => {
		return (
			<div className="lang-item">
				<span className={`fi fi-${option.code.toLowerCase()}`} />
				<div>{option.label}</div>
			</div>
		);
	};

	const selectedCountryTemplate = (option, props) => {
		if (option) {
			return (
				<div className="lang-item">
					<span className={`fi fi-${option.code.toLowerCase()}`} />
					<div>{option.label}</div>
				</div>
			);
		}

		return (
			<span>
				{props.placeholder}
			</span>
		);
	};
	
	return (
		<div className="lang-selector">
			<Dropdown
				value={tolgee.getLanguage()}
				options={languageSelectItems}
				onChange={(e) => tolgee.changeLanguage(e.value)}
				itemTemplate={countryOptionTemplate}
				valueTemplate={selectedCountryTemplate}
			/>
		</div>
	);
};

export default LangSelector;
