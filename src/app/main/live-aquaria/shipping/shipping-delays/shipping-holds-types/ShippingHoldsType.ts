export type ShippingHoldsSubmitType = {
	startDate?: string;
	startTime?: string;
	endDate?: string;
	endTime?: string;
	appliedState?: string;
	appliedCategory?: string;
	informCustomers?: boolean;
	reason?: string;
	status?: string;
	parentCategory1?: string;
	parentCategory2?: string;
	parentCategory3?: string;
	parentCategory4?: string;
	parentCategory5?: string;
};

export type ItemCategory = {
	id?: string;
	name?: string;
	reference?: string;
	attachment?: string;
	is_active?: number;
	parent_item_category?: {
		id?: string;
		name?: string;
		reference?: string;
		attachment?: string;
		is_active?: number;
		parent_item_category?: {
			id?: string;
			name?: string;
			reference?: string;
			goods_type?: string | null;
			attachment?: string | null;
			is_active?: number;
			parent_item_category?: {
				id?: string;
				name?: string;
				reference?: string;
				attachment?: string;
				is_active?: number;
				parent_item_category?: {
					id?: string;
					name?: string;
					reference?: string;
					goods_type?: string | null;
					attachment?: string | null;
					is_active?: number;
					parent_item_category?: {
						id?: string;
						name?: string;
						reference?: string;
						goods_type?: string | null;
						attachment?: string | null;
						is_active?: number;
						parent_item_category?: {
							id?: string;
							name?: string;
							reference?: string;
							goods_type?: string | null;
							attachment?: string | null;
							is_active?: number;
							parent_item_category?: {
								id?: string;
								name?: string;
								reference?: string;
								goods_type?: string | null;
								attachment?: string | null;
								is_active?: number;
								parent_item_category?: any;
							};
						};
					};
				};
			};
		};
	};
};

export type ShippingHoldsRes = {
	id?: string;
	start_date?: string;
	start_time?: string;
	end_date?: string;
	end_time?: string;
	reason?: string;
	is_inform_customers?: number;
	is_active?: number;
	shipping_type?: {
		id?: number;
		name?: string;
		allow_transit_delay?: number;
		is_active?: number;
		created_at?: string;
		updated_at?: string;
	};
	item_category?: ItemCategory;
	state?: {
		id?: string;
		name?: string;
	};
	status?: string;
};

export type Meta = {
	total?: number;
};

export type ShippingHoldsTypeApiRes = {
	data?: ShippingHoldsRes[];
	meta?: Meta;
};

export type ShippingHoldsModifiedData = {
	id?: string;
	start_date?: string;
	start_time?: string;
	end_date?: string;
	end_time?: string;
	reason?: string;
	is_inform_customers?: number;
	is_active?: number;
	shipping_type?: {
		id?: number;
		name?: string;
		allow_transit_delay?: number;
		is_active?: number;
		created_at?: string;
		updated_at?: string;
	};
	item_category?: ItemCategory;
	state?: {
		id?: string;
		name?: string;
	};
	status?: string;
	stateName?: string;
	category?: string;
	informCustomers?: boolean;
	active?: boolean;
	startTime?: string;
	endTime?: string;
};

export type ShippingHoldsFilter = {
	startDate?: string;
	endDate?: string;
	state?: string;
	category?: string;
};
