import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import si from './i18n/si';
import ta from './i18n/ta';

i18next.addResourceBundle('en', 'sneakPeekEmail', en);
i18next.addResourceBundle('si', 'sneakPeekEmail', si);
i18next.addResourceBundle('ta', 'sneakPeekEmail', ta);

const SneakPeekEmail = lazy(() => import('./SneakPeekEmail'));

const SneakPeekEmailConfig = {
    settings: {
        layout: {}
    },
    permission: 'DIVERSE_DEN_ADVERTISEMENT',
    routes: [
        {
            path: 'divers-den-management/sneak-peek-email',
            element: <SneakPeekEmail />
        }
    ]
};

export default SneakPeekEmailConfig;
