import { get, del, post, put } from '../../../http/LiveAquariaServiceMethods';
import * as url from '../url_helper';

const SHIPPING_BASE_URL: string = import.meta.env.VITE_BASE_URL_SERVICE as string;

export const fetchAllShippingMethodsRelatedDetails = (pageNo: string | number, pageSize: string | number) =>
	get(`${url.GET_ALL_SHIPPING_METHODS}limit=${pageSize}&page=${pageNo}`);

export const fetchAllShippingTypeDetails = () => get(url.FETCH_ALL_SHIPPING_TYPES);

export const fetchAllShippingScheduleNames = () => get(url.GET_SHIPPING_SCHEDULE_NAMES);

export const deleteShippingMethod = (id: string | number) => del(`${url.DELETE_SHIPPING_METHOD}${id}`);

export const createShippingMethod = (data: any) => post(url.CREATE_SHIPPING_METHOD, data);

export const updateShippingMethodStatus = (id: string | number, action: any) =>
	put(`${url.UPDATE_SHIPPING_METHOD_STATUS}${id}`, action);

export const CREATE_SHIPPING_METHOD = `${SHIPPING_BASE_URL}/api/admin/v1/shipping-methods`;
export const CREATE_SHIPPING_SCHEDULE = `${SHIPPING_BASE_URL}/api/admin/v1/shipping-schedules`;
export const CREATE_SHIPPING_HOLDS = `${SHIPPING_BASE_URL}/api/admin/v1/shipping-holds`;
export const CREATE_SHIPPING_HOLDS_CATEGORY = `${SHIPPING_BASE_URL}/api/admin/v1/item-category`;
