import { FuseRouteConfigsType } from '@fuse/utils/FuseUtils';
import InitialOrderConfig from './initial-order-review/InitialOrderConfig';
import BackOrdersHistoryConfig from './back-orders-management/back-orders-history/BackOrdersHistoryConfig';
import AssignPickerConfig from './warehouse-order-management/assign-picker/AssignPickerConfig';
import BackOrdersConfig from './back-orders-management/back-orders/BackOrdersConfig';
import WarHouseOrderPlanningConfig from './warehouse-order-management/warehouse-order-planning/WarHouseOrderPlanningConfig';
import CancelOrderConfig from './cancel-orders/CancelOrderConfig';
import OrderPlanningConfig from './order-planning-management/order-planning/OrderPlanningConfig';
import PickerListConfig from './picker-list/PickerListConfig';
import DispatchingConfig from './dispatching/DispatchingConfig';
import PlanSummeryConfig from './order-planning-management/plan-summery/PlanSummeryConfig';
import OrderFulfilmentConfig from './order-fulfilment/OrderFulfilmentConfig';

const LiveAquariaOrderReviewManagementRoot: FuseRouteConfigsType = [
	InitialOrderConfig,
	BackOrdersConfig,
	BackOrdersHistoryConfig,
	WarHouseOrderPlanningConfig,
	AssignPickerConfig,
	CancelOrderConfig,
	OrderPlanningConfig,
	PlanSummeryConfig,
	PickerListConfig,
	DispatchingConfig,
	OrderFulfilmentConfig
];

export default LiveAquariaOrderReviewManagementRoot;
