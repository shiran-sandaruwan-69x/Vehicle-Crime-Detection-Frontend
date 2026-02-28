import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import si from './i18n/si';
import ta from './i18n/ta';

i18next.addResourceBundle('en', 'cancelOrders', en);
i18next.addResourceBundle('si', 'cancelOrders', si);
i18next.addResourceBundle('ta', 'cancelOrders', ta);

const RewardPointSettings = lazy(() => import('./RewardPointSettings'));

const RewardPointSettingsConfig = {
	settings: {
		layout: {}
	},
	permission: 'ORDER_FULFILMENT',
	routes: [
		{
			path: 'system-settings/reward-point-settings',
			element: <RewardPointSettings />
		}
	]
};

export default RewardPointSettingsConfig;
