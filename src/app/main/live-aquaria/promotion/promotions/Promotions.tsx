import { Autocomplete, Button, Grid, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { Form, Formik, FormikHelpers, FormikProps } from 'formik';
import useDebounce from 'app/shared-components/useDebounce';
import axios, { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import MaterialTableWrapper from '../../../../common/tableComponents/MaterialTableWrapper';
import NavigationViewComp from '../../../../common/FormComponents/NavigationViewComp';
import RootComponent from './components/RootComponent';

import { CREATE_PROMOTION } from '../../../../axios/services/live-aquaria-services/promotion-services/PromotionsServices';
import CustomFormTextField from '../../../../common/FormComponents/CustomFormTextField';
import {
	PromotionApiRes,
	PromotionFilter,
	PromotionModifiedData,
	PromotionRes
} from './promotions-types/PromotionsTypes';
import PromotionActiveAlertForm from './components/PromotionActiveAlertForm';
import PromotionDeleteAlertForm from './components/PromotionDeleteAlertForm';

interface ErrorResponse {
	response?: {
		data?: {
			message?: string;
		};
	};
}

function Promotions() {
	const { t } = useTranslation('promotions');
	const [pageNo, setPageNo] = useState<number>(0);
	const [pageSize, setPageSize] = useState<number>(5);
	const [count, setCount] = useState(100);
	const [isTableLoading, setTableLoading] = useState(false);
	const [tableData, setTableData] = useState<PromotionModifiedData[]>([]);
	const [selectedActiveRowData, setSelectedActiveRowData] = useState<PromotionModifiedData>(null);
	const [selectedDeleteRowData, setSelectedDeleteRowData] = useState<PromotionModifiedData>(null);
	const [selectedViewRowData, setSelectedViewRowData] = useState<PromotionModifiedData>(null);
	const [selectedEditRowData, setSelectedEditRowData] = useState<PromotionModifiedData>(null);
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
	const [isStatus, setIsStatus] = useState([]);
	const [isPromotionType, setPromotionType] = useState([]);

	const [filteredValues, setFilteredValues] = useState<PromotionFilter>({
		promotionName: null,
		promotionType: null,
		status: null
	});
	const debouncedFilter = useDebounce<PromotionFilter>(filteredValues, 1000);

	const handlePageChange = (page: number) => {
		setPageNo(page);
	};

	const handlePageSizeChange = (pageSize: number) => {
		setPageSize(pageSize);
	};

	const tableColumns = [
		{
			title: t('Promotion Name'),
			field: 'promotionName',
			cellStyle: {
				padding: '4px 8px'
			}
		},
		{
			title: t('Promotion Type'),
			field: 'promotionType',
			cellStyle: {
				padding: '4px 8px'
			}
		},
		{
			title: t('Active From'),
			field: 'activeForm',
			cellStyle: {
				padding: '4px 8px'
			}
		},
		{
			title: t('Status'),
			field: 'status',
			cellStyle: {
				padding: '4px 8px'
			}
		},
		{
			title: t('Active'),
			field: 'active',
			render: (rowData: PromotionModifiedData, index) => (
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

		setIsStatus([
			{
				label: 'Active',
				value: 'Active'
			},
			{
				label: 'Future',
				value: 'Future'
			},
			{
				label: 'Expired',
				value: 'Expired'
			}
		]);
		setPromotionType([
			{ value: '1', label: 'Discount Promotions' },
			{ value: '2', label: 'New Customer' },
			{ value: '3', label: 'Specific Customer' }
		]);
	}, [debouncedFilter]);

	const handleSwitchChange = (index, rowData: PromotionModifiedData) => async (event) => {
		setSelectedActiveRowData(rowData);
		toggleActiveModal();
	};

	const tableRowViewHandler = (rowData: PromotionModifiedData) => {
		setSelectedViewRowData(rowData);
		toggleViewModal();
	};

	const tableRowEditHandler = (rowData: PromotionModifiedData) => {
		if (rowData?.type_id === '2' || rowData?.type_id === '3') {
			toast.error(
				'This promotion was sent via email to selected customers (New or Specific Customers) and cannot be edited'
			);
		} else {
			setSelectedEditRowData(rowData);
			toggleEditModal();
		}
	};

	const tableRowDeleteHandler = (rowData: PromotionModifiedData) => {
		if (rowData?.type_id === '2' || rowData?.type_id === '3') {
			toast.error(
				'This promotion was sent via email to selected customers (New or Specific Customers) and cannot be deleted'
			);
		} else {
			setSelectedDeleteRowData(rowData);
			toggleDeleteModal();
		}
	};

	const createNewCycle = () => {
		toggleNewModal();
	};

	const fetchAllPromotion = async () => {
		setTableLoading(true);
		try {
			const response: AxiosResponse<PromotionApiRes> = await axios.get(
				`${CREATE_PROMOTION}?limit=${pageSize}&page=${pageNo}`
			);
			const transformedData: PromotionModifiedData[] = response?.data?.data?.map((item: PromotionRes) => ({
				...item,
				promotionName: item.name,
				promotionType: item.type,
				activeForm: item.active_from,
				active: item?.is_active === 1
			}));
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
			await axios.put(`${CREATE_PROMOTION}/${id}`, data);
			fetchAllPromotion();

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
			await axios.delete(`${CREATE_PROMOTION}/${id}`);
			fetchAllPromotion();
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

	const changePageNoOrPageSize = async (filteredValues: PromotionFilter) => {
		setTableLoading(true);

		try {
			const response: AxiosResponse<PromotionApiRes> = await axios.get(
				`${CREATE_PROMOTION}?filter=name,${filteredValues?.promotionName}|type,${filteredValues?.promotionType}|promotionCycle.name,null&status=${filteredValues?.status}&limit=${pageSize}&page=${pageNo}`
			);
			const transformedData: PromotionModifiedData[] = response?.data?.data?.map((item: PromotionRes) => ({
				...item,
				promotionName: item.name,
				promotionType: item.type,
				activeForm: item.active_from,
				active: item?.is_active === 1
			}));
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

	const changePromotionType = async (value: string) => {
		setFilteredValues({
			...filteredValues,
			promotionType: value
		});
	};

	const changePromotionName = async (value: string, form: FormikProps<PromotionFilter>) => {
		form.setFieldValue('promotionName', value);
		setFilteredValues({
			...filteredValues,
			promotionName: value
		});
	};

	const changeStatus = async (value: string) => {
		setFilteredValues({
			...filteredValues,
			status: value
		});
	};

	const handleClearForm = (resetForm: FormikHelpers<PromotionFilter>['resetForm']) => {
		resetForm();
		setFilteredValues({
			promotionName: null,
			promotionType: null,
			status: null
		});
	};

	return (
		<div className="min-w-full max-w-[100vw]">
			<NavigationViewComp title="Promotion / Promotions" />

			<Formik
				initialValues={{
					promotionCycle: '',
					promotionType: '',
					promotionName: '',
					status: ''
				}}
				validationSchema={null}
				onSubmit={(values: PromotionFilter) => {}}
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
								<Typography className="formTypography">{t('Promotion Name')}</Typography>
								<CustomFormTextField
									name="promotionName"
									id="promotionName"
									type="text"
									placeholder=""
									disabled={false}
									changeInput={changePromotionName}
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
								<Typography className="formTypography">{t('Promotion Type')}</Typography>
								<Autocomplete
									size="small"
									disablePortal
									options={isPromotionType}
									className="w-full"
									value={values.promotionType || null}
									renderInput={(params) => (
										<TextField
											{...params}
											name="promotionType"
											label=""
										/>
									)}
									onChange={(
										event: React.ChangeEvent<HTMLInputElement>,
										value: { label: string; value: string } | null
									) => {
										setFieldValue('promotionType', value?.label || null);
										changePromotionType(value?.value || null);
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
								<Typography className="formTypography">{t('Status')}</Typography>
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
								sm={6}
								md={12}
								lg={3}
								xl={6}
								className="flex flex-wrap justify-between items-start gap-[10px] formikFormField !pt-[10px] sm:!pt-[26px] md:!pt-[10px] lg:!pt-[26px]"
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
								<Button
									className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] xl:text-[14px] text-white font-500 lg:!px-[2px] xl:!p-[16px] py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
									type="button"
									variant="contained"
									size="medium"
									onClick={createNewCycle}
								>
									{t('New Promotion')}
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
						disableSearch
						isColumnChoser
						records={tableData}
						tableRowViewHandler={tableRowViewHandler}
						tableRowEditHandler={tableRowEditHandler}
						tableRowDeleteHandler={tableRowDeleteHandler}
					/>
				</Grid>
			</Grid>

			{isOpenNewMethod && (
				<RootComponent
					isOpen={isOpenNewMethod}
					toggleModal={toggleNewModal}
					isMode="create"
					fetchAllPromotion={fetchAllPromotion}
					clickedRowData={null}
				/>
			)}

			{isOpenEditMethod && (
				<RootComponent
					isOpen={isOpenEditMethod}
					toggleModal={toggleEditModal}
					isMode="edit"
					fetchAllPromotion={fetchAllPromotion}
					clickedRowData={selectedEditRowData}
				/>
			)}

			{isOpenViewMethod && (
				<RootComponent
					isOpen={isOpenViewMethod}
					toggleModal={toggleViewModal}
					isMode="view"
					fetchAllPromotion={fetchAllPromotion}
					clickedRowData={selectedViewRowData}
				/>
			)}

			{isOpenActiveModal && (
				<PromotionActiveAlertForm
					toggleModal={toggleActiveModal}
					isOpen={isOpenActiveModal}
					clickedRowData={selectedActiveRowData}
					handleAlertForm={handleAlertForm}
				/>
			)}

			{isOpenDeleteModal && (
				<PromotionDeleteAlertForm
					toggleModal={toggleDeleteModal}
					isOpen={isOpenDeleteModal}
					handleAlertForm={handleDeleteAlertForm}
				/>
			)}
		</div>
	);
}

export default Promotions;
