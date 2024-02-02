/* eslint-disable class-methods-use-this */
import { http } from '../index';

class AdministratorServices {
	getAllSubmissions = async () => {
		const result = await http.get(`/api/admin/getSubmissions`);
		return result.data;
	};
}

export default new AdministratorServices();
