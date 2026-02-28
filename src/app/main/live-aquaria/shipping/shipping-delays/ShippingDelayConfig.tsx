import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import si from './i18n/si';
import ta from './i18n/ta';

i18next.addResourceBundle('en', 'ShippingDelays', en);
i18next.addResourceBundle('si', 'ShippingDelays', si);
i18next.addResourceBundle('ta', 'ShippingDelays', ta);

const ShippingDelay = lazy(() => import('./ShippingDelay'));

const ShippingDelayConfig = {
	settings: {
		layout: {}
	},
	permission: 'SHIPPING_DELAY',
	routes: [
		{
			path: 'shipping/shipping-holds',
			element: <ShippingDelay />
		}
	]
};

export default ShippingDelayConfig;
