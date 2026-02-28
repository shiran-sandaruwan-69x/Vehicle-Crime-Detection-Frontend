import Grid from '@mui/material/Grid';
import { Form, Formik, FormikHelpers, FormikProps } from 'formik';
import Typography from '@mui/material/Typography';
import {Autocomplete, Button, Chip, TextField} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import useDebounce from 'app/shared-components/useDebounce';
import axios, { AxiosResponse } from 'axios';
import { EtfMasterData, EtfMasterDataAdvanceFilter } from '../etf-master-data/etf-master-data-types/ETFMasterDataTypes';

import { CREATE_ETF_MASTER_DATA } from '../../../../axios/services/live-aquaria-services/master-data-services/MasterDataServices';
import NavigationViewComp from '../../../../common/FormComponents/NavigationViewComp';
import CustomFormTextField from '../../../../common/FormComponents/CustomFormTextField';
import MaterialTableWrapper from '../../../../common/tableComponents/MaterialTableWrapper';
import CreateNewCommonProduct from './components/CreateNewCommonProduct';
import CommonProductMasterFormActiveAlertForm from './components/CommonProductMasterFormActiveAlertForm';

import {
	BoxChargeRes,
	CommonProductMasterModifiedData,
	CommonProductMasterRes,
	CommonProductMasterTableApiRes
} from './common-product-master-types/CommonProductMasterTypes';

interface ErrorResponse {
	response?: {
		data?: {
			message?: string;
		};
	};
}

function CommonProductMaster() {
	const { t } = useTranslation('commonProductMaster');
	const [pageNo, setPageNo] = useState<number>(0);
	const [pageSize, setPageSize] = useState<number>(5);
	const [count, setCount] = useState(100);
	const [isTableLoading, setTableLoading] = useState(false);
	const [tableData, setTableData] = useState<CommonProductMasterModifiedData[]>([]);
	const [clickedActiveRowData, setClickedActiveRowData] = useState({} as CommonProductMasterModifiedData);
	const [clickedViewRowData, setClickedViewRowData] = useState({} as CommonProductMasterModifiedData);
	const [clickedEditRowData, setClickedEditRowData] = useState({} as CommonProductMasterModifiedData);
	const [isOpenCommonProductMasterDataModal, setOpenCommonProductMasterDataModal] = useState(false);
	const [isOpenCommonProductMasterDataViewModal, setOpenCommonProductMasterDataViewModal] = useState(false);
	const [isOpenCommonProductMasterDataEditModal, setOpenCommonProductMasterDataEditModal] = useState(false);
	const [isOpenActiveCommonProductMasterModal, setOpenActiveCommonProductMasterModal] = useState(false);
	const toggleCommonProductMasterDataModal = () =>
		setOpenCommonProductMasterDataModal(!isOpenCommonProductMasterDataModal);
	const toggleCommonProductMasterDataViewModal = () =>
		setOpenCommonProductMasterDataViewModal(!isOpenCommonProductMasterDataViewModal);
	const toggleCommonProductMasterDataEditModal = () =>
		setOpenCommonProductMasterDataEditModal(!isOpenCommonProductMasterDataEditModal);
	const toggleActiveCommonProductMasterModal = () =>
		setOpenActiveCommonProductMasterModal(!isOpenActiveCommonProductMasterModal);
	const [isAssStatus, setAssStatus] = useState([]);
	const [isAquaticType, setAquaticType] = useState([]);
	const [filteredValues, setFilteredValues] = useState<EtfMasterDataAdvanceFilter>({
		cisCode: null,
		location: null,
		commonName: null,
		scientificName: null,
		aquatic_type: null
	});

	const debouncedFilter = useDebounce<EtfMasterDataAdvanceFilter>(filteredValues, 1000);

	useEffect(() => {
		if (debouncedFilter) changePageNoOrPageSize(filteredValues);
	}, [debouncedFilter]);

	useEffect(() => {
		changePageNoOrPageSize(filteredValues);
	}, [pageNo, pageSize]);

	useEffect(() => {
		setAquaticType([
			{
				label: 'Saltwater',
				value: 'salt'
			},
			{
				label: 'Freshwater',
				value: 'fresh'
			},
			{
				label: 'Both',
				value: 'both'
			}
		]);
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
	}, []);

	const tableColumns = [
		{
			title: t('CIS_CODE'),
			field: 'cis_code'
		},
		{
			title: t('Location Code / Name'),
			field: 'location'
		},
		{
			title: t('VENDOR_CODE'),
			field: 'vendor_code'
		},
		{
			title: t('Aquatic Type'),
			field: 'aquatic_type',
			render:(rowData: CommonProductMasterModifiedData, index: number)=>{
				let chipColor;
				switch (rowData?.aquatic_type) {
					case 'salt':
						chipColor = 'Saltwater';
						break;
					case 'fresh':
						chipColor = 'Freshwater';
						break;
					case 'both':
						chipColor = 'Both';
						break;
					default:
						chipColor = '';
				}
				return(
					<span>{chipColor}</span>
				);
			}
		},
		{
			title: t('COUNTRY'),
			field: 'country'
		},
		{
			title: t('COMMON_NAME'),
			field: 'common_name'
		},
		{
			title: t('SCIENTIFIC_NAME'),
			field: 'scientific_name'
		},
		{
			title: t('ASSIGNED_STATUS'),
			field: 'assignedStatus',
			render: (rowData: CommonProductMasterModifiedData, index: number) => {
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
			render: (rowData: CommonProductMasterModifiedData, index) => (
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

	const getCommonProductMasterData = async () => {
		setTableLoading(true);
		try {
			const response: AxiosResponse<CommonProductMasterTableApiRes> = await axios.get(
				`${CREATE_ETF_MASTER_DATA}?limit=${pageSize}&page=${pageNo}`
			);
			setCount(response?.data?.meta?.total);
			const data1: CommonProductMasterRes[] = response?.data?.data;
			const modifiedData: CommonProductMasterModifiedData[] = data1.map((item: CommonProductMasterRes) => ({
				...item,
				location: item?.company?.name,
				assignedStatus: item?.is_assign ? 'Assigned' : 'Not Assigned',
				tblData: item?.box_charge?.map((polyBag: BoxChargeRes) => ({
					polyBagSizeId: Number(polyBag?.packing_material?.id),
					polyBagSize: `${polyBag?.packing_material?.name} - ${polyBag?.packing_material?.volume}cm³`,
					minNumOfProduct: polyBag?.min_no_of_products,
					maxNumOfProduct: polyBag?.max_no_of_product
				})),
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

	const handleSwitchChange = (index, rowData: CommonProductMasterModifiedData) => async (event) => {
		setClickedActiveRowData(rowData);
		toggleActiveCommonProductMasterModal();
	};

	const schema = yup.object().shape({});

	const onSubmit = (values: EtfMasterData) => {};

	const handleClearForm = (resetForm: FormikHelpers<EtfMasterData>['resetForm']) => {
		resetForm({
			values: {
				cisCode: '',
				location: '',
				commonName: '',
				scientificName: ''
			}
		});
		setFilteredValues({
			cisCode: null,
			location: null,
			commonName: null,
			scientificName: null,
			aquatic_type: null
		});
	};

	const handleOpenNewCustomerModal = () => {
		toggleCommonProductMasterDataModal();
	};

	const tableRowViewHandler = (rowData: CommonProductMasterModifiedData) => {
		setClickedViewRowData(rowData);
		toggleCommonProductMasterDataViewModal();
	};

	const tableRowEditHandler = (rowData: CommonProductMasterModifiedData) => {
		setClickedEditRowData(rowData);
		toggleCommonProductMasterDataEditModal();
	};

	const handleActiveAlertForm = async () => {
		const reasonId: string = clickedActiveRowData.id ? clickedActiveRowData.id : '';
		setTableLoading(true);
		const requestData = {
			is_active: clickedActiveRowData.active === true ? 0 : 1
		};

		try {
			await axios.put(`${CREATE_ETF_MASTER_DATA}/${reasonId}`, requestData);
			setTableLoading(false);
			toggleActiveCommonProductMasterModal();
			getCommonProductMasterData();

			if (requestData.is_active === 0) {
				toast.success('Inactivated Successfully');
			} else {
				toast.success('Activated Successfully');
			}
		} catch (error: any) {
			setTableLoading(false);
			toggleActiveCommonProductMasterModal();
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
		try {
			const response: AxiosResponse<CommonProductMasterTableApiRes> = await axios.get(
				`${CREATE_ETF_MASTER_DATA}?filter=cis_code,${filteredValues.cisCode}|country,${null}|vendor_code,${null}|common_name,${filteredValues.commonName}|scientific_name,${filteredValues.scientificName}|master_code,${null}|company.name,${filteredValues.location}|aquatic_type,${filteredValues.aquatic_type}&limit=${pageSize}&page=${pageNo}`
			);
			setCount(response.data.meta.total);
			const data1: CommonProductMasterRes[] = response?.data?.data;
			const modifiedData: CommonProductMasterModifiedData[] = data1.map((item: CommonProductMasterRes) => ({
				...item,
				location: item?.company?.name,
				assignedStatus: item?.is_assign ? 'Assigned' : 'Not Assigned',
				tblData: item?.box_charge?.map((polyBag: BoxChargeRes) => ({
					polyBagSizeId: Number(polyBag?.packing_material?.id),
					polyBagSize: `${polyBag?.packing_material?.name} - ${polyBag?.packing_material?.volume}cm³`,
					minNumOfProduct: polyBag?.min_no_of_products,
					maxNumOfProduct: polyBag?.max_no_of_product
				})),
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

	const changeLocation = async (value: string, form: FormikProps<EtfMasterData>) => {
		form.setFieldValue('location', value);
		setFilteredValues({
			...filteredValues,
			location: value
		});
	};

	const changeAquaticType = async (value: string) => {
		setFilteredValues({
			...filteredValues,
			aquatic_type: value
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

	return (
		<div className="min-w-full max-w-[100vw]">
			<NavigationViewComp title="Common Product Master" />
			<Formik
				initialValues={{
					cisCode: '',
					location: '',
					commonName: '',
					scientificName: ''
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
								<Typography className="formTypography">{t('Location Code / Name')}</Typography>
								<CustomFormTextField
									name="location"
									id="location"
									type="text"
									placeholder=""
									disabled={false}
									changeInput={changeLocation}
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
								<Typography className="formTypography">{t('Aquatic Type')}</Typography>
								<Autocomplete
									size="small"
									disablePortal
									options={isAquaticType}
									className="w-full"
									value={values.aquatic_type || null}
									renderInput={(params) => (
										<TextField
											{...params}
											name="aquatic_type"
											label=""
										/>
									)}
									onChange={(
										event: React.ChangeEvent<HTMLInputElement>,
										value: { label: string; value: string } | null
									) => {
										setFieldValue('aquatic_type', value?.label || null);
										changeAquaticType(value?.value || null);
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
								xl={12}
								lg={12}
								md={12}
								sm={12}
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
								<Button
									className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
									type="button"
									variant="contained"
									size="medium"
									disabled={false}
									onClick={handleOpenNewCustomerModal}
								>
									{t('Create')}
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

			{isOpenCommonProductMasterDataModal && (
				<CreateNewCommonProduct
					isOpen={isOpenCommonProductMasterDataModal}
					toggleModal={toggleCommonProductMasterDataModal}
					clickedRowData={{}}
					getCommonProductMasterData={getCommonProductMasterData}
					isMode="create"
				/>
			)}

			{isOpenCommonProductMasterDataViewModal && (
				<CreateNewCommonProduct
					isOpen={isOpenCommonProductMasterDataViewModal}
					toggleModal={toggleCommonProductMasterDataViewModal}
					clickedRowData={clickedViewRowData}
					getCommonProductMasterData={getCommonProductMasterData}
					isMode="view"
				/>
			)}

			{isOpenCommonProductMasterDataEditModal && (
				<CreateNewCommonProduct
					isOpen={isOpenCommonProductMasterDataEditModal}
					toggleModal={toggleCommonProductMasterDataEditModal}
					clickedRowData={clickedEditRowData}
					getCommonProductMasterData={getCommonProductMasterData}
					isMode="edit"
				/>
			)}

			{isOpenActiveCommonProductMasterModal && (
				<CommonProductMasterFormActiveAlertForm
					isOpen={isOpenActiveCommonProductMasterModal}
					toggleModal={toggleActiveCommonProductMasterModal}
					clickedRowData={clickedActiveRowData}
					handleAlertForm={handleActiveAlertForm}
				/>
			)}
		</div>
	);
}

export default CommonProductMaster;
