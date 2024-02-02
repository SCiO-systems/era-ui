/* eslint-disable class-methods-use-this */
import { http } from '../index';

class PublicationService {
	getDataByPublicationCode = async (code) => {
		const result = await http.get(`/api/byPublicationCode/${code}`);
		return result.data;
	};
}

export default new PublicationService();
