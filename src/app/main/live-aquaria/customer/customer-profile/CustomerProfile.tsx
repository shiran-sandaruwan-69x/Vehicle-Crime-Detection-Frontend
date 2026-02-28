import { Autocomplete, Button, Grid, TextField } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import { Form, Formik, FormikHelpers, FormikProps } from 'formik';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import useDebounce from 'app/shared-components/useDebounce';
import {
	deleteCustomers,
	getAllAdvanceFilteringCustomerDataWithPagination,
	getAllCounties,
	getAllCustomers,
	updateCustomers
} from '../../../../axios/services/live-aquaria-services/customer-services/CustomerService';
import NavigationViewComp from '../../../../common/FormComponents/NavigationViewComp';
import MaterialTableWrapper from '../../../../common/tableComponents/MaterialTableWrapper';
import CustomerDeleteAlertForm from './componets/CustomerDeleteAlertForm';
import CustomerDialogForm from './componets/CustomerDialogForm';
import NewCustomerDialogForm from './componets/NewCustomerDialogForm';
import {
	AdvanceFilteringTypes,
	CountiesResponseTypes,
	CountiesTypes,
	CustomerResponse,
	CustomersApiResponse,
	dropDown,
	TableRowData
} from './customer-types/CustomerTypes';
import CustomFormTextField from '../../../../common/FormComponents/CustomFormTextField';
import CustomerActiveAlertForm from './componets/CustomerActiveAlertForm';

interface ErrorResponse {
	response?: {
		data?: {
			message?: string;
		};
	};
}

function CustomerProfile() {
	const { t } = useTranslation('customerProfile');
	const [pageNo, setPageNo] = useState<number>(0);
	const [pageSize, setPageSize] = useState<number>(5);
	const [count, setCount] = useState(100);
	const [isOpenCustomerProfileModal, setOpenCustomerProfileModal] = useState(false);
	const [isOpenNewCustomerModal, setOpenNewCustomerModal] = useState(false);
	const toggleCustomerProfileModal = () => setOpenCustomerProfileModal(!isOpenCustomerProfileModal);
	const toggleNewCustomerModal = () => setOpenNewCustomerModal(!isOpenNewCustomerModal);
	const [clickedRowData, setClickedRowData] = useState<TableRowData>();
	const [isOpenCustomerDeleteModal, setIsOpenCustomerDeleteModal] = useState(false);
	const [isOpenCustomerActiveModal, setIsOpenCustomerActiveModal] = useState(false);
	const toggleCustomerDeleteAlertModal = () => setIsOpenCustomerDeleteModal(!isOpenCustomerDeleteModal);
	const toggleCustomerActiveModal = () => setIsOpenCustomerActiveModal(!isOpenCustomerActiveModal);

	const [deleteCustomerId, setDeleteCustomerId] = useState('');
	const [isCustomerActiveData, setCustomerActiveData] = useState<TableRowData>({});
	const [isTableLoading, setTableLoading] = useState(false);
	const [isCounties, setCounties] = useState([]);
	const [tableData, setTableData] = useState([]);

	const [filteredValues, setFilteredValues] = useState<AdvanceFilteringTypes>({
		code: null,
		customerName: null,
		mobile: null,
		email: null,
		city: null,
		state: null,
		country: null
	});

	const debouncedFilter = useDebounce<AdvanceFilteringTypes>(filteredValues, 1000);

	const tableColumns = [
		{
			title: t('CUSTOMER_CODE'),
			field: 'customerId'
		},
		{
			title: t('CUSTOMER_NAME'),
			field: 'customerName'
		},
		{
			title: t('MOBILE'),
			field: 'mobile'
		},
		{
			title: t('EMAIL'),
			field: 'email'
		},
		{
			title: t('Aquatic Type'),
			field: 'aquaticType'
		},
		{
			title: t('CREDIT_POINTS'),
			field: 'creditPoints'
		},
		{
			title: t('ACTIVE'),
			field: 'active',
			render: (rowData: TableRowData, index: number) => (
				<FormGroup>
					<FormControlLabel
						control={
							<Switch
								checked={rowData.active}
								onChange={handleSwitchChange(rowData)}
								aria-label="login switch"
								size="small"
								sx={{
									'& .muiltr-kpgjex-MuiButtonBase-root-MuiSwitch-switchBase.Mui-checked+.MuiSwitch-track':
										{
											backgroundColor: '#387ed4'
										}
								}}
							/>
						}
						label=""
					/>
				</FormGroup>
			)
		}
	];

	const schema = yup.object().shape({});

	useEffect(() => {
		getCounties();
	}, []);

	useEffect(() => {
		if (debouncedFilter) changePageNoOrPageSize(filteredValues);
	}, [debouncedFilter]);

	useEffect(() => {
		changePageNoOrPageSize(filteredValues);
	}, [pageNo, pageSize]);

	const handlePageChange = (page: number) => {
		setPageNo(page);
	};

	const handlePageSizeChange = (pageSize: number) => {
		setPageSize(pageSize);
	};

	const tableRowViewHandler = (rowData: TableRowData) => {
		setClickedRowData(rowData);
		toggleCustomerProfileModal();
	};
	const handleSwitchChange = (rowData: TableRowData) => (event) => {
		setCustomerActiveData(rowData);
		toggleCustomerActiveModal();
	};

	const getCounties = async () => {
		try {
			const response: CountiesResponseTypes = await getAllCounties();
			const data1: CountiesTypes[] = response.data;

			const modifiedData: dropDown[] = data1.map((item: CountiesTypes) => ({
				value: item.code,
				label: `${item.code} - ${item.name}`
			}));
			setCounties(modifiedData);
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

	const fetchAllCustomers = async (): Promise<void> => {
		setTableLoading(true);
		try {
			const response: CustomersApiResponse = await getAllCustomers(pageNo, pageSize);
			setCount(response.meta.total);

			const modifiedData: TableRowData[] = response.data.map((item: CustomerResponse, index: number) => ({
				...item,
				customerId: item.code,
				customerName: `${item.first_name} ${item.last_name}`,
				mobile: item.mobile_no,
				email: item.email,
				creditPoints: item?.total_remaining_points,
				active: item.is_active === 1,
				tableData: { id: index }
			}));

			setTableData(modifiedData);
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

	const onSubmit = async (values: AdvanceFilteringTypes) => {};

	const handleClearForm = (resetForm: FormikHelpers<AdvanceFilteringTypes>['resetForm']) => {
		resetForm();
		setFilteredValues({
			code: null,
			customerName: null,
			mobile: null,
			email: null,
			city: null,
			state: null,
			country: null
		});
	};

	const handleOpenNewCustomerModal = () => {
		toggleNewCustomerModal();
	};

	const handleSubmitCustomerDeleteForm = (values: TableRowData) => {
		setDeleteCustomerId(values.id);
		setIsOpenCustomerDeleteModal(true);
	};

	const handleAlertForm = async () => {
		const customerId: string = deleteCustomerId || null;
		try {
			await deleteCustomers(customerId);
			toast.success('Deleted Successfully');
			setIsOpenCustomerDeleteModal(false);
			fetchAllCustomers();
		} catch (error) {
			setIsOpenCustomerDeleteModal(false);
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

	const handleActiveAlertForm = async () => {
		const customerId: string = isCustomerActiveData.id || null;
		toggleCustomerActiveModal();
		const requestData = {
			is_active: isCustomerActiveData.active === true ? 0 : 1
		};

		try {
			await updateCustomers(customerId, requestData);
			fetchAllCustomers();

			if (requestData.is_active === 1) {
				toast.success('Activated Successfully');
			} else {
				toast.success('Inactivated Successfully');
			}
		} catch (error: any) {
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

	const changePageNoOrPageSize = async (filteredValues: AdvanceFilteringTypes) => {
		setTableLoading(true);
		const testMobile = `${filteredValues.mobile}`.replace(/^\+/, '');
		try {
			const response: CustomersApiResponse = await getAllAdvanceFilteringCustomerDataWithPagination(
				filteredValues.customerName,
				null,
				testMobile,
				filteredValues.email,
				filteredValues.code,
				filteredValues.country,
				filteredValues.state,
				filteredValues.city,
				pageNo,
				pageSize
			);
			setCount(response.meta.total);

			const modifiedData: TableRowData[] = response.data.map((item: CustomerResponse, index: number) => ({
				...item,
				customerId: item.code,
				customerName: `${item.first_name} ${item.last_name}`,
				mobile: item.mobile_no,
				email: item.email,
				creditPoints: item?.total_remaining_points,
				active: item.is_active === 1,
				tableData: { id: index }
			}));

			setTableData(modifiedData);
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

	const changeCode = async (value: string, form: FormikProps<AdvanceFilteringTypes>) => {
		form.setFieldValue('code', value);
		setFilteredValues({
			...filteredValues,
			code: value
		});
	};

	const changeCustomerName = async (value: string, form: FormikProps<AdvanceFilteringTypes>) => {
		form.setFieldValue('customerName', value);
		setFilteredValues({
			...filteredValues,
			customerName: value
		});
	};

	const changeMobile = async (value: string, form: FormikProps<AdvanceFilteringTypes>) => {
		form.setFieldValue('mobile', value);
		setFilteredValues({
			...filteredValues,
			mobile: value
		});
	};

	const changeEmail = async (value: string, form: FormikProps<AdvanceFilteringTypes>) => {
		form.setFieldValue('email', value);
		setFilteredValues({
			...filteredValues,
			email: value
		});
	};

	const changeCountry = async (value: string) => {
		if (value === undefined) value = null;

		setTableLoading(true);
		setFilteredValues({
			...filteredValues,
			country: value
		});
	};

	const changeState = async (value: string, form: FormikProps<AdvanceFilteringTypes>) => {
		form.setFieldValue('state', value);
		setFilteredValues({
			...filteredValues,
			state: value
		});
	};

	const changeCity = async (value: string, form: FormikProps<AdvanceFilteringTypes>) => {
		form.setFieldValue('city', value);
		setFilteredValues({
			...filteredValues,
			city: value
		});
	};

	return (
		<div className="min-w-full max-w-[100vw]">
			<NavigationViewComp title="Customer" />

			<Formik
				initialValues={{
					code: '',
					customerName: '',
					mobile: '',
					email: '',
					city: '',
					state: '',
					country: ''
				}}
				validationSchema={schema}
				onSubmit={onSubmit}
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
								<Typography className="formTypography">{t('CUSTOMER_CODE')}</Typography>
								<CustomFormTextField
									name="code"
									id="code"
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
								xl={2}
								className="formikFormField pt-[5px!important]"
							>
								<Typography className="formTypography">{t('CUSTOMER_NAME')}</Typography>
								<CustomFormTextField
									name="customerName"
									id="customerName"
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
								<Typography className="formTypography">{t('MOBILE')}</Typography>
								<CustomFormTextField
									name="mobile"
									id="mobile"
									type="text"
									placeholder=""
									disabled={false}
									changeInput={changeMobile}
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
								<Typography className="formTypography">{t('EMAIL')}</Typography>
								<CustomFormTextField
									name="email"
									id="email"
									type="text"
									placeholder=""
									disabled={false}
									changeInput={changeEmail}
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
								<Typography className="formTypography">{t('COUNTRY')}</Typography>
								<Autocomplete
									size="small"
									disablePortal
									options={isCounties}
									className="w-full"
									value={values.country || null}
									renderInput={(params) => (
										<TextField
											{...params}
											name="country"
											label=""
										/>
									)}
									onChange={(
										event: React.ChangeEvent<HTMLInputElement>,
										value: { label: string; value: string } | null
									) => {
										setFieldValue('country', value?.label || null);
										changeCountry(value?.value || null);
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
								<Typography className="formTypography">{t('CITY')}</Typography>
								<CustomFormTextField
									name="city"
									id="city"
									type="text"
									placeholder=""
									disabled={false}
									changeInput={changeCity}
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
								<Typography className="formTypography">{t('STATE')}</Typography>
								<CustomFormTextField
									name="state"
									id="state"
									type="text"
									placeholder=""
									disabled={false}
									changeInput={changeState}
								/>
							</Grid>

							<Grid
								item
								xs={12}
								sm={6}
								md={8}
								lg={3}
								xl={10}
								className="flex justify-between items-start gap-[5px] formikFormField !pt-[10px] sm:pt-[26px!important]"
							>
								<Button
									className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] xl:text-[14px] text-gray-600 font-500 md:px-[5px] xl:px-[16px] py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
									type="button"
									variant="contained"
									size="medium"
									disabled={false}
									onClick={() => handleClearForm(resetForm)}
								>
									{t('Clear Filters')}
								</Button>

								<Button
									className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] xl:text-[14px] text-white font-500 md:px-[5px] xl:px-[16px] py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
									type="button"
									variant="contained"
									size="medium"
									disabled={false}
									onClick={handleOpenNewCustomerModal}
								>
									{t('NEW_CUSTOMER')}
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
						selection={false}
						selectionExport={null}
						isColumnChoser
						records={tableData}
						tableRowViewHandler={tableRowViewHandler}
						tableRowDeleteHandler={handleSubmitCustomerDeleteForm}
						disableSearch
					/>
				</Grid>
			</Grid>

			{isOpenCustomerProfileModal && (
				<CustomerDialogForm
					isOpen={isOpenCustomerProfileModal}
					toggleModal={toggleCustomerProfileModal}
					clickedRowData={clickedRowData}
					fetchAllCustomers={fetchAllCustomers}
				/>
			)}

			{isOpenNewCustomerModal && (
				<NewCustomerDialogForm
					isOpen={isOpenNewCustomerModal}
					toggleModal={toggleNewCustomerModal}
					fetchAllCustomers={fetchAllCustomers}
					clickedRowData={[]}
				/>
			)}

			{isOpenCustomerDeleteModal && (
				<CustomerDeleteAlertForm
					isOpen={isOpenCustomerDeleteModal}
					toggleModal={toggleCustomerDeleteAlertModal}
					clickedRowData={deleteCustomerId}
					handleAlertForm={handleAlertForm}
				/>
			)}

			{isOpenCustomerActiveModal && (
				<CustomerActiveAlertForm
					isOpen={isOpenCustomerActiveModal}
					toggleModal={toggleCustomerActiveModal}
					clickedRowData={isCustomerActiveData}
					handleAlertForm={handleActiveAlertForm}
				/>
			)}
		</div>
	);
}

export default CustomerProfile;
