import { Button, CircularProgress, FormControlLabel, FormGroup, Grid, Switch, Typography } from '@mui/material';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import axios, { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import DescriptionIcon from '@mui/icons-material/Description';
import Tooltip from '@mui/material/Tooltip';
import FormDropdown from '../../../../../common/FormComponents/FormDropdown';
import TextFormField from '../../../../../common/FormComponents/FormTextField';
import MaterialTableWrapper from '../../../../../common/tableComponents/MaterialTableWrapper';
import { ShippingScheduleTypeDrp } from '../../shipping-methods/types/ShippingMethodsType';
import {
	AdditionalCostStateSubmitData,
	ShippingStateApiResponse,
	ShippingStateResponse,
	ShippingTypeSearchForm,
	StandardShippingCostApiResponse,
	StandardShippingCostModifiedData,
	StandardShippingCostRes
} from '../additional-cost-types/AdditionalCostTypes';
import AdditionalCostActiveComp from './AdditionalCostActiveComp';
import AdditionalCostDeleteAlertForm from './AdditionalCostDeleteAlertForm';
import EditAdditionalCostStateTableData from './EditAdditionalCostStateTableData';
import { ShippingTypeApiResponse, ShippingTypeResponse } from '../../shipping-types/types/ShippingTypes';
import {
	CREATE_SHIPPING_ADDITIONAL_COSTS,
	CREATE_SHIPPING_STATES,
	CREATE_SHIPPING_TYPE
} from '../../../../../axios/services/live-aquaria-services/shipping-services/ShippingTypeService';

interface ErrorResponse {
	response?: {
		data?: {
			message?: string;
		};
	};
}

function AdditionalCostState() {
	const { t } = useTranslation('AdditionalCost');
	const [pageNo, setPageNo] = useState<number>(0);
	const [pageSize, setPageSize] = useState<number>(5);
	const [count, setCount] = useState<number>(100);
	const [tableData, setTableData] = useState([]);
	const [shippingTypeData, setShippingTypeData] = useState<ShippingScheduleTypeDrp[]>([]);
	const [shippingStateData, setShippingStateData] = useState<ShippingScheduleTypeDrp[]>([]);
	const [showAdditionalFields, setShowAdditionalFields] = useState(false);
	const [selectedEditRowData, setSelectedEditRowData] = useState<StandardShippingCostModifiedData>(null);
	const [selectedViewRowData, setSelectedViewRowData] = useState<StandardShippingCostModifiedData>(null);
	const [selectedDeleteRowData, setSelectedDeleteRowData] = useState<StandardShippingCostModifiedData>(null);
	const [selectedActiveRowData, setSelectedActiveRowData] = useState<StandardShippingCostModifiedData>(null);
	const [isOpenEditModal, setOpenEditModal] = useState(false);
	const [isOpenViewModal, setOpenViewModal] = useState(false);
	const [isOpenActiveModal, setOpenActiveModal] = useState(false);
	const [isOpenDeleteModal, setOpenDeleteModal] = useState(false);
	const [isShippingType, setShippingType] = useState<string>(null);
	const [isDataLoading, setDataLoading] = useState(false);
	const [isTableLoading, setTableLoading] = useState(false);
	const toggleEditModal = () => setOpenEditModal(!isOpenEditModal);
	const toggleViewModal = () => setOpenViewModal(!isOpenViewModal);
	const toggleActiveModal = () => setOpenActiveModal(!isOpenActiveModal);
	const toggleDeleteModal = () => setOpenDeleteModal(!isOpenDeleteModal);

	const handlePageChange = (page: number) => {
		setPageNo(page);
	};

	const handlePageSizeChange = (pageSize: number) => {
		setPageSize(pageSize);
	};

	const tableColumns = [
		{
			title: t('State'),
			field: 'stateT',
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
			title: t('Reason'),
			field: 'reason',
			cellStyle: {
				padding: '4px 8px'
			},
			render: (rowData: StandardShippingCostModifiedData) => {
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

	useEffect(() => {
		getAllShippingType();
		getAllState();
	}, []);

	useEffect(() => {
		if (isShippingType) {
			fetchAllAdditionalCostState();
		}
	}, [pageNo, pageSize, isShippingType]);

	const handleSwitchClick = (rowData: StandardShippingCostModifiedData) => {
		setSelectedActiveRowData(rowData);
		toggleActiveModal();
	};

	const schema = yup.object().shape({
		state: yup.string().required('State is required'),
		amount: yup.number().min(0, 'Amount must be greater than or equal to zero').required('Amount is required')
	});

	const handleFilterShippingType = (values: string) => {
		if (values) {
			setShippingType(values);
			setShowAdditionalFields(true);
		}
	};

	const handleCancel = (resetForm: FormikHelpers<ShippingTypeSearchForm>['resetForm']) => {
		setShippingType(null);
		setTableData([]);
		setShowAdditionalFields(false);
		resetForm();
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

	const getAllState = async () => {
		try {
			const response: AxiosResponse<ShippingStateApiResponse> = await axios.get(
				`${CREATE_SHIPPING_STATES}?paginate=false`
			);
			const transformedData: ShippingScheduleTypeDrp[] = response?.data?.data?.map(
				(item: ShippingStateResponse) => ({
					label: item?.name,
					value: item?.id
				})
			);
			setShippingStateData(transformedData);
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
		values: AdditionalCostStateSubmitData,
		formikHelpers: FormikHelpers<AdditionalCostStateSubmitData>
	) => {
		const { resetForm } = formikHelpers;
		const shippingTypeId: string = isShippingType ?? null;
		const data = {
			type: 'ACS',
			shipping_type_id: shippingTypeId,
			state_id: values?.state ?? null,
			amount: values?.amount ?? null,
			reason: values?.reason ?? null,
			is_active: 1
		};
		setDataLoading(true);
		try {
			await axios.post(`${CREATE_SHIPPING_ADDITIONAL_COSTS}`, data);
			fetchAllAdditionalCostState();
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

	const fetchAllAdditionalCostState = async () => {
		setTableLoading(true);
		try {
			const response: AxiosResponse<StandardShippingCostApiResponse> = await axios.get(
				`${CREATE_SHIPPING_ADDITIONAL_COSTS}?shipping_type_id=${isShippingType}&type=ACS&limit=${pageSize}&page=${pageNo}`
			);
			const transformedData: StandardShippingCostModifiedData[] = response?.data?.data?.map(
				(item: StandardShippingCostRes) => ({
					...item,
					stateT: item?.state?.name,
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

	const handleConfirmStatusChange = async () => {
		toggleActiveModal();
		const id = selectedActiveRowData?.id ?? null;
		try {
			const data = {
				is_active: selectedActiveRowData?.active === true ? 0 : 1
			};
			await axios.put(`${CREATE_SHIPPING_ADDITIONAL_COSTS}/${id}`, data);
			fetchAllAdditionalCostState();

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
			fetchAllAdditionalCostState();
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
						<Grid
							container
							spacing={2}
						>
							<Grid
								item
								xs={12}
								className="!mt-[10px]"
							>
								<Formik
									initialValues={{
										state: '',
										amount: '',
										reason: ''
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
														{t('State')}
														<span className="text-red"> *</span>
													</Typography>
													<FormDropdown
														name="state"
														id="state"
														placeholder=""
														optionsValues={shippingStateData}
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
													<Typography className="formTypography">{t('Reason')}</Typography>
													<Field
														type="text"
														name="reason"
														component={TextFormField}
														fullWidth
														size="small"
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
									handleColumnFilter={null}
									loading={isTableLoading}
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
					activeText="Additional Cost State"
				/>
			)}

			{isOpenEditModal && (
				<EditAdditionalCostStateTableData
					toggleModal={toggleEditModal}
					isOpen={isOpenEditModal}
					clickedRowData={selectedEditRowData}
					shippingStateData={shippingStateData}
					fetchAllAdditionalCostState={fetchAllAdditionalCostState}
					isTableMode="edit"
				/>
			)}

			{isOpenViewModal && (
				<EditAdditionalCostStateTableData
					toggleModal={toggleViewModal}
					isOpen={isOpenViewModal}
					clickedRowData={selectedViewRowData}
					shippingStateData={shippingStateData}
					fetchAllAdditionalCostState={fetchAllAdditionalCostState}
					isTableMode="view"
				/>
			)}

			{isOpenDeleteModal && (
				<AdditionalCostDeleteAlertForm
					toggleModal={toggleDeleteModal}
					isOpen={isOpenDeleteModal}
					handleAlertForm={handleAlertForm}
					activeText="Additional Cost State"
				/>
			)}
		</div>
	);
}

export default AdditionalCostState;
