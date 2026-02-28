import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import si from './i18n/si';
import ta from './i18n/ta';

i18next.addResourceBundle('en', 'backOrders', en);
i18next.addResourceBundle('si', 'backOrders', si);
i18next.addResourceBundle('ta', 'backOrders', ta);

const BackOrders = lazy(() => import('./BackOrders'));

const BackOrdersConfig = {
	settings: {
		layout: {}
	},
	permission: 'BACK ORDERS',
	routes: [
		{
			path: 'order-management/back-orders',
			element: <BackOrders />
		}
	]
};

export default BackOrdersConfig;
