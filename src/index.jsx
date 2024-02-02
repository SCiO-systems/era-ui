import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { Tolgee, DevTools, TolgeeProvider, FormatSimple, BackendFetch } from '@tolgee/react';
import reducer from './reducer/reducer';
import App from './App';
import Overlay from './components/Overlay';

const store = createStore(reducer);

const root = ReactDOM.createRoot(document.getElementById('root'));

const tolgee = Tolgee()
	.use(DevTools())
	.use(FormatSimple())
	.use(BackendFetch())
	.init({
		language: 'en',
		// for development
		apiUrl: 'https://app.tolgee.io',
		apiKey: 'tgpak_gezdook7nzzhi3zzgy2g42buhfyxkn3jhfugg23enntdizlemi',
	});

root.render(
	<React.StrictMode>
		<TolgeeProvider
			tolgee={tolgee}
			fallback={<Overlay />} // loading fallback
		>
			<Provider store={store}>
				<App />
			</Provider>
		</TolgeeProvider>
	</React.StrictMode>
);
