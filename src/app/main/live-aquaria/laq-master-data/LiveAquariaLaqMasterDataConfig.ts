import { FuseRouteConfigsType } from '@fuse/utils/FuseUtils';
import ProductListConfig from './product-list/ProductListConfig';
import CategoryManagementConfig from './category-nanagement/CategoryManagementConfig';
import AttributeConfig from './attribute/AttributeConfig';
import BoxChargeConfig from './box-charge/BoxChargeConfig';
import GuaranteeOptionsConfig from './guarantee-options/GuaranteeOptionsConfig';
import CancelOrderReasonsConfig from './cancel-order-reasons/CancelOrderReasonsConfig';
import UnitPriceChargeReasonsConfig from './unit-price-charge-reasons/UnitPriceChargeReasonsConfig';
import StorePickupOptionsConfig from './store-pickup-options/StorePickupOptionsConfig';
import OrderStatusMasterFormConfig from './order-status-master-form/OrderStatusMasterFormConfig';
import EtfMasterDataConfig from './etf-master-data/EtfMasterDataConfig';
import DiversDenMasterDataConfig from './divers-den-master-data/DiversDenMasterDataConfig';
import ProductReviewsConfig from './product-reviews/ProductReviewsConfig';
import AllProductReviewsConfig from './product-all-reviews/AllProductReviewsConfig';
import DiversDenItemConfig from './divers-den-item/DiversDenItemConfig';
import CommonProductMasterConfig from "./common-product-master/CommonProductMasterConfig";

const LiveAquariaMaterDataConfig: FuseRouteConfigsType = [
	ProductListConfig,
	CategoryManagementConfig,
	AttributeConfig,
	BoxChargeConfig,
	GuaranteeOptionsConfig,
	CancelOrderReasonsConfig,
	UnitPriceChargeReasonsConfig,
	StorePickupOptionsConfig,
	OrderStatusMasterFormConfig,
	EtfMasterDataConfig,
	DiversDenMasterDataConfig,
	ProductReviewsConfig,
	AllProductReviewsConfig,
	DiversDenItemConfig,
	CommonProductMasterConfig
];

export default LiveAquariaMaterDataConfig;
