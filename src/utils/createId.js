const createId = () => {
	let u_id = '';
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	// eslint-disable-next-line no-plusplus
	for (let i = 0; i < 5; i++) {
		u_id += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return u_id;
};

export default createId;
