import { Button } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Grid from '@mui/material/Grid';
import Switch from '@mui/material/Switch';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import {
	deleteGuaranteeOptions,
	getAllGuaranteeOptionsWithPagination,
	updateGuaranteeOptions
} from '../../../../axios/services/live-aquaria-services/master-data-services/MasterDataServices';
import NavigationViewComp from '../../../../common/FormComponents/NavigationViewComp';
import MaterialTableWrapper from '../../../../common/tableComponents/MaterialTableWrapper';
import GuaranteeOptionsActiveAlertForm from './components/GuaranteeOptionsActiveAlertForm';
import GuaranteeOptionsDeleteAlertForm from './components/GuaranteeOptionsDeleteAlertForm';
import NewGuaranteeOptionsDialogForm from './components/NewGuaranteeOptionsDialogForm';
import ViewGuaranteeOptionsDialogForm from './components/ViewGuaranteeOptionsDialogForm';
import {
	GuaranteeOptionsDataType,
	GuaranteeOptionType,
	ModifiedGuaranteeOptionsDataType
} from './guarantee-options-types/GuaranteeOptions';

interface ErrorResponse {
	response?: {
		data?: {
			message?: string;
		};
	};
}

function GuaranteeOptions() {
	const { t } = useTranslation('guaranteeOptions');
	const [pageNo, setPageNo] = useState<number>(0);
	const [pageSize, setPageSize] = useState<number>(5);
	const [count, setCount] = useState(100);
	const [isTableLoading, setTableLoading] = useState(false);
	const [tableData, setTableData] = useState([]);
	const [tableRowData, setTableRowData] = useState({});
	const [tableViewRowData, setTableViewRowData] = useState({});
	const [tableEditRowData, setTableEditRowData] = useState({});
	const [tableActiveRowData, setTableActiveRowData] = useState({} as ModifiedGuaranteeOptionsDataType);
	const [isOpenNewPackingMaterialsModal, setOpenNewPackingMaterialsModal] = useState(false);
	const [isOpenViewPackingMaterialsModal, setOpenViewPackingMaterialsModal] = useState(false);
	const [isOpenEditPackingMaterialsModal, setOpenEditPackingMaterialsModal] = useState(false);
	const [isOpenActivePackingMaterialsModal, setOpenActivePackingMaterialsModal] = useState(false);
	const [isOpenDeletePackingMaterialsModal, setOpenDeletePackingMaterialsModal] = useState(false);
	const [clickedDeleteRowData, setClickedDeleteRowData] = useState({} as ModifiedGuaranteeOptionsDataType);
	const toggleNewPackingMaterialsModal = () => setOpenNewPackingMaterialsModal(!isOpenNewPackingMaterialsModal);
	const toggleViewPackingMaterialsModal = () => setOpenViewPackingMaterialsModal(!isOpenViewPackingMaterialsModal);
	const toggleEditPackingMaterialsModal = () => setOpenEditPackingMaterialsModal(!isOpenEditPackingMaterialsModal);
	const toggleDeletePackingMaterialsModal = () =>
		setOpenDeletePackingMaterialsModal(!isOpenDeletePackingMaterialsModal);
	const toggleActivePackingMaterialsModal = () =>
		setOpenActivePackingMaterialsModal(!isOpenActivePackingMaterialsModal);

	useEffect(() => {
		getAllGuaranteeOptions();
	}, [pageNo, pageSize]);

	const tableColumns = [
		{
			title: t('GUARANTEE_NAME'),
			field: 'guaranteeName'
		},
		{
			title: t('DESCRIPTION'),
			field: 'description',
			cellStyle: {
				whiteSpace: 'pre-wrap',
				wordBreak: 'break-word',
				minWidth: '600px',
				maxWidth: '600px'
			},
			headerStyle: {
				minWidth: '600px',
				maxWidth: '600px',
				whiteSpace: 'nowrap'
			},
			render: (rowData: ModifiedGuaranteeOptionsDataType, index) => (
				<div style={{ whiteSpace: 'pre-wrap' }}>{rowData.description}</div>
			)
		},
		{
			title: t('ACTIVE'),
			field: 'active',
			render: (rowData: ModifiedGuaranteeOptionsDataType, index) => (
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

	const getAllGuaranteeOptions = async () => {
		setTableLoading(true);
		try {
			const response: GuaranteeOptionsDataType = await getAllGuaranteeOptionsWithPagination(pageNo, pageSize);
			setCount(response.meta.total);
			const data1: GuaranteeOptionType[] = response.data;
			const modifiedData: ModifiedGuaranteeOptionsDataType[] = data1.map((item: GuaranteeOptionType) => ({
				id: item.id,
				guaranteeName: item.name,
				description: item.descriptions,
				attachment: item.attachment,
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

	const handleSwitchChange = (index, rowData: ModifiedGuaranteeOptionsDataType) => (event) => {
		setTableActiveRowData(rowData);
		toggleActivePackingMaterialsModal();
	};

	const handleOpenNewPackingMaterialModal = () => {
		toggleNewPackingMaterialsModal();
	};

	const tableRowViewHandler = (rowData: ModifiedGuaranteeOptionsDataType) => {
		setTableViewRowData(rowData);
		toggleViewPackingMaterialsModal();
	};

	const tableRowEditHandler = (rowData: ModifiedGuaranteeOptionsDataType) => {
		setTableEditRowData(rowData);
		toggleEditPackingMaterialsModal();
	};

	const tableRowDeleteHandler = (rowData: ModifiedGuaranteeOptionsDataType) => {
		setClickedDeleteRowData(rowData);
		toggleDeletePackingMaterialsModal();
	};

	const handleAlertForm = async () => {
		const id: string = clickedDeleteRowData.id ? clickedDeleteRowData.id : '';

		try {
			const response = await deleteGuaranteeOptions(id);
			toast.success('Deleted Successfully');
			getAllGuaranteeOptions();
			toggleDeletePackingMaterialsModal();
		} catch (error) {
			toggleDeletePackingMaterialsModal();
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
		const id: string = tableActiveRowData.id ? tableActiveRowData.id : '';
		const requestData = {
			name: tableActiveRowData.guaranteeName,
			is_active: tableActiveRowData.active === true ? 0 : 1
		};
		toggleActivePackingMaterialsModal();
		try {
			const response = await updateGuaranteeOptions(requestData, id);
			getAllGuaranteeOptions();

			if (requestData.is_active === 1) {
				toast.success('Activated Successfully');
			} else {
				toast.success('Inactivated Successfully');
			}
		} catch (error) {
			toggleActivePackingMaterialsModal();
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
			<NavigationViewComp title="Guarantee Options" />
			<Grid
				container
				spacing={2}
				className="pt-[10px] pr-[30px] mx-auto"
			>
				<Grid
					item
					xs={12}
					className="flex justify-end items-center gap-[10px] pt-[5px!important]"
				>
					<Button
						className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
						type="button"
						variant="contained"
						size="medium"
						disabled={false}
						onClick={handleOpenNewPackingMaterialModal}
					>
						{t('New Guarantee Option')}
					</Button>
				</Grid>
			</Grid>

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

			{isOpenNewPackingMaterialsModal && (
				<NewGuaranteeOptionsDialogForm
					isOpen={isOpenNewPackingMaterialsModal}
					toggleModal={toggleNewPackingMaterialsModal}
					getAllGuaranteeOptions={getAllGuaranteeOptions}
					compType=""
				/>
			)}

			{isOpenViewPackingMaterialsModal && (
				<ViewGuaranteeOptionsDialogForm
					isOpen={isOpenViewPackingMaterialsModal}
					toggleModal={toggleViewPackingMaterialsModal}
					getAllGuaranteeOptions={getAllGuaranteeOptions}
					clickedRowData={tableViewRowData}
					compType="view"
				/>
			)}

			{isOpenEditPackingMaterialsModal && (
				<ViewGuaranteeOptionsDialogForm
					isOpen={isOpenEditPackingMaterialsModal}
					toggleModal={toggleEditPackingMaterialsModal}
					getAllGuaranteeOptions={getAllGuaranteeOptions}
					clickedRowData={tableEditRowData}
					compType="edit"
				/>
			)}

			{isOpenDeletePackingMaterialsModal && (
				<GuaranteeOptionsDeleteAlertForm
					isOpen={isOpenDeletePackingMaterialsModal}
					toggleModal={toggleDeletePackingMaterialsModal}
					clickedRowData={clickedDeleteRowData}
					handleAlertForm={handleAlertForm}
				/>
			)}

			{isOpenActivePackingMaterialsModal && (
				<GuaranteeOptionsActiveAlertForm
					isOpen={isOpenActivePackingMaterialsModal}
					toggleModal={toggleActivePackingMaterialsModal}
					clickedRowData={tableActiveRowData}
					handleAlertForm={handleActiveAlertForm}
				/>
			)}
		</div>
	);
}

export default GuaranteeOptions;
