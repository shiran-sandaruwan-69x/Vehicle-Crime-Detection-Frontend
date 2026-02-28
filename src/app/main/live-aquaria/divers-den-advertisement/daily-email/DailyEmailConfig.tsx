import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import si from './i18n/si';
import ta from './i18n/ta';

i18next.addResourceBundle('en', 'dailyEmail', en);
i18next.addResourceBundle('si', 'dailyEmail', si);
i18next.addResourceBundle('ta', 'dailyEmail', ta);

const DailyEmail = lazy(() => import('./DailyEmail'));

const DailyEmailConfig = {
	settings: {
		layout: {}
	},
	permission: 'DIVERSE_DEN_ADVERTISEMENT',
	routes: [
		{
			path: 'divers-den-management/daily-email',
			element: <DailyEmail />
		}
	]
};

export default DailyEmailConfig;
