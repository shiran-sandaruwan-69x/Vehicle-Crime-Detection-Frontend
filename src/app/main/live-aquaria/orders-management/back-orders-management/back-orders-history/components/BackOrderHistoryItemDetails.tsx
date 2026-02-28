import { Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@mui/material/Button';
import MaterialTableWrapper from '../../../../../../common/tableComponents/MaterialTableWrapper';
import { OrderData, OrderShipmentItem } from '../BackOrdersHistoryModel';

interface Props {
	toggleModal: () => void;
	order: OrderData;
}

interface ItemInterface {
	id: number;
	productId: string;
	productCode: string;
	productName: string;
	quantity: number;
	customerRemark: string;
	adminRemark: string;
	unitPrice: string;
	totalPrice: string;
	size: string;
}

function BackOrderHistoryItemDetails({ toggleModal, order }: Props) {
	const { t } = useTranslation('initialOrderReview');
	const [pageNo, setPageNo] = useState<number>(0);
	const [pageSize, setPageSize] = useState<number>(5);
	const [count] = useState(100);
	const [items, setItems] = useState<ItemInterface[]>([]);

	useEffect(() => {
		if (order && order?.order_shipment_items && order?.order_shipment_items.length > 0) {
			const itemData =
				order?.order_shipment_items &&
				order?.order_shipment_items.length > 0 &&
				order?.order_shipment_items.map((item: OrderShipmentItem) => {
					return {
						id: item?.id,
						productId: item?.item?.id,
						productCode: item?.item?.code,
						productName: item?.item?.common_name,
						quantity: item?.quantity,
						customerRemark: item?.remark,
						adminRemark: item?.admin_remark,
						unitPrice: item?.unit_price,
						totalPrice: item?.sub_total,
						size: 'dummy'
						// size: item?.item_selection_type?.master_data?.size
						// 	? item?.item_selection_type?.master_data?.size
						// 	: ''
					};
				});
			setItems(itemData);
		}
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
			validate: (rowData: ItemInterface) => {
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
		{ title: t('STATUS'), field: 'status', editable: 'never' },
		{
			title: t('CUSTOMER_REMARK'),
			field: 'customerRemark',
			editable: 'never'
		},
		{
			title: t('ADMIN_REMARK'),
			field: 'adminRemark',
			editable: 'always',
			validate: (rowData: ItemInterface) => {
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
			align: 'right',
			render: (rowData: ItemInterface) => (
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
			title: t('TOTAL_PRICE'),
			field: 'totalPrice',
			editable: 'never',
			align: 'right',
			render: (rowData: ItemInterface) => (
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
						<span className="inline-block min-w-[149px] lg:min-w-[95px] font-600">Cart Total</span> : $
						{order?.order?.amount}
					</h6>
					<h6 className="text-[12px] lg:text-[14px] mb-[5px]">
						<span className="inline-block min-w-[149px] lg:min-w-[95px] font-600">Box Charge</span> : $
						{order?.order?.box_charge}
					</h6>
					<h6 className="text-[12px] lg:text-[14px]">
						<span className="inline-block min-w-[149px] lg:min-w-[95px] font-600">Shipping Cost</span> : $
						dummy
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
						<span className="inline-block min-w-[149px] lg:min-w-[78px] font-600">Tax Total</span> : $
						{order?.order?.tax_amount}
					</h6>
					<h6 className="text-[12px] lg:text-[14px] font-800">
						<span className="inline-block min-w-[149px] lg:min-w-[78px] font-600">Gross Total</span> : $
						dummy
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
						: ${order?.order?.redeem_credits}
					</h6>
					<h6 className="text-[12px] lg:text-[14px] mb-[5px]">
						<span className="inline-block min-w-[149px] lg:min-w-[174px] font-600">
							{' '}
							Applicable Reward Points
						</span>{' '}
						: ${order?.order?.redeem_rewards}
					</h6>
					<h6 className="text-[12px] lg:text-[14px]">
						<span className="inline-block min-w-[149px] lg:min-w-[174px] font-600">Applicable Promos</span>{' '}
						: ${order?.order?.redeem_promo}
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
						${order?.order?.redeem_gifts}
					</h6>
					<h6 className="text-[12px] lg:text-[14px] font-800">
						<span className="inline-block min-w-[149px] lg:min-w-[101px] font-600">Net Total</span> : $
						{order?.total_price}
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

export default BackOrderHistoryItemDetails;
