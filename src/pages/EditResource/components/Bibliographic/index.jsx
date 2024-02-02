/* eslint-disable max-len */
import React, { useEffect, useState, useContext } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslate } from '@tolgee/react';
import { makeValueObject, translate } from '../../../../utils';
import Field from '../../../../components/Field';
import CitationTable from '../../../../components/CitationTable';
import configuration from './configuration';
import UserService from '../../../../services/httpService/userService';
import './styles.css';
import { GlobalDataContext, HelperContext } from '../../../../context';
import DescriptionBox from '../../../../components/DescriptionBox';

const Bibliographic = () => {
	const { t } = useTranslate();

	const navigate = useNavigate();

	const loggedIn = useSelector((state) => state.loggedIn);

	const { globalDataContextValue } = useContext(GlobalDataContext);
	const { bibliographicData, setBibliographicData } = globalDataContextValue;
	const { helperContextValue } = useContext(HelperContext);
	const [localFields, setLocalFields] = useState(new Map());
	const [publicationCode, setPublicationCode] = useState();

	useEffect(() => {
		if (localFields.size === 0) {
			const temp = bibliographicData;
			if (temp.size > 0) {
				setLocalFields(new Map(temp));
				setPublicationCode(temp.get('24b0c1d3-2d74-4b49-ae29-66d99c0a6ded')?.value);
			} else {
				const values = new Map();
				configuration.content.forEach((item) => {
					if (item.data) {
						values.set(item.id, makeValueObject());
					}
				});
				setLocalFields(values);
			}
		}
	}, []);

	useEffect(
		() => {
			if (loggedIn === 'loggedOut') {
				navigate('/Login');
			}
		}, [loggedIn]
	);

	useEffect(() => {
		if (localFields.size === 0) return;
		if (!helperContextValue.editing.editMode === 'new') return;
		if (publicationCode) return;
		const temp = new Map(localFields);
		if (temp.get('24b0c1d3-2d74-4b49-ae29-66d99c0a6ded')?.value) return;

		const id = Math.floor(Math.random() * 90000) + 10000;
		let initials;
		UserService.getInitials(localStorage.getItem('userId') || 212)
			.then((response) => {
				initials = response.initials;
				if (!publicationCode) {
					setPublicationCode(`${initials}${id}`);
				}
			});
	}, [localFields]);

	useEffect(() => {
		if (localFields.size === 0) return;
		if (!publicationCode) return;
		const temp = new Map(localFields);
		if (temp.get('24b0c1d3-2d74-4b49-ae29-66d99c0a6ded').value) return;

		temp.set('24b0c1d3-2d74-4b49-ae29-66d99c0a6ded', makeValueObject(publicationCode));
		setLocalFields(temp);
	}, [publicationCode]);

	useEffect(() => {
		if (localFields.size > 0) {
			const map = new Map(localFields);
			setBibliographicData(map);
		}
	}, [localFields]);

	const renderFields = () => {
		return (configuration.content.map((item) => {
			return <Field configuration={item} stepValues={localFields} setStepValues={setLocalFields} disabled={item.disabled} compositeId={configuration.id} />;
		})
		);
	};

	const renderCitationTable = () => {
		const citationTableConfig = configuration.content.find((item) => item.id === '9fde36dd-a5ff-46d8-a592-04fcd88af346');
		return (
			<>
				<h3>{translate(t, citationTableConfig.header)}</h3>
				<CitationTable configuration={citationTableConfig} stepValues={localFields} setStepValues={setLocalFields} target={citationTableConfig.id} />
			</>
		);
	};

	return (
		<div className="section">
			<div className="card">
				<DescriptionBox header="Bibliographic" descriptionKey="biblio-desc" />
				<div className="table multicol">
					<div className="column forms">
						{renderFields()}
					</div>
					<div className="column forms">
						{renderCitationTable()}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Bibliographic;
