export type CommonProductMasterCreateFormData = {
	location?: string;
	shippingType?: string;
	polyBagSizeId?: number;
	polyBagSize?: string;
	minNumOfProduct?: string;
	maxNumOfProduct?: string;
	tableData?: {
		id?:string;
	};
};

export type CommonProductMasterSubmitFormData = {
	location?: string;
	shippingType?: string;
	aquatic_type?: string;
	polyBagSizeId?: string;
	polyBagSize?: string;
	minNumOfProduct?: string;
	maxNumOfProduct?: string;
	tableData?: {
		id?:string;
	};
};

export type Meta = {
	total: number;
};

export type CompanyRes = {
	id?: string;
	code?: string;
	name?: string;
	description?: string;
	registration_no?: string;
	tax_no?: string;
	address_line_1?: string;
	address_line_2?: string;
	state?: string;
	city?: string;
	zip_code?: string;
	country_code?: string;
	email?: string;
	phone1?: string;
	phone2?: string;
	fax?: string;
	web?: string;
	is_active?: number;
};


export type PackingMaterialRes = {
	id?: string;
	packing_type_id?: string;
	packing_type_name?: string;
	name?: string;
	length?: string;
	width?: string;
	height?: string;
	bottom_area?: string;
	volume?: string;
	charge?: string;
	diameter?: string;
	incremental_height?: string;
	lid_diameter?: string;
	lid_height?: string;
	lid_incremental_height?: string;
	floor_area_of_lid?: string;
	volume_of_lid?: string;
	unit_of_measure_id?: string;
	unit_of_measure_name?: string;
	unit_price?: string;
	no_of_units?: string;
	is_active?: number;
};

export type BoxChargeRes = {
	id?: string;
	min_no_of_products?: string;
	max_no_of_product?: string;
	packing_material?: PackingMaterialRes;
};

type ShippingTypeRes = {
	id?: string;
	name?: string;
	allow_transit_delay?: number;
	is_active?: number;
	created_at?: string;
	updated_at?: string;
};

export type CommonProductMasterRes = {
	id?: string;
	master_code?: string;
	cis_code?: string;
	member_code?: string;
	vendor_code?: string;
	country?: string;
	common_name?: string;
	scientific_name?: string;
	description?: string;
	gender?: string;
	size?: string;
	age?: string;
	origins?: string;
	length?: string;
	selling_type?: null;
	aquatic_type?: null;
	regular_price?: string;
	inventory_qty?: number;
	location?: string;
	is_active?: number;
	created_date?: string;
	is_assign?: boolean;
	company?:CompanyRes;
	shipping_type?: ShippingTypeRes;
	box_charge?: BoxChargeRes[];
	tblData?:CommonProductMasterCreateFormData[];
};

export type CommonProductMasterApiRes = {
	data?: CommonProductMasterRes;
};

export type CommonProductMasterTableApiRes = {
	data?: CommonProductMasterRes[];
	meta?: Meta;
};

export type CommonProductMasterModifiedData = {
	id?: string;
	master_code?: string;
	cis_code?: string;
	member_code?: string;
	vendor_code?: string;
	country?: string;
	common_name?: string;
	scientific_name?: string;
	description?: string;
	gender?: string;
	size?: string;
	age?: string;
	origins?: string;
	length?: string;
	selling_type?: null;
	regular_price?: string;
	inventory_qty?: number;
	location?: string;
	is_active?: number;
	created_date?: string;
	is_assign?: boolean;
	assignedStatus?: string;
	aquatic_type?: string;
	active?: boolean;
	company?:CompanyRes;
	shipping_type?: ShippingTypeRes;
	box_charge?: BoxChargeRes[];
	tblData?:CommonProductMasterCreateFormData[];
};

export type CompanyData = {
	id?: string;
	code?: string;
	name?: string;
	description?: string | null;
	registration_no?: string;
	tax_no?: string | null;
	address_line_1?: string;
	address_line_2?: string;
	state?: string | null;
	city?: string;
	zip_code?: string | null;
	country_code?: string;
	email?: string;
	phone1?: string;
	phone2?: string;
	fax?: string;
	web?: string;
	is_active?: number;
};

export type CompanyDataApiRes = {
	data?: CompanyData[];
};
