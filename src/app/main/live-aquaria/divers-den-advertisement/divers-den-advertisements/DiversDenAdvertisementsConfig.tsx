import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import si from './i18n/si';
import ta from './i18n/ta';

i18next.addResourceBundle('en', 'diversDenAdvertisements', en);
i18next.addResourceBundle('si', 'diversDenAdvertisements', si);
i18next.addResourceBundle('ta', 'diversDenAdvertisements', ta);

const DiverseDen = lazy(() => import('./DiversDenAdvertisementBreadCrumb'));
// const DiverseDenPreview = lazy(() => import('./DiversDenAdvertisementPreview'));

const DiversDenAdvertisementsConfig = {
	settings: {
		layout: {}
	},
	permission: 'DIVERSE_DEN_ADVERTISEMENT',
	routes: [
		{
			path: 'divers-den-management/divers-den-pdp',
			element: <DiverseDen />
		}
		// {
		//   path: 'divers-den-advertisement/divers-den-advertisement-preview',
		//   element: <DiverseDenPreview />,
		// },
	]
};

export default DiversDenAdvertisementsConfig;
