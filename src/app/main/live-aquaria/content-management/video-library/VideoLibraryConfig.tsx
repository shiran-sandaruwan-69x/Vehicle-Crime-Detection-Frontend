import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import si from './i18n/si';
import ta from './i18n/ta';

i18next.addResourceBundle('en', 'videoLibrary', en);
i18next.addResourceBundle('si', 'videoLibrary', si);
i18next.addResourceBundle('ta', 'videoLibrary', ta);

const VideoLibrary = lazy(() => import('./VideoLibrary'));

const VideoLibraryConfig = {
	settings: {
		layout: {}
	},
	permission: 'CONTENT_MANAGEMENT',
	routes: [
		{
			path: 'content-management/video-library',
			element: <VideoLibrary />
		}
	]
};

export default VideoLibraryConfig;
