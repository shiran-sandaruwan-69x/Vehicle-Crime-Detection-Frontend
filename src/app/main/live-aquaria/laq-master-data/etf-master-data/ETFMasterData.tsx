import Grid from '@mui/material/Grid';
import { Form, Formik, FormikHelpers, FormikProps } from 'formik';
import Typography from '@mui/material/Typography';
import { Autocomplete, Button, Chip, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import useDebounce from 'app/shared-components/useDebounce';
import EtsMasterDataDialogForm from './components/EtsMasterDataDialogForm';
import {
	getAllAdvanceFilteringEtfMasterDataWithPagination,
	getAllEtfItemMasterData,
	updateEtfMasterData
} from '../../../../axios/services/live-aquaria-services/master-data-services/MasterDataServices';
import {
	EtfMasterData,
	EtfMasterDataAdvanceFilter,
	ItemDetails,
	ItemDetailsModifiedData,
	ItemDetailsType
} from './etf-master-data-types/ETFMasterDataTypes';

import MaterialTableWrapper from '../../../../common/tableComponents/MaterialTableWrapper';
import NavigationViewComp from '../../../../common/FormComponents/NavigationViewComp';
import EtfMasterDataFormActiveAlertForm from './etf-master-data-types/EtfMasterDataFormActiveAlertForm';
import CustomFormTextField from '../../../../common/FormComponents/CustomFormTextField';
import {
	CountiesResponseTypes,
	CountiesTypes,
	dropDown
} from '../../customer/customer-profile/customer-types/CustomerTypes';
import { getAllCounties } from '../../../../axios/services/live-aquaria-services/customer-services/CustomerService';

interface ErrorResponse {
	response?: {
		data?: {
			message?: string;
		};
	};
}

function ETFMasterData() {
	const { t } = useTranslation('etfMasterData');
	const [pageNo, setPageNo] = useState<number>(0);
	const [pageSize, setPageSize] = useState<number>(5);
	const [count, setCount] = useState(100);
	const [isTableLoading, setTableLoading] = useState(false);
	const [tableData, setTableData] = useState([]);
	const [tableRowData, setTableRowData] = useState({});
	const [isETFMasterDataDataLoading, setETFMasterDataDataLoading] = useState(false);
	const [clickedRowData, setClickedRowData] = useState({});
	const [clickedActiveRowData, setClickedActiveRowData] = useState({} as ItemDetailsModifiedData);
	const [isOpenETFMasterDataModal, setOpenViewETFMasterDataModal] = useState(false);
	const [isOpenActiveEtfMasterDataFormModal, setOpenActiveEtfMasterDataMasterFormModal] = useState(false);
	const toggleViewETFMasterDataModal = () => setOpenViewETFMasterDataModal(!isOpenETFMasterDataModal);
	const toggleActiveEtfMasterDataMasterFormModal = () =>
		setOpenActiveEtfMasterDataMasterFormModal(!isOpenActiveEtfMasterDataFormModal);
	const [isCounties, setCounties] = useState([]);
	const [isAssStatus, setAssStatus] = useState([]);
	const [filteredValues, setFilteredValues] = useState<EtfMasterDataAdvanceFilter>({
		cisCode: null,
		vendorCode: null,
		country: null,
		commonName: null,
		scientificName: null,
		assignedStatus: null
	});

	const debouncedFilter = useDebounce<EtfMasterDataAdvanceFilter>(filteredValues, 1000);

	useEffect(() => {
		if (debouncedFilter) changePageNoOrPageSize(filteredValues);
	}, [debouncedFilter]);

	useEffect(() => {
		changePageNoOrPageSize(filteredValues);
	}, [pageNo, pageSize]);

	useEffect(() => {
		setAssStatus([
			{
				label: 'Assigned',
				value: '1'
			},
			{
				label: 'Not Assigned',
				value: '0'
			}
		]);
		getCounties();
	}, []);

	const tableColumns = [
		{
			title: t('CIS_CODE'),
			field: 'cisCode'
		},
		{
			title: t('MEMBER_CODE'),
			field: 'memberCode'
		},
		{
			title: t('VENDOR_CODE'),
			field: 'vendorCode'
		},
		{
			title: t('COUNTRY'),
			field: 'country'
		},
		{
			title: t('COMMON_NAME'),
			field: 'commonName'
		},
		{
			title: t('SCIENTIFIC_NAME'),
			field: 'scientificName'
		},
		{
			title: t('ASSIGNED_STATUS'),
			field: 'assignedStatus',
			render: (rowData: ItemDetailsModifiedData, index: number) => {
				let chipColor;
				switch (rowData?.assignedStatus) {
					case 'Assigned':
						chipColor = 'bg-blue-50 [&>*]:!text-blue-800';
						break;
					case 'Not Assigned':
						chipColor = 'bg-green-50 [&>*]:!text-green-800';
						break;
					default:
						chipColor = 'bg-gray-50 [&>*]:!text-gray-800';
				}
				return (
					<div className="flex flex-wrap gap-[5px]">
						<span>
							<Chip
								className={`min-w-[85px] ${chipColor} text-[10px] sm:text-[12px] font-[500] px-[6px] py-[2px]`}
								size="small"
								key={index}
								label={rowData.assignedStatus || 'Unknown'}
							/>
						</span>
					</div>
				);
			}
		},
		{
			title: t('ACTIVE'),
			field: 'active',
			render: (rowData: ItemDetailsModifiedData, index) => (
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

	const getCounties = async () => {
		try {
			const response: CountiesResponseTypes = await getAllCounties();
			const data1: CountiesTypes[] = response.data;

			const modifiedData: dropDown[] = data1.map((item: CountiesTypes) => ({
				value: item.name,
				label: `${item.code} - ${item.name}`
			}));
			setCounties(modifiedData);
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

	const etfItemMasterData = async () => {
		setTableLoading(true);
		try {
			const response: ItemDetailsType = await getAllEtfItemMasterData(pageNo, pageSize);
			setCount(response.meta.total);
			const data1: ItemDetails[] = response.data;
			const modifiedData: ItemDetailsModifiedData[] = data1.map((item: ItemDetails) => ({
				...item,
				cisCode: item.cis_code,
				memberCode: item.member_code,
				vendorCode: item.vendor_code,
				country: item.country,
				scientificName: item.scientific_name,
				commonName: item.common_name,
				assignedStatus: item?.is_assign ? 'Assigned' : 'Not Assigned',
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

	const handleSwitchChange = (index, rowData: ItemDetailsModifiedData) => async (event) => {
		setClickedActiveRowData(rowData);
		toggleActiveEtfMasterDataMasterFormModal();
	};

	const schema = yup.object().shape({});

	const onSubmit = (values: EtfMasterData) => {};

	const handleClearForm = (resetForm: FormikHelpers<EtfMasterData>['resetForm']) => {
		resetForm({
			values: {
				cisCode: '',
				vendorCode: '',
				country: '',
				commonName: '',
				scientificName: '',
				assignedStatus: null
			}
		});
		setFilteredValues({
			cisCode: null,
			vendorCode: null,
			country: null,
			commonName: null,
			scientificName: null,
			assignedStatus: null
		});
	};

	const tableRowViewHandler = (rowData: ItemDetailsModifiedData) => {
		setClickedRowData(rowData);
		toggleViewETFMasterDataModal();
	};

	const handleActiveAlertForm = async () => {
		const reasonId: string = clickedActiveRowData.id ? clickedActiveRowData.id : '';
		setTableLoading(true);
		const requestData = {
			is_active: clickedActiveRowData.active === true ? 0 : 1
		};

		try {
			const response = await updateEtfMasterData(requestData, reasonId);
			setTableLoading(false);
			toggleActiveEtfMasterDataMasterFormModal();
			etfItemMasterData();

			if (requestData.is_active === 0) {
				toast.success('Inactivated Successfully');
			} else {
				toast.success('Activated Successfully');
			}
		} catch (error: any) {
			setTableLoading(false);
			toggleActiveEtfMasterDataMasterFormModal();
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

	const changePageNoOrPageSize = async (filteredValues: EtfMasterDataAdvanceFilter) => {
		setTableLoading(true);
		try {
			const response: ItemDetailsType = await getAllAdvanceFilteringEtfMasterDataWithPagination(
				filteredValues.cisCode,
				filteredValues.country,
				filteredValues.vendorCode,
				filteredValues.commonName,
				filteredValues.scientificName,
				null,
				filteredValues.assignedStatus,
				pageNo,
				pageSize
			);
			setCount(response.meta.total);
			const data1: ItemDetails[] = response.data;
			const modifiedData: ItemDetailsModifiedData[] = data1.map((item: ItemDetails) => ({
				...item,
				cisCode: item.cis_code,
				memberCode: item.member_code,
				vendorCode: item.vendor_code,
				country: item.country,
				scientificName: item.scientific_name,
				commonName: item.common_name,
				assignedStatus: item?.is_assign ? 'Assigned' : 'Not Assigned',
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

	const changeCisCode = async (value: string, form: FormikProps<EtfMasterData>) => {
		form.setFieldValue('cisCode', value);
		setFilteredValues({
			...filteredValues,
			cisCode: value
		});
	};

	const changeVendorCode = async (value: string, form: FormikProps<EtfMasterData>) => {
		form.setFieldValue('vendorCode', value);
		setFilteredValues({
			...filteredValues,
			vendorCode: value
		});
	};

	const changeCommonName = async (value: string, form: FormikProps<EtfMasterData>) => {
		form.setFieldValue('commonName', value);
		setFilteredValues({
			...filteredValues,
			commonName: value
		});
	};

	const changeScientificName = async (value: string, form: FormikProps<EtfMasterData>) => {
		form.setFieldValue('scientificName', value);
		setFilteredValues({
			...filteredValues,
			scientificName: value
		});
	};

	const changeCountry = async (value: string) => {

		setFilteredValues({
			...filteredValues,
			country: value
		});
	};

	const changeAssignStatus = async (value: string) => {
		const isStatus: boolean = value === '1';
		setFilteredValues({
			...filteredValues,
			assignedStatus: isStatus
		});
	};

	return (
		<div className="min-w-full max-w-[100vw]">
			<NavigationViewComp title="ETF Item Master Data" />
			<Formik
				initialValues={{
					cisCode: '',
					vendorCode: '',
					country: '',
					commonName: '',
					scientificName: '',
					assignedStatus: ''
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
								<Typography className="formTypography">{t('CIS_CODE')}</Typography>
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
								lg={3}
								xl={2}
								className="formikFormField pt-[5px!important]"
							>
								<Typography className="formTypography">{t('VENDOR_CODE')}</Typography>
								<CustomFormTextField
									name="vendorCode"
									id="vendorCode"
									type="text"
									placeholder=""
									disabled={false}
									changeInput={changeVendorCode}
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
								<Typography className="formTypography">{t('COUNTRY')}</Typography>
								<Autocomplete
									size="small"
									disablePortal
									options={isCounties}
									className="w-full"
									value={values.country || null}
									renderInput={(params) => (
										<TextField
											{...params}
											name="country"
											label=""
										/>
									)}
									onChange={(
										event: React.ChangeEvent<HTMLInputElement>,
										value: { label: string; value: string } | null
									) => {
										setFieldValue('country', value?.label || null);
										changeCountry(value?.value || null);
									}}
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
								<Typography className="formTypography">{t('COMMON_NAME')}</Typography>
								<CustomFormTextField
									name="commonName"
									id="commonName"
									type="text"
									placeholder=""
									disabled={false}
									changeInput={changeCommonName}
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
								<Typography className="formTypography">{t('ASSIGNED_STATUS')}</Typography>
								<Autocomplete
									size="small"
									disablePortal
									options={isAssStatus}
									className="w-full"
									value={values?.assignedStatus || null}
									renderInput={(params) => (
										<TextField
											{...params}
											name="assignedStatus"
											label=""
										/>
									)}
									onChange={(event: React.ChangeEvent<HTMLInputElement>, value: dropDown | null) => {
										setFieldValue('assignedStatus', value?.label || null);
										changeAssignStatus(value?.value || null);
									}}
								/>
							</Grid>

							<Grid
								item
								xl={12}
								lg={6}
								xs={12}
								className="flex justify-end items-end gap-[10px] formikFormField !pt-[10px]"
							>
								<Button
									className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
									type="button"
									variant="contained"
									size="medium"
									disabled={false}
									onClick={() => handleClearForm(resetForm)}
								>
									{t('CLEAR_FILTERS')}
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
						disableSearch
					/>
				</Grid>
			</Grid>

			{isOpenETFMasterDataModal && (
				<EtsMasterDataDialogForm
					isOpen={isOpenETFMasterDataModal}
					toggleModal={toggleViewETFMasterDataModal}
					clickedRowData={clickedRowData}
					compType="view"
				/>
			)}

			{isOpenActiveEtfMasterDataFormModal && (
				<EtfMasterDataFormActiveAlertForm
					isOpen={isOpenActiveEtfMasterDataFormModal}
					toggleModal={toggleActiveEtfMasterDataMasterFormModal}
					clickedRowData={clickedActiveRowData}
					handleAlertForm={handleActiveAlertForm}
				/>
			)}
		</div>
	);
}

export default ETFMasterData;
