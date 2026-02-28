import i18next from 'i18next';
import { lazy } from 'react';
import en from './i18n/en';
import si from './i18n/si';
import ta from './i18n/ta';

i18next.addResourceBundle('en', 'videoTopics', en);
i18next.addResourceBundle('si', 'videoTopics', si);
i18next.addResourceBundle('ta', 'videoTopics', ta);

const VideoTopic = lazy(() => import('./VideoTopic'));

const VideoTopicConfig = {
	settings: {
		layout: {}
	},
	permission: 'CONTENT_MANAGEMENT',
	routes: [
		{
			path: 'content-management/video-topic',
			element: <VideoTopic />
		}
	]
};

export default VideoTopicConfig;
