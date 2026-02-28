export interface BackOrdersResponseInterface {
	data: BackOrderDetailsInterface[];
	links: Links;
	meta: Meta;
}

export interface BackOrderDetailsInterface {
	id: number;
	order_code: string;
	no_of_items: any;
	total_price: string;
	shipping_cost: any;
	box_charge: string;
	estimated_delivery_date: string;
	order_status: string;
	remark: string;
	cancel_reason: string;
	elapsed_date: number;
	order: Order;
	created_at: string;

	code: string;
	customer_name: string;
	email: string;
	date: string;
	total_amount: string;
	status: string;
	elapsedTime: number;
}

export interface Order {
	id: number;
	order_no: string;
	order_date: string;
	amount: string;
	redeem_credits: string;
	redeem_promo: string;
	redeem_gifts: string;
	redeem_rewards: any;
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
	is_active: number;
	profile_image: string;
	total_credit_points: string;
	total_remaining_points: string;
}

export interface Links {
	first: string;
	last: string;
	prev: any;
	next: any;
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
