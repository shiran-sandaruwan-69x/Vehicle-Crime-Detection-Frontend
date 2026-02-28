export interface OrderFullfilmentsResponse {
	data: OrderFullfilment[];
	links: Links;
	meta: Meta;
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
	links: {
		active: boolean;
		url: string;
		label: string;
	}[];
	path: string;
	per_page: number;
	to: number;
	total: number;
}

export interface OrderFullfilment {
	id: number;
	order_code: string;
	no_of_items: any;
	total_price: string;
	estimated_delivery_date: string;
	order_status: string;
	remark: any;
	cancel_reason: string;
	elapsed_date: number;
	order: Order;
	picker: any;
	created_at: string;
}

export interface Order {
	id: number;
	order_no: string;
	order_date: string;
	amount: string;
	redeem_credits: string;
	redeem_promo: string;
	redeem_gifts: string;
	redeem_rewards: string;
	box_charge: string;
	total_shipping_cost: string;
	tax_rate: string;
	tax_amount: string;
	net_amount: number;
	total_amount: string;
	remark: string;
	cancel_reason: string;
	created_at: string;
	elapsed_date: number;
	is_active: number;
	is_hotline_order: number;
	is_auto_place_order: number;
	customer_details: CustomerDetails;
	gross_amount: number;
}

export interface CustomerDetails {
	id: string;
	code: string;
	first_name: string;
	last_name: string;
	mobile_no: string;
	email: string;
	gender: any;
	dob: string;
	aquatic_type: string;
	is_active: number;
	profile_image: any;
	total_credit_points: string;
	total_remaining_points: string;
}

export interface OrderFullfillmentObject {
	id: number;
	orderId: string;
	customer: string;
	email: string;
	date: string;
	elapsedDays: number;
	orderValue: string;
	order_code: string;
	no_of_items: any;
	total_price: string;
	estimated_delivery_date: string;
	order_status: string;
	remark: any;
	cancel_reason: string;
	elapsed_date: number;
	order: Order;
	picker: any;
	created_at: string;
}

export interface OrderFullfilmentByIdResponse {
	id: number;
	order_code: string;
	tracking_number: string;
	no_of_items: any;
	total_price: string;
	estimated_delivery_date: string;
	order_status: string;
	remark: any;
	cancel_reason: string;
	elapsed_date: number;
	pickup_option: PickupOption;
	shipping_method: any;
	order: OrderInterface;
	order_shipment_items: OrderShipmentItem[];
	logs: OrderLogTypes[];
	order_cancel_details: any;
	created_at: string;
}

export interface PickupOption {
	id: number;
	option: string;
	is_active: number;
}

export type OrderLogTypes = {
	action?: string;
	remark?: string;
	details?: string;
	created_at?: string;
};

export interface OrderInterface {
	id: number;
	order_no: string;
	order_date: string;
	amount: string;
	redeem_credits: string;
	redeem_promo: string;
	redeem_gifts: string;
	redeem_rewards: string;
	box_charge: string;
	total_shipping_cost: string;
	tax_rate: string;
	tax_amount: string;
	net_amount: string;
	total_amount: string;
	remark: any;
	cancel_reason: string;
	created_at: string;
	elapsed_date: number;
	is_active: number;
	is_hotline_order: number;
	is_auto_place_order: number;
	customer_details: CustomerDetailsForById;
	billing_address: {
		id: string;
		address_line_1: string;
		address_line_2: string;
		address_line_3: string;
		zip_code: string;
		city: string;
		state: string;
		country: {
			id: number;
			code: string;
			name: string;
			is_active: number;
		};
		is_default_billing: number;
		is_default_shipping: number;
	};
	shipping_address: {
		id: string;
		address_line_1: string;
		address_line_2: string;
		address_line_3: string;
		zip_code: string;
		city: string;
		state: string;
		country: {
			id: number;
			code: string;
			name: string;
			is_active: number;
		};
		is_default_billing: number;
		is_default_shipping: number;
	};
	redeems: any[];
	gross_amount: number;
}

export interface CustomerDetailsForById {
	id: string;
	code: string;
	first_name: string;
	last_name: string;
	mobile_no: string;
	email: string;
	gender: any;
	dob: string;
	aquatic_type: string;
	is_active: number;
	profile_image: any;
	total_credit_points: string;
	total_remaining_points: string;
}

export interface OrderShipmentItem {
	id: number;
	quantity: number;
	unit_price: string;
	sub_total: string;
	is_active: number;
	is_auto_delivery: any;
	is_delivered: any;
	remark: string;
	delivered_date: any;
	admin_remark: string;
	delete_reason: any;
	item_selection_type: ItemSelectionType;
	item: Item;
	purchase_certificate: any;
}

export interface ItemSelectionType {
	id: number;
	item_selection_id: number;
	display_name: any;
	selling_price: string;
	display_price: string;
	discount_rate: string;
	discount_price: string;
	consider_stock: number;
	remark: any;
	is_active: number;
	master_data: MasterData;
}

export interface MasterData {
	id: string;
	master_code: string;
	cis_code: string;
	member_code: string;
	vendor_code: string;
	country: string;
	company: string;
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
	aquatic_type: string;
	is_active: number;
	created_date: string;
	is_assign: boolean;
	shipping_type?:{
		id?:string;
		company?:{
			id?:string;
			name?:string;
		};
	};
}

export interface Item {
	id: string;
	code: string;
	type: number;
	aquatic_type: any;
	title: string;
	common_name: string;
	scientific_name: any;
	short_description: any;
	long_description: string;
	meta_keywords: any;
	meta_description: any;
	additional_information: any;
	water_type: any;
	is_loyalty_rewards: number;
	is_weekly_special: number;
	is_auto_delivery: number;
	is_availability_emails: number;
	special_message: string;
	is_admin_only: number;
	reject_reason: any;
	status: number;
	is_advertisement: number;
	is_active: number;
	average_product_rating: number;
	average_delivery_rating: number;
	item_attributes: any[][];
}
