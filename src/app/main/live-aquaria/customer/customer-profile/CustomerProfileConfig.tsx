import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import si from './i18n/si';
import ta from './i18n/ta';

i18next.addResourceBundle('en', 'customerProfile', en);
i18next.addResourceBundle('si', 'customerProfile', si);
i18next.addResourceBundle('ta', 'customerProfile', ta);

const CustomerProfile = lazy(() => import('./CustomerProfile'));

const CustomerProfileConfig = {
	settings: {
		layout: {}
	},
	permission: 'CUSTOMER_PROFILE',
	routes: [
		{
			path: 'customers/customer-view',
			element: <CustomerProfile />
		}
	]
};

export default CustomerProfileConfig;
