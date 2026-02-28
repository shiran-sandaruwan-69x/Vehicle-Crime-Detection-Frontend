import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import si from './i18n/si';
import ta from './i18n/ta';

i18next.addResourceBundle('en', 'pickerList', en);
i18next.addResourceBundle('si', 'pickerList', si);
i18next.addResourceBundle('ta', 'pickerList', ta);

const PickerListComponent = lazy(() => import('./PickerList'));

const PickerListConfig = {
	settings: {
		layout: {}
	},
	permission: 'PICKER_LIST',
	routes: [
		{
			path: 'orders-management/picker-list',
			element: <PickerListComponent />
		}
	]
};

export default PickerListConfig;
