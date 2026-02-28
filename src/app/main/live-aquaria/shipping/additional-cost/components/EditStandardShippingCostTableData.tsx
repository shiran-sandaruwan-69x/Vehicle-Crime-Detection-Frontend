import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { Button, CircularProgress, Dialog, DialogContent, DialogTitle, Grid, Typography } from '@mui/material';
import { Field, Form, Formik } from 'formik';
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import TextFormField from '../../../../../common/FormComponents/FormTextField';
import {
	StandardShippingCostModifiedData,
	StandardShippingCostSubmitData
} from '../additional-cost-types/AdditionalCostTypes';
import { CREATE_SHIPPING_ADDITIONAL_COSTS } from '../../../../../axios/services/live-aquaria-services/shipping-services/ShippingTypeService';

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
	isTableMode: string;
	fetchAllStandardShippingCost: () => void;
}

function EditStandardShippingCostTableData({
	isOpen,
	toggleModal,
	clickedRowData,
	fetchAllStandardShippingCost,
	isTableMode
}: Props) {
	const { t } = useTranslation('AdditionalCost');
	const [isDataLoading, setDataLoading] = useState(false);

	const schema = yup.object().shape({
		minimumAmount: yup
			.number()
			.min(0, 'Order Minimum Amount must be greater than or equal to zero')
			.required('Order Minimum Amount is required'),
		maximumAmount: yup
			.number()
			.min(0, 'Order Maximum Amount must be greater than or equal to zero')
			.required('Order Maximum Amount is required'),
		shippingAmount: yup
			.number()
			.min(0, 'Shipping Amount must be greater than or equal to zero')
			.required('Shipping Amount is required')
	});

	const onSubmit = async (values: StandardShippingCostSubmitData) => {
		if (values.maximumAmount <= values.minimumAmount) {
			toast.error('Order Maximum Amount must be greater than to Order Minimum Amount');
			return;
		}

		const id: string = clickedRowData?.id ?? null;
		const data = {
			type: 'SSC',
			shipping_type_id: clickedRowData?.shipping_type?.id ?? null,
			amount: values.minimumAmount,
			max_amount: values.maximumAmount,
			shipping_amount: values.shippingAmount,
			is_active: clickedRowData.is_active
		};
		setDataLoading(true);
		try {
			await axios.put(`${CREATE_SHIPPING_ADDITIONAL_COSTS}/${id}`, data);
			fetchAllStandardShippingCost();
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
					{isTableMode === 'edit' ? 'Edit' : 'View'} Standard Shipping Cost
				</h6>
			</DialogTitle>
			<DialogContent>
				<Formik
					initialValues={{
						minimumAmount: clickedRowData?.amount || '',
						maximumAmount: clickedRowData?.max_amount || '',
						shippingAmount: clickedRowData?.shipping_amount || ''
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
									<Typography>
										{t('Order Minimum Amount ($)')}
										<span className="text-red"> *</span>
									</Typography>
									<Field
										type="number"
										disabled={isTableMode === 'view'}
										name="minimumAmount"
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
									className="formikFormField pt-[5px!important]"
								>
									<Typography>
										{t('Order Maximum Amount ($)')}
										<span className="text-red"> *</span>
									</Typography>
									<Field
										type="number"
										disabled={isTableMode === 'view'}
										name="maximumAmount"
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
									className="formikFormField pt-[5px!important]"
								>
									<Typography>
										{t('Shipping Amount ($)')}
										<span className="text-red"> *</span>
									</Typography>
									<Field
										type="number"
										disabled={isTableMode === 'view'}
										name="shippingAmount"
										component={TextFormField}
										fullWidth
										size="small"
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

export default EditStandardShippingCostTableData;
