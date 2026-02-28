import { Button, Grid, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import axios, { AxiosResponse } from 'axios';
import { FETCH_ORDER_REVIEWS } from 'src/app/axios/services/AdminServices';
import useDebounce from 'app/shared-components/useDebounce';
import moment from 'moment';
import ExtendedAxiosError from 'src/app/types/ExtendedAxiosError';
import { UserPermissions } from 'src/app/types/PermissionsInterfaces';
import { useAppSelector } from 'app/store/hooks';
import { selectUser } from 'src/app/auth/user/store/userSlice';
import { getAllCounties } from '../../../../axios/services/live-aquaria-services/customer-services/CustomerService';
import NavigationViewComp from '../../../../common/FormComponents/NavigationViewComp';
import MaterialTableWrapper from '../../../../common/tableComponents/MaterialTableWrapper';
import {
	CountiesResponseTypes,
	CountiesTypes,
	dropDown
} from '../../customer/customer-profile/customer-types/CustomerTypes';
import InitialOrderTabs from './component/CustomTabPanel';
import { OrderDetails, OrderResponseInterface, OrderReviewsInterface } from './interfaces';

interface FilterValues {
	start_date: string;
	end_date: string;
	code: string;
	first_name: string;
	last_name: string;
}

function InitialOrderReview() {
	const { t } = useTranslation('initialOrderReview');
	const [pageNo, setPageNo] = useState<number>(0);
	const [pageSize, setPageSize] = useState<number>(10);
	const [count, setCount] = useState<number>(0);
	const [isOpenNewMethod, setOpenNewMethodModal] = useState(false);
	const [ordersReviews, setOrdersReviews] = useState<OrderReviewsInterface[]>([]);
	const [, setCounties] = useState<dropDown[]>([]);
	const [clickedRowData, setClickedRowData] = useState<OrderReviewsInterface>(null);
	const [filteredValues, setFilteredValues] = useState<FilterValues>({
		start_date: null,
		end_date: null,
		code: null,
		first_name: null,
		last_name: null
	});
	const debouncedFilter = useDebounce<FilterValues>(filteredValues, 1000);

	const user = useAppSelector(selectUser);
	const PermissionMain: string = 'Order Management';
	const permissionSub = 'order-reviews';
	const userPermissions = (user.permissions as UserPermissions)?.[PermissionMain]?.[permissionSub] || null;
	const permissionsToShow = userPermissions?.find((permission) => permission.name === 'show') || null;
	// const permissionsToStore = userPermissions?.find((permission) => permission.name === 'store') || null;
	// const permissionsToUpdate = userPermissions?.find((permission) => permission.name === 'update') || null;
	// const permissionsToDelete = userPermissions?.find((permission) => permission.name === 'destroy') || null;

	const toggleNewAdvertisementModal = () => {
		setOpenNewMethodModal(!isOpenNewMethod);
		fetchOrderReviews(filteredValues);
	};

	useEffect(() => {
		getCounties().then((r) => r);
	}, []);

	useEffect(() => {
		fetchOrderReviews(filteredValues);
	}, [pageNo, pageSize]);

	useEffect(() => {
		if (debouncedFilter) fetchOrderReviews(filteredValues);
	}, [debouncedFilter]);

	const fetchOrderReviews = async (filteredValues: FilterValues) => {
		try {
			const response: AxiosResponse<OrderResponseInterface> = await axios.get(
				`${FETCH_ORDER_REVIEWS}?filter=customer.last_name,${filteredValues.last_name ? filteredValues.last_name : null}|customer.first_name,${filteredValues.first_name ? filteredValues.first_name : null}|customer.number,${filteredValues.code ? filteredValues.code : null}|start_date,${filteredValues.start_date ? filteredValues.start_date : null}|end_date,${filteredValues.end_date ? filteredValues.end_date : null}&limit=${pageSize}&page=${pageNo + 1}`
			);

			const data = response.data.data.map((item: OrderDetails) => ({
				id: item?.id,
				code: item?.order_no,
				customerName: item?.customer_details?.first_name,
				email: item?.customer_details?.email,
				date: item?.created_at,
				elapsedDays: item?.elapsed_date,
				totalAmount: item?.total_amount,
				status: item?.order_status?.name
			}));
			setOrdersReviews(data);
			setCount(response?.data?.meta?.total);
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

	const getCounties = async () => {
		try {
			const response: CountiesResponseTypes = await getAllCounties();
			const data1: CountiesTypes[] = response.data;

			const modifiedData: dropDown[] = data1.map((item: CountiesTypes) => ({
				value: item.id,
				label: `${item.code} - ${item.name}`
			}));
			setCounties(modifiedData);
		} catch (error: unknown) {
			toast('Error in fetching counties', { type: 'error' });
		}
	};

	const clearFilterHandler = () => {
		const resetFilters: FilterValues = {
			start_date: '',
			end_date: '',
			code: '',
			first_name: '',
			last_name: ''
		};
		setFilteredValues(resetFilters);
		//   fetchOrderReviews(resetFilters);
	};

	const tableColumns = [
		{
			title: 'Order ID',
			field: 'code'
		},
		{
			title: 'First Name',
			field: 'customerName'
		},
		{
			title: 'Email',
			field: 'email'
		},
		{
			title: 'Date',
			field: 'date',
			render: (rowData: OrderReviewsInterface) => <span>{moment(rowData.date).format('YYYY-MM-DD')}</span>
		},
		{
			title: t('ELAPSED_DAYS'),
			field: 'elapsedDays'
		},
		{
			title: t('TOTAL_AMOUNT'),
			field: 'totalAmount',
			align: 'right',
			render: (rowData: OrderReviewsInterface) =>
				rowData.totalAmount
					? `$${Number(rowData.totalAmount).toLocaleString('en-US', {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2
						})}`
					: ''
		},
		{
			title: t('STATUS'),
			field: 'status'
		}
	];

	const tableRowViewHandler = (rowData: OrderReviewsInterface) => {
		setClickedRowData(rowData);
		toggleNewAdvertisementModal();
	};

	const tableRowPrintHandler = async (rowData: OrderReviewsInterface) => {
		try {
			const response: AxiosResponse<{ base64: string }> = await axios.get(
				`${FETCH_ORDER_REVIEWS}/${rowData.id}/print`
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

	const handlePageChange = (page: number) => {
		setPageNo(page);
	};

	const handlePageSizeChange = (pageSize: number) => {
		setPageSize(pageSize);
	};

	return (
		<div className="min-w-full max-w-[100vw]">
			<NavigationViewComp title="Order Management / Initial Order Review" />

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
					<Typography className="formTypography">{t('Order From Date')}</Typography>
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
					<Typography className="formTypography">{t('Order To Date')}</Typography>
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
					lg={9}
					xl={2}
					container
					className="flex flex-wrap justify-start items-end gap-[10px] pt-[10px!important]"
				>
					<Button
						className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
						type="button"
						variant="contained"
						size="medium"
						disabled={false}
						onClick={clearFilterHandler}
					>
						{t('CLEAR_FILTERS')}
					</Button>
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
						handlePageChange={handlePageChange}
						handlePageSizeChange={handlePageSizeChange}
						pageSize={pageSize}
						disableColumnFiltering
						pageIndex={pageNo}
						searchByText=""
						count={count}
						disableSearch
						isColumnChoser
						records={ordersReviews}
						tableRowViewHandler={permissionsToShow && permissionsToShow.action ? tableRowViewHandler : null}
						tableRowPrintHandler={tableRowPrintHandler}
					/>
				</Grid>
			</Grid>

			{isOpenNewMethod && (
				<InitialOrderTabs
					isOpen={isOpenNewMethod}
					toggleModal={toggleNewAdvertisementModal}
					clickedRowData={clickedRowData}
					orderId={clickedRowData?.id}
				/>
			)}
		</div>
	);
}

export default InitialOrderReview;
