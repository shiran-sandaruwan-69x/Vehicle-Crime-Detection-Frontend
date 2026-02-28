import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios, { AxiosResponse } from 'axios';
import { FETCH_PICKER_LIST_BY_ORDER_ID } from 'src/app/axios/services/AdminServices';
import CustomTab from '../../../../../common/CustomTab';
import PrintPickListDetails from './PrintPickListDetails';
import PickListView from './PickListView';

export interface OrderResponse {
	data: OrderData;
}

export interface OrderData {
	id: number;
	order_code: string;
	no_of_items: number | null;
	total_price: string;
	estimated_delivery_date: string;
	order_status: string;
	remark: string | null;
	cancel_reason: string | null;
	order: OrderDetails;
	order_shipment_items: OrderShipmentItem[];
	logs: LogEntry[];
}

export interface OrderDetails {
	id: number;
	order_no: string;
	order_date: string | null;
	amount: string;
	redeem_credits: string;
	redeem_promo: string;
	redeem_gifts: string;
	box_charge: string;
	total_shipping_cost: string;
	tax_rate: string;
	tax_amount: string;
	total_amount: string;
	remark: string | null;
	is_active: number;
	customer_details: CustomerDetails;
	billing_address: Address;
	shipping_address: Address;
}

export interface CustomerDetails {
	id: string;
	code: string;
	first_name: string;
	last_name: string;
	mobile_no: string;
	email: string;
	gender: string | null;
	dob: string | null;
	is_active: number;
}

export interface Address {
	id: string;
	address_line_1: string;
	address_line_2: string;
	address_line_3: string;
	zip_code: string;
	city: string;
	state: string;
	country: Country;
	is_default_billing: number;
	is_default_shipping: number;
}

export interface Country {
	id: number;
	code: string;
	name: string;
	is_active: number;
}

export interface OrderShipmentItem {
	id: number;
	quantity: number;
	unit_price: string;
	sub_total: string;
	is_active: number;
	is_auto_delivery: number;
	is_delivered: number;
	remark: string | null;
	item: ItemDetails;
}

export interface ItemDetails {
	id: string;
	code: string;
	type: number;
	title: string;
	common_name: string;
	scientific_name: string;
	short_description: string;
	long_description: string;
	meta_keywords: string;
	meta_description: string;
	additional_information: string;
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
	item_attributes: ItemAttributeGroup[][];
}

export interface ItemAttributeGroup {
	id: string;
	name: string;
	attributes: Attribute[];
}

export interface Attribute {
	id: string;
	name: string;
	is_active: number;
}

export interface LogEntry {
	action?: string;
	remark?: string;
	details?: string;
	created_at?: string;
}

interface CustomTabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
}

function PickerCustomTabPanel({ children, value, index, ...other }: CustomTabPanelProps) {
	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && <Box sx={{ paddingTop: '10px' }}>{children}</Box>}
		</div>
	);
}

interface InitialOrderTabsProps {
	toggleModal: () => void;
	isOpen: boolean;
	clickedRowData: any;
	id: number;
	fetchOrdersToPicker:(id:string) => void;
	pickerListId:string;
}

function InitialOrderTabs({ toggleModal, isOpen, clickedRowData, id,fetchOrdersToPicker,pickerListId }: InitialOrderTabsProps) {
	const { t } = useTranslation('cancelOrders');

	const [, setValuesForProfileFormTab] = useState<any>(null); // Properly type `clickedRowData` if possible
	const [order, setOrder] = React.useState<OrderData>(null);

	useEffect(() => {
		fetchOrderById(id);
	}, [id]);

	const fetchOrderById = async (orderId: number) => {
		try {
			const response: AxiosResponse<OrderResponse> = await axios.get(FETCH_PICKER_LIST_BY_ORDER_ID + orderId);
			setOrder(response.data.data);
		} catch (error) {
			//
		}
	};

	useEffect(() => {
		setValuesForProfileFormTab(clickedRowData);
	}, [clickedRowData]);

	const [value, setValue] = useState<number>(0);

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

	return order === null ? (
		'loading..'
	) : (
		<Dialog
			fullWidth
			open={isOpen}
			maxWidth="xl"
			onClose={toggleModal}
			PaperProps={{
				style: {
					top: '40px',
					margin: 0,
					position: 'absolute'
				}
			}}
		>
			<DialogTitle className="pb-0">
				<h6 className="text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-400">
					{t('Picker List')}
				</h6>
			</DialogTitle>
			<DialogContent>
				<Grid
					container
					spacing={2}
				>
					<Grid
						item
						md={12}
						sm={12}
						xs={12}
						className="pt-[5px!important]"
					>
						<Tabs
							value={value}
							onChange={handleChange}
							aria-label="basic tabs example"
							variant="fullWidth"
							className="h-[30px] min-h-[40px] border-b border-gray-300"
						>
							<CustomTab
								label="Customer & Order Details"
								index={0}
							/>
							<CustomTab
								label="Item Related Details"
								index={1}
							/>
						</Tabs>
						<PickerCustomTabPanel
							value={value}
							index={0}
						>
							<PrintPickListDetails
								toggleModal={toggleModal}
								order={order}
							/>
						</PickerCustomTabPanel>
						<PickerCustomTabPanel
							value={value}
							index={1}
						>
							<PickListView
								toggleModal={toggleModal}
								order={order}
								fetchOrdersToPicker={fetchOrdersToPicker}
								pickerListId={pickerListId}
								fetchOrderById={fetchOrderById}
								id={id}
							/>
						</PickerCustomTabPanel>
					</Grid>
				</Grid>
			</DialogContent>
		</Dialog>
	);
}

export default InitialOrderTabs;
