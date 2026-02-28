import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import si from './i18n/si';
import ta from './i18n/ta';

i18next.addResourceBundle('en', 'hotlineOrderStatus', en);
i18next.addResourceBundle('si', 'hotlineOrderStatus', si);
i18next.addResourceBundle('ta', 'hotlineOrderStatus', ta);

const HotlineOrderStatusComponent = lazy(() => import('./HotlineOrderStatus'));

const HotlineOrdersStatusConfig = {
  settings: {
    layout: {},
  },
  permission: 'CUSTOMER_CLAIMS',
  routes: [
    {
      path: 'customer-service/hotline-orders-status',
      element: <HotlineOrderStatusComponent />,
    },
  ],
};

export default HotlineOrdersStatusConfig;
