import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import si from './i18n/si';
import ta from './i18n/ta';

i18next.addResourceBundle('en', 'initialOrderReview', en);
i18next.addResourceBundle('si', 'initialOrderReview', si);
i18next.addResourceBundle('ta', 'initialOrderReview', ta);

const InitialOrderReview = lazy(() => import('./InitialOrderReview'));

const InitialOrderConfig = {
	settings: {
		layout: {}
	},
	permission: 'INITIAL_ORDER_REVIEW',
	routes: [
		{
			path: 'orders-management/initial-order-review',
			element: <InitialOrderReview />
		}
	]
};

export default InitialOrderConfig;
