import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import si from './i18n/si';
import ta from './i18n/ta';

i18next.addResourceBundle('en', 'planSummery', en);
i18next.addResourceBundle('si', 'planSummery', si);
i18next.addResourceBundle('ta', 'planSummery', ta);

const PlanSummeryComponent = lazy(() => import('./PlanSummery'));

const PlanSummeryConfig = {
	settings: {
		layout: {}
	},
	permission: 'PLAN SUMMERY',
	routes: [
		{
			path: 'order-management/plan-summery',
			element: <PlanSummeryComponent />
		}
	]
};

export default PlanSummeryConfig;
