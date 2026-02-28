export type NewCustomerOnSubmitValuesTypes = {
	firstName?: string;
	lastName?: string;
	mobileNumber?: string;
	email?: string;
	gender?: string;
	birthday?: string;
	address1?: string;
	address2?: string;
	address3?: string;
	zipPostalCode?: string;
	city?: string;
	state?: string;
	country?: string;
	defaultBillingAddress?: string;
	defaultShippingAddress?: string;
	defaultShippingNewAddressLine1?: string;
	defaultShippingNewAddressLine2?: string;
	defaultShippingNewAddressLine3?: string;
	defaultShippingNewZipPostalCode?: string;
	defaultShippingNewCity?: string;
	defaultShippingNewState?: string;
	defaultShippingNewCountry?: string;
	defaultBillingNewAddressLine1?: string;
	defaultBillingNewAddressLine2?: string;
	defaultBillingNewAddressLine3?: string;
	defaultBillingNewZipPostalCode?: string;
	defaultBillingNewCity?: string;
	defaultBillingNewState?: string;
	defaultBillingNewCountry?: string;
	validatedAddress?: ValidatedAddressTypes;
};

export type CustomerTypes = {
	first_name?: string;
	last_name?: string;
	mobile_no?: string;
	email?: string;
	gender?: string;
	dob?: string;
	addresses?: AddressTypes[];
	validatedAddresses?: ValidatedAddressTypes[];
};

export type AddressTypes = {
	address_line_1?: string;
	address_line_2?: string;
	address_line_3?: string;
	zip_code?: string;
	// postalCode?: string;
	city?: string;
	state?: string;
	// stateOrProvinceCode?: string;
	// countryCode?: string;
	country_id?: string;
	country_code?: string;
	is_default_billing?: number;
	is_default_shipping?: number;
	is_validated?: boolean;
};

export type ValidatedAddressTypes = {
	address_line_1?: string;
	address_line_2?: string;
	address_line_3?: string;
	zip_code?: string;
	city?: string;
	state?: string;
	country?: string;
	validationStatus?: string;
};

export type AdvanceFilteringTypes = {
	code?: string;
	customerId?: string;
	customerName?: string;
	mobile?: string;
	email?: string;
	city?: string;
	state?: string;
	country?: string;
};

export type CountiesResponseTypes = {
	data?: CountiesTypes[];
};

export type CountiesTypes = {
	id?: string;
	code?: string;
	name?: string;
};
export type dropDown = {
	value?: string;
	label?: string;
};

export type TableRowData = {
	id?: string;
	code?: string;
	customerId?: string;
	customerName?: string;
	mobile?: string;
	email?: string;
	creditPoints?: string;
	active?: boolean;
	tableData?: {
		id: number;
	};
	total_credit_points?: string;
	total_remaining_points?: string;
};

export type CustomerResponse = {
	id?: string;
	code?: string;
	first_name?: string;
	last_name?: string;
	mobile_no?: string;
	email?: string;
	is_active?: number;
	dob?: string;
	gender?: string;
	total_credit_points?: string;
	total_remaining_points?: string;
};

export type Meta = {
	total?: number;
};

export type CustomersApiResponse = {
	meta?: Meta;
	data?: CustomerResponse[];
};

export type CountryApiResponse = {
	id?: string;
	code?: string;
	name?: string;
	is_active?: number;
};

export type AddressApiResponse = {
	id?: string;
	address_line_1?: string;
	address_line_2?: string;
	address_line_3?: string;
	zip_code?: string;
	city?: string;
	state?: string;
	country?: CountryApiResponse;
	is_default_billing?: number;
	is_default_shipping?: number;
};

export type SubscribeApiResponse = {
	id?: string;
	first_name?: string;
	last_name?: string;
	email?: string;
	is_salt_water_sneak_peek?: number;
	is_salt_water_once_daily?: number;
	is_fresh_water_sneak_peek?: number;
	is_fresh_water_once_daily?: number;
	is_news_letter?: number;
	is_reward_point?: number;
};

export type CustomerIdDataApiResponse = {
	id?: string;
	code?: string;
	first_name?: string;
	last_name?: string;
	mobile_no?: string;
	email?: string;
	gender?: string;
	dob?: string;
	profile_image?: string;
	is_active?: number;
	default_billing_address?: AddressApiResponse;
	default_shipping_address?: AddressApiResponse;
	addresses?: AddressApiResponse[];
	subscribe?: SubscribeApiResponse;
};

export type CustomerIdApiResponse = {
	data?: CustomerIdDataApiResponse;
};

export type CustomerProfileEditSubmitData = {
	firstName?: string;
	lastName?: string;
	birthday?: string;
	mobile?: string;
};

export type CustomerProfileAddressEditSubmitData = {
	addressLine1: string;
	addressLine2: string;
	addressLine3: string;
	zipAndPostalCode: string;
	city: string;
	state: string;
	country: string;
	defaultShipping: string;
	defaultBilling: string;
};

export type CustomerProfileCreditPointsSubmitData = {
	creditPoints?: string;
	remark?: string;
};

export type CustomerPointsData = {
	id?: string;
	customer_id?: string;
	order_id?: string;
	order_shipment_id?: string;
	order_shipment_item_id?: string;
	points?: string;
	redeem_points?: string;
	remaining_points?: string;
	remark?: string;
	is_admin_added?: number;
	is_active?: number;
	created_at?: string;
};

export type CustomerPointsDataResponse = {
	data?: CustomerPointsData[];
	credit_points_balance?: string;
};

export type CustomerUsedPoints = {
	id?: string;
	order_no?: string;
	order_date?: string;
	amount?: string;
	redeem_credits?: string;
	redeem_promo?: string;
	redeem_gifts?: string;
	redeem_rewards?: string;
	box_charge?: string;
	total_shipping_cost?: string;
	tax_rate?: string;
	tax_amount?: string;
	net_amount?: number;
	total_amount?: string;
	remark?: string;
	cancel_reason?: string;
	created_at?: string;
	elapsed_date?: number;
	is_active?: number;
	customer_details: {
		id?: string;
		code?: string;
		first_name?: string;
		last_name?: string;
		mobile_no?: string;
		email?: string;
		gender?: string;
		dob?: string;
		is_active?: number;
		profile_image?: string;
		total_credit_points?: string;
		total_remaining_points?: string;
	};
};

export type CustomerUsedPointsDataResponse = {
	data?: CustomerUsedPoints[];
	used_points?: string;
};

export type CustomerOrderHistoryFilterData = {
	orderId?: string;
	productId?: string;
	productName?: string;
	fromDate?: string;
	toDate?: string;
};

export type OrderHistoryFilterData = {
	id?: string;
	order_code?: string;
	no_of_items?: string;
	total_price?: string;
	box_charger?: string;
	remark?: string;
	estimated_delivery_date?: string;
	order_status?: {
		id?: string;
		name?: string;
		is_active?: number;
	};
	order_details?: {
		id?: string;
		order_no?: string;
		order_date?: string;
		amount?: string;
		redeem_credits?: string;
		redeem_promo?: string;
		redeem_gifts?: string;
		redeem_rewards?: string;
		box_charge?: string;
		total_shipping_cost?: string;
		tax_rate?: string;
		tax_amount?: string;
		net_amount?: string;
		total_amount?: string;
		remark?: string;
		cancel_reason?: string;
		created_at?: string;
		elapsed_date?: string;
		is_active?: number;
		customer_details?: {
			id?: string;
			code?: string;
			first_name?: string;
			last_name?: string;
			mobile_no?: string;
			email?: string;
			gender?: string;
			dob?: string;
			is_active?: number;
			profile_image?: string;
			total_credit_points?: string;
			total_remaining_points?: string;
		};
		billing_address?: {
			id?: string;
			address_line_1?: string;
			address_line_2?: string;
			address_line_3?: string;
			zip_code?: string;
			city?: string;
			state?: string;
			country?: {
				id?: string;
				code?: string;
				name?: string;
				is_active?: number;
			};
			is_default_billing?: number;
			is_default_shipping?: number;
		};
		shipping_address?: {
			id?: string;
			address_line_1?: string;
			address_line_2?: string;
			address_line_3?: string;
			zip_code?: string;
			city?: string;
			state?: string;
			country?: {
				id?: string;
				code?: string;
				name?: string;
				is_active?: number;
			};
			is_default_billing?: number;
			is_default_shipping?: number;
		};
	};
};

export type OrderHistoryFilterResponseData = {
	data?: OrderHistoryFilterData[];
};

export type CustomerSubServiceSubmitData = {
	customer_id?: string;
	is_news_letter?: number;
	is_reward_point?: number;
	is_salt_water_sneak_peek?: number;
	is_salt_water_once_daily?: number;
	is_fresh_water_sneak_peek?: number;
	is_fresh_water_once_daily?: number;
};

export type CustomerOrderItemsOnceObj = {
	id: string;
	quantity: number;
	unit_price: string;
	sub_total: string;
	is_active: number;
	is_auto_delivery?: any;
	is_delivered?: any;
	remark?: string;
	delivered_date?: any;
	admin_remark?: any;
	delete_reason?: any;
	item_selection_type?: {
		id?: string;
		master_data?: {
			id?: string;
			cis_code?: string;
		};
	};
	item?: {
		id?: string;
		code?: string;
		type?: number;
		title?: string;
		common_name?: string;
		scientific_name?: string;
		short_description?: string;
		long_description?: string;
		meta_keywords?: string;
		meta_description?: string;
		additional_information?: string;
		water_type?: string;
		is_loyalty_rewards?: number;
		is_weekly_special?: number;
		is_auto_delivery?: number;
		is_availability_emails?: number;
		special_message?: string;
		is_admin_only?: number;
		reject_reason?: string;
		status?: number;
		is_advertisement?: number;
		is_active?: number;
		average_product_rating?: number;
		average_delivery_rating?: number;
		item_attributes?: {
			id?: string;
			name?: string;
			attributes?: {
				id?: string;
				name?: string;
				is_active?: number;
			}[];
		}[][];
	};
	purchase_certificate: {
		id: string;
		order_id: string;
		code: string;
		from: string;
		to: string;
		date_to_send?: string | null;
		message: string;
		email?: string | null;
		amount: string;
		delivery_method: string;
		created_at: string;
		gift_certificate: {
			id: string;
			name: string;
			display_name: string;
			start_date: string;
			end_date: string;
			price: string;
			thumbnail: string;
			style: string;
			is_active: number;
		};
	};
};

export type OrderLogTypes = {
	action?: string;
	remark?: string;
	details?: string;
	created_at?: string;
};

export type CustomerOrderOnceObj = {
	id: string;
	order_code: string;
	no_of_items?: number;
	total_price: string;
	box_charger?: any;
	remark?: any;
	estimated_delivery_date?: string;
	pickup_option: {
		id: string;
		option: string;
		is_active: number;
	};
	shipping_method?: any;
	order_status: {
		id: string;
		name: string;
		is_active: number;
	};
	order_items: CustomerOrderItemsOnceObj[];
	order_cancel_details?: any;
	order_details: {
		id: string;
		order_no: string;
		order_date?: string;
		amount: string;
		redeem_credits: string;
		redeem_promo: string;
		redeem_gifts: string;
		redeem_rewards?: string;
		box_charge?: string;
		total_shipping_cost: string;
		tax_rate: string;
		tax_amount: string;
		net_amount: string;
		total_amount: string;
		remark?: string;
		cancel_reason?: string;
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
			gender?: any;
			dob: string;
			is_active: number;
			profile_image: string;
			total_credit_points: number;
			total_remaining_points: number;
		};
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
	};
	order_logs?: OrderLogTypes[];
};

export type CustomerOrderOnceResponseData = {
	data?: CustomerOrderOnceObj;
};

export type CustomerOrderDetailsDataType = {
	orderId?: string;
	orderDate?: string;
	deliveryDate?: string;
	recurringOrder?: string;
	storePickup?: string;
	duration?: string;
	fedexTrackingNumber?: string;
	billingAddress?: {
		name?: string;
		addressLine1?: string;
		city?: string;
		state?: string;
		postalCode?: string;
		country?: string;
	};
	shippingAddress?: {
		name?: string;
		addressLine1?: string;
		city?: string;
		state?: string;
		postalCode?: string;
		country?: string;
	};
};

export type CustomerOrderHistoryTableDataType = {
	productId?: string;
	productName?: string;
	size?: string;
	quantity?: number;
	wareHouse?: string;
	status?: number;
	customerRemark?: string;
	unitPrice?: string;
	totalPrice?: string;
};

export type CustomerSummaryDataType = {
	cartTotal?: string;
	boxCharge?: string;
	shippingCost?: string;
	taxTotal?: string;
	grossTotal?: string;
	creditPointsApplied?: string;
	applicableRewardPoints?: string;
	applicablePromos?: string;
	giftCertificate?: string;
	netTotal?: string;
};

export type CustomerScheduleType = {
	id?: string;
	duration?: string;
	is_active?: string;
};

export type CustomerScheduleResponseType = {
	data?: CustomerScheduleType[];
};

export type CustomerScheduleSubmitForm = {
	qty?: string;
	schedule?: string;
};

export type AutoDeliveryDataItemType = {
	id?: string;
	quantity?: string;
	start_date?: string;
	next_date?: string;
	item_total?: string;
	box_charge?: string;
	shipping_cost?: number;
	tax_total?: number;
	net_total?: number;
	delivery_duration?: {
		id?: string;
		duration?: string;
		is_active?: number;
	};
	customer_details?: {
		id?: string;
		code?: string;
		first_name?: string;
		last_name?: string;
		mobile_no?: string;
		email?: string;
		gender?: string | null;
		dob?: string;
		is_active?: number;
		profile_image?: string;
		total_credit_points?: number;
		total_remaining_points?: number;
		default_shipping_address?: {
			id?: string;
			address_line_1?: string;
			address_line_2?: string | null;
			address_line_3?: string | null;
			zip_code?: string;
			city?: string;
			state?: string;
			country?: {
				id?: number;
				code?: string;
				name?: string;
				is_active?: number;
			};
			is_default_billing?: number;
			is_default_shipping?: number;
		};
	};
	order_shipment_item?: {
		id?: string;
		quantity?: number;
		unit_price?: string | null;
		sub_total?: string;
		is_active?: number;
		is_auto_delivery?: number | null;
		is_delivered?: number | null;
		remark?: string;
		delivered_date?: string | null;
		admin_remark?: string | null;
		delete_reason?: string | null;
		item?: {
			id?: string;
			code?: string;
			type?: number;
			title?: string;
			common_name?: string;
			scientific_name?: string;
			short_description?: string;
			long_description?: string;
			meta_keywords?: string;
			meta_description?: string;
			additional_information?: string | null;
			water_type?: string | null;
			is_loyalty_rewards?: number;
			is_weekly_special?: number;
			is_auto_delivery?: number;
			is_availability_emails?: number;
			special_message?: string;
			is_admin_only?: number;
			reject_reason?: string | null;
			status?: number;
			is_advertisement?: number;
			is_active?: number;
			average_product_rating?: number;
			average_delivery_rating?: number;
			item_attributes?: {
				id?: string;
				name?: string;
				attributes?: {
					id?: string;
					name?: string;
					is_active?: number;
				}[];
			}[][];
			item_media?: {
				id?: string;
				type?: string;
				link?: string;
			}[];
		};
		order_shipment?: {
			id?: string;
			order_code?: string;
			no_of_items?: string;
			total_price?: string;
			box_charger?: string;
			remark?: string;
			estimated_delivery_date?: string;
		};
	};
	item_details?: {
		id?: string;
		item_selection_id?: number;
		display_name?: string;
		selling_price?: string | null;
		display_price?: string;
		discount_rate?: string | null;
		discount_price?: string | null;
		consider_stock?: number;
		remark?: string | null;
		is_active?: number;
		master_data?: {
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
	};
};

export type AutoDeliveryResponseData = {
	data?: AutoDeliveryDataItemType[];
};

export type ItemMediaAtoDelivery = {
	id?: string;
	type?: string;
	link?: string;
};
