import { Button, Grid, TextField } from '@mui/material';
import Typography from '@mui/material/Typography';
import { Form, Formik } from 'formik';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import axios, { AxiosResponse } from 'axios';
import { CREATE_PLAN_FOR_TODAY, FETCH_ORDER_PLANINGS } from 'src/app/axios/services/AdminServices';
import { PaginationLinks, PaginationMeta } from 'src/app/types/paginateMetaData';
import { toast } from 'react-toastify';
import useDebounce from 'app/shared-components/useDebounce';
import { useAppSelector } from 'app/store/hooks';
import { selectUser } from 'src/app/auth/user/store/userSlice';
import { UserPermissions } from 'src/app/types/PermissionsInterfaces';
import NavigationViewComp from '../../../../../common/FormComponents/NavigationViewComp';
import MaterialTableWrapper from '../../../../../common/tableComponents/MaterialTableWrapper';
import OrderPlanningModel from './OrderPlanningModel';

interface OrderPlanningResponse {
	data: OrderPlanning[];
	links: PaginationLinks;
	meta: PaginationMeta;
}

interface OrderPlanning {
	id: number;
	order_code: string;
	no_of_items: number | null;
	total_price: string;
	estimated_delivery_date: string;
	order_status: string | null;
	remark: string;
	cancel_reason: string;
	order: Order;
}

interface Order {
	id: number;
	order_no: string;
	order_date: string | null;
	amount: string;
	redeem_credits: string;
	redeem_promo: string;
	redeem_gifts: string;
	box_charge: string;
	total_shipping_cost: string;
	tax_rate: string | null;
	tax_amount: string;
	total_amount: string;
	remark: string | null;
	is_active: number;
	customer_details: CustomerDetails;
}

interface CustomerDetails {
	id: string;
	first_name: string;
	last_name: string;
	mobile_no: string;
	email: string;
	gender: string | null;
	dob: string;
	is_active: number;
}

interface Order {
	id: number;
	code: string;
	customerName: string;
	email: string;
	date: string;
	elapsedDays: number;
	orderValue: string;
	status: number;
	tableData?: {
		id: number;
	};
}

interface FilterValues {
	start_date: string;
	end_date: string;
	code: string;
	first_name: string;
	last_name: string;
	location: string;
}

interface ErrorResponse {
	response?: {
		data?: {
			message?: string;
		};
	};
}

function OrderPlanning() {
	const { t } = useTranslation('orderPlanning');

	const schema = yup.object().shape({});

	const [pageNo, setPageNo] = useState<number>(0);
	const [pageSize, setPageSize] = useState<number>(5);
	const [count, setCount] = useState(0);
	const [isTableLoading] = useState(false);
	const [selectedRows, setSelectedRows] = useState([]);
	const [isOpenNewAdvertisement, setOpenNewAdvertisementModal] = useState(false);
	const [orders, setOrders] = useState<any>([]);
	const [selectedRowData, setSelectedRowData] = useState<Order | null>(null);
	const [filteredValues, setFilteredValues] = useState<FilterValues>({
		start_date: null,
		end_date: null,
		code: null,
		first_name: null,
		last_name: null,
		location: null
	});
	const debouncedFilter = useDebounce<FilterValues>(filteredValues, 1000);

	const user = useAppSelector(selectUser);
	const PermissionMain: string = 'Order Management';
	const permissionSub = 'order-planing';
	const userPermissions = (user.permissions as UserPermissions)?.[PermissionMain]?.[permissionSub] || null;
	const permissionsToShow = userPermissions?.find((permission) => permission.name === 'show') || null;
	// const permissionsToStore = userPermissions?.find((permission) => permission.name === 'store') || null;
	// const permissionsToUpdate = userPermissions?.find((permission) => permission.name === 'update') || null;
	// const permissionsToDelete = userPermissions?.find((permission) => permission.name === 'destroy') || null;

	useEffect(() => {
		fetchOrderPlanings(filteredValues);
	}, []);

	useEffect(() => {
		if (debouncedFilter) fetchOrderPlanings(filteredValues);
	}, [debouncedFilter]);

	const fetchOrderPlanings = async (filteredValues: FilterValues) => {
		try {
			const response: AxiosResponse<OrderPlanningResponse> = await axios.get(
				`${FETCH_ORDER_PLANINGS}?filter=order.customer.last_name,${filteredValues.last_name ? filteredValues.last_name : null}|order.customer.first_name,${filteredValues.first_name ? filteredValues.first_name : null}|customer.number,${filteredValues.code ? filteredValues.code : null}|start_date,${filteredValues.start_date ? filteredValues.start_date : null}|end_date,${filteredValues.end_date ? filteredValues.end_date : null}&limit=${pageSize}&page=${pageNo + 1}`
			);
			const data = response.data.data.map((item: any) => ({
				id: item?.id,
				code: item?.order_code,
				customerName: item?.order?.customer_details?.first_name,
				email: item?.order?.customer_details?.email,
				date: item?.created_at,
				elapsedDays: item?.elapsed_date,
				orderValue: item?.total_price,
				status: item?.order?.is_active,
				order_status: item?.order_status
			}));
			setOrders(data);
			setCount(response?.data?.meta?.total);
		} catch (error) {
			// errors managememnt
		}
	};

	const toggleNewAdvertisementModal = () => {
		setOpenNewAdvertisementModal(!isOpenNewAdvertisement);
		fetchOrderPlanings(filteredValues);
	};

	const handlePageChange = (page: number) => {
		setPageNo(page);
	};

	const handlePageSizeChange = (pageSize: number) => {
		setPageSize(pageSize);
	};

	const tableRowViewHandler = (rowData: Order) => {
		setSelectedRowData(rowData);
		toggleNewAdvertisementModal();
	};

	const handleFilterAll = (values) => {
		console.log('Filter All Values:', values);
	};

	const tableColumns = [
		{
			title: t('ORDER_ID'),
			field: 'code'
		},
		{
			title: t('First Name'),
			field: 'customerName'
		},
		{
			title: t('EMAIL'),
			field: 'email'
		},
		{
			title: t('Date & Time'),
			field: 'date'
		},
		{
			title: t('Elapsed Days'),
			field: 'elapsedDays'
		},
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
		{
			title: t('STATUS'),
			field: 'order_status'
		}
	];

	const onSelectRowHandler = (rows: any) => {
		const selectedRows = rows.length > 0 && rows.map((row) => row.id);
		setSelectedRows(selectedRows);
	};

	const planForTodayHandler = async () => {
		if (selectedRows.length > 0) {
			try {
				await axios.post(CREATE_PLAN_FOR_TODAY, {
					order_id: selectedRows
				});
				toast.success('Plan created successfully');
				fetchOrderPlanings(filteredValues);
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
		} else {
			toast.info('Please select at least one row from the table');
		}
	};

	const clearFilterHandler = () => {
		const resetFilters: FilterValues = {
			start_date: '',
			end_date: '',
			code: '',
			first_name: '',
			last_name: '',
			location: ''
		};
		setFilteredValues(resetFilters);
		//   fetchOrderReviews(resetFilters);
	};

	const tableRowPrintHandler = async (rowData: any) => {
		try {
			const response: AxiosResponse<{ base64: string }> = await axios.get(
				`${FETCH_ORDER_PLANINGS}/${rowData.id}/print`
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

	return (
		<div className="min-w-full max-w-[100vw]">
			<NavigationViewComp title="Order Review / Order Planning" />

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
					sm={12}
					md={12}
					lg={6}
					xl={12}
					className="flex flex-wrap justify-between items-start gap-[10px] formikFormField !pt-[10px] lg:!pt-[26px] xl:!pt-[10px]"
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

					<Formik
						initialValues={{
							order_by_date_from: '',
							order_by_date_to: ''
						}}
						validationSchema={schema}
						onSubmit={handleFilterAll}
					>
						{() => (
							<Form>
								<Button
									className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] xl:text-[14px] text-white font-500 lg:!px-[2px] xl:!p-[16px] py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
									type="button"
									variant="contained"
									size="medium"
									disabled={false}
									onClick={planForTodayHandler}
								>
									{t('PLAN_FOR_TODAY')}
								</Button>
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
						filterChanged={null}
						handleColumnFilter={null}
						tableColumns={tableColumns}
						handlePageChange={handlePageChange}
						handlePageSizeChange={handlePageSizeChange}
						handleCommonSearchBar={null}
						pageSize={pageSize}
						disableColumnFiltering
						pageIndex={pageNo}
						setPageSize={setPageSize}
						searchByText=""
						loading={isTableLoading}
						count={count}
						exportToExcel={null}
						handleRowDeleteAction={null}
						externalAdd={null}
						externalEdit={null}
						externalView={null}
						selectionExport={null}
						records={orders}
						tableRowViewHandler={permissionsToShow && permissionsToShow.action ? tableRowViewHandler : null}
						selection
						onSelectionChange={onSelectRowHandler}
						tableRowPrintHandler={tableRowPrintHandler}
						isColumnChoser
					/>
				</Grid>
			</Grid>
			{isOpenNewAdvertisement && selectedRowData !== null && (
				<OrderPlanningModel
					isOpen={isOpenNewAdvertisement}
					toggleModal={toggleNewAdvertisementModal}
					orderId={selectedRowData.id}
				/>
			)}
		</div>
	);
}

export default OrderPlanning;
