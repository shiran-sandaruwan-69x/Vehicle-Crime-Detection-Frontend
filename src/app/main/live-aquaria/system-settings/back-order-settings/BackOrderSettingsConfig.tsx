import { lazy } from 'react';

const BackOrderSettings = lazy(() => import('./BackOrderSettings'));

const BackOrderSettingsConfig = {
	settings: {
		layout: {}
	},
	permission: 'ORDER_FULFILMENT',
	routes: [
		{
			path: 'system-settings/back-order-settings',
			element: <BackOrderSettings />
		}
	]
};

export default BackOrderSettingsConfig;
