import { Autocomplete, Button, Grid, TextField, Typography } from '@mui/material';
import { Form, Formik, FormikHelpers, FormikProps } from 'formik';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { ORDER_FULFILMENTS, ORDER_FULFILMENTS_PRINT_URL } from 'src/app/axios/services/AdminServices';
import axios, { AxiosResponse } from 'axios';
import useDebounce from 'app/shared-components/useDebounce';
import NavigationViewComp from '../../../../common/FormComponents/NavigationViewComp';
import MaterialTableWrapper from '../../../../common/tableComponents/MaterialTableWrapper';
import InitialOrderTabs from './component/OrderFulfilmentCustomTabPanel';
import { OrderFullfillmentObject, OrderFullfilment, OrderFullfilmentsResponse } from './interfaces';

import CustomFormTextField from '../../../../common/FormComponents/CustomFormTextField';
import { OrderFulfilmentFilter } from './order-fulfilment-type/OrderFulfilmentType';
import { OrderReviewsInterface } from '../initial-order-review/interfaces';
import ExtendedAxiosError from '../../../../types/ExtendedAxiosError';

interface ErrorResponse {
	response?: {
		data?: {
			message?: string;
		};
	};
}

function OrderFulfilment() {
	const { t } = useTranslation('cancelOrders');
	const [pageNo, setPageNo] = useState<number>(0);
	const [pageSize, setPageSize] = useState<number>(5);
	const [count, setCount] = useState(100);
	const [isOpenNewMethod, setOpenNewMethodModal] = useState(false);
	const [isPrintDialogOpen, setPrintDialogOpen] = useState(false);

	const [clickedRowData, setClickedRowData] = useState<OrderFullfillmentObject | null>(null);
	const [orderFullfilments, setOrderFullfilments] = useState<OrderFullfillmentObject[]>([]);
	const [isTableLoading, setTableLoading] = useState(false);
	const [isStatus, setIsStatus] = useState([]);
	const toggleNewAdvertisementModal = () => setOpenNewMethodModal(!isOpenNewMethod);

	const [filteredValues, setFilteredValues] = useState<OrderFulfilmentFilter>({
		customer: null,
		order_id: null,
		status: null
	});
	const debouncedFilter = useDebounce<OrderFulfilmentFilter>(filteredValues, 1000);

	useEffect(() => {
		if (debouncedFilter) changePageNoOrPageSize(filteredValues);

		setIsStatus([
			{ value: '1', label: 'Pending' },
			{ value: '2', label: 'Approved' },
			{ value: '3', label: 'Rejected' },
			{ value: '4', label: 'Planning' },
			{ value: '5', label: 'Assigned' },
			{ value: '6', label: 'Read to dispatch' },
			{ value: '8', label: 'Out for Delivery' },
			{ value: '9', label: 'Delivered' }
		]);
	}, [debouncedFilter]);

	const togglePrintDialog = () => setPrintDialogOpen(!isPrintDialogOpen);

	const tableColumns = [
		{
			title: t('ORDER_ID'),
			field: 'orderId',
			cellStyle: {
				padding: '4px 8px'
			}
		},
		{
			title: t('SUB Order ID'),
			field: 'subOrder',
			cellStyle: {
				padding: '4px 8px'
			}
		},
		{
			title: t('First Name'),
			field: 'customer',
			cellStyle: {
				padding: '4px 8px'
			}
		},
		{
			title: t('EMAIL'),
			field: 'email',
			cellStyle: {
				padding: '4px 8px'
			}
		},
		{
			title: t('Date & Time'),
			field: 'date',
			cellStyle: {
				padding: '4px 8px'
			}
		},
		{
			title: t('ELAPSED_DAYS'),
			field: 'elapsedDays',
			cellStyle: {
				padding: '4px 8px'
			}
		},
		{
			title: t('ORDER_VALUE'),
			field: 'orderValue',
			cellStyle: {
				padding: '4px 8px'
			},
			render: (rowData: OrderFullfillmentObject) =>
				rowData?.orderValue
					? `$${Number(rowData?.orderValue).toLocaleString('en-US', {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2
						})}`
					: ''
		},
		{
			title: t('STATUS'),
			field: 'status',
			cellStyle: {
				padding: '4px 8px'
			}
		}
	];

	const tableRowViewHandler = (rowData: OrderFullfillmentObject) => {
		setClickedRowData(rowData);
		toggleNewAdvertisementModal();
	};

	const tableRowPrintHandler = async (rowData: OrderReviewsInterface) => {
		try {
			const response: AxiosResponse<{ base64: string }> = await axios.get(
				`${ORDER_FULFILMENTS_PRINT_URL}/${rowData?.id}/print`
			);

			if (response?.data) {
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

	const handlePageChange = (page: number) => {
		setPageNo(page);
	};

	const handlePageSizeChange = (pageSize: number) => {
		setPageSize(pageSize);
	};

	const openPdfInNewTab = (pdfBase64: string) => {
		const byteCharacters = atob(pdfBase64);
		const byteNumbers = new Array(byteCharacters.length).fill(null).map((_, i) => byteCharacters.charCodeAt(i));
		const byteArray = new Uint8Array(byteNumbers);
		const blob = new Blob([byteArray], { type: 'application/pdf' });

		const pdfUrl = URL.createObjectURL(blob);
		window.open(pdfUrl, '_blank');
	};

	const changePageNoOrPageSize = async (filteredValues: OrderFulfilmentFilter) => {
		setTableLoading(true);

		try {
			const response: AxiosResponse<OrderFullfilmentsResponse> = await axios.get(
				`${ORDER_FULFILMENTS}?filter=orderStatus.order_status_id,${filteredValues.status}|order.order_code,${filteredValues.order_id}|order.customer.first_name,${filteredValues.customer}&limit=${pageSize}&page=${pageNo}`
			);
			const orderFullfilments:any = response.data.data.map((item: OrderFullfilment) => ({
				id: item?.id,
				orderId: item?.order?.order_no,
				subOrder: item?.order_code,
				customer: `${item?.order?.customer_details?.first_name}`,
				email: item?.order?.customer_details?.email,
				date: item?.created_at,
				elapsedDays: item?.elapsed_date,
				orderValue: `${item?.total_price}`,
				status: item?.order_status
			}));
			setOrderFullfilments(orderFullfilments);
			setCount(response?.data?.meta?.total);
			setTableLoading(false);
		} catch (error) {
			setTableLoading(false);
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

	const changeOrderId = async (value: string, form: FormikProps<OrderFulfilmentFilter>) => {
		form.setFieldValue('order_id', value);
		setFilteredValues({
			...filteredValues,
			order_id: value
		});
	};

	const changeCustomerName = async (value: string, form: FormikProps<OrderFulfilmentFilter>) => {
		form.setFieldValue('customer', value);
		setFilteredValues({
			...filteredValues,
			customer: value
		});
	};

	const changeStatus = async (value: string) => {
		setFilteredValues({
			...filteredValues,
			status: value
		});
	};

	const handleClearForm = (resetForm: FormikHelpers<OrderFulfilmentFilter>['resetForm']) => {
		resetForm();
		setFilteredValues({
			customer: null,
			order_id: null,
			status: null
		});
	};

	return (
		<div className="min-w-full max-w-[100vw]">
			<NavigationViewComp title="Order Review / Order Fulfilment" />

			<Formik
				initialValues={{
					status: '',
					order_id: '',
					customer: ''
				}}
				onSubmit={(values: OrderFulfilmentFilter) => {}}
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
								<Typography className="formTypography">{t('SUB Order ID')}</Typography>
								<CustomFormTextField
									name="order_id"
									id="order_id"
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
								<Typography className="formTypography">{t('STATUS')}</Typography>
								<Autocomplete
									size="small"
									disablePortal
									options={isStatus}
									className="w-full"
									value={values.status || null}
									renderInput={(params) => (
										<TextField
											{...params}
											name="status"
											label=""
										/>
									)}
									onChange={(
										event: React.ChangeEvent<HTMLInputElement>,
										value: { label: string; value: string } | null
									) => {
										setFieldValue('status', value?.label || null);
										changeStatus(value?.value || null);
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
								className="flex justify-end xl:justify-start items-end gap-[10px] !pt-[10px] md:!pt-[26px] lg:!pt-[10px] xl:!pt-[26px]"
							>
								<Button
									className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] xl:text-[14px] text-gray-600 font-500 lg:!px-[2px] xl:!p-[16px] py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
									type="submit"
									variant="contained"
									size="medium"
									disabled={false}
									onClick={() => handleClearForm(resetForm)}
								>
									{t('Clear Filters')}
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
						loading={isTableLoading}
						handlePageChange={handlePageChange}
						handlePageSizeChange={handlePageSizeChange}
						pageSize={pageSize}
						disableColumnFiltering
						pageIndex={pageNo}
						searchByText=""
						count={count}
						disableSearch
						isColumnChoser
						records={orderFullfilments}
						tableRowViewHandler={tableRowViewHandler}
						tableRowPrintHandler={tableRowPrintHandler}
					/>
				</Grid>
			</Grid>

			{isOpenNewMethod && (
				<InitialOrderTabs
					isOpen={isOpenNewMethod}
					toggleModal={toggleNewAdvertisementModal}
					clickedRowData={clickedRowData}
				/>
			)}
		</div>
	);
}

export default OrderFulfilment;
