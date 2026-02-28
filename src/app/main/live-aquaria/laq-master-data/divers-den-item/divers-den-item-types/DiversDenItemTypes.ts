export type createDiversDenItemDelete = {
	diversDenItem?: string;
};

export type DiversDenItemDeleteReason = {
	id?: string;
	reason?: string;
	is_active?: number;
};

export type Meta = {
	total: number;
};

export type DiversDenItemDeleteReasonType = {
	data?: DiversDenItemDeleteReason[];
	meta?: Meta;
};

export type DiversDenItemDeleteReasonModifiedData = {
	id?: string;
	reason?: string;
	active?: boolean;
};
