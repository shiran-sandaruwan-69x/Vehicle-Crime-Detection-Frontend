import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Grid from '@mui/material/Grid';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import {CircularProgress, FormControlLabel, Switch} from '@mui/material';
import {
	updateAlertyType,
	updateOrderReason, updateSystemAlertyType
} from '../../../../../axios/services/live-aquaria-services/master-data-services/MasterDataServices';
import { ReasonCreateData, ReasonModifiedData } from '../cancel-order-reason-types/CancelOrderReasonTypes';
import TextFormField from '../../../../../common/FormComponents/FormTextField';
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";

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
	clickedRowData: any;
	compType: string;
	getCancelOrderReasons: () => void;
}
const schema = z.object({
	is_active: z.number(),
});
function CancelOrderReasonsDialogForm({ toggleModal, isOpen, clickedRowData, compType, getCancelOrderReasons }: Props) {
	const { t } = useTranslation('cancelOrderReasons');
	const [isCancelOrderReasonsDataLoading, setCancelOrderReasonsDataLoading] = useState(false);
	const [isViewAttributeDialogFormDataLoading, setViewAttributeDialogFormDataLoading] = useState(false);
	const onSubmit = async (values: any) => {
		setViewAttributeDialogFormDataLoading(true);

		const dataToUpdate = {
			systemAlertPriority: values.systemAlertPriority ? values.systemAlertPriority : '',
			systemAlertPriorityCode: values.systemAlertPriorityCode ? values.systemAlertPriorityCode : '',
			status: values?.is_active
		};

		try {
			const id = clickedRowData.id ? clickedRowData.id : '';
			const response = await updateSystemAlertyType(dataToUpdate, id);
			getCancelOrderReasons();
			setViewAttributeDialogFormDataLoading(false);
			toggleModal();
			toast.success('Updated Successfully');
		} catch (error) {
			setViewAttributeDialogFormDataLoading(false);
			const isErrorResponse = (error: unknown): any => {
				return typeof error === 'object' && error !== null && 'response' in error;
			};

			if (isErrorResponse(error) && error.response?.data?.message) {
				toast.error(error.response.data.message);
			} else {
				toast.error('Internal server error');
			}
		}
	};

	const handleClearForm = (resetForm: FormikHelpers<ReasonCreateData>['resetForm']) => {
		resetForm({
			values: {
				cancelReason: ''
			}
		});
	};

	const schema2 = yup.object().shape({
		systemAlertPriority: yup.string().required(t('System Alert Priority is required')),
		systemAlertPriorityCode: yup.string().required(t('System Alert Priority Code is required'))
	});

	const defaultValues = {
		id: clickedRowData ? Number(clickedRowData.id) : 0,
		systemAlertPriority: clickedRowData.systemAlertPriority ? clickedRowData.systemAlertPriority : '',
		systemAlertPriorityCode: clickedRowData.systemAlertPriorityCode ? clickedRowData.systemAlertPriorityCode : '',
		is_active: clickedRowData ? Number(clickedRowData?.is_active) : 1,
	};

	const { handleSubmit, formState, control } = useForm<any>({
		mode: 'onChange',
		defaultValues,
		resolver: zodResolver(schema)
	});

	return (
		<Dialog
			fullWidth
			open={isOpen}
			maxWidth="sm"
			onClose={toggleModal}
		>
			<DialogTitle className="pb-0">
				<h6 className="text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-400">
					{compType === 'view' ? 'View' : 'Edit'} System Alert Priority
				</h6>
			</DialogTitle>
			<DialogContent>
				<Formik
					initialValues={defaultValues}
					validationSchema={schema2}
					onSubmit={onSubmit}
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
									md={12}
									sm={12}
									xs={12}
									className="formikFormField pt-[5px!important]"
								>
									<Typography className="formTypography">
										{t('System Alert Priority')}
										<span className="text-red"> *</span>
									</Typography>
									<Field
										disabled={false}
										name="systemAlertPriority"
										placeholder={t('')}
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
									<Typography className="formTypography">
										{t('System Alert Priority Code')}
										<span className="text-red"> *</span>
									</Typography>
									<Field
										disabled={false}
										name="systemAlertPriorityCode"
										placeholder={t('')}
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
									<Controller
										name="is_active"
										control={control}
										render={({ field }) => (
											<FormControlLabel
												control={
													<Switch
														{...field}                    // spreads value, onChange, onBlur, name, ref
														checked={field.value === 1}   // since you're storing 1/0
														disabled={compType === 'view'}
														size="small"
														sx={{
															'& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
																backgroundColor: '#387ed4 !important',
															},
															'& .MuiSwitch-thumb': {
																backgroundColor: '#387ed4',
															},
															'& .MuiSwitch-switchBase.Mui-disabled .MuiSwitch-thumb': {
																backgroundColor: '#b2d4fe',
															},
														}}
														onChange={(e) => {
															field.onChange(e.target.checked ? 1 : 0)
															setFieldValue('is_active',e.target.checked ? 1 : 0)
														}}
													/>
												}
												label={field.value === 1 ? 'Active' : 'Inactive'}
											/>
										)}
									/>
								</Grid>

								<Grid
									item
									xs={12}
									className="flex justify-end items-start gap-[10px] pt-[10px!important]"
								>
									{compType === 'view' ? null : (
										<Button
											className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
											type="submit"
											variant="contained"
											size="medium"
											disabled={compType === 'view'}
										>
											{t('Update')}
											{isViewAttributeDialogFormDataLoading ? (
												<CircularProgress
													className="text-white ml-[5px]"
													size={24}
												/>
											) : null}
										</Button>
									)}

									{/* {compType === 'view' ? null : */}
									{/*	<Button */}
									{/*		className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80" */}
									{/*		type="button" */}
									{/*		variant="contained" */}
									{/*		size="medium" */}
									{/*		disabled={compType === 'view'} */}
									{/*		onClick={() => handleClearForm(resetForm)} */}
									{/*	> */}
									{/*		{t('Reset')} */}
									{/*	</Button> */}
									{/* } */}

									<Button
										onClick={toggleModal}
										className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
									>
										Close
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

export default CancelOrderReasonsDialogForm;
