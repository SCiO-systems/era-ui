/* eslint-disable class-methods-use-this */
import { http } from '../index';

class AuthService {
	validate = async () => {
		return http.get(`/api/oauth/validate`);
	};

	// logout = async (user_id) => {
	// 	return http.get(`/api/oauth/user/${user_id}/logout`);
	// };
	//
	// login = async () => {
	// 	return http.get(`/api/oauth/login`);
	// };
}

export default new AuthService();
