export interface CustomerDetailsByIdResponseInterface {
	id: string;
	code: string;
	first_name: string;
	last_name: string;
	mobile_no: string;
	email: string;
	gender: any;
	dob: string;
	aquatic_type: any;
	is_active: number;
	profile_image: any;
	total_credit_points: number;
	total_remaining_points: number;
	default_billing_address: {
		id: string;
		address_line_1: string;
		address_line_2: string;
		address_line_3: string | null;
		city: string;
		state: string;
		zip_code: string;
		country: {
			id: string;
			code: string;
			name: string;
			is_active: number;
		};
		is_default_billing: number;
		is_default_shipping: number;
	} | null;
	default_shipping_address: {
		id: string;
		address_line_1: string;
		address_line_2: string;
		address_line_3: string | null;
		city: string;
		state: string;
		zip_code: string;
		country: {
			id: string;
			code: string;
			name: string;
			is_active: number;
		};
		is_default_billing: number;
		is_default_shipping: number;
	} | null;
	addresses:
		| {
				id: string;
				address_line_1: string;
				address_line_2: string;
				address_line_3: string | null;
				city: string;
				state: string;
				zip_code: string;
				country: {
					id: string;
					code: string;
					name: string;
					is_active: number;
				};
				is_default_billing: number;
				is_default_shipping: number;
		  }[]
		| null;
	subscribe: Subscribe;
}

export interface Subscribe {
	id: number;
	first_name: string;
	last_name: string;
	email: string;
	is_salt_water_sneak_peek: number;
	is_salt_water_once_daily: number;
	is_fresh_water_sneak_peek: number;
	is_fresh_water_once_daily: number;
	is_news_letter: number;
	is_reward_point: number;
}

export interface CustomersResponseInterface {
	data: CustomersInterface[];
	links: Links;
	meta: Meta;
}

export interface CustomersInterface {
	id: string;
	code: string;
	first_name: string;
	last_name: string;
	mobile_no: string;
	email: string;
	gender: any;
	dob?: string;
	aquatic_type: any;
	is_active: number;
	profile_image?: string;
	total_credit_points: number;
	total_remaining_points: number;
	default_shipping_address: {
		id: string;
		address_line_1: string;
		address_line_2: string;
		address_line_3: string | null;
		city: string;
		state: string;
		zip_code: string;
		country: {
			id: string;
			code: string;
			name: string;
			is_active: number;
		};
		is_default_billing: number;
		is_default_shipping: number;
	} | null;
	default_billing_address: {
		id: string;
		address_line_1: string;
		address_line_2: string;
		address_line_3: string | null;
		city: string;
		state: string;
		zip_code: string;
		country: {
			id: string;
			code: string;
			name: string;
			is_active: number;
		};
		is_default_billing: number;
		is_default_shipping: number;
	} | null;
}

export interface Links {
	first: string;
	last: string;
	prev: any;
	next: string;
}

export interface Meta {
	current_page: number;
	from: number;
	last_page: number;
	links: Link[];
	path: string;
	per_page: number;
	to: number;
	total: number;
}

export interface Link {
	url?: string;
	label: string;
	active: boolean;
}

export interface ProductDetailsByCISCodeResponseInterface {
	data: ProductDetailsByCISCodeInterface;
	is_auto_delivery: number;
}

export interface ProductDetailsByCISCodeInterface {
	id: string;
	master_code: string;
	cis_code: string;
	member_code: string;
	vendor_code: string;
	country: string;
	common_name: string;
	scientific_name: string;
	description: string;
	gender: string;
	size: string;
	age: string;
	origins: string;
	length: string;
	selling_type: any;
	regular_price: string;
	inventory_qty: number;
	is_active: number;
	created_date: string;
	is_assign: boolean;
	shipping_type: any;
	item_selection_types: ItemSelectionType[];

	// modify data

	quantity?: number;
	change_price?: boolean;
	unit_price?: number;
	change_reason?: number;
	autoDelivery?: boolean;
	delivery_duration?: number;
	remarks?: string;
}

// export interface ItemSelectionType {
// 	id: number;
// 	item_selection_id: number;
// 	display_name: string;
// 	selling_price: any;
// 	display_price: string;
// 	discount_rate: any;
// 	discount_price: any;
// 	consider_stock: number;
// 	remark: any;
// 	is_active: number;
// 	master_data: MasterData;
// }

export interface MasterData {
	id: string;
	master_code: string;
	cis_code: string;
	member_code: string;
	vendor_code: string;
	country: string;
	common_name: string;
	scientific_name: string;
	description: string;
	gender: string;
	size: string;
	age: string;
	origins: string;
	length: string;
	selling_type: any;
	regular_price: string;
	inventory_qty: number;
	is_active: number;
	created_date: string;
	is_assign: boolean;
}

//

export interface CISProductsResponseInterface {
	data: CISProductInterface[];
	links: Links;
	meta: Meta;
}

export interface CISProductInterface {
	id: string;
	master_code: string;
	cis_code: string;
	member_code: string;
	vendor_code: string;
	country: string;
	common_name: string;
	scientific_name: string;
	description: string;
	gender: string;
	size: string;
	age: string;
	origins: string;
	length: string;
	selling_type: any;
	regular_price: string;
	inventory_qty: number;
	is_active: number;
	created_date: string;
	is_assign: boolean;
	shipping_type: any;
	company: any;
	box_charge: any[];
}

export interface PriceChangeReasonInterface {
	id: number;
	reason: string;
	is_active: number;
	created_at: string;
	updated_at: string;
}

export interface AutoDeliveryDurationResponseInterface {
	data: AutoDeliveryDurations[];
	links: Links;
	meta: Meta;
}

export interface AutoDeliveryDurations {
	id: number;
	duration: string;
	is_active: number;
}

export interface CustomerCartDetailsResponseInterface {
	id: string;
	code: string;
	first_name: string;
	last_name: string;
	mobile_no: string;
	email: string;
	gender: any;
	dob: string;
	aquatic_type: any;
	is_active: number;
	profile_image: any;
	total_credit_points: number;
	total_remaining_points: number;
	default_billing_address: any;
	default_shipping_address: any;
	carts: Cart[];
}

export interface Cart {
	id: number;
	amount: string;
	redeem_credits: string;
	redeem_promo: string;
	redeem_gifts: string;
	box_charge: string;
	total_shipping_cost: string;
	tax_rate: string;
	tax_amount: string;
	total_amount: string;
	remark: any;
	status: string;
	customer_details: CustomerDetails;
	cart_shipments: CartShipment[];
}

export interface CustomerDetails {
	id: string;
	number: string;
	first_name: string;
	last_name: string;
	mobile_no: string;
	email: string;
	gender: any;
	dob: string;
	aquatic_type: any;
	image: any;
	is_active: number;
	total_credit_points: number;
	total_reward_points: number;
	auto_delivery_item_count: number;
}

export interface CartShipment {
	id: number;
	no_of_items: any;
	total_price: string;
	box_charge: string;
	estimated_delivery_date: any;
	shipping_cost: any;
	remark: any;
	shipping_type: ShippingTypeInterface;
	cart_items: CartItem[];
}

export interface ShippingTypeInterface {
	id: number;
	name: string;
	allow_transit_delay: number;
	is_active: number;
	created_at: string;
	updated_at: string;
	shipping_method: ShippingMethod[];
}

export interface ShippingMethod {
	id: number;
	method: string;
	amount: string;
	transit_days: number;
	service_provider: string;
	service_name: string;
	is_active: number;
	created_at: string;
}

export interface CartItem {
	id: number;
	item_selection_type_id: number;
	purchase_certificate_id: any;
	quantity: number;
	unit_price: string;
	sub_total: string;
	is_auto_delivery: number;
	remark: string;
	item_old: any;
	item: Item;
	item_selection_type: ItemSelectionType;
}

export interface Item {
	id: string;
	code: string;
	title: string;
	common_name: string;
	type: number;
	aquatic_type: any;
	scientific_name: string;
	short_description: any;
	is_have_auto_delivery: number;
	item_attributes: ItemAttribute[][];
}

export interface ItemAttribute {
	name: string;
	attribute: Attribute[];
}

export interface Attribute {
	name: string;
}

export interface ItemSelectionType {
	id: number;
	item_selection_id: number;
	display_name: string;
	selling_price: any;
	display_price: string;
	discount_rate: any;
	discount_price: any;
	consider_stock: number;
	remark: any;
	is_active: number;
	master_data: MasterData;
}

export interface CustomerWithCartResponseInterface {
	id: string;
	code: string;
	first_name: string;
	last_name: string;
	mobile_no: string;
	email: string;
	gender: any;
	dob: any;
	aquatic_type: any;
	is_active: number;
	profile_image: any;
	total_credit_points: number;
	total_remaining_points: number;
	carts: Cart[];
	default_shipping_address: {
		id: string;
		address_line_1: string;
		address_line_2: string;
		address_line_3: string | null;
		city: string;
		state: string;
		zip_code: string;
		country: {
			id: string;
			code: string;
			name: string;
			is_active: number;
		};
		is_default_billing: number;
		is_default_shipping: number;
	} | null;
	default_billing_address: {
		id: string;
		address_line_1: string;
		address_line_2: string;
		address_line_3: string | null;
		city: string;
		state: string;
		zip_code: string;
		country: {
			id: string;
			code: string;
			name: string;
			is_active: number;
		};
		is_default_billing: number;
		is_default_shipping: number;
	} | null;
}

export interface CartShipmentsWithSeletedMethodInterface {
	cart_shipment_id: number;
	shipping_method_id: number;
}
