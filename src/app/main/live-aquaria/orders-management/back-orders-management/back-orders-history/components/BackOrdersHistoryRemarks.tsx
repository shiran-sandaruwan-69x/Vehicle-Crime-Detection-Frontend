import { useTranslation } from 'react-i18next';
import { Form, Formik, FormikProps } from 'formik';
import { Grid, TextField, Typography } from '@mui/material';
import * as yup from 'yup';
import Button from '@mui/material/Button';
import OrdersLogTable from 'src/app/common/OrdersLogTable';
import TextFormDateField from 'src/app/common/FormComponents/TextFormDateField';
import FormDropdown from 'src/app/common/FormComponents/FormDropdown';
import { useEffect, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import { FETCH_ORDER_CANCEL_REASONS, FETCH_ORDER_STATUS } from 'src/app/axios/services/AdminServices';
import { toast } from 'react-toastify';
import ExtendedAxiosError from 'src/app/types/ExtendedAxiosError';
import { OrderData } from '../BackOrdersHistoryModel';

interface Props {
	toggleModal: () => void;
	order: OrderData;
}

interface InitialValues {
	remark: string;
	date: string;
	orderStatus: string | null;
	cancel_order_reason: string | null;
}

function BackOrdersHistoryRemarks({ toggleModal, order }: Props) {
	const { t } = useTranslation('backOrders');

	const [canselOrderReasons, setCancelOrderReasons] = useState<{ value: string; label: string }[]>([]);
	const [orderStatus, setOrderStatus] = useState<{ value: number; label: string }[]>([]);

	useEffect(() => {
		fetchOrderCancelReasons();
		fetchOrderStatus();
	}, []);

	const fetchOrderCancelReasons = async () => {
		try {
			const response: AxiosResponse<{
				data: { id: number; reason: string; is_active: number }[];
			}> = await axios.get(`${FETCH_ORDER_CANCEL_REASONS}`);

			const modifiedData = response.data.data.map((item) => ({
				value: item.reason,
				label: item.reason
			}));
			setCancelOrderReasons(modifiedData);
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

	const fetchOrderStatus = async () => {
		try {
			const response: AxiosResponse<{
				data: { id: number; name: string; is_active: number }[];
			}> = await axios.get(`${FETCH_ORDER_STATUS}`);

			const modifiedData = response.data.data
				.filter(
					(item: { id: number; name: string; is_active: number }) =>
						// eslint-disable-next-line eqeqeq
						item.name == 'Approved' || item.name == 'Rejected' || item.name == 'Pending'
				)
				.map((item) => ({
					value: item.id,
					label: item.name
				}));

			setOrderStatus(modifiedData);
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

	const schema = yup.object().shape({
		orderStatus: yup.string().required(t('ORDER_STATUS_REQUIRED')),
		cancel_order_reason: yup.string().required(t('CANCEL_ORDER_REASON_REQUIRED'))
	});

	let orderStatusValue: number | null;

	if (order?.order_status) {
		switch (order.order_status) {
			case 'Pending':
				orderStatusValue = 1;
				break;
			case 'Approved':
				orderStatusValue = 2;
				break;
			case 'Rejected':
				orderStatusValue = 3;
				break;
			default:
				orderStatusValue = null;
		}
	}

	return (
		<Formik
			initialValues={{
				remarks: order?.remark ? order?.remark : '',
				date: order?.estimated_delivery_date,
				orderStatus: order?.order_status ? orderStatusValue : null,
				cancel_order_reason: order?.cancel_reason
			}}
			onSubmit={() => {}}
			validationSchema={schema}
			enableReinitialize
		>
			{(formik) => (
				<Form>
					<Grid
						container
						spacing={2}
						className="pt-[5px]"
					>
						<Grid
							item
							xs={12}
							sm={6}
							md={4}
							lg={3}
							className="formikFormField pt-[5px!important]"
						>
							<Typography>{t('CHANGE_EXPECTED_DELIVERY_DATE')}</Typography>
							<TextFormDateField
								name="date"
								type="date"
								placeholder=""
								id="date"
								min={new Date().toISOString().split('T')[0]} // Set today's date as min
								max={new Date().toISOString().split('T')[0]} // Set max if needed
								changeInput={(value: string, form: FormikProps<InitialValues>) => {
									form.setFieldValue('date', value);
									//   console.log(formik.values)
								}}
								disabled
							/>
						</Grid>
						<Grid
							item
							xs={12}
							sm={6}
							md={4}
							lg={3}
							className="formikFormField pt-[5px!important]"
						>
							<Typography>
								{t('ORDER_STATUS')}
								<span className="text-red"> *</span>
							</Typography>
							<FormDropdown
								name="orderStatus"
								id="orderStatus"
								placeholder=""
								optionsValues={orderStatus}
								disabled
							/>
						</Grid>
						{formik.values.orderStatus === 3 && (
							<Grid
								item
								xs={12}
								sm={12}
								lg={3}
								className="formikFormField pt-[5px!important]"
							>
								<Typography>
									{t('CANCEL_ORDER_REASON')}
									<span className="text-red"> *</span>
								</Typography>
								<FormDropdown
									name="cancel_order_reason"
									id="cancel_order_reason"
									placeholder=""
									optionsValues={canselOrderReasons}
									disabled
								/>
							</Grid>
						)}

						<Grid
							item
							xs={12}
							className="formikFormField pt-[5px!important]"
						>
							<Typography className="formTypography">Remarks</Typography>
							<TextField
								name="remarks"
								fullWidth
								multiline
								rows={4}
								placeholder="Placeholder"
								variant="outlined"
								label=""
								{...formik.getFieldProps('remarks')}
								disabled
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
							className="flex justify-end items-center gap-[10px] pt-[15px!important] mb-[15px]"
						>
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
	);
}

export default BackOrdersHistoryRemarks;
