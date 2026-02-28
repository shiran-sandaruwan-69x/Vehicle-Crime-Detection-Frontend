import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import FuseLoading from '@fuse/core/FuseLoading/FuseLoading';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { HOTLINE_ORDERS } from 'src/app/axios/services/AdminServices';
import MaterialTableWrapper from '../../../../../common/tableComponents/MaterialTableWrapper';

interface OrderStatusModalProps {
	toggleModal: () => void;
	isOpen: boolean;
	id: number;
}

const sampleData = {
	customerDetails: {
		code: 'C123456',
		first_name: 'Robert',
		last_name: 'Brown',
		email: 'robert.brown@example.com',
		mobile_no: '+1-555-555-5555'
	},
	orderDetails: {
		order_no: 'ORD987654',
		order_date: '2024-09-30',
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

const tableColumns = [
	{ title: 'Product ID', field: 'productID' },
	{
		title: 'Product Name',
		field: 'productName'
	},
	{
		title: 'Size',
		field: 'size'
	},
	{ title: 'Quantity', field: 'quantity' },
	{ title: 'Available Quantity', field: 'availableQuantity' },
	{ title: 'Warehouse', field: 'warehouse' },
	{ title: 'Remark', field: 'remark' },
	{
		title: 'Unit Price',
		field: 'unitPrice',
		align: 'right',
		render: (rowData: any) => (
			<span className="text-right">
				{`$ ${new Intl.NumberFormat('en-US', {
					minimumFractionDigits: 2,
					maximumFractionDigits: 2
				})
					.format(Number(rowData.unitPrice))
					.replace(/,/g, ' ')}`}
			</span>
		)
	},
	{
		title: 'Total Price',
		field: 'totalPrice',
		align: 'right',
		render: (rowData: any) => (
			<span className="text-right">
				{`$ ${new Intl.NumberFormat('en-US', {
					minimumFractionDigits: 2,
					maximumFractionDigits: 2
				})
					.format(Number(rowData.totalPrice))
					.replace(/,/g, ' ')}`}
			</span>
		)
	}
];

const orderHistoryTableColumns = [
	{ title: 'Date / Time', field: 'dateTime' },
	{ title: 'Action Taken', field: 'actionTaken' },
	{ title: 'Taken By', field: 'takenBy' }
];

const tableData = [
	{
		productID: 'P0001',
		productName: 'Test Product',
		size: 'Medium',
		quantity: '100',
		availableQuantity: '88',
		warehouse: 'Test Warehouse',
		remark: 'Test Remark',
		unitPrice: '$ 120',
		totalPrice: '$ 1200',
		action: ''
	},
	{
		productID: 'P0001',
		productName: 'Test Product',
		size: 'Medium',
		quantity: '100',
		availableQuantity: '88',
		warehouse: 'Test Warehouse',
		remark: 'Test Remark',
		unitPrice: '$ 120',
		totalPrice: '$ 1200',
		action: ''
	},
	{
		productID: 'P0001',
		productName: 'Test Product',
		size: 'Medium',
		quantity: '100',
		availableQuantity: '88',
		warehouse: 'Test Warehouse',
		remark: 'Test Remark',
		unitPrice: '$ 120',
		totalPrice: '$ 1200',
		action: ''
	},
	{
		productID: 'P0001',
		productName: 'Test Product',
		size: 'Medium',
		quantity: '100',
		availableQuantity: '88',
		warehouse: 'Test Warehouse',
		remark: 'Test Remark',
		unitPrice: '$ 120',
		totalPrice: '$ 1200',
		action: ''
	}
];

const orderHistoryTableData = [
	{ dateTime: '05/02/2025', actionTaken: 'Approved', takenBy: 'Admin' },
	{ dateTime: '05/02/2025', actionTaken: 'Approved', takenBy: 'Admin' },
	{ dateTime: '05/02/2025', actionTaken: 'Approved', takenBy: 'Admin' },
	{ dateTime: '05/02/2025', actionTaken: 'Approved', takenBy: 'Admin' }
];

function OrderStatusModal({ toggleModal, isOpen, id }: OrderStatusModalProps) {
	const { t } = useTranslation('hotlineOrders');
	const { customerDetails, orderDetails } = sampleData;
	const [loading, setLoading] = useState<boolean>(true);
	const [order, setOrder] = useState<any>(null);
	const [orderShipmentItems, setOrderShipmentItems] = useState<any>([]);

	useEffect(() => {
		fetchHotLineOrderById();
	}, [id]);

	useEffect(() => {
		if (order) {
			const items = order?.order_shipments.map((item: any) => ({
				...item,
				productID: item.product_id,
				productName: item.product_name,
				size: item.size,
				quantity: item.quantity,
				availableQuantity: item.available_quantity,
				warehouse: item.warehouse,
				remark: item.remark,
				unitPrice: item.unit_price,
				totalPrice: item.total_price
			}));
			// productId: item.product_id;
			// productName: item.product_name;
			// size: item.size;
			// quantity: item.quantity;
			// availableQuantity: item.available_quantity;
			// warehouse: item.warehouse;
			// remark: item.remark;
			// unitPrice: item.unit_price;
			// totalPrice: item.total_price;
			// })

			setOrderShipmentItems(items);
		}
	}, [order]);

	const fetchHotLineOrderById = async () => {
		setLoading(true);
		try {
			const response = await axios.get(`${HOTLINE_ORDERS}/${id}`);

			setOrder(response.data.data);
		} catch (error) {
			// error
		} finally {
			setLoading(false);
		}
	};

	return loading ? (
		<FuseLoading />
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
				<h6 className="text-[12px] sm:text-[12px] lg:text-[14px] text-gray-700 font-500 mb-8">
					Hotline Order Status
				</h6>
			</DialogTitle>
			<DialogContent className="!p-0">
				<Grid
					container
					spacing={2}
				>
					<Grid
						item
						md={12}
						sm={12}
						xs={12}
						className="!pt-[30px] !pl-[35px] !pr-[15px] !pb-[10px]"
					>
						{/* Customer Details */}
						<Grid
							container
							spacing={2}
						>
							<Grid
								item
								xs={12}
								className="pt-[5px!important] !mt-0 mb-[5px]"
							>
								<h6 className="text-[12px] lg:text-[14px] text-primaryBlue font-600">
									Customer Details
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
									<span className="font-600">Customer ID</span> : {order?.customer_details?.code}
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
									<span className="font-600">Customer Name</span> :{' '}
									{`${order?.customer_details?.first_name} ${order?.customer_details?.last_name}`}
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
									<span className="font-600">Email</span> : {order?.customer_details?.email}
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
									<span className="font-600">Mobile</span> : {order?.customer_details?.mobile_no}
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
									<span className="inline-block min-w-[110px] font-600">Order ID</span> :{' '}
									{order?.order_no}
								</h6>
								<h6 className="text-[12px] lg:text-[14px] mb-[4px]">
									<span className="inline-block min-w-[110px] font-600">Order Date</span> :{' '}
									{order?.order_date}
								</h6>
								<h6 className="text-[12px] lg:text-[14px] mb-[4px]">
									<span className="inline-block min-w-[110px] font-600">Delivery Date</span> : still
									not
								</h6>
								<h6 className="text-[12px] lg:text-[14px] mb-[4px]">
									<span className="inline-block min-w-[110px] font-600">Pickup Option</span> :{' '}
									{/* {orderDetails.storePickup} */} still not
								</h6>
								<h6 className="text-[12px] lg:text-[14px] mb-[4px]">
									<span className="inline-block min-w-[110px] font-600">Recurring Order</span> :{' '}
									{/* {orderDetails.recurringOrder} / {orderDetails.duration} */}
									still not
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
									{`${order?.customer_details?.first_name} ${order?.customer_details?.last_name}`}
									<br />
									{order?.billing_details?.address_line_1}
									<br />
									{order?.billing_details?.address_line_2}, {order?.billing_details?.city}
									<br />
									{order?.billing_details?.zip_code}
									<br />
									{order?.billing_details?.country.name}
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
									{`${order?.customer_details.first_name} ${order?.customer_details?.last_name}`}
									<br />
									{order?.shipping_details?.address_line_1}
									<br />
									{order?.shipping_details?.address_line_2}, {order?.shipping_details?.city}
									<br />
									{order?.shipping_details?.zip_code}
									<br />
									{order?.shipping_details?.country.name}
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
						{/* Order Details */}

						{/* Item Details */}
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
								<h6 className="text-[12px] lg:text-[14px] text-primaryBlue font-600">Item Details</h6>
							</Grid>
							<Grid
								item
								xs={12}
								className="max-h-[320px] pt-[5px!important] overflow-y-auto"
							>
								{order?.order_shipments?.map((shipments: any, index: number) => {
									const items = shipments?.cart_items?.map((cart_item: any) => ({
										productID: cart_item?.item_selection_type?.master_data?.cis_code,
										productName: cart_item?.item?.common_name,
										size: cart_item?.item_selection_type?.master_data?.size,
										quantity: cart_item?.quantity,
										availableQuantity: cart_item?.item_selection_type?.master_data?.inventory_qty,
										warehouse: 'dummy',
										remark: cart_item?.remark,
										unitPrice: cart_item?.unit_price,
										totalPrice: cart_item?.sub_total
									}));
									return (
										<>
											<p>Shipment {index + 1} -dummy</p>

											<MaterialTableWrapper
												title=""
												filterChanged={null}
												handleColumnFilter={null}
												tableColumns={tableColumns}
												handleCommonSearchBar={null}
												disableColumnFiltering
												searchByText=""
												exportToExcel={null}
												handleRowDeleteAction={null}
												externalAdd={null}
												externalEdit={null}
												externalView={null}
												selection={false}
												selectionExport={null}
												disablePagination
												disableSearch
												isColumnChoser
												records={items}
											/>
											<br />
										</>
									);
								})}
								{/* <MaterialTableWrapper
                  title=""
                  filterChanged={null}
                  handleColumnFilter={null}
                  tableColumns={tableColumns}
                  handleCommonSearchBar={null}
                  disableColumnFiltering
                  searchByText=""
                  exportToExcel={null}
                  handleRowDeleteAction={null}
                  externalAdd={null}
                  externalEdit={null}
                  externalView={null}
                  selection={false}
                  selectionExport={null}
                  disablePagination
                  disableSearch
                  isColumnChoser
                  records={orderShipmentItems}
                /> */}
							</Grid>
							<Grid
								item
								xs={12}
								className="pt-[15px!important]"
							>
								<hr />
							</Grid>
						</Grid>
						{/* Item Details */}

						<div className="w-full p-[10px] mt-[15px] rounded-[6px] border border-[#eeeeee] shadow-sm">
							<Grid
								container
								spacing={2}
								className="!pt-[15px]"
							>
								<Grid
									item
									xs={12}
									sm={6}
									lg={3}
									className="pt-[5px!important]"
								>
									<h6 className="text-[12px] lg:text-[14px] mb-[5px]">
										<span className="inline-block min-w-[149px] lg:min-w-[95px] font-600">
											Cart Total
										</span>{' '}
										: $ {order?.total_amount}
									</h6>
									<h6 className="text-[12px] lg:text-[14px] mb-[5px]">
										<span className="inline-block min-w-[149px] lg:min-w-[95px] font-600">
											Box Charge
										</span>{' '}
										: $ {order?.box_charge}
									</h6>
									<h6 className="text-[12px] lg:text-[14px]">
										<span className="inline-block min-w-[149px] lg:min-w-[95px] font-600">
											Shipping Cost
										</span>{' '}
										: $ {order?.total_shipping_cost}
									</h6>
								</Grid>

								<Grid
									item
									xs={12}
									sm={6}
									lg={3}
									className="flex flex-wrap place-content-end items-end pt-[5px!important]"
								>
									<h6 className="w-full text-[12px] lg:text-[14px] mb-[5px]">
										<span className="inline-block min-w-[149px] lg:min-w-[78px] font-600">
											Tax Total
										</span>{' '}
										: $ {order?.tax_amount}
									</h6>
									<h6 className="w-full text-[12px] lg:text-[14px] font-800">
										<span className="inline-block min-w-[149px] lg:min-w-[78px] font-600">
											Gross Total
										</span>{' '}
										: $ {order?.gross_total}
									</h6>
								</Grid>

								<Grid
									item
									xs={12}
									sm={6}
									lg={3}
									className="pt-[5px!important]"
								>
									<h6 className="text-[12px] lg:text-[14px] mb-[5px]">
										<span className="inline-block min-w-[149px] lg:min-w-[174px] font-600">
											Credit Points Applied
										</span>{' '}
										: $ {order?.redeem_credits}
									</h6>
									<h6 className="text-[12px] lg:text-[14px] mb-[5px]">
										<span className="inline-block min-w-[149px] lg:min-w-[174px] font-600">
											{' '}
											Applicable Reward Points
										</span>{' '}
										: $ {order?.redeem_rewards}
									</h6>
									<h6 className="text-[12px] lg:text-[14px]">
										<span className="inline-block min-w-[149px] lg:min-w-[174px] font-600">
											Applicable Promos
										</span>{' '}
										: $ {order?.redeem_promo}
									</h6>
								</Grid>

								<Grid
									item
									xs={12}
									sm={6}
									lg={3}
									className="flex flex-wrap place-content-end items-end pt-[5px!important]"
								>
									<h6 className="w-full text-[12px] lg:text-[14px] mb-[5px]">
										<span className="inline-block min-w-[149px] lg:min-w-[101px] font-600">
											Gift Certificate
										</span>{' '}
										: $ {order?.redeem_gifts}
									</h6>
									<h6 className="w-full text-[12px] lg:text-[14px] font-800">
										<span className="inline-block min-w-[149px] lg:min-w-[101px] font-600">
											Net Total
										</span>{' '}
										: $ {order?.total_amount}
									</h6>
								</Grid>
							</Grid>
						</div>

						{/* {order?.logs && order?.logs.length > 0 && (
              <>
                <Grid container spacing={2} className="mt-[10px]">
                  <Grid item xs={12} className="pt-[5px!important] mb-[5px]">
                    <h6 className="text-[12px] lg:text-[14px] text-primaryBlue font-600">
                      Order History Log
                    </h6>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    className="max-h-[320px] pt-[5px!important] overflow-y-auto"
                  >
                    {<OrdersLogTable tableData={order.logs} />}
                  </Grid>
                </Grid>
              </>
            )} */}

						<Grid
							container
							spacing={2}
							className="!pt-[15px]"
						>
							<Grid
								item
								md={12}
								sm={12}
								xs={12}
								className="flex justify-end items-center gap-[10px] pt-[15px!important]"
							>
								<Button
									onClick={toggleModal}
									className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
								>
									Close
								</Button>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</DialogContent>
		</Dialog>
	);
}

export default OrderStatusModal;
