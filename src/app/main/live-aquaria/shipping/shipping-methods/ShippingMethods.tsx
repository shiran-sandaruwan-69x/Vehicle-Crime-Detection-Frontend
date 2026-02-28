import { Button, Grid, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Form, Formik, FormikHelpers, FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { toast } from 'react-toastify';
import axios, { AxiosResponse } from 'axios';
import useDebounce from 'app/shared-components/useDebounce';
import MaterialTableWrapper from '../../../../common/tableComponents/MaterialTableWrapper';
import NavigationViewComp from '../../../../common/FormComponents/NavigationViewComp';
import NewMethodModal from './components/NewMethodModal';
import { CREATE_SHIPPING_METHOD } from '../../../../axios/services/live-aquaria-services/shipping-services/ShippingMethods';
import {
	ShippingFilteringType,
	ShippingMethodRes,
	ShippingMethodsModifiedData,
	ShippingMethodTypeRes
} from './types/ShippingMethodsType';

import ShippingMethodsDeleteAlertForm from './components/ShippingMethodsDeleteAlertForm';
import ShippingMethodsActiveComp from './components/ShippingMethodsActiveComp';
import CustomFormTextField from '../../../../common/FormComponents/CustomFormTextField';

interface ErrorResponse {
	response?: {
		data?: {
			message?: string;
		};
	};
}

function ShippingMethods() {
	const { t } = useTranslation('ShippingMethods');
	const [pageNo, setPageNo] = useState<number>(0);
	const [pageSize, setPageSize] = useState<number>(5);
	const [count, setCount] = useState<number>(100);
	const [isOpenNewMethod, setOpenNewMethodModal] = useState<boolean>(false);
	const [isOpenEditMethod, setOpenEditMethodModal] = useState<boolean>(false);
	const [isOpenViewMethod, setOpenViewMethodModal] = useState<boolean>(false);
	const [sampleData, setSampleData] = useState<ShippingMethodsModifiedData[]>([]);
	const toggleNewAdvertisementModal = () => setOpenNewMethodModal(!isOpenNewMethod);
	const toggleViewAdvertisementModal = () => setOpenViewMethodModal(!isOpenViewMethod);
	const toggleEditAdvertisementModal = () => setOpenEditMethodModal(!isOpenEditMethod);
	const [isTableLoading, setTableLoading] = useState(false);
	const [selectedActiveRowData, setSelectedActiveRowData] = useState<ShippingMethodsModifiedData>(null);
	const [selectedDeleteRowData, setSelectedDeleteRowData] = useState<ShippingMethodsModifiedData>(null);
	const [selectedViewRowData, setSelectedViewRowData] = useState<ShippingMethodsModifiedData>(null);
	const [selectedEditRowData, setSelectedEditRowData] = useState<ShippingMethodsModifiedData>(null);
	const [isOpenActiveModal, setOpenActiveModal] = useState(false);
	const [isOpenDeleteModal, setOpenDeleteModal] = useState(false);
	const toggleActiveModal = () => setOpenActiveModal(!isOpenActiveModal);
	const toggleDeleteModal = () => setOpenDeleteModal(!isOpenDeleteModal);
	const [filteredValues, setFilteredValues] = useState<ShippingFilteringType>({
		serviceProvider: null,
		shipType: null,
		status: null,
		transitDays: null
	});
	const debouncedFilter = useDebounce<ShippingFilteringType>(filteredValues, 1000);

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

	const handleFilterAll = (values: ShippingFilteringType) => {};

	const tableColumns = [
		{
			title: t('METHOD_NAME'),
			field: 'methodName',
			cellStyle: {
				padding: '4px 8px'
			}
		},
		{
			title: t('AMOUNT'),
			field: 'amount',
			cellStyle: {
				padding: '4px 8px'
			},
			render: (rowData: ShippingMethodsModifiedData) =>
				rowData?.amount
					? Number(rowData?.amount).toLocaleString('en-US', {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2
						})
					: ''
		},
		{
			title: t('Delivery Schedule'),
			field: 'deliverySchedule',
			cellStyle: {
				padding: '4px 8px'
			}
		},
		{
			title: t('TRANSIT_DAYS'),
			field: 'transit_days',
			cellStyle: {
				padding: '4px 8px'
			}
		},
		{
			title: t('Service Provider'),
			field: 'service_provider',
			cellStyle: {
				padding: '4px 8px'
			}
		},
		{
			title: t('Created Date'),
			field: 'create_date',
			cellStyle: {
				padding: '4px 8px'
			}
		},
		{
			title: t('ACTIVE'),
			field: 'active',
			cellStyle: {
				padding: '4px 8px'
			},
			render: (rowData: ShippingMethodsModifiedData) => (
				<FormGroup>
					<FormControlLabel
						control={
							<Switch
								checked={rowData.active}
								onClick={() => handleSwitchClick(rowData)}
								aria-label="active switch"
								size="small"
								sx={{
									'& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
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

	const fetchAllShippingMethods = async () => {
		setTableLoading(true);
		try {
			const response: AxiosResponse<ShippingMethodTypeRes> = await axios.get(
				`${CREATE_SHIPPING_METHOD}?limit=${pageSize}&page=${pageNo}`
			);

			const transformedData: ShippingMethodsModifiedData[] = response?.data?.data?.map(
				(item: ShippingMethodRes) => ({
					...item,
					methodName: item?.method,
					amount: item?.amount,
					deliverySchedule: item?.shipping_schedule?.title,
					transit_days: item?.transit_days,
					service_provider: item?.service_provider,
					create_date: item?.created_at?.slice(0, 10),
					active: item?.is_active === 1
				})
			);

			setSampleData(transformedData);
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

	const changePageNoOrPageSize = async (filteredValues: ShippingFilteringType) => {
		setTableLoading(true);
		try {
			const response: AxiosResponse<ShippingMethodTypeRes> = await axios.get(
				`${CREATE_SHIPPING_METHOD}?filter=method,${filteredValues.shipType}|service_provider,${filteredValues.serviceProvider}|is_active,${filteredValues.status}|transit_days,${filteredValues.transitDays}&limit=${pageSize}&page=${pageNo}`
			);

			const transformedData: ShippingMethodsModifiedData[] = response?.data?.data?.map(
				(item: ShippingMethodRes) => ({
					...item,
					methodName: item?.method,
					amount: item?.amount,
					deliverySchedule: item?.shipping_schedule?.title,
					transit_days: item?.transit_days,
					service_provider: item?.service_provider,
					create_date: item?.created_at?.slice(0, 10),
					active: item?.is_active === 1
				})
			);

			setSampleData(transformedData);
			setCount(response.data.meta.total);
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

	const handleOpenNewMethodModal = () => {
		toggleNewAdvertisementModal();
	};

	const handleSwitchClick = (rowData: ShippingMethodsModifiedData) => {
		setSelectedActiveRowData(rowData);
		toggleActiveModal();
	};

	const handleConfirmStatusChange = async () => {
		toggleActiveModal();
		const id = selectedActiveRowData?.id ?? null;
		try {
			const data = {
				is_active: selectedActiveRowData?.active === true ? 0 : 1
			};
			await axios.put(`${CREATE_SHIPPING_METHOD}/${id}`, data);
			fetchAllShippingMethods();

			if (data.is_active === 0) {
				toast.success('Inactivated Successfully');
			} else {
				toast.success('Activated Successfully');
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

	const tableRowViewHandler = (rowData: ShippingMethodsModifiedData) => {
		setSelectedViewRowData(rowData);
		toggleViewAdvertisementModal();
	};

	const tableRowEditHandler = (rowData: ShippingMethodsModifiedData) => {
		setSelectedEditRowData(rowData);
		toggleEditAdvertisementModal();
	};

	const handleRowDelete = async (rowData: ShippingMethodsModifiedData) => {
		setSelectedDeleteRowData(rowData);
		toggleDeleteModal();
	};

	const handleAlertForm = async () => {
		toggleDeleteModal();
		const id = selectedDeleteRowData?.id ?? null;
		try {
			await axios.delete(`${CREATE_SHIPPING_METHOD}/${id}`);
			fetchAllShippingMethods();
			toast.success('Deleted successfully');
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

	const changeServiceProvider = async (value: string, form: FormikProps<ShippingFilteringType>) => {
		form.setFieldValue('serviceProvider', value);
		setFilteredValues({
			...filteredValues,
			serviceProvider: value.length === 0 ? null : value
		});
	};

	const changeShipType = async (value: string, form: FormikProps<ShippingFilteringType>) => {
		form.setFieldValue('shipType', value);
		setFilteredValues({
			...filteredValues,
			shipType: value.length === 0 ? null : value
		});
	};

	const changeTransitDays = async (value: string, form: FormikProps<ShippingFilteringType>) => {
		form.setFieldValue('transitDays', value);
		setFilteredValues({
			...filteredValues,
			transitDays: value.length === 0 ? null : value
		});
	};

	const handleClearForm = (resetForm: FormikHelpers<ShippingFilteringType>['resetForm']) => {
		resetForm();
		setFilteredValues({
			serviceProvider: null,
			shipType: null,
			status: null,
			transitDays: null
		});
	};

	return (
		<div className="min-w-full max-w-[100vw]">
			<NavigationViewComp title="Shipping / Shipping Methods" />

			<Formik
				initialValues={{
					serviceProvider: '',
					shipType: '',
					transitDays: ''
				}}
				validationSchema={null}
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
								className="pt-[5px!important]"
							>
								<Typography className="formTypography">{t('Method Name')}</Typography>
								<CustomFormTextField
									name="shipType"
									id="shipType"
									type="text"
									placeholder=""
									disabled={false}
									changeInput={changeShipType}
								/>
							</Grid>

							<Grid
								item
								xs={12}
								sm={6}
								md={4}
								lg={3}
								xl={2}
								className="pt-[5px!important]"
							>
								<Typography className="formTypography">{t('TRANSIT_DAYS')}</Typography>
								<CustomFormTextField
									name="transitDays"
									id="transitDays"
									type="text"
									placeholder=""
									disabled={false}
									changeInput={changeTransitDays}
								/>
							</Grid>

							<Grid
								item
								xs={12}
								sm={6}
								md={4}
								lg={3}
								xl={2}
								className="pt-[5px!important]"
							>
								<Typography className="formTypography">{t('SERVICE_PROVIDER')}</Typography>
								<CustomFormTextField
									name="serviceProvider"
									id="serviceProvider"
									type="text"
									placeholder=""
									disabled={false}
									changeInput={changeServiceProvider}
								/>
							</Grid>

							<Grid
								item
								xs={12}
								sm={12}
								md={8}
								lg={12}
								xl={6}
								className="flex justify-between items-center gap-[10px] formikFormField pt-[26px!important]"
							>
								<Button
									className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
									type="submit"
									variant="contained"
									size="medium"
									disabled={false}
									onClick={() => handleClearForm(resetForm)}
								>
									{t('Clear Filters')}
								</Button>
								<Button
									className="min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
									type="button"
									variant="contained"
									size="medium"
									disabled={false}
									onClick={handleOpenNewMethodModal}
								>
									{t('NEW_METHOD')}
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
						loading={isTableLoading}
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
						count={count}
						exportToExcel={null}
						handleRowDeleteAction={null}
						externalAdd={null}
						externalEdit={null}
						externalView={null}
						selection={false}
						selectionExport={null}
						disableSearch
						isColumnChoser
						records={sampleData}
						tableRowViewHandler={tableRowViewHandler}
						tableRowEditHandler={tableRowEditHandler}
						tableRowDeleteHandler={handleRowDelete}
					/>
				</Grid>
			</Grid>
			{isOpenNewMethod && (
				<NewMethodModal
					isOpen={isOpenNewMethod}
					toggleModal={toggleNewAdvertisementModal}
					clickedRowData={{}}
					fetchAllShippingMethods={fetchAllShippingMethods}
					isMode=""
				/>
			)}
			{isOpenViewMethod && (
				<NewMethodModal
					isOpen={isOpenViewMethod}
					toggleModal={toggleViewAdvertisementModal}
					clickedRowData={selectedViewRowData}
					fetchAllShippingMethods={fetchAllShippingMethods}
					isMode="view"
				/>
			)}
			{isOpenEditMethod && (
				<NewMethodModal
					isOpen={isOpenEditMethod}
					toggleModal={toggleEditAdvertisementModal}
					clickedRowData={selectedEditRowData}
					fetchAllShippingMethods={fetchAllShippingMethods}
					isMode="edit"
				/>
			)}

			{isOpenActiveModal && (
				<ShippingMethodsActiveComp
					toggleModal={toggleActiveModal}
					isOpen={isOpenActiveModal}
					clickedRowData={selectedActiveRowData}
					handleAlertForm={handleConfirmStatusChange}
				/>
			)}

			{isOpenDeleteModal && (
				<ShippingMethodsDeleteAlertForm
					toggleModal={toggleDeleteModal}
					isOpen={isOpenDeleteModal}
					clickedRowData={selectedDeleteRowData}
					handleAlertForm={handleAlertForm}
				/>
			)}
		</div>
	);
}

export default ShippingMethods;
