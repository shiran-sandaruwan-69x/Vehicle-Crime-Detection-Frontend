export type SneakPeekEmailFilter = {
	category?: string;
	product?: string;
	scheduledDate?: string;
};

export type ScheduleTimeRes = {
	id?: string;
	label?: string;
	category?: string;
	value?: string;
	is_active?: number;
};

export type ScheduleTimeApiRes = {
	data?: ScheduleTimeRes;
};

export type SneakPeekAdvertisementItem = {
	id?: string;
	code?: string;
	type?: number;
	title?: string;
	common_name?: string;
	scientific_name?: string;
	short_description?: string;
	long_description?: string;
	meta_keywords?: string;
	meta_description?: string;
	additional_information?: string;
	water_type?: number;
	is_loyalty_rewards?: number;
	is_weekly_special?: number;
	is_auto_delivery?: number;
	is_availability_emails?: number;
	special_message?: string;
	is_admin_only?: number;
	reject_reason?: string;
	status?: number;
	is_advertisement?: number;
	is_active?: number;
	average_product_rating?: number;
	average_delivery_rating?: number;
};

export type SneakPeekRes = {
	id?: string;
	date?: string;
	time?: string;
	description?: string;
	status?: string;
	advertisement?: SneakPeekAdvertisementItem[];
	no?: number;
};

export type Meta = {
	total?: number;
};

export type SneakPeekApiRes = {
	data?: SneakPeekRes[];
	meta?: Meta;
};

export type SneakPeekApiResById = {
	data?: SneakPeekRes;
};