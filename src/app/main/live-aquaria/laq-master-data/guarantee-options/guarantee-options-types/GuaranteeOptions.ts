export type GuaranteeOptions = {
	guaranteeName?: string;
	description?: string;
};

export type ItemCategoryType = {
	id?: string;
	name?: string;
	reference?: string;
	attachment?: string;
	is_active?: number;
};

export type GuaranteeOptionType = {
	id?: string;
	name?: string;
	descriptions?: string;
	is_active?: number;
	attachment?: string;
	item_category?: ItemCategoryType;
};

export type Meta = {
	total: number;
};

export type GuaranteeOptionsDataType = {
	data?: GuaranteeOptionType[];
	meta?: Meta;
};

export type ModifiedGuaranteeOptionsDataType = {
	id?: string;
	guaranteeName?: string;
	description?: string;
	attachment?: string;
	active?: boolean;
};
