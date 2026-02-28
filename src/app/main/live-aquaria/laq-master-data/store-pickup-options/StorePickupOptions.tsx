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
import StorePickupOptionsDialogForm from './components/StorePickupOptionsDialogForm';
import StorePickupOptionsDeleteAlertForm from './components/StorePickupOptionsDeleteAlertForm';
import {
	createStorePickupOptions,
	deleteStorePickupOptions,
	getAllStorePickupOptions,
	updateStorePickupOptions
} from '../../../../axios/services/live-aquaria-services/master-data-services/MasterDataServices';
import {
	PickupOptions,
	PickupOptionsType,
	PickupOptionsModifiedData,
	PickupOptionsCreateData
} from './store-pickup-options-types/StorePickupOptionsTypes';
import MaterialTableWrapper from '../../../../common/tableComponents/MaterialTableWrapper';
import TextFormField from '../../../../common/FormComponents/FormTextField';
import NavigationViewComp from '../../../../common/FormComponents/NavigationViewComp';
import StorePickupOptionsActiveAlertForm from './components/StorePickupOptionsActiveAlertForm';

interface ErrorResponse {
	response?: {
		data?: {
			message?: string;
		};
	};
}

function StorePickupOptions() {
	const { t } = useTranslation('storePickupOptions');
	const [pageNo, setPageNo] = useState<number>(0);
	const [pageSize, setPageSize] = useState<number>(5);
	const [count, setCount] = useState(100);
	const [isTableLoading, setTableLoading] = useState(false);
	const [tableData, setTableData] = useState([]);
	const [tableRowData, setTableRowData] = useState({});
	const [isStorePickupOptionsDataLoading, setStorePickupOptionsDataLoading] = useState(false);
	const [clickedRowData, setClickedRowData] = useState({});
	const [clickedEditRowData, setClickedEditRowData] = useState({} as PickupOptionsModifiedData);
	const [clickedDeleteRowData, setClickedDeleteRowData] = useState({} as PickupOptionsModifiedData);
	const [clickedActiveRowData, setClickedActiveRowData] = useState({} as PickupOptionsModifiedData);
	const [isOpenViewStorePickupOptionsModal, setOpenViewStorePickupOptionsModal] = useState(false);
	const [isOpenEditStorePickupOptionsModal, setOpenEditStorePickupOptionsModal] = useState(false);
	const [isOpenDeleteStorePickupOptionsModal, setOpenDeleteStorePickupOptionsModal] = useState(false);
	const [isOpenActiveStorePickupOptionsModal, setOpenActiveStorePickupOptionsModal] = useState(false);
	const toggleViewStorePickupOptionsModal = () =>
		setOpenViewStorePickupOptionsModal(!isOpenViewStorePickupOptionsModal);
	const toggleEditStorePickupOptionsModal = () =>
		setOpenEditStorePickupOptionsModal(!isOpenEditStorePickupOptionsModal);
	const toggleDeleteStorePickupOptionsModal = () =>
		setOpenDeleteStorePickupOptionsModal(!isOpenDeleteStorePickupOptionsModal);
	const toggleActiveStorePickupOptionsModal = () =>
		setOpenActiveStorePickupOptionsModal(!isOpenActiveStorePickupOptionsModal);

	useEffect(() => {
		getStorePickupOptions();
	}, [pageNo, pageSize]);

	const tableColumns = [
		{
			title: t('ID'),
			field: 'id'
		},
		{
			title: t('PICKUP_OPTION'),
			field: 'pickupOption'
		},
		{
			title: t('ACTIVE'),
			field: 'active',
			render: (rowData: PickupOptionsModifiedData, index) => (
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

	const getStorePickupOptions = async () => {
		setTableLoading(true);
		try {
			const response: PickupOptionsType = await getAllStorePickupOptions(pageNo, pageSize);
			setCount(response.meta.total);
			const data1: PickupOptions[] = response.data;
			const modifiedData: PickupOptionsModifiedData[] = data1.map((item: PickupOptions) => ({
				id: item.id,
				pickupOption: item.option,
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

	const handlePageChange = (page: number) => {
		setPageNo(page);
	};

	const handlePageSizeChange = (pageSize: number) => {
		setPageSize(pageSize);
	};

	// Switch

	const handleSwitchChange = (index, rowData: PickupOptionsModifiedData) => async (event) => {
		setClickedActiveRowData(rowData);
		toggleActiveStorePickupOptionsModal();
	};

	const schema = yup.object().shape({
		pickupOption: yup.string().required(t('Store pickup option is required'))
	});

	const onSubmit = async (values: PickupOptionsCreateData, formikHelpers: FormikHelpers<PickupOptionsCreateData>) => {
		const { resetForm } = formikHelpers;
		setStorePickupOptionsDataLoading(true);
		const requestData = {
			option: values.pickupOption ? values.pickupOption : '',
			is_active: 1
		};
		try {
			const response = await createStorePickupOptions(requestData);
			setStorePickupOptionsDataLoading(false);
			getStorePickupOptions();
			toast.success('Created Successfully');
			resetForm();
		} catch (error) {
			setStorePickupOptionsDataLoading(false);
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

	const handleClearForm = (resetForm: FormikHelpers<PickupOptionsCreateData>['resetForm']) => {
		resetForm();
	};

	const tableRowViewHandler = (rowData: PickupOptionsModifiedData) => {
		setClickedRowData(rowData);
		toggleViewStorePickupOptionsModal();
	};

	const tableRowEditHandler = (rowData: PickupOptionsModifiedData) => {
		setClickedEditRowData(rowData);
		toggleEditStorePickupOptionsModal();
	};

	const tableRowDeleteHandler = (rowData: PickupOptionsModifiedData) => {
		setClickedDeleteRowData(rowData);
		toggleDeleteStorePickupOptionsModal();
	};

	const handleAlertForm = async () => {
		const reasonId: number | '' = clickedDeleteRowData.id ? clickedDeleteRowData.id : '';

		try {
			const response = await deleteStorePickupOptions(reasonId);
			getStorePickupOptions();
			toggleDeleteStorePickupOptionsModal();
			toast.success('Deleted Successfully');
		} catch (error) {
			toggleDeleteStorePickupOptionsModal();
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
			const response = await updateStorePickupOptions(requestData, reasonId);
			toggleActiveStorePickupOptionsModal();
			getStorePickupOptions();

			if (requestData.is_active === 1) {
				toast.success('Activated Successfully');
			} else {
				toast.success('Inactivated Successfully');
			}
		} catch (error) {
			toggleActiveStorePickupOptionsModal();
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
			<NavigationViewComp title="Store Pickup Options" />

			<Formik
				initialValues={{
					pickupOption: ''
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
									{t('Store Pickup Option')}
									<span className="text-red"> *</span>
								</Typography>
								<Field
									disabled={false}
									name="pickupOption"
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
									{isStorePickupOptionsDataLoading ? (
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

			{isOpenViewStorePickupOptionsModal && (
				<StorePickupOptionsDialogForm
					isOpen={isOpenViewStorePickupOptionsModal}
					toggleModal={toggleViewStorePickupOptionsModal}
					clickedRowData={clickedRowData}
					compType="view"
					getStorePickupOptions={getStorePickupOptions}
				/>
			)}

			{isOpenEditStorePickupOptionsModal && (
				<StorePickupOptionsDialogForm
					isOpen={isOpenEditStorePickupOptionsModal}
					toggleModal={toggleEditStorePickupOptionsModal}
					clickedRowData={clickedEditRowData}
					compType="edit"
					getStorePickupOptions={getStorePickupOptions}
				/>
			)}

			{isOpenDeleteStorePickupOptionsModal && (
				<StorePickupOptionsDeleteAlertForm
					isOpen={isOpenDeleteStorePickupOptionsModal}
					toggleModal={toggleDeleteStorePickupOptionsModal}
					clickedRowData={clickedDeleteRowData}
					handleAlertForm={handleAlertForm}
				/>
			)}
			{isOpenActiveStorePickupOptionsModal && (
				<StorePickupOptionsActiveAlertForm
					isOpen={isOpenActiveStorePickupOptionsModal}
					toggleModal={toggleActiveStorePickupOptionsModal}
					clickedRowData={clickedActiveRowData}
					handleAlertForm={handleActiveAlertForm}
				/>
			)}
		</div>
	);
}

export default StorePickupOptions;
