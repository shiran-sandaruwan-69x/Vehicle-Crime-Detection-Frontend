import {Button, CircularProgress} from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Grid from '@mui/material/Grid';
import Switch from '@mui/material/Switch';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import {
	createOrderReason,
	deleteBoxCharge,
	getAllBoxCharge,
	updateBoxCharge
} from '../../../../axios/services/live-aquaria-services/master-data-services/MasterDataServices';
import NavigationViewComp from '../../../../common/FormComponents/NavigationViewComp';
import MaterialTableWrapper from '../../../../common/tableComponents/MaterialTableWrapper';
import {
	ModifiedPackingMaterialData,
	PackingMaterialData,
	PackingMaterialType
} from './box-charge-types/BoxChargeTypes';
import BoxChargeActiveAlertForm from './components/BoxChargeActiveAlertForm';
import BoxChargeDeleteAlertForm from './components/BoxChargeDeleteAlertForm';
import NewBoxChargeDialogForm from './components/NewBoxChargeDialogForm';
import {Field, Form, Formik, FormikHelpers} from "formik";
import Typography from "@mui/material/Typography";
import TextFormField from "../../../../common/FormComponents/FormTextField";
import {ReasonCreateData} from "../cancel-order-reasons/cancel-order-reason-types/CancelOrderReasonTypes";
import * as yup from "yup";

interface ErrorResponse {
	response?: {
		data?: {
			message?: string;
		};
	};
}

function BoxCharge() {
	const { t } = useTranslation('boxCharge');
	const [pageNo, setPageNo] = useState<number>(0);
	const [pageSize, setPageSize] = useState<number>(5);
	const [count, setCount] = useState(100);
	const [isTableLoading, setTableLoading] = useState(false);
	const [tableData, setTableData] = useState([]);
	const [tableRowData, setTableRowData] = useState({});
	const [isCancelOrderReasonsDataLoading, setCancelOrderReasonsDataLoading] = useState(false);
	const [tableViewRowData, setViewTableRowData] = useState({});
	const [tableEditRowData, setEditTableRowData] = useState({});
	const [tableActiveRowData, setActiveTableRowData] = useState({} as ModifiedPackingMaterialData);
	const [isOpenNewBoxChargeModal, setOpenNewBoxChargeModal] = useState(false);
	const [isOpenViewBoxChargeModal, setOpenViewBoxChargeModal] = useState(false);
	const [isOpenEditBoxChargeModal, setOpenEditBoxChargeModal] = useState(false);
	const [clickedDeleteRowData, setClickedDeleteRowData] = useState({} as ModifiedPackingMaterialData);
	const [isOpenDeleteBocChargeModal, setOpenDeleteBocChargeModal] = useState(false);
	const [isOpenActiveBocChargeModal, setOpenActiveBocChargeModal] = useState(false);
	const toggleNewBoxChargeModal = () => setOpenNewBoxChargeModal(!isOpenNewBoxChargeModal);
	const toggleViewBoxChargeModal = () => setOpenViewBoxChargeModal(!isOpenViewBoxChargeModal);
	const toggleEditBoxChargeModal = () => setOpenEditBoxChargeModal(!isOpenEditBoxChargeModal);
	const toggleDeleteBoxChargeModal = () => setOpenDeleteBocChargeModal(!isOpenDeleteBocChargeModal);
	const toggleActiveBoxChargeModal = () => setOpenActiveBocChargeModal(!isOpenActiveBocChargeModal);

	useEffect(() => {
		getBoxCharge();
	}, []);

	const tableColumns = [
		{
			title: t('Alert Type'),
			field: 'alertType'
		},
		{
			title: t('Alert Type Code'),
			field: 'alertTypeCode'
		},
		{
			title: t('ACTIVE'),
			field: 'is_active',
			render: (rowData: any) => {
				return rowData.is_active === 1 ? 'Active' : 'Inactive';
			}
		}
	];

	const getBoxCharge = async () => {
		setTableLoading(true);
		try {
			const response: any = await getAllBoxCharge();
			const data1: any[] = response;
			const modifiedData: ModifiedPackingMaterialData[] = data1.map((item: any) => ({
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

	const handleSwitchChange = (index, rowData: ModifiedPackingMaterialData) => async (event) => {
		setActiveTableRowData(rowData);
		toggleActiveBoxChargeModal();
	};

	const handleOpenNewAttributeModal = () => {
		toggleNewBoxChargeModal();
	};

	const tableRowViewHandler = (values: ModifiedPackingMaterialData) => {
		setViewTableRowData(values);
		toggleViewBoxChargeModal();
	};

	const tableRowEditHandler = (values: ModifiedPackingMaterialData) => {
		setEditTableRowData(values);
		toggleEditBoxChargeModal();
	};

	const tableRowDeleteHandler = (rowData: ModifiedPackingMaterialData) => {
		setClickedDeleteRowData(rowData);
		toggleDeleteBoxChargeModal();
	};

	const handleAlertForm = async () => {
		const id = clickedDeleteRowData.id ? clickedDeleteRowData.id : '';

		try {
			const response = await deleteBoxCharge(id);
			getBoxCharge();
			toggleDeleteBoxChargeModal();
			toast.success('Deleted Successfully');
		} catch (error) {
			toggleDeleteBoxChargeModal();
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
		const id = tableActiveRowData.id ? tableActiveRowData.id : '';
		const requestData = {
			name: tableActiveRowData.name,
			packing_type_id: tableActiveRowData.packing_type_id,
			is_active: !tableActiveRowData.active
		};

		try {
			const response = await updateBoxCharge(requestData, id);
			getBoxCharge();
			toggleActiveBoxChargeModal();

			if (requestData.is_active) {
				toast.success('Activated Successfully');
			} else {
				toast.success('Inactivated Successfully');
			}
		} catch (error) {
			toggleActiveBoxChargeModal();
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

	const onSubmit = async (values: any, formikHelpers: FormikHelpers<ReasonCreateData>) => {
		const { resetForm } = formikHelpers;
		setCancelOrderReasonsDataLoading(true);
		const requestData = {
			alertType: values.alertType ? values.alertType : '',
			alertTypeCode: values.alertTypeCode ? values.alertTypeCode : '',
			status: 1
		};
		try {
			const response = await createOrderReason(requestData);
			getBoxCharge();
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

	const schema = yup.object().shape({
		alertType: yup.string().required(t('Alert Type is required')),
		alertTypeCode: yup.string().required(t('Alert Type Code is required'))
	});

	return (
		<div className="min-w-full max-w-[100vw]">
			<NavigationViewComp title="Master Data / Alert Type" />
			<Formik
				initialValues={{
					alertType: '',
					alertTypeCode: '',
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
									{t('Alert Type')}
									<span className="text-red"> *</span>
								</Typography>
								<Field
									disabled={false}
									name="alertType"
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
									{t('Alert Type Code')}
									<span className="text-red"> *</span>
								</Typography>
								<Field
									disabled={false}
									name="alertTypeCode"
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
						//loading={isTableLoading}
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

			{isOpenNewBoxChargeModal && (
				<NewBoxChargeDialogForm
					isOpen={isOpenNewBoxChargeModal}
					toggleModal={toggleNewBoxChargeModal}
					clickedRowData={tableRowData}
					compType=""
					getBoxCharge={getBoxCharge}
				/>
			)}

			{isOpenViewBoxChargeModal && (
				<NewBoxChargeDialogForm
					isOpen={isOpenViewBoxChargeModal}
					toggleModal={toggleViewBoxChargeModal}
					clickedRowData={tableViewRowData}
					compType="view"
					getBoxCharge={getBoxCharge}
				/>
			)}

			{isOpenEditBoxChargeModal && (
				<NewBoxChargeDialogForm
					isOpen={isOpenEditBoxChargeModal}
					toggleModal={toggleEditBoxChargeModal}
					clickedRowData={tableEditRowData}
					compType="edit"
					getBoxCharge={getBoxCharge}
				/>
			)}

			{isOpenDeleteBocChargeModal && (
				<BoxChargeDeleteAlertForm
					isOpen={isOpenDeleteBocChargeModal}
					toggleModal={toggleDeleteBoxChargeModal}
					clickedRowData={clickedDeleteRowData}
					handleAlertForm={handleAlertForm}
				/>
			)}

			{isOpenActiveBocChargeModal && (
				<BoxChargeActiveAlertForm
					isOpen={isOpenActiveBocChargeModal}
					toggleModal={toggleActiveBoxChargeModal}
					clickedRowData={tableActiveRowData}
					handleAlertForm={handleActiveAlertForm}
				/>
			)}
		</div>
	);
}

export default BoxCharge;
