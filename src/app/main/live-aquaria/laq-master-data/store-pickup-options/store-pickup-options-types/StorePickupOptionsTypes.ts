export type PickupOptions = {
	id?: number;
	option?: string;
	is_active?: number;
};

export type Meta = {
	total: number;
};

export type PickupOptionsType = {
	data?: PickupOptions[];
	meta?: Meta;
};

export type PickupOptionsModifiedData = {
	id?: number;
	pickupOption?: string;
	active?: boolean;
};

export type PickupOptionsCreateData = {
	pickupOption?: string;
};
