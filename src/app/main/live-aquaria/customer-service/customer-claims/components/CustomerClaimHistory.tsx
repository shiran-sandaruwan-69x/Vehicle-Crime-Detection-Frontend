import React from 'react';
import { Grid } from '@mui/material';
import Button from '@mui/material/Button';

const sampleData = {
	customerDetails: {
		customerId: 'C123456',
		customerName: 'Robert Brown',
		email: 'robert.brown@example.com',
		mobile: '+1-555-555-5555'
	},
	orderDetails: {
		orderId: 'ORD987654',
		orderDate: '2024-09-30',
		deliveryDate: '2024-10-05',
		recurringOrder: 'YES',
		storePickup: 'Default',
		duration: 'Monthly',
		billingAddress: {
			name: 'Robert Brown',
			addressLine1: '7921 Warner Ave Unit C',
			city: 'Huntington Beach',
			state: 'CA',
			postalCode: '92647',
			country: 'United States'
		},
		shippingAddress: {
			name: 'Robert Brown',
			addressLine1: '7921 Warner Ave Unit C',
			city: 'Huntington Beach',
			state: 'CA',
			postalCode: '92647',
			country: 'United States'
		}
	}
};

interface Props {
	toggleModal: () => void;
	claim: any;
}

function CustomerClaimHistory({ toggleModal, claim }: Props) {
	const { customerDetails, orderDetails } = sampleData;
	console.log('claim', claim);

	return (
		<div className="min-w-full max-w-[100vw]">
			{/* Customer Details */}
			<Grid
				container
				spacing={2}
			>
				<Grid
					item
					xs={12}
					className="!pt-[5px]"
				>
					<h6 className="text-[12px] xl:text-[14px] text-primaryBlue font-600">Customer Details</h6>
				</Grid>
				<Grid
					item
					xs={12}
					sm={6}
					lg={3}
					className="!pt-[5px]"
				>
					<h6 className="text-[12px] xl:text-[14px]">
						<span className="font-600">Customer ID</span> : {claim?.customer?.code}
					</h6>
				</Grid>
				<Grid
					item
					xs={12}
					sm={6}
					lg={3}
					className="!pt-[5px]"
				>
					<h6 className="text-[12px] xl:text-[14px]">
						<span className="font-600">Customer Name</span> :{' '}
						{`${claim?.customer?.first_name} ${claim?.customer?.last_name}`}
					</h6>
				</Grid>
				<Grid
					item
					xs={12}
					sm={6}
					lg={3}
					className="!pt-[5px]"
				>
					<h6 className="text-[12px] xl:text-[14px]">
						<span className="font-600">Email</span> : {claim?.customer?.email}
					</h6>
				</Grid>
				<Grid
					item
					xs={12}
					sm={6}
					lg={3}
					className="!pt-[5px]"
				>
					<h6 className="text-[12px] xl:text-[14px]">
						<span className="font-600">Mobile</span> : {claim?.customer?.mobile_no}
					</h6>
				</Grid>
				<Grid
					item
					xs={12}
					className="pt-[15px!important]"
				>
					<hr />
				</Grid>
			</Grid>
			{/* Customer Details */}

			{/* Order Details */}
			<Grid
				container
				spacing={2}
				className="mt-[10px]"
			>
				<Grid
					item
					xs={12}
					className="!pt-[5px]"
				>
					<h6 className="text-[12px] lg:text-[14px] text-primaryBlue font-600">Order Details</h6>
				</Grid>
				<Grid
					item
					xs={12}
					sm={6}
					md={4}
					className="!pt-[5px]"
				>
					<h6 className="text-[12px] lg:text-[14px] mb-[4px]">
						<span className="inline-block min-w-[110px] font-600">Order ID</span> : {claim?.order?.order_no}
					</h6>
					<h6 className="text-[12px] lg:text-[14px] mb-[4px]">
						<span className="inline-block min-w-[110px] font-600">Order Date</span> :{' '}
						{claim?.order?.order_date}
					</h6>
					<h6 className="text-[12px] lg:text-[14px] mb-[4px]">
						<span className="inline-block min-w-[110px] font-600">Delivery Date</span> :{' '}
						{claim?.order_shipment?.estimated_delivery_date}
					</h6>
					<h6 className="text-[12px] lg:text-[14px] mb-[4px]">
						<span className="inline-block min-w-[110px] font-600">Pickup Option</span> :{' '}
						{claim?.order_shipment?.pickup_option?.option}
					</h6>
					<h6 className="text-[12px] lg:text-[14px] mb-[4px]">
						<span className="inline-block min-w-[110px] font-600">Recurring Order</span> :{' '}
						{claim?.order?.is_auto_place_order == 1 ? 'Yes' : 'No'}
					</h6>
				</Grid>
				<Grid
					item
					xs={12}
					sm={6}
					md={4}
					className="!pt-[5px]"
				>
					<h6 className="text-[12px] lg:text-[14px] mb-[4px]">
						<span className="block font-600">Billing Address :</span>
						{claim?.order?.billing_address?.name}
						<br />
						{claim?.order?.billing_address?.address_line_1}
						<br />
						{claim?.order?.billing_address?.city}, {claim?.order?.billing_address?.state}
						<br />
						{claim?.order?.billing_address?.zip_code}
						<br />
						{claim?.order?.billing_address?.country?.name}
					</h6>
				</Grid>
				<Grid
					item
					xs={12}
					sm={6}
					md={4}
					className="!pt-[5px]"
				>
					<h6 className="text-[12px] lg:text-[14px] mb-[4px]">
						<span className="block font-600">Shipping Address :</span>
						{claim?.order?.shipping_address?.name}
						<br />
						{claim?.order?.shipping_address?.address_line_1}
						<br />
						{claim?.order?.shipping_address?.city}, {claim?.order?.shipping_address?.state}
						<br />
						{claim?.order?.shipping_address?.zip_code}
						<br />
						{claim?.order?.shipping_address?.country?.name}
					</h6>
				</Grid>
			</Grid>
			{/* Order Details */}

			<Grid
				container
				spacing={2}
				className="mt-[5px]"
			>
				<Grid
					item
					md={12}
					sm={12}
					xs={12}
					className="flex justify-end items-center gap-[10px] pt-[10px!important]"
				>
					<Button
						onClick={toggleModal}
						className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
					>
						Close
					</Button>
				</Grid>
			</Grid>
		</div>
	);
}

export default CustomerClaimHistory;
