export type ShippingTypeSearchForm = {
	shippingType?: string;
};

export type StandardShippingCostSubmitData = {
	minimumAmount?: string;
	maximumAmount?: string;
	shippingAmount?: string;
};

export type Meta = {
	total?: number;
};

export type StandardShippingCostRes = {
	id?: string;
	type?: string;
	amount?: string;
	day?: string;
	max_amount?: string;
	shipping_amount?: string;
	percentage?: number;
	time?: string;
	transit_days?: number;
	start_date?: string;
	end_date?: string;
	reason?: string;
	is_active?: number;
	created_at?: string;
	updated_at?: string;
	shipping_schedule?: {
		id?: string;
		title?: string;
		description?: string;
		is_active?: number;
		work_day?: string[];
	};
	state?: {
		id?: string;
		name?: string;
	};
	shipping_type?: {
		id?: number;
		name?: string;
		allow_transit_delay?: number;
		is_active?: number;
		created_at?: string;
		updated_at?: string;
	};
};

export type StandardShippingCostApiResponse = {
	data?: StandardShippingCostRes[];
	meta?: Meta;
};

export type StandardShippingCostModifiedData = {
	id?: string;
	type?: string;
	amount?: string;
	day?: string;
	max_amount?: string;
	shipping_amount?: string;
	percentage?: number;
	time?: string;
	transit_days?: number;
	start_date?: string;
	end_date?: string;
	reason?: string;
	is_active?: number;
	created_at?: string;
	updated_at?: string;
	shipping_schedule?: {
		id?: string;
		title?: string;
		description?: string;
		is_active?: number;
		work_day?: string[];
	};
	state?: {
		id?: string;
		name?: string;
	};
	shipping_type?: {
		id?: number;
		name?: string;
		allow_transit_delay?: number;
		is_active?: number;
		created_at?: string;
		updated_at?: string;
	};
	active?: boolean;
	deliverySchedule?: string;
};

export type ShippingStateResponse = {
	id?: string;
	name?: string;
};

export type ShippingStateApiResponse = {
	data?: ShippingStateResponse[];
};

export type AdditionalCostStateSubmitData = {
	state?: string;
	amount?: string;
	reason?: string;
};

export type AdditionalCostDaysSubmitData = {
	days?: string;
	amount?: string;
	deliverySchedule?: string;
};
