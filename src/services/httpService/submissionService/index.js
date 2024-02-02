/* eslint-disable class-methods-use-this */
import { http } from '../index';

class SubmissionService {
	addNewSubmission = async (userId) => {
		return http.post(`/api/submission/new`, {
			user_id: userId,
		});
	};

	uploadPdf = async (pdf, userId, submissionId) => {
		const form = new FormData();
		form.append('pdf', pdf);
		form.append('user_id', userId);
		form.append('submission_id', submissionId);
		return http.post(`/api/submission/uploadPdf`, form, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
			skipInterceptor: true,
		});
	};

	getSubmission = async (submission_id) => {
		return http.get(`/api/submission/${submission_id}/get`);
	};

	submitSubmission = async (submission_id) => {
		return http.patch(`/api/submission/submit`, {
			submission_id,
		});
	};

	editSubmission = async (json, userId, editing, validation) => {
		const getStatus = (editValue, valid) => {
			if (editValue.editBy === 'user') {
				if (valid) {
					return 'READY';
				} 
				return 'DRAFT';
			} if (editValue.editBy === 'reviewer') {
				if (valid) {
					return 'SUBMITTED';
				}
				return 'REVIEWER DRAFT';
			}
			return '';
		};

		return http.patch(`/api/submission/edit`, {
			submission_id: editing.submissionId,
			status: getStatus(editing, validation),
			form_data: json.formData,
			study_title: json.studyTitle,
			edit_by: editing.editBy,
			user_id: userId,
		});
	};

	deleteSubmission = async (submission_id) => {
		return http.delete(`/api/submission/${submission_id}/delete`);
	};

	checkSubmission = async (submission_id) => {
		return http.get(`/api/submission/${submission_id}/checkSubmission`);
	};

	approveSubmission = async (submission_id, userId) => {
		return http.patch(`/api/submission/approve`, {
			submission_id,
			user_id: userId,
		});
	};

	rejectSubmission = async (submission_id, userId) => {
		return http.patch(`/api/submission/reject`, {
			submission_id,
			user_id: userId,
		});
	};
}

export default new SubmissionService();
