export type ItemDetails = {
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
	status?: number;
	is_advertisement?: number;
	is_active?: number;
	average_product_rating?: number;
	average_delivery_rating?: number;
	item_attributes?: ItemAttribute[];
	customer_reviews?: CustomerReviews[];
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

export type CustomerReviews = {
	id?: string;
	customer_id?: string;
	item_id?: string;
	product_rating?: number;
	delivery_rating?: number;
	feedback?: string;
	status?: number;
	is_active?: number;
	created_at?: string;
	customer_details?: CustomerDetails;
	images?: ImageData[];
};

export type CustomerDetails = {
	id?: string;
	code?: string;
	first_name?: string;
	last_name?: string;
	mobile_no?: number;
	email?: string;
	gender?: string;
	dob?: Date;
	is_active?: number;
};

export type ImageData = {
	id?: string;
	images?: string;
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
	status?: number;
	is_advertisement?: number;
	is_active?: number;
	average_product_rating?: number;
	average_delivery_rating?: number;
	item_attributes?: ItemAttribute[];
	customer_reviews?: CustomerReviews[];
	productCode?: string;
	productName?: string;
	productRating?: JSX.Element;
	deliveryRating?: JSX.Element;
};

export type ProductIdResponseTypes = {
	data?: ItemDetails;
};
