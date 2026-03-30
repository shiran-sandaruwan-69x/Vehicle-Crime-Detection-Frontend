import { lazy } from 'react';

const AnalyticsDashboardApp = lazy(() => import('./AnalyticsDashboardApp'));
/**
 * The analytics dashboard app config.
 */
const AnalyticsDashboardAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: 'dashboards/operation',
			element: <AnalyticsDashboardApp />
		}
	]
};

export default AnalyticsDashboardAppConfig;
