import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useTranslation } from 'react-i18next';
import { Button, CircularProgress, Grid, Typography } from '@mui/material';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { toast } from 'react-toastify';
import axios from 'axios';
import TextFormField from '../../../../../common/FormComponents/FormTextField';
import ResponsiveTimePickers from '../../../../../common/FormComponents/ResponsiveTimePickers';
import { ShippingHoldsSubmitType } from '../../../shipping/shipping-delays/shipping-holds-types/ShippingHoldsType';
import TextFormDateField from '../../../../../common/FormComponents/TextFormDateField';
import { PromotionCycleModifiedData, PromotionCycleSubmitType } from '../promotion-cycle-type/PromotionCycleType';
import { CREATE_PROMOTION_CYCLE } from '../../../../../axios/services/live-aquaria-services/promotion-services/PromotionsServices';

interface ErrorResponse {
	response?: {
		data?: {
			message?: string;
		};
	};
}

interface Props {
	isOpen: boolean;
	toggleModal: () => void;
	clickedRowData: PromotionCycleModifiedData;
	isMode: string;
	fetchAllPromotionCycle: () => void;
}

function NewPromotionCycleModal({ isOpen, toggleModal, clickedRowData, isMode, fetchAllPromotionCycle }: Props) {
	const { t } = useTranslation('promotionCycle');
	const [isDataLoading, setDataLoading] = useState(false);
	const today = new Date().toISOString().split('T')[0];

	const schema = yup.object().shape({
		cycleName: yup.string().required('Cycle Name is required'),
		startDate: yup.string().required('Start Date is required')
	});

	const handleClearForm = (resetForm: FormikHelpers<PromotionCycleSubmitType>['resetForm']) => {
		resetForm({
			values: {
				refNo: '',
				cycleName: '',
				startDate: '',
				startTime: '',
				endDate: '',
				endTime: '',
				repeatYearly: false
			}
		});
	};

	const formatTime = (time: string | null) => {
		return time ? time.replace(/(\d{2}):(\d{2}):([APM]+)/, '$1:$2 $3') : null;
	};

	const handleSubmit = async (values: PromotionCycleSubmitType) => {
		const formattedStartTime: string | null = formatTime(values?.startTime);
		const formattedEndTime: string | null = formatTime(values?.endTime);

		const data = {
			ref_no: values.refNo ?? null,
			name: values.cycleName ?? null,
			start_date: values.startDate ?? null,
			end_date: values.endDate ?? null,
			start_time: formattedStartTime,
			end_time: formattedEndTime,
			is_repeat_yearly: values.repeatYearly ?? null,
			is_active: clickedRowData?.is_active ? clickedRowData?.is_active : 1
		};

		if (isMode === 'edit') {
			try {
				const id = clickedRowData?.id ?? null;

				setDataLoading(true);
				await axios.put(`${CREATE_PROMOTION_CYCLE}/${id}`, data);
				fetchAllPromotionCycle();
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
				setDataLoading(true);
				await axios.post(`${CREATE_PROMOTION_CYCLE}`, data);
				fetchAllPromotionCycle();
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

	return (
		<Dialog
			fullWidth
			open={isOpen}
			maxWidth="lg"
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
								return t('Create New');
						}
					})()}{' '}
					Promotion Cycle
				</h6>
			</DialogTitle>
			<DialogContent>
				<Formik
					initialValues={{
						refNo: clickedRowData.ref_no || '',
						cycleName: clickedRowData.name || '',
						startDate: clickedRowData?.start_date || today,
						startTime: clickedRowData.startTime || '12:00:AM',
						endDate: clickedRowData.end_date || '',
						endTime: clickedRowData.endTime || '',
						repeatYearly: clickedRowData.repeatYearly || false
					}}
					onSubmit={handleSubmit}
					validationSchema={schema}
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
									lg={3}
									md={4}
									sm={6}
									xs={12}
									className="pt-[5px!important]"
								>
									<Typography className="formTypography">{t('REF_NO')}</Typography>
									<Field
										disabled={isMode === 'view'}
										name="refNo"
										component={TextFormField}
										fullWidth
										size="small"
									/>
								</Grid>

								<Grid
									item
									lg={3}
									md={4}
									sm={6}
									xs={12}
									className="pt-[5px!important]"
								>
									<Typography className="formTypography">
										{t('CYCLE_NAME')}
										<span className="text-red"> *</span>
									</Typography>
									<Field
										disabled={isMode === 'view'}
										name="cycleName"
										component={TextFormField}
										fullWidth
										size="small"
									/>
								</Grid>

								<Grid
									item
									lg={3}
									md={4}
									sm={6}
									xs={12}
									className="pt-[5px!important] customField"
								>
									<Typography className="formTypography">
										{t('Start Date')}
										<span className="text-red"> *</span>
									</Typography>
									<TextFormDateField
										disabled={isMode === 'view'}
										name="startDate"
										type="date"
										placeholder=""
										id="startDate"
										min={today}
										max=""
										disablePastDate={false}
										changeInput={(value: string, form: FormikHelpers<ShippingHoldsSubmitType>) => {
											form.setFieldValue('startDate', value);
										}}
									/>
								</Grid>

								<Grid
									item
									lg={3}
									md={4}
									sm={6}
									xs={12}
									className="pt-[5px!important] customField"
								>
									<Typography className="formTypography">{t('START_TIME')}</Typography>
									<Field
										disabled={isMode === 'view'}
										name="startTime"
										component={ResponsiveTimePickers}
									/>
								</Grid>

								<Grid
									item
									lg={3}
									md={4}
									sm={6}
									xs={12}
									className="pt-[5px!important] customField"
								>
									<Typography className="formTypography">{t('End Date')}</Typography>
									<TextFormDateField
										disabled={isMode === 'view'}
										name="endDate"
										type="date"
										placeholder=""
										id="endDate"
										min={values.startDate ? values.startDate : today}
										max=""
										disablePastDate={false}
										changeInput={(value: string, form: FormikHelpers<ShippingHoldsSubmitType>) => {
											form.setFieldValue('endDate', value);
										}}
									/>
								</Grid>

								<Grid
									item
									lg={3}
									md={4}
									sm={6}
									xs={12}
									className="pt-[5px!important] customField"
								>
									<Typography className="formTypography">{t('END_TIME')}</Typography>
									<Field
										disabled={isMode === 'view'}
										name="endTime"
										component={ResponsiveTimePickers}
									/>
								</Grid>

								<Grid
									item
									lg={3}
									md={4}
									sm={6}
									xs={12}
									className="!pt-[10px] !pt-[26px] customField"
								>
									<FormControlLabel
										control={
											<Checkbox
												disabled={isMode === 'view'}
												checked={values.repeatYearly}
												onChange={(event) =>
													setFieldValue('repeatYearly', event.target.checked)
												}
												color="primary"
											/>
										}
										label={t('Repeat Yearly')}
									/>
								</Grid>

								<Grid
									item
									lg={12}
									md={4}
									sm={6}
									xs={12}
									className="flex justify-end items-start gap-[10px] pt-[26px!important] lg:pt-[10px!important]"
								>
									{isMode === 'view' ? null : (
										<Button
											className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
											type="submit"
											variant="contained"
											size="medium"
											disabled={false}
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
											className="flex justify-center items-center min-w-[80px] sm:min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
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
										{t('Close')}
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

export default NewPromotionCycleModal;
