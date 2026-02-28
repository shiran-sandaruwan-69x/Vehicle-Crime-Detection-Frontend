import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import si from './i18n/si';
import ta from './i18n/ta';

i18next.addResourceBundle('en', 'article', en);
i18next.addResourceBundle('si', 'article', si);
i18next.addResourceBundle('ta', 'article', ta);

const ContactUsSubjectMaintenance = lazy(() => import('./ContactUsSubjectMaintenance'));

const ContactUsSubjectMaintenanceConfig = {
	settings: {
		layout: {}
	},
	permission: 'CONTENT_MANAGEMENT',
	routes: [
		{
			path: 'content-management/contact-us-subject-maintenance',
			element: <ContactUsSubjectMaintenance />
		}
	]
};
export default ContactUsSubjectMaintenanceConfig;
