import { FuseRouteConfigsType } from '@fuse/utils/FuseUtils';
import ArticleCategoryConfig from './article-category/ArticleCategoryConfig';
import ArticleConfig from './article/ArticleConfig';
import GeneralPagesConfig from './general-pages/GeneralPagesConfig';
import VideoTopicConfig from './video-topic/VideoTopicConfig';
import VideoLibraryConfig from './video-library/VideoLibraryConfig';
import ContactUsSubjectMaintenanceConfig from './contact-us-subject-maintenance/ContactUsSubjectMaintenanceConfig';
import FooterLayoutAppConfig from './Footer-Layout/FooterLayoutAppConfig';
import HeaderLayoutConfig from './Header-Layout/HeaderLayoutConfig';
import TextEditorCompnentConfig from './components-layouts/text-editor-component/TextEditorCompnentConfig';
import ProductCarouselCompnentConfig from './components-layouts/product-carousel-component/ProductCarouselCompnentConfig';

const LiveAquariaLaqContentManagementConfig: FuseRouteConfigsType = [
	ArticleCategoryConfig,
	ArticleConfig,
	GeneralPagesConfig,
	VideoTopicConfig,
	VideoLibraryConfig,
	ContactUsSubjectMaintenanceConfig,
	FooterLayoutAppConfig,
	HeaderLayoutConfig,

	TextEditorCompnentConfig,
	ProductCarouselCompnentConfig
];
export default LiveAquariaLaqContentManagementConfig;
