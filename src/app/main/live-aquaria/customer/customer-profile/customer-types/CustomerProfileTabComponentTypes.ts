type Country = {
	id?: number;
	code?: string;
	name?: string;
};

type Address = {
	id?: string;
	address_line_1?: string;
	address_line_2?: string | null;
	address_line_3?: string | null;
	zip_code?: string;
	city?: string;
	state?: string;
	country?: Country;
	is_default_billing?: number;
	is_default_shipping?: number;
};

type UserProfile = {
	id?: string;
	first_name?: string;
	last_name?: string;
	mobile_no?: string;
	email?: string;
	gender?: string;
	dob?: string;
	is_active?: number;
	default_billing_address?: Address;
	default_shipping_address?: Address;
	addresses?: Address[];
};

// eslint-disable-next-line unused-imports/no-unused-vars
type ApiResponse = {
	data?: UserProfile;
};

// eslint-disable-next-line unused-imports/no-unused-vars
type ProfileUpdateData = {
	first_name: string;
	last_name: string;
	mobile_no: string;
	email: string;
	gender: string;
	dob: string;
	is_active: number;
};

// eslint-disable-next-line unused-imports/no-unused-vars
type FormValues = {
	firstName?: string;
	lastName?: string;
	gender?: string;
	birthday?: string;
	mobile?: string;
};
