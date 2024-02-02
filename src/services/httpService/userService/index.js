/* eslint-disable class-methods-use-this */
import { http } from '../index';

class UserService {
	getAllSubmissions = async (user_id) => {
		const result = await http.get(`/api/user/${user_id}/getSubmissions`);
		return result.data;
	};

	validate = async (user_id) => {
		return http.get(`/api/user/${user_id}/validate`);
	};

	logout = async (user_id) => {
		return http.post(`/api/user/${user_id}/logout`);
	};

	getInitials = async (user_id) => {
		const result = await http.get(`/api/user/${user_id}/getInitials`);
		return result.data;
	};
}

export default new UserService();
