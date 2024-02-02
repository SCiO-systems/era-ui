import React from 'react';
import './styles.css';

const Divider = (props) => {
	const { configuration } = props;

	return configuration.horizontal ? <div style={configuration.style} className="field-divider horizontal row-item" /> : <div style={configuration.style} className="field-divider vertical" />;
};

export default Divider;
