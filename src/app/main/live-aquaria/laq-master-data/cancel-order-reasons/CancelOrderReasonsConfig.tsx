import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import si from './i18n/si';
import ta from './i18n/ta';

i18next.addResourceBundle('en', 'cancelOrderReasons', en);
i18next.addResourceBundle('si', 'cancelOrderReasons', si);
i18next.addResourceBundle('ta', 'cancelOrderReasons', ta);

const CancelOrderReasons = lazy(() => import('./CancelOrderReasons'));

const GuaranteeOptionsConfig = {
	settings: {
		layout: {}
	},
	permission: 'LAQ_MASTER_DATA',
	routes: [
		{
			path: 'masterData/system-alert-priority',
			element: <CancelOrderReasons />
		}
	]
};

export default GuaranteeOptionsConfig;
