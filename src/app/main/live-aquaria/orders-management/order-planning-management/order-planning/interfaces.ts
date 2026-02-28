export interface OrderShipmentItem {
	id: number;
	quantity: number;
	unit_price: string;
	sub_total: string;
	is_active: number;
	is_auto_delivery: boolean | null;
	is_delivered: boolean | null;
	remark: string | null;
	delivered_date: string | null;
	admin_remark: string | null;
	delete_reason: string | null;
	item_selection_type: {
		id: number;
		item_selection_id: number;
		display_name: string;
		display_price: string;
		consider_stock: number;
		is_active: number;
		master_data: {
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
			inventory_qty: number;
			is_active: number;
			created_date: string;
			shipping_type?:{
				id?:string;
				company?:{
					id?:string;
					name?:string;
				};
			};
			is_assign: boolean;
		};
	};
	item: {
		id: string;
		code: string;
		type: number;
		title: string;
		common_name: string;
		scientific_name: string;
		short_description: string | null;
		long_description: string;
		is_loyalty_rewards: number;
		is_weekly_special: number;
		is_auto_delivery: number;
		is_availability_emails: number;
		special_message: string;
		is_admin_only: number;
		status: number;
		is_advertisement: number;
		is_active: number;
		average_product_rating: number;
		average_delivery_rating: number;
		item_attributes: Array<
			Array<{
				id: string;
				name: string;
				attributes: Array<{ id: string; name: string; is_active: number }>;
			}>
		>;
	};
}

export interface OrderShipmentInterface {
	id: number;
	order_code: string;
	no_of_items: number | null;
	total_price: string;
	shipping_cost: string | null;
	box_charge: string;
	estimated_delivery_date: string;
	order_status: string;
	remark: string | null;
	cancel_reason: string | null;
	elapsed_date: number;
	pickup_option: {
		id: number;
		option: string;
		is_active: number;
	};
	shipping_method: string | null;
	order: {
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
		customer_details: {
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
		};
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
		redeems: any[];
	};
	order_shipment_items: OrderShipmentItem[];
	logs: any[];
	created_at: string;
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

export interface OrderData {
	id: number;
	order_code: string;
	no_of_items: number | null;
	total_price: string;
	shipping_cost: string | null;
	box_charge: string;
	estimated_delivery_date: string | null;
	order_status: string;
	remark: string | null;
	cancel_reason: string | null;
	elapsed_date: number;
	order: Order;
	created_at: string;
}

interface PaginationLink {
	url: string | null;
	label: string;
	active: boolean;
}

interface Links {
	first: string;
	last: string;
	prev: string | null;
	next: string | null;
}

interface Meta {
	current_page: number;
	from: number;
	last_page: number;
	links: PaginationLink[];
	path: string;
	per_page: number;
	to: number;
	total: number;
}

export interface OrderPlanningResponseInterface {
	data: OrderData[];
	links: Links;
	meta: Meta;
}

export interface OrdersInterface {
	id: number;
	code: string;
	customerName: string;
	email: string;
	date: string;
	elapsedDays: number;
	orderValue: string;
	status: number;
	order_status: string;
}

export interface ItemsInterface {
	id: number;
	productId: string;
	productCode: string;
	productName: string;
	quantity: number;
	customerRemark: string | null;
	adminRemark: string | null;
	unitPrice: string;
	totalPrice: string;
	size: string;
	status: number;
}

export interface RemarksInitialValuesInterface{
    remarks: string;
    date: string;
}
