import { Actions } from './actions';

const initState = {
	currentPage: 'home',
	selectedOption: 'Bibliographic',
	vocabularies: {},
	accessToken: null,
	role: '',
	userId: null,
};

// eslint-disable-next-line default-param-last
const reducer = (currentState = initState, action) => {
	switch (action.type) {
	case Actions.SetCurrentPage:
		return {
			...currentState,
			currentPage: action.payload,
		};
	case Actions.SetSelectedOption:
		return {
			...currentState,
			selectedOption: action.payload,
		};
	case Actions.SetAccessToken:
		return {
			...currentState,
			accessToken: action.payload,
		};
	case Actions.SetRole:
		return {
			...currentState,
			role: action.payload,
		};
	case Actions.SetUserId:
		return {
			...currentState,
			userId: action.payload,
		};
	default: return currentState;
	}
};

export default reducer;
