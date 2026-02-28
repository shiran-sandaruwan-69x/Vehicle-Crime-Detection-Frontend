import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import si from './i18n/si';
import ta from './i18n/ta';

i18next.addResourceBundle('en', 'orderStatusMasterForm', en);
i18next.addResourceBundle('si', 'orderStatusMasterForm', si);
i18next.addResourceBundle('ta', 'orderStatusMasterForm', ta);

const OrderStatusMasterForm = lazy(() => import('./OrderStatusMasterForm'));

const OrderStatusMasterFormConfig = {
	settings: {
		layout: {}
	},
	permission: 'LAQ_MASTER_DATA',
	routes: [
		{
			path: 'laq-master-data/dropshipper-order-status',
			element: <OrderStatusMasterForm />
		}
	]
};

export default OrderStatusMasterFormConfig;
