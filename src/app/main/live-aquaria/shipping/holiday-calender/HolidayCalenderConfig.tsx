import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import si from './i18n/si';
import ta from './i18n/ta';

i18next.addResourceBundle('en', 'holidayCalender', en);
i18next.addResourceBundle('si', 'holidayCalender', si);
i18next.addResourceBundle('ta', 'holidayCalender', ta);

const HolidayCalenderNew = lazy(() => import('./HolidayCalenderNew'));

const HolidayCalenderConfig = {
	settings: {
		layout: {}
	},
	permission: 'SHIPPING_SCHEDULE',
	routes: [
		{
			path: 'shipping/holiday-calender',
			element: <HolidayCalenderNew />
		}
	]
};
export default HolidayCalenderConfig;
