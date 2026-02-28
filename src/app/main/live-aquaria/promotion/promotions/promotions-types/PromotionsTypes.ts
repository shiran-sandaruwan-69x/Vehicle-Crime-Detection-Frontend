
export type PromotionFilter = {
	promotionCycle?: string;
	promotionName?: string;
	promotionType?: string;
	status?: string;
};

export type DiscountPromotionForm = {
	promotionName?: string;
	promotionCycle?: string;
	activeForm?: string;
	activeUntil?: string;
	promotionPercentage?: string;
	description?: string;
	codePrefix?: string;
	yearFormat?: string;
	monthFormat?: string;
	noOfDigits?: number;
	code_prefix_order?: string;
	year_order?: string;
	month_order?: string;
	no_of_digits_order?: string;
	customerCode?: string;
};

export type PromotionRes = {
	id?: string;
	type_id?: string;
	type?: string;
	ref_no?: string;
	name?: string;
	percentage?: string;
	active_from?: string;
	active_until?: string;
	description?: string;
	banner?: string;
	promo_code?: string;
	is_active?: number;
	created_at?: string;
	promotion_cycle?: {
		id?: string;
		ref_no?: string;
		name?: string;
		start_time?: string;
		end_time?: string;
		start_date?: string;
		end_date?: string;
		is_repeat_yearly?: number;
		is_active?: number;
	};
	customer?: {
		id?: string;
		code?: string;
		first_name?: string;
		last_name?: string;
		mobile_no?: string;
		email?: string;
		gender?: string;
		dob?: string;
		aquatic_type?: string;
		is_active?: number;
		profile_image?: string;
		total_credit_points?: number;
		total_remaining_points?: number;
	};
	status?: string;
};

export type Meta = {
	total?: number;
};

export type PromotionApiRes = {
	data?:PromotionRes[];
	meta?: Meta;
};

export type PromotionModifiedData ={
	id?: string;
	type_id?: string;
	type?: string;
	ref_no?: string;
	name?: string;
	percentage?: string;
	active_from?: string;
	active_until?: string;
	description?: string;
	banner?: string;
	promo_code?: string;
	is_active?: number;
	created_at?: string;
	promotion_cycle?: {
		id?: string;
		ref_no?: string;
		name?: string;
		start_time?: string;
		end_time?: string;
		start_date?: string;
		end_date?: string;
		is_repeat_yearly?: number;
		is_active?: number;
	};
	customer?: {
		id?: string;
		code?: string;
		first_name?: string;
		last_name?: string;
		mobile_no?: string;
		email?: string;
		gender?: string;
		dob?: string;
		aquatic_type?: string;
		is_active?: number;
		profile_image?: string;
		total_credit_points?: number;
		total_remaining_points?: number;
	};
	active?:boolean;
	promotionName?:string;
	promotionType?:string;
	activeForm?:string;
};

export type PromotionCustomerRes = {
	id?: string;
	code?: string;
	first_name?: string;
	last_name?: string;
	mobile_no?: string;
	email?: string;
	gender?: string;
	dob?: string;
	aquatic_type?: string;
	is_active?: number;
	profile_image?: string;
	total_credit_points?: number;
	total_remaining_points?: number;
};

export type PromotionCustomerApiRes = {
	data?:PromotionCustomerRes[];
}

