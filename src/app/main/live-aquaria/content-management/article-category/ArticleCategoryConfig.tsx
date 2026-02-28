import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import si from './i18n/si';
import ta from './i18n/ta';

i18next.addResourceBundle('en', 'articleCategory', en);
i18next.addResourceBundle('si', 'articleCategory', si);
i18next.addResourceBundle('ta', 'articleCategory', ta);

const ArticleCategory = lazy(() => import('./ArticleCategory'));

const ArticleCategoryConfig = {
	settings: {
		layout: {}
	},
	permission: 'CONTENT_MANAGEMENT',
	routes: [
		{
			path: 'content-management/article-category',
			element: <ArticleCategory />
		}
	]
};
export default ArticleCategoryConfig;
