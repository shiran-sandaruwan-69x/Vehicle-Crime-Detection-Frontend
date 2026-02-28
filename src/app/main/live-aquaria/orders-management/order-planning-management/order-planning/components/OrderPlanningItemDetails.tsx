import { Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@mui/material/Button';
import MaterialTableWrapper from '../../../../../../common/tableComponents/MaterialTableWrapper';
import { ItemsInterface, OrderShipmentInterface, OrderShipmentItem } from '../interfaces';
import { ItemInterface } from '../../../initial-order-review/component/ItemDetails';

interface Props {
	toggleModal: () => void;
	order: OrderShipmentInterface;
}

function OrderPlanningItemDetails({ toggleModal, order }: Props) {
	const { t } = useTranslation('initialOrderReview');
	const [pageNo, setPageNo] = useState<number>(0);
	const [pageSize, setPageSize] = useState<number>(5);
	const [count] = useState(100);
	const [items, setItems] = useState<ItemsInterface[]>([]);

	useEffect(() => {
		const itemData = order?.order_shipment_items?.map((item: OrderShipmentItem) => {
			return {
				id: item?.id,
				productId: item?.item?.id,
				productCode: item?.item?.code,
				productName: item?.item?.common_name,
				quantity: item?.quantity,
				customerRemark: item?.remark,
				adminRemark: item?.admin_remark,
				availableQuantity: item?.item_selection_type?.master_data?.inventory_qty,
				wareHouse: item?.item_selection_type?.master_data?.shipping_type?.company?.name,
				unitPrice: item?.unit_price,
				totalPrice: item?.sub_total,
				size: item?.item_selection_type?.master_data?.size ? item?.item_selection_type?.master_data?.size : '',
				status: item?.item?.status
			};
		});
		setItems(itemData);
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
			field: 'productCode',
			editable: 'never'
		},
		{
			title: t('PRODUCT_NAME'),
			field: 'productName',
			editable: 'never'
		},
		{ title: t('SIZE'), field: 'size', editable: 'never' },
		{
			title: t('QUANTITY'),
			field: 'quantity',
			editable: 'always',
			validate: (rowData: ItemsInterface) => {
				if (rowData.quantity === undefined || rowData.quantity === null) {
					return 'Quantity is required';
				}

				if (rowData.quantity <= 0) {
					return 'Quantity must be greater than 0';
				}

				return true; // Validation passed
			}
		},
		{
			title: t('AVAILABLE_QTY'),
			field: 'availableQuantity',
			editable: 'never'
		},
		{
			title: t('WAREHOUSE'),
			field: 'wareHouse',
			editable: 'never'
		},
		{
			title: t('CUSTOMER_REMARK'),
			field: 'customerRemark',
			editable: 'never'
		},
		{
			title: t('ADMIN_REMARK'),
			field: 'adminRemark',
			editable: 'always',
			validate: (rowData: ItemsInterface) => {
				if (!rowData.adminRemark || rowData.adminRemark.trim() === '') {
					return 'Admin remark is required';
				}

				if (rowData.adminRemark.length < 3) {
					return 'Admin remark must be at least 3 characters long';
				}

				return true; // Validation passed
			}
		},
		{
			title: t('UNIT_PRICE'),
			field: 'unitPrice',
			editable: 'never',
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
			editable: 'never',
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
					className="pt-[5px!important]"
				>
					<h6 className="text-[12px] lg:text-[14px] text-primaryBlue font-600">Item Details</h6>
				</Grid>
				<Grid
					item
					xs={12}
					className="pt-[5px!important]"
				>
					{items.length > 0 && (
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
							records={items}
						/>
					)}
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
						{order.order?.amount
							? ` $${Number(order?.order?.amount).toLocaleString('en-US', {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2
								})}`
							: ' $0.00'}
					</h6>
					<h6 className="text-[12px] lg:text-[14px] mb-[5px]">
						<span className="inline-block min-w-[149px] lg:min-w-[95px] font-600">Box Charge</span> :
						{order.order?.box_charge
							? ` $${Number(order?.order?.box_charge).toLocaleString('en-US', {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2
								})}`
							: ' $0.00'}
					</h6>
					<h6 className="text-[12px] lg:text-[14px]">
						<span className="inline-block min-w-[149px] lg:min-w-[95px] font-600">Shipping Cost</span> :
						{order.order?.total_shipping_cost
							? ` $${Number(order?.order?.total_shipping_cost).toLocaleString('en-US', {
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
						{order.order?.tax_amount
							? ` $${Number(order?.order?.tax_amount).toLocaleString('en-US', {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2
								})}`
							: ' $0.00'}
					</h6>
					<h6 className="text-[12px] lg:text-[14px] font-800">
						<span className="inline-block min-w-[149px] lg:min-w-[78px] font-600">Gross Total</span> :
						{order.order?.gross_amount
							? ` $${Number(order?.order?.gross_amount).toLocaleString('en-US', {
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
						{order.order?.redeem_credits
							? `$${Number(order?.order?.redeem_credits).toLocaleString('en-US', {
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
						{order.order?.redeem_rewards
							? `$${Number(order?.order?.redeem_rewards).toLocaleString('en-US', {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2
								})}`
							: '$0.00'}
					</h6>
					<h6 className="text-[12px] lg:text-[14px]">
						<span className="inline-block min-w-[149px] lg:min-w-[174px] font-600">Applicable Promos</span>{' '}
						:{' '}
						{order.order?.redeem_promo
							? `$${Number(order?.order?.redeem_promo).toLocaleString('en-US', {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2
								})}`
							: '$0.00'}
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
						{order.order?.redeem_gifts
							? ` $${Number(order?.order?.redeem_gifts).toLocaleString('en-US', {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2
								})}`
							: ' $0.00'}
					</h6>
					<h6 className="text-[12px] lg:text-[14px] font-800">
						<span className="inline-block min-w-[149px] lg:min-w-[101px] font-600">Net Total</span> :
						{order?.order?.total_amount
							? ` $${Number(order?.order?.total_amount).toLocaleString('en-US', {
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

export default OrderPlanningItemDetails;
