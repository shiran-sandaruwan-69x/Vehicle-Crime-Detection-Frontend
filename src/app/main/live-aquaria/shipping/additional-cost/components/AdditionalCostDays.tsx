import { Button, CircularProgress, FormControlLabel, FormGroup, Grid, Switch, Typography } from '@mui/material';
import axios, { AxiosResponse } from 'axios';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import {
	CREATE_SHIPPING_ADDITIONAL_COSTS,
	CREATE_SHIPPING_SCHEDULE,
	CREATE_SHIPPING_TYPE
} from '../../../../../axios/services/live-aquaria-services/shipping-services/ShippingTypeService';
import FormDropdown from '../../../../../common/FormComponents/FormDropdown';
import TextFormField from '../../../../../common/FormComponents/FormTextField';
import MaterialTableWrapper from '../../../../../common/tableComponents/MaterialTableWrapper';
import { ShippingScheduleTypeDrp } from '../../shipping-methods/types/ShippingMethodsType';
import {
	ShippingScheduleApiResponse,
	ShippingScheduleResponse,
	ShippingTypeApiResponse,
	ShippingTypeResponse
} from '../../shipping-types/types/ShippingTypes';
import {
	AdditionalCostDaysSubmitData,
	ShippingTypeSearchForm,
	StandardShippingCostApiResponse,
	StandardShippingCostModifiedData,
	StandardShippingCostRes
} from '../additional-cost-types/AdditionalCostTypes';
import AdditionalCostActiveComp from './AdditionalCostActiveComp';
import AdditionalCostDeleteAlertForm from './AdditionalCostDeleteAlertForm';
import EditAdditionalCostDaysTableData from './EditAdditionalCostDaysTableData';

interface ErrorResponse {
	response?: {
		data?: {
			message?: string;
		};
	};
}

function AdditionalCostDays() {
	const { t } = useTranslation('AdditionalCost');
	const [pageNo, setPageNo] = useState<number>(0);
	const [pageSize, setPageSize] = useState<number>(5);
	const [count, setCount] = useState<number>(100);
	const [tableData, setTableData] = useState([]);
	const [shippingTypeData, setShippingTypeData] = useState<ShippingScheduleTypeDrp[]>([]);
	const [showAdditionalFields, setShowAdditionalFields] = useState(false);
	const [selectedEditRowData, setSelectedEditRowData] = useState<StandardShippingCostModifiedData>(null);
	const [selectedViewRowData, setSelectedViewRowData] = useState<StandardShippingCostModifiedData>(null);
	const [selectedDeleteRowData, setSelectedDeleteRowData] = useState<StandardShippingCostModifiedData>(null);
	const [selectedActiveRowData, setSelectedActiveRowData] = useState<StandardShippingCostModifiedData>(null);
	const [isOpenEditModal, setOpenEditModal] = useState(false);
	const [isOpenViewModal, setOpenViewModal] = useState(false);
	const [isOpenActiveModal, setOpenActiveModal] = useState(false);
	const [isOpenDeleteModal, setOpenDeleteModal] = useState(false);
	const [isDataLoading, setDataLoading] = useState(false);
	const [isShippingType, setShippingType] = useState<string>(null);
	const [isTableLoading, setTableLoading] = useState(false);
	const [shippingScheduleData, setShippingScheduleData] = useState<ShippingScheduleTypeDrp[]>([]);
	const toggleEditModal = () => setOpenEditModal(!isOpenEditModal);
	const toggleViewModal = () => setOpenViewModal(!isOpenViewModal);
	const toggleActiveModal = () => setOpenActiveModal(!isOpenActiveModal);
	const toggleDeleteModal = () => setOpenDeleteModal(!isOpenDeleteModal);

	const tableColumns = [
		{
			title: t('Days'),
			field: 'day',
			cellStyle: {
				padding: '4px 8px'
			}
		},
		{
			title: t('Amount ($)'),
			field: 'amount',
			cellStyle: {
				padding: '4px 8px'
			},
			render: (rowData: StandardShippingCostModifiedData) =>
				rowData?.amount
					? Number(rowData?.amount).toLocaleString('en-US', {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2
						})
					: ''
		},
		{
			title: t('Shipping Schedule'),
			field: 'deliverySchedule',
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
			render: (rowData: StandardShippingCostModifiedData) => (
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

	const isDays = [
		{ label: 'Sunday', value: 'Sunday' },
		{ label: 'Monday', value: 'Monday' },
		{ label: 'Tuesday', value: 'Tuesday' },
		{ label: 'Wednesday', value: 'Wednesday' },
		{ label: 'Thursday', value: 'Thursday' },
		{ label: 'Friday', value: 'Friday' },
		{ label: 'Saturday', value: 'Saturday' }
	];

	useEffect(() => {
		getAllShippingType();
		getAllSchedule();
	}, []);

	useEffect(() => {
		if (isShippingType) {
			fetchAllAdditionalCostDays();
		}
	}, [pageNo, pageSize, isShippingType]);

	const handleSwitchClick = (rowData: StandardShippingCostModifiedData) => {
		setSelectedActiveRowData(rowData);
		toggleActiveModal();
	};

	const schema = yup.object().shape({
		days: yup.string().required('Days is required'),
		amount: yup.number().min(0, 'Amount must be greater than or equal to zero').required('Amount is required'),
		deliverySchedule: yup.string().required('Delivery Schedule is required')
	});

	const handleFilterShippingType = (values: string) => {
		if (values) {
			setShippingType(values);
			setShowAdditionalFields(true);
		}
	};

	const getAllShippingType = async () => {
		try {
			const response: AxiosResponse<ShippingTypeApiResponse> = await axios.get(
				`${CREATE_SHIPPING_TYPE}?paginate=false`
			);
			const transformedData: ShippingScheduleTypeDrp[] = response?.data?.data?.map(
				(item: ShippingTypeResponse) => ({
					label: item?.name,
					value: item?.id
				})
			);
			setShippingTypeData(transformedData);
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

	const getAllSchedule = async () => {
		try {
			const response: AxiosResponse<ShippingScheduleApiResponse> = await axios.get(
				`${CREATE_SHIPPING_SCHEDULE}?paginate=false`
			);
			const transformedData: ShippingScheduleTypeDrp[] = response?.data?.data?.map(
				(item: ShippingScheduleResponse) => ({
					label: item?.title,
					value: item?.id
				})
			);
			setShippingScheduleData(transformedData);
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

	const handleSubmitData = async (
		values: AdditionalCostDaysSubmitData,
		formikHelpers: FormikHelpers<AdditionalCostDaysSubmitData>
	) => {
		const { resetForm } = formikHelpers;
		const shippingTypeId: string = isShippingType ?? null;
		const data = {
			type: 'ACD',
			shipping_type_id: shippingTypeId,
			day: values?.days ?? null,
			shipping_schedule_id: values?.deliverySchedule ?? null,
			amount: values?.amount ?? null,
			is_active: 1
		};
		setDataLoading(true);
		try {
			await axios.post(`${CREATE_SHIPPING_ADDITIONAL_COSTS}`, data);
			fetchAllAdditionalCostDays();
			toast.success('Created successfully');
			setDataLoading(false);
			resetForm();
		} catch (error) {
			setDataLoading(false);
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

	const handleCancel = (resetForm: FormikHelpers<ShippingTypeSearchForm>['resetForm']) => {
		setShippingType(null);
		setTableData([]);
		setShowAdditionalFields(false);
		resetForm();
	};

	const handlePageChange = (page: number) => {
		setPageNo(page);
	};

	const handlePageSizeChange = (pageSize: number) => {
		setPageSize(pageSize);
	};

	const handleDelete = (rowData: StandardShippingCostModifiedData) => {
		setSelectedDeleteRowData(rowData);
		toggleDeleteModal();
	};

	const handleEdit = (rowData: StandardShippingCostModifiedData) => {
		setSelectedEditRowData(rowData);
		toggleEditModal();
	};

	const tableRowViewHandler = (rowData: StandardShippingCostModifiedData) => {
		setSelectedViewRowData(rowData);
		toggleViewModal();
	};

	const fetchAllAdditionalCostDays = async () => {
		setTableLoading(true);
		try {
			const response: AxiosResponse<StandardShippingCostApiResponse> = await axios.get(
				`${CREATE_SHIPPING_ADDITIONAL_COSTS}?shipping_type_id=${isShippingType}&type=ACD&limit=${pageSize}&page=${pageNo}`
			);
			const transformedData: StandardShippingCostModifiedData[] = response?.data?.data?.map(
				(item: StandardShippingCostRes) => ({
					...item,
					deliverySchedule: item?.shipping_schedule?.title,
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

	const handleConfirmStatusChange = async () => {
		toggleActiveModal();
		const id = selectedActiveRowData?.id ?? null;
		try {
			const data = {
				is_active: selectedActiveRowData?.active === true ? 0 : 1
			};
			await axios.put(`${CREATE_SHIPPING_ADDITIONAL_COSTS}/${id}`, data);
			fetchAllAdditionalCostDays();

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
		const id = selectedDeleteRowData?.id ?? null;
		try {
			await axios.delete(`${CREATE_SHIPPING_ADDITIONAL_COSTS}/${id}`);
			fetchAllAdditionalCostDays();
			toast.success('Deleted Successfully');
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
			<Grid
				container
				spacing={2}
			>
				<Grid
					item
					xs={12}
				>
					<Formik
						initialValues={{ shippingType: '' }}
						validationSchema={null}
						onSubmit={() => {}}
						enableReinitialize
					>
						{({ values, setFieldValue, isValid, resetForm }) => (
							<Form>
								<Grid
									container
									spacing={2}
								>
									<Grid
										item
										xs={12}
										sm={6}
										md={8}
										lg={6}
										xl={4}
										className="formikFormField pt-[5px!important]"
									>
										<Typography className="formTypography">{t('SHIPPING_TYPE')}</Typography>
										<FormDropdown
											name="shippingType"
											id="shippingType"
											placeholder=""
											optionsValues={shippingTypeData}
											disabled={false}
											onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
												const { value } = e.target;
												setFieldValue('shippingType', value);
												handleFilterShippingType(value);
											}}
										/>
									</Grid>
									<Grid
										item
										xs={12}
										sm={6}
										md={4}
										lg={6}
										xl={8}
										className="flex items-end justify-end sm:justify-start pt-[5px!important]"
									>
										<Button
											className="min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
											type="button"
											variant="contained"
											size="medium"
											disabled={false}
											onClick={() => handleCancel(resetForm)}
										>
											{t('Clear')}
										</Button>
									</Grid>
								</Grid>
							</Form>
						)}
					</Formik>
				</Grid>

				{showAdditionalFields && (
					<Grid
						item
						xs={12}
					>
						<Grid container>
							<Grid
								item
								xs={12}
								className="!mt-[10px]"
							>
								<Formik
									initialValues={{
										days: '',
										amount: '',
										deliverySchedule: ''
									}}
									enableReinitialize
									validationSchema={schema}
									onSubmit={handleSubmitData}
								>
									{({ values, setFieldValue, isValid, resetForm }) => (
										<Form>
											<Grid
												container
												spacing={2}
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
													<Typography className="formTypography">
														{t('Days')}
														<span className="text-red"> *</span>
													</Typography>
													<FormDropdown
														name="days"
														id="days"
														placeholder=""
														optionsValues={isDays}
														disabled={false}
														onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
															const { value } = e.target;
															setFieldValue('days', value);
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
													<Typography className="formTypography">
														{t('Amount ($)')}
														<span className="text-red"> *</span>
													</Typography>
													<Field
														name="amount"
														component={TextFormField}
														fullWidth
														type="number"
														size="small"
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
													<Typography className="formTypography">
														{t('Shipping Schedule')}
														<span className="text-red"> *</span>
													</Typography>
													<FormDropdown
														name="deliverySchedule"
														id="deliverySchedule"
														placeholder=""
														optionsValues={shippingScheduleData}
														disabled={false}
														onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
															const { value } = e.target;
															setFieldValue('deliverySchedule', value);
														}}
													/>
												</Grid>
												<Grid
													item
													xs={12}
													sm={6}
													md={12}
													lg={3}
													xl={2}
													className="formikFormField flex justify-end sm:justify-start md:justify-end lg:justify-start items-end gap-[10px] pt-[5px!important]"
												>
													<Button
														className="min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
														type="submit"
														variant="contained"
														size="medium"
														disabled={false}
													>
														{t('SAVE')}

														{isDataLoading ? (
															<CircularProgress
																className="text-white ml-[5px]"
																size={24}
															/>
														) : null}
													</Button>
												</Grid>
											</Grid>
										</Form>
									)}
								</Formik>
							</Grid>

							<Grid
								item
								xs={12}
								className="pt-[10px!important]"
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
									setPageSize={setPageSize}
									pageIndex={pageNo}
									count={count}
									exportToExcel={null}
									handleRowDeleteAction={null}
									externalAdd={null}
									externalEdit={null}
									externalView={null}
									selection={false}
									selectionExport={null}
									isColumnChoser
									disableSearch
									records={tableData}
									tableRowEditHandler={handleEdit}
									tableRowViewHandler={tableRowViewHandler}
									tableRowDeleteHandler={handleDelete}
								/>
							</Grid>
						</Grid>
					</Grid>
				)}
			</Grid>

			{isOpenActiveModal && (
				<AdditionalCostActiveComp
					toggleModal={toggleActiveModal}
					isOpen={isOpenActiveModal}
					clickedRowData={selectedActiveRowData}
					handleAlertForm={handleConfirmStatusChange}
					activeText="Additional Cost Days"
				/>
			)}

			{isOpenEditModal && (
				<EditAdditionalCostDaysTableData
					toggleModal={toggleEditModal}
					isOpen={isOpenEditModal}
					clickedRowData={selectedEditRowData}
					fetchAllAdditionalCostDays={fetchAllAdditionalCostDays}
					shippingScheduleData={shippingScheduleData}
					isTableMode="edit"
				/>
			)}

			{isOpenViewModal && (
				<EditAdditionalCostDaysTableData
					toggleModal={toggleViewModal}
					isOpen={isOpenViewModal}
					clickedRowData={selectedViewRowData}
					fetchAllAdditionalCostDays={fetchAllAdditionalCostDays}
					shippingScheduleData={shippingScheduleData}
					isTableMode="view"
				/>
			)}

			{isOpenDeleteModal && (
				<AdditionalCostDeleteAlertForm
					toggleModal={toggleDeleteModal}
					isOpen={isOpenDeleteModal}
					handleAlertForm={handleAlertForm}
					activeText="Additional Cost Days"
				/>
			)}
		</div>
	);
}

export default AdditionalCostDays;
