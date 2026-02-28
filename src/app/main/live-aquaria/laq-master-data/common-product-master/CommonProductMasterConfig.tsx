import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import si from './i18n/si';
import ta from './i18n/ta';

i18next.addResourceBundle('en', 'commonProductMaster', en);
i18next.addResourceBundle('si', 'commonProductMaster', si);
i18next.addResourceBundle('ta', 'commonProductMaster', ta);

const CommonProductMaster = lazy(() => import('./CommonProductMaster'));

const CommonProductMasterConfig = {
	settings: {
		layout: {}
	},
	permission: 'LAQ_MASTER_DATA',
	routes: [
		{
			path: 'laq-master-data/common-product-master',
			element: <CommonProductMaster />
		}
	]
};

export default CommonProductMasterConfig;
