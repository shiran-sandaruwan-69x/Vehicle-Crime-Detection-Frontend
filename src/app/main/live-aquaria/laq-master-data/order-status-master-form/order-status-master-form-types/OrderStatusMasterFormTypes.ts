export type OrderStatusMaster = {
	id?: number;
	name?: string;
	is_active?: number;
};

export type Meta = {
	total: number;
};

export type OrderStatusMasterType = {
	data?: OrderStatusMaster[];
	meta?: Meta;
};

export type OrderStatusMasterModifiedData = {
	id?: number;
	generalOrderStatus?: string;
	active?: boolean;
};

export type OrderStatusMasterCreateData = {
	generalOrderStatus?: string;
};
