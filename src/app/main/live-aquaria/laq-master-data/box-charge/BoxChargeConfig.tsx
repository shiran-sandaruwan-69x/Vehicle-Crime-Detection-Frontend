import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import si from './i18n/si';
import ta from './i18n/ta';

i18next.addResourceBundle('en', 'boxCharge', en);
i18next.addResourceBundle('si', 'boxCharge', si);
i18next.addResourceBundle('ta', 'boxCharge', ta);

const BoxCharge = lazy(() => import('./BoxCharge'));

const BoxChargeConfig = {
	settings: {
		layout: {}
	},
	permission: 'LAQ_MASTER_DATA',
	routes: [
		{
			path: 'masterData/alert-type',
			element: <BoxCharge />
		}
	]
};

export default BoxChargeConfig;
