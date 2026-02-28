import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import si from './i18n/si';
import ta from './i18n/ta';

i18next.addResourceBundle('en', 'termsAndConditions', en);
i18next.addResourceBundle('si', 'termsAndConditions', si);
i18next.addResourceBundle('ta', 'termsAndConditions', ta);

const TermsAndConditionsComponent = lazy(() => import('./TermsAndConditions'));

const TermsAndConditionsConfig = {
	settings: {
		layout: {}
	},
	permission: 'TERMS_AND_CONDITIONS',
	routes: [
		{
			path: 'promotion/terms-and-conditions',
			element: <TermsAndConditionsComponent />
		}
	]
};

export default TermsAndConditionsConfig;
