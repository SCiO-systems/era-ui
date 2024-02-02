import React from 'react';
import './styles.css';
import { useTranslate } from '@tolgee/react';
import { translate } from '../../../../utils';

const Header = (props) => {
	const { configuration, disabled } = props;
	const { t } = useTranslate();

	const renderContent = () => {
		switch (configuration.category) {
		case 'h1': return <h1 style={{ fontSize: configuration.size || '16px', fontWeight: configuration.weight || '300' }}>{translate(t, configuration.text, configuration.tolgeeKey)}</h1>;
		case 'h2': return <h2 style={{ fontSize: configuration.size || '16px', fontWeight: configuration.weight || '300' }}>{translate(t, configuration.text, configuration.tolgeeKey)}</h2>;
		case 'h3': return <h3 style={{ fontSize: configuration.size || '16px', fontWeight: configuration.weight || '300' }}>{translate(t, configuration.text, configuration.tolgeeKey)}</h3>;
		case 'h4': return <h4 style={{ fontSize: configuration.size || '16px', fontWeight: configuration.weight || '300' }}>{translate(t, configuration.text, configuration.tolgeeKey)}</h4>;
		case 'h5': return <h5 style={{ fontSize: configuration.size || '16px', fontWeight: configuration.weight || '300' }}>{translate(t, configuration.text, configuration.tolgeeKey)}</h5>;
		case 'p': return <p style={{ fontSize: configuration.size || '16px', fontWeight: configuration.weight || '300' }}>{translate(t, configuration.text, configuration.tolgeeKey)}</p>;
		default: return <span style={{ fontSize: configuration.size || '16px', fontWeight: configuration.weight || '300' }}>{translate(t, configuration.text, configuration.tolgeeKey)}</span>;
		}
	};

	return (
		<div className={`field header-component ${disabled ? 'p-disabled' : 'p-enabled'}`}>
			{renderContent()}
		</div>
	);
};

export default Header;
