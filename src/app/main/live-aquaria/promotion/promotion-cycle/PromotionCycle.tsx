import { Button, Grid, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import useDebounce from 'app/shared-components/useDebounce';
import { Form, Formik, FormikHelpers, FormikProps } from 'formik';
import { toast } from 'react-toastify';
import axios, { AxiosResponse } from 'axios';
import MaterialTableWrapper from '../../../../common/tableComponents/MaterialTableWrapper';
import NavigationViewComp from '../../../../common/FormComponents/NavigationViewComp';
import NewPromotionCycleModal from './components/NewPromotionCycleModal';
import PromotionCycleActiveAlertForm from './components/PromotionCycleActiveAlertForm';
import PromotionCycleDeleteAlertForm from './components/PromotionCycleDeleteAlertForm';
import CustomFormTextField from '../../../../common/FormComponents/CustomFormTextField';
import TextFormDateField from '../../../../common/FormComponents/TextFormDateField';
import {
	PromotionCycleFilterType,
	PromotionCycleModifiedData,
	PromotionCycleRes,
	PromotionCycleTypeApiRes
} from './promotion-cycle-type/PromotionCycleType';
import { CREATE_PROMOTION_CYCLE } from '../../../../axios/services/live-aquaria-services/promotion-services/PromotionsServices';

interface ErrorResponse {
	response?: {
		data?: {
			message?: string;
		};
	};
}

function PromotionCycle() {
	const { t } = useTranslation('promotionCycle');
	const [pageNo, setPageNo] = useState<number>(0);
	const [pageSize, setPageSize] = useState<number>(5);
	const [count, setCount] = useState(100);
	const [isTableLoading, setTableLoading] = useState(false);
	const [tableData, setTableData] = useState<PromotionCycleModifiedData[]>([]);
	const [selectedActiveRowData, setSelectedActiveRowData] = useState<PromotionCycleModifiedData>(null);
	const [selectedDeleteRowData, setSelectedDeleteRowData] = useState<PromotionCycleModifiedData>(null);
	const [selectedViewRowData, setSelectedViewRowData] = useState<PromotionCycleModifiedData>(null);
	const [selectedEditRowData, setSelectedEditRowData] = useState<PromotionCycleModifiedData>(null);
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

	const [filteredValues, setFilteredValues] = useState<PromotionCycleFilterType>({
		startDate: null,
		endDate: null,
		cycleName: null
	});
	const debouncedFilter = useDebounce<PromotionCycleFilterType>(filteredValues, 1000);

	const handlePageChange = (page: number) => {
		setPageNo(page);
	};

	const handlePageSizeChange = (pageSize: number) => {
		setPageSize(pageSize);
	};

	const tableColumns = [
		{
			title: t('REF_NO'),
			field: 'ref_no',
			cellStyle: {
				padding: '4px 8px'
			}
		},
		{
			title: t('PROMOTION_CYCLE_NAME'),
			field: 'name',
			cellStyle: {
				padding: '4px 8px'
			}
		},
		{
			title: t('Start Date'),
			field: 'start_date',
			cellStyle: {
				padding: '4px 8px'
			}
		},
		{
			title: t('Start Time'),
			field: 'startTime',
			cellStyle: {
				padding: '4px 8px'
			}
		},
		{
			title: t('End Date'),
			field: 'end_date',
			cellStyle: {
				padding: '4px 8px'
			}
		},
		{
			title: t('End Time'),
			field: 'endTime',
			cellStyle: {
				padding: '4px 8px'
			}
		},
		{
			title: t('Active'),
			field: 'active',
			render: (rowData: PromotionCycleModifiedData, index) => (
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

	const handleSwitchChange = (index, rowData: PromotionCycleModifiedData) => async (event) => {
		setSelectedActiveRowData(rowData);
		toggleActiveModal();
	};

	const tableRowViewHandler = (rowData: PromotionCycleModifiedData) => {
		setSelectedViewRowData(rowData);
		toggleViewModal();
	};

	const tableRowEditHandler = (rowData: PromotionCycleModifiedData) => {
		setSelectedEditRowData(rowData);
		toggleEditModal();
	};

	const tableRowDeleteHandler = (rowData: PromotionCycleModifiedData) => {
		setSelectedDeleteRowData(rowData);
		toggleDeleteModal();
	};

	const createNewCycle = () => {
		toggleNewModal();
	};

	const fetchAllPromotionCycle = async () => {
		setTableLoading(true);
		try {
			const response: AxiosResponse<PromotionCycleTypeApiRes> = await axios.get(
				`${CREATE_PROMOTION_CYCLE}?limit=${pageSize}&page=${pageNo}`
			);
			const transformedData: PromotionCycleModifiedData[] = response?.data?.data?.map(
				(item: PromotionCycleRes) => ({
					...item,
					startTime: item?.start_time ? item?.start_time.replace(' ', ':') : '',
					endTime: item?.end_time ? item?.end_time.replace(' ', ':') : '',
					repeatYearly: item?.is_repeat_yearly === 1,
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
			await axios.put(`${CREATE_PROMOTION_CYCLE}/${id}`, data);
			fetchAllPromotionCycle();

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
			await axios.delete(`${CREATE_PROMOTION_CYCLE}/${id}`);
			fetchAllPromotionCycle();
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

	const changePageNoOrPageSize = async (filteredValues: PromotionCycleFilterType) => {
		setTableLoading(true);
		try {
			const response: AxiosResponse<PromotionCycleTypeApiRes> = await axios.get(
				`${CREATE_PROMOTION_CYCLE}?filter=name,${filteredValues.cycleName}|start_date,${filteredValues.startDate}|end_date,${filteredValues.endDate}&limit=${pageSize}&page=${pageNo}`
			);
			const transformedData: PromotionCycleModifiedData[] = response?.data?.data?.map(
				(item: PromotionCycleRes) => ({
					...item,
					startTime: item?.start_time ? item?.start_time.replace(' ', ':') : '',
					endTime: item?.end_time ? item?.end_time.replace(' ', ':') : '',
					repeatYearly: item?.is_repeat_yearly === 1,
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

	const changeCycleName = async (value: string, form: FormikProps<PromotionCycleFilterType>) => {
		form.setFieldValue('cycleName', value);
		setFilteredValues({
			...filteredValues,
			cycleName: value.length === 0 ? null : value
		});
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

	const handleClearForm = (resetForm: FormikHelpers<PromotionCycleFilterType>['resetForm']) => {
		resetForm();
		setFilteredValues({
			startDate: null,
			endDate: null,
			cycleName: null
		});
	};

	return (
		<div className="min-w-full max-w-[100vw]">
			<NavigationViewComp title="Promotion / Promotion Cycle" />

			<Formik
				initialValues={{ cycleName: '', startDate: '', endDate: '' }}
				validationSchema={null}
				onSubmit={(values: PromotionCycleFilterType) => {}}
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
								<Typography className="formTypography">{t('Cycle Name')}</Typography>
								<CustomFormTextField
									name="cycleName"
									id="cycleName"
									type="text"
									placeholder=""
									disabled={false}
									changeInput={changeCycleName}
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
									<span className="lg:hidden xl:block">{t('New Promotion Cycle')}</span>
									<span className="hidden lg:block xl:hidden">New Promo Cycle</span>
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
				<NewPromotionCycleModal
					isOpen={isOpenNewMethod}
					toggleModal={toggleNewModal}
					clickedRowData={{}}
					isMode="create"
					fetchAllPromotionCycle={fetchAllPromotionCycle}
				/>
			)}

			{isOpenViewMethod && (
				<NewPromotionCycleModal
					isOpen={isOpenViewMethod}
					toggleModal={toggleViewModal}
					clickedRowData={selectedViewRowData}
					isMode="view"
					fetchAllPromotionCycle={fetchAllPromotionCycle}
				/>
			)}

			{isOpenEditMethod && (
				<NewPromotionCycleModal
					isOpen={isOpenEditMethod}
					toggleModal={toggleEditModal}
					clickedRowData={selectedEditRowData}
					isMode="edit"
					fetchAllPromotionCycle={fetchAllPromotionCycle}
				/>
			)}

			{isOpenActiveModal && (
				<PromotionCycleActiveAlertForm
					toggleModal={toggleActiveModal}
					isOpen={isOpenActiveModal}
					clickedRowData={selectedActiveRowData}
					handleAlertForm={handleAlertForm}
				/>
			)}

			{isOpenDeleteModal && (
				<PromotionCycleDeleteAlertForm
					toggleModal={toggleDeleteModal}
					isOpen={isOpenDeleteModal}
					handleAlertForm={handleDeleteAlertForm}
				/>
			)}
		</div>
	);
}

export default PromotionCycle;
