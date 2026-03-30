import { Button, CircularProgress } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Grid from '@mui/material/Grid';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import {
	createOrderReason, createOrderReason3,
	deleteOrderReason,
	getAllCancelOrderReasons,
	updateOrderReason
} from '../../../../axios/services/live-aquaria-services/master-data-services/MasterDataServices';
import TextFormField from '../../../../common/FormComponents/FormTextField';
import NavigationViewComp from '../../../../common/FormComponents/NavigationViewComp';
import MaterialTableWrapper from '../../../../common/tableComponents/MaterialTableWrapper';
import {
	Reason,
	ReasonCreateData,
	ReasonModifiedData,
	ReasonType
} from './cancel-order-reason-types/CancelOrderReasonTypes';
import CancelOrderReasonActiveAlertForm from './components/CancelOrderReasonActiveAlertForm';
import CancelOrderReasonDeleteAlertForm from './components/CancelOrderReasonDeleteAlertForm';
import NewCancelOrderReasonsDialogForm from './components/CancelOrderReasonsDialogForm';

interface ErrorResponse {
	response?: {
		data?: {
			message?: string;
		};
	};
}

function CancelOrderReasons() {
	const { t } = useTranslation('cancelOrderReasons');
	const [pageNo, setPageNo] = useState<number>(0);
	const [pageSize, setPageSize] = useState<number>(5);
	const [count, setCount] = useState(100);
	const [isTableLoading, setTableLoading] = useState(false);
	const [tableData, setTableData] = useState([]);
	const [tableRowData, setTableRowData] = useState({});
	const [isCancelOrderReasonsDataLoading, setCancelOrderReasonsDataLoading] = useState(false);
	const [clickedRowData, setClickedRowData] = useState({} as ReasonModifiedData);
	const [clickedEditRowData, setClickedEditRowData] = useState({} as ReasonModifiedData);
	const [clickedDeleteRowData, setClickedDeleteRowData] = useState({} as ReasonModifiedData);
	const [clickedActiveRowData, setClickedActiveRowData] = useState({} as ReasonModifiedData);
	const [isOpenViewOrderReasonsModal, setOpenViewOrderReasonsModal] = useState(false);
	const [isOpenEditOrderReasonsModal, setOpenEditOrderReasonsModal] = useState(false);
	const [isOpenDeleteOrderReasonsModal, setOpenDeleteOrderReasonsModal] = useState(false);
	const [isOpenActiveOrderReasonsModal, setOpenActiveOrderReasonsModal] = useState(false);
	const toggleViewOrderReasonsModal = () => setOpenViewOrderReasonsModal(!isOpenViewOrderReasonsModal);
	const toggleEditOrderReasonsModal = () => setOpenEditOrderReasonsModal(!isOpenEditOrderReasonsModal);
	const toggleDeleteOrderReasonsModal = () => setOpenDeleteOrderReasonsModal(!isOpenDeleteOrderReasonsModal);
	const toggleActiveOrderReasonsModal = () => setOpenActiveOrderReasonsModal(!isOpenActiveOrderReasonsModal);

	useEffect(() => {
		getCancelOrderReasons();
	}, []);

	const tableColumns = [
		{
			title: t('System Alert Priority'),
			field: 'systemAlertPriority'
		},
		{
			title: t('System Alert Priority Code'),
			field: 'systemAlertPriorityCode'
		},
		{
			title: t('ACTIVE'),
			field: 'is_active',
			render: (rowData: any) => {
				return rowData.is_active === 1 ? 'Active' : 'Inactive';
			}
		}
	];

	const getCancelOrderReasons = async () => {
		setTableLoading(true);
		try {
			const response: any = await getAllCancelOrderReasons();
			const data1: any[] = response;
			const modifiedData: ReasonModifiedData[] = data1.map((item: any) => ({
				...item,
				is_active: item?.status == true ? 1 : 0,
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

	const handlePageChange = (page: number) => {
		setPageNo(page);
	};

	const handlePageSizeChange = (pageSize: number) => {
		setPageSize(pageSize);
	};

	// Switch

	const handleSwitchChange = (index, rowData: ReasonModifiedData) => async (event) => {
		setClickedActiveRowData(rowData);
		toggleActiveOrderReasonsModal();
	};

	const schema = yup.object().shape({
		systemAlertPriority: yup.string().required(t('System Alert Priority is required')),
		systemAlertPriorityCode: yup.string().required(t('System Alert Priority Code is required'))
	});

	const onSubmit = async (values: any, formikHelpers: FormikHelpers<ReasonCreateData>) => {
		const { resetForm } = formikHelpers;
		setCancelOrderReasonsDataLoading(true);
		const requestData = {
			systemAlertPriority: values.systemAlertPriority ? values.systemAlertPriority : '',
			systemAlertPriorityCode: values.systemAlertPriorityCode ? values.systemAlertPriorityCode : '',
			status: 1
		};
		try {
			const response = await createOrderReason3(requestData);
			getCancelOrderReasons();
			setCancelOrderReasonsDataLoading(false);
			toast.success('Created Successfully');
			resetForm();
		} catch (error) {
			setCancelOrderReasonsDataLoading(false);
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

	const handleClearForm = (resetForm: FormikHelpers<ReasonCreateData>['resetForm']) => {
		resetForm();
	};

	const tableRowViewHandler = (rowData: ReasonModifiedData) => {
		setClickedRowData(rowData);
		toggleViewOrderReasonsModal();
	};

	const tableRowEditHandler = (rowData: ReasonModifiedData) => {
		setClickedEditRowData(rowData);
		toggleEditOrderReasonsModal();
	};

	const tableRowDeleteHandler = (rowData: ReasonModifiedData) => {
		setClickedDeleteRowData(rowData);
		toggleDeleteOrderReasonsModal();
	};

	const handleAlertForm = async () => {
		const reasonId = clickedDeleteRowData.id ? clickedDeleteRowData.id : '';

		try {
			const response = await deleteOrderReason(reasonId);
			getCancelOrderReasons();
			toggleDeleteOrderReasonsModal();
			toast.success('Deleted Successfully');
		} catch (error) {
			toggleDeleteOrderReasonsModal();
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

	const handleActiveInactiveAlertForm = async () => {
		const reasonId = clickedActiveRowData.id ? clickedActiveRowData.id : '';
		const requestData = {
			is_active: clickedActiveRowData.active === true ? 0 : 1
		};

		try {
			const response = await updateOrderReason(requestData, reasonId);
			toggleActiveOrderReasonsModal();
			getCancelOrderReasons();

			if (requestData.is_active === 1) {
				toast.success('Activated Successfully');
			} else {
				toast.success('Inactivated Successfully');
			}
		} catch (error) {
			toggleActiveOrderReasonsModal();
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
			<NavigationViewComp title="Master Data / System Alert Priority" />
			<Formik
				initialValues={{
					systemAlertPriority: '',
					systemAlertPriorityCode: '',
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
									{t('System Alert Priority')}
									<span className="text-red"> *</span>
								</Typography>
								<Field
									disabled={false}
									name="systemAlertPriority"
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
								md={4}
								lg={3}
								className="formikFormField pt-[5px!important]"
							>
								<Typography className="formTypography">
									{t('System Alert Priority Code')}
									<span className="text-red"> *</span>
								</Typography>
								<Field
									disabled={false}
									name="systemAlertPriorityCode"
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
								md={6}
								lg={6}
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
									{isCancelOrderReasonsDataLoading ? (
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
						//tableRowDeleteHandler={tableRowDeleteHandler}
						disableSearch={false}
					/>
				</Grid>
			</Grid>

			{isOpenViewOrderReasonsModal && (
				<NewCancelOrderReasonsDialogForm
					isOpen={isOpenViewOrderReasonsModal}
					toggleModal={toggleViewOrderReasonsModal}
					clickedRowData={clickedRowData}
					compType="view"
					getCancelOrderReasons={getCancelOrderReasons}
				/>
			)}

			{isOpenEditOrderReasonsModal && (
				<NewCancelOrderReasonsDialogForm
					isOpen={isOpenEditOrderReasonsModal}
					toggleModal={toggleEditOrderReasonsModal}
					clickedRowData={clickedEditRowData}
					compType="edit"
					getCancelOrderReasons={getCancelOrderReasons}
				/>
			)}

			{isOpenDeleteOrderReasonsModal && (
				<CancelOrderReasonDeleteAlertForm
					isOpen={isOpenDeleteOrderReasonsModal}
					toggleModal={toggleDeleteOrderReasonsModal}
					clickedRowData={clickedDeleteRowData}
					handleAlertForm={handleAlertForm}
				/>
			)}

			{isOpenActiveOrderReasonsModal && (
				<CancelOrderReasonActiveAlertForm
					isOpen={isOpenActiveOrderReasonsModal}
					toggleModal={toggleActiveOrderReasonsModal}
					clickedRowData={clickedActiveRowData}
					handleAlertForm={handleActiveInactiveAlertForm}
				/>
			)}
		</div>
	);
}

export default CancelOrderReasons;
