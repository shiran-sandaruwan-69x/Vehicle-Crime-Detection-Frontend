import { lazy } from 'react';

const UsersApp = lazy(() => import('./FooterLayoutApp'));

/**
 * The finance dashboard app config.
 */
const FooterLayoutAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: 'content-management/footer-layout',
			element: <UsersApp />
		}
	]
};

export default FooterLayoutAppConfig;
