export type ItemDetails = {
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
	selling_type?: string | null;
	regular_price?: string;
	inventory_qty?: number;
	is_active?: number;
	created_date?: string;
	is_assign?: boolean;
};

export type Meta = {
	total: number;
};

export type ItemDetailsType = {
	data?: ItemDetails[];
	meta?: Meta;
};

export type ItemDetailsModifiedData = {
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
	selling_type?: string | null;
	regular_price?: string;
	inventory_qty?: number;
	is_active?: number;
	created_date?: string;
	cisCode?: string;
	memberCode?: string;
	vendorCode?: string;
	scientificName?: string;
	assignedStatus?: string;
	active?: boolean;
};

export type EtfMasterData = {
	cisCode?: string;
	vendorCode?: string;
	country?: string;
	commonName?: string;
	scientificName?: string;
	assignedStatus?: string;
	masterProduct?: string;
	location?: string;
	aquatic_type?: string;
};

export type EtfMasterDataAdvanceFilter = {
	cisCode?: string;
	vendorCode?: string;
	country?: string;
	commonName?: string;
	scientificName?: string;
	assignedStatus?: boolean;
	masterProduct?: string;
	location?: string;
	aquatic_type?: string;
};
