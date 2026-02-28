import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
import { toast } from 'react-toastify';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import {
	CustomerOrderDetailsDataType,
	CustomerOrderHistoryTableDataType,
	CustomerOrderItemsOnceObj,
	CustomerOrderOnceResponseData,
	CustomerSummaryDataType,
	OrderLogTypes,
	TableRowData
} from '../customer-types/CustomerTypes';
import MaterialTableWrapper from '../../../../../common/tableComponents/MaterialTableWrapper';
import { getOrderViewHistory } from '../../../../../axios/services/live-aquaria-services/customer-services/CustomerService';

import OrdersLogTable from '../../../../../common/OrdersLogTable';

interface Props {
	toggleModal: () => void;
	isOpen: boolean;
	clickedRowData: TableRowData;
	isOrderId: string;
}
interface ErrorResponse {
	response?: {
		data?: {
			message?: string;
		};
	};
}

function OrderHistoryViewModal({ toggleModal, isOpen, clickedRowData, isOrderId }: Props) {
	const { t } = useTranslation('customerProfile');
	const [pageNo, setPageNo] = useState<number>(0);
	const [pageSize, setPageSize] = useState<number>(5);
	const [, setClickedRowData] = useState(null);
	const [count] = useState(100);
	const [orderDetails, setOrderDetailsData] = useState<CustomerOrderDetailsDataType>(null);
	const [isTableData, setTableData] = useState<CustomerOrderHistoryTableDataType[]>([]);
	const [summaryData, setSummaryData] = useState<CustomerSummaryDataType>(null);
	const [orderLogs, setOrderLogs] = useState<OrderLogTypes[]>([]);
	const handlePageChange = (page: number) => {
		setPageNo(page);
	};

	const handlePageSizeChange = (pageSize: number) => {
		setPageSize(pageSize);
	};

	useEffect(() => {
		viewOrderHistory();
	}, [isOrderId]);

	const viewOrderHistory = async () => {
		try {
			const userId = clickedRowData?.id ?? null;
			const orderId = isOrderId ?? null;
			const response: CustomerOrderOnceResponseData = await getOrderViewHistory(userId, orderId);
			const customerName: string = `${response?.data?.order_details?.customer_details?.first_name ?? ''} ${response?.data?.order_details?.customer_details?.last_name ?? ''}`;
			const billingAddress: string = `${response?.data?.order_details?.billing_address?.address_line_1 ?? ''} ${response?.data?.order_details?.billing_address?.address_line_2 ?? ''} ${response?.data?.order_details?.billing_address?.address_line_3 ?? ''}`;
			const shippingAddress: string = `${response?.data?.order_details?.shipping_address?.address_line_1 ?? ''} ${response?.data?.order_details?.shipping_address?.address_line_2 ?? ''} ${response?.data?.order_details?.shipping_address?.address_line_3 ?? ''}`;
			const orderDetailsData: CustomerOrderDetailsDataType = {
				orderId: response?.data?.order_details?.order_no ?? '',
				orderDate: response?.data?.order_details?.order_date ?? '',
				deliveryDate: response?.data?.estimated_delivery_date ?? '',
				recurringOrder: response?.data?.order_details?.is_auto_place_order === 1 ? 'YES' : 'NO',
				storePickup: response?.data?.pickup_option?.option ?? '',
				duration: '',
				fedexTrackingNumber: '',
				billingAddress: {
					name: customerName ?? '',
					addressLine1: billingAddress ?? '',
					city: response?.data?.order_details?.billing_address?.city ?? '',
					state: response?.data?.order_details?.billing_address?.state ?? '',
					postalCode: response?.data?.order_details?.billing_address?.zip_code ?? '',
					country: response?.data?.order_details?.billing_address?.country?.name ?? ''
				},
				shippingAddress: {
					name: customerName ?? '',
					addressLine1: shippingAddress ?? '',
					city: response?.data?.order_details?.shipping_address?.city ?? '',
					state: response?.data?.order_details?.shipping_address?.state ?? '',
					postalCode: response?.data?.order_details?.shipping_address?.zip_code ?? '',
					country: response?.data?.order_details?.shipping_address?.country?.name ?? ''
				}
			};
			const tableData: CustomerOrderHistoryTableDataType[] = response?.data?.order_items?.map(
				(order_items: CustomerOrderItemsOnceObj) => ({
					productId: order_items?.item?.code,
					productName: order_items?.item?.common_name,
					size: '',
					quantity: order_items?.quantity,
					cisCode: order_items?.item_selection_type?.master_data?.cis_code,
					wareHouse: '',
					status: order_items?.item?.status,
					customerRemark: order_items?.remark,
					unitPrice: order_items?.unit_price,
					totalPrice: order_items?.sub_total
				})
			);

			const summaryData: CustomerSummaryDataType = {
				cartTotal: response?.data?.order_details?.amount ?? '0.00',
				boxCharge: response?.data?.order_details?.box_charge ?? '0.00',
				shippingCost: response?.data?.order_details?.total_shipping_cost ?? '0.00',
				taxTotal: response?.data?.order_details?.tax_amount ?? '0.00',
				grossTotal: response?.data?.order_details?.net_amount ?? '0.00',
				creditPointsApplied: response?.data?.order_details?.redeem_credits ?? '0.00',
				applicableRewardPoints: response?.data?.order_details?.redeem_rewards ?? '0.00',
				applicablePromos: response?.data?.order_details?.redeem_promo ?? '0.00',
				giftCertificate: response?.data?.order_details?.redeem_gifts ?? '0.00',
				netTotal: response?.data?.order_details?.total_amount ?? '0.00'
			};
			setOrderDetailsData(orderDetailsData);
			setTableData(tableData);
			setSummaryData(summaryData);
			setOrderLogs(response?.data?.order_logs);
		} catch (error) {
			const isErrorResponse = (error: unknown): error is ErrorResponse => {
				return typeof error === 'object' && error !== null && 'response' in error;
			};

			if (isErrorResponse(error) && error.response?.data?.message) {
				toast.error(error.response.data.message);
			} else {
				toast.error('Internal server error');
			}
		}
	};

	const tableColumns = [
		{
			title: t('CIS Code'),
			field: 'cisCode'
		},
		{
			title: t('Product ID'),
			field: 'productId'
		},
		{
			title: t('Product Name'),
			field: 'productName'
		},
		{ title: t('Size'), field: 'size' },
		{
			title: t('Quantity'),
			field: 'quantity'
		},
		{
			title: t('Warehouse / Location'),
			field: 'wareHouse'
		},
		{
			title: t('Customer Remark'),
			field: 'customerRemark'
		},
		{
			title: t('Unit Price'),
			field: 'unitPrice'
		},
		{
			title: t('Total Price'),
			field: 'totalPrice'
		}
	];

	return (
		<Dialog
			fullWidth
			open={isOpen}
			maxWidth="lg"
			onClose={toggleModal}
		>
			<DialogTitle className="pb-0">
				<h6 className="text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-400">
					{t('Order Details')}
				</h6>
			</DialogTitle>
			<DialogContent>
				{/* Order Details */}
				<Grid
					container
					spacing={2}
					className="mt-[1px]"
				>
					<Grid
						item
						xs={12}
						sm={12}
						md={6}
						className="pt-[5px!important]"
					>
						<h6 className="flex flex-wrap sm:!flex-nowrap items-center text-[12px] lg:text-[14px] mb-[4px]">
							<span className="inline-block w-full sm:w-auto min-w-[158px] font-600">Order ID</span> :{' '}
							{orderDetails?.orderId}
						</h6>
						<h6 className="flex flex-wrap sm:!flex-nowrap items-center text-[12px] lg:text-[14px] mb-[4px]">
							<span className="inline-block w-full sm:w-auto min-w-[158px] font-600">Order Date</span> :{' '}
							{orderDetails?.orderDate}
						</h6>
						<h6 className="flex flex-wrap sm:!flex-nowrap items-center text-[12px] lg:text-[14px] mb-[4px]">
							<span className="inline-block w-full sm:w-auto min-w-[158px] font-600">Delivery Date</span>{' '}
							: {orderDetails?.deliveryDate}
						</h6>
						<h6 className="flex flex-wrap sm:!flex-nowrap items-center text-[12px] lg:text-[14px] mb-[4px]">
							<span className="inline-block w-full sm:w-auto min-w-[158px] font-600">Store Pickup</span> :{' '}
							{orderDetails?.storePickup}
						</h6>
						<h6 className="flex flex-wrap sm:!flex-nowrap items-center text-[12px] lg:text-[14px] mb-[4px]">
							<span className="inline-block w-full sm:w-auto min-w-[158px] font-600">
								Recurring Order
							</span>{' '}
							: {orderDetails?.recurringOrder} {orderDetails?.duration ? '/' : ''}{' '}
							{orderDetails?.duration}
						</h6>
						<h6 className="flex flex-wrap sm:!flex-nowrap items-center text-[12px] lg:text-[14px] mb-[4px]">
							<span className="inline-block w-full sm:w-auto min-w-[158px] font-600">
								Fedex Tracking Number
							</span>{' '}
							: {orderDetails?.fedexTrackingNumber}
						</h6>
					</Grid>
					<Grid
						item
						xs={12}
						sm={6}
						md={3}
						className="pt-[5px!important]"
					>
						<h6 className="text-[12px] lg:text-[14px] mb-[4px]">
							<span className="block font-600">Billing Address :</span>
							{orderDetails?.billingAddress?.name}
							<br />
							{orderDetails?.billingAddress?.addressLine1}
							<br />
							{orderDetails?.billingAddress?.city} {orderDetails?.billingAddress?.state ? ',' : ''}{' '}
							{orderDetails?.billingAddress?.state}
							<br />
							{orderDetails?.billingAddress?.postalCode}
							<br />
							{orderDetails?.billingAddress?.country}
						</h6>
					</Grid>
					<Grid
						item
						xs={12}
						sm={6}
						md={3}
						className="pt-[5px!important]"
					>
						<h6 className="text-[12px] lg:text-[14px] mb-[4px]">
							<span className="block font-600">Shipping Address :</span>
							{orderDetails?.shippingAddress?.name}
							<br />
							{orderDetails?.shippingAddress?.addressLine1}
							<br />
							{orderDetails?.shippingAddress?.city} {orderDetails?.shippingAddress?.state ? ',' : ''}{' '}
							{orderDetails?.shippingAddress?.state}
							<br />
							{orderDetails?.shippingAddress?.postalCode}
							<br />
							{orderDetails?.shippingAddress?.country}
						</h6>
					</Grid>
				</Grid>

				{/* Order Details */}

				<Grid
					container
					spacing={2}
					className="mt-[10px]"
				>
					<Grid
						item
						xs={12}
						className="max-h-[200px] pt-[5px!important] overflow-y-auto"
					>
						<MaterialTableWrapper
							title=""
							filterChanged={null}
							handleColumnFilter={null}
							tableColumns={tableColumns}
							handlePageChange={handlePageChange}
							handlePageSizeChange={handlePageSizeChange}
							handleCommonSearchBar={null}
							pageSize={pageSize}
							disableColumnFiltering
							pageIndex={pageNo}
							setPageSize={setPageSize}
							searchByText=""
							disablePagination
							count={count}
							exportToExcel={null}
							handleRowDeleteAction={null}
							externalAdd={null}
							externalEdit={null}
							externalView={null}
							selection={false}
							disableSearch
							isColumnChoser
							records={isTableData}
						/>
					</Grid>
					<Grid
						item
						xs={12}
						className="pt-[15px!important]"
					>
						<hr />
					</Grid>
				</Grid>

				<Grid
					container
					spacing={2}
					className="mt-[10px]"
				>
					<Grid
						item
						xs={12}
						sm={6}
						lg={3}
						className="pt-[5px!important]"
					>
						<h6 className="text-[12px] lg:text-[14px] mb-[5px]">
							<span className="inline-block min-w-[149px] lg:min-w-[95px] font-600">Cart Total</span> : $
							{summaryData?.cartTotal}
						</h6>
						<h6 className="text-[12px] lg:text-[14px] mb-[5px]">
							<span className="inline-block min-w-[149px] lg:min-w-[95px] font-600">Box Charge</span> : $
							{summaryData?.boxCharge}
						</h6>
						<h6 className="text-[12px] lg:text-[14px]">
							<span className="inline-block min-w-[149px] lg:min-w-[95px] font-600">Shipping Cost</span> :
							${summaryData?.shippingCost}
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
							<span className="inline-block min-w-[149px] lg:min-w-[78px] font-600">Tax Total</span> : $
							{summaryData?.taxTotal}
						</h6>
						<h6 className="w-full text-[12px] lg:text-[14px] font-800">
							<span className="inline-block min-w-[149px] lg:min-w-[78px] font-600">Gross Total</span> : $
							{summaryData?.grossTotal}
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
							: ${summaryData?.creditPointsApplied}
						</h6>
						<h6 className="text-[12px] lg:text-[14px] mb-[5px]">
							<span className="inline-block min-w-[149px] lg:min-w-[174px] font-600">
								{' '}
								Applicable Reward Points
							</span>{' '}
							: ${summaryData?.applicableRewardPoints}
						</h6>
						<h6 className="text-[12px] lg:text-[14px]">
							<span className="inline-block min-w-[149px] lg:min-w-[174px] font-600">
								Applicable Promos
							</span>{' '}
							: ${summaryData?.applicablePromos}
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
							: ${summaryData?.giftCertificate}
						</h6>
						<h6 className="w-full text-[12px] lg:text-[14px] font-800">
							<span className="inline-block min-w-[149px] lg:min-w-[101px] font-600">Net Total</span> : $
							{summaryData?.netTotal}
						</h6>
					</Grid>
				</Grid>

				<Grid
					container
					spacing={2}
					className="mt-[10px]"
				>
					<Grid
						item
						xs={12}
						className="pt-[10px!important] !mt-[20px]"
					>
						<Typography className="text-[10px] sm:text-[12px] text-gray-800 mb-[5px]">
							<strong>Order History Log</strong>
						</Typography>
						<OrdersLogTable tableData={orderLogs} />
					</Grid>
				</Grid>
			</DialogContent>
			<DialogActions>
				<Button
					className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80 boxShadow"
					onClick={toggleModal}
				>
					Cancel
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default OrderHistoryViewModal;
