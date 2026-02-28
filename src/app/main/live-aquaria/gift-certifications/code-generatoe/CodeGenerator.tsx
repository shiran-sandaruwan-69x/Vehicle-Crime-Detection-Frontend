import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	FormControlLabel,
	FormGroup,
	Grid,
	Switch
} from '@mui/material';
import { toast } from 'react-toastify';
import ReportIcon from '@mui/icons-material/Report';
import NavigationViewComp from '../../../../common/FormComponents/NavigationViewComp';
import MaterialTableWrapper from '../../../../common/tableComponents/MaterialTableWrapper';
import NewCodeGenerator from './components/NewCodeGenerator';
import {
	deleteCodeFormat,
	loadAllGeneratedCode,
	updateCodeFormat
} from '../../../../axios/services/live-aquaria-services/gift-certifications/codeGenerator';
import ViewCodeGenerator from './components/ViewCodeGenerator';
import EditCodeGenerator from './components/EditCodeGenerator';
import CodeGeneratorActiveAlertForm from './components/CodeGeneratorActiveAlertForm';
import axios from "axios";
import {CODE_GENERATOR_INACTIVE} from "../../../../axios/services/AdminServices";

interface RowData {
	full_code: string;
	code_name: string;
	created_date: string;
	no_of_digits: number;
	active: boolean;
	tableData?: {
		id: number;
	};
}

interface ErrorResponse {
	response?: {
		data?: {
			message?: string;
		};
	};
}

function CodeGenerator() {
	const { t } = useTranslation('giftCertifications');
	const [pageNo, setPageNo] = useState<number>(0);
	const [pageSize, setPageSize] = useState<number>(5);
	const [count] = useState(100);
	const [isOpenNewMethod, setOpenNewMethodModal] = useState(false);
	const [isOpenViewMethod, setOpenViewMethodModal] = useState(false);
	const [isOpenUpdateMethod, setOpenUpdateMethodModal] = useState(false);
	const [clickedRowData, setClickedRowData] = useState<RowData | null>(null);
	const [isTableLoading, setTableLoading] = useState(false);
	const [sampleData, setSampleData] = useState<RowData[]>([]);
	const [tableActiveRowData, setActiveTableRowData] = useState({} as RowData);
	const [isConfirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);
	const [isOpenActiveBocChargeModal, setOpenActiveBocChargeModal] = useState(false);
	const toggleNewAdvertisementModal = () => setOpenNewMethodModal(!isOpenNewMethod);
	const toggleViewAdvertisementModal = () => setOpenViewMethodModal(!isOpenViewMethod);
	const toggleUpdateAdvertisementModal = () => setOpenUpdateMethodModal(!isOpenUpdateMethod);
	const toggleActiveBoxChargeModal = () => setOpenActiveBocChargeModal(!isOpenActiveBocChargeModal);

	const handleOpenNewMethodModal = () => {
		toggleNewAdvertisementModal();
	};

	const handleCancelStatusChange = () => {
		setConfirmDialogOpen(false);
	};

	const handleConfirmStatusChange = async () => {
		setConfirmDialogOpen(false);
		try {
			if (clickedRowData) {
				await deleteCodeFormat(clickedRowData?.id);
				toast.success('Deleted successfully');
				fetchAllGeneratedCodeValues();
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

	const handleSwitchChange = (rowData: RowData) => () => {
		setActiveTableRowData(rowData);
		toggleActiveBoxChargeModal();
	};

	useEffect(() => {
		fetchAllGeneratedCodeValues();
	}, [pageNo, pageSize]);

	const fetchAllGeneratedCodeValues = async () => {
		setTableLoading(true);
		try {
			const response = await loadAllGeneratedCode(pageNo, pageSize);
			const mappedData = response.data.map((item: any) => ({
				...item,
				full_code: item?.format,
				code_name: item?.name,
				created_date: item?.created_at.split('T')[0],
				no_of_digits: item?.components.find((comp: any) => comp.type === 'Digits')?.format,
				active: item?.is_active === 1
			}));
			setSampleData(mappedData);
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

	const handleActiveAlertForm = async () => {
		toggleActiveBoxChargeModal();
		const id = tableActiveRowData.id ? tableActiveRowData.id : '';

		try {
			const data = {
				is_active: tableActiveRowData?.active === true ? 0 : 1
			};
			await axios.post(`${CODE_GENERATOR_INACTIVE}/${id}`,data)
			fetchAllGeneratedCodeValues();

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


	const tableColumns = [
		{
			title: t('FULL_CODE'),
			field: 'full_code',
			cellStyle: {
				padding: '4px 8px'
			}
		},
		{
			title: t('CODE_NAME'),
			field: 'code_name',
			cellStyle: {
				padding: '4px 8px'
			}
		},
		{
			title: t('CREATE_DATE'),
			field: 'created_date',
			cellStyle: {
				padding: '4px 8px'
			}
		},
		{
			title: t('NO_OF_DIGITS'),
			field: 'no_of_digits',
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
			render: (rowData: RowData) => (
				<FormGroup>
					<FormControlLabel
						control={
							<Switch
								checked={rowData.active}
								onChange={handleSwitchChange(rowData)}
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

	const tableRowViewHandler = (rowData: RowData) => {
		setClickedRowData(rowData);
		toggleViewAdvertisementModal();
	};

	const tableRowEditHandler = (rowData: RowData) => {
		setClickedRowData(rowData);
		toggleUpdateAdvertisementModal();
	};

	const tableRowDeleteHandler = (rowData: RowData) => {
		setClickedRowData(rowData);
		setConfirmDialogOpen(true);
	};

	const handlePageChange = (page: number) => {
		setPageNo(page);
	};

	const handlePageSizeChange = (pageSize: number) => {
		setPageSize(pageSize);
	};

	return (
		<div className="min-w-full max-w-[100vw]">
			<NavigationViewComp title={t('Code Generator')} />

			<Grid
				container
				spacing={2}
				className="pt-[10px] pr-[30px] mx-auto"
			>
				<Grid
					item
					md={12}
					sm={12}
					xs={12}
					className="flex justify-end items-center gap-[10px] formikFormField pt-[5px!important]"
				>
					<Button
						className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80 bokShadow"
						type="button"
						variant="contained"
						size="medium"
						disabled={false}
						onClick={handleOpenNewMethodModal}
					>
						{t('NEW_CODE')}
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
						records={sampleData}
						tableRowViewHandler={tableRowViewHandler}
						tableRowEditHandler={tableRowEditHandler}
						tableRowDeleteHandler={tableRowDeleteHandler}
					/>
				</Grid>
			</Grid>

			{isOpenNewMethod && (
				<NewCodeGenerator
					isOpen={isOpenNewMethod}
					toggleModal={toggleNewAdvertisementModal}
					fetchAllGeneratedCodeValues={fetchAllGeneratedCodeValues}
				/>
			)}

			{isOpenViewMethod && (
				<ViewCodeGenerator
					isOpen={isOpenViewMethod}
					toggleModal={toggleViewAdvertisementModal}
					clickedRowData={clickedRowData}
					fetchAllGeneratedCodeValues={fetchAllGeneratedCodeValues}
				/>
			)}

			{isOpenUpdateMethod && (
				<EditCodeGenerator
					isOpen={isOpenUpdateMethod}
					toggleModal={toggleUpdateAdvertisementModal}
					clickedRowData={clickedRowData}
					fetchAllGeneratedCodeValues={fetchAllGeneratedCodeValues}
				/>
			)}

			{isOpenActiveBocChargeModal && (
				<CodeGeneratorActiveAlertForm
					isOpen={isOpenActiveBocChargeModal}
					toggleModal={toggleActiveBoxChargeModal}
					clickedRowData={tableActiveRowData}
					handleAlertForm={handleActiveAlertForm}
				/>
			)}

			<Dialog
				open={isConfirmDialogOpen}
				onClose={handleCancelStatusChange}
			>
				<DialogTitle className="flex items-center gap-[5px] text-[16px] font-bold">
					<ReportIcon className="text-red text-[20px]" />
					Confirmation
				</DialogTitle>
				<DialogContent>
					<DialogContentText className="text-[10px] sm:text-[12px] lg:text-[14px]">
						Are you sure you want to delete this?
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button
						className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80 bokShadow"
						variant="contained"
						size="medium"
						onClick={handleConfirmStatusChange}
					>
						Confirm
					</Button>
					<Button
						className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80 boxShadow"
						onClick={handleCancelStatusChange}
					>
						Cancel
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}

export default CodeGenerator;
