import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import si from './i18n/si';
import ta from './i18n/ta';

i18next.addResourceBundle('en', 'backOrders', en);
i18next.addResourceBundle('si', 'backOrders', si);
i18next.addResourceBundle('ta', 'backOrders', ta);

const AssignPickerComponent = lazy(() => import('./AssignPicker'));

const AssignPickerConfig = {
	settings: {
		layout: {}
	},
	permission: 'ASSIGN A PICKER',
	routes: [
		{
			path: 'order-management/assign-a-picker',
			element: <AssignPickerComponent />
		}
	]
};

export default AssignPickerConfig;
