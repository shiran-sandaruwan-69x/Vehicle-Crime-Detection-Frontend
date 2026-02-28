export type UnitPriceCharge = {
	id?: number;
	reason?: string;
	is_active?: number;
};

export type Meta = {
	total: number;
};

export type UnitPriceChargeType = {
	data?: UnitPriceCharge[];
	meta?: Meta;
};

export type UnitPriceChargeModifiedData = {
	id?: number;
	reason?: string;
	active?: boolean;
};

export type UnitPriceChargeCreateData = {
	unitPriceChargeReason?: string;
};
