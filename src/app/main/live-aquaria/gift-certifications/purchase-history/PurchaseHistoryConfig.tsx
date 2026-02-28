import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import si from './i18n/si';
import ta from './i18n/ta';

i18next.addResourceBundle('en', 'purchaseHistory', en);
i18next.addResourceBundle('si', 'purchaseHistory', si);
i18next.addResourceBundle('ta', 'purchaseHistory', ta);

const PurchaseHistory = lazy(() => import('./PurchaseHistory'));

const PurchaseHistoryConfig = {
	settings: {
		layout: {}
	},
	permission: 'PURCHASE_HISTORY',
	routes: [
		{
			path: 'gift-certifications/purchase-history',
			element: <PurchaseHistory />
		}
	]
};

export default PurchaseHistoryConfig;
