import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import si from './i18n/si';
import ta from './i18n/ta';

i18next.addResourceBundle('en', 'etfMasterData', en);
i18next.addResourceBundle('si', 'etfMasterData', si);
i18next.addResourceBundle('ta', 'etfMasterData', ta);

const AllProductReviews = lazy(() => import('./AllProductReviews'));

const AllProductReviewsConfig = {
	settings: {
		layout: {}
	},
	permission: 'LAQ_MASTER_DATA',
	routes: [
		{
			path: 'laq-master-data/all-product-reviews',
			element: <AllProductReviews />
		}
	]
};

export default AllProductReviewsConfig;
