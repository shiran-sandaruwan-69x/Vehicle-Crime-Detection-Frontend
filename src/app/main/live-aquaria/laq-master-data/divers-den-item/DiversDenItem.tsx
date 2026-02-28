import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Button, CircularProgress } from '@mui/material';
import TextFormField from '../../../../common/FormComponents/FormTextField';
import NavigationViewComp from '../../../../common/FormComponents/NavigationViewComp';

import { Reason } from '../cancel-order-reasons/cancel-order-reason-types/CancelOrderReasonTypes';
import MaterialTableWrapper from '../../../../common/tableComponents/MaterialTableWrapper';
import DiversDenItemReasonsDialogForm from './components/DiversDenItemReasonsDialogForm';
import DiversDenItemReasonDeleteAlertForm from './components/DiversDenItemReasonDeleteAlertForm';
import DiversDenItemReasonActiveAlertForm from './components/DiversDenItemReasonActiveAlertForm';
import {
	createDiversDenItemDelete,
	DiversDenItemDeleteReason,
	DiversDenItemDeleteReasonModifiedData,
	DiversDenItemDeleteReasonType
} from './divers-den-item-types/DiversDenItemTypes';
import {
	createDiversDenItemDeleteReason,
	deleteDiversDenItemDeleteReason,
	getAllDiversDenItemDeleteReason,
	updateDiversDenItemDeleteReason
} from '../../../../axios/services/live-aquaria-services/divers-advertisements-services/DiversAdvertisementsService';

interface ErrorResponse {
	response?: {
		data?: {
			message?: string;
		};
	};
}

function DiversDenItem() {
	const { t } = useTranslation('diversDenItem');
	const [pageNo, setPageNo] = useState<number>(0);
	const [pageSize, setPageSize] = useState<number>(5);
	const [count, setCount] = useState(100);
	const [isTableLoading, setTableLoading] = useState(false);
	const [tableData, setTableData] = useState([]);
	const [tableRowData, setTableRowData] = useState({});
	const [isDiversDenItemDeletionDataLoading, setDiversDenItemDeletionDataLoading] = useState(false);
	const [clickedRowData, setClickedRowData] = useState({} as DiversDenItemDeleteReasonModifiedData);
	const [clickedEditRowData, setClickedEditRowData] = useState({} as DiversDenItemDeleteReasonModifiedData);
	const [clickedDeleteRowData, setClickedDeleteRowData] = useState({} as DiversDenItemDeleteReasonModifiedData);
	const [clickedActiveRowData, setClickedActiveRowData] = useState({} as DiversDenItemDeleteReasonModifiedData);
	const [isOpenViewDiversDenItemDeletionModal, setOpenViewDiversDenItemDeletionModal] = useState(false);
	const [isOpenEditDiversDenItemDeletionModal, setOpenEditDiversDenItemDeletionModal] = useState(false);
	const [isOpenDeleteDiversDenItemDeletionModal, setOpenDeleteDiversDenItemDeletionModal] = useState(false);
	const [isOpenActiveDiversDenItemDeletionModal, setOpenActiveDiversDenItemDeletionModal] = useState(false);
	const toggleViewDiversDenItemDeletionModal = () =>
		setOpenViewDiversDenItemDeletionModal(!isOpenViewDiversDenItemDeletionModal);
	const toggleEditDiversDenItemDeletionModal = () =>
		setOpenEditDiversDenItemDeletionModal(!isOpenEditDiversDenItemDeletionModal);
	const toggleDeleteDiversDenItemDeletionModal = () =>
		setOpenDeleteDiversDenItemDeletionModal(!isOpenDeleteDiversDenItemDeletionModal);
	const toggleActiveDiversDenItemDeletionModal = () =>
		setOpenActiveDiversDenItemDeletionModal(!isOpenActiveDiversDenItemDeletionModal);

	useEffect(() => {
		getDiversDenItemDeletion();
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
			render: (rowData: DiversDenItemDeleteReasonModifiedData, index) => (
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

	const getDiversDenItemDeletion = async () => {
		setTableLoading(true);
		try {
			const response: DiversDenItemDeleteReasonType = await getAllDiversDenItemDeleteReason(pageNo, pageSize);
			setCount(response.meta.total);
			const data1: DiversDenItemDeleteReason[] = response.data;
			const modifiedData: DiversDenItemDeleteReasonModifiedData[] = data1.map((item: Reason) => ({
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

	const handlePageChange = (page: number) => {
		setPageNo(page);
	};

	const handlePageSizeChange = (pageSize: number) => {
		setPageSize(pageSize);
	};

	// Switch

	const handleSwitchChange = (index, rowData: DiversDenItemDeleteReasonModifiedData) => async (event) => {
		setClickedActiveRowData(rowData);
		toggleActiveDiversDenItemDeletionModal();
	};

	const schema = yup.object().shape({
		diversDenItem: yup.string().required(t('Divers den item deletion reason is required'))
	});

	const onSubmit = async (
		values: createDiversDenItemDelete,
		formikHelpers: FormikHelpers<createDiversDenItemDelete>
	) => {
		const { resetForm } = formikHelpers;
		setDiversDenItemDeletionDataLoading(true);
		const requestData = {
			reason: values.diversDenItem ? values.diversDenItem : '',
			is_active: 1
		};
		try {
			const response = await createDiversDenItemDeleteReason(requestData);
			getDiversDenItemDeletion();
			setDiversDenItemDeletionDataLoading(false);
			toast.success('Created Successfully');
			resetForm();
		} catch (error) {
			setDiversDenItemDeletionDataLoading(false);
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

	const handleClearForm = (resetForm: FormikHelpers<createDiversDenItemDelete>['resetForm']) => {
		resetForm();
	};

	const tableRowViewHandler = (rowData: DiversDenItemDeleteReasonModifiedData) => {
		setClickedRowData(rowData);
		toggleViewDiversDenItemDeletionModal();
	};

	const tableRowEditHandler = (rowData: DiversDenItemDeleteReasonModifiedData) => {
		setClickedEditRowData(rowData);
		toggleEditDiversDenItemDeletionModal();
	};

	const tableRowDeleteHandler = (rowData: DiversDenItemDeleteReasonModifiedData) => {
		setClickedDeleteRowData(rowData);
		toggleDeleteDiversDenItemDeletionModal();
	};

	const handleAlertForm = async () => {
		const reasonId = clickedDeleteRowData.id ? clickedDeleteRowData.id : '';
		toggleDeleteDiversDenItemDeletionModal();
		try {
			const response = await deleteDiversDenItemDeleteReason(reasonId);
			getDiversDenItemDeletion();
			toast.success('Deleted Successfully');
		} catch (error) {
			toggleDeleteDiversDenItemDeletionModal();
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
			const response = await updateDiversDenItemDeleteReason(requestData, reasonId);
			toggleActiveDiversDenItemDeletionModal();
			getDiversDenItemDeletion();

			if (requestData.is_active === 1) {
				toast.success('Activated Successfully');
			} else {
				toast.success('Inactivated Successfully');
			}
		} catch (error) {
			toggleActiveDiversDenItemDeletionModal();
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
			<NavigationViewComp title="Divers Den Item Deletion Reason" />

			<Formik
				initialValues={{
					diversDenItem: ''
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
									{t('DIVERS_DEN_ITEM_DELETION_REASON')}
									<span className="text-red"> *</span>
								</Typography>
								<Field
									disabled={false}
									name="diversDenItem"
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
									{isDiversDenItemDeletionDataLoading ? (
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

			{isOpenViewDiversDenItemDeletionModal && (
				<DiversDenItemReasonsDialogForm
					isOpen={isOpenViewDiversDenItemDeletionModal}
					toggleModal={toggleViewDiversDenItemDeletionModal}
					clickedRowData={clickedRowData}
					compType="view"
					getCancelOrderReasons={getDiversDenItemDeletion}
				/>
			)}

			{isOpenEditDiversDenItemDeletionModal && (
				<DiversDenItemReasonsDialogForm
					isOpen={isOpenEditDiversDenItemDeletionModal}
					toggleModal={toggleEditDiversDenItemDeletionModal}
					clickedRowData={clickedEditRowData}
					compType="edit"
					getCancelOrderReasons={getDiversDenItemDeletion}
				/>
			)}

			{isOpenDeleteDiversDenItemDeletionModal && (
				<DiversDenItemReasonDeleteAlertForm
					isOpen={isOpenDeleteDiversDenItemDeletionModal}
					toggleModal={toggleDeleteDiversDenItemDeletionModal}
					clickedRowData={clickedDeleteRowData}
					handleAlertForm={handleAlertForm}
				/>
			)}

			{isOpenActiveDiversDenItemDeletionModal && (
				<DiversDenItemReasonActiveAlertForm
					isOpen={isOpenActiveDiversDenItemDeletionModal}
					toggleModal={toggleActiveDiversDenItemDeletionModal}
					clickedRowData={clickedActiveRowData}
					handleAlertForm={handleActiveInactiveAlertForm}
				/>
			)}
		</div>
	);
}

export default DiversDenItem;
