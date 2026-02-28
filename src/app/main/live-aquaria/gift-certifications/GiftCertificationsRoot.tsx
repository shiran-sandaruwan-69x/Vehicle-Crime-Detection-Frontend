import { FuseRouteConfigsType } from '@fuse/utils/FuseUtils';
import GiftCertificateConfig from './create-gift-certificate/GiftCertificateConfig';
import CodeGeneratorConfig from './code-generatoe/CodeGeneratorConfig';
import PurchaseHistoryConfig from './purchase-history/PurchaseHistoryConfig';

const GiftCertificationsRoot: FuseRouteConfigsType = [
	GiftCertificateConfig,
	CodeGeneratorConfig,
	PurchaseHistoryConfig
];

export default GiftCertificationsRoot;
