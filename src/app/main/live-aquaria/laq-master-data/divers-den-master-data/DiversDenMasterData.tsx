import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import * as yup from 'yup';
import { Button, Grid } from '@mui/material';
import { Form, Formik, FormikHelpers, FormikProps } from 'formik';
import Typography from '@mui/material/Typography';
import { toast } from 'react-toastify';
import useDebounce from 'app/shared-components/useDebounce';
import NavigationViewComp from '../../../../common/FormComponents/NavigationViewComp';
import MaterialTableWrapper from '../../../../common/tableComponents/MaterialTableWrapper';
import CreateNewDiversDenMasterData from './components/CreateNewDiversDenMasterData';
import ViewAndEditDiversDenMasterData from './components/ViewAndEditDiversDenMasterData';
import {
	getAllAdvanceFilteringDiversDenMasterDataWithPagination,
	getAllDriversDenMasterDataWithPagination,
	updateDriversDenMasterData
} from '../../../../axios/services/live-aquaria-services/master-data-services/MasterDataServices';

import {
	DriversDenSearchFormTypes,
	ProductDiversDenMaster,
	ProductDiversDenMasterModifyData,
	ProductDiversDenMasterType
} from './drivers-den-types/DriversDenTypes';
import ActiveAlertForm from './components/ActiveAlertForm';
import CustomFormTextField from '../../../../common/FormComponents/CustomFormTextField';
import { ItemDetailsType } from '../etf-master-data/etf-master-data-types/ETFMasterDataTypes';

interface ErrorResponse {
	response?: {
		data?: {
			message?: string;
		};
	};
}

function DiversDenMasterData() {
	const { t } = useTranslation('diversDenMasterData');
	const [pageNo, setPageNo] = useState<number>(0);
	const [pageSize, setPageSize] = useState<number>(5);
	const [count, setCount] = useState(100);
	const [isTableLoading, setTableLoading] = useState(false);
	const [tableActiveRowData, setTableActiveRowData] = useState({} as ProductDiversDenMasterModifyData);
	const [isDiversDenMasterDataLoading, setDiversDenMasterDataLoading] = useState(false);
	const [isOpenDiversDenMasterDataModal, setOpenDiversDenMasterDataModal] = useState(false);
	const [isOpenDiversDenMasterDataViewModal, setOpenDiversDenMasterDataViewModal] = useState(false);
	const [isOpenDiversDenMasterDataCreateModal, setOpenDiversDenMasterDataCreateModal] = useState(false);
	const [isOpenActiveDiversDenModal, setOpenActiveDiversDenModal] = useState(false);
	const toggleDiversDenMasterDataModal = () => setOpenDiversDenMasterDataModal(!isOpenDiversDenMasterDataModal);
	const toggleDiversDenMasterDataViewModal = () =>
		setOpenDiversDenMasterDataViewModal(!isOpenDiversDenMasterDataViewModal);
	const toggleDiversDenMasterDataCreateModal = () =>
		setOpenDiversDenMasterDataCreateModal(!isOpenDiversDenMasterDataCreateModal);
	const toggleActiveDiversDenModal = () => setOpenActiveDiversDenModal(!isOpenActiveDiversDenModal);

	const [clickedRowData, setClickedRowData] = useState<ProductDiversDenMasterModifyData>({});

	const [tableData, setTableData] = useState<ProductDiversDenMasterModifyData[]>([]);

	const handlePageChange = (page: number) => {
		setPageNo(page);
	};

	const handlePageSizeChange = (pageSize: number) => {
		setPageSize(pageSize);
	};

	const [filteredValues, setFilteredValues] = useState<DriversDenSearchFormTypes>({
		code: null,
		productName: null,
		scientificName: null,
		category: null,
		cisCode: null
	});
	const debouncedFilter = useDebounce<DriversDenSearchFormTypes>(filteredValues, 1000);

	useEffect(() => {
		if (debouncedFilter) changePageNoOrPageSize(filteredValues);
	}, [debouncedFilter]);

	useEffect(() => {
		changePageNoOrPageSize(filteredValues);
	}, [pageNo, pageSize]);

	const handleClearForm = (resetForm: FormikHelpers<DriversDenSearchFormTypes>['resetForm']) => {
		resetForm();
		setFilteredValues({
			code: null,
			productName: null,
			scientificName: null,
			category: null,
			cisCode: null
		});
	};

	const getAllDriversDenMasterData = async () => {
		setTableLoading(true);
		try {
			const response: ProductDiversDenMasterType = await getAllDriversDenMasterDataWithPagination(
				pageNo,
				pageSize
			);

			setCount(response.meta.total);
			const modifiedData: ProductDiversDenMasterModifyData[] = response.data.map(
				(item: ProductDiversDenMaster) => ({
					...item,
					productName: item?.common_name,
					scientificName: item?.scientific_name,
					category: item?.item_category?.name,
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

	const handleSwitchChange = (index, rowData: ProductDiversDenMasterModifyData) => async (event) => {
		setTableActiveRowData(rowData);
		toggleActiveDiversDenModal();
	};

	const tableColumns = [
		{
			title: t('DD Master Code'),
			field: 'code'
		},
		{
			title: t('PRODUCT_NAME'),
			field: 'productName'
		},
		{
			title: t('SCIENTIFIC_NAME'),
			field: 'scientificName'
		},
		{
			title: t('CATEGORY'),
			field: 'category'
		},
		{
			title: t('ACTIVE'),
			field: 'active',
			render: (rowData: ProductDiversDenMasterModifyData) => (
				<FormGroup>
					<FormControlLabel
						control={
							<Switch
								checked={rowData.active}
								onChange={handleSwitchChange(rowData.active, rowData)}
								aria-label="active switch"
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

	const schema = yup.object().shape({});

	const tableRowViewHandler = (rowData: ProductDiversDenMasterModifyData) => {
		setClickedRowData(rowData);
		toggleDiversDenMasterDataViewModal();
	};

	const tableRowEditHandler = (rowData: ProductDiversDenMasterModifyData) => {
		setClickedRowData(rowData);
		toggleDiversDenMasterDataModal();
	};

	const handleOpenNewDiversDenMasterDataModal = () => {
		toggleDiversDenMasterDataCreateModal();
	};

	const handleActiveAlertForm = async () => {
		const id: string = tableActiveRowData.id ? tableActiveRowData.id : '';
		const requestData = {
			is_active: tableActiveRowData.active === true ? 0 : 1
		};

		try {
			const response = await updateDriversDenMasterData(requestData, id);
			getAllDriversDenMasterData();
			toggleActiveDiversDenModal();

			if (requestData.is_active === 0) {
				toast.success('Inactivated Successfully');
			} else {
				toast.success('Activated Successfully');
			}
		} catch (error) {
			toggleActiveDiversDenModal();
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

	const onSubmit = async (values: DriversDenSearchFormTypes) => {};

	const changePageNoOrPageSize = async (filteredValues: DriversDenSearchFormTypes) => {
		setTableLoading(true);
		try {
			const response: ItemDetailsType = await getAllAdvanceFilteringDiversDenMasterDataWithPagination(
				filteredValues.code,
				filteredValues.productName,
				filteredValues.category,
				filteredValues.scientificName,
				filteredValues.cisCode,
				pageNo,
				pageSize
			);
			setCount(response.meta.total);
			const modifiedData: ProductDiversDenMasterModifyData[] = response.data.map(
				(item: ProductDiversDenMaster) => ({
					...item,
					productName: item?.common_name,
					scientificName: item?.scientific_name,
					category: item?.item_category?.name,
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

	const changeCode = async (value: string, form: FormikProps<DriversDenSearchFormTypes>) => {
		form.setFieldValue('code', value);
		setFilteredValues({
			...filteredValues,
			code: value
		});
	};

	const changeProductName = async (value: string, form: FormikProps<DriversDenSearchFormTypes>) => {
		form.setFieldValue('productName', value);
		setFilteredValues({
			...filteredValues,
			productName: value
		});
	};

	const changeCategory = async (value: string, form: FormikProps<DriversDenSearchFormTypes>) => {
		form.setFieldValue('category', value);
		setFilteredValues({
			...filteredValues,
			category: value
		});
	};

	const changeScientificName = async (value: string, form: FormikProps<DriversDenSearchFormTypes>) => {
		form.setFieldValue('scientificName', value);
		setFilteredValues({
			...filteredValues,
			scientificName: value
		});
	};

	const changeCisCode = async (value: string, form: FormikProps<DriversDenSearchFormTypes>) => {
		form.setFieldValue('cisCode', value);
		setFilteredValues({
			...filteredValues,
			cisCode: value
		});
	};

	return (
		<div className="min-w-full max-w-[100vw]">
			<NavigationViewComp title={t('Divers Den Master Data')} />

			<Formik
				initialValues={{
					code: '',
					productName: '',
					scientificName: '',
					category: '',
					cisCode: ''
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
								<Typography className="formTypography">{t('DD Master Code')}</Typography>
								<CustomFormTextField
									name="code"
									id="code"
									type="text"
									placeholder=""
									disabled={false}
									changeInput={changeCode}
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
								<Typography className="formTypography">{t('SCIENTIFIC_NAME')}</Typography>
								<CustomFormTextField
									name="scientificName"
									id="scientificName"
									type="text"
									placeholder=""
									disabled={false}
									changeInput={changeScientificName}
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
								<Typography className="formTypography">{t('CIS Code')}</Typography>
								<CustomFormTextField
									name="cisCode"
									id="cisCode"
									type="text"
									placeholder=""
									disabled={false}
									changeInput={changeCisCode}
								/>
							</Grid>

							<Grid
								item
								xs={12}
								sm={6}
								md={4}
								lg={9}
								xl={2}
								className="flex justify-between items-start gap-[5px] formikFormField pt-[26px!important]"
							>
								<div className="flex items-start gap-[10px]">
									<Button
										className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 !px-[5px] py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
										type="button"
										variant="contained"
										size="medium"
										disabled={false}
										onClick={() => handleClearForm(resetForm)}
									>
										{t('Clear Filters')}
									</Button>
								</div>

								<Button
									className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 !px-[5px] py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
									type="button"
									variant="contained"
									size="medium"
									disabled={false}
									onClick={handleOpenNewDiversDenMasterDataModal}
								>
									{t('NEW_DIVERS_DEN_ITEM')}
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
						disableSearch
					/>
				</Grid>
			</Grid>

			{isOpenDiversDenMasterDataCreateModal && (
				<CreateNewDiversDenMasterData
					isOpen={isOpenDiversDenMasterDataCreateModal}
					toggleModal={toggleDiversDenMasterDataCreateModal}
					isTableMode=""
					isSearchEnabled={false}
					getAllDriversDenMasterData={getAllDriversDenMasterData}
				/>
			)}

			{isOpenDiversDenMasterDataViewModal && (
				<ViewAndEditDiversDenMasterData
					isOpen={isOpenDiversDenMasterDataViewModal}
					toggleModal={toggleDiversDenMasterDataViewModal}
					clickedRowData={clickedRowData}
					isTableMode="view"
					getAllDriversDenMasterData={getAllDriversDenMasterData}
				/>
			)}

			{isOpenDiversDenMasterDataModal && (
				<ViewAndEditDiversDenMasterData
					isOpen={isOpenDiversDenMasterDataModal}
					toggleModal={toggleDiversDenMasterDataModal}
					clickedRowData={clickedRowData}
					isTableMode="edit"
					getAllDriversDenMasterData={getAllDriversDenMasterData}
				/>
			)}

			{isOpenActiveDiversDenModal && (
				<ActiveAlertForm
					isOpen={isOpenActiveDiversDenModal}
					toggleModal={toggleActiveDiversDenModal}
					clickedRowData={tableActiveRowData}
					handleAlertForm={handleActiveAlertForm}
				/>
			)}
		</div>
	);
}

export default DiversDenMasterData;
