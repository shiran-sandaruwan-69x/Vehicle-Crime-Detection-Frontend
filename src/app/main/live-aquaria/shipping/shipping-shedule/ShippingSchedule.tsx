import { Button, FormControlLabel, FormGroup, Grid, Switch, Typography } from '@mui/material';
import { Form, Formik, FormikHelpers, FormikProps } from 'formik';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios, { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import useDebounce from 'app/shared-components/useDebounce';
import DescriptionIcon from '@mui/icons-material/Description';
import Tooltip from '@mui/material/Tooltip';
import NavigationViewComp from '../../../../common/FormComponents/NavigationViewComp';
import MaterialTableWrapper from '../../../../common/tableComponents/MaterialTableWrapper';
import NewShippingScheduleModal from './components/NewShippingScheduleModal';
import {
	ShippingScheduleApiResponse,
	ShippingScheduleFilter,
	ShippingScheduleModifiedData,
	ShippingScheduleResponse
} from '../shipping-types/types/ShippingTypes';
import { CREATE_SHIPPING_SCHEDULE } from '../../../../axios/services/live-aquaria-services/shipping-services/ShippingTypeService';
import ShippingScheduleActiveComp from './components/ShippingScheduleActiveComp';
import ShippingScheduleDeleteAlertForm from './components/ShippingScheduleDeleteAlertForm';
import CustomFormTextField from '../../../../common/FormComponents/CustomFormTextField';

interface ErrorResponse {
	response?: {
		data?: {
			message?: string;
		};
	};
}

function ShippingSchedule() {
	const { t } = useTranslation('ShippingSchedule');
	const [pageNo, setPageNo] = useState<number>(0);
	const [pageSize, setPageSize] = useState<number>(5);
	const [count, setCount] = useState<number>(100);
	const [clickedRowEditData, setClickedEditRowData] = useState<ShippingScheduleModifiedData>(null);
	const [clickedRowViewData, setClickedViewRowData] = useState<ShippingScheduleModifiedData>(null);
	const [clickedRowDeleteData, setClickedDeleteRowData] = useState<ShippingScheduleModifiedData>(null);
	const [clickedActiveDeleteData, setClickedActiveRowData] = useState<ShippingScheduleModifiedData>(null);
	const [isTableLoading, setTableLoading] = useState(false);
	const [sampleData, setSampleData] = useState<ShippingScheduleModifiedData[]>([]);
	const [isOpenNewShippingScheduleModal, setIsOpenNewShippingScheduleModal] = useState(false);
	const [isOpenEditShippingScheduleModal, setIsOpenEditShippingScheduleModal] = useState(false);
	const [isOpenViewShippingScheduleModal, setIsOpenViewShippingScheduleModal] = useState(false);
	const [isOpenActiveModal, setOpenActiveModal] = useState(false);
	const [isOpenDeleteModal, setOpenDeleteModal] = useState(false);
	const toggleActiveModal = () => setOpenActiveModal(!isOpenActiveModal);
	const toggleDeleteModal = () => setOpenDeleteModal(!isOpenDeleteModal);
	const toggleShippingScheduleModal = () => setIsOpenNewShippingScheduleModal(!isOpenNewShippingScheduleModal);
	const toggleShippingScheduleEditModal = () => setIsOpenEditShippingScheduleModal(!isOpenEditShippingScheduleModal);
	const toggleShippingScheduleViewModal = () => setIsOpenViewShippingScheduleModal(!isOpenViewShippingScheduleModal);

	const [filteredValues, setFilteredValues] = useState<ShippingScheduleFilter>({
		scheduleName: null,
		workDays: null
	});

	const debouncedFilter = useDebounce<ShippingScheduleFilter>(filteredValues, 1000);

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

	const tableColumns = [
		{
			title: t('SCHEDULE_NAME'),
			field: 'title',
			cellStyle: {
				padding: '4px 8px'
			}
		},
		{
			title: t('WORK_DAYS'),
			field: 'work_days',
			cellStyle: {
				padding: '4px 8px'
			},
			render: (rowData: ShippingScheduleModifiedData) => rowData?.work_day?.map((item) => item).join(', ')
		},
		{
			title: t('DESCRIPTION'),
			field: 'description',
			cellStyle: {
				padding: '4px 8px'
			},
			render: (rowData: ShippingScheduleModifiedData, index: number) => {
				return (
					<div className="flex flex-wrap items-center">
						<Tooltip
							title={rowData?.description || ''}
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
			title: t('ACTIVE'),
			field: 'active',
			cellStyle: {
				padding: '4px 8px'
			},
			render: (rowData: ShippingScheduleModifiedData) => (
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

	const handleSwitchChange = (rowData: ShippingScheduleModifiedData) => () => {
		setClickedActiveRowData(rowData);
		toggleActiveModal();
	};

	const handleRowDelete = async (rowData: ShippingScheduleModifiedData) => {
		setClickedDeleteRowData(rowData);
		toggleDeleteModal();
	};

	const handleView = async (rowData: ShippingScheduleModifiedData) => {
		setClickedViewRowData(rowData);
		toggleShippingScheduleViewModal();
	};

	const handleEdit = async (rowData: ShippingScheduleModifiedData) => {
		setClickedEditRowData(rowData);
		toggleShippingScheduleEditModal();
	};

	const handleOpenNewMethodModal = () => {
		toggleShippingScheduleModal();
	};

	const fetchAllShippingSchedule = async () => {
		setTableLoading(true);
		try {
			const response: AxiosResponse<ShippingScheduleApiResponse> = await axios.get(
				`${CREATE_SHIPPING_SCHEDULE}?limit=${pageSize}&page=${pageNo}`
			);
			const transformedData: ShippingScheduleModifiedData[] = response?.data?.data?.map(
				(item: ShippingScheduleResponse) => ({
					...item,
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

	const changePageNoOrPageSize = async (filteredValues: ShippingScheduleFilter) => {
		setTableLoading(true);
		try {
			const response: AxiosResponse<ShippingScheduleApiResponse> = await axios.get(
				`${CREATE_SHIPPING_SCHEDULE}?filter=title,${filteredValues.scheduleName}|work_day,${filteredValues.workDays}&limit=${pageSize}&page=${pageNo}`
			);
			const transformedData: ShippingScheduleModifiedData[] = response?.data?.data?.map(
				(item: ShippingScheduleResponse) => ({
					...item,
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

	const handleConfirmStatusChange = async () => {
		toggleActiveModal();
		const id = clickedActiveDeleteData?.id ?? null;
		try {
			const data = {
				is_active: clickedActiveDeleteData?.active === true ? 0 : 1
			};
			await axios.put(`${CREATE_SHIPPING_SCHEDULE}/${id}`, data);
			fetchAllShippingSchedule();

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

	const handleAlertForm = async () => {
		toggleDeleteModal();
		const id = clickedRowDeleteData?.id ?? null;
		try {
			await axios.delete(`${CREATE_SHIPPING_SCHEDULE}/${id}`);
			fetchAllShippingSchedule();
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

	const changeScheduleName = async (value: string, form: FormikProps<ShippingScheduleFilter>) => {
		form.setFieldValue('scheduleName', value);
		setFilteredValues({
			...filteredValues,
			scheduleName: value.length === 0 ? null : value
		});
	};

	const changeWorkDays = async (value: string, form: FormikProps<ShippingScheduleFilter>) => {
		form.setFieldValue('workDays', value);
		setFilteredValues({
			...filteredValues,
			workDays: value.length === 0 ? null : value
		});
	};

	const handleClearForm = (resetForm: FormikHelpers<ShippingScheduleFilter>['resetForm']) => {
		resetForm();
		setFilteredValues({
			scheduleName: null,
			workDays: null
		});
	};

	return (
		<div className="min-w-full max-w-[100vw]">
			<NavigationViewComp title="Shipping / Shipping Schedule" />

			<Formik
				initialValues={{ scheduleName: '', workDays: '' }}
				validationSchema={null}
				onSubmit={(values: ShippingScheduleFilter) => {}}
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
								<Typography className="formTypography">{t('SCHEDULE_NAME')}</Typography>
								<CustomFormTextField
									name="scheduleName"
									id="scheduleName"
									type="text"
									placeholder=""
									disabled={false}
									changeInput={changeScheduleName}
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
								<Typography className="formTypography">{t('WORK_DAYS')}</Typography>
								<CustomFormTextField
									name="workDays"
									id="workDays"
									type="text"
									placeholder=""
									disabled={false}
									changeInput={changeWorkDays}
								/>
							</Grid>

							<Grid
								item
								xs={12}
								sm={12}
								md={4}
								lg={6}
								xl={8}
								className="flex flex-wrap justify-between items-start gap-[10px] formikFormField !pt-[10px] md:!pt-[26px]"
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
									className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
									type="button"
									variant="contained"
									size="medium"
									disabled={false}
									onClick={handleOpenNewMethodModal}
								>
									{t('NEW_SHIPPING_SCHEDULE')}
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
						loading={isTableLoading}
						handlePageChange={handlePageChange}
						handlePageSizeChange={handlePageSizeChange}
						handleCommonSearchBar={null}
						pageSize={pageSize}
						disableColumnFiltering
						setPageSize={setPageSize}
						pageIndex={pageNo}
						searchByText=""
						count={count}
						exportToExcel={null}
						handleRowDeleteAction={null}
						externalAdd={null}
						externalEdit={null}
						externalView={null}
						selection={false}
						selectionExport={null}
						isColumnChoser
						// disableSearch
						records={sampleData}
						tableRowViewHandler={handleView}
						tableRowEditHandler={handleEdit}
						tableRowDeleteHandler={handleRowDelete}
					/>
				</Grid>
			</Grid>

			{isOpenNewShippingScheduleModal && (
				<NewShippingScheduleModal
					isOpen={isOpenNewShippingScheduleModal}
					toggleModal={toggleShippingScheduleModal}
					clickedRowData={{}}
					isTableMode=""
					fetchAllShippingSchedule={fetchAllShippingSchedule}
				/>
			)}

			{isOpenEditShippingScheduleModal && (
				<NewShippingScheduleModal
					isOpen={isOpenEditShippingScheduleModal}
					toggleModal={toggleShippingScheduleEditModal}
					clickedRowData={clickedRowEditData}
					isTableMode="edit"
					fetchAllShippingSchedule={fetchAllShippingSchedule}
				/>
			)}

			{isOpenViewShippingScheduleModal && (
				<NewShippingScheduleModal
					isOpen={isOpenViewShippingScheduleModal}
					toggleModal={toggleShippingScheduleViewModal}
					clickedRowData={clickedRowViewData}
					isTableMode="view"
					fetchAllShippingSchedule={fetchAllShippingSchedule}
				/>
			)}

			{isOpenActiveModal && (
				<ShippingScheduleActiveComp
					toggleModal={toggleActiveModal}
					isOpen={isOpenActiveModal}
					clickedRowData={clickedActiveDeleteData}
					handleAlertForm={handleConfirmStatusChange}
				/>
			)}

			{isOpenDeleteModal && (
				<ShippingScheduleDeleteAlertForm
					toggleModal={toggleDeleteModal}
					isOpen={isOpenDeleteModal}
					clickedRowData={clickedRowDeleteData}
					handleAlertForm={handleAlertForm}
				/>
			)}
		</div>
	);
}

export default ShippingSchedule;
