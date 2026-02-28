import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import si from './i18n/si';
import ta from './i18n/ta';

i18next.addResourceBundle('en', 'giftCertifications', en);
i18next.addResourceBundle('si', '', si);
i18next.addResourceBundle('ta', '', ta);

const CodeGenerator = lazy(() => import('./CodeGenerator'));

const CodeGeneratorConfig = {
	settings: {
		layout: {}
	},
	permission: 'CODE_GENERATOR',
	routes: [
		{
			path: 'gift-certifications/code-generator',
			element: <CodeGenerator />
		}
	]
};

export default CodeGeneratorConfig;
