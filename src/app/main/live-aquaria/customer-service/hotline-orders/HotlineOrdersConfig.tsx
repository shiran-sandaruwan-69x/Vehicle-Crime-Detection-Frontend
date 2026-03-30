import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import si from './i18n/si';
import ta from './i18n/ta';

i18next.addResourceBundle('en', 'hotlineOrders', en);
i18next.addResourceBundle('si', 'hotlineOrders', si);
i18next.addResourceBundle('ta', 'hotlineOrders', ta);

const HotlineOtrdersComponent = lazy(() => import('./HotlineOrders'));
const CaseReportForm = lazy(() => import('./components/CaseReportForm'));

const HotlineOrderConfig = {
	settings: {
		layout: {}
	},
	permission: 'HOTLINE_ORDERS',
	routes: [
		{
			path: 'report/generate-case-report',
			element: <HotlineOtrdersComponent />
		},
		{
			path: 'report/generate-case-report/details',
			element: <CaseReportForm />
		}
	]
};

export default HotlineOrderConfig;
