export type DriversDenCisCodeDataType = {
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

export type DriversDenCisCodeDataResponseType = {
	data?: DriversDenCisCodeDataType;
};

export type CreateGeneralViewResetFormTypes = {
	cisCode?: string;
	commonName?: string;
	scientific_name1?: string;
	description?: string;
	gender?: string;
	size?: string;
	age?: string;
	origins?: string;
	length?: string;

	product_name?: string;
	short_description?: string;
	long_description?: string;
	product_tag_keywords?: string[];
	title?: string;
	meta_description?: string;
	additional_information?: string;
	isSoldWaterOrFresh?: string;
	description1?: string;
	scientific_name?: string;
	category?: string;
	subCategory?: string;
};

export type PriceOptionSubmitFormTypes = {
	sellingPrice?: string;
	displayPrice?: string;
	displayApplicable?: string;
	discountPrice?: string;
	isDiscounted?: boolean;
	newPrice?: string;
};

export type DriversDenSearchFormTypes = {
	code?: string;
	productName?: string;
	scientificName?: string;
	category?: string;
	cisCode?: string;
};

export type SelectionTypeDiversDenMaster = {
	id?: string;
	item_selection_id?: string;
	display_name?: string | null;
	display_price?: string;
	selling_price?: string;
	discount_rate?: string;
	discount_price?: string;
	consider_stock?: number;
	remark?: string | null;
	is_active?: number;
	master_data?: DriversDenCisCodeDataType;
};

export type ItemSelectionDiversDenMaster = {
	id?: string;
	name?: string | null;
	is_active?: number;
	selection_types?: SelectionTypeDiversDenMaster[];
};

export type AttributeDiversDenMaster = {
	id?: string;
	name?: string;
	is_active?: number;
};

export type ItemAttributeDiversDenMaster = {
	id?: string;
	name?: string;
	attributes?: AttributeDiversDenMaster[];
};

export type ParentCategoryDiversDenMaster = {
	id?: string;
	name?: string;
	reference?: string | null;
	goods_type?: string | null;
	attachment?: string | null;
	is_active?: number;
};

export type ItemCategoryDiversDenMaster = {
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

export type ProductDiversDenMaster = {
	id?: string;
	code?: string;
	title?: string;
	water_type?: string;
	common_name?: string | null;
	scientific_name?: string;
	short_description?: string;
	long_description?: string | null;
	meta_keywords?: string | null;
	meta_description?: string | null;
	additional_information?: string | null;
	is_advertisement?: number;
	is_active?: number;
	item_selection?: ItemSelectionDiversDenMaster[];
	item_attributes?: ItemAttributeDiversDenMaster[][];
	item_category?: ItemCategoryDiversDenMaster;
};

export type ProductDiversDenMasterModifyData = {
	id?: string;
	code?: string;
	title?: string;
	common_name?: string | null;
	scientific_name?: string;
	short_description?: string;
	long_description?: string | null;
	meta_keywords?: string | null;
	meta_description?: string | null;
	additional_information?: string | null;
	is_advertisement?: number;
	is_active?: number;
	item_selection?: ItemSelectionDiversDenMaster[];
	item_attributes?: ItemAttributeDiversDenMaster[][];
	item_category?: ItemCategoryDiversDenMaster;
	productName?: string;
	scientificName?: string;
	category?: string;
	active?: boolean;
};

export type Meta = {
	total?: number;
};

export type ProductDiversDenMasterType = {
	data?: ProductDiversDenMaster[];
	meta?: Meta;
};

export type OneProductDiversDenMasterType = {
	data?: ProductDiversDenMaster;
};
