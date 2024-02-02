/* eslint-disable max-len */
import React, { useEffect } from 'react';
import { useTranslate } from '@tolgee/react';
import './styles.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Actions } from '../../reducer/actions';
import { http } from '../../services/httpService';
import AuthService from '../../services/httpService/authServices';
import { translate } from '../../utils';

const Home = (props) => {
	const { t } = useTranslate();

	const { setLoading } = props;

	const navigate = useNavigate();

	const dispatch = useDispatch();
	const setAccessToken = (payload) => dispatch({ type: Actions.SetAccessToken, payload });

	const setRole = (payload) => dispatch({ type: Actions.SetRole, payload });

	const setUserId = (payload) => dispatch({ type: Actions.SetUserId, payload });

	const setCurrentPage = (payload) => dispatch({ type: Actions.SetCurrentPage, payload });

	useEffect(
		() => {
			setLoading(true);
			const temp = window.location.hash.split('=');
			if (temp.length < 2) {
				const savedUID = localStorage.getItem('userId');
				if (savedUID) {
					http.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem('accessToken')}`;
					http.defaults.headers.common.User = `${savedUID}`;
					AuthService.validate()
						.catch((error) => {
							if (error.response.status === 401) {
								setAccessToken(null);
								setRole(null);
								setUserId(null);
								localStorage.removeItem('accessToken');
								localStorage.removeItem('role');
								localStorage.removeItem('userId');
							}
						})
						.finally(() => {
							setLoading(false);
						});
				} else {
					setLoading(false);
				}
			} else {
				setLoading(false);
				const token = temp[1]?.split('&')[0];
				if (token) {
					http.defaults.headers.common.Authorization = `Bearer ${token}`;
					localStorage.setItem('accessToken', token);
					setAccessToken(token);
					setCurrentPage('home');
					navigate('/Home');
				}

				const role = temp[3]?.split('&')[0];
				if (role) {
					localStorage.setItem('role', role);
					setRole(role);
					setCurrentPage('home');
					navigate('/Home');
				}

				const userId = temp[2]?.split('&')[0];
				if (userId) {
					http.defaults.headers.common.User = `${userId}`;
					localStorage.setItem('userId', userId);
					const temp2 = userId.replace('%7C', '|');
					setUserId(temp2);
					setCurrentPage('home');
					navigate('/Home');
				}
			}
		}, []
	);

	return (
		<div className="home p-grid">
			<div className="image cell p-col-12" />
			<div className="text cell p-col-8 p-offset-2">
				<h3>{translate(t, 'Evidence for Resilient Agriculture (ERA)', 'home-title')}</h3>
				<p>{translate(t, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit, vulputate eu pharetra nec, mattis ac neque. Duis vulputate commodo lectus, ac blandit elit tincidunt id. Sed rhoncus, tortor sed eleifend tristique, tortor mauris molestie elit, et lacinia ipsum quam nec dui. Quisque nec mauris sit amet elit iaculis pretium sit amet quis magna.', 'home-body')}</p>
			</div>
			<div className="cell p-col-12" />
		</div>
	);
};

export default Home;
