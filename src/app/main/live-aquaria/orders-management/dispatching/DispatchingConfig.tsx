import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import si from './i18n/si';
import ta from './i18n/ta';

i18next.addResourceBundle('en', 'dispatching', en);
i18next.addResourceBundle('si', 'dispatching', si);
i18next.addResourceBundle('ta', 'dispatching', ta);

const DISPATCHING = lazy(() => import('./Dispatch'));

const DispatchingConfig = {
	settings: {
		layout: {}
	},
	permission: 'DISPATCHING',
	routes: [
		{
			path: 'orders-management/dispatching',
			element: <DISPATCHING />
		}
	]
};

export default DispatchingConfig;
