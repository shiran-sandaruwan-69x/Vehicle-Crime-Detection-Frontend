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
	total_credit_points: string | number;
	total_remaining_points: string | number;
}

interface Order {
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
	customer_details: CustomerDetails;
}

export interface OrderDataInterface {
	id: number;
	order_code: string;
	no_of_items: number | null;
	total_price: string;
	shipping_cost: string | null;
	box_charge: string | null;
	estimated_delivery_date: string | null;
	order_status: string;
	remark: string | null;
	cancel_reason: string | null;
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

interface Links {
	first: string;
	last: string;
	prev: string | null;
	next: string | null;
}

interface MetaLink {
	url: string | null;
	label: string;
	active: boolean;
}

interface Meta {
	current_page: number;
	from: number;
	last_page: number;
	links: MetaLink[];
	path: string;
	per_page: number;
	to: number;
	total: number;
}

export interface BackOrdersHistoryRersponseInterface {
	data: OrderDataInterface[];
	links: Links;
	meta: Meta;
}
