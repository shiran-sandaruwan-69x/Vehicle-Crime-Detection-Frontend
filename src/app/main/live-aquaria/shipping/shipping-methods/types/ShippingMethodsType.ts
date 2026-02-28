export type ShippingTypeResponse = {
	allow_transit_delay?: number;
	id?: string;
	name?: string;
	is_active?: number;
	created_at?: string;
	updated_at?: string;
};

export type ShippingMethodsResponse = {
	id?: string;
	method?: string;
	amount?: string;
	transit_days?: string;
	service_provider?: string;
	service_name?: string;
	is_active?: number;
	created_at?: string;
	shipping_types?: ShippingTypeResponse[];
};

export type Meta = {
	total?: number;
};

export type ShippingMethodsTypeApiResponse = {
	data?: ShippingMethodsResponse[];
	meta?: Meta;
};

export type ShippingMethodsModifiedData = {
	id?: string;
	method?: string;
	amount?: string;
	transit_days?: string;
	service_provider?: string;
	service_name?: string | null;
	is_active?: number;
	created_at?: string;
	shipping_schedule?: {
		id?: string;
		title?: string;
		description?: string;
		is_active?: number;
		work_day?: string[];
	};
	methodName?: string;
	deliverySchedule?: string;
	create_date?: string;
	active?: boolean;
};

export type ShippingTypeDrp = {
	id?: string;
	name?: string;
	displayName?: string;
};

export type MaintenanceScheduleResponse = {
	id?: string;
	title?: string;
	description?: string;
	is_active?: number;
	work_day?: string[];
	message: {
		id?: string;
		shipping_schedule_id?: number;
		message?: string;
		date?: string;
	}[];
};

export type MaintenanceScheduleTypeApiResponse = {
	data?: MaintenanceScheduleResponse[];
	meta?: Meta;
};

export type ShippingScheduleTypeDrp = {
	label?: string;
	value?: string;
};

export type ShippingMethodsFormData = {
	method?: string;
	amount?: string;
	shippingDeliverySchedule?: string;
	transit_days?: string;
	service_provider?: string;
};

export type ShippingMethodRes = {
	id?: string;
	method?: string;
	amount?: string;
	transit_days?: string;
	service_provider?: string;
	service_name?: string | null;
	is_active?: number;
	created_at?: string;
	shipping_schedule?: {
		id?: string;
		title?: string;
		description?: string;
		is_active?: number;
		work_day?: string[];
	};
};

export type ShippingMethodTypeRes = {
	data?: ShippingMethodRes[];
	meta?: Meta;
};

export type ShippingFilteringType = {
	serviceProvider?: string;
	shipType?: string;
	status?: string;
	transitDays?: string;
};
