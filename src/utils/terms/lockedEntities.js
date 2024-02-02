/**
 * Add to list of locked entities.
 * of locked entities.
 * @param lockedEntities
 * @param entityArr Array of objects with entityParam, row id or array of row ids, and entityType, type to be acted on.
 * @param addType
 */
const addLockedEntities = (lockedEntities, entityArr, addType) => {
	const newLockedEntities = { ...lockedEntities };
	entityArr.forEach((entity) => {
		const { entityParam, entityType, entityAssociate } = entity;
		let entityArray;
		if (entityParam && !(entityParam instanceof Array)) {
			entityArray = [entityParam];
		} else if (entityParam) {
			entityArray = entityParam;
		} else {
			entityArray = [];
		}
		if (entityArray.length > 0) {
			let entities;
			if (addType === 'add') {
				entities = [...lockedEntities[entityType]];
			} else if (addType === 'rebuild') {
				entities = [];
			}
			entityArray.forEach((s) => {
				if (entityAssociate) {
					const ind = entities.findIndex((e) => e.id === s.id);
					if (ind > -1) {
						if (entityAssociate instanceof Array) {
							entityAssociate.forEach((associate) => {
								if (!(entities[ind].associates.includes(associate))) {
									entities[ind].associates.push(associate);
								}
							});
						} else if (!(entities[ind].associates.includes(entityAssociate))) {
							entities[ind].associates.push(entityAssociate);
						}
					} else {
						const associates = entityAssociate instanceof Array ? entityAssociate : [entityAssociate];
						entities.push({ id: s.id, associates });
					}
				} else if (!entities.includes(s.id)) {
					entities.push(s.id);
				}
			});
			newLockedEntities[entityType] = entities;
		} else {
			newLockedEntities[entityType] = [];
		}
	});
	return newLockedEntities;
};

const deleteLockedEntities = (lockedEntities, entityArr) => {
	const newLockedEntities = { ...lockedEntities };
	entityArr.forEach((entity) => {
		const { entityParam, entityType } = entity;
		let entityArray;
		if (!(entityParam instanceof Array)) {
			entityArray = [entityParam];
		} else {
			entityArray = entityParam;
		}
		const entities = [...lockedEntities[entityType]];
		entityArray.forEach((s) => {
			const ind = entities.indexOf(s.id);
			if (ind > -1) {
				entities.splice(ind, 1);
			}
		});
		newLockedEntities[entityType] = entities;
	});

	return newLockedEntities;
};

const deleteAssociates = (lockedEntities, entityType, associateArr) => {
	const newLockedEntities = { ...lockedEntities };
	entityType.forEach((type) => {
		let entityArr = newLockedEntities[type];
		entityArr = entityArr.map((entity) => {
			const temp = entity;
			const tempAssociate = temp.associates;
			let associateArray;
			if (!(associateArr instanceof Array)) {
				associateArray = [associateArr];
			} else {
				associateArray = associateArr;
			}
			associateArray.forEach((associate) => {
				const ind = tempAssociate.indexOf(associate);
				if (ind > -1) {
					tempAssociate.splice(ind, 1);
				}
			});
			temp.associates = tempAssociate;
			if (tempAssociate.length === 0) {
				temp.empty = true;
			}
			return temp;
		});
		entityArr = entityArr.filter((entity) => !(entity.empty));
		newLockedEntities[type] = entityArr;
	});

	return newLockedEntities;
};

const deleteAssociatesTargeted = (lockedEntities, entityArr) => {
	const newLockedEntities = { ...lockedEntities };

	entityArr.forEach((entity) => {
		const { entityParam, entityType, entityAssociate } = entity;
		const entities = [...lockedEntities[entityType]];
		entityParam.forEach((s) => {
			const ind = entities.findIndex((e) => e.id === s.id);
			const associates = [...entities[ind].associates];
			const ind2 = associates.indexOf(entityAssociate);
			associates.splice(ind2, 1);
			if (associates.length === 0) {
				entities[ind].empty = true;
			}
			entities[ind].associates = associates;
		});
		newLockedEntities[entityType] = entities.filter((e) => !(e.empty));
	});

	return newLockedEntities;
};

const performLockedAction = (helperContext, actionArr) => {
	let newLockedEntities = { ...helperContext.lockedEntities };
	actionArr?.forEach((action) => {
		switch (action.type) {
		case 'add':
			newLockedEntities = addLockedEntities(newLockedEntities, action.entityArr, 'add');
			break;
		case 'rebuild':
			newLockedEntities = addLockedEntities(newLockedEntities, action.entityArr, 'rebuild');
			break;
		case 'delete':
			newLockedEntities = deleteLockedEntities(newLockedEntities, action.entityArr);
			break;
		case 'delete-all-associates':
			newLockedEntities = deleteAssociates(newLockedEntities, action.entityType, action.entityArr);
			break;
		case 'delete-target-associates':
			newLockedEntities = deleteAssociatesTargeted(newLockedEntities, action.entityArr);
			break;
		default:
			break;
		}
	});
	helperContext.setLockedEntities(newLockedEntities);
};

export default performLockedAction;
