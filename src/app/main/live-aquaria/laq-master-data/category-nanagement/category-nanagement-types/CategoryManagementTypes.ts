export type SubItemCategory = {
	id?: string;
	name?: string;
	reference?: string;
	goods_type?: string;
	attachment?: string;
	is_active?: number;
	sub_item_categories: SubItemCategory[];
};

export type Category = {
	id?: string;
	name?: string;
	reference?: string;
	attachment?: string;
	aquatic_type?: string;
	is_active?: number;
	goods_type?: string;
	sub_item_categories?: SubItemCategory[];
};

export type Meta = {
	total?: number;
};

export type CategoryType = {
	data?: Category[];
	meta?: Meta;
};

export type ModifiedCategoryDataType = {
	id?: string;
	category?: string;
	categoryName?: SubItemCategory[];
	referenceName?: string;
	attachment?: string;
	active?: boolean;
};

export type ModifiedCategoryData = {
	value?: string;
	label?: string;
};

export type CategoryFormData = {
	parentCategory1?: string;
	parentCategory2?: string;
	parentCategory3?: string;
	parentCategory4?: string;
	category?: string;
	aquaticType?: string;
	referenceName?: string;
	goodType?: string;
};

export type CategorySearchFormData = {
	categoryName?: string;
	aquatic_type?: string;
};

export type MediaDataType = {
	parent_id?: string;
	name?: string;
	reference?: string;
	attachment?: string;
	is_active?: number;
};

export type FlattenedCategory = {
	id?: string;
	category?: string;
	goodsType?: string;
	categoryName: string;
	aquatic_type: string;
	referenceName?: string | null;
	attachment?: string | null;
	active?: boolean;
	parentId?: string | null;
};
