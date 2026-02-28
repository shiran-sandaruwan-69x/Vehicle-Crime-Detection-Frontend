import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import si from './i18n/si';
import ta from './i18n/ta';

i18next.addResourceBundle('en', 'guaranteeOptions', en);
i18next.addResourceBundle('si', 'guaranteeOptions', si);
i18next.addResourceBundle('ta', 'guaranteeOptions', ta);

const GuaranteeOptions = lazy(() => import('./GuaranteeOptions'));

const GuaranteeOptionsConfig = {
	settings: {
		layout: {}
	},
	permission: 'LAQ_MASTER_DATA',
	routes: [
		{
			path: 'laq-master-data/guarantee-options',
			element: <GuaranteeOptions />
		}
	]
};

export default GuaranteeOptionsConfig;
