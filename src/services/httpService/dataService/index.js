/* eslint-disable class-methods-use-this */

import { http } from '../index';

class DataService {
	getDataLink = async (code) => {
		const result = await http.get('api/rdata');
		return result;
	};
}

export default new DataService();
