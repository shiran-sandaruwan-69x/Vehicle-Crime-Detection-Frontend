import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import si from './i18n/si';
import ta from './i18n/ta';

i18next.addResourceBundle('en', 'backOrders', en);
i18next.addResourceBundle('si', 'backOrders', si);
i18next.addResourceBundle('ta', 'backOrders', ta);

const BackOrdersHistory = lazy(() => import('./BackOrdersHistory'));

const BackOrdersHistoryConfig = {
	settings: {
		layout: {}
	},
	permission: 'BACK ORDERS HISTORY',
	routes: [
		{
			path: 'order-management/back-orders-history',
			element: <BackOrdersHistory />
		}
	]
};

export default BackOrdersHistoryConfig;
