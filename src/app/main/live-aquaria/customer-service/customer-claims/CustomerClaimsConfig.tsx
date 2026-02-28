import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import si from './i18n/si';
import ta from './i18n/ta';

i18next.addResourceBundle('en', 'customerClaims', en);
i18next.addResourceBundle('si', 'customerClaims', si);
i18next.addResourceBundle('ta', 'customerClaims', ta);

const CustomerClaimsComponent = lazy(() => import('./CustomerClaims'));

const CustomerClaimsConfig = {
	settings: {
		layout: {}
	},
	permission: 'CUSTOMER_CLAIMS',
	routes: [
		{
			path: 'customer-service/customer-claims',
			element: <CustomerClaimsComponent />
		}
	]
};

export default CustomerClaimsConfig;
