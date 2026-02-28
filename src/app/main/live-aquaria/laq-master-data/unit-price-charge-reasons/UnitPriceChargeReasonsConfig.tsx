import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import si from './i18n/si';
import ta from './i18n/ta';

i18next.addResourceBundle('en', 'unitPriceChargeReasons', en);
i18next.addResourceBundle('si', 'unitPriceChargeReasons', si);
i18next.addResourceBundle('ta', 'unitPriceChargeReasons', ta);

const UnitPriceChargeReasons = lazy(() => import('./UnitPriceChargeReasons'));

const UnitPriceChargeReasonsConfig = {
	settings: {
		layout: {}
	},
	permission: 'LAQ_MASTER_DATA',
	routes: [
		{
			path: 'laq-master-data/unit-price-charge-reasons',
			element: <UnitPriceChargeReasons />
		}
	]
};

export default UnitPriceChargeReasonsConfig;
