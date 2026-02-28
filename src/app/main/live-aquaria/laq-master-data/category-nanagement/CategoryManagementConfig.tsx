import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import si from './i18n/si';
import ta from './i18n/ta';

i18next.addResourceBundle('en', 'categoryManagement', en);
i18next.addResourceBundle('si', 'categoryManagement', si);
i18next.addResourceBundle('ta', 'categoryManagement', ta);

const CategoryManagement = lazy(() => import('./CategoryManagement'));

const CategoryManagementConfig = {
	settings: {
		layout: {}
	},
	permission: 'LAQ_MASTER_DATA',
	routes: [
		{
			path: 'laq-master-data/category-management',
			element: <CategoryManagement />
		}
	]
};

export default CategoryManagementConfig;
