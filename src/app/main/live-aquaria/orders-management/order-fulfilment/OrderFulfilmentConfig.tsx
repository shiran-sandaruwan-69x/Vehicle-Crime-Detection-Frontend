import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import si from './i18n/si';
import ta from './i18n/ta';

i18next.addResourceBundle('en', 'cancelOrders', en);
i18next.addResourceBundle('si', 'cancelOrders', si);
i18next.addResourceBundle('ta', 'cancelOrders', ta);

const CancelOrder = lazy(() => import('./OrderFulfilment'));

const OrderFulfilmentConfig = {
	settings: {
		layout: {}
	},
	permission: 'ORDER_FULFILMENT',
	routes: [
		{
			path: 'orders-management/order-fulfilment',
			element: <CancelOrder />
		}
	]
};

export default OrderFulfilmentConfig;
