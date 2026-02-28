import { FuseRouteConfigsType } from '@fuse/utils/FuseUtils';
import TermsAndConditionsConfig from './terms-conditions/TermsAndConditionsConfig';
import PromotionConfig from './promotion-cycle/PromotionConfig';
import Promotions from './promotions/PromotionsConfig';

const PromotionConfigRoot: FuseRouteConfigsType = [PromotionConfig, TermsAndConditionsConfig, Promotions];

export default PromotionConfigRoot;
