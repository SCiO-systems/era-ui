/* eslint-disable class-methods-use-this */
import { http } from '../index';

class VocabularyService {
	getVocabularies = async () => {
		const result = await http.get(`/api/staticData`);
		return result.data;
	};

	fetchVocabularies = async () => {
		const result = await http.get(`/api/vocabularies`);
		return result.data;
	};

	fetchFields = async () => {
		const result = await http.get(`/api/fields`);
		return result.data;
	};

	// getAdminLevelByPoint = async (lat, lng, res, lvl) => {
	// 	const result = await http.post(`/api/geoJsonByCoordinates`, {
	// 		latitude: lat,
	// 		longitude: lng,
	// 		resolution_analysis: res,
	// 		admin_level: lvl,
	// 	});
	// 	return result.data;
	// };
}

export default new VocabularyService();
