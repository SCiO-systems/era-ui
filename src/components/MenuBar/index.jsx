/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Ripple } from 'primereact/ripple';
import { useTranslate } from '@tolgee/react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Actions } from '../../reducer/actions';
import Logo from '../../assets/images/logo.png';
import './styles.css';
import { http } from '../../services/httpService';
import LangSelector from '../LangSelector';
import { translate } from '../../utils';
import { HelperContext } from '../../context';

const MenuBar = (props) => {
	const { setLoading } = props;
	const { t } = useTranslate();

	const dispatch = useDispatch();

	const location = useLocation();

	const navigate = useNavigate();

	const accessToken = useSelector((state) => state.accessToken);

	const currentPage = useSelector((state) => state.currentPage);
	const setCurrentPage = (payload) => dispatch({ type: Actions.SetCurrentPage, payload });

	const setAccessToken = (payload) => dispatch({ type: Actions.SetAccessToken, payload });

	const setUserId = (payload) => dispatch({ type: Actions.SetUserId, payload });

	const setRole = (payload) => dispatch({ type: Actions.SetRole, payload });
	const { helperContextValue } = useContext(HelperContext);

	const [showProfileMenu, setShowProfileMenu] = useState(false);

	const [left, setLeft] = useState(null);
	const [bottom, setBottom] = useState(null);
	const [width, setWidth] = useState(0);
	const [targetPage, setTargetPage] = useState();

	useEffect(
		() => {
			let element;
			let rect;
			if (document.getElementById(currentPage)) {
				element = document.getElementById(currentPage);
				rect = element.getBoundingClientRect();
				setLeft(rect.left);
				setBottom(rect.bottom);
				setWidth(rect.right - rect.left);
			} else {
				setWidth(0);
			}
		}, [currentPage]
	);

	const renderLogin = () => {
		if (!accessToken) {
			return (
				<div
					className="cell"
					id="login"
					onClick={() => {
						window.location.href = process.env.REACT_APP_LOGIN_REDIRECT_URL;
					}}
				>
					<p>{translate(t, 'Login')}</p>
				</div>
			);
		}
		return (
			<div className="cell" id="login">
				<div className="card" style={showProfileMenu ? { display: 'flex' } : { display: 'none' }}>
					<div>
						<div className="selection-group">
							<i className="fas fa-user" />
							<p>{translate(t, 'Profile')}</p>
						</div>
						<div
							className="cell selection-group"
							id="logout"
							onClick={() => {
								// authService.logout(localStorage.getItem('userId'));
								window.location.href = process.env.REACT_APP_LOGOUT_REDIRECT_URL;
								setShowProfileMenu(false);
								setLoading(true);
								http.defaults.headers.common.Authorization = `Bearer`;
								localStorage.removeItem('accessToken');
								localStorage.removeItem('userId');
								localStorage.removeItem('role');
								setRole('');
								setAccessToken('');
								setUserId('');
							}}
						>
							<i className="far fa-sign-in" />
							<p>{translate(t, 'Logout')}</p>
						</div>
					</div>
				</div>
				<i className="fas fa-user-circle" onClick={() => setShowProfileMenu(!showProfileMenu)} />
			</div>
		);
	};

	const promptUnload = (route) => {
		if (location.pathname === '/EditResource' && helperContextValue.editing.hasChanges) {
			setTargetPage(route);
		} else {
			setPage(route);
		}
	};

	const setPage = (route) => {
		helperContextValue?.setEditing({ editMode: null, editBy: 'null' });
		switch (route) {
		case '/Home':
			setCurrentPage('home');
			navigate('/Home');
			setTargetPage(null);
			break;
		case '/Dashboard':
			setCurrentPage('dashboard');
			navigate('/Dashboard');
			setTargetPage(null);
			break;
		case '/About':
			setCurrentPage('about');
			navigate('/About');
			setTargetPage(null);
			break;
		case '/Data':
			setCurrentPage('data');
			navigate('/Data');
			setTargetPage(null);
			break;
		default:
			break;
		}
	};

	const footer = () => {
		return (
			<div>
				<Button label={translate(t, 'Confirm')} onClick={() => setPage(targetPage)} />
				<Button label={translate(t, 'Cancel')} onClick={() => setTargetPage(null)} />
			</div>
		);
	};

	return (
		<div className="menu-bar p-grid">
			<div className="logo cell p-col-1">
				{/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
				<img
					src={Logo}
					alt="logo"
					onClick={() => {
						promptUnload('/Home');
					}}
				/>
			</div>
			<div className="buttons cell p-col">
				<div
					className="p-ripple"
					onClick={() => {
						promptUnload('/Home');
					}}
					id="home"
				>
					<p style={currentPage === 'home' ? { color: '#fdc100' } : {}}>{translate(t, 'Home')}</p>
					<Ripple />
				</div>
				<div
					className="p-ripple"
					onClick={() => {
						promptUnload('/About');
					}}
					id="about"
				>
					<p style={currentPage === 'about' ? { color: '#fdc100' } : {}}>{translate(t, 'About')}</p>
					<Ripple />
				</div>
				{accessToken
					? 				(
						<>
							<div
								className="p-ripple"
								onClick={() => {
									promptUnload('/Dashboard');
								}}
								id="dashboard"
							>
								<p style={currentPage === 'dashboard' ? { color: '#fdc100' } : {}}>{translate(t, 'Dashboard')}</p>
								<Ripple />
							</div>
							<div
								className="p-ripple"
								onClick={() => {
									promptUnload('/Data');
								}}
								id="data"
							>
								<p style={currentPage === 'data' ? { color: '#fdc100' } : {}}>{translate(t, 'Data')}</p>
								<Ripple />
							</div>
						</>
					)
					: null}

				<div className="bar" style={{ left, width, top: (bottom - 2), transition: 'left 0.3s' }} />
			</div>
			<div />
			<div className="cell right-menu p-lg-offset-6 p-md-offset-4 p-sm-offset-2">
				<LangSelector />
				{renderLogin()}
				<Dialog className="navigation-prompt" onHide={() => { setTargetPage(null); }} visible={targetPage} closable={false} closeOnEscape={false} footer={footer}>
					<p>{translate(t, 'Are you sure you want to leave the study editor? You have unsaved changes.', 'leave-popup-message')}</p>
				</Dialog>
			</div>
		</div>
	);
};

export default MenuBar;
