export type TableDataProductSelection = {
	id?: string;
	cisCode?: string;
	gender?: string;
	size?: string;
	age?: string;
	origin?: string;
	length?: string;
	sellingPrice?: string;
	displayPrice?: string;
	availableQty?: string;
	considerStock?: boolean;
	remark?: string;
	displayName?: string;
	oldId?: string;
	masterDataId?: string;
	displayApplicable?: string;
	isDiscounted?: boolean;
	newPrice?: string;
};

export type ProductSelectionTypes = {
	productSelectionName?: string;
	cisCode?: string;
	selectionId?: string;
	active?: boolean;
	tableData?: TableDataProductSelection[];
};

export type ProductSelectionsDataType = {
	values?: ProductSelectionTypes[];
};

export type CreateGeneralViewTypes = {
	product_name?: string;
	title?: string;
	aquaticType?: string;
	description1?: string;
	scientific_name?: string;
	category?: string;
	subCategory?: string;
	parentCategory1?: string;
	parentCategory2?: string;
	parentCategory3?: string;
	parentCategory4?: string;
	parentCategory5?: string;
};

export type MapSubCategory = {
	id?: string;
	name?: string;
	reference?: string;
};

export type MappedCategoryTypes = {
	value?: string;
	label?: string;
	subCategory?: MapSubCategory[];
};

export type SubOptionsTypes = {
	value?: string;
	label?: string;
};

export type ItemAttributeType = {
	item_attribute?: string[];
};

export type AttributeValueType = {
	attribute?: string;
	values?: string[];
	newChipValue?: string;
	editingIndex?: number;
	error?: string;
	selectedValues?: string[];
};

export type ItemAttributeResponseType = {
	id?: string;
	name?: string;
	is_active?: number;
};

export type AttributeResponseType = {
	id?: string;
	name?: string;
	is_active?: number;
	item_attribute?: ItemAttributeResponseType[];
};

export type AttributeResponse = {
	data?: AttributeResponseType[];
};

export type EditRemarkType = {
	id?: string;
	remark?: string;
	type?: string;
};

export type ProductSelectionsCompTableDataType = {
	id?: string;
	cisCode?: string;
	gender?: string;
	size?: string;
	age?: string;
	origin?: string;
	length?: string;
	sellingPrice?: string;
	displayPrice?: string;
	masterDataId?: string;
	aquatic_type?: string;
	oldId?: string;
	availableQty?: string;
	considerStock?: boolean;
	remark?: string;
	displayApplicable?: string;
	newPrice?: string;
	displayName?: string;
};

export type ProductSelectionType = {
	productSelectionName?: string;
	cisCode?: string;
	tableData?: ProductSelectionsCompTableDataType[];
};

export type ProductSelectionValuesType = {
	values: ProductSelectionType[];
};

// Type definition for master data inside selection types
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
	inventory_qty?: string;
	is_active?: number;
	created_date?: string;
};

// Type definition for selection types inside item selections
export type SelectionType = {
	id?: string;
	item_selection_id?: number;
	display_name?: string;
	masterDataId?: string;
	display_price?: string;
	selling_price?: string;
	discount_rate?: string;
	consider_stock?: number;
	remark?: string | null;
	is_active?: number;
	master_data?: MasterData;
};

// Type definition for item selections inside the main object
export type ItemSelection = {
	id?: string;
	name?: string;
	is_active?: number;
	selection_types?: SelectionType[];
};

// Type definition for item attributes inside the main object
export type Attribute = {
	id?: string;
	name?: string;
	is_active?: number;
};

// Type definition for an attribute group inside item attributes
export type AttributeGroup = {
	id?: string;
	name?: string;
	attributes?: Attribute[];
};

export type ItemCategory = {
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

// Main type definition for the entire object structure
export type AllProductSelectionTypes = {
	id?: string;
	code?: string;
	type?: string;
	title?: string;
	aquatic_type?: string;
	common_name?: string;
	scientific_name?: string;
	short_description?: string | null;
	long_description?: string | null;
	meta_keywords?: string | null;
	meta_description?: string | null;
	additional_information?: string | null;
	is_advertisement?: string;
	is_active?: number;
	item_selection?: ItemSelection[];
	item_attributes?: AttributeGroup[][];
	item_category?: ItemCategory;
};

export type AllProductSelectionResponseCountTypes = {
	total?: number;
};

export type AllProductSelectionResponseTypes = {
	data?: AllProductSelectionTypes[];
	meta?: AllProductSelectionResponseCountTypes;
};

export type AllProductSelectionResponseOnesObjectTypes = {
	data?: AllProductSelectionTypes;
};

// Type definition for the table data product selection (already defined by you)
export type TableDataAllProductModifiedDataType = {
	id?: string;
	code?: string;
	type?: string;
	title?: string;
	aquatic_type?: string;
	common_name?: string;
	scientific_name?: string;
	short_description?: string | null;
	long_description?: string | null;
	meta_keywords?: string | null;
	meta_description?: string | null;
	additional_information?: string | null;
	is_advertisement?: string;
	is_active?: number;
	item_selection?: ItemSelection[];
	item_attributes?: AttributeGroup[][];
	item_category?: ItemCategory;
	itemNumber?: string;
	productName?: string;
	category?: string;
	description?: string;
	active?: boolean;
};

export type ProductListSearchSubmitData = {
	productId?: string;
	productName?: string;
	category?: string;
	variety?: string;
	location?: string;
};

export type PastAttributesType = {
	[key: string]: string[];
};

export type GeneralViewModifyData = {
	category?: string;
	subCategory?: string;
};

export type AttributeType = {
	name?: string;
	id?: string;
};

export type AttributeItemType = {
	attribute?: string;
	attributeId?: string;
	selectedValuesWithId?: AttributeType[];
	selectedValues?: string[];
	newChipValue?: string;
	editingIndex?: number;
	error?: string;
	values?: string[];
};

export type CisCodeDataItem = {
	age?: string;
	cis_code?: string;
	common_name?: string;
	aquatic_type?: string;
	country?: string;
	created_date?: string;
	description?: string;
	gender?: string;
	id?: string;
	inventory_qty?: number;
	is_active?: number;
	length?: string;
	master_code?: string;
	member_code?: string;
	origins?: string;
	regular_price?: string;
	scientific_name?: string;
	selling_type?: string | null; // could be null
	size?: string;
	vendor_code?: string;
};

export type CisCodeResponse = {
	data?: CisCodeDataItem[];
};

export type OptionsSetDataItem = {
	id?: string;
	cisCode?: string;
	gender?: string;
	aquatic_type?: string;
	size?: string;
	age?: string;
	origin?: string;
	length?: string;
	sellingPrice?: string;
	displayPrice?: string;
	availableQty?: number;
	considerStock?: number;
	remark?: string;
};

export type OptionsSetDataDropDownData = {
	label?: string;
	value?: string;
};

export type MasterDataViewProductSelection = {
	cis_code?: string;
	id?: string;
	gender?: string;
	size?: string;
	age?: string;
	origins?: string;
	length?: string;
	regular_price?: string;
	inventory_qty?: number;
};

export type SelectionTypeViewProductSelection = {
	id?: string;
	master_data?: MasterDataViewProductSelection;
	display_price?: string;
	consider_stock?: number;
	remark?: string;
	display_name?: string;
};

export type ItemSelectionViewProductSelection = {
	id?: string;
	name?: string;
	selection_types?: SelectionTypeViewProductSelection[];
	is_active?: number;
};

export type ModifiedDataItemViewProductSelection = {
	selectionId?: string;
	productSelectionName?: string;
	cisCode: string;
	tableData: {
		oldId?: string;
		cisCode?: string;
		masterDataId?: string;
		gender?: string;
		size?: string;
		age?: string;
		origin?: string;
		length?: string;
		sellingPrice?: string;
		displayPrice?: string;
		availableQty?: string;
		considerStock: boolean;
		remark?: string;
		displayName?: string;
	}[];
	active: boolean;
};
export type handleToggleConsiderStockData = {
	mainId?: string;
	masterDataId?: string;
	rowId?: string;
	remark?: string;
};

export type ProductMasterDataOnsubmitData = {
	productId?: string;
	productName?: string;
	category?: string;
	productSelection?: string;
	aquatic_type?: string;
};

export type PriceAndRemarkSubmitForm = {
	displayName?: string;
	masterDataId?: string;
	sellingPrice?: string;
	displayPrice?: string;
	displayApplicable?: string;
	discountPrice?: string;
	isDiscounted?: boolean;
	newPrice?: string;
	considerStock?: boolean;
	remark?: string;
};
