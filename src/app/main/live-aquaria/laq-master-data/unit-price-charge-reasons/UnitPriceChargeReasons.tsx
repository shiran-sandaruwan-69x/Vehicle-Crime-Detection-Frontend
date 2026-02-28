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
import UnitPriceChargeReasonsDialogForm from './components/UnitPriceChargeReasonsDialogForm';
import UnitPriceChargeReasonDeleteAlertForm from './components/UnitPriceChargeReasonDeleteAlertForm';
import {
	createUnitPriceCharge,
	deleteUnitPriceCharge,
	getAllUnitPriceCharge,
	updateUnitPriceCharge
} from '../../../../axios/services/live-aquaria-services/master-data-services/MasterDataServices';
import {
	UnitPriceCharge,
	UnitPriceChargeCreateData,
	UnitPriceChargeModifiedData,
	UnitPriceChargeType
} from './unit-price-charge-reasons-types/UnitPriceChargeReasonsType';
import MaterialTableWrapper from '../../../../common/tableComponents/MaterialTableWrapper';
import TextFormField from '../../../../common/FormComponents/FormTextField';
import NavigationViewComp from '../../../../common/FormComponents/NavigationViewComp';
import UnitPriceChargeReasonActiveAlertForm from './components/UnitPriceChargeReasonActiveAlertForm';

interface ErrorResponse {
	response?: {
		data?: {
			message?: string;
		};
	};
}

function UnitPriceChargeReasons() {
	const { t } = useTranslation('unitPriceChargeReasons');
	const [pageNo, setPageNo] = useState<number>(0);
	const [pageSize, setPageSize] = useState<number>(5);
	const [count, setCount] = useState(100);
	const [isTableLoading, setTableLoading] = useState(false);
	const [tableData, setTableData] = useState([]);
	const [tableRowData, setTableRowData] = useState({});
	const [isUnitPriceChargeReasonsDataLoading, setUnitPriceChargeReasonsDataLoading] = useState(false);
	const [clickedRowData, setClickedRowData] = useState({});
	const [clickedEditRowData, setClickedEditRowData] = useState({});
	const [clickedDeleteRowData, setClickedDeleteRowData] = useState({} as UnitPriceChargeModifiedData);
	const [clickedActiveRowData, setClickedActiveRowData] = useState({} as UnitPriceChargeModifiedData);
	const [isOpenViewUnitPriceChargeReasonsModal, setOpenViewUnitPriceChargeReasonsModal] = useState(false);
	const [isOpenEditUnitPriceChargeReasonsModal, setOpenEditUnitPriceChargeReasonsModal] = useState(false);
	const [isOpenDeleteUnitPriceChargeReasonsModal, setOpenDeleteUnitPriceChargeReasonsModal] = useState(false);
	const [isOpenActiveUnitPriceChargeReasonsModal, setOpenActiveUnitPriceChargeReasonsModal] = useState(false);
	const toggleViewUnitPriceChargeReasonsModal = () =>
		setOpenViewUnitPriceChargeReasonsModal(!isOpenViewUnitPriceChargeReasonsModal);
	const toggleEditUnitPriceChargeReasonsModal = () =>
		setOpenEditUnitPriceChargeReasonsModal(!isOpenEditUnitPriceChargeReasonsModal);
	const toggleDeleteUnitPriceChargeReasonsModal = () =>
		setOpenDeleteUnitPriceChargeReasonsModal(!isOpenDeleteUnitPriceChargeReasonsModal);
	const toggleActiveUnitPriceChargeReasonsModal = () =>
		setOpenActiveUnitPriceChargeReasonsModal(!isOpenActiveUnitPriceChargeReasonsModal);

	useEffect(() => {
		getUnitPriceCharge();
	}, [pageNo, pageSize]);

	const tableColumns = [
		{
			title: t('ID'),
			field: 'id'
		},
		{
			title: t('REASON'),
			field: 'reason'
		},
		{
			title: t('ACTIVE'),
			field: 'active',
			render: (rowData: UnitPriceChargeModifiedData, index) => (
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

	const getUnitPriceCharge = async () => {
		setTableLoading(true);
		try {
			const response: UnitPriceChargeType = await getAllUnitPriceCharge(pageNo, pageSize);
			setCount(response.meta.total);
			const data1: UnitPriceCharge[] = response.data;
			const modifiedData: UnitPriceChargeModifiedData[] = data1.map((item: UnitPriceCharge) => ({
				id: item.id,
				reason: item.reason,
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

	const handleSwitchChange = (index, rowData: UnitPriceChargeModifiedData) => async (event) => {
		setClickedActiveRowData(rowData);
		toggleActiveUnitPriceChargeReasonsModal();
	};

	const schema = yup.object().shape({
		unitPriceChargeReason: yup.string().required(t('Unit price change reason is required'))
	});

	const onSubmit = async (
		values: UnitPriceChargeCreateData,
		formikHelpers: FormikHelpers<UnitPriceChargeCreateData>
	) => {
		const { resetForm } = formikHelpers;
		setUnitPriceChargeReasonsDataLoading(true);
		const requestData = {
			reason: values.unitPriceChargeReason ? values.unitPriceChargeReason : '',
			is_active: 1
		};
		try {
			const response = await createUnitPriceCharge(requestData);
			setUnitPriceChargeReasonsDataLoading(false);
			getUnitPriceCharge();
			toast.success('Created Successfully');
			resetForm();
		} catch (error) {
			setUnitPriceChargeReasonsDataLoading(false);
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

	const handleClearForm = (resetForm: FormikHelpers<UnitPriceChargeCreateData>['resetForm']) => {
		resetForm();
	};

	const tableRowViewHandler = (rowData: UnitPriceChargeModifiedData) => {
		setClickedRowData(rowData);
		toggleViewUnitPriceChargeReasonsModal();
	};

	const tableRowEditHandler = (rowData: UnitPriceChargeModifiedData) => {
		setClickedEditRowData(rowData);
		toggleEditUnitPriceChargeReasonsModal();
	};

	const tableRowDeleteHandler = (rowData: UnitPriceChargeModifiedData) => {
		setClickedDeleteRowData(rowData);
		toggleDeleteUnitPriceChargeReasonsModal();
	};

	const handleAlertForm = async () => {
		const reasonId: number | '' = clickedDeleteRowData.id ? clickedDeleteRowData.id : '';

		try {
			const response = await deleteUnitPriceCharge(reasonId);
			getUnitPriceCharge();
			toggleDeleteUnitPriceChargeReasonsModal();
			toast.success('Deleted Successfully');
		} catch (error) {
			toggleDeleteUnitPriceChargeReasonsModal();
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
			const response = await updateUnitPriceCharge(requestData, reasonId);
			toggleActiveUnitPriceChargeReasonsModal();
			getUnitPriceCharge();

			if (requestData.is_active === 1) {
				toast.success('Activated Successfully');
			} else {
				toast.success('Inactivated Successfully');
			}
		} catch (error) {
			toggleActiveUnitPriceChargeReasonsModal();
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
			<NavigationViewComp title="Unit Price Change Reasons" />

			<Formik
				initialValues={{
					unitPriceChargeReason: ''
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
									{t('UNIT_PRICE_CHARGE_REASON')}
									<span className="text-red"> *</span>
								</Typography>
								<Field
									disabled={false}
									name="unitPriceChargeReason"
									placeholder={t('')}
									component={TextFormField}
									fullWidth
									size="small"
								/>
							</Grid>

							<Grid
								item
								lg={9}
								md={8}
								sm={6}
								xs={12}
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
									{isUnitPriceChargeReasonsDataLoading ? (
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
						disableSearch={false}
					/>
				</Grid>
			</Grid>

			{isOpenViewUnitPriceChargeReasonsModal && (
				<UnitPriceChargeReasonsDialogForm
					isOpen={isOpenViewUnitPriceChargeReasonsModal}
					toggleModal={toggleViewUnitPriceChargeReasonsModal}
					clickedRowData={clickedRowData}
					compType="view"
					getUnitPriceCharge={getUnitPriceCharge}
				/>
			)}

			{isOpenEditUnitPriceChargeReasonsModal && (
				<UnitPriceChargeReasonsDialogForm
					isOpen={isOpenEditUnitPriceChargeReasonsModal}
					toggleModal={toggleEditUnitPriceChargeReasonsModal}
					clickedRowData={clickedEditRowData}
					compType="edit"
					getUnitPriceCharge={getUnitPriceCharge}
				/>
			)}

			{isOpenDeleteUnitPriceChargeReasonsModal && (
				<UnitPriceChargeReasonDeleteAlertForm
					isOpen={isOpenDeleteUnitPriceChargeReasonsModal}
					toggleModal={toggleDeleteUnitPriceChargeReasonsModal}
					clickedRowData={clickedDeleteRowData}
					handleAlertForm={handleAlertForm}
				/>
			)}
			{isOpenActiveUnitPriceChargeReasonsModal && (
				<UnitPriceChargeReasonActiveAlertForm
					isOpen={isOpenActiveUnitPriceChargeReasonsModal}
					toggleModal={toggleActiveUnitPriceChargeReasonsModal}
					clickedRowData={clickedActiveRowData}
					handleAlertForm={handleActiveAlertForm}
				/>
			)}
		</div>
	);
}

export default UnitPriceChargeReasons;
