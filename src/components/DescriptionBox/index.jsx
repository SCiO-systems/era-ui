import React from 'react';
import './styles.css';
import { useTranslate } from '@tolgee/react';
import { translate } from '../../utils';

const DescriptionBox = (props) => {
	const { header, descriptionKey, descriptionList } = props;
	const { t } = useTranslate();

	const renderDescList = () => {
		return descriptionList.map((item) => {
			if (item.type === 'p') {
				return <p>{translate(t, '', `${item.name}`)}</p>;
			}
			if (item.type === 'list') {
				return (
					<ul>
						{item.content.map((subItem) => {
							return <li>{translate(t, '', `${subItem.name}`)}</li>;
						})}
					</ul>
				);
			}
			return null;
		});
	};
	return (
		<div className="description-box" style={!header && !descriptionKey && !descriptionList ? { padding: '12px' } : null}>
			{ header ? <p id="header">{translate(t, header)}</p> : null }
			<div className="desc">
				{descriptionKey ? <p>{translate(t, '', descriptionKey)}</p> : null}
				{
					descriptionList ? (
						renderDescList()
					) : null
				}
			</div>
		</div>
	);
};

export default DescriptionBox;
