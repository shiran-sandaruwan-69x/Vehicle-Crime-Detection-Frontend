import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import si from './i18n/si';
import ta from './i18n/ta';

i18next.addResourceBundle('en', 'storePickupOptions', en);
i18next.addResourceBundle('si', 'storePickupOptions', si);
i18next.addResourceBundle('ta', 'storePickupOptions', ta);

const StorePickupOptions = lazy(() => import('./StorePickupOptions'));

const StorePickupOptionsConfig = {
	settings: {
		layout: {}
	},
	permission: 'LAQ_MASTER_DATA',
	routes: [
		{
			path: 'laq-master-data/store-pickup-options',
			element: <StorePickupOptions />
		}
	]
};

export default StorePickupOptionsConfig;
