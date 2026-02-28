import FuseUtils from '@fuse/utils';
import FuseLoading from '@fuse/core/FuseLoading';
import { Navigate } from 'react-router-dom';
import settingsConfig from 'app/configs/settingsConfig';
import { FuseRouteConfigsType, FuseRoutesType } from '@fuse/utils/FuseUtils';
import SignInConfig from '../main/sign-in/SignInConfig';
import SignOutConfig from '../main/sign-out/SignOutConfig';
import Error404Page from '../main/404/Error404Page';
import PagesConfigs from '../main/pages/pagesConfigs';
import DashboardsConfigs from '../main/dashboards/dashboardsConfigs';
import UserInterfaceConfigs from '../main/user-interface/UserInterfaceConfigs';
import DocumentationConfig from '../main/documentation/DocumentationConfig';
import authRoleExamplesConfigs from '../main/auth/authRoleExamplesConfigs';
import customerManagementConfigs from '../main/customerManagement/CustomerManagementConfigs';
import LiveAquariaCustomerConfig from '../main/live-aquaria/customer/LiveAquariaCustomerConfig';
import LiveAquariaLaqMasterDataConfig from '../main/live-aquaria/laq-master-data/LiveAquariaLaqMasterDataConfig';

import OrderManagementRootConfig from '../main/live-aquaria/orders-management/OrdersManagementRootConfig';
import ShippingConfigs from '../main/live-aquaria/shipping/ShippingConfig';
import GiftCertificationsRoot from '../main/live-aquaria/gift-certifications/GiftCertificationsRoot';
import GeneralAdvertisementRoot from '../main/live-aquaria/sample-component/GeneralAdvertisementRoot';
import DiversDenAdvertisementConfig from '../main/live-aquaria/divers-den-advertisement/DiversDenAdvertisementConfig';
import LiveAquariaOrderReviewManagementRoot from '../main/live-aquaria/orders-management/OrderReviewManagementRootConfig';
import PromotionConfigRoot from '../main/live-aquaria/promotion/PromotionConfigRoot';
import CustomerServiceRootConfig from '../main/live-aquaria/customer-service/CustomerServiceRootConfig';
import userManagementConfigs from '../main/live-aquaria/user-management/userManagementConfigs';
import GeneralPagesConfig from '../main/live-aquaria/content-management/general-pages/GeneralPagesConfig';
import LiveAquariaLaqContentManagementConfig from '../main/live-aquaria/content-management/LiveAquariaLaqContentManagementConfig';
import ClassicForgotPasswordPage from '../main/pages/authentication/forgot-password/ClassicForgotPasswordPage';
import SystemSettingsConfig from '../main/live-aquaria/system-settings/SystemSettingsConfig';
// import authenticationPagesConfigs from '../main/pages/authentication/authenticationPagesConfigs';

const routeConfigs: FuseRouteConfigsType = [
	SignOutConfig,
	SignInConfig,
	// SignUpConfig,
	DocumentationConfig,
	GeneralPagesConfig,
	...PagesConfigs,
	...UserInterfaceConfigs,
	...DashboardsConfigs,
	// ...AppsConfigs,
	...authRoleExamplesConfigs,
	...userManagementConfigs,
	// ...ticketManagementConfigs,
	...customerManagementConfigs,
	// ...paymentManagementConfigs,
	...LiveAquariaCustomerConfig,
	...LiveAquariaLaqMasterDataConfig,
	...OrderManagementRootConfig,
	...ShippingConfigs,
	...GiftCertificationsRoot,
	...GeneralAdvertisementRoot,
	...DiversDenAdvertisementConfig,
	...LiveAquariaOrderReviewManagementRoot,
	...CustomerServiceRootConfig,
	...PromotionConfigRoot,
	...CustomerServiceRootConfig,
	...LiveAquariaLaqContentManagementConfig,
	...SystemSettingsConfig
];

/**
 * The routes of the application.
 */
const routes: FuseRoutesType = [
	...FuseUtils.generateRoutesFromConfigs(routeConfigs, settingsConfig.defaultAuth),
	{
		path: '/',
		element: <Navigate to="/dashboards/project" />,
		auth: settingsConfig.defaultAuth
	},
	{
		path: 'loading',
		element: <FuseLoading />
	},
	{
		path: 'forgot-password/:token',
		element: <ClassicForgotPasswordPage />
	},
	{
		path: '404',
		element: <Error404Page />
	},
	{
		path: '*',
		element: <Navigate to="404" />
	}
];

export default routes;
