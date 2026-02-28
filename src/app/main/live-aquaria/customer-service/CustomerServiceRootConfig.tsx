import { FuseRouteConfigsType } from '@fuse/utils/FuseUtils';
import CustomerClaimsConfig from './customer-claims/CustomerClaimsConfig';
import HotlineOrderConfig from './hotline-orders/HotlineOrdersConfig';
import HotlineOrdersStatusConfig from './hotline-orders-status/HotlineOrdersStatusConfig';

const CustomerServiceRootConfig: FuseRouteConfigsType = [CustomerClaimsConfig, HotlineOrderConfig, HotlineOrdersStatusConfig];

export default CustomerServiceRootConfig;
