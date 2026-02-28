import Grid from '@mui/material/Grid';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import Typography from '@mui/material/Typography';
import { Button, CircularProgress } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import OrderStatusMasterDialogForm from './components/OrderStatusMasterDialogForm';
import OrderStatusMasterFormDeleteAlertForm from './components/OrderStatusMasterFormDeleteAlertForm';
import {
	OrderStatusMaster,
	OrderStatusMasterCreateData,
	OrderStatusMasterModifiedData,
	OrderStatusMasterType
} from './order-status-master-form-types/OrderStatusMasterFormTypes';

import {
	createOrderStatusMaster,
	deleteOrderStatusMaster,
	getAllOrderStatusMaster,
	updateOrderStatusMaster
} from '../../../../axios/services/live-aquaria-services/master-data-services/MasterDataServices';
import MaterialTableWrapper from '../../../../common/tableComponents/MaterialTableWrapper';
import TextFormField from '../../../../common/FormComponents/FormTextField';
import NavigationViewComp from '../../../../common/FormComponents/NavigationViewComp';
import OrderStatusMasterFormActiveAlertForm from './components/OrderStatusMasterFormActiveAlertForm';

interface ErrorResponse {
	response?: {
		data?: {
			message?: string;
		};
	};
}

function OrderStatusMasterForm() {
	const { t } = useTranslation('orderStatusMasterForm');
	const [pageNo, setPageNo] = useState<number>(0);
	const [pageSize, setPageSize] = useState<number>(5);
	const [count, setCount] = useState(100);
	const [isTableLoading, setTableLoading] = useState(false);
	const [tableData, setTableData] = useState([]);
	const [tableRowData, setTableRowData] = useState({});
	const [isOrderStatusMasterFormDataLoading, setOrderStatusMasterFormDataLoading] = useState(false);
	const [clickedRowData, setClickedRowData] = useState({});
	const [clickedEditRowData, setClickedEditRowData] = useState({} as OrderStatusMasterModifiedData);
	const [clickedDeleteRowData, setClickedDeleteRowData] = useState({} as OrderStatusMasterModifiedData);
	const [clickedActiveRowData, setClickedActiveRowData] = useState({} as OrderStatusMasterModifiedData);
	const [isOpenViewOrderStatusMasterFormModal, setOpenViewOrderStatusMasterFormModal] = useState(false);
	const [isOpenEditOrderStatusMasterFormModal, setOpenEditOrderStatusMasterFormModal] = useState(false);
	const [isOpenDeleteOrderStatusMasterFormModal, setOpenDeleteOrderStatusMasterFormModal] = useState(false);
	const [isOpenActiveOrderStatusMasterFormModal, setOpenActiveOrderStatusMasterFormModal] = useState(false);
	const toggleViewOrderStatusMasterFormModal = () =>
		setOpenViewOrderStatusMasterFormModal(!isOpenViewOrderStatusMasterFormModal);
	const toggleEditOrderStatusMasterFormModal = () =>
		setOpenEditOrderStatusMasterFormModal(!isOpenEditOrderStatusMasterFormModal);
	const toggleDeleteOrderStatusMasterFormModal = () =>
		setOpenDeleteOrderStatusMasterFormModal(!isOpenDeleteOrderStatusMasterFormModal);
	const toggleActiveOrderStatusMasterFormModal = () =>
		setOpenActiveOrderStatusMasterFormModal(!isOpenActiveOrderStatusMasterFormModal);

	useEffect(() => {
		getAllOrderStatus();
	}, [pageNo, pageSize]);

	const tableColumns = [
		{
			title: t('ID'),
			field: 'id'
		},
		{
			title: t('GENERAL_ORDER_STATUS'),
			field: 'generalOrderStatus'
		},
		{
			title: t('ACTIVE'),
			field: 'active',
			render: (rowData: OrderStatusMasterModifiedData, index) => (
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

	const handlePageChange = (page: number) => {
		setPageNo(page);
	};

	const handlePageSizeChange = (pageSize: number) => {
		setPageSize(pageSize);
	};

	const getAllOrderStatus = async () => {
		setTableLoading(true);
		try {
			const response: OrderStatusMasterType = await getAllOrderStatusMaster(pageNo, pageSize);
			setCount(response.meta.total);
			const data1: OrderStatusMaster[] = response.data;
			const modifiedData: OrderStatusMasterModifiedData[] = data1.map((item: OrderStatusMaster) => ({
				id: item.id,
				generalOrderStatus: item.name,
				active: item.is_active === 1
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

	// Switch

	const handleSwitchChange = (index, rowData: OrderStatusMasterModifiedData) => async (event) => {
		setClickedActiveRowData(rowData);
		toggleActiveOrderStatusMasterFormModal();
	};

	const schema = yup.object().shape({
		generalOrderStatus: yup.string().required(t('Dropshipper Order Status is required'))
	});

	const onSubmit = async (
		values: OrderStatusMasterCreateData,
		formikHelpers: FormikHelpers<OrderStatusMasterCreateData>
	) => {
		const { resetForm } = formikHelpers;
		setOrderStatusMasterFormDataLoading(true);
		const requestData = {
			name: values.generalOrderStatus ? values.generalOrderStatus : '',
			is_active: 1
		};
		try {
			const response = await createOrderStatusMaster(requestData);
			setOrderStatusMasterFormDataLoading(false);
			getAllOrderStatus();
			toast.success('Created Successfully');
			resetForm();
		} catch (error) {
			setOrderStatusMasterFormDataLoading(false);
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

	const handleClearForm = (resetForm: FormikHelpers<OrderStatusMasterModifiedData>['resetForm']) => {
		resetForm();
	};

	const tableRowViewHandler = (rowData: OrderStatusMasterModifiedData) => {
		setClickedRowData(rowData);
		toggleViewOrderStatusMasterFormModal();
	};

	const tableRowEditHandler = (rowData: OrderStatusMasterModifiedData) => {
		setClickedEditRowData(rowData);
		toggleEditOrderStatusMasterFormModal();
	};

	const tableRowDeleteHandler = (rowData: OrderStatusMasterModifiedData) => {
		setClickedDeleteRowData(rowData);
		toggleDeleteOrderStatusMasterFormModal();
	};

	const handleAlertForm = async () => {
		const reasonId: number | '' = clickedDeleteRowData.id ? clickedDeleteRowData.id : '';

		try {
			const response = await deleteOrderStatusMaster(reasonId);
			getAllOrderStatus();
			toggleDeleteOrderStatusMasterFormModal();
			toast.success('Deleted Successfully');
		} catch (error) {
			toggleDeleteOrderStatusMasterFormModal();
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
		const reasonId: number | '' = clickedActiveRowData.id ? clickedActiveRowData.id : '';
		const requestData = {
			is_active: clickedActiveRowData.active === true ? 0 : 1
		};

		try {
			const response = await updateOrderStatusMaster(requestData, reasonId);
			toggleActiveOrderStatusMasterFormModal();
			getAllOrderStatus();

			if (requestData.is_active === 1) {
				toast.success('Activated Successfully');
			} else {
				toast.success('Inactivated Successfully');
			}
		} catch (error) {
			toggleActiveOrderStatusMasterFormModal();
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
			<NavigationViewComp title="Dropshipper Order Status" />

			<Formik
				initialValues={{
					generalOrderStatus: ''
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
								className="formikFormField pt-[5px!important]"
							>
								<Typography className="formTypography">
									{t('Dropshipper Order Status')}
									<span className="text-red"> *</span>
								</Typography>
								<Field
									disabled={false}
									name="generalOrderStatus"
									placeholder={t('')}
									component={TextFormField}
									fullWidth
									size="small"
								/>
							</Grid>

							<Grid
								item
								xs={12}
								sm={6}
								md={8}
								lg={9}
								className="flex items-start gap-[10px] formikFormField pt-[26px!important]"
							>
								<Button
									className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
									type="submit"
									variant="contained"
									size="medium"
									disabled={false}
								>
									{t('Save')}
									{isOrderStatusMasterFormDataLoading ? (
										<CircularProgress
											className="text-white ml-[5px]"
											size={24}
										/>
									) : null}
								</Button>

								<Button
									className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
									type="button"
									variant="contained"
									size="medium"
									disabled={false}
									onClick={() => handleClearForm(resetForm)}
								>
									{t('Reset')}
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
						tableRowEditHandler={tableRowEditHandler}
						tableRowDeleteHandler={tableRowDeleteHandler}
					/>
				</Grid>
			</Grid>

			{isOpenViewOrderStatusMasterFormModal && (
				<OrderStatusMasterDialogForm
					isOpen={isOpenViewOrderStatusMasterFormModal}
					toggleModal={toggleViewOrderStatusMasterFormModal}
					clickedRowData={clickedRowData}
					compType="view"
					getAllOrderStatus={getAllOrderStatus}
				/>
			)}

			{isOpenEditOrderStatusMasterFormModal && (
				<OrderStatusMasterDialogForm
					isOpen={isOpenEditOrderStatusMasterFormModal}
					toggleModal={toggleEditOrderStatusMasterFormModal}
					clickedRowData={clickedEditRowData}
					compType="edit"
					getAllOrderStatus={getAllOrderStatus}
				/>
			)}

			{isOpenDeleteOrderStatusMasterFormModal && (
				<OrderStatusMasterFormDeleteAlertForm
					isOpen={isOpenDeleteOrderStatusMasterFormModal}
					toggleModal={toggleDeleteOrderStatusMasterFormModal}
					clickedRowData={clickedDeleteRowData}
					handleAlertForm={handleAlertForm}
				/>
			)}
			{isOpenActiveOrderStatusMasterFormModal && (
				<OrderStatusMasterFormActiveAlertForm
					isOpen={isOpenActiveOrderStatusMasterFormModal}
					toggleModal={toggleActiveOrderStatusMasterFormModal}
					clickedRowData={clickedActiveRowData}
					handleAlertForm={handleActiveAlertForm}
				/>
			)}
		</div>
	);
}

export default OrderStatusMasterForm;
