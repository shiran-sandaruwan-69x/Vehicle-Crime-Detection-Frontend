import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import si from './i18n/si';
import ta from './i18n/ta';

i18next.addResourceBundle('en', 'attribute', en);
i18next.addResourceBundle('si', 'attribute', si);
i18next.addResourceBundle('ta', 'attribute', ta);

const Attribute = lazy(() => import('./Attribute'));

const AttributeConfig = {
	settings: {
		layout: {}
	},
	permission: 'LAQ_MASTER_DATA',
	routes: [
		{
			path: 'masterData/counties',
			element: <Attribute />
		}
	]
};

export default AttributeConfig;
