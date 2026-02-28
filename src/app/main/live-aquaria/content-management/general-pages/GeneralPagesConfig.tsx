import { lazy } from 'react';

const UsersApp = lazy(() => import('./GeneralPagesApp'));

/**
 * The finance dashboard app config.
 */
const GeneralPages = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: 'content-management/general-pages',
			element: <UsersApp />
		}
	]
};

export default GeneralPages;
