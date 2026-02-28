import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import si from './i18n/si';
import ta from './i18n/ta';

i18next.addResourceBundle('en', 'diversDenMasterData', en);
i18next.addResourceBundle('si', 'diversDenMasterData', si);
i18next.addResourceBundle('ta', 'diversDenMasterData', ta);

const DiversDenMasterData = lazy(() => import('./DiversDenMasterData'));

const DiversDenMasterDataConfig = {
	settings: {
		layout: {}
	},
	permission: 'LAQ_MASTER_DATA',
	routes: [
		{
			path: 'laq-master-data/divers-den-master-data',
			element: <DiversDenMasterData />
		}
	]
};

export default DiversDenMasterDataConfig;
