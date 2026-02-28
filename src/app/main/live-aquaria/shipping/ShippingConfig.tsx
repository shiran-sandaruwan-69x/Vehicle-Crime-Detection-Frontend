import { FuseRouteConfigsType } from '@fuse/utils/FuseUtils';
import ShippingTypesConfig from './shipping-types/ShippingTypesConfig';
import ShippingMethods from './shipping-methods/ShippingMethodsConfig';
import AdditionalCostConfig from './additional-cost/AdditionalCostConfig';
import ShippingScheduleConfig from './shipping-shedule/ShippingSheduleConfig';
import ShippingDelayConfig from './shipping-delays/ShippingDelayConfig';
import HolidayCalenderConfig from './holiday-calender/HolidayCalenderConfig';

const ShippingConfigs: FuseRouteConfigsType = [
	ShippingTypesConfig,
	ShippingMethods,
	AdditionalCostConfig,
	ShippingScheduleConfig,
	ShippingDelayConfig,
	HolidayCalenderConfig
];

export default ShippingConfigs;
