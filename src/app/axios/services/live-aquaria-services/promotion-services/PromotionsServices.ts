const PROMOTION_BASE_URL: string = import.meta.env.VITE_BASE_URL_SERVICE as string;

export const CREATE_PROMOTION_CYCLE = `${PROMOTION_BASE_URL}/api/admin/v1/promotion-cycles`;
export const CREATE_PROMOTION_CONDITIONS = `${PROMOTION_BASE_URL}/api/admin/v1/promotion-conditions`;
export const CREATE_PROMOTION_GROUPED_BY_TYPE = `${PROMOTION_BASE_URL}/api/admin/v1/promotions-grouped-by-type`;
export const CREATE_PROMOTION = `${PROMOTION_BASE_URL}/api/admin/v1/promotions`;
export const GET_CUSTOMER = `${PROMOTION_BASE_URL}/api/admin/v1/customers-search`;
