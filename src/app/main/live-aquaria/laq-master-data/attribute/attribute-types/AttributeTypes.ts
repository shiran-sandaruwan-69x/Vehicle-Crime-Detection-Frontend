export type ItemAttribute = {
	id?: string;
	name?: string;
	is_active?: number;
};

export type OneAttributeType = {
	id?: string;
	name?: string;
	is_active?: number;
	item_attribute?: ItemAttribute[];
};

export type Meta = {
	total?: number;
};

export type AttributeType = {
	data?: OneAttributeType[];
	meta?: Meta;
};

export type AttributeModifiedData = {
	id?: string;
	name?: string;
	active?: boolean;
};

export type AttributeCreateData = {
	attributeName?: string;
	attributeValues?: string[];
};

export type MappedItemAttribute = {
	valId?: string;
	value?: string;
};

export type MappedAttribute = {
	id?: string;
	attribute?: string;
	values?: MappedItemAttribute[];
	active?: boolean;
};

export type AttributeFormData = {
	attribute: string;
	values: string[];
};

export type AttributeSubmitData = {
	name: string;
	item_attribute: string[];
	is_active: number;
};

export type AttributeSearchSubmitData = {
	attributesName?: string;
};
