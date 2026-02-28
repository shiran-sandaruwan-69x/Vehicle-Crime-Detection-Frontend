import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Grid, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import axios, { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import {
	GET_ALL_AUTO_DELIVERY,
	GET_SCHEDULE_OPTIONS
} from '../../../../../axios/services/live-aquaria-services/customer-services/CustomerService';
import {
	AutoDeliveryDataItemType,
	AutoDeliveryResponseData,
	CustomerScheduleResponseType,
	CustomerScheduleType,
	dropDown,
	TableRowData
} from '../customer-types/CustomerTypes';
import EditAutoDeliveryViewModal from './EditAutoDeliveryViewModal';
import AutoDeliveryDeleteAlertForm from './AutoDeliveryDeleteAlertForm';

interface ErrorResponse {
	response?: {
		data?: {
			message?: string;
		};
	};
}
interface Props {
	toggleModal: () => void;
	clickedRowData: TableRowData;
	fetchAllCustomers: () => void;
}
export default function AutoDeliveryViewForm({ toggleModal, clickedRowData, fetchAllCustomers }: Props) {
	const { t } = useTranslation('customerProfile');
	const [isScheduleOptions, setScheduleOptions] = useState<dropDown[]>([]);
	const [isAutoDelivery, setAutoDelivery] = useState<AutoDeliveryDataItemType[]>([]);
	const [isEditAutoDelivery, setEditAutoDelivery] = useState<AutoDeliveryDataItemType>({});
	const [isDeleteAutoDelivery, setDeleteAutoDelivery] = useState<AutoDeliveryDataItemType>({});
	const [isOpenEditModal, setOpenEditModal] = useState(false);
	const [isOpenModal, setOpenModal] = useState<boolean>(false);
	const toggleEditModal = () => setOpenEditModal(!isOpenEditModal);
	const toggleDeleteModal = () => setOpenModal(!isOpenModal);

	useEffect(() => {
		getScheduleOptions();
		getAllAutoDelivery();
	}, []);

	const getScheduleOptions = async () => {
		try {
			const response: AxiosResponse<CustomerScheduleResponseType> = await axios.get(
				`${GET_SCHEDULE_OPTIONS}?paginate=false`
			);
			const scheduleOptions: CustomerScheduleResponseType = response?.data;
			const modifiedData: dropDown[] = scheduleOptions.data.map((item: CustomerScheduleType) => ({
				value: item.id,
				label: item.duration
			}));
			setScheduleOptions(modifiedData);
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

	const getAllAutoDelivery = async () => {
		const userId = clickedRowData.id ?? null;
		try {
			const response: AxiosResponse<AutoDeliveryResponseData> = await axios.get(
				`${GET_ALL_AUTO_DELIVERY}/${userId}/auto-delivery-items`
			);
			const autoDelivery: AutoDeliveryDataItemType[] = response?.data?.data;
			setAutoDelivery(autoDelivery);
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
		{ title: t('Order No'), field: 'orderNo', align: 'left' },
		{ title: t('Product Code'), field: 'productCode', align: 'left' },
		{ title: t('Product Name'), field: 'productName', align: 'left' },
		{ title: t('Size'), field: 'size', align: 'left' },
		{ title: t('Quantity'), field: 'quantity', align: 'right' },
		{ title: t('Duration'), field: 'duration', align: 'right' },
		{ title: t('Remark'), field: 'remark', align: 'right' },
		{ title: t('Unit Price'), field: 'unitPrice', align: 'right' },
		{ title: t('Net Total Price'), field: 'netTotalPrice', align: 'right' },
		{ title: t('ACTIONS'), field: 'actions', align: 'center' }
	];

	const handleEdit = (data: AutoDeliveryDataItemType) => {
		setEditAutoDelivery(data);
		toggleEditModal();
	};

	const handleDelete = (data: AutoDeliveryDataItemType) => {
		setDeleteAutoDelivery(data);
		toggleDeleteModal();
	};

	const handleCancelAutoDelivery = async () => {
		toggleDeleteModal();
		const userId = clickedRowData.id ?? null;
		const orderId = isDeleteAutoDelivery.id ?? null;
		try {
			const response = await axios.delete(`${GET_ALL_AUTO_DELIVERY}/${userId}/auto-delivery-items/${orderId}`);
			getAllAutoDelivery();
			toast.success('Deleted successfully');
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

	return (
		<div className="min-w-full max-w-[100vw]">
			<Grid container>
				<Grid
					item
					xs={12}
					className="custom-table"
				>
					<TableContainer>
						<Table
							sx={{ minWidth: 650 }}
							size="small"
							aria-label="a dense table"
						>
							<TableHead>
								<TableRow>
									{tableColumns.map((column, index) => (
										<TableCell
											key={index}
											style={{ backgroundColor: '#354a95', color: '#ffffff' }}
										>
											{column.title}
										</TableCell>
									))}
								</TableRow>
							</TableHead>
							<TableBody>
								{isAutoDelivery?.map((row: AutoDeliveryDataItemType, index) => (
									<TableRow key={index}>
										<TableCell align="left">
											{row?.order_shipment_item?.order_shipment?.order_code}
										</TableCell>
										<TableCell align="left">{row?.order_shipment_item?.item?.code}</TableCell>
										<TableCell align="left">
											{row?.order_shipment_item?.item?.common_name}
										</TableCell>
										<TableCell align="left">{row?.item_details?.master_data?.size}</TableCell>
										<TableCell align="left">{row?.quantity}</TableCell>
										<TableCell align="left">{row?.delivery_duration?.duration}</TableCell>
										<TableCell align="left">{row?.order_shipment_item?.remark}</TableCell>
										<TableCell align="left">{row?.order_shipment_item?.unit_price}</TableCell>
										<TableCell align="left">{row?.net_total}</TableCell>
										<TableCell
											align="center"
											className="flex justify-center items-center"
										>
											<IconButton onClick={() => handleEdit(row)}>
												<EditIcon />
											</IconButton>
											<IconButton onClick={() => handleDelete(row)}>
												<DeleteIcon />
											</IconButton>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				</Grid>

				{isOpenEditModal && (
					<EditAutoDeliveryViewModal
						open={isOpenEditModal}
						handleClose={toggleEditModal}
						isScheduleOptions={isScheduleOptions}
						isEditAutoDelivery={isEditAutoDelivery}
						clickedRowData={clickedRowData}
						getAllAutoDelivery={getAllAutoDelivery}
					/>
				)}

				{isOpenModal && (
					<AutoDeliveryDeleteAlertForm
						toggleModal={toggleDeleteModal}
						isOpen={isOpenModal}
						handleAlertForm={handleCancelAutoDelivery}
					/>
				)}
			</Grid>
		</div>
	);
}
