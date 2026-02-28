import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import si from './i18n/si';
import ta from './i18n/ta';

i18next.addResourceBundle('en', 'diversDenAdvertisementsPublish', en);
i18next.addResourceBundle('si', 'diversDenAdvertisementsPublish', si);
i18next.addResourceBundle('ta', 'diversDenAdvertisementsPublish', ta);

const DiversDenAdvertisementsPublish = lazy(() => import('./DiversDenAdvertisementPublishBreadCrumb'));

const DiversDenAdvertisementsPublishConfig = {
	settings: {
		layout: {}
	},
	permission: 'DIVERSE_DEN_ADVERTISEMENT',
	routes: [
		{
			path: 'divers-den-management/divers-den-pdp-publish',
			element: <DiversDenAdvertisementsPublish />
		}
	]
};

export default DiversDenAdvertisementsPublishConfig;
