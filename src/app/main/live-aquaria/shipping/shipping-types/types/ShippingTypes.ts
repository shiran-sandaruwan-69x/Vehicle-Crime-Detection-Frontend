export type ShippingTypeItemCategoryResponse = {
	id?: string;
	name?: string;
	reference?: string;
	goods_type?: string;
	attachment?: string;
	is_active?: number;
};

export type ShippingMethodsTypeResponse = {
	id?: string;
	method?: string;
	amount?: string;
	transit_days?: string;
	service_provider?: string;
	service_name?: string;
	is_active?: number;
	created_at?: string;
};

export type ShippingTypeResponse = {
	allow_transit_delay?: number;
	id?: string;
	name?: string;
	is_active?: number;
	created_at?: string;
	updated_at?: string;
	shipping_method?: ShippingMethodsTypeResponse[];
};

export type Meta = {
	total?: number;
};

export type ShippingTypeApiResponse = {
	data?: ShippingTypeResponse[];
	meta?: Meta;
};

export type ShippingTypeModifiedData = {
	id?: string;
	name?: string;
	is_active?: number;
	created_at?: string;
	updated_at?: string;
	shipping_method?: ShippingMethodsTypeResponse[];
	shipping_type_name?: string;
	shipping_method_ids?: string[];
	create_date?: string;
	active?: boolean;
	allow_transit_delay?: string;
	allow_transit_delay_type?: boolean;
};

export type ShippingCreateType = {
	shippingType?: string;
	create_date?: string;
	allow_transit_delay?: boolean;
	shipping_type_id?: string[];
};

export type ShippingTransformedDataType = {
	id?: string;
	name?: string;
};

export type ShippingMethodsObject = {
	id?: string;
	method?: string;
	amount?: string;
	transit_days?: number;
	service_provider?: string;
	service_name?: string | null;
	is_active?: number;
	created_at?: string;
	shipping_types?: {
		id?: number;
		name?: string;
		allow_transit_delay?: number;
		is_active?: number;
		created_at?: string;
		updated_at?: string;
	}[];
	shipping_schedule?: {
		id?: number;
		title?: string;
		description?: string;
		is_active?: number;
		work_day?: string[];
	};
};

export type ShippingMethodResponseWithOutPagination = {
	data?: ShippingMethodsObject[];
};

export type ShippingTypeFilterSubmitData = {
	shippingTypeName?: string;
};

export type ShippingScheduleSubmitDataDataType = {
	scheduleName?: string;
	workDays?: string[];
	description?: string;
	date_field?: string | Date;
	message?: string;
};
export type ShippingScheduleMessageData = {
	id?: string;
	shipping_schedule_id?: number;
	message?: string;
	date?: string;
	tableData?: {
		id?:string;
	};
};
export type ShippingScheduleResponse = {
	id?: string;
	title?: string;
	description?: string;
	is_active?: number | null;
	work_day?: string[];
	message?: ShippingScheduleMessageData[];
};
export type ShippingScheduleApiResponse = {
	data?: ShippingTypeResponse[];
	meta?: Meta;
};
export type ShippingScheduleModifiedData = {
	id?: string;
	title?: string;
	description?: string;
	is_active?: number | null;
	work_day?: string[];
	message?: ShippingScheduleMessageData[];
	active?: boolean;
	schedule_name?: string;
};
export type ShippingScheduleFilter = {
	scheduleName?: string;
	workDays?: string;
};