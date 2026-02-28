import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import si from './i18n/si';
import ta from './i18n/ta';

i18next.addResourceBundle('en', 'promotionCycle', en);
i18next.addResourceBundle('si', 'promotionCycle', si);
i18next.addResourceBundle('ta', 'promotionCycle', ta);

const PromotionConfigComponent = lazy(() => import('./PromotionCycle'));

const PromotionConfig = {
	settings: {
		layout: {}
	},
	permission: 'PROMOTION_CONFIG',
	routes: [
		{
			path: 'promotion/promotion-cycle',
			element: <PromotionConfigComponent />
		}
	]
};

export default PromotionConfig;
