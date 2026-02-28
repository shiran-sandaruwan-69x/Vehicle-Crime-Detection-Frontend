import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { Button, CircularProgress, Dialog, DialogContent, DialogTitle, Grid, Typography } from '@mui/material';
import { Field, Form, Formik } from 'formik';
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import TextFormField from '../../../../../common/FormComponents/FormTextField';
import FormDropdown from '../../../../../common/FormComponents/FormDropdown';
import {
	AdditionalCostDaysSubmitData,
	StandardShippingCostModifiedData
} from '../additional-cost-types/AdditionalCostTypes';
import { CREATE_SHIPPING_ADDITIONAL_COSTS } from '../../../../../axios/services/live-aquaria-services/shipping-services/ShippingTypeService';
import { ShippingScheduleTypeDrp } from '../../shipping-methods/types/ShippingMethodsType';

interface ErrorResponse {
	response?: {
		data?: {
			message?: string;
		};
	};
}
interface Props {
	toggleModal: () => void;
	isOpen: boolean;
	clickedRowData: StandardShippingCostModifiedData;
	fetchAllAdditionalCostDays: () => void;
	shippingScheduleData: ShippingScheduleTypeDrp[];
	isTableMode: string;
}

function EditAdditionalCostDaysTableData({
	isOpen,
	toggleModal,
	clickedRowData,
	fetchAllAdditionalCostDays,
	shippingScheduleData,
	isTableMode
}: Props) {
	const { t } = useTranslation('AdditionalCost');
	const [isDataLoading, setDataLoading] = useState(false);

	const schema = yup.object().shape({
		days: yup.string().required('Days is required'),
		amount: yup.number().min(0, 'Amount must be greater than or equal to zero').required('Amount is required'),
		deliverySchedule: yup.string().required('Delivery Schedule is required')
	});

	const isDays = [
		{ label: 'Sunday', value: 'Sunday' },
		{ label: 'Monday', value: 'Monday' },
		{ label: 'Tuesday', value: 'Tuesday' },
		{ label: 'Wednesday', value: 'Wednesday' },
		{ label: 'Thursday', value: 'Thursday' },
		{ label: 'Friday', value: 'Friday' },
		{ label: 'Saturday', value: 'Saturday' }
	];

	const onSubmit = async (values: AdditionalCostDaysSubmitData) => {
		const id: string = clickedRowData?.id ?? null;
		const data = {
			type: 'ACD',
			shipping_type_id: clickedRowData?.shipping_type?.id ?? null,
			day: values?.days ?? null,
			shipping_schedule_id: values?.deliverySchedule ?? null,
			amount: values?.amount ?? null,
			is_active: clickedRowData?.is_active
		};
		setDataLoading(true);
		try {
			await axios.put(`${CREATE_SHIPPING_ADDITIONAL_COSTS}/${id}`, data);
			fetchAllAdditionalCostDays();
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
	};

	return (
		<Dialog
			fullWidth
			open={isOpen}
			maxWidth="xs"
			onClose={toggleModal}
		>
			<DialogTitle className="pb-0">
				<h6 className="text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-400">
					{isTableMode === 'edit' ? 'Edit' : 'View'} Additional Cost Days
				</h6>
			</DialogTitle>
			<DialogContent>
				<Formik
					initialValues={{
						days: clickedRowData?.day || '',
						amount: clickedRowData?.amount || '',
						deliverySchedule: clickedRowData?.shipping_schedule?.id || ''
					}}
					onSubmit={onSubmit}
					enableReinitialize
					validationSchema={schema}
				>
					{({ dirty, isValid, values, errors, touched, setFieldValue }) => (
						<Form>
							<Grid
								container
								spacing={2}
								className="pt-[10px]"
							>
								<Grid
									item
									md={12}
									sm={12}
									xs={12}
									className="formikFormField pt-[5px!important]"
								>
									<Typography className="formTypography">
										{t('Days')}
										<span className="text-red"> *</span>
									</Typography>
									<FormDropdown
										name="days"
										id="days"
										placeholder=""
										optionsValues={isDays}
										disabled={isTableMode === 'view'}
										onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
											const { value } = e.target;
											setFieldValue('days', value);
										}}
									/>
								</Grid>

								<Grid
									item
									md={12}
									sm={12}
									xs={12}
									className="formikFormField pt-[5px!important]"
								>
									<Typography className="formTypography">
										{t('Amount ($)')}
										<span className="text-red"> *</span>
									</Typography>
									<Field
										disabled={isTableMode === 'view'}
										name="amount"
										component={TextFormField}
										fullWidth
										type="number"
										size="small"
									/>
								</Grid>
								<Grid
									item
									md={12}
									sm={12}
									xs={12}
									className="formikFormField pt-[5px!important]"
								>
									<Typography className="formTypography">
										{t('Shipping Schedule')}
										<span className="text-red"> *</span>
									</Typography>
									<FormDropdown
										name="deliverySchedule"
										id="deliverySchedule"
										placeholder=""
										optionsValues={shippingScheduleData}
										disabled={isTableMode === 'view'}
										onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
											const { value } = e.target;
											setFieldValue('deliverySchedule', value);
										}}
									/>
								</Grid>
							</Grid>
							<Grid
								item
								md={12}
								sm={12}
								xs={12}
								className="flex justify-end items-center gap-[10px] pt-[10px!important]"
							>
								<Button
									className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
									onClick={toggleModal}
								>
									Close
								</Button>
								{isTableMode === 'view' ? null : (
									<Button
										className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
										type="submit"
									>
										Update
										{isDataLoading ? (
											<CircularProgress
												className="text-white ml-[5px]"
												size={24}
											/>
										) : null}
									</Button>
								)}
							</Grid>
						</Form>
					)}
				</Formik>
			</DialogContent>
		</Dialog>
	);
}

export default EditAdditionalCostDaysTableData;
