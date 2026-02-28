import { FuseRouteConfigsType } from '@fuse/utils/FuseUtils';
import DailyEmailConfig from './daily-email/DailyEmailConfig';
import DiversDenAdvertisementsPublishConfig from './divers-den-advertisements-publish/DiversDenAdvertisementsPublishConfig';
import DiversDenAdvertisementsConfig from './divers-den-advertisements/DiversDenAdvertisementsConfig';
import SneakPeekEmailConfig from './sneak-peek-email/SneakPeekEmailConfig';

const DiversDenAdvertisementConfig: FuseRouteConfigsType = [
  DiversDenAdvertisementsConfig,
  DiversDenAdvertisementsPublishConfig,
  DailyEmailConfig,
  SneakPeekEmailConfig,
];

export default DiversDenAdvertisementConfig;
