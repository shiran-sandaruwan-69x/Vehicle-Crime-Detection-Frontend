import { Autocomplete, Button, Grid, TextField, Typography } from '@mui/material';
import { Form, Formik, FormikHelpers, FormikProps } from 'formik';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios, { AxiosResponse } from 'axios';
import {
	FETCH_ORDER_CANCEL_REASONS,
	GET_CANCEL_ORDERS,
	ORDER_FULFILMENTS_PRINT_URL
} from 'src/app/axios/services/AdminServices';
import { toast } from 'react-toastify';
import useDebounce from 'app/shared-components/useDebounce';
import NavigationViewComp from '../../../../common/FormComponents/NavigationViewComp';
import MaterialTableWrapper from '../../../../common/tableComponents/MaterialTableWrapper';
import InitialOrderTabs from './component/CancelOrderCustomTabPanel';
import InitialOrderReviewBill from './component/InitialOrderReviewBill';
import { OrderFulfilmentFilter } from '../order-fulfilment/order-fulfilment-type/OrderFulfilmentType';
import CustomFormTextField from '../../../../common/FormComponents/CustomFormTextField';
import {OrderReviewsInterface} from "../initial-order-review/interfaces";
import ExtendedAxiosError from "../../../../types/ExtendedAxiosError";

interface FormValues {
	date_from: string;
	date_to: string;
	customer: string;
}

interface TableRowData {
	id?: string;
	orderId?: string;
	customer?: string;
	date?: string;
	totalDays?: number;
	status?: 'Completed' | 'Pending' | 'Cancelled';
	cancelReason?: string;
	totalAmount?: number;
	customerId?: string;
	mobile?: string;
	orderDate?: string;
	deliveryDate?: string;
}

interface ErrorResponse {
	response?: {
		data?: {
			message?: string;
		};
	};
}

function CancelOrder() {
	const { t } = useTranslation('cancelOrders');
	const [pageNo, setPageNo] = useState<number>(0);
	const [pageSize, setPageSize] = useState<number>(5);
	const [count, setCount] = useState<number>(0);
	const [isOpenNewMethod, setOpenNewMethodModal] = useState(false);
	const [isPrintDialogOpen, setPrintDialogOpen] = useState(false);
	const [clickedRowData, setClickedRowData] = useState<any>(null);
	const [orders, setOrders] = useState<any>([]);
	const [canselOrderReasons, setCancelOrderReasons] = useState([]);
	const [filteredValues, setFilteredValues] = useState<any>({
		product: null,
		order_by_date: null,
		customer: null,
		cancel_reason: null
	});
	const debouncedFilter = useDebounce<any>(filteredValues, 1000);
	const toggleNewAdvertisementModal = () => setOpenNewMethodModal(!isOpenNewMethod);

	useEffect(() => {
		if (debouncedFilter) fetchCancelOrders(filteredValues);
	}, [debouncedFilter]);

	useEffect(()=>{
		fetchOrderCancelReasons();
	},[])

	const fetchCancelOrders = async (filteredValues: any) => {
		try {
			const response: AxiosResponse<any> = await axios.get(`${GET_CANCEL_ORDERS}?filter=order.order_date,${filteredValues.order_by_date}|order_code,${filteredValues.product}|order.customer.first_name,${filteredValues.customer}|order.cancel_reason,${filteredValues.cancel_reason}&limit=${pageSize}&page=${pageNo}`);
			const data = response.data.data.map((item: any) => ({
				id: item?.id,
				code: item?.order_code,
				customerName: item?.order?.customer_details?.first_name,
				email: item?.order?.customer_details?.email,
				date: item?.order?.order_date,
				elapsedDays: item?.elapsed_date,
				orderValue: item?.total_price,
				status: item?.order?.is_active,
				order_status: item?.order_status,
				cancel_reason: item?.cancel_reason,
				total_price: item?.total_price
			}));

			setOrders(data);
			setCount(response.data.meta.total);
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

	const handleFilterAll = () => {};

	const togglePrintDialog = () => setPrintDialogOpen(!isPrintDialogOpen);

	const tableColumns = [
		{
			title: t('ORDER_ID'),
			field: 'code',
			cellStyle: {
				padding: '4px 8px'
			}
		},
		{
			title: t('First Name'),
			field: 'customerName',
			cellStyle: {
				padding: '4px 8px'
			}
		},
		{
			title: t('DATE'),
			field: 'date',
			cellStyle: {
				padding: '4px 8px'
			}
		},
		{
			title: t('TOTAL_DAYS'),
			field: 'totalDays',
			cellStyle: {
				padding: '4px 8px'
			}
		},
		{
			title: t('STATUS'),
			field: 'order_status',
			cellStyle: {
				padding: '4px 8px'
			}
		},
		{
			title: t('CANCEL_REASON'),
			field: 'cancel_reason',
			cellStyle: {
				padding: '4px 8px'
			}
		},
		{
			title: t('TOTAL_AMOUNT'),
			field: 'total_price',
			cellStyle: {
				padding: '4px 8px'
			}
		}
	];

	const fetchOrderCancelReasons = async () => {
		try {
			const response: AxiosResponse<{
				data: { id: number; reason: string; is_active: number }[];
			}> = await axios.get(`${FETCH_ORDER_CANCEL_REASONS}`);

			const modifiedData = response?.data?.data.map((item) => ({
				value: item?.reason,
				label: item?.reason
			}));
			setCancelOrderReasons(modifiedData);
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

	const tableRowViewHandler = (rowData: TableRowData) => {
		setClickedRowData(rowData);
		toggleNewAdvertisementModal();
	};

	const handlePageChange = (page: number) => {
		setPageNo(page);
	};

	const handlePageSizeChange = (pageSize: number) => {
		setPageSize(pageSize);
	};

	const changeCustomerName = async (value: string, form: FormikProps<any>) => {
		form.setFieldValue('customer', value);
		setFilteredValues({
			...filteredValues,
			customer: value
		});
	};

	const changeOrderId = async (value: string, form: FormikProps<any>) => {
		form.setFieldValue('product', value);
		setFilteredValues({
			...filteredValues,
			product: value
		});
	};

	const changeCancelReason = async (value: string) => {
		setFilteredValues({
			...filteredValues,
			cancel_reason: value
		});
	};

	const handleClearForm = (resetForm: FormikHelpers<any>['resetForm']) => {
		resetForm();
		const resetFilters: any = {
			product: '',
			order_by_date: '',
			cancel_reason: '',
			customer: ''
		};
		setFilteredValues(resetFilters);
	};

	const tableRowPrintHandler = async (rowData: TableRowData) => {
		try {
			const response: AxiosResponse<{ base64: string }> = await axios.get(
				`${GET_CANCEL_ORDERS}/${rowData?.id}/print`
			);

			if (response.data) {
				openPdfInNewTab(response?.data?.base64);
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
		<div className="min-w-full max-w-[100vw]">
			<NavigationViewComp title="Order Management / Cancel Orders" />

			<Formik
				initialValues={{
					product: '',
					order_by_date: '',
					cancel_reason: '',
					customer: ''
				}}
				onSubmit={handleFilterAll}
			>
				{({ values, setFieldValue, isValid, resetForm }) => (
					<Form>
						<Grid
							container
							spacing={2}
							className="pt-[10px] pr-[30px] mx-auto"
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
								<Typography className="formTypography">{t('Order ID')}</Typography>
								<CustomFormTextField
									name="product"
									id="product"
									type="text"
									placeholder=""
									disabled={false}
									changeInput={changeOrderId}
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
								<Typography className="formTypography">{t('First Name')}</Typography>
								<CustomFormTextField
									name="customer"
									id="customer"
									type="text"
									placeholder=""
									disabled={false}
									changeInput={changeCustomerName}
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
								<Typography className="formTypography">{t('CANCEL_REASON')}</Typography>
								<Autocomplete
									size="small"
									disablePortal
									options={canselOrderReasons}
									className="w-full"
									value={values.cancel_reason || null}
									renderInput={(params) => (
										<TextField
											{...params}
											name="cancel_reason"
											label=""
										/>
									)}
									onChange={(
										event: React.ChangeEvent<HTMLInputElement>,
										value: { label: string; value: string } | null
									) => {
										setFieldValue('cancel_reason', value?.label || null);
										changeCancelReason(value?.value || null);
									}}
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
								<Typography className="formTypography">{t('Date')}</Typography>
								<TextField
									type="date"
									id="order_by_date"
									label=""
									variant="outlined"
									size="small"
									className="w-full"
									value={filteredValues.order_by_date}
									onChange={(event) => {
										console.log('event?.target?.value',event?.target?.value)
										setFilteredValues({
											...filteredValues,
											order_by_date: event?.target?.value
										});
									}}
								/>
							</Grid>

							<Grid
								item
								xs={12}
								sm={12}
								md={8}
								lg={12}
								xl={4}
								className="flex justify-end xl:justify-start items-end gap-[10px] !pt-[10px] md:!pt-[26px] xl:!pt-[26px]"
							>
								<Button
									className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] xl:text-[14px] text-gray-600 font-500 lg:!px-[2px] xl:!p-[16px] py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
									type="submit"
									variant="contained"
									size="medium"
									disabled={false}
									onClick={() => handleClearForm(resetForm)}
								>
									{t('CLEAR_FILTERS')}
								</Button>
							</Grid>
						</Grid>
					</Form>
				)}
			</Formik>

			<Grid
				container
				spacing={2}
				className="pt-[20px] pr-[30px] mx-auto"
			>
				<Grid
					item
					md={12}
					sm={12}
					xs={12}
					className="!pt-[5px]"
				>
					<MaterialTableWrapper
						title=""
						tableColumns={tableColumns}
						handlePageChange={handlePageChange}
						handlePageSizeChange={handlePageSizeChange}
						pageSize={pageSize}
						disableColumnFiltering
						pageIndex={pageNo}
						searchByText=""
						count={count}
						disableSearch
						isColumnChoser
						records={orders}
						tableRowViewHandler={tableRowViewHandler}
						tableRowPrintHandler={tableRowPrintHandler}
					/>
				</Grid>
			</Grid>


			{isOpenNewMethod && clickedRowData !== null && (
				<InitialOrderTabs
					isOpen={isOpenNewMethod}
					toggleModal={toggleNewAdvertisementModal}
					clickedRowData={clickedRowData}
					orderId={clickedRowData?.id}
				/>
			)}

			{isPrintDialogOpen && (
				<InitialOrderReviewBill
					isOpen={isPrintDialogOpen}
					toggleModal={togglePrintDialog}
					clickedRowData={null}
				/>
			)}
		</div>
	);
}

export default CancelOrder;
