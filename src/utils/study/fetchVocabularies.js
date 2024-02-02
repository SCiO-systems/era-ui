import VocabularyService from '../../services/httpService/vocabularyService';

const fetchVocabularies = (vocabContextData) => {
	let fields;
	let vocabs;
	VocabularyService.fetchFields()
		.then((res) => {
			fields = res.fields;
			VocabularyService.fetchVocabularies()
				.then((res2) => {
					vocabs = res2;
					vocabContextData.setVocabs(vocabs);
					vocabContextData.setFields(fields);
				});
		});
};

export default fetchVocabularies;
