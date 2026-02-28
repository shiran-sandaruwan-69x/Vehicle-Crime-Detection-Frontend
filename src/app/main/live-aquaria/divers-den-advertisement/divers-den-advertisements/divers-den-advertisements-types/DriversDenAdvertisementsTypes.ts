export type GuaranteeOptionsDiversDenAdvertisementsType = {
	id?: string;
	guaranteeName?: string;
	checked?: boolean;
};

export type GuaranteeOptionsSubmitDiversDenAdvertisementsType = {
	specialMessage?: string;
	displayLoyallyRewards?: boolean;
	dealsAndSteals?: boolean;
	selectedGuaranteeOption?: number | null;
};

export type GeneralViewSubmitDiversDenAdvertisementsType = {
	product_name?: string;
	displayName?: string;
	title?: string;
	scientific_name?: string;
	isSoldWaterOrFresh?: string;
	category?: string;
	subCategory?: string;
	short_description?: string;
	meta_description?: string;
	long_description?: string;
	additional_information?: string;
	product_tag_keywords?: string[];
};

export type DiversDenAdvertisementsType = {
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
	is_loyalty_rewards?: number;
	is_weekly_special?: number;
	is_auto_delivery?: number;
	is_availability_emails?: number;
	is_advertisement?: number;
	is_active?: number;
	average_product_rating?: number;
	average_delivery_rating?: number;
	item_selection?: ItemSelectionType[];
	item_attributes?: ItemAttributeType[][];
	item_media?: ItemMediaType[];
	related_article?: any[];
	related_product?: any[];
	guarantee_options?: any[];
};

export type DiversDenAdvertisementsModifiedDataType = {
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
	is_loyalty_rewards?: number;
	is_weekly_special?: number;
	is_auto_delivery?: number;
	is_availability_emails?: number;
	is_advertisement?: number;
	is_active?: number;
	average_product_rating?: number;
	average_delivery_rating?: number;
	item_selection?: ItemSelectionType[];
	item_attributes?: ItemAttributeType[][];
	item_media?: ItemMediaType[];
	related_article?: any[];
	related_product?: any[];
	guarantee_options?: any[];
	category?: string;
	item?: string;
	name?: string;
	size?: string;
	warehouse?: string;
	price?: string;
	active?: boolean;
};

export type Meta = {
	total?: number;
};

export type DiversDenAdvertisementsResponseType = {
	data?: DiversDenAdvertisementsType[];
	// meta?:Meta;
};

type ItemSelectionType = {
	id?: number;
	name?: string | null;
	is_active?: number;
	selection_types?: SelectionType[];
	item_media?: any[];
};

type SelectionType = {
	id?: number;
	item_selection_id?: number;
	display_name?: string | null;
	selling_price?: string;
	display_price?: string;
	discount_rate?: string;
	discount_price?: string;
	consider_stock?: number;
	remark?: string | null;
	is_active?: number;
	master_data?: MasterDataType;
};

type MasterDataType = {
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
	selling_type?: string | null;
	regular_price?: string;
	inventory_qty?: number;
	is_active?: number;
	created_date?: string;
};

type ItemAttributeType = {
	id?: string;
	name?: string;
	attributes?: AttributeType[];
};

type AttributeType = {
	id?: string;
	name?: string;
	is_active?: number;
};

type ItemMediaType = {
	id?: number;
	type?: string;
	link?: string;
};

export type onNextGeneralViewTypes = {
	type?: string;
	parent_id?: string;
	title?: string;
	display_name?: string;
	short_description?: string;
	long_description?: string;
	meta_keywords?: string;
	meta_description?: string;
	additional_information?: string;
	is_advertisement?: number;
	water_type?: string;
	aquatic_type?: string;
};

export type onNextAndOnBackUploadDataTypes = {
	video_link?: string;
	imagesIn?: { id?: number; link?: string; file?: File; base64?: string }[];
	videoIn?: { id?: number; link?: string; file?: File; base64?: string }[];
};

export type onNextAndOnBackUploadDataSubmitDataTypes = {
	video_link?: string;
	images?: string[];
	videos?: string[];
};

export type getAllProductType = {
	id?: string;
	code?: string;
	title?: string;
};

export type getAllProductResponseType = {
	data?: getAllProductType[];
};

export type productOptionsSetDataType = {
	id?: string;
	cisCode?: string;
	title?: string;
};

export type productOptionsDropDownDataType = {
	label?: string;
	value?: string;
};

export type productOptionsTableDataType = {
	cisCode?: string;
	tableData?: productOptionsSetDataType[];
};

export type FormValues = {
	specialMessage?: string;
	displayLoyallyRewards?: boolean;
	dealsAndSteals?: boolean;
	adminOnly?: boolean;
	selectedGuaranteeOption?: string | null;
};

// --------------------
export type ItemMediaTypeResponse = {
	id?: number;
	type?: string;
	link?: string;
};

export type RelatedProductTypeResponse = {
	id?: string;
	code?: string;
	type?: number;
	title?: string | null;
	common_name?: string;
	scientific_name?: string;
	short_description?: string | null;
	long_description?: string | null;
	meta_keywords?: string | null;
	meta_description?: string | null;
	additional_information?: string | null;
	is_advertisement?: number;
	is_active?: number;
};

export type GuaranteeOptionTypeResponse = {
	id?: string;
	name?: string;
	descriptions?: string;
	is_active?: number;
	attachment?: string;
};

export type MasterDataResponseType = {
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
	selling_type?: string | null;
	regular_price?: string;
	inventory_qty?: number;
	is_active?: number;
	created_date?: string;
};

export type SelectionResponseType = {
	id?: string;
	item_selection_id?: string;
	display_name?: string | null;
	selling_price?: string;
	display_price?: string;
	discount_rate?: string;
	discount_price?: string;
	consider_stock?: number;
	remark?: string | null;
	is_active?: number;
	master_data?: MasterDataResponseType;
};

export type ItemSelectionResponseType = {
	id?: string;
	name?: string | null;
	is_active?: number;
	selection_types?: SelectionResponseType[];
};

export type ItemAttributeResponseType = {
	id?: string;
	name?: string;
	attributes?: {
		id?: string;
		name?: string;
		is_active?: number;
	}[];
};

export type ItemCategoryResponseType = {
	id?: string;
	name?: string;
	reference?: string;
	attachment?: string;
	is_active?: number;
	parent_item_category?: {
		id?: string;
		name?: string;
		reference?: string;
		attachment?: string;
		is_active?: number;
		parent_item_category?: {
			id?: string;
			name?: string;
			reference?: string;
			goods_type?: string | null;
			attachment?: string | null;
			is_active?: number;
			parent_item_category?: {
				id?: string;
				name?: string;
				reference?: string;
				attachment?: string;
				is_active?: number;
				parent_item_category?: {
					id?: string;
					name?: string;
					reference?: string;
					goods_type?: string | null;
					attachment?: string | null;
					is_active?: number;
					parent_item_category?: {
						id?: string;
						name?: string;
						reference?: string;
						goods_type?: string | null;
						attachment?: string | null;
						is_active?: number;
						parent_item_category?: {
							id?: string;
							name?: string;
							reference?: string;
							goods_type?: string | null;
							attachment?: string | null;
							is_active?: number;
							parent_item_category?: {
								id?: string;
								name?: string;
								reference?: string;
								goods_type?: string | null;
								attachment?: string | null;
								is_active?: number;
								parent_item_category?: any;
							};
						};
					};
				};
			};
		};
	};
};

export type ParentTypeResponse = {
	id?: string;
	code?: string;
	type?: number;
	title?: string | null;
	common_name?: string;
	scientific_name?: string;
	is_active?: number;
	item_selection?: ItemSelectionResponseType[];
	item_attributes?: ItemAttributeResponseType[][];
	item_category?: ItemCategoryResponseType;
};

export type DiversDenAdvertisementsModifiedDataResponseType = {
	id?: string;
	code?: string;
	type?: number;
	title?: string;
	display_name?: string;
	short_description?: string;
	long_description?: string;
	meta_keywords?: string;
	meta_description?: string;
	water_type?: number;
	aquatic_type?: string;
	additional_information?: string;
	is_loyalty_rewards?: number;
	is_deals_steals?: number;
	is_active?: number;
	item_media?: ItemMediaTypeResponse[];
	related_product?: RelatedProductTypeResponse[];
	guarantee_options?: GuaranteeOptionTypeResponse[];
	parent?: ParentTypeResponse;
	item?: string;
	reject_reason?: string;
	name?: string;
	size?: string;
	category?: string;
	warehouse?: string;
	price?: string;
	active?: boolean;
	special_message?: string;
	is_admin_only?: number;
	status?: number;
	adminOnly?: number;
};

export type GetDiversDenAdvertisementsResponseType = {
	data?: DiversDenAdvertisementsModifiedDataResponseType[];
	meta?: Meta;
};

export type GetOneDiversDenAdvertisementsResponseType = {
	data?: DiversDenAdvertisementsModifiedDataResponseType;
};

export type testMediaType = {
	id?: string | number;
	type?: string;
	link?: string;
};

export type testMediaResponseType = {
	imagesIn?: testMediaType[];
};
