import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import si from './i18n/si';
import ta from './i18n/ta';

i18next.addResourceBundle('en', 'ShippingMethods', en);
i18next.addResourceBundle('si', 'ShippingMethods', si);
i18next.addResourceBundle('ta', 'ShippingMethods', ta);

const ShippingMethodsComponent = lazy(() => import('./ShippingMethods'));

const ShippingMethods = {
	settings: {
		layout: {}
	},
	permission: 'SHIPPING_METHODS',
	routes: [
		{
			path: 'shipping/shipping-methods',
			element: <ShippingMethodsComponent />
		}
	]
};

export default ShippingMethods;
