import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import si from './i18n/si';
import ta from './i18n/ta';

i18next.addResourceBundle('en', 'promotions', en);
i18next.addResourceBundle('si', 'promotions', si);
i18next.addResourceBundle('ta', 'promotions', ta);

const PromotionsComponent = lazy(() => import('./Promotions'));

const Promotions = {
	settings: {
		layout: {}
	},
	permission: 'PROMOTIONS',
	routes: [
		{
			path: 'promotion/promotions',
			element: <PromotionsComponent />
		}
	]
};

export default Promotions;
