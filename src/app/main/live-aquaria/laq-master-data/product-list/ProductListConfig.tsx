import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import si from './i18n/si';
import ta from './i18n/ta';

i18next.addResourceBundle('en', 'productList', en);
i18next.addResourceBundle('si', 'productList', si);
i18next.addResourceBundle('ta', 'productList', ta);

const ProductList = lazy(() => import('./ProductList'));

const ProductListConfig = {
	settings: {
		layout: {}
	},
	permission: 'LAQ_MASTER_DATA',
	routes: [
		{
			path: 'laq-master-data/product-list-view',
			element: <ProductList />
		}
	]
};

export default ProductListConfig;
