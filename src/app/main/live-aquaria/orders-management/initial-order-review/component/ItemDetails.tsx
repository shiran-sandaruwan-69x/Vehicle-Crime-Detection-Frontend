import { Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@mui/material/Button';
import axios, { AxiosResponse } from 'axios';
import { FETCH_ORDER_REVIEW_BY_ID, ORDER_REVIEW_UPDATE_ITEM } from 'src/app/axios/services/AdminServices';
import { toast } from 'react-toastify';
import ExtendedAxiosError from 'src/app/types/ExtendedAxiosError';
import FuseLoading from '@fuse/core/FuseLoading/FuseLoading';
import MaterialTableWrapper from '../../../../../common/tableComponents/MaterialTableWrapper';
import InitialReviewDeleteAlertForm from './InitialReviewDeleteAlertForm';
import InitialReviewEditAlertForm from './InitialReviewEditAlertForm';
import { OrderByIDResponseInterface, OrderShipmentPerOrder, OrderItem } from '../interfaces';

interface Props {
	toggleModal: () => void;
	orderReview: OrderByIDResponseInterface;
}

export interface ItemInterface {
	id: number;
	productId: string | undefined;
	productCode: string;
	productName: string;
	quantity: number;
	status: string;
	customerRemark: string;
	adminRemark: string;
	wareHouse: string;
	availableQuantity: string;
	unitPrice: string;
	totalPrice: string;
	size: string | undefined;
	shipment_id: number;
	tableData?: {
		id: number;
	};
}

function ItemDetails({ toggleModal, orderReview }: Props) {
	const { t } = useTranslation('initialOrderReview');
	const [pageNo, setPageNo] = useState<number>(0);
	const [pageSize, setPageSize] = useState<number>(5);
	const [count] = useState(100);
	const [items, setItems] = useState<ItemInterface[]>([]);
	const [orderReviewState, setOrderReviewState] = useState<OrderByIDResponseInterface>(orderReview);
	const [loading, setLoading] = useState<boolean>(false);
	const [seletedItemRow, setSelectedItemRow] = useState<ItemInterface>(null);
	const [seletedOldData, setSeletedOldData] = useState<ItemInterface>(null);
	const [isDeleteModel, setIsDeleteModel] = useState(false);
	const [isEditModel, setIsEditModel] = useState(false);

	const toggleDeleteModel = () => {
		setIsDeleteModel(!isDeleteModel);
		// fetchOrderById(orderReview.id);
	};

	const toggleEditModel = () => {
		setIsEditModel(!isEditModel);
		// fetchOrderById(orderReview.id);
	};

	useEffect(() => {
		fetchOrderById(orderReview.id);
	}, []);

	useEffect(() => {
		const itemData: ItemInterface[] = [];

		if (orderReviewState?.order_shipments && orderReviewState.order_shipments.length > 0) {
			orderReviewState.order_shipments.forEach((item: OrderShipmentPerOrder) => {
				if (item && item?.order_items && item?.order_items.length > 0) {
					item.order_items.forEach((order_item: OrderItem) => {
						itemData.push({
							id: order_item?.id,
							productId: order_item?.item_selection_type?.master_data?.cis_code,
							productCode: order_item?.item?.code,
							productName: order_item?.item?.common_name,
							quantity: order_item?.quantity,
							status: orderReviewState?.order_status?.name,
							customerRemark: order_item?.remark,
							size: order_item?.item_selection_type?.master_data?.size,
							availableQuantity: order_item?.item_selection_type?.master_data?.inventory_qty,
							wareHouse: order_item?.item_selection_type?.master_data?.shipping_type?.company?.name,
							totalPrice: order_item?.sub_total,
							unitPrice: order_item?.unit_price,
							adminRemark: order_item?.admin_remark,
							shipment_id: item?.id
						});
					});
				}
			});
		}

		setItems(itemData);
	}, [orderReviewState, loading]);

	const handlePageChange = (page: number) => {
		setPageNo(page);
	};

	const handlePageSizeChange = (pageSize: number) => {
		setPageSize(pageSize);
	};

	const tableRowEditHandler = (newData: ItemInterface, oldData: ItemInterface, resolve: () => void) => {
		setSelectedItemRow(newData);
		setSeletedOldData(oldData);
		// Simulate an async operation (e.g., API call)
		setTimeout(() => {
			const dataUpdate = [...items];
			const index = oldData.tableData.id;
			dataUpdate[index] = newData;
			setItems(dataUpdate);
			resolve();
			toggleEditModel();
		}, 1000);
	};

	const itemUpdateHandler = async (newData: ItemInterface) => {
		try {
			await axios.put(`${ORDER_REVIEW_UPDATE_ITEM}${newData.shipment_id}/items/${newData.id}`, {
				quantity: newData.quantity,
				admin_remark: newData.adminRemark
			});
			toast.success('Item updated successfully');
			toggleEditModel();
		} catch (error) {
			toggleEditModel();

			const axiosError = error as ExtendedAxiosError;

			if (axiosError?.response?.data?.message) {
				toast.error(axiosError.response.data.message);
			} else if (axiosError.message) {
				toast.error(axiosError.message);
			} else {
				toast.error('An unexpected error occurred');
			}
		} finally {
			setTimeout(() => {
				fetchOrderById(orderReview.id);
			}, 10);
		}
	};

	const fetchOrderById = async (orderId: number) => {
		setLoading(true);
		try {
			const response: AxiosResponse<{ data: OrderByIDResponseInterface }> = await axios.get(
				FETCH_ORDER_REVIEW_BY_ID + orderId
			);
			setOrderReviewState(response?.data?.data);
			setLoading(false);
		} catch (error) {
			setLoading(false);

			const axiosError = error as ExtendedAxiosError;

			if (axiosError?.response?.data?.message) {
				toast.error(axiosError.response.data.message);
			} else if (axiosError.message) {
				toast.error(axiosError.message);
			} else {
				toast.error('An unexpected error occurred');
			}
		}
	};

	const itemRemoveHandler = async (data: ItemInterface) => {
		setSelectedItemRow(data);
		toggleDeleteModel();
	};

	const tableColumns = [
		{
			title: 'Product Code (CIS Code)',
			field: 'productId',
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
			type: 'numeric', // Ensures numeric input only
			validate: (rowData: ItemInterface) => {
				if (rowData.quantity === undefined || rowData.quantity === null) {
					return 'Required';
				}

				if (rowData.quantity <= 0) {
					return 'Must be greater than 0';
				}

				const existingItem = items.find((item) => item.id === rowData.id);

				if (existingItem && existingItem.quantity < rowData.quantity) {
					return 'Must be less than or equal to Initial Seleted quantity';
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
			title: 'Warehouse',
			field: 'wareHouse',
			editable: 'never'
		},
		{ title: t('STATUS'), field: 'status', editable: 'never' },
		{
			title: t('ADMIN_REMARK'),
			field: 'adminRemark',
			editable: 'always',
			validate: (rowData: ItemInterface) => {
				if (!rowData.adminRemark || rowData.adminRemark.trim() === '') {
					return 'Required';
				}

				if (rowData.adminRemark.length < 3) {
					return 'Must be at least 3 characters long';
				}

				return true; // Validation passed
			}
		},
		{
			title: t('UNIT_PRICE'),
			field: 'unitPrice',
			editable: 'never',
			align: 'right',
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
			align: 'right',
			render: (rowData: ItemInterface) =>
				rowData.totalPrice
					? `$${Number(rowData.totalPrice).toLocaleString('en-US', {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2
						})}`
					: ''
		}
	];

	return loading ? (
		<FuseLoading />
	) : (
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
							externalAdd={null}
							externalEdit={null}
							externalView={null}
							selection={false}
							disableSearch
							isColumnChoser
							records={items}
							tableRowDeleteHandler={itemRemoveHandler}
							// handleRowDeleteAction={tableRowDeleteHandler}
							updateAction={tableRowEditHandler}
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
						{orderReviewState?.amount
							? ` $${Number(orderReviewState?.amount).toLocaleString('en-US', {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2
								})}`
							: ' $0.00'}
					</h6>
					<h6 className="text-[12px] lg:text-[14px] mb-[5px]">
						<span className="inline-block min-w-[149px] lg:min-w-[95px] font-600">Box Charge</span> :
						{orderReviewState?.box_charge
							? ` $${Number(orderReviewState?.box_charge).toLocaleString('en-US', {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2
								})}`
							: ' $0.00'}
					</h6>
					<h6 className="text-[12px] lg:text-[14px]">
						<span className="inline-block min-w-[149px] lg:min-w-[95px] font-600">Shipping Cost</span> :
						{orderReviewState?.total_shipping_cost
							? ` $${Number(orderReviewState?.total_shipping_cost).toLocaleString('en-US', {
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
						{orderReviewState?.tax_amount
							? ` $${Number(orderReviewState?.tax_amount).toLocaleString('en-US', {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2
								})}`
							: ' $0.00'}
					</h6>
					<h6 className="text-[12px] lg:text-[14px] font-800">
						<span className="inline-block min-w-[149px] lg:min-w-[78px] font-600">Gross Total</span> :
						{orderReviewState?.gross_amount
							? ` $${Number(orderReviewState?.gross_amount).toLocaleString('en-US', {
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
						{orderReviewState?.redeem_credits
							? `$${Number(orderReviewState?.redeem_credits).toLocaleString('en-US', {
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
						{orderReviewState?.redeem_rewards
							? `$${Number(orderReviewState?.redeem_rewards).toLocaleString('en-US', {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2
								})}`
							: '$0.00'}
					</h6>
					<h6 className="text-[12px] lg:text-[14px]">
						<span className="inline-block min-w-[149px] lg:min-w-[174px] font-600">Applicable Promos</span>{' '}
						:{' '}
						{orderReviewState?.redeem_promo
							? `$${Number(orderReviewState?.redeem_promo).toLocaleString('en-US', {
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
						{orderReviewState?.redeem_gifts
							? ` $${Number(orderReviewState?.redeem_gifts).toLocaleString('en-US', {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2
								})}`
							: ' $0.00'}
					</h6>
					<h6 className="text-[12px] lg:text-[14px] font-800">
						<span className="inline-block min-w-[149px] lg:min-w-[101px] font-600">Net Total</span> :
						{orderReviewState?.total_amount
							? ` $${Number(orderReviewState?.total_amount).toLocaleString('en-US', {
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
				className="mt-[5px] mb-[15px]"
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

			{isDeleteModel && (
				<InitialReviewDeleteAlertForm
					toggleModal={() => {
						toggleDeleteModel();
						fetchOrderById(orderReview.id);
					}}
					isOpen={isDeleteModel}
					clickedRowData={seletedItemRow}
				/>
			)}

			{isEditModel && (
				<InitialReviewEditAlertForm
					toggleModal={() => {
						toggleEditModel();
						fetchOrderById(orderReview.id);
					}}
					isOpen={isEditModel}
					clickedRowData={seletedItemRow}
					handleAlertForm={itemUpdateHandler}
					seletedOldData={seletedOldData}
				/>
			)}
		</div>
	);
}

export default ItemDetails;
