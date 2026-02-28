import { Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Formik, FormikHelpers, FormikProps } from 'formik';
import * as yup from 'yup';
import Typography from '@mui/material/Typography';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { toast } from 'react-toastify';
import useDebounce from 'app/shared-components/useDebounce';
import CustomFormTextField from '../../../../../common/FormComponents/CustomFormTextField';
import CommonHeading from '../../../../../common/FormComponents/CommonHeading';
import {
	CustomerOrderHistoryFilterData,
	OrderHistoryFilterData,
	OrderHistoryFilterResponseData,
	TableRowData
} from '../customer-types/CustomerTypes';
import OrderHistoryViewModal from './OrderHistoryViewModal';
import { getOrderHistory } from '../../../../../axios/services/live-aquaria-services/customer-services/CustomerService';
import TextFormDateField from '../../../../../common/FormComponents/TextFormDateField';

interface ErrorResponse {
	response?: {
		data?: {
			message?: string;
		};
	};
}

interface Props {
	toggleModal: () => void;
	clickedRowData: TableRowData;
	fetchAllCustomers: () => void;
}

function OrderHistoryViewForm({ toggleModal, clickedRowData, fetchAllCustomers }: Props) {
	const { t } = useTranslation('customerProfile');
	const [isCreateCustomerPoints, setCreateCustomerPoints] = useState<OrderHistoryFilterData[]>([]);
	const [isOpenViewModal, setOpenViewModal] = useState(false);
	const toggleViewModal = () => setOpenViewModal(!isOpenViewModal);
	const schema = yup.object().shape({});
	const [isOrderId, setOrderId] = useState<string>(null);
	const [filteredValues, setFilteredValues] = useState<CustomerOrderHistoryFilterData>({
		orderId: null,
		productId: null,
		productName: null,
		fromDate: null,
		toDate: null
	});
	const debouncedFilter = useDebounce<CustomerOrderHistoryFilterData>(filteredValues, 1000);

	useEffect(() => {
		if (debouncedFilter) getAllOrderHistory();
	}, [debouncedFilter]);

	const getAllOrderHistory = async () => {
		try {
			const userId = clickedRowData.id ?? null;
			const response: OrderHistoryFilterResponseData = await getOrderHistory(
				userId,
				filteredValues.orderId,
				filteredValues.productName,
				filteredValues.productId,
				filteredValues.fromDate,
				filteredValues.toDate
			);
			setCreateCustomerPoints(response.data);
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

	const onSubmit = (values: CustomerOrderHistoryFilterData) => {};

	const changeCode = async (value: string, form: FormikProps<CustomerOrderHistoryFilterData>) => {
		form.setFieldValue('orderId', value);
		setFilteredValues({
			...filteredValues,
			orderId: value.length === 0 ? null : value
		});
	};

	const changeProductId = async (value: string, form: FormikProps<CustomerOrderHistoryFilterData>) => {
		form.setFieldValue('productId', value);
		setFilteredValues({
			...filteredValues,
			productId: value.length === 0 ? null : value
		});
	};

	const changeProductName = async (value: string, form: FormikProps<CustomerOrderHistoryFilterData>) => {
		form.setFieldValue('productName', value);
		setFilteredValues({
			...filteredValues,
			productName: value.length === 0 ? null : value
		});
	};

	const changeFromDate = async (value: string) => {
		setFilteredValues({
			...filteredValues,
			fromDate: value.length === 0 ? null : value
		});
	};

	const changeToDate = async (value: string) => {
		setFilteredValues({
			...filteredValues,
			toDate: value.length === 0 ? null : value
		});
	};

	const handleOpenView = (id: string) => {
		setOrderId(id);
		toggleViewModal();
	};

	return (
		<div className="min-w-full max-w-[100vw]">
			<Grid
				container
				spacing={2}
			>
				<Grid
					item
					md={12}
					sm={12}
					xs={12}
					key={1}
				>
					<Formik
						initialValues={{
							orderId: '',
							productId: '',
							productName: '',
							fromDate: '',
							toDate: ''
						}}
						validationSchema={schema}
						onSubmit={onSubmit}
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
										className="formikFormField pt-[10px!important]"
									>
										<CommonHeading title="Customer Order History" />
									</Grid>
									<Grid
										item
										xs={12}
										sm={6}
										md={4}
										lg={3}
										xl={3}
										className="formikFormField pt-[5px!important]"
									>
										<Typography className="formTypography">{t('Order ID')}</Typography>
										<CustomFormTextField
											name="orderId"
											id="orderId"
											type="text"
											placeholder=""
											disabled={false}
											changeInput={changeCode}
										/>
									</Grid>
									<Grid
										item
										xs={12}
										sm={6}
										md={4}
										lg={3}
										xl={3}
										className="formikFormField pt-[5px!important]"
									>
										<Typography className="formTypography">{t('CIS Code')}</Typography>
										<CustomFormTextField
											name="productId"
											id="productId"
											type="text"
											placeholder=""
											disabled={false}
											changeInput={changeProductId}
										/>
									</Grid>
									<Grid
										item
										xs={12}
										sm={6}
										md={4}
										lg={3}
										xl={3}
										className="formikFormField pt-[5px!important]"
									>
										<Typography className="formTypography">{t('Product Name')}</Typography>
										<CustomFormTextField
											name="productName"
											id="productName"
											type="text"
											placeholder=""
											disabled={false}
											changeInput={changeProductName}
										/>
									</Grid>
									<Grid
										item
										xs={12}
										sm={6}
										md={4}
										lg={3}
										xl={3}
										className="formikFormField pt-[5px!important]"
									>
										<Typography className="formTypography">{t('Order Date')}</Typography>
										<TextFormDateField
											name="fromDate"
											type="date"
											placeholder=""
											id="fromDate"
											min=""
											max=""
											disablePastDate={false}
											changeInput={(value: string, form: FormikHelpers<FormValues>) => {
												changeFromDate(value);
												form.setFieldValue('fromDate', value);
											}}
										/>
									</Grid>
									<Grid
										item
										xs={12}
										sm={6}
										md={4}
										lg={3}
										xl={3}
										className="formikFormField pt-[5px!important]"
									>
										<Typography className="formTypography">{t('Delivery Date')}</Typography>
										<TextFormDateField
											name="toDate"
											type="date"
											placeholder=""
											id="toDate"
											min={values.fromDate}
											max=""
											disablePastDate={false}
											changeInput={(value: string, form: FormikHelpers<FormValues>) => {
												changeToDate(value);
												form.setFieldValue('toDate', value);
											}}
										/>
									</Grid>
								</Grid>
							</Form>
						)}
					</Formik>
				</Grid>
				<Grid
					item
					md={12}
					sm={12}
					xs={12}
					key={1}
					className="max-h-[200px] overflow-y-auto"
				>
					<TableContainer>
						<Table
							size="small"
							className="custom-table"
						>
							<TableHead>
								<TableRow>
									<TableCell
										sx={{
											backgroundColor: '#354a95',
											color: 'white'
										}}
									>
										{t('Order ID')}
									</TableCell>
									<TableCell
										sx={{
											backgroundColor: '#354a95',
											color: 'white'
										}}
									>
										{t('Shipping Address')}
									</TableCell>
									<TableCell
										sx={{
											backgroundColor: '#354a95',
											color: 'white'
										}}
									>
										{t('Billing Address')}
									</TableCell>
									<TableCell
										sx={{
											backgroundColor: '#354a95',
											color: 'white'
										}}
									>
										{t('Action')}
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{isCreateCustomerPoints?.map((row, rowIndex) => (
									<TableRow key={rowIndex}>
										<TableCell>{row?.order_code}</TableCell>
										<TableCell>
											{row?.order_details?.shipping_address?.address_line_1}{' '}
											{row?.order_details?.shipping_address?.address_line_2}{' '}
											{row?.order_details?.shipping_address?.address_line_3}
										</TableCell>
										<TableCell>
											{row?.order_details?.billing_address?.address_line_1}{' '}
											{row?.order_details?.billing_address?.address_line_2}{' '}
											{row?.order_details?.billing_address?.address_line_3}
										</TableCell>
										<TableCell>
											<VisibilityIcon
												className="text-red-400"
												fontSize="small"
												sx={{ cursor: 'pointer' }}
												onClick={() => handleOpenView(row?.id)}
											/>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				</Grid>
			</Grid>

			{isOpenViewModal && (
				<OrderHistoryViewModal
					isOpen={isOpenViewModal}
					toggleModal={toggleViewModal}
					clickedRowData={clickedRowData}
					isOrderId={isOrderId}
				/>
			)}
		</div>
	);
}

export default OrderHistoryViewForm;
