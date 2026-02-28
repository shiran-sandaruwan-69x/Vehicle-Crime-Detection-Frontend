import { Grid } from '@mui/material';
import Button from '@mui/material/Button';
import React from 'react';

interface Props {
	toggleModal: () => void;
	order: any;
}

function CancelOrderCustomerDetails({ toggleModal, order }: Props) {
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
					className="pt-[10px!important] mb-[5px]"
				>
					<h6 className="text-[12px] lg:text-[14px] text-primaryBlue font-600">Customer Details</h6>
				</Grid>
				<Grid
					item
					xs={12}
					sm={6}
					lg={3}
					className="pt-[5px!important]"
				>
					<h6 className="text-[12px] lg:text-[14px]">
						<span className="font-600">Customer ID</span> : {order?.order?.customer_details?.code}
					</h6>
				</Grid>
				<Grid
					item
					xs={12}
					sm={6}
					lg={3}
					className="pt-[5px!important]"
				>
					<h6 className="text-[12px] lg:text-[14px]">
						<span className="font-600">Customer Name</span> : {order?.order?.customer_details?.first_name}{' '}
						{order?.order?.customer_details?.last_name}
					</h6>
				</Grid>
				<Grid
					item
					xs={12}
					sm={6}
					lg={3}
					className="pt-[5px!important]"
				>
					<h6 className="text-[12px] lg:text-[14px]">
						<span className="font-600">Email</span> : {order?.order?.customer_details?.email}
					</h6>
				</Grid>
				<Grid
					item
					xs={12}
					sm={6}
					lg={3}
					className="pt-[5px!important]"
				>
					<h6 className="text-[12px] lg:text-[14px]">
						<span className="font-600">Mobile</span> : {order?.order?.customer_details?.mobile_no}
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
					className="pt-[5px!important] mb-[5px]"
				>
					<h6 className="text-[12px] lg:text-[14px] text-primaryBlue font-600">Order Details</h6>
				</Grid>
				<Grid
					item
					xs={12}
					sm={6}
					md={4}
					className="pt-[5px!important]"
				>
					<h6 className="text-[12px] lg:text-[14px] mb-[4px]">
						<span className="inline-block min-w-[110px] font-600">OP Number</span> :{' '}
						{order?.order?.order_no}
					</h6>
					<h6 className="text-[12px] lg:text-[14px] mb-[4px]">
						<span className="inline-block min-w-[110px] font-600">Order Date</span> :{' '}
						{order?.order?.order_date}
					</h6>
					<h6 className="text-[12px] lg:text-[14px] mb-[4px]">
						<span className="inline-block min-w-[110px] font-600">Recurring Order</span> :{' '}
						{order?.order?.is_auto_place_order === 1 ? 'YES' : 'NO'}
					</h6>
				</Grid>
				<Grid
					item
					xs={12}
					sm={6}
					md={4}
					className="pt-[5px!important]"
				>
					<h6 className="text-[12px] lg:text-[14px] mb-[4px]">
						<span className="block font-600">Billing Address :</span>
						{order?.order?.customer_details?.first_name} {order?.order?.customer_details?.last_name}
						<br />
						{order?.order?.billing_address?.address_line_1}
						{order?.order?.billing_address?.address_line_1 ? <br /> : null}
						{order?.order?.billing_address?.address_line_2}
						{order?.order?.billing_address?.address_line_2 ? <br /> : null}
						{order?.order?.billing_address?.address_line_3}
						{order?.order?.billing_address?.address_line_3 ? <br /> : null}
						{order?.order?.billing_address?.city} {order?.order?.billing_address?.state}
						<br />
						{order?.order?.billing_address?.zip_code}
						{order?.order?.billing_address?.zip_code ? <br /> : null}
						{order?.order?.billing_address?.country?.name}
					</h6>
				</Grid>
				<Grid
					item
					xs={12}
					sm={6}
					md={4}
					className="pt-[5px!important]"
				>
					<h6 className="text-[12px] lg:text-[14px] mb-[4px]">
						<span className="block font-600">Shipping Address :</span>
						{order?.order?.customer_details?.first_name} {order?.order?.customer_details?.last_name}
						<br />
						{order?.order?.shipping_address?.address_line_1}
						{order?.order?.shipping_address?.address_line_1 ? <br /> : null}
						{order?.order?.shipping_address?.address_line_2}
						{order?.order?.shipping_address?.address_line_2 ? <br /> : null}
						{order?.order?.shipping_address?.address_line_3}
						{order?.order?.shipping_address?.address_line_3 ? <br /> : null}
						{order?.order?.shipping_address?.city} {order?.order?.shipping_address?.state}
						<br />
						{order?.order?.shipping_address?.zip_code}
						{order?.order?.shipping_address?.zip_code ? <br /> : null}
						{order?.order?.shipping_address?.country?.name}
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

export default CancelOrderCustomerDetails;
