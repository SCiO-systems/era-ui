/* eslint-disable react/jsx-no-constructed-context-values */
import { createContext } from 'react';

// export const AuthContext = React.createContext();
export const ReviewContext = createContext();
export const GlobalDataContext = createContext();
export const HelperContext = createContext();
export const VocabulariesContext = createContext();

export const ValidationContext = createContext();
// export const AuthProvider = ({ children }) => {
// 	const [isAuthenticated, setIsAuthenticated] = useState();
// 	const [user, setUser] = useState();
// 	const [isLoading, setIsLoading] = useState(false);
//
// 	const getUser = async () => {
// 		const response = await fetch('/auth/getUser');
// 		const json = await response.json();
//
// 		setIsAuthenticated(json.isAuthenticated);
// 		setIsLoading(false);
// 		if (json.isAuthenticated) setUser(json.claims);
// 	};
//
// 	useEffect(() => {
// 		getUser();
// 	}, []);
//
// 	const login = () => {
// 		window.location.href = '/auth/login';
// 	};
//
// 	const logout = () => {
// 		window.location.href = '/auth/logout';
// 	};
//
// 	return (
// 		<AuthContext.Provider
// 			value={{
// 				isAuthenticated,
// 				user,
// 				isLoading,
// 				login,
// 				logout,
// 			}}
// 		>
// 			{children}
// 		</AuthContext.Provider>
// 	);
