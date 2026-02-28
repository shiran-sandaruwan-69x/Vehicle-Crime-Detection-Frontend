import {
	ShippingHoldsModifiedData,
	ShippingHoldsRes
} from "../../../shipping/shipping-delays/shipping-holds-types/ShippingHoldsType";

export type PromotionCycleSubmitType = {
	refNo?: string;
	cycleName?: string;
	startDate?: string;
	startTime?: string;
	endDate?: string;
	endTime?: string;
	repeatYearly?: boolean;
};

export type PromotionCycleFilterType = {
	cycleName?: string;
	startDate?: string;
	endDate?: string;
};

export type PromotionCycleRes={
	id?:string;
	ref_no?:string;
	name?:string;
	start_time?:string;
	end_time?:string;
	start_date?:string;
	end_date?:string;
	is_repeat_yearly?:number;
	is_active?:number;
};

export type Meta = {
	total?: number;
};

export type PromotionCycleTypeApiRes = {
	data?: PromotionCycleRes[];
	meta?: Meta;
};

export type PromotionCycleModifiedData ={
	id?:string;
	ref_no?:string;
	name?:string;
	start_time?:string;
	end_time?:string;
	start_date?:string;
	end_date?:string;
	is_repeat_yearly?:number;
	is_active?:number;
	active?: boolean;
	startTime?: string;
	endTime?: string;
	repeatYearly?: boolean;
};