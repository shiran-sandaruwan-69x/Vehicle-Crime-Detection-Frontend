import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useTranslation } from 'react-i18next';
import { Button, Grid, Typography, CircularProgress } from '@mui/material';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import axios, { AxiosResponse } from 'axios';
import FormDropdown from '../../../../../common/FormComponents/FormDropdown';
import TextFormField from '../../../../../common/FormComponents/FormTextField';
import {
	CREATE_SHIPPING_METHOD,
	CREATE_SHIPPING_SCHEDULE,
	updateShippingMethodStatus
} from '../../../../../axios/services/live-aquaria-services/shipping-services/ShippingMethods';

import {
	MaintenanceScheduleTypeApiResponse,
	ShippingMethodsFormData,
	ShippingMethodsModifiedData,
	ShippingScheduleTypeDrp
} from '../types/ShippingMethodsType';

interface ErrorResponse {
	response?: {
		data?: {
			message?: string;
		};
	};
}
interface Props {
	isOpen?: boolean;
	toggleModal?: () => void;
	clickedRowData: ShippingMethodsModifiedData;
	fetchAllShippingMethods?: () => void;
	isMode?: string;
}

function NewMethodModal({ isOpen, toggleModal, clickedRowData, fetchAllShippingMethods, isMode }: Props) {
	const { t } = useTranslation('ShippingMethods');
	const [shippingDeliveryScheduleData, setShippingDeliveryScheduleData] = useState<ShippingScheduleTypeDrp[]>([]);
	const [isDataLoading, setDataLoading] = useState(false);

	useEffect(() => {
		loadAllShippingScheduleNamesToDropDown();
	}, []);

	const loadAllShippingScheduleNamesToDropDown = async () => {
		try {
			const response: AxiosResponse<MaintenanceScheduleTypeApiResponse> = await axios.get(
				`${CREATE_SHIPPING_SCHEDULE}?paginate=false`
			);
			const schedules: ShippingScheduleTypeDrp[] = response?.data?.data?.map((schedule) => ({
				label: schedule?.title,
				value: schedule?.id
			}));
			setShippingDeliveryScheduleData(schedules);
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

	const handleCreateShippingMethod = async (values: ShippingMethodsFormData) => {
		setDataLoading(true);

		if (isMode === 'edit') {
			const id = clickedRowData?.id ?? null;
			const data = {
				method: values.method,
				amount: values.amount,
				shipping_schedule_id: values.shippingDeliverySchedule,
				transit_days: values.transit_days,
				service_provider: values.service_provider,
				is_active: clickedRowData?.is_active
			};

			try {
				await axios.put(`${CREATE_SHIPPING_METHOD}/${id}`, data);
				await updateShippingMethodStatus(id, data);
				fetchAllShippingMethods();
				toast.success('Updated successfully');
				setDataLoading(false);
				toggleModal();
			} catch (error) {
				setDataLoading(false);
				const isErrorResponse = (error: unknown): error is ErrorResponse => {
					return typeof error === 'object' && error !== null && 'response' in error;
				};

				if (isErrorResponse(error) && error.response?.data?.message) {
					toast.error(error.response.data.message);
				} else {
					toast.error('Internal server error');
				}
			}
		} else {
			try {
				const data = {
					method: values.method,
					amount: values.amount,
					shipping_schedule_id: values.shippingDeliverySchedule,
					transit_days: values.transit_days,
					service_provider: values.service_provider,
					is_active: 1
				};
				await axios.post(`${CREATE_SHIPPING_METHOD}`, data);
				fetchAllShippingMethods();
				toast.success('Created successfully');
				setDataLoading(false);
				toggleModal();
			} catch (error) {
				setDataLoading(false);
				const isErrorResponse = (error: unknown): error is ErrorResponse => {
					return typeof error === 'object' && error !== null && 'response' in error;
				};

				if (isErrorResponse(error) && error.response?.data?.message) {
					toast.error(error.response.data.message);
				} else {
					toast.error('Internal server error');
				}
			}
		}
	};

	const schema = yup.object().shape({
		method: yup.string().required('Method Name is required'),
		amount: yup
			.number()
			.typeError('Amount must be a number')
			.positive('Amount must be a positive number')
			.required('Amount is required'),
		shippingDeliverySchedule: yup.string().required('Shipping & Delivery Schedule is required'),
		service_provider: yup.string().required('Service Provider is required'),
		transit_days: yup
			.number()
			.integer('Transit Days must be an integer')
			.typeError('Transit Days must be a number')
			.positive('Transit Days must be a positive number')
			.required('Transit Days is required')
	});

	const handleClearForm = (resetForm: FormikHelpers<ShippingMethodsFormData>['resetForm']) => {
		resetForm({
			values: {
				method: '',
				amount: '',
				shippingDeliverySchedule: '',
				transit_days: '',
				service_provider: ''
			}
		});
	};

	return (
		<Dialog
			fullWidth
			open={isOpen}
			maxWidth="md"
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
				<h6 className="text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-400">
					{(() => {
						switch (isMode) {
							case 'view':
								return t('View');
							case 'edit':
								return t('Edit');
							default:
								return t('Create');
						}
					})()}{' '}
					{t('Shipping Method')}
				</h6>
			</DialogTitle>
			<DialogContent>
				<Formik
					initialValues={{
						method: clickedRowData?.methodName || '',
						amount: clickedRowData?.amount || '',
						shippingDeliverySchedule: clickedRowData?.shipping_schedule?.id || '',
						transit_days: clickedRowData?.transit_days || '',
						service_provider: clickedRowData?.service_provider || ''
					}}
					onSubmit={handleCreateShippingMethod}
					validationSchema={schema}
					enableReinitialize
				>
					{({ values, setFieldValue, isValid, resetForm }) => (
						<Form>
							<Grid
								container
								spacing={2}
								className="pt-[10px]"
							>
								<Grid
									item
									md={4}
									sm={6}
									xs={12}
									className="pt-[5px!important]"
								>
									<Typography className="formTypography">
										{t('METHOD_NAME')}
										<span className="text-red"> *</span>
									</Typography>
									<Field
										disabled={isMode === 'view'}
										name="method"
										component={TextFormField}
										fullWidth
										size="small"
									/>
								</Grid>
								<Grid
									item
									md={4}
									sm={6}
									xs={12}
									className="pt-[5px!important]"
								>
									<Typography className="formTypography">
										{t('AMOUNT')}
										<span className="text-red"> *</span>
									</Typography>
									<Field
										disabled={isMode === 'view'}
										name="amount"
										type="number"
										component={TextFormField}
										fullWidth
										size="small"
									/>
								</Grid>
								<Grid
									item
									md={4}
									sm={6}
									xs={12}
									className="pt-[5px!important]"
								>
									<Typography className="formTypography">
										{t('Shipping & Delivery Schedule')}
										<span className="text-red"> *</span>
									</Typography>
									<FormDropdown
										name="shippingDeliverySchedule"
										id="shippingDeliverySchedule"
										placeholder=""
										optionsValues={shippingDeliveryScheduleData}
										disabled={isMode === 'view'}
									/>
								</Grid>
								<Grid
									item
									md={4}
									sm={6}
									xs={12}
									className="pt-[5px!important]"
								>
									<Typography className="formTypography">
										{t('TRANSIT_DAYS')}
										<span className="text-red"> *</span>
									</Typography>
									<Field
										disabled={isMode === 'view'}
										name="transit_days"
										type="number"
										component={TextFormField}
										fullWidth
										size="small"
									/>
								</Grid>
								<Grid
									item
									md={4}
									sm={6}
									xs={12}
									className="pt-[5px!important]"
								>
									<Typography className="formTypography">
										{t('SERVICE_PROVIDER')}
										<span className="text-red"> *</span>
									</Typography>
									<Field
										disabled={isMode === 'view'}
										name="service_provider"
										component={TextFormField}
										fullWidth
										size="small"
									/>
								</Grid>
								<Grid
									item
									md={12}
									sm={12}
									xs={12}
									className="flex justify-end items-start gap-[10px] !pt-[10px] sm:!pt-[26px]"
								>
									{isMode === 'view' ? null : (
										<Button
											className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
											variant="contained"
											color="primary"
											type="submit"
										>
											{isMode === 'edit' ? 'Update' : 'Save'}
											{isDataLoading ? (
												<CircularProgress
													className="text-white ml-[5px]"
													size={24}
												/>
											) : null}
										</Button>
									)}

									{isMode === 'view' ? null : (
										<Button
											className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
											type="button"
											variant="contained"
											size="medium"
											disabled={isMode === 'view'}
											onClick={() => handleClearForm(resetForm)}
										>
											{t('Reset')}
										</Button>
									)}

									<Button
										className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80 boxShadow"
										color="primary"
										onClick={toggleModal}
									>
										{t('CLOSE')}
									</Button>
								</Grid>
							</Grid>
						</Form>
					)}
				</Formik>
			</DialogContent>
		</Dialog>
	);
}

export default NewMethodModal;
