import { Autocomplete, Button, Chip, TextField } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Grid from '@mui/material/Grid';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Form, Formik, FormikHelpers, FormikProps } from 'formik';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import useDebounce from 'app/shared-components/useDebounce';
import Tooltip from '@mui/material/Tooltip';
import MaterialTableWrapper from '../../../../common/tableComponents/MaterialTableWrapper';
import {
	deleteDriversDenAdvertisements,
	getAllAdvanceFilteringDriversDenAdvertisementsWithPagination,
	getAllDriversDenAdvertisementsWithPagination,
	updateDiversAdvertisementsData
} from '../../../../axios/services/live-aquaria-services/divers-advertisements-services/DiversAdvertisementsService';
import {
	DiversDenAdvertisementsModifiedDataResponseType,
	GetDiversDenAdvertisementsResponseType
} from './divers-den-advertisements-types/DriversDenAdvertisementsTypes';

import DiversDenAdvertisementsActiveComp from './components/DiversDenAdvertisementsActiveComp';

import DiversDenAdvertisementsDeleteAlertForm from './components/DiversDenAdvertisementsDeleteAlertForm';
import { GeneralAdvSearchSubmitData } from '../../sample-component/root-component/types/general-advertisement-types';

import CustomFormTextField from '../../../../common/FormComponents/CustomFormTextField';
import { dropDown } from '../../customer/customer-profile/customer-types/CustomerTypes';

interface ErrorResponse {
	response?: {
		data?: {
			message?: string;
		};
	};
}
interface Props {
	onCreateClick: (
		rowData: DiversDenAdvertisementsModifiedDataResponseType,
		isTableMode: string,
		isSearchEnabled: boolean,
		getAllDriversDenAdvertisements: () => void
	) => void;
	onEditClick: (
		rowData: DiversDenAdvertisementsModifiedDataResponseType,
		isTableMode: string,
		isSearchEnabled: boolean,
		getAllDriversDenAdvertisements: () => void
	) => void;
	onViewClick: (
		rowData: DiversDenAdvertisementsModifiedDataResponseType,
		isTableMode: string,
		isSearchEnabled: boolean,
		getAllDriversDenAdvertisements: () => void
	) => void;
}

function DiversDenAdvertisements({ onCreateClick, onEditClick, onViewClick }: Props) {
	const { t } = useTranslation('diversDenAdvertisements');
	const [pageNo, setPageNo] = useState<number>(0);
	const [pageSize, setPageSize] = useState<number>(5);
	const [count, setCount] = useState(100);
	const [isTableLoading, setTableLoading] = useState(false);
	const [tableData, setTableData] = useState<DiversDenAdvertisementsModifiedDataResponseType[]>([]);
	const [isOpenActivePackingMaterialsModal, setOpenActivePackingMaterialsModal] = useState(false);
	const [isOpenDeleteDiversDenItemDeletionModal, setOpenDeleteDiversDenItemDeletionModal] = useState(false);
	const toggleDeleteDiversDenItemDeletionModal = () =>
		setOpenDeleteDiversDenItemDeletionModal(!isOpenDeleteDiversDenItemDeletionModal);
	const toggleActivePackingMaterialsModal = () =>
		setOpenActivePackingMaterialsModal(!isOpenActivePackingMaterialsModal);
	const [tableActiveRowData, setTableActiveRowData] = useState({} as DiversDenAdvertisementsModifiedDataResponseType);
	const [clickedDeleteRowData, setClickedDeleteRowData] = useState(
		{} as DiversDenAdvertisementsModifiedDataResponseType
	);

	const [sampleTypes, setSampleTypes] = useState([]);
	const [filteredValues, setFilteredValues] = useState<GeneralAdvSearchSubmitData>({
		productId: null,
		productName: null,
		category: null,
		status: null
	});
	const debouncedFilter = useDebounce<GeneralAdvSearchSubmitData>(filteredValues, 1000);

	useEffect(() => {
		setSampleTypes([
			{ label: 'Pending', value: '0' },
			{ label: 'Approved', value: '1' },
			{ label: 'Rejected', value: '2' },
			{ label: 'Published', value: '3' },
			{ label: 'Sold Out', value: '4' }
		]);
	}, []);

	const tableColumns = [
		{
			title: t('Item Code'),
			field: 'item'
		},
		{
			title: t('Product Name'),
			field: 'name'
		},
		{
			title: t('CATEGORY'),
			field: 'category'
		},
		{
			title: t('SIZE'),
			field: 'size'
		},
		{
			title: t('PRICE'),
			field: 'price'
		},
		{
			title: t('STATUS'),
			field: 'status',
			cellStyle: {
				padding: '2px 4px'
			},
			render: (rowData: DiversDenAdvertisementsModifiedDataResponseType, index: number) => {
				const statusLabels = ['Pending', 'Approved', 'Rejected', 'Published', 'Sold Out'];
				let chipColor;
				let tooltipTitle: string = '';
				switch (rowData?.status) {
					case 0:
						chipColor = 'bg-orange-50 [&>*]:!text-orange-800';
						break;
					case 1:
						chipColor = 'bg-green-50 [&>*]:!text-green-800';
						break;
					case 2:
						chipColor = 'bg-red-50 [&>*]:!text-red-800';
						tooltipTitle = rowData.reject_reason || '';
						break;
					case 3:
						chipColor = 'bg-blue-50 [&>*]:!text-blue-800';
						break;
					default:
						chipColor = 'bg-gray-50 [&>*]:!text-gray-800';
				}

				return (
					<div className="flex flex-wrap gap-[5px]">
						<span>
							{rowData.status === 2 ? (
								<Tooltip title={tooltipTitle}>
									<Chip
										className={`min-w-[85px] ${chipColor} text-[10px] sm:text-[12px] font-[500] px-[6px] py-[2px]`}
										size="small"
										key={index}
										label={statusLabels[rowData.status] || 'Unknown'}
									/>
								</Tooltip>
							) : (
								<Chip
									className={`min-w-[85px] ${chipColor} text-[10px] sm:text-[12px] font-[500] px-[6px] py-[2px]`}
									size="small"
									key={index}
									label={statusLabels[rowData.status] || 'Unknown'}
								/>
							)}
						</span>
					</div>
				);
			}
		},
		{
			title: t('ACTIVE'),
			field: 'active',
			render: (rowData: DiversDenAdvertisementsModifiedDataResponseType, index) => (
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
		},
		{
			title: t('ADMIN_ONLY'),
			field: 'adminOnly',
			cellStyle: {
				padding: '2px 4px'
			},
			render: (rowData: DiversDenAdvertisementsModifiedDataResponseType, index: number) => {
				const chipColor =
					rowData.adminOnly === 1 ? 'bg-green-50 [&>*]:!text-green-800' : 'bg-red-50 [&>*]:!text-red-800';

				return (
					<div className="flex flex-wrap gap-[5px]">
						<span>
							<Chip
								className={`${chipColor} text-[10px] sm:text-[12px] font-[500] px-[6px] py-[2px] capitalize`}
								size="small"
								key={index}
								label={rowData?.adminOnly === 1 ? 'Yes' : 'No'}
							/>
						</span>
					</div>
				);
			}
		},
		{
			title: t('PREVIEW'),
			field: 'preview',
			render: (rowData: DiversDenAdvertisementsModifiedDataResponseType, index) => (
				<IconButton
					className="text-[#3558AE]"
					disabled={false}
					onClick={() => {
						window.open('/preview-pages/preview.html', '_blank');
					}}
					// component={Link}
					// to='/divers-den-advertisement/divers-den-advertisement-preview'
				>
					<VisibilityIcon />
				</IconButton>
			)
		}
	];

	useEffect(() => {
		if (debouncedFilter) changePageNoOrPageSize(filteredValues);
	}, [debouncedFilter]);

	useEffect(() => {
		changePageNoOrPageSize(filteredValues);
	}, [pageNo, pageSize]);

	const handlePageChange = (page: number) => {
		setPageNo(page);
	};

	const handlePageSizeChange = (pageSize: number) => {
		setPageSize(pageSize);
	};

	const getAllDriversDenAdvertisements = async () => {
		setTableLoading(true);
		try {
			const response: GetDiversDenAdvertisementsResponseType = await getAllDriversDenAdvertisementsWithPagination(
				pageNo,
				pageSize
			);
			setCount(response.meta.total);
			const modifiedData: DiversDenAdvertisementsModifiedDataResponseType[] = response.data.map(
				(item: DiversDenAdvertisementsModifiedDataResponseType) => ({
					...item,
					item: item?.code,
					name: item?.parent?.common_name,
					category: item?.parent?.item_category?.name,
					size: item?.parent?.item_selection?.[0]?.selection_types?.[0]?.master_data?.size,
					price: item?.parent?.item_selection?.[0]?.selection_types?.[0]?.display_price,
					status: item?.status,
					adminOnly: item?.is_admin_only,
					active: item?.is_active === 1
				})
			);
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

	const handleSwitchChange = (index, rowData: DiversDenAdvertisementsModifiedDataResponseType) => async (event) => {
		setTableActiveRowData(rowData);
		toggleActivePackingMaterialsModal();
	};

	const schema = yup.object().shape({});

	const onSubmit = (values: GeneralAdvSearchSubmitData) => {};

	const handleOpenNewDiversDenAdvertisementsModal = () => {
		if (typeof getAllDriversDenAdvertisements === 'function') {
			onCreateClick({}, '', false, getAllDriversDenAdvertisements);
		}
	};

	const tableRowDeleteHandler = (rowData: DiversDenAdvertisementsModifiedDataResponseType) => {
		setClickedDeleteRowData(rowData);
		toggleDeleteDiversDenItemDeletionModal();
	};

	const tableRowViewHandler = (rowData: DiversDenAdvertisementsModifiedDataResponseType) => {
		onViewClick(rowData, 'view', true, getAllDriversDenAdvertisements);
	};

	const tableRowEditHandler = (rowData: DiversDenAdvertisementsModifiedDataResponseType) => {
		if (rowData?.status === 0 || rowData?.status === 2) {
			onEditClick(rowData, 'edit', true, getAllDriversDenAdvertisements);
		} else {
			toast.error('The edit feature is only enabled for rows with "Pending" or "Rejected" status');
		}
	};

	const handleActiveAlertForm = async () => {
		const id: string = tableActiveRowData.id ? tableActiveRowData.id : '';
		setTableLoading(true);
		const requestData = {
			is_active: tableActiveRowData.active === true ? 0 : 1
		};
		toggleActivePackingMaterialsModal();
		try {
			const response = await updateDiversAdvertisementsData(requestData, id);
			setTableLoading(false);
			getAllDriversDenAdvertisements();

			if (requestData.is_active === 0) {
				toast.success('Inactivated Successfully');
			} else {
				toast.success('Activated Successfully');
			}
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

	const handleDeleteAlertForm = async (values: { reason: string }) => {
		const id: string = clickedDeleteRowData.id ? clickedDeleteRowData.id : '';
		const requestData = {
			delete_reason_id: values.reason ?? null
		};
		setTableLoading(true);
		toggleDeleteDiversDenItemDeletionModal();
		try {
			const response = await deleteDriversDenAdvertisements(id, requestData);
			setTableLoading(false);
			toast.success('Deleted Successfully');
			getAllDriversDenAdvertisements();
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

	const changePageNoOrPageSize = async (filteredValues: GeneralAdvSearchSubmitData) => {
		setTableLoading(true);
		try {
			const response: GetDiversDenAdvertisementsResponseType =
				await getAllAdvanceFilteringDriversDenAdvertisementsWithPagination(
					filteredValues.productId,
					filteredValues.productName,
					filteredValues.category,
					filteredValues.status,
					pageNo,
					pageSize
				);
			setCount(response.meta.total);
			const modifiedData: DiversDenAdvertisementsModifiedDataResponseType[] = response.data.map(
				(item: DiversDenAdvertisementsModifiedDataResponseType) => ({
					...item,
					item: item?.code,
					name: item?.parent?.common_name,
					category: item?.parent?.item_category?.name,
					size: item?.parent?.item_selection?.[0]?.selection_types?.[0]?.master_data?.size,
					price: item?.parent?.item_selection?.[0]?.selection_types?.[0]?.display_price,
					status: item?.status,
					adminOnly: item?.is_admin_only,
					active: item?.is_active === 1
				})
			);
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

	const changeProductId = async (value: string, form: FormikProps<GeneralAdvSearchSubmitData>) => {
		form.setFieldValue('productId', value);
		setFilteredValues({
			...filteredValues,
			productId: value
		});
	};

	const changeProductName = async (value: string, form: FormikProps<GeneralAdvSearchSubmitData>) => {
		form.setFieldValue('productName', value);
		setFilteredValues({
			...filteredValues,
			productName: value
		});
	};

	const changeCategory = async (value: string, form: FormikProps<GeneralAdvSearchSubmitData>) => {
		form.setFieldValue('category', value);
		setFilteredValues({
			...filteredValues,
			category: value
		});
	};

	const changeStatus = async (value: string) => {
		setFilteredValues({
			...filteredValues,
			status: value
		});
	};
	const handleClearForm = (resetForm: FormikHelpers<GeneralAdvSearchSubmitData>['resetForm']) => {
		resetForm();
		setFilteredValues({
			productId: null,
			productName: null,
			category: null,
			status: null
		});
	};

	return (
		<div className="min-w-full max-w-[100vw]">
			<Formik
				initialValues={{
					productId: '',
					productName: '',
					category: '',
					status: ''
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
								xl={2}
								className="formikFormField pt-[5px!important]"
							>
								<Typography className="formTypography">{t('Item Code')}</Typography>
								<CustomFormTextField
									name="productId"
									id="productId"
									type="text"
									placeholder=""
									disabled={false}
									changeInput={changeProductId}
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
								<Typography className="formTypography">{t('PRODUCT_NAME')}</Typography>
								<CustomFormTextField
									name="productName"
									id="productName"
									type="text"
									placeholder=""
									disabled={false}
									changeInput={changeProductName}
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
								<Typography className="formTypography">{t('CATEGORY')}</Typography>
								<CustomFormTextField
									name="category"
									id="category"
									type="text"
									placeholder=""
									disabled={false}
									changeInput={changeCategory}
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
								<Typography className="formTypography">{t('STATUS')}</Typography>
								<Autocomplete
									size="small"
									disablePortal
									options={sampleTypes}
									className="w-full"
									value={values?.status || null}
									renderInput={(params) => (
										<TextField
											{...params}
											name="status"
											label=""
										/>
									)}
									onChange={(event: React.ChangeEvent<HTMLInputElement>, value: dropDown | null) => {
										setFieldValue('status', value?.label || null);
										changeStatus(value?.value || null);
									}}
								/>
							</Grid>

							<Grid
								item
								xs={12}
								sm={12}
								md={8}
								lg={12}
								xl={4}
								className="flex flex-wrap justify-between items-end gap-[10px] pt-[10px!important]"
							>
								<Button
									className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
									type="button"
									variant="contained"
									size="medium"
									disabled={false}
									onClick={() => handleClearForm(resetForm)}
								>
									{t('Clear Filters')}
								</Button>
								<Button
									className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
									type="button"
									variant="contained"
									size="medium"
									disabled={false}
									onClick={() => handleOpenNewDiversDenAdvertisementsModal()}
								>
									{t('Create Diver\'s Den PDP')}
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
						disableSearch
					/>
				</Grid>
			</Grid>

			{isOpenActivePackingMaterialsModal && (
				<DiversDenAdvertisementsActiveComp
					isOpen={isOpenActivePackingMaterialsModal}
					toggleModal={toggleActivePackingMaterialsModal}
					clickedRowData={tableActiveRowData}
					handleAlertForm={handleActiveAlertForm}
				/>
			)}

			{isOpenDeleteDiversDenItemDeletionModal && (
				<DiversDenAdvertisementsDeleteAlertForm
					toggleModal={toggleDeleteDiversDenItemDeletionModal}
					isOpen={isOpenDeleteDiversDenItemDeletionModal}
					handleAlertForm={handleDeleteAlertForm}
				/>
			)}
		</div>
	);
}

export default DiversDenAdvertisements;
