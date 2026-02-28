import React, { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import Button from '@mui/material/Button';
import { useTranslation } from 'react-i18next';
import MaterialTableWrapper from '../../../../../common/tableComponents/MaterialTableWrapper';
import { OrderFullfilmentByIdResponse, OrderShipmentItem } from '../interfaces';
import {
	CustomerOrderHistoryTableDataType,
	CustomerSummaryDataType
} from '../../../customer/customer-profile/customer-types/CustomerTypes';
import { ItemInterface } from '../../initial-order-review/component/ItemDetails';

interface Props {
	toggleModal: () => void;
	order: OrderFullfilmentByIdResponse;
}

function OrderFulfilmentItemDetails({ toggleModal, order }: Props) {
	const { t } = useTranslation('initialOrderReview');
	const [pageNo, setPageNo] = useState<number>(0);
	const [pageSize, setPageSize] = useState<number>(5);
	const [count] = useState(100);
	const [isTableData, setTableData] = useState<CustomerOrderHistoryTableDataType[]>([]);
	const [summaryData, setSummaryData] = useState<CustomerSummaryDataType>(null);

	useEffect(() => {
		const tableData: CustomerOrderHistoryTableDataType[] = order?.order_shipment_items?.map(
			(order_items: OrderShipmentItem) => ({
				productId: order_items?.item?.code,
				productName: order_items?.item?.common_name,
				size: order_items?.item_selection_type?.master_data?.size,
				quantity: order_items?.quantity,
				availableQuantity: order_items?.item_selection_type?.master_data?.inventory_qty,
				wareHouse: order_items?.item_selection_type?.master_data?.shipping_type?.company?.name,
				status: order_items?.item?.status,
				customerRemark: order_items?.remark,
				adminRemark: order_items?.admin_remark,
				unitPrice: order_items?.unit_price,
				totalPrice: order_items?.sub_total
			})
		);
		setTableData(tableData);
		const summaryApiData: CustomerSummaryDataType = {
			cartTotal: order?.order?.amount ?? '0.00',
			boxCharge: order?.order?.box_charge ?? '0.00',
			shippingCost: order?.order?.total_shipping_cost ?? '0.00',
			taxTotal: order?.order?.tax_amount ?? '0.00',
			grossTotal: order?.order?.gross_amount ?? '0.00',
			creditPointsApplied: order?.order?.redeem_credits ?? '0.00',
			applicableRewardPoints: order?.order?.redeem_rewards ?? '0.00',
			applicablePromos: order?.order?.redeem_promo ?? '0.00',
			giftCertificate: order?.order?.redeem_gifts ?? '0.00',
			netTotal: order?.order?.total_amount ?? '0.00'
		};
		setSummaryData(summaryApiData);
	}, [order]);

	const handlePageChange = (page: number) => {
		setPageNo(page);
	};

	const handlePageSizeChange = (pageSize: number) => {
		setPageSize(pageSize);
	};

	const tableColumns = [
		{
			title: t('PRODUCT_ID'),
			field: 'productId'
		},
		{
			title: t('PRODUCT_NAME'),
			field: 'productName'
		},
		{ title: t('SIZE'), field: 'size' },
		{
			title: t('QUANTITY'),
			field: 'quantity'
		},
		{
			title: t('AVAILABLE_QTY'),
			field: 'availableQuantity'
		},
		{
			title: t('WAREHOUSE'),
			field: 'wareHouse'
		},
		{
			title: t('CUSTOMER_REMARK'),
			field: 'customerRemark'
		},
		{
			title: t('ADMIN_REMARK'),
			field: 'adminRemark'
		},
		{
			title: t('UNIT_PRICE'),
			field: 'unitPrice',
			render: (rowData: ItemInterface) =>
				rowData.unitPrice
					? `$${Number(rowData.unitPrice).toLocaleString('en-US', {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2
						})}`
					: ''
		},
		{
			title: t('TOTAL_PRICE'),
			field: 'totalPrice',
			render: (rowData: ItemInterface) =>
				rowData.totalPrice
					? `$${Number(rowData.totalPrice).toLocaleString('en-US', {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2
						})}`
					: ''
		}
	];

	return (
		<div className="min-w-full max-w-[100vw]">
			<Grid
				container
				spacing={2}
			>
				<Grid
					item
					xs={12}
					className="pt-[10px!important]"
				>
					<h6 className="text-[12px] lg:text-[14px] text-primaryBlue font-600">Item Details</h6>
				</Grid>
				<Grid
					item
					xs={12}
					className="pt-[5px!important]"
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
						<span className="inline-block min-w-[149px] lg:min-w-[95px] font-600">Cart Total</span> :
						{summaryData?.cartTotal
							? ` $${Number(summaryData?.cartTotal).toLocaleString('en-US', {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2
								})}`
							: ' $0.00'}
					</h6>
					<h6 className="text-[12px] lg:text-[14px] mb-[5px]">
						<span className="inline-block min-w-[149px] lg:min-w-[95px] font-600">Box Charge</span> :
						{summaryData?.boxCharge
							? ` $${Number(summaryData?.boxCharge).toLocaleString('en-US', {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2
								})}`
							: ' $0.00'}
					</h6>
					<h6 className="text-[12px] lg:text-[14px]">
						<span className="inline-block min-w-[149px] lg:min-w-[95px] font-600">Shipping Cost</span> :
						{summaryData?.shippingCost
							? ` $${Number(summaryData?.shippingCost).toLocaleString('en-US', {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2
								})}`
							: ' $0.00'}
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
						<span className="inline-block min-w-[149px] lg:min-w-[78px] font-600">Tax Total</span> :
						{summaryData?.taxTotal
							? ` $${Number(summaryData?.taxTotal).toLocaleString('en-US', {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2
								})}`
							: ' $0.00'}
					</h6>
					<h6 className="text-[12px] lg:text-[14px] font-800">
						<span className="inline-block min-w-[149px] lg:min-w-[78px] font-600">Gross Total</span> :
						{summaryData?.grossTotal
							? ` $${Number(summaryData?.grossTotal).toLocaleString('en-US', {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2
								})}`
							: ' $0.00'}
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
						:{' '}
						{summaryData?.creditPointsApplied
							? ` $${Number(summaryData?.creditPointsApplied).toLocaleString('en-US', {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2
								})}`
							: '$0.00'}
					</h6>
					<h6 className="text-[12px] lg:text-[14px] mb-[5px]">
						<span className="inline-block min-w-[149px] lg:min-w-[174px] font-600">
							{' '}
							Applicable Reward Points
						</span>{' '}
						:{' '}
						{summaryData?.applicableRewardPoints
							? ` $${Number(summaryData?.applicableRewardPoints).toLocaleString('en-US', {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2
								})}`
							: '$0.00'}
					</h6>
					<h6 className="text-[12px] lg:text-[14px]">
						<span className="inline-block min-w-[149px] lg:min-w-[174px] font-600">Applicable Promos</span>{' '}
						:{' '}
						{summaryData?.applicablePromos
							? ` $${Number(summaryData?.applicablePromos).toLocaleString('en-US', {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2
								})}`
							: ' $0.00'}
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
						<span className="inline-block min-w-[149px] lg:min-w-[101px] font-600">Gift Certificate</span> :
						{summaryData?.giftCertificate
							? ` $${Number(summaryData?.giftCertificate).toLocaleString('en-US', {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2
								})}`
							: ' $0.00'}
					</h6>
					<h6 className="text-[12px] lg:text-[14px] font-800">
						<span className="inline-block min-w-[149px] lg:min-w-[101px] font-600">Net Total</span> :
						{summaryData?.netTotal
							? ` $${Number(summaryData?.netTotal).toLocaleString('en-US', {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2
								})}`
							: ' $0.00'}
					</h6>
				</Grid>
			</Grid>

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

export default OrderFulfilmentItemDetails;
