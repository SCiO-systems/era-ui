/* eslint-disable max-len */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PrimeReact from 'primereact/api';
import Gleap from 'gleap';
import { useDispatch } from 'react-redux';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import Home from './pages/Home';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import EditResource from './pages/EditResource';
import MenuBar from './components/MenuBar';
import Footer from './components/Footer';
import Data from './pages/Data';
import './App.css';
import '@fortawesome/fontawesome-pro/css/all.css';
import '@fortawesome/fontawesome-pro/css/sharp-solid.css';
import { Actions } from './reducer/actions';
import { http } from './services/httpService';
import { HelperContext } from './context';
import Overlay from './components/Overlay';

PrimeReact.ripple = true;

const App = () => {
	// const { isAuthenticated, login, logout } = useAuth();
	const dispatch = useDispatch();

	const toast = useRef(null);
	
	const setAccessToken = (payload) => dispatch({ type: Actions.SetAccessToken, payload });

	const setRole = (payload) => dispatch({ type: Actions.SetRole, payload });

	const setCurrentPage = (payload) => dispatch({ type: Actions.SetCurrentPage, payload });

	const setUserId = (payload) => dispatch({ type: Actions.SetUserId, payload });

	const [loginDialog, setLoginDialog] = useState(false);

	const [toastState, setToastState] = useState({});

	useEffect(
		() => {
			const page = window.location.hash.split('/')[1];
			setCurrentPage(page.toLocaleLowerCase());
			const token = localStorage.getItem('accessToken');
			if (token) {
				setAccessToken(token);
				http.defaults.headers.common.Authorization = `Bearer ${token}`;
			}
			const role = localStorage.getItem('role');
			if (role) {
				setRole(role);
			}
			let userId = localStorage.getItem('userId');
			if (userId) {
				userId = userId.replace('%7C', '|');
				setUserId(userId);
			}
			if (process.env.REACT_APP_ENVIRONMENT !== 'env') {
				Gleap.initialize('XHenT2sOxX7PRJcO7m8Zg4vXp6g0yy4b');
			}
		}, []
	);

	useEffect(() => {
		if (toastState.severity) {
			toast.current.show({ severity: toastState.severity, summary: `${toastState.status}`, detail: `${toastState.message}`, life: 2000 });
		}
	}, [toastState]);

	useEffect(() => {
		const reqInterceptor = http.interceptors.request.use(
			(response) => {
				if (!response.skipInterceptor) {
					setLoading(true);
				}
				return response;
			},
			(error) => {
				return Promise.reject(error);
			}
		);
		const respInterceptor = http.interceptors.response.use(
			(response) => {
				if (response.headers['refresh-token'] && response.headers['refresh-token'] !== '0') {
					console.log(response.headers['refresh-token']);
					localStorage.setItem('accessToken', response.headers['refresh-token']);
				}
				setLoading(false);
				return response;
			},
			(error) => {
				if (error.response) {
					if (!error.config.url.endsWith('validate')) {
						if (error.response.status === 401) {
							setLoginDialog(true);
						}
						const toastConfig = { severity: 'error', status: error.response.status, message: error.response.data.errorMessage };
						setToastState(toastConfig);
					}
				}
				return Promise.reject(error);
			}
		);
		return () => {
			http.interceptors.request.eject(reqInterceptor);
			http.interceptors.response.eject(respInterceptor);
		};
	}, []);

	const clearLoginAndRedirect = () => {
		localStorage.removeItem('accessToken');
		localStorage.removeItem('userId');
		localStorage.removeItem('role');
		setRole('');
		setAccessToken('');
		setUserId('');
		setCurrentPage('home');
		setLoginDialog(false);
	};

	const [helperState, setHelperState] = useState({ sitesChanged: true, relevantDiets: [], varietyCrop: '', outcomeId: 1, selectedColumnsTracker: true });
	const [timeVocabs, setTimeVocabs] = useState();
	const [editing, setEditing] = useState({ editMode: 'new', editBy: 'user' });
	const [activeDashboard, setActiveDashboard] = useState(0);
	const [lockedEntities, setLockedEntities] = useState({ treatmentSites: [], timeSites: [], timePeriods: [], timePairs: [] });

	const helperContextValue = useMemo(() => ({
		helperState,
		setHelperState,
		timeVocabs,
		setTimeVocabs,
		editing,
		setEditing,
		activeDashboard,
		setActiveDashboard,
		lockedEntities,
		setLockedEntities,
	}), [helperState, timeVocabs, editing, activeDashboard, lockedEntities]);

	const [loading, setLoading] = useState(false);

	return (
		<Router>
			{loading ? <Overlay /> : null}
			<HelperContext.Provider
				value={{
					helperContextValue,
				}}
			>
				<MenuBar setLoading={setLoading} />
				<Routes>
					<Route exact path="/" element={<Navigate replace to="/Home" />} />
					<Route path="/Home" element={<Home setLoading={setLoading} />} />
					<Route path="/About" element={<About />} />
					<Route path="/Dashboard" element={<Dashboard />} />
					<Route path="/Data" element={<Data />} />
					<Route path="/EditResource" element={<EditResource />} />
					{/* <Route path="/Login" element={<LogIn />} /> */}
					{/* <Route path="/fetch-data" component={isAuthenticated ? <FetchData /> : () => { login(); return null; }} /> */}
					{/* <Route path="/login" component={() => { login(); return null; }} /> */}
					{/* <Route path="/logout" component={() => { logout(); return null; }} /> */}
				</Routes>
			</HelperContext.Provider>
			<Footer />
			<Dialog className="login-dialog" header="Authorization Failed" visible={loginDialog} style={{ width: '50vw' }} onHide={() => setLoginDialog(false)}>
				<p className="m-0">Login failed message.</p>
				<div className="login-dialog-buttons">
					<Button
						label="Retry Login"
						onClick={() => {
							window.location.href = process.env.REACT_APP_LOGIN_REDIRECT_URL;
						}}
					/>
					<Button
						label="Return to Home"
						onClick={() => {
							if (editing?.editMode === 'edit' && editing?.hasChanges) {
								// const study = makeStudyJson(globalDataContextValue, reviewContextValue, helperContextValue);
								// localStorage.setItem('submissionContentCache', JSON.stringify(study.formData));
								// localStorage.setItem('cachedSubmissionId', helperContextValue.editing.submissionId);
							}
							clearLoginAndRedirect();
						}}
					/>
				</div>
			</Dialog>
			<Toast ref={toast} />
		</Router>

	);
};

export default App;
