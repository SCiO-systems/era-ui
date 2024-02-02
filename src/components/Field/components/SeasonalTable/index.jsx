import React, { useContext, useEffect, useState } from 'react';
import './styles.css';
import { useTranslate } from '@tolgee/react';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { DataTable } from 'primereact/datatable';
// eslint-disable-next-line import/no-cycle
import Field from '../../index';
import { createId, makeValueObject, mapToArray, translate } from '../../../../utils';
import { AddDialog } from './components';
import { HelperContext, ValidationContext } from '../../../../context';
import validationArray from '../../../../pages/EditResource/validationArray';

const SeasonalTable = (props) => {
	const { configuration, stepValues, setStepValues, id, disabled, compositeId, siteId, cropCount } = props;

	const { helperContextValue } = useContext(HelperContext);
	const { validationContextValue } = useContext(ValidationContext);
	const { timeVocabs } = helperContextValue;

	const [expandedRows, setExpandedRows] = useState(null);
	const [addDialog, setAddDialog] = useState(false);
	const [items, setItems] = useState();
	const [periodValue, setPeriodValue] = useState();
	const [siteValue, setSiteValue] = useState();
	const [sitePeriodPairs, setSitePeriodPairs] = useState([]);
	const { t } = useTranslate();

	const getSites = () => {
		let treatmentSites = timeVocabs?.sitesVocab?.filter((site) => {
			return siteId?.includes(site.id);
		});
		if (!treatmentSites) {
			return [];
		}

		treatmentSites = treatmentSites.filter((site) => {
			const periods = getAllPeriods(site);

			// look in existing sites and get all instances of this site
			const foundSites = sitePeriodPairs.filter((pair) => {
				return pair.site.id === site.id;
			});

			// look in periods for each instance. make array of already selected periods
			const allPeriods = [];
			foundSites.forEach((pair) => {
				pair.period.forEach((per) => {
					allPeriods.push(per);
				});
			});

			const filteredPeriods = periods.filter((period) => {
				return !(allPeriods.includes(period.term));
			});
			return filteredPeriods.length > 0;
		});
		if (treatmentSites.length > 1) {
			treatmentSites.push({ term: 'Same for all sites' });
		}
		return treatmentSites;
	};

	const getAllPeriods = (s) => {
		if (!s) return [];
		const allPeriods = timeVocabs?.periodsVocab?.filter((prd) => {
			return prd.sites.find((site) => site.term === s.term);
		});
		if (!allPeriods || allPeriods?.length === 0) {
			return [{ term: 'Unspecified' }];
		} 
		return allPeriods;
	};

	const getPeriods = (s) => {
		if (!s) return [];
		if (s.term === 'Same for all sites') {
			return [{ term: 'Same for all time periods' }];
		}
		const periods = getAllPeriods(s);
		const foundSites = sitePeriodPairs.filter((pair) => {
			return pair.site.id === s.id;
		});
		if (foundSites.length > 0) {
			// look in periods for each instance. take only already selected periods
			return periods.filter((period) => {
				return foundSites.find((pair) => { return !(pair.period.includes(period.term)); });
			});
		}
		if (periods.length === 0) {
			periods.push({ term: 'Unspecified' });
		}
		return periods;
	};

	useEffect(
		() => {
			if (stepValues instanceof Map && stepValues.size > 0) {
				if (!(items instanceof Map)) {
					const pairs = stepValues.get('selected-pairs-index');
					if (pairs && sitePeriodPairs.length === 0) {
						setSitePeriodPairs(pairs);
					}

					if (id) {
						const temp = stepValues.get(id);
						if (temp) {
							const tempStep = temp.get(configuration.id);
							if (tempStep.size > 0) {
								setItems(tempStep);
								// setAutoExpand(false);
							} else {
								setItems(new Map());
							}
						}
					} else {
						const tempStep = stepValues.get(configuration.id);
						if (tempStep.size > 0) {
							setItems(tempStep);
							// setAutoExpand(false);
						} else {
							setItems(new Map());
						}
					}
				}
			}
		}, [stepValues]
	);

	useEffect(
		() => {
			if (stepValues instanceof Map && items?.size > 0) {
				const newValues = new Map(stepValues);
				if (id) {
					const temp = newValues.get(id);
					temp.set(configuration.id, items);
					newValues.set(id, temp);
					setStepValues(newValues);
				} else {
					newValues.set(configuration.id, items);
					if (sitePeriodPairs.length > 0) {
						newValues.set('selected-pairs-index', sitePeriodPairs);
					}
					setStepValues(newValues);
				}
			} else if (items instanceof Map && items?.size === 0) {
				const sites = getSites();
				const periods = getPeriods(sites[0]);
				if (sites.length === 1 && periods.length === 1) {
					addItem(sites[0], [periods[0]]);
				}
			}
		}, [items, sitePeriodPairs]
	);

	useEffect(() => {
		if (items?.size === 1) {
			const rowKey = Array.from(items.keys())[0];
			const temp = {};
			temp[rowKey] = true;
			setExpandedRows(temp);
		}
	}, [items]);

	//
	// useEffect(() => {
	// 	if (!autoExpand) return;
	// 	if (disabled) return;
	//
	// 	if (siteValue && periodValue && items instanceof Map) {
	// 		const u_id = addItem();
	// 		const temp = {};
	// 		temp[u_id] = true;
	// 		setExpandedRows(temp);
	// 		setAutoExpand(false);
	// 	}
	// }, [autoExpand, disabled]);

	// useEffect(() => {
	//
	// }, [sitePeriodPairs]);

	const deleteItem = (key) => {
		const newItems = new Map(items);
		const index = sitePeriodPairs.findIndex((site) => site.rowKey === key);
		const temp = [...sitePeriodPairs];
		temp.splice(index, 1);
		setSitePeriodPairs(temp);
		newItems.delete(key);
		setItems(newItems);
	};

	const addItem = (siteVal, periodVal) => {
		const u_id = createId();
		const newItems = new Map(items);
		const rowValues = new Map();
		const statusMap = new Map(validationContextValue.validationStatus);

		configuration.content.forEach((item) => {
			if (item.data === 'table') {
				rowValues.set(item.id, new Map());
			} else if (item.data) {
				rowValues.set(item.id, makeValueObject());
				if (item.validation && !disabled) {
					const val = validationArray.find((field) => field.id === item.id);
					if (val?.mandatory) {
						statusMap.set(`${u_id}_${val.id}`, false);
					}
				}
			}
		});
		rowValues.set(configuration.columns[0].id, makeValueObject(siteVal, u_id));
		rowValues.set(configuration.columns[1].id, makeValueObject(periodVal, u_id));
		setSitePeriodPairs([...sitePeriodPairs, { rowKey: u_id, site: siteVal, period: periodVal.map((val) => { return val.term; }) }]);
		// const transformedPeriods = findPairedRows(helperContextValue, siteVal, periodVal);
		// addLockedEntities(helperContextValue, [{ entityParam: transformedPeriods, entityType: 'seasonalPairs', entityAssociate: [u_id, associates.treatmentId, associates.practiceId] }], 'add');

		newItems.set(u_id, rowValues);
		setItems(newItems);
		setPeriodValue(undefined);
		setSiteValue(undefined);
		setAddDialog(false);
		return u_id;
	};

	const disableHeader = () => {
		if (disabled) return disabled;
		return getSites().length === 0;
	};

	const header = (
		<div className="table-header">
			<Button icon="pi pi-plus" disabled={disableHeader()} label={translate(t, configuration.headerButtonLabel)} className="p-mr-2" onClick={() => setAddDialog(true)} />
		</div>
	);

	const renderFields = (data) => {
		return configuration.content.map((item) => {
			return (
				<Field configuration={item} parent="seasonal" stepValues={items} setStepValues={setItems} id={data.key} disabled={disabled} compositeId={`${compositeId}_${configuration.id}_${data.key}`} siteId={siteId} cropCount={cropCount} />
			);
		});
	};

	const columnComponents = configuration.columns.map((col) => {
		return (
			<Column key={col.field} field={col.label} header={translate(t, col.label)} body={(data) => practiceColumnTemplate(data, col.id)} />
		);
	});

	const practiceColumnTemplate = (data, colId) => {
		if (data.value instanceof Map) {
			const colValue = data.value.get(colId).value;
			if (colValue instanceof Array) {
				return colValue.map((dat) => {
					return dat.term;
				}).join(', ');
			}
			return translate(t, colValue.term);
		}
		if (data.value) {
			return data.value.value;
		}
		return null;
	};
	const rowExpansionTemplate = (data) => {
		return (
			<div className={configuration.multiColumn ? 'forms p-grid multi-column' : 'forms p-grid'}>
				{renderFields(data)}
			</div>
		);
	};

	const deleteRow = (data) => (
		<div className="actions">
			<Button
				id="delete"
				icon="fa-solid fa-xmark"
				className="delete-button"
				onClick={(e) => confirmPopup({
					target: e.currentTarget,
					message: translate(t, configuration.deleteMessage),
					icon: 'pi pi-info-circle',
					acceptClassName: 'p-button-danger',
					accept: () => {
						deleteItem(data.key);
					},
					reject: () => {},
					acceptLabel: translate(t, 'Yes'),
					rejectLabel: translate(t, 'No'),
				})}
				disabled={disabled}
			/>
		</div>
	);

	return (
		<div className="expandable-table select-table">
			<ConfirmPopup />
			<DataTable
				value={mapToArray(items)}
				expandedRows={expandedRows}
				onRowToggle={(e) => setExpandedRows(e.data)}
				rowExpansionTemplate={rowExpansionTemplate}
				dataKey="key"
				header={configuration.headerButtonLabel ? header : null}
				id="expandable"
				emptyMessage={translate(t, 'No results found')}
			>
				{configuration.editable ? <Column key="deleteRow" body={deleteRow} style={configuration.editable ? { width: '100px' } : { width: '70px' }} /> : null}
				<Column expander style={{ width: '3em' }} />
				{columnComponents}
			</DataTable>
			<AddDialog siteId={siteId} addDialog={addDialog} setAddDialog={setAddDialog} getSites={getSites} getPeriods={getPeriods} periodValue={periodValue} setPeriodValue={setPeriodValue} siteValue={siteValue} setSiteValue={setSiteValue} addItem={addItem} />
		</div>
	);
};

export default SeasonalTable;
