import { FuseRouteConfigsType } from '@fuse/utils/FuseUtils';
import FreeShippingSettingsConfig from './free-shipping-settings/FreeShippingSettingsConfig';
import BackOrderSettingsConfig from './back-order-settings/BackOrderSettingsConfig';
import DiversDenSettingsConfig from './divers-den-settings/DiversDenSettingsConfig';
import BoxChargeSettingsConfig from './box-charge-settings/BoxChargeSettingsConfig';
import RewardPointSettingsConfig from './reward-point-settings/RewardPointSettingsConfig';
import LAQCompaniesDetailsConfig from './laq-companies-details/LAQCompaniesDetailsConfig';


const SystemSettingsConfig: FuseRouteConfigsType = [FreeShippingSettingsConfig, BackOrderSettingsConfig, DiversDenSettingsConfig, BoxChargeSettingsConfig, RewardPointSettingsConfig, LAQCompaniesDetailsConfig];

export default SystemSettingsConfig;
