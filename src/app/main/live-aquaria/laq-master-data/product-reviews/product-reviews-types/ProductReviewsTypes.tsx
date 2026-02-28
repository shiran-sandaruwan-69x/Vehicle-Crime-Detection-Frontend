export type ItemDetails = {
	id?: string;
	customer_id?: string;
	item_id?: string;
	product_rating?: number;
	delivery_rating?: number;
	feedback?: string;
	status?: number;
	is_active?: number;
	created_at?: string;
	item_details?: ItemData;
	customer_details?: CustomerData;
	images?: ImageData[];
};

export type ItemData = {
	id?: string;
	code?: string;
	type?: string;
	title?: string;
	scientific_name?: string;
	short_description?: string;
	long_description?: string;
	common_name?: string;
	meta_keywords?: string;
	meta_description?: string;
	additional_information?: string;
	is_loyalty_rewards?: number;
	is_weekly_special?: number;
	is_auto_delivery?: number;
	is_availability_emails?: number;
	special_message?: string;
	is_admin_only?: number;
	reject_reason?: string;
	status: number;
	is_advertisement?: number;
	is_active?: number;
	average_product_rating?: number;
	average_delivery_rating?: number;
	item_attributes?: ItemAttribute[];
};

export type CustomerData = {
	id?: string;
	code?: string;
	first_name?: string;
	last_name?: string;
	mobile_no?: string;
	email?: string;
	gender?: string;
	dob?: string;
	is_active?: number;
};

export type ImageData = {
	id?: string;
	images?: string;
};

export type ItemAttribute = {
	id?: string;
	name?: string;
	attributes?: Attributes[];
};

export type Attributes = {
	id?: string;
	name?: string;
	is_active?: number;
};

export type SelectionTypes = {
	id?: string;
	item_selection_id?: string;
	display_name?: string;
	selling_price?: string;
	display_price?: string;
	discount_rate?: string;
	discount_price?: string;
	consider_stock?: number;
	remark?: string;
	is_active?: number;
	master_data?: MasterData;
};

export type MasterData = {
	id?: string;
	master_code?: string;
	cis_code?: string;
	member_code?: string;
	vendor_code?: string;
	country?: string;
	common_name?: string;
	scientific_name?: string;
	description?: string;
	gender?: string;
	size?: string;
	age?: string;
	origins?: string;
	length?: string;
	selling_type?: string;
	regular_price?: string;
	inventory_qty?: number;
	is_active?: number;
	created_date?: string;
};

export type ParentItemCategory = {
	id?: string;
	name?: string;
	reference?: string;
	goods_type?: string;
	attachment?: string;
	is_active?: number;
};

export type Meta = {
	total: number;
};

export type ItemDetailsType = {
	data?: ItemDetails[];
	meta?: Meta;
};

export type ItemDetailsModifiedData = {
	id?: string;
	customer_id?: string;
	item_id?: string;
	product_rating?: number;
	delivery_rating?: number;
	feedback?: string;
	status?: number;
	is_active?: number;
	created_at?: string;
	item_details?: ItemData;
	customer_details?: CustomerData;
	images?: ImageData[];
	cusName?: string;
	productCode?: string;
	productName?: string;
	createDate?: string;
	approvedStatus?: string;
	active?: boolean;
};

export type ProductIdResponseTypes = {
	data?: ItemData;
};
