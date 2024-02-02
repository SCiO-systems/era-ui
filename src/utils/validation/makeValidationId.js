const makeValidationId = (configId, id) => {
	let vId;
	if (id) {
		vId = `${id}_${configId}`;
	} else {
		vId = configId;
	}
	return vId;
};

export default makeValidationId;
