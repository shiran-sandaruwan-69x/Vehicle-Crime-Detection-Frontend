import { Button, Grid, TextField, Typography } from '@mui/material';
import { Form, Formik, FormikHelpers } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import axios, { AxiosResponse } from 'axios';
import {
	CREATE_PICKER_ASSIGN_WAREHOUSE_ORDERS,
	FETCH_PICKER_LIST,
	FETCH_WAREHOUSE_PLANINGS
} from 'src/app/axios/services/AdminServices';
import { toast } from 'react-toastify';
import { PaginationLinks, PaginationMeta } from 'src/app/types/paginateMetaData';
import useDebounce from 'app/shared-components/useDebounce';
import FormDropdown from '../../../../../common/FormComponents/FormDropdown';
import NavigationViewComp from '../../../../../common/FormComponents/NavigationViewComp';
import MaterialTableWrapper from '../../../../../common/tableComponents/MaterialTableWrapper';
import AssignPickerModel from './AssignPickerModel';

interface TableRowData {
	orderId: string;
	customerName: string;
	email: string;
	date: string;
	elapsedTime: string;
	totalAmount: string;
	status: string;
}

interface AssignFormValues {
	picker_name: string;
}

interface FilterFormValues {
	shipping_method: string;
	product: string;
	order_by_date_from: string;
	order_by_date_to: string;
	picker_name: string;
}

export interface CustomerDetails {
	id: string;
	first_name: string;
	last_name: string;
	mobile_no: string;
	email: string;
	gender: string | null;
	dob: string;
	is_active: number;
}

export interface Order {
	id: number;
	order_no: string;
	order_date: string | null;
	amount: string;
	redeem_credits: string;
	redeem_promo: string;
	redeem_gifts: string;
	box_charge: string;
	total_shipping_cost: string;
	tax_rate: string;
	tax_amount: string;
	total_amount: string;
	remark: string;
	is_active: number;
	customer_details: CustomerDetails;
}

export interface OrderPlanningData {
	id: number;
	order_code: string;
	no_of_items: number;
	total_price: string;
	estimated_delivery_date: string;
	order_status: string;
	remark: string | null;
	cancel_reason: string;
	order: Order;
}

export interface Link {
	url: string | null;
	label: string;
	active: boolean;
}

export interface OrderPlanningResponse {
	data: OrderPlanningData[];
	links: PaginationLinks;
	meta: PaginationMeta;
}

interface OrderPlanning {
	id: number;
	code: string;
	customerName: string;
	email: string;
	date: string;
	elapsedDays: number;
	orderValue: string;
	status: number;
}

interface FilterValues {
	start_date: string;
	end_date: string;
	code: string;
	first_name: string;
	last_name: string;
	picker: string;
	shipping_method: string;
}

interface ErrorResponse {
	response?: {
		data?: {
			message?: string;
		};
	};
}

function AssignPicker() {
	const { t } = useTranslation('backOrders');

	// Validation schema for the assignment form
	const assignSchema = yup.object().shape({
		// picker_name: yup.string().required(t('PICKER_NAME_REQUIRED'))
	});

	// Validation schema for the filtering form
	const filterSchema = yup.object().shape({
		shipping_method: yup.string().required(t('SHIPPING_METHOD_REQUIRED')),
		product: yup.string().required(t('PRODUCT_REQUIRED')),
		picker_name: yup.string()
	});

	// State management
	const [pageNo, setPageNo] = useState(0);
	const [pageSize, setPageSize] = useState(5);
	const [count, setCount] = useState(0);
	const [isFiltering, setIsFiltering] = useState(false);
	const [isTableLoading, setTableLoading] = useState(false);
	const [isOpenNewAdvertisement, setOpenNewAdvertisementModal] = useState(false);
	const [assignedRows] = useState<Record<string, TableRowData[]>>({});
	const [filteredData, setFilteredData] = useState<TableRowData[]>([]);
	const [pickers, setPickers] = useState<{ label: string; value: string }[]>([]);
	const [seletedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
	const [warehouseOrders, setWarehouseOrders] = useState<OrderPlanning[]>([]);
	const [seletedRow, setSelectedRow] = useState<OrderPlanning>(null);
	const [filteredValues, setFilteredValues] = useState<FilterValues>({
		start_date: null,
		end_date: null,
		code: null,
		first_name: null,
		last_name: null,
		picker: null,
		shipping_method: null
	});
	const debouncedFilter = useDebounce<any>(filteredValues, 1000);

	useEffect(() => {
		fetchPickersList();
	}, []);

	useEffect(() => {
		fetchOrders(filteredValues);
	}, [pageNo, pageSize]);

	useEffect(() => {
		if (debouncedFilter) fetchOrders(filteredValues);
	}, [debouncedFilter]);

	const fetchOrders = async (filteredValues: FilterValues) => {
		setTableLoading(true);
		try {
			const response: AxiosResponse<OrderPlanningResponse> = await axios.get(
				`${FETCH_WAREHOUSE_PLANINGS}?filter=order.customer.last_name,${filteredValues.last_name ? filteredValues.last_name : null}|order.customer.first_name,${filteredValues.first_name ? filteredValues.first_name : null}|order.customer.number,${filteredValues.code ? filteredValues.code : null}|start_date,${filteredValues.start_date ? filteredValues.start_date : null}|end_date,${filteredValues.end_date ? filteredValues.end_date : null}|picker.first_name,${filteredValues.picker ? filteredValues.picker : null}|pickupOption.option,null|shippingMethod.method,${filteredValues.shipping_method ? filteredValues.shipping_method : null}&limit=${pageSize}&page=${pageNo + 1}`
			);
			const data = response?.data?.data?.map((item: any) => ({
				id: item?.id,
				code: item?.order_code,
				customerName: item?.order?.customer_details?.first_name,
				email: item?.order.customer_details?.email,
				date: item?.created_at,
				orderValue: item?.total_price,
				elapsedDays: item?.elapsed_date,
				status: item?.order?.is_active,
				order_status: item?.order_status
			}));
			setWarehouseOrders(data);
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

	const fetchPickersList = async () => {
		try {
			const response: AxiosResponse<{
				success: boolean;
				data: { id: string; first_name: string; last_name: string }[];
			}> = await axios.get(FETCH_PICKER_LIST);
			const pickersList = response?.data?.data.map(
				(picker: { id: string; first_name: string; last_name: string }) => ({
					label: `${picker?.first_name} ${picker?.last_name}`,
					value: picker?.id
				})
			);
			setPickers(pickersList);
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

	// Toggle modal visibility
	const toggleNewAdvertisementModal = () => setOpenNewAdvertisementModal(!isOpenNewAdvertisement);

	// Pagination handlers
	const handlePageChange = (page: number) => {
		setPageNo(page);
	};

	const handlePageSizeChange = (newPageSize: number) => {
		setPageSize(newPageSize);
	};

	// Table row handlers
	const tableRowViewHandler = (rowData: OrderPlanning) => {
		setSelectedRow(rowData);
		toggleNewAdvertisementModal();
	};

	const handlePrintRow = async (rowData: OrderPlanning) => {
		try {
			const response: AxiosResponse<{ base64: string }> = await axios.get(
				`${FETCH_WAREHOUSE_PLANINGS}/${rowData.id}/print`
			);

			if (response.data) {
				openPdfInNewTab(response.data.base64);
			}
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

	const openPdfInNewTab = (pdfBase64) => {
		const byteCharacters = atob(pdfBase64);
		const byteNumbers = new Array(byteCharacters.length).fill(null).map((_, i) => byteCharacters.charCodeAt(i));
		const byteArray = new Uint8Array(byteNumbers);
		const blob = new Blob([byteArray], { type: 'application/pdf' });

		const pdfUrl = URL.createObjectURL(blob);
		window.open(pdfUrl, '_blank');
	};

	// Table columns definition
	const tableColumns = [
		{ title: t('ORDER_ID'), field: 'code' },
		{ title: t('First Name'), field: 'customerName' },
		{ title: t('EMAIL'), field: 'email' },
		{ title: t('Date & Time'), field: 'date' },
		{ title: t('Elapsed Days'), field: 'elapsedDays' },
		{
			title: t('ORDER_VALUE'),
			field: 'orderValue',
			render: (rowData: any) =>
				rowData?.orderValue
					? `$${Number(rowData?.orderValue).toLocaleString('en-US', {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2
						})}`
					: ''
		},
		{ title: t('STATUS'), field: 'order_status' }
	];

	const clearFilterHandler = () => {
		const resetFilters: FilterValues = {
			start_date: '',
			end_date: '',
			code: '',
			first_name: '',
			last_name: '',
			picker: '',
			shipping_method: ''
		};
		setFilteredValues(resetFilters);
		//   fetchOrderReviews(resetFilters);
	};

	const onSubmit = async (values, formikHelpers: FormikHelpers<any>) => {
		const { resetForm } = formikHelpers;
		try {
			await axios.post(CREATE_PICKER_ASSIGN_WAREHOUSE_ORDERS, {
				picker_id: values?.picker_name ?? null,
				order_id: seletedOrderIds
			});
			toast.success('Assigned successfully');
			resetForm();
			fetchOrders(filteredValues);
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

	return (
		<div className="min-w-full max-w-[100vw]">
			<NavigationViewComp title="Warehouse Order Management / Assign Picker" />

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
					<Typography className="formTypography">First Name</Typography>
					<TextField
						id="outlined-basic"
						label=""
						variant="outlined"
						size="small"
						className="w-full"
						value={filteredValues.first_name}
						onChange={(event) => {
							setFilteredValues({
								...filteredValues,
								first_name: event.target.value
							});
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
					<Typography className="formTypography">Picker First Name</Typography>
					<TextField
						id="outlined-basic"
						label=""
						variant="outlined"
						size="small"
						className="w-full"
						value={filteredValues.picker}
						onChange={(event) => {
							setFilteredValues({
								...filteredValues,
								picker: event.target.value
							});
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
					<Typography className="formTypography">Customer Code</Typography>
					<TextField
						id="outlined-basic"
						label=""
						variant="outlined"
						size="small"
						className="w-full"
						value={filteredValues.code}
						onChange={(event) => {
							setFilteredValues({
								...filteredValues,
								code: event.target.value
							});
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
					<Typography className="formTypography">Order From Date</Typography>
					<TextField
						type="date"
						id="outlined-basic"
						label=""
						variant="outlined"
						size="small"
						className="w-full"
						value={filteredValues.start_date}
						onChange={(event) => {
							setFilteredValues({
								...filteredValues,
								start_date: event.target.value
							});
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
					<Typography className="formTypography">Order To Date</Typography>
					<TextField
						type="date"
						id="outlined-basic"
						label=""
						variant="outlined"
						size="small"
						className="w-full"
						value={filteredValues.end_date}
						onChange={(event) => {
							setFilteredValues({
								...filteredValues,
								end_date: event.target.value
							});
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
					className="formikFormField !pt-[5px] sm:!pt-[26px]"
				>
					<Button
						className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] xl:text-[14px] text-gray-600 font-500 lg:!px-[2px] xl:!p-[16px] py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
						type="submit"
						variant="contained"
						size="medium"
						disabled={false}
						onClick={clearFilterHandler}
					>
						Clear Filters
					</Button>
				</Grid>

				<Grid
					item
					xs={12}
					sm={12}
					md={8}
					lg={6}
					xl={4}
					className="formikFormField pt-[5px!important]"
				>
					<Formik<AssignFormValues>
						initialValues={{ picker_name: '' }}
						validationSchema={assignSchema}
						enableReinitialize
						// onSubmit={(values, { resetForm }) => {
						// 	handleAssign(values.picker_name);
						// 	resetForm();
						// }}
						onSubmit={onSubmit}
					>
						{() => (
							<Form>
								<Grid
									container
									spacing={2}
									className="pt-[10px] !pr-[30px] mx-auto"
								>
									{/* Picker Dropdown */}
									<Grid
										item
										xs={12}
										sm={6}
										className="formikFormField pt-[5px!important] !pl-0"
									>
										<Typography className="formTypography">Picker Name :</Typography>
										<FormDropdown
											name="picker_name"
											id="picker_name"
											optionsValues={pickers}
										/>
										{/* {errors.picker_name && touched.picker_name && (
                      <Typography color='error' variant='caption'>
                        {errors.picker_name}
                      </Typography>
                    )} */}
									</Grid>
									<Grid
										item
										xs={12}
										sm={6}
										md={4}
										lg={3}
										xl={2}
										className="formikFormField !pl-0 sm:!pl-[16px] !pt-[5px] sm:pt-[26px!important]"
									>
										<Button
											className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] xl:text-[14px] text-white font-500 lg:!px-[2px] xl:!p-[16px] py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
											type="submit"
											variant="contained"
											size="medium"
											disabled={seletedOrderIds.length === 0}
										>
											Assign
										</Button>
									</Grid>

									{/* Assign Button */}
									{/* <Grid item xs={12} sm={6} md={6} className='formikFormField'>
                    <Button
                      className='flex justify-center items-center min-w-[80px] md:min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 mt-[21px] rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80'
                      type='submit'
                      variant='contained'
                      size='large'
                    >
                      Assign
                    </Button>
                  </Grid> */}
								</Grid>
							</Form>
						)}
					</Formik>
				</Grid>
			</Grid>

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
					className="pt-[5px!important]"
				>
					<MaterialTableWrapper
						title=""
						tableColumns={tableColumns}
						records={warehouseOrders}
						handlePageChange={handlePageChange}
						handlePageSizeChange={handlePageSizeChange}
						pageSize={pageSize}
						pageIndex={pageNo}
						loading={isTableLoading}
						count={count}
						disableSearch
						disableColumnFiltering
						selection
						onSelectionChange={(rows: any[]) => {
							setSelectedOrderIds(rows.map((row) => row.id));
						}}
						isColumnChoser
						tableRowViewHandler={tableRowViewHandler}
						tableRowPrintHandler={handlePrintRow}
					/>
				</Grid>
			</Grid>

			{/* Modal */}
			{isOpenNewAdvertisement && seletedRow.id && (
				<AssignPickerModel
					isOpen={isOpenNewAdvertisement}
					toggleModal={toggleNewAdvertisementModal}
					id={seletedRow.id}
				/>
			)}
		</div>
	);
}

export default AssignPicker;
