export type Reason = {
	id?: string;
	reason?: string;
	is_active?: number;
};

export type Meta = {
	total: number;
};

export type ReasonType = {
	data?: Reason[];
	meta?: Meta;
};

export type ReasonModifiedData = {
	id?: string;
	reason?: string;
	active?: boolean;
};

export type ReasonCreateData = {
	cancelReason?: string;
};
