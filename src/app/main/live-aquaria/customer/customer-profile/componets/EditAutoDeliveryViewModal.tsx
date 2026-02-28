import CloseIcon from '@mui/icons-material/Close';
import { Button, CircularProgress } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { Field, Form, Formik } from 'formik';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { GET_ALL_AUTO_DELIVERY } from '../../../../../axios/services/live-aquaria-services/customer-services/CustomerService';
import FormDropdown from '../../../../../common/FormComponents/FormDropdown';
import TextFormField from '../../../../../common/FormComponents/FormTextField';
import {
	AutoDeliveryDataItemType,
	CustomerScheduleSubmitForm,
	dropDown,
	ItemMediaAtoDelivery,
	TableRowData
} from '../customer-types/CustomerTypes';
import AutoDeliveryDeleteAlertForm from './AutoDeliveryDeleteAlertForm';

interface ErrorResponse {
	response?: {
		data?: {
			message?: string;
		};
	};
}

interface Props {
	open: boolean;
	handleClose: () => void;
	isScheduleOptions: dropDown[];
	isEditAutoDelivery: AutoDeliveryDataItemType;
	clickedRowData: TableRowData;
	getAllAutoDelivery: () => void;
}

function EditAutoDeliveryViewModal({
	open,
	handleClose,
	isScheduleOptions,
	isEditAutoDelivery,
	clickedRowData,
	getAllAutoDelivery
}: Props) {
	const { t } = useTranslation('customerProfile');
	const [loading, setLoading] = useState<boolean>(false);
	const [isDeleteLoading, setDeleteLoading] = useState<boolean>(false);
	const [isOpenModal, setOpenModal] = useState<boolean>(false);
	const [isMedia, setMedia] = useState<ItemMediaAtoDelivery[]>([]);
	const toggleDeleteModal = () => setOpenModal(!isOpenModal);

	const newAddressYup = yup.object({
		qty: yup.string().required('Qty is required'),
		schedule: yup.string().required('Schedule is required')
	});

	useEffect(() => {
		filtersImages();
	}, []);

	const filtersImages = () => {
		const images: ItemMediaAtoDelivery[] = isEditAutoDelivery?.order_shipment_item?.item.item_media
			.filter((media: { type: string }) => media.type === 'image')
			.slice(0, 2);
		setMedia(images);
	};

	const handleUpdate = async (values: CustomerScheduleSubmitForm) => {
		const userId = clickedRowData.id ?? null;
		const orderId = isEditAutoDelivery.id ?? null;
		const data = {
			delivery_duration_id: values?.schedule ?? null,
			quantity: values?.qty ?? null
		};
		setLoading(true);
		try {
			const response = await axios.put(`${GET_ALL_AUTO_DELIVERY}/${userId}/auto-delivery-items/${orderId}`, data);
			getAllAutoDelivery();
			toast.success('Updated successfully');
			setLoading(false);
			handleClose();
		} catch (error) {
			setLoading(false);
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
	const handleOpen = () => {
		toggleDeleteModal();
	};

	const handleCancelAutoDelivery = async () => {
		toggleDeleteModal();
		const userId = clickedRowData.id ?? null;
		const orderId = isEditAutoDelivery.id ?? null;
		setDeleteLoading(true);
		try {
			const response = await axios.delete(`${GET_ALL_AUTO_DELIVERY}/${userId}/auto-delivery-items/${orderId}`);
			getAllAutoDelivery();
			toast.success('Deleted successfully');
			setDeleteLoading(false);
			handleClose();
		} catch (error) {
			setDeleteLoading(false);
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
		<Dialog
			open={open}
			onClose={handleClose}
			fullWidth
			maxWidth="md"
		>
			<DialogTitle className="flex justify-between items-center gap-[10px] pb-0 mt-[-10px]">
				<h6 className="text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-400">
					{t('Edit Auto Delivery')}
				</h6>
				<IconButton
					edge="end"
					color="inherit"
					onClick={handleClose}
					aria-label="close"
				>
					<CloseIcon />
				</IconButton>
			</DialogTitle>
			<DialogContent>
				<Formik
					initialValues={{
						qty: '' || isEditAutoDelivery?.quantity,
						schedule: '' || isEditAutoDelivery?.delivery_duration?.id
					}}
					validationSchema={newAddressYup}
					onSubmit={handleUpdate}
				>
					{({ values, setFieldValue, isValid, resetForm }) => (
						<Form>
							<Grid
								container
								spacing={2}
							>
								<Grid
									item
									xs={12}
									md={12}
									className="flex flex-wrap sm:!flex-nowrap justify-center items-center gap-[10px]"
								>
									{isMedia &&
										isMedia.map((item: ItemMediaAtoDelivery) => (
											<div className="relative w-full max-w-[200px] overflow-hidden rounded-[6px]">
												<img
													src={item?.link ?? ''}
													alt="Product"
													className="w-full h-auto object-cover object-center rounded-[6px]"
												/>
											</div>
										))}
								</Grid>
								<Grid
									item
									xs={12}
									md={12}
								>
									<Grid
										container
										spacing={2}
									>
										<Grid
											item
											xs={12}
											md={12}
										>
											<h4 className="w-full text-[14px] sm:text-[16px] lg:text-[18px] text-primaryBlueDark font-600">
												{isEditAutoDelivery?.order_shipment_item?.item?.common_name}
											</h4>
										</Grid>
										<Grid
											item
											xs={12}
											md={12}
										>
											<Grid
												container
												spacing={2}
											>
												<Grid
													item
													xs={12}
													md={7}
												>
													<h6 className="w-full text-[10px] sm:text-[12px] lg:text-[14px] text-gray-700 font-400 mb-[5px]">
														<span className="inline-block min-w-[78px] sm:min-w-[110px]">
															Item
														</span>{' '}
														:{' '}
														<span className="text-gray-800 font-600">
															#{isEditAutoDelivery?.order_shipment_item?.item?.code}
														</span>
													</h6>
													<h6 className="w-full text-[10px] sm:text-[12px] lg:text-[14px] text-gray-700 font-400 mb-[5px]">
														<span className="inline-block min-w-[78px] sm:min-w-[110px]">
															Price
														</span>{' '}
														:{' '}
														<span className="text-gray-800 font-600">
															${isEditAutoDelivery?.item_details?.selling_price}
														</span>
													</h6>
													<h6 className="w-full text-[10px] sm:text-[12px] lg:text-[14px] text-gray-700 font-400 mb-[5px]">
														<span className="inline-block min-w-[78px] sm:min-w-[110px]">
															Next Order Date
														</span>{' '}
														:{' '}
														<span className="text-gray-800 font-600">
															{isEditAutoDelivery?.next_date}
														</span>
													</h6>

													<div className="flex justify-between items-center gap-[4px] mt-[10px] mb-[5px]">
														{/* Quantity Selector */}
														<Typography className="min-w-[78px] sm:min-w-[110px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-700 font-400 p-0 m-0 leading-[1]">
															Qty
														</Typography>
														<Typography className="p-0 m-0 leading-[1]">:</Typography>
														<Field
															component={TextFormField}
															name="qty"
															id="qty"
															fullWidth
															size="small"
															type="number"
														/>
													</div>
													<div className="flex justify-between items-center gap-[4px]">
														<Typography className="min-w-[78px] sm:min-w-[110px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-700 font-400 p-0 m-0 leading-[1]">
															Schedule
														</Typography>
														<Typography className="p-0 m-0 leading-[1]">:</Typography>
														<FormDropdown
															id="schedule"
															name="schedule"
															value={values.schedule}
															optionsValues={isScheduleOptions}
															onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
																const { value } = e.target;
																setFieldValue('schedule', value);
															}}
														/>
													</div>
												</Grid>
												<Grid
													item
													xs={12}
													md={5}
													className="flex flex-wrap md:text-end"
												>
													<h6 className="w-full text-[10px] sm:text-[12px] lg:text-[14px] text-gray-700 font-400 mb-[5px]">
														<span className="inline-block min-w-[78px] sm:min-w-[110px] text-start">
															Item Total
														</span>{' '}
														:{' '}
														<span className="inline-block md:min-w-[100px] text-gray-800 font-600">
															${isEditAutoDelivery?.item_total}
														</span>
													</h6>
													<h6 className="w-full text-[10px] sm:text-[12px] lg:text-[14px] text-gray-700 font-400 mb-[5px]">
														<span className="inline-block min-w-[78px] sm:min-w-[110px] text-start">
															Box Charge
														</span>{' '}
														:{' '}
														<span className="inline-block md:min-w-[100px] text-gray-800 font-600">
															${isEditAutoDelivery?.box_charge}
														</span>
													</h6>
													<h6 className="w-full text-[10px] sm:text-[12px] lg:text-[14px] text-gray-700 font-400 mb-[5px]">
														<span className="inline-block min-w-[78px] sm:min-w-[110px] text-start">
															Shipping Cost
														</span>{' '}
														:{' '}
														<span className="inline-block md:min-w-[100px] text-gray-800 font-600">
															${isEditAutoDelivery?.shipping_cost}
														</span>
													</h6>
													<h6 className="w-full text-[10px] sm:text-[12px] lg:text-[14px] text-gray-700 font-400 mb-[5px]">
														<span className="inline-block min-w-[78px] sm:min-w-[110px] text-start">
															Tax Total
														</span>{' '}
														:{' '}
														<span className="inline-block md:min-w-[100px] text-gray-800 font-600">
															${isEditAutoDelivery?.tax_total}
														</span>
													</h6>
													<h6 className="w-full text-[10px] sm:text-[12px] lg:text-[14px] text-gray-700 font-400 mb-[5px]">
														<span className="inline-block min-w-[78px] sm:min-w-[110px] text-start">
															Net Total
														</span>{' '}
														:{' '}
														<span className="inline-block md:min-w-[100px] text-[14px] sm:text-[16px] lg:text-[18px] text-gray-800 font-600">
															${isEditAutoDelivery?.net_total}
														</span>
													</h6>
												</Grid>
											</Grid>
											{/* Display item number as a green chip */}

											{/* <Chip
                        label={`Item #: ${isEditAutoDelivery?.order_shipment_item?.item?.code}`}
                        className='flex justify-center items-center w-max h-[26px] min-h-[26px] text-[8px] sm:text-[10px] lg:text-[12px] text-white px-[4px] bg-primaryBlueLight'
                      /> */}
										</Grid>

										<Grid
											item
											xs={12}
											className="flex justify-end items-center gap-[10px]"
										>
											<Button
												onClick={handleOpen}
												className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
												size="medium"
												disabled={false}
												variant="contained"
											>
												Cancel Auto Delivery
												{isDeleteLoading ? (
													<CircularProgress
														className="text-white ml-[5px]"
														size={24}
													/>
												) : null}
											</Button>
											<Button
												variant="contained"
												type="submit"
												className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
											>
												Save Order
												{loading ? (
													<CircularProgress
														className="text-white ml-[5px]"
														size={24}
													/>
												) : null}
											</Button>
										</Grid>
									</Grid>
								</Grid>
							</Grid>
						</Form>
					)}
				</Formik>
			</DialogContent>

			{isOpenModal && (
				<AutoDeliveryDeleteAlertForm
					toggleModal={toggleDeleteModal}
					isOpen={isOpenModal}
					handleAlertForm={handleCancelAutoDelivery}
				/>
			)}
		</Dialog>
	);
}

export default EditAutoDeliveryViewModal;
