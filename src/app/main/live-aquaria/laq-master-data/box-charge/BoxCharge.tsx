import { Button } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Grid from '@mui/material/Grid';
import Switch from '@mui/material/Switch';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import {
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
	}, [pageNo, pageSize]);

	const tableColumns = [
		{
			title: t('Name'),
			field: 'boxChargeName'
		},
		{
			title: t('TYPE'),
			field: 'type'
		},
		{
			title: t('PRICE'),
			field: 'price',
			render: (rowData: ModifiedPackingMaterialData) =>
				rowData?.price
					? Number(rowData?.price).toLocaleString('en-US', {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2
						})
					: ''
		},
		{
			title: t('ACTIVE'),
			field: 'active',
			render: (rowData: ModifiedPackingMaterialData, index) => (
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

	const getBoxCharge = async () => {
		setTableLoading(true);
		try {
			const response: PackingMaterialType = await getAllBoxCharge(pageNo, pageSize);
			setCount(response.meta.total);
			const data1: PackingMaterialData[] = response.data;
			const modifiedData: ModifiedPackingMaterialData[] = data1.map((item: PackingMaterialData) => ({
				...item,
				boxChargeName: item.name,
				type: item.packing_type_name,
				price: item.charge ? item.charge : item.unit_price,
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

	return (
		<div className="min-w-full max-w-[100vw]">
			<NavigationViewComp title="Packing Material Charge" />
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
						onClick={handleOpenNewAttributeModal}
					>
						{t('Create New Material')}
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
