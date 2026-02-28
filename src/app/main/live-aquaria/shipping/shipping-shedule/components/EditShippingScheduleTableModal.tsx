import { Button, Dialog, DialogContent, DialogTitle, Grid, Typography } from '@mui/material';
import { Field, Form, Formik } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import TextFormField from '../../../../../common/FormComponents/FormTextField';
import CustomTextFormDateField from '../../../../../common/FormComponents/CustomTextFormDateField';
import { ShippingScheduleMessageData } from '../../shipping-types/types/ShippingTypes';

interface Props {
	toggleModal: () => void;
	isOpen: boolean;
	clickedRowData: ShippingScheduleMessageData;
	onConfirmShippingScheduleTableData: (values: ShippingScheduleMessageData) => void;
}

function EditShippingScheduleTableModal({
	isOpen,
	toggleModal,
	clickedRowData,
	onConfirmShippingScheduleTableData
}: Props) {
	const { t } = useTranslation('ShippingSchedule');

	const schema = yup.object().shape({
		date_field: yup.string().required('Date is required'),
		message: yup.string().required('Message is required')
	});

	const onSubmit = (values: { date_field?: Date | string; message?: string }) => {
		if (values.date_field && values.message) {
			const { timeZone } = Intl.DateTimeFormat().resolvedOptions();

			const newDate =
				values.date_field instanceof Date
					? values.date_field.toLocaleDateString('en-CA', { timeZone })
					: new Date(values.date_field).toLocaleDateString('en-CA', {
							timeZone
						});

			const data: ShippingScheduleMessageData = {
				...clickedRowData,
				date: newDate,
				message: values.message
			};

			onConfirmShippingScheduleTableData(data);
		}
	};

	return (
		<Dialog
			fullWidth
			open={isOpen}
			maxWidth="xs"
			onClose={toggleModal}
			// PaperProps={{ style: { top: '40px', margin: 0, position: 'absolute' } }}
		>
			<DialogTitle className="pb-0">
				<h6 className="text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-400">
					Edit Shipping Schedule
				</h6>
			</DialogTitle>
			<DialogContent>
				<Formik
					initialValues={{
						date_field: clickedRowData?.date ? new Date(clickedRowData.date) : '',
						message: clickedRowData?.message || ''
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
									xs={12}
									className="formikFormField pt-[5px!important]"
								>
									<Typography>
										{t('DATE')}
										<span className="text-red"> *</span>
									</Typography>
									<CustomTextFormDateField
										name="date_field"
										id="date_field"
										placeholder=""
										disabled={false}
										max={null}
										changeInput={(
											value: string,
											form: {
												setFieldValue: (field: string, value: any) => void;
											}
										) => {
											form.setFieldValue('date_field', value);
										}}
										min={null}
									/>
								</Grid>
								<Grid
									item
									xs={12}
									className="flex gap-[16px] formikFormField pt-[5px!important]"
								>
									<div className="w-full">
										<Typography className="leading-[21px]">
											{t('MESSAGE')}
											<span className="text-red"> *</span>
										</Typography>
										<Field
											name="message"
											component={TextFormField}
											fullWidth
											size="small"
										/>
									</div>
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
								<Button
									className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
									type="submit"
								>
									Update
								</Button>
							</Grid>
						</Form>
					)}
				</Formik>
			</DialogContent>
		</Dialog>
	);
}

export default EditShippingScheduleTableModal;
