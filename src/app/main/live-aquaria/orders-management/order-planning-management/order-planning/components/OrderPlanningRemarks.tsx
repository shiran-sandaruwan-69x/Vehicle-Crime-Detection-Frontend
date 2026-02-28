import { Button, Grid, TextField, Typography } from '@mui/material';
import { ErrorMessage, Form, Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import axios from 'axios';
import { ORDER_PLANING_UPDATE } from 'src/app/axios/services/AdminServices';
import OrdersLogTable from 'src/app/common/OrdersLogTable';
import ExtendedAxiosError from 'src/app/types/ExtendedAxiosError';
import TextFormDateField from '../../../../../../common/FormComponents/TextFormDateField';
import { OrderShipmentInterface, RemarksInitialValuesInterface } from '../interfaces';

interface Props {
	toggleModal: () => void;
	order: OrderShipmentInterface;
}

function OrderPlanningRemarks({ toggleModal, order }: Props) {
	const { t } = useTranslation('backOrders');

	const schema = yup.object().shape({
		remarks: yup.string(),
		date: yup.string().required('Date is required')
	});

	const formSubmit = async (values: RemarksInitialValuesInterface) => {
		try {
			await axios.put(`${ORDER_PLANING_UPDATE}${order?.id}`, {
				remark: values.remarks,
				estimated_delivery_date: values.date
			});
			toast.success('Order updated successfully');
			toggleModal();
		} catch (error) {
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

	return (
		<Formik
			initialValues={{
				remarks: order?.remark ? order?.remark : '',
				date: order?.estimated_delivery_date
			}}
			onSubmit={formSubmit}
			validationSchema={schema}
		>
			{(formik) => (
				<Form>
					<Grid
						container
						spacing={2}
						className="pt-0"
					>
						<Grid
							item
							xs={12}
							sm={6}
							md={4}
							lg={3}
							xl={2}
							className="formikFormField pt-[5px!important]"
						>
							<Typography>{t('CHANGE_EXPECTED_DELIVERY_DATE')}</Typography>
							<TextFormDateField
								name="date"
								type="date"
								placeholder=""
								id="date"
								min={new Date().toISOString().split('T')[0]} // Set today's date as min
								// max={new Date().toISOString().split('T')[0]} // Set max if needed
								// disablePastDate
								changeInput={(value: string, form: any) => {
									// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call
									form.setFieldValue('date', value);
								}}
							/>
							<ErrorMessage
								name="date"
								component="div"
								className="error-text"
							/>
						</Grid>
						<Grid
							item
							xs={12}
							sm={6}
							md={4}
							lg={3}
							xl={2}
							className="formikFormField pt-[5px!important]"
						>
							<Typography>
								{t('ORDER_STATUS')}
								<span className="text-red"> *</span>
							</Typography>

							<div
								className={`w-max text-[10px] sm:text-[12px] text-center font-medium px-[15px] py-[2px] mt-[8px] rounded-full
                ${
					order.order_status === 'Approved'
						? 'text-green-600 border border-green-600 bg-green-50'
						: order.order_status === 'Pending'
							? 'text-orange-600 border border-orange-600 bg-orange-50'
							: order.order_status === 'Rejected'
								? 'text-red-600 border border-red-600 bg-red-50'
								: 'text-primaryBlue border border-primaryBlue bg-primaryBlue/50'
				}`}
							>
								{order.order_status}
							</div>
						</Grid>

						<Grid
							item
							xs={12}
							className="formikFormField pt-[5px!important]"
						>
							<Typography className="formTypography">{t('Remark')}</Typography>
							<TextField
								name="remarks"
								fullWidth
								multiline
								rows={4}
								placeholder="Placeholder"
								variant="outlined"
								label=""
								{...formik.getFieldProps('remarks')}
							/>
						</Grid>

						<Grid
							item
							xs={12}
							className="pt-[10px!important]"
						>
							{order.logs && order.logs.length > 0 && <OrdersLogTable tableData={order.logs} />}
						</Grid>

						<Grid
							item
							md={12}
							sm={12}
							xs={12}
							className="flex justify-end items-center gap-[10px] pt-[10px!important]"
						>
							<Button
								type="button"
								onClick={toggleModal}
								className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
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
					</Grid>
				</Form>
			)}
		</Formik>
	);
}

export default OrderPlanningRemarks;
