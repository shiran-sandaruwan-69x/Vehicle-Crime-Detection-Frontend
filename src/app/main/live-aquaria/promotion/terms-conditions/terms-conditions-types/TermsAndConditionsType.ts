export type TermsAndConditionsSubmit = {
	promotionType?: string;
	promotion?: string;
	condition?: string;
};
export type TermsAndConditionsMessageData = {
	id?: string;
	condition?: string;
	tableData?: {
		id?: string;
	};
};

export type PromotionRes = {
	id?: string;
	ref_no?: string;
	name?: string;
};

export type PromotionTypeRes = {
	type?: string;
	type_label?: string;
	promotions?: PromotionRes[];
};

export type PromotionTypeApiRes = {
	data?: PromotionTypeRes[];
};

export type PromotionDropDownData = {
	value?: string;
	label?: string;
};

export type PromotionCycleRes = {
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

export type TermPromotionRes = {
	id?: string;
	type?: string;
	type_id?: string;
	ref_no?: string;
	name?: string;
	percentage?: number;
	active_from?: string;
	active_until?: string;
	description?: string;
	banner?: string;
	promo_code?: string;
	is_active?: number;
	created_at?: string;
	promotion_cycle?: PromotionCycleRes;
};

export type ConditionItemRes = {
	id?: string;
	condition?: string;
	is_active?: number;
};

export type TermsAndConditionTypeRes = {
	id?: string;
	is_active?: number;
	created_at?: string;
	condition?: ConditionItemRes[];
	promotion?: TermPromotionRes;
};

export type Meta = {
	total?: number;
};

export type TermsAndConditionTypeApiRes = {
	data?: TermsAndConditionTypeRes[];
	meta?: Meta;
};

export type TermsAndConditionModifiedData = {
	id?: string;
	is_active?: number;
	created_at?: string;
	condition?: ConditionItemRes[];
	promotion?: TermPromotionRes;
	active?: boolean;
	promotionName?: string;
	conditionModify?: string[];
};
