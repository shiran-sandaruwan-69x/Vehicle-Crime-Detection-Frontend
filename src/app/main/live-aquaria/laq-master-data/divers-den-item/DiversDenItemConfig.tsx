import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import si from './i18n/si';
import ta from './i18n/ta';

i18next.addResourceBundle('en', 'diversDenItem', en);
i18next.addResourceBundle('si', 'diversDenItem', si);
i18next.addResourceBundle('ta', 'diversDenItem', ta);

const DiversDenItem = lazy(() => import('./DiversDenItem'));

const DiversDenItemConfig = {
	settings: {
		layout: {}
	},
	permission: 'LAQ_MASTER_DATA',
	routes: [
		{
			path: 'laq-master-data/divers-den-item',
			element: <DiversDenItem />
		}
	]
};

export default DiversDenItemConfig;
