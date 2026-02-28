import { lazy } from 'react';

const UsersApp = lazy(() => import('./HeaderLayoutApp'));

/**
 * The finance dashboard app config.
 */
const HeaderLayoutConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: 'content-management/header-layout',
			element: <UsersApp />
		}
	]
};

export default HeaderLayoutConfig;
