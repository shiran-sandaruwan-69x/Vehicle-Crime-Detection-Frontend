import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import si from './i18n/si';
import ta from './i18n/ta';

i18next.addResourceBundle('en', 'AdditionalCost', en);
i18next.addResourceBundle('si', 'AdditionalCost', si);
i18next.addResourceBundle('ta', 'AdditionalCost', ta);

const AdditionalCost = lazy(() => import('./AdditionalCost'));

const AdditionalCostConfig = {
	settings: {
		layout: {}
	},
	permission: 'ADDITIONAL_COST',
	routes: [
		{
			path: 'shipping/additional-cost',
			element: <AdditionalCost />
		}
	]
};

export default AdditionalCostConfig;
