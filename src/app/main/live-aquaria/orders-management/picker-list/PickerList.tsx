import PrintIcon from '@mui/icons-material/Print';
import { Button, Grid, Typography } from '@mui/material';
import { Form, Formik, FormikProps } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import axios, { AxiosResponse } from 'axios';
import {
	FETCH_PICKER_LIST,
	FETCH_PICKER_LIST_BY_PICKER,
	PICKER_LIST_PRINTS
} from 'src/app/axios/services/AdminServices';
import { PaginationLinks, PaginationMeta } from 'src/app/types/paginateMetaData';
import { useAppSelector } from 'app/store/hooks';
import { selectUser } from 'src/app/auth/user/store/userSlice';
import { UserPermissions } from 'src/app/types/PermissionsInterfaces';
import ExtendedAxiosError from 'src/app/types/ExtendedAxiosError';
import { getAllCounties } from '../../../../axios/services/live-aquaria-services/customer-services/CustomerService';
import FormDropdown from '../../../../common/FormComponents/FormDropdown';
import NavigationViewComp from '../../../../common/FormComponents/NavigationViewComp';
import MaterialTableWrapper from '../../../../common/tableComponents/MaterialTableWrapper';
import {
	CountiesResponseTypes,
	CountiesTypes,
	dropDown
} from '../../customer/customer-profile/customer-types/CustomerTypes';
import InitialOrderReviewBill from './component/InitialOrderReviewBill';
import InitialOrderTabs from './component/PickerCustomTabPanel';

interface FormValues {
	picker_id: string;
}

export interface OrderPickerResponse {
	data: OrderPicker[];
	links: PaginationLinks;
	meta: PaginationMeta;
}

export interface OrderPicker {
	id: number;
	order_code: string;
	no_of_items: number | null;
	total_price: string;
	estimated_delivery_date: string;
	order_status: string;
	remark: string | null;
	cancel_reason: string | null;
	order: OrderDetails;
	picker: PickerDetails;
}

export interface OrderDetails {
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
	remark: string | null;
	is_active: number;
	customer_details: CustomerDetails;
}

export interface CustomerDetails {
	id: string;
	code: string;
	first_name: string;
	last_name: string;
	mobile_no: string;
	email: string;
	gender: string | null;
	dob: string | null;
	is_active: number;
}

export interface PickerDetails {
	id: string;
	title: string;
	first_name: string;
	last_name: string;
	user_name: string;
	email: string;
	mobile: string | null;
	nic: string;
	is_active: number;
	roles: Role[];
}

export interface Role {
	id: number;
	name: string;
	description: string | null;
	is_active: number;
}

interface ErrorResponse {
	response?: {
		data?: {
			message?: string;
		};
	};
}

function PickerList() {
	const { t } = useTranslation('pickerList');
	const [pageNo, setPageNo] = useState<number>(0);
	const [pageSize, setPageSize] = useState<number>(5);
	const [count, setCount] = useState(100);
	const [isOpenNewMethod, setOpenNewMethodModal] = useState(false);
	const [isPrintDialogOpen, setPrintDialogOpen] = useState(false);
	const [pickers, setPickers] = useState<{ label: string; value: string }[]>([]);
	const [, setCounties] = useState<dropDown[]>([]);
	const [clickedRowData, setClickedRowData] = useState<OrderPicker>(null);
	const [orders, setOrders] = useState<any>([]);
	const [isTableLoading, setTableLoading] = useState(false);
	const [pickerListId, setPickerListId] = useState<string>(null);
	const toggleNewAdvertisementModal = () => setOpenNewMethodModal(!isOpenNewMethod);

	const user = useAppSelector(selectUser);
	const PermissionMain: string = 'Order Management';
	const permissionSub = 'order-pickers';
	const userPermissions = (user.permissions as UserPermissions)?.[PermissionMain]?.[permissionSub] || null;
	const permissionsToShow = userPermissions?.find((permission) => permission.name === 'show') || null;
	// const permissionsToStore = userPermissions?.find((permission) => permission.name === 'store') || null;
	// const permissionsToUpdate = userPermissions?.find((permission) => permission.name === 'update') || null;
	// const permissionsToDelete = userPermissions?.find((permission) => permission.name === 'destroy') || null;
	const [seletedOrderIds, setSelectedOrderIds] = useState<string[]>([]);

	useEffect(() => {
		getCounties().then((r) => r);
		fetchPickersList();
	}, []);

	const fetchPickersList = async () => {
		try {
			const response: AxiosResponse<{
				success: boolean;
				data: { id: string; first_name: string; last_name: string }[];
			}> = await axios.get(FETCH_PICKER_LIST);
			const pickersList = response.data.data.map(
				(picker: { id: string; first_name: string; last_name: string }) => ({
					label: `${picker.first_name} ${picker.last_name}`,
					value: picker.id
				})
			);
			setPickers(pickersList);
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

			const modifiedData: dropDown[] = data1?.map((item: CountiesTypes) => ({
				value: item?.id,
				label: `${item?.code} - ${item?.name}`
			}));
			setCounties(modifiedData);
		} catch (error: unknown) {
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

	const togglePrintDialog = () => setPrintDialogOpen(!isPrintDialogOpen);

	const tableColumns = [
		{
			title: t('ORDER_ID'),
			field: 'code'
		},
		{
			title: t('CUSTOMER'),
			field: 'customer_name'
		},
		{
			title: t('EMAIL'),
			field: 'email'
		},
		{
			title: t('DATE'),
			field: 'date'
		},
		{
			title: t('EOD'),
			field: 'totalDays'
		},
		{
			title: t('ELAPSED'),
			field: 'elapsed',
			render: (rowData: any) => {
				return <span>{rowData?.order?.elapsed_date ?? ''}</span>;
			}
		},
		{
			title: t('ORDER_VALUE'),
			field: 'total_amount',
			render: (rowData: any) =>
				rowData?.total_amount
					? `$${Number(rowData?.total_amount).toLocaleString('en-US', {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2
						})}`
					: ''
		},
		{
			title: t('PICKER_NAME'),
			field: 'pickerName',
			render: (rowData: any) => {
				return <span>{rowData?.picker?.first_name ?? ''}</span>;
			}
		},
		{
			title: t('STATUS'),
			field: 'status',
			render: (rowData: any) => (
				<span className={rowData.status ? 'text-[#4DCD3C]' : 'text-[#FF0000]'}>
					{rowData.status ? t('ACTIVE') : t('INACTIVE')}
				</span>
			)
		}
	];

	const tableRowViewHandler = (rowData: OrderPicker) => {
		setClickedRowData(rowData);
		toggleNewAdvertisementModal();
	};

	const tableRowPrintHandler = (rowData: OrderPicker) => {
		setClickedRowData(rowData);
		togglePrintDialog();
	};

	const handlePageChange = (page: number) => {
		setPageNo(page);
	};

	const handlePageSizeChange = (pageSize: number) => {
		setPageSize(pageSize);
	};

	const fetchOrdersToPicker = async (pickerId: string) => {
		setTableLoading(true);
		try {
			const response: AxiosResponse<OrderPickerResponse> = await axios.get(
				`${FETCH_PICKER_LIST_BY_PICKER}?picker_id=${pickerId}`
			);

			const data = response?.data?.data?.map((item: OrderPicker) => ({
				...item,
				code: item?.order_code,
				totalDays: item?.estimated_delivery_date,
				customer_name: `${item?.order?.customer_details?.first_name} ${item?.order?.customer_details?.last_name}`,
				email: item?.order?.customer_details?.email,
				date: item?.order?.order_date,
				total_amount: item?.total_price,
				status: item?.order?.is_active
			}));
			setOrders(data);
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

	const handlePrintRow = async () => {
		const data = {
			order_shipment_id: seletedOrderIds ?? null
		};
		try {
			const response: AxiosResponse<{ base64: string }> = await axios.post(`${PICKER_LIST_PRINTS}`, data);
			if (response?.data && Array.isArray(response.data)) {
				response?.data?.forEach((item) => {
					openPdfInNewTab(item?.pdf_base64);
				});
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
			<NavigationViewComp title="Order Management / Picker List" />

			<Formik
				initialValues={{
					picker_id: ''
				}}
				onSubmit={() => null}
			>
				{({ setFieldValue }: FormikProps<FormValues>) => (
					<Form>
						<Grid
							container
							spacing={2}
							className="pr-[30px] mx-auto"
						>
							<Grid
								item
								xs={12}
								sm={6}
								md={4}
								lg={3}
								xl={2}
								className="formikFormField"
							>
								<Typography className="formTypography">{t('PICKER')}</Typography>
								<FormDropdown
									name="picker_id"
									id="picker_id"
									placeholder=""
									optionsValues={pickers}
									disabled={false}
									onChange={(value: any) => {
										setFieldValue('picker_id', value.target.value);
										setPickerListId(value?.target?.value);
										fetchOrdersToPicker(value.target.value);
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
								className="formikFormField sm:pt-[36px!important]"
							>
								<Button
									className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
									type="submit"
									variant="contained"
									size="medium"
									disabled={false}
									startIcon={<PrintIcon />}
									onClick={() => handlePrintRow()}
								>
									{t('PRINT_PICK_LIST')}
								</Button>
							</Grid>
						</Grid>
					</Form>
				)}
			</Formik>

			<Grid
				container
				spacing={2}
				className="pr-[30px] mx-auto"
			>
				<Grid
					item
					xs={12}
				>
					<MaterialTableWrapper
						title=""
						tableColumns={tableColumns}
						handlePageChange={handlePageChange}
						handlePageSizeChange={handlePageSizeChange}
						pageSize={pageSize}
						disableColumnFiltering
						pageIndex={pageNo}
						loading={isTableLoading}
						searchByText=""
						selection
						count={count}
						isColumnChoser
						records={orders}
						onSelectionChange={(rows: any[]) => {
							setSelectedOrderIds(rows.map((row) => row.id));
						}}
						tableRowViewHandler={permissionsToShow && permissionsToShow.action ? tableRowViewHandler : null}
						// tableRowPrintHandler={handlePrintRow}
					/>
				</Grid>
			</Grid>

			{isOpenNewMethod && clickedRowData.id && (
				<InitialOrderTabs
					isOpen={isOpenNewMethod}
					toggleModal={toggleNewAdvertisementModal}
					clickedRowData={clickedRowData}
					id={clickedRowData.id}
					fetchOrdersToPicker={fetchOrdersToPicker}
					pickerListId={pickerListId}
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

export default PickerList;
