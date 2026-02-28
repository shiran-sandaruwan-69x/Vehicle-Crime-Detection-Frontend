import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import si from './i18n/si';
import ta from './i18n/ta';

i18next.addResourceBundle('en', 'ShippingSchedule', en);
i18next.addResourceBundle('si', 'ShippingSchedule', si);
i18next.addResourceBundle('ta', 'ShippingSchedule', ta);

const ShippingSchedule = lazy(() => import('./ShippingSchedule'));

const ShippingScheduleConfig = {
	settings: {
		layout: {}
	},
	permission: 'SHIPPING_SCHEDULE',
	routes: [
		{
			path: 'shipping/shipping-schedule',
			element: <ShippingSchedule />
		}
	]
};

export default ShippingScheduleConfig;
