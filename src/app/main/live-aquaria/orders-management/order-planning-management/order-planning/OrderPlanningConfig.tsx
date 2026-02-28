import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import si from './i18n/si';
import ta from './i18n/ta';

i18next.addResourceBundle('en', 'orderPlanning', en);
i18next.addResourceBundle('si', 'orderPlanning', si);
i18next.addResourceBundle('ta', 'orderPlanning', ta);

const OrderPlanningComponent = lazy(() => import('./OrderPlanning'));

const OrderPlanningConfig = {
	settings: {
		layout: {}
	},
	permission: 'ORDER PLANNING',
	routes: [
		{
			path: 'order-management/order-planning',
			element: <OrderPlanningComponent />
		}
	]
};

export default OrderPlanningConfig;
