interface OrderStatus {
	id: number;
	name: string;
	is_active: number;
}

interface CustomerDetails {
	id: string;
	code: string;
	first_name: string;
	last_name: string;
	mobile_no: string;
	email: string;
	gender: string | null;
	dob: string;
	is_active: number;
	profile_image: string | null;
	total_credit_points: string;
	total_remaining_points: string;
}

interface OrderShipment {
	id: number;
	order_code: string;
	no_of_items: number | null;
	total_price: string;
	box_charger: string | null;
	remark: string | null;
	estimated_delivery_date: string | null;
}

export interface OrderDetails {
	id: number;
	order_no: string;
	order_date: string;
	amount: string;
	redeem_credits: string;
	redeem_promo: string;
	redeem_gifts: string;
	redeem_rewards: string | null;
	box_charge: string;
	total_shipping_cost: string;
	tax_rate: string;
	tax_amount: string;
	net_amount: number;
	total_amount: string;
	remark: string | null;
	cancel_reason: string | null;
	created_at: string;
	elapsed_date: number;
	is_active: number;
	is_hotline_order: number;
	is_auto_place_order: number;
	order_status: OrderStatus;
	customer_details: CustomerDetails;
	order_shipments: OrderShipment[];
}

interface PaginationLinks {
	first: string;
	last: string;
	prev: string | null;
	next: string | null;
}

interface Pagination {
	links: PaginationLinks;
}

interface Link {
	url: string | null;
	label: string;
	active: boolean;
}

interface Meta {
	current_page: number;
	from: number;
	last_page: number;
	links: Link[];
	path: string;
	per_page: number;
	to: number;
	total: number;
}

export interface OrderResponseInterface {
	data: OrderDetails[];
	links: Pagination;
	meta: Meta;
}

export interface OrderReviewsInterface {
	id: number;
	code: string;
	customerName: string;
	email: string;
	date: string;
	elapsedDays: number;
	totalAmount: string;
	status: string;
}

interface ItemAttribute {
	id: string;
	name: string;
	attributes: Attribute[];
}

interface Attribute {
	id: string;
	name: string;
	is_active: number;
}

interface ItemSelectionType {
	id: number;
	item_selection_id: number;
	display_name: string | null;
	selling_price: string;
	display_price: string;
	discount_rate: string | null;
	discount_price: string;
	consider_stock: number;
	remark: string | null;
	is_active: number;
	master_data: MasterDataForItem | null;
}

interface MasterDataForItem {
	age: string;
	cis_code: string;
	common_name: string;
	country: string;
	created_date: string;
	description: string;
	gender: string;
	id: string;
	inventory_qty: string;
	is_active: number;
	is_assign: number;
	length: string;
	master_code: string;
	member_code: string;
	origins: string;
	regular_price: string;
	scientific_name: string;
	selling_type: string;
	size: string;
	vendor_code: string;
	shipping_type?:{
		id?:string;
		company?:{
			id?:string;
			name?:string;
		};
	};
}

export interface OrderItem {
	id: number;
	quantity: number;
	unit_price: string;
	sub_total: string;
	is_active: number;
	is_auto_delivery: string | null;
	is_delivered: string | null;
	remark: string | null;
	delivered_date: string | null;
	admin_remark: string | null;
	delete_reason: string | null;
	item_selection_type: ItemSelectionType;
	item_old: string | null;
	item: Item;
}

interface Item {
	id: string;
	code: string;
	type: number;
	title: string | null;
	common_name: string;
	scientific_name: string;
	short_description: string | null;
	long_description: string | null;
	meta_keywords: string | null;
	meta_description: string | null;
	additional_information: string | null;
	water_type: string | null;
	is_loyalty_rewards: number;
	is_weekly_special: number;
	is_auto_delivery: number;
	is_availability_emails: number;
	special_message: string | null;
	is_admin_only: number;
	reject_reason: string | null;
	status: number;
	is_advertisement: number;
	is_active: number;
	average_product_rating: number;
	average_delivery_rating: number;
	item_attributes: ItemAttribute[][];
}

interface OrderStatus {
	id: number;
	name: string;
	is_active: number;
}

interface PickupOption {
	id: number;
	option: string;
	is_active: number;
}

interface OrderLog {}

export interface OrderShipmentPerOrder {
	id: number;
	order_code: string;
	no_of_items: number | null;
	total_price: string;
	box_charger: string | null;
	remark: string | null;
	estimated_delivery_date: string | null;
	pickup_option: PickupOption;
	shipping_method: string | null;
	order_status: OrderStatus;
	order_items: OrderItem[];
	order_logs: OrderLog[];
}

interface CustomerDetails {
	id: string;
	code: string;
	first_name: string;
	last_name: string;
	mobile_no: string;
	email: string;
	gender: string | null;
	dob: string;
	is_active: number;
	profile_image: string | null;
	total_credit_points: string;
	total_remaining_points: string;
}

export interface OrderByIDResponseInterface {
	id: number;
	estimated_delivery_date: string;
	order_no: string;
	order_date: string;
	amount: string;
	redeem_credits: string;
	redeem_promo: string;
	redeem_gifts: string;
	redeem_rewards: string | null;
	box_charge: string;
	total_shipping_cost: string;
	tax_rate: string;
	tax_amount: string;
	net_amount: string;
	total_amount: string;
	remark: string | null;
	cancel_reason: string | null;
	created_at: string;
	elapsed_date: number;
	is_active: number;
	is_hotline_order: number;
	is_auto_place_order: number;
	order_status: OrderStatus;
	customer_details: CustomerDetails;
	logs: any[];
	billing_address: {
		id: string;
		address_line_1: string;
		address_line_2: string;
		address_line_3: string | null;
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
	} | null;
	shipping_address: {
		id: string;
		address_line_1: string;
		address_line_2: string;
		address_line_3: string | null;
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
	} | null;
	order_shipments: OrderShipmentPerOrder[];
	redeems: any[];
}

export interface FormikFormReviewsInterface {
	date: string;
	orderStatus: string;
	cancel_order_reason: string;
	remarks: string;
}
