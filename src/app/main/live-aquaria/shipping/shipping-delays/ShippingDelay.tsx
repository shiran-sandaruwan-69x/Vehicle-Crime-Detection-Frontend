import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';
import { Button, Chip, Grid, Typography } from '@mui/material';
import { Form, Formik, FormikHelpers, FormikProps } from 'formik';
import useDebounce from 'app/shared-components/useDebounce';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import axios, { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import DescriptionIcon from '@mui/icons-material/Description';
import Tooltip from '@mui/material/Tooltip';
import NavigationViewComp from '../../../../common/FormComponents/NavigationViewComp';
import MaterialTableWrapper from '../../../../common/tableComponents/MaterialTableWrapper';
import TextFormDateField from '../../../../common/FormComponents/TextFormDateField';
import NewShippingHold from './components/NewShippingHold';
import CustomFormTextField from '../../../../common/FormComponents/CustomFormTextField';
import ShippingHoldsActiveAlertForm from './components/ShippingHoldsActiveAlertForm';
import ShippingHoldsDeleteAlertForm from './components/ShippingHoldsDeleteAlertForm';
import { CREATE_SHIPPING_HOLDS } from '../../../../axios/services/live-aquaria-services/shipping-services/ShippingMethods';
import {
	ShippingHoldsFilter,
	ShippingHoldsModifiedData,
	ShippingHoldsRes,
	ShippingHoldsTypeApiRes
} from './shipping-holds-types/ShippingHoldsType';

interface ErrorResponse {
	response?: {
		data?: {
			message?: string;
		};
	};
}

function ShippingDelay() {
	const { t } = useTranslation('ShippingDelays');
	const [pageNo, setPageNo] = useState<number>(0);
	const [pageSize, setPageSize] = useState<number>(5);
	const [count, setCount] = useState<number>(100);
	const [tableData, setTableData] = useState<any[]>([]);
	const [isTableLoading, setTableLoading] = useState(false);
	const [selectedActiveRowData, setSelectedActiveRowData] = useState<ShippingHoldsModifiedData>(null);
	const [selectedDeleteRowData, setSelectedDeleteRowData] = useState<ShippingHoldsModifiedData>(null);
	const [selectedViewRowData, setSelectedViewRowData] = useState<ShippingHoldsModifiedData>(null);
	const [selectedEditRowData, setSelectedEditRowData] = useState<ShippingHoldsModifiedData>(null);
	const [isOpenNewMethod, setOpenNewMethodModal] = useState<boolean>(false);
	const [isOpenViewMethod, setOpenViewMethodModal] = useState<boolean>(false);
	const [isOpenEditMethod, setOpenEditMethodModal] = useState<boolean>(false);
	const [isOpenActiveModal, setOpenActiveModal] = useState<boolean>(false);
	const [isOpenDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
	const toggleNewModal = () => setOpenNewMethodModal(!isOpenNewMethod);
	const toggleViewModal = () => setOpenViewMethodModal(!isOpenViewMethod);
	const toggleEditModal = () => setOpenEditMethodModal(!isOpenEditMethod);
	const toggleActiveModal = () => setOpenActiveModal(!isOpenActiveModal);
	const toggleDeleteModal = () => setOpenDeleteModal(!isOpenDeleteModal);

	const [filteredValues, setFilteredValues] = useState<ShippingHoldsFilter>({
		startDate: null,
		endDate: null,
		state: null,
		category: null
	});
	const debouncedFilter = useDebounce<ShippingHoldsFilter>(filteredValues, 1000);

	const handlePageChange = (page: number) => {
		setPageNo(page);
	};

	const handlePageSizeChange = (pageSize: number) => {
		setPageSize(pageSize);
	};

	const handleOpenNewMethodModal = () => {
		toggleNewModal();
	};

	const handleFilterAll = (values: ShippingHoldsFilter) => {};

	const tableColumns = [
		{
			title: t('START_DATE'),
			field: 'start_date',
			cellStyle: {
				padding: '4px 8px'
			}
		},
		{
			title: t('START_TIME'),
			field: 'start_time',
			cellStyle: {
				padding: '4px 8px'
			}
		},
		{
			title: t('END_DATE'),
			field: 'end_date',
			cellStyle: {
				padding: '4px 8px'
			}
		},
		{
			title: t('END_TIME'),
			field: 'end_time',
			cellStyle: {
				padding: '4px 8px'
			}
		},
		{
			title: t('STATE'),
			field: 'stateName',
			cellStyle: {
				padding: '4px 8px'
			}
		},
		{
			title: t('CATEGORY'),
			field: 'category',
			cellStyle: {
				padding: '4px 8px'
			}
		},
		{
			title: t('REASON'),
			field: 'reason',
			cellStyle: {
				padding: '4px 8px'
			},
			render: (rowData: ShippingHoldsModifiedData, index: number) => {
				return (
					<div className="flex flex-wrap items-center">
						<Tooltip
							title={rowData?.reason || ''}
							arrow
						>
							<span className="flex items-center cursor-default">
								<DescriptionIcon
									style={{
										fontSize: '23px',
										color: '#3558AE',
										marginRight: '5px'
									}}
								/>
							</span>
						</Tooltip>
					</div>
				);
			}
		},
		{
			title: t('Status'),
			field: 'status',
			render: (rowData: ShippingHoldsModifiedData, index: number) => {
				let chipColor;
				switch (rowData?.status) {
					case 'future':
						chipColor = 'bg-blue-50 [&>*]:!text-blue-800';
						break;
					case 'current':
						chipColor = 'bg-green-50 [&>*]:!text-green-800';
						break;
					case 'expired':
						chipColor = 'bg-red-50 [&>*]:!text-red-800';
						break;
					default:
						chipColor = 'bg-gray-50 [&>*]:!text-gray-800';
				}
				return (
					<div className="flex flex-wrap gap-[5px]">
						<span>
							<Chip
								className={`min-w-[85px] ${chipColor} text-[10px] sm:text-[12px] font-[500] px-[6px] py-[2px]`}
								size="small"
								key={index}
								label={rowData?.status ? rowData?.status : ''}
							/>
						</span>
					</div>
				);
			}
		},
		{
			title: t('ACTIVE'),
			field: 'active',
			render: (rowData: ShippingHoldsModifiedData, index) => (
				<FormGroup>
					<FormControlLabel
						control={
							<Switch
								checked={rowData.active}
								onChange={handleSwitchChange(rowData.id, rowData)}
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

	useEffect(() => {
		if (debouncedFilter) changePageNoOrPageSize(filteredValues);
	}, [debouncedFilter]);

	useEffect(() => {
		changePageNoOrPageSize(filteredValues);
	}, [pageNo, pageSize]);

	const handleSwitchChange = (index, rowData: ShippingHoldsModifiedData) => async (event) => {
		setSelectedActiveRowData(rowData);
		toggleActiveModal();
	};

	const tableRowViewHandler = (rowData: ShippingHoldsModifiedData) => {
		setSelectedViewRowData(rowData);
		toggleViewModal();
	};

	const tableRowEditHandler = (rowData: ShippingHoldsModifiedData) => {
		setSelectedEditRowData(rowData);
		toggleEditModal();
	};

	const handleRowDelete = (rowData: ShippingHoldsModifiedData) => {
		setSelectedDeleteRowData(rowData);
		toggleDeleteModal();
	};

	const fetchAllShippingDelayDetails = async () => {
		setTableLoading(true);
		try {
			const response: AxiosResponse<ShippingHoldsTypeApiRes> = await axios.get(
				`${CREATE_SHIPPING_HOLDS}?limit=${pageSize}&page=${pageNo}`
			);
			const transformedData: ShippingHoldsModifiedData[] = response?.data?.data?.map(
				(item: ShippingHoldsRes) => ({
					...item,
					stateName: item?.state?.name,
					startTime: item?.start_time ? item?.start_time.replace(' ', ':') : '',
					endTime: item?.end_time ? item?.end_time.replace(' ', ':') : '',
					category: item?.item_category?.name,
					informCustomers: item?.is_inform_customers === 1,
					active: item?.is_active === 1
				})
			);
			setTableData(transformedData);
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

	const changePageNoOrPageSize = async (filteredValues: ShippingHoldsFilter) => {
		setTableLoading(true);
		try {
			const response: AxiosResponse<ShippingHoldsTypeApiRes> = await axios.get(
				`${CREATE_SHIPPING_HOLDS}?filter=state.name,${filteredValues?.state}|itemCategory.name,${filteredValues?.category}|start_date,${filteredValues?.startDate}|end_date,${filteredValues?.endDate}&limit=${pageSize}&page=${pageNo}`
			);
			const transformedData: ShippingHoldsModifiedData[] = response?.data?.data?.map(
				(item: ShippingHoldsRes) => ({
					...item,
					stateName: item?.state?.name,
					startTime: item?.start_time ? item?.start_time.replace(' ', ':') : '',
					endTime: item?.end_time ? item?.end_time.replace(' ', ':') : '',
					category: item?.item_category?.name,
					informCustomers: item?.is_inform_customers === 1,
					active: item?.is_active === 1
				})
			);
			setTableData(transformedData);
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

	const handleAlertForm = async () => {
		toggleActiveModal();
		const id = selectedActiveRowData?.id ?? null;
		try {
			const data = {
				is_active: selectedActiveRowData?.active === true ? 0 : 1
			};
			await axios.put(`${CREATE_SHIPPING_HOLDS}/${id}`, data);
			fetchAllShippingDelayDetails();

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

	const handleDeleteAlertForm = async () => {
		toggleDeleteModal();
		const id = selectedDeleteRowData?.id ?? null;
		try {
			await axios.delete(`${CREATE_SHIPPING_HOLDS}/${id}`);
			fetchAllShippingDelayDetails();
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

	const changeStartDate = async (value: string) => {
		setFilteredValues({
			...filteredValues,
			startDate: value
		});
	};

	const changeEndDate = async (value: string) => {
		setFilteredValues({
			...filteredValues,
			endDate: value
		});
	};

	const changeState = async (value: string, form: FormikProps<ShippingHoldsFilter>) => {
		form.setFieldValue('state', value);
		setFilteredValues({
			...filteredValues,
			state: value
		});
	};

	const changeCategory = async (value: string, form: FormikProps<ShippingHoldsFilter>) => {
		form.setFieldValue('category', value);
		setFilteredValues({
			...filteredValues,
			category: value
		});
	};

	const handleClearForm = (resetForm: FormikHelpers<ShippingHoldsFilter>['resetForm']) => {
		resetForm();
		setFilteredValues({
			startDate: null,
			endDate: null,
			state: null,
			category: null
		});
	};

	return (
		<div className="min-w-full max-w-[100vw]">
			<NavigationViewComp title="Shipping / Shipping Holds" />

			<Formik
				initialValues={{
					startDate: '',
					endDate: '',
					state: '',
					category: ''
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
								className="formikFormField pt-[5px!important]"
							>
								<Typography className="formTypography">{t('Start Date')}</Typography>
								<TextFormDateField
									name="startDate"
									type="date"
									placeholder=""
									id="scheduledDate"
									min=""
									max=""
									disablePastDate={false}
									changeInput={(value: string, form: FormikHelpers<FormValues>) => {
										changeStartDate(value);
										form.setFieldValue('startDate', value);
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
								<Typography className="formTypography">{t('End Date')}</Typography>
								<TextFormDateField
									name="endDate"
									type="date"
									placeholder=""
									id="scheduledDate"
									min=""
									max=""
									disablePastDate={false}
									changeInput={(value: string, form: FormikHelpers<FormValues>) => {
										changeEndDate(value);
										form.setFieldValue('endDate', value);
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
								<Typography className="formTypography">{t('State')}</Typography>
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
								md={4}
								lg={3}
								xl={2}
								className="formikFormField pt-[5px!important]"
							>
								<Typography className="formTypography">{t('Category')}</Typography>
								<CustomFormTextField
									name="category"
									id="category"
									type="text"
									placeholder=""
									disabled={false}
									changeInput={changeCategory}
								/>
							</Grid>
							<Grid
								item
								xs={12}
								sm={12}
								md={8}
								lg={12}
								xl={4}
								className="flex flex-wrap justify-between items-end gap-[10px] pt-[10px!important]"
							>
								<Button
									className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
									type="button"
									variant="contained"
									size="medium"
									disabled={false}
									onClick={() => handleClearForm(resetForm)}
								>
									{t('Clear Filters')}
								</Button>
								<Button
									className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
									type="button"
									variant="contained"
									size="medium"
									disabled={false}
									onClick={() => handleOpenNewMethodModal()}
								>
									{t('NEW_SHIPPING_HOLD')}
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
						records={tableData}
						tableRowViewHandler={tableRowViewHandler}
						tableRowEditHandler={tableRowEditHandler}
						tableRowDeleteHandler={handleRowDelete}
					/>
				</Grid>
			</Grid>

			{isOpenNewMethod && (
				<NewShippingHold
					isOpen={isOpenNewMethod}
					toggleModal={toggleNewModal}
					clickedRowData={{}}
					isMode="create"
					fetchAllShippingDelayDetails={fetchAllShippingDelayDetails}
				/>
			)}

			{isOpenViewMethod && (
				<NewShippingHold
					isOpen={isOpenViewMethod}
					toggleModal={toggleViewModal}
					clickedRowData={selectedViewRowData}
					isMode="view"
					fetchAllShippingDelayDetails={fetchAllShippingDelayDetails}
				/>
			)}

			{isOpenEditMethod && (
				<NewShippingHold
					isOpen={isOpenEditMethod}
					toggleModal={toggleEditModal}
					clickedRowData={selectedEditRowData}
					isMode="edit"
					fetchAllShippingDelayDetails={fetchAllShippingDelayDetails}
				/>
			)}

			{isOpenActiveModal && (
				<ShippingHoldsActiveAlertForm
					isOpen={isOpenActiveModal}
					toggleModal={toggleActiveModal}
					clickedRowData={selectedActiveRowData}
					handleAlertForm={handleAlertForm}
				/>
			)}

			{isOpenDeleteModal && (
				<ShippingHoldsDeleteAlertForm
					isOpen={isOpenDeleteModal}
					toggleModal={toggleDeleteModal}
					handleAlertForm={handleDeleteAlertForm}
				/>
			)}
		</div>
	);
}

export default ShippingDelay;
