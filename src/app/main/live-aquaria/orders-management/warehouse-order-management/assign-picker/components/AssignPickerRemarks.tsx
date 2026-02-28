import { Button, Checkbox, FormControlLabel, Grid, TextField, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import {useEffect, useState} from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import PrintIcon from '@mui/icons-material/Print';
import OrdersLogTable from 'src/app/common/OrdersLogTable';
import FormDropdown from '../../../../../../common/FormComponents/FormDropdown';
import TextFormDateField from '../../../../../../common/FormComponents/TextFormDateField';
import {OrderReviewsInterface} from "../../../initial-order-review/interfaces";
import axios, {AxiosResponse} from "axios";
import {FETCH_ORDER_REVIEWS, FETCH_WAREHOUSE_PLANINGS} from "../../../../../../axios/services/AdminServices";
import ExtendedAxiosError from "../../../../../../types/ExtendedAxiosError";
import {toast} from "react-toastify";

interface Props {
	toggleModal: () => void;
	order: any;
}

interface ErrorResponse {
	response?: {
		data?: {
			message?: string;
		};
	};
}

function AssignPickerRemarks({ toggleModal, order }: Props) {
	const { t } = useTranslation('backOrders');
	const [, setIsEditable] = useState(false);

	const orderStatus = [
		{ value: 'Pending', label: 'Pending' },
		{ value: 'Approved', label: 'Approved' },
		{ value: 'Rejected', label: 'Rejected' },
		{ value: 'Planning', label: 'Planning' },
		{ value: 'Assigned', label: 'Assigned' },
		{ value: 'Read to dispatch', label: 'Read to dispatch' },
		{ value: 'Out for Delivery', label: 'Out for Delivery' },
		{ value: 'Delivered', label: 'Delivered' }
	];

	const schema = yup.object().shape({

	});

	const tableRowPrintHandler = async () => {
		const id = order?.id ?? null;
		try {
			const response: AxiosResponse<{ base64: string }> = await axios.get(
				`${FETCH_WAREHOUSE_PLANINGS}/${id}/print`
			);

			if (response.data) {
				openPdfInNewTab(response.data.base64);
			}
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

	const openPdfInNewTab = (pdfBase64: string) => {
		const byteCharacters = atob(pdfBase64);
		const byteNumbers = new Array(byteCharacters.length).fill(null).map((_, i) => byteCharacters.charCodeAt(i));
		const byteArray = new Uint8Array(byteNumbers);
		const blob = new Blob([byteArray], { type: 'application/pdf' });

		const pdfUrl = URL.createObjectURL(blob);
		window.open(pdfUrl, '_blank');
	};

	return (
		<Formik
			initialValues={{
				remarks: order?.remark ?? '',
				date:  order?.estimated_delivery_date ?? '',
				orderStatus: order?.order_status ?? '',
				cancel_order_reason: ''
			}}
			onSubmit={() => {}}
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
							className="formikFormField pt-[5px!important]"
						>
							<Typography>{t('CHANGE_EXPECTED_DELIVERY_DATE')}</Typography>
							<TextFormDateField
								name="date"
								type="date"
								placeholder=""
								id="date"
								min=""
								max={new Date().toISOString().split('T')[0]}
								disablePastDate
								changeInput={(value: string, form: any) => {
									// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call
									form.setFieldValue('date', value);
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
						<Grid
							item
							xs={12}
							className="formikFormField pt-[5px!important]"
						>
							<Typography className="formTypography">{t('Assign Picker Remarks')}</Typography>
							<TextField
								name="remarks"
								fullWidth
								multiline
								rows={4}
								placeholder=""
								variant="outlined"
								label=""
								disabled
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
							className="flex justify-end items-center gap-[10px] pt-[15px!important]"
						>
							<Button
								onClick={toggleModal}
								className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
							>
								Close
							</Button>
							<Button
								className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
								type="button"
								startIcon={<PrintIcon />}
								onClick={()=>tableRowPrintHandler()}
							>
								Print Order
							</Button>
						</Grid>
					</Grid>
				</Form>
			)}
		</Formik>
	);
}

export default AssignPickerRemarks;
