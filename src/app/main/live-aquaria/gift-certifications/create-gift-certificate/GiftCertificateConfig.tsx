import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import si from './i18n/si';
import ta from './i18n/ta';

i18next.addResourceBundle('en', 'giftCertifications', en);
i18next.addResourceBundle('si', '', si);
i18next.addResourceBundle('ta', '', ta);

const GiftCertificate = lazy(() => import('./GiftCertificate'));

const GiftCertificateConfig = {
	settings: {
		layout: {}
	},
	permission: 'GIFT_CERTIFICATE',
	routes: [
		{
			path: 'gift-certifications/gift-certificate',
			element: <GiftCertificate />
		}
	]
};

export default GiftCertificateConfig;
