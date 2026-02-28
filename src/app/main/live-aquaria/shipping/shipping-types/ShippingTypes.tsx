import React, { useEffect, useState } from 'react';
import { Button, FormControlLabel, FormGroup, Grid, Switch, Typography } from '@mui/material';
import { Form, Formik, FormikHelpers, FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import axios, { AxiosResponse } from 'axios';
import useDebounce from 'app/shared-components/useDebounce';
import NavigationViewComp from '../../../../common/FormComponents/NavigationViewComp';
import MaterialTableWrapper from '../../../../common/tableComponents/MaterialTableWrapper';
import NewShippingTypeModel from './components/NewShippingType';
import { CREATE_SHIPPING_TYPE } from '../../../../axios/services/live-aquaria-services/shipping-services/ShippingTypeService';
import {
	ShippingTypeApiResponse,
	ShippingTypeFilterSubmitData,
	ShippingTypeModifiedData,
	ShippingTypeResponse
} from './types/ShippingTypes';
import ShippingTypeActiveComp from './components/ShippingTypeActiveComp';
import ShippingTypeDeleteAlertForm from './components/ShippingTypeDeleteAlertForm';
import CustomFormTextField from '../../../../common/FormComponents/CustomFormTextField';

interface ErrorResponse {
	response?: {
		data?: {
			message?: string;
		};
	};
}

function ShippingTypes() {
	const { t } = useTranslation('shippingTypes');

	const [pageNo, setPageNo] = useState<number>(0);
	const [pageSize, setPageSize] = useState<number>(5);
	const [count, setCount] = useState<number>(100);

	const [isOpenShippingTypeViewModal, setIsOpenShippingTypeViewModal] = useState<boolean>(false);
	const toggleShippingTypeViewModal = () => setIsOpenShippingTypeViewModal(!isOpenShippingTypeViewModal);

	const [isOpenShippingTypeEditModal, setIsOpenShippingTypeEditModal] = useState<boolean>(false);
	const toggleShippingTypeEditModal = () => setIsOpenShippingTypeEditModal(!isOpenShippingTypeEditModal);

	const [isOpenNewShippingTypeModal, setIsOpenNewShippingTypeModal] = useState<boolean>(false);
	const toggleNewShippingTypeModal = () => setIsOpenNewShippingTypeModal(!isOpenNewShippingTypeModal);

	const [sampleData, setSampleData] = useState<ShippingTypeModifiedData[]>([]);
	const [isTableLoading, setTableLoading] = useState(false);
	const [selectedActiveRowData, setSelectedActiveRowData] = useState<ShippingTypeModifiedData>(null);
	const [selectedDeleteRowData, setSelectedDeleteRowData] = useState<ShippingTypeModifiedData>(null);
	const [selectedViewRowData, setSelectedViewRowData] = useState<ShippingTypeModifiedData>(null);
	const [selectedEditRowData, setSelectedEditRowData] = useState<ShippingTypeModifiedData>(null);
	const [isOpenActiveModal, setOpenActiveModal] = useState(false);
	const [isOpenDeleteModal, setOpenDeleteModal] = useState(false);
	const toggleActiveModal = () => setOpenActiveModal(!isOpenActiveModal);
	const toggleDeleteModal = () => setOpenDeleteModal(!isOpenDeleteModal);

	const [filteredValues, setFilteredValues] = useState<ShippingTypeFilterSubmitData>({
		shippingTypeName: null
	});

	const debouncedFilter = useDebounce<ShippingTypeFilterSubmitData>(filteredValues, 1000);

	useEffect(() => {
		if (debouncedFilter) changePageNoOrPageSize(filteredValues);
	}, [debouncedFilter]);

	useEffect(() => {
		changePageNoOrPageSize(filteredValues);
	}, [pageNo, pageSize]);

	const handlePageChange = (page: number) => {
		setPageNo(page);
	};

	const handlePageSizeChange = (newPageSize: number) => {
		setPageSize(newPageSize);
	};

	const tableColumns = [
		{
			title: t('SHIPPING_TYPE_NAME'),
			field: 'shipping_type_name',
			cellStyle: {
				padding: '4px 8px'
			}
		},
		{
			title: t('Created Date'),
			field: 'create_date',
			cellStyle: {
				padding: '4px 8px'
			}
		},
		{
			title: t('ALLOW_TRANSIT_DELAY'),
			field: 'allow_transit_delay',
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
			render: (rowData: ShippingTypeModifiedData) => (
				<FormGroup>
					<FormControlLabel
						control={
							<Switch
								checked={rowData.active}
								onClick={() => handleSwitchClick(rowData)}
								aria-label="active switch"
								size="small"
								sx={{
									'& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
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

	const handleSwitchClick = (rowData: ShippingTypeModifiedData) => {
		setSelectedActiveRowData(rowData);
		toggleActiveModal();
	};

	const handleConfirmStatusChange = async () => {
		toggleActiveModal();

		const id = selectedActiveRowData?.id ?? null;
		try {
			const data = {
				is_active: selectedActiveRowData?.active === true ? 0 : 1
			};
			await axios.put(`${CREATE_SHIPPING_TYPE}/${id}`, data);
			fetchAllShippingTypes();

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

	const fetchAllShippingTypes = async () => {
		setTableLoading(true);
		try {
			const response: AxiosResponse<ShippingTypeApiResponse> = await axios.get(
				`${CREATE_SHIPPING_TYPE}?limit=${pageSize}&page=${pageNo}`
			);
			const transformedData: ShippingTypeModifiedData[] = response?.data?.data?.map(
				(item: ShippingTypeResponse) => ({
					...item,
					shipping_type_name: item?.name,
					create_date: item?.created_at?.slice(0, 10),
					allow_transit_delay: item?.allow_transit_delay === 1 ? 'Allowed' : 'Not Allowed',
					active: item?.is_active === 1,
					allow_transit_delay_type: item?.allow_transit_delay === 1,
					shipping_method_ids: item?.shipping_method?.map((method) => method?.id)
				})
			);

			setSampleData(transformedData);
			setCount(response.data.meta.total);
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

	const changePageNoOrPageSize = async (filteredValues: ShippingTypeFilterSubmitData) => {
		setTableLoading(true);
		try {
			const response: AxiosResponse<ShippingTypeApiResponse> = await axios.get(
				`${CREATE_SHIPPING_TYPE}?filter=name,${filteredValues.shippingTypeName}&limit=${pageSize}&page=${pageNo}`
			);
			const transformedData: ShippingTypeModifiedData[] = response?.data?.data?.map(
				(item: ShippingTypeResponse) => ({
					...item,
					shipping_type_name: item?.name,
					create_date: item?.created_at?.slice(0, 10),
					allow_transit_delay: item?.allow_transit_delay === 1 ? 'Allowed' : 'Not Allowed',
					active: item?.is_active === 1,
					allow_transit_delay_type: item?.allow_transit_delay === 1,
					shipping_method_ids: item?.shipping_method?.map((method) => method?.id)
				})
			);

			setSampleData(transformedData);
			setCount(response.data.meta.total);
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

	const handleRowDelete = async (rowData: ShippingTypeModifiedData) => {
		setSelectedDeleteRowData(rowData);
		toggleDeleteModal();
	};

	const handleAlertForm = async () => {
		toggleDeleteModal();
		const id = selectedDeleteRowData?.id ?? null;
		try {
			await axios.delete(`${CREATE_SHIPPING_TYPE}/${id}`);
			fetchAllShippingTypes();
			toast.success('Deleted successfully');
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

	const handleView = async (rowData: ShippingTypeModifiedData) => {
		setSelectedViewRowData(rowData);
		toggleShippingTypeViewModal();
	};

	const handleEdit = async (rowData: ShippingTypeModifiedData) => {
		setSelectedEditRowData(rowData);
		toggleShippingTypeEditModal();
	};

	const handleNewShippingType = () => {
		toggleNewShippingTypeModal();
	};

	const handleSubmit1 = (values: ShippingTypeFilterSubmitData) => {};
	const changeCode = async (value: string, form: FormikProps<ShippingTypeFilterSubmitData>) => {
		form.setFieldValue('shippingTypeName', value);
		setFilteredValues({
			...filteredValues,
			shippingTypeName: value.length === 0 ? null : value
		});
	};
	const handleClearForm = (resetForm: FormikHelpers<ShippingTypeFilterSubmitData>['resetForm']) => {
		resetForm();
		setFilteredValues({
			shippingTypeName: null
		});
	};

	return (
		<div className="min-w-full max-w-[100vw]">
			<NavigationViewComp title="Shipping / Shipping Types" />

			<Formik
				initialValues={{ shippingTypeName: '' }}
				validationSchema={null}
				onSubmit={handleSubmit1}
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
								<Typography className="formTypography">{t('Shipping Type Name')}</Typography>
								<CustomFormTextField
									name="shippingTypeName"
									id="shippingTypeName"
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
								md={8}
								lg={9}
								className="flex flex-wrap justify-between items-start gap-[10px] formikFormField !pt-[10px] sm:!pt-[26px]"
							>
								<Button
									className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
									type="submit"
									variant="contained"
									size="medium"
									disabled={false}
									onClick={() => handleClearForm(resetForm)}
								>
									{t('Clear')}
								</Button>
								<Button
									className="min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
									type="button"
									variant="contained"
									size="medium"
									onClick={handleNewShippingType}
								>
									{t('NEW_SHIPPING_TYPE')}
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
						loading={isTableLoading}
						setPageSize={setPageSize}
						pageIndex={pageNo}
						searchByText=""
						count={count}
						exportToExcel={null}
						externalAdd={null}
						externalEdit={null}
						externalView={null}
						selection={false}
						selectionExport={null}
						isColumnChoser
						disableSearch
						records={sampleData}
						tableRowViewHandler={handleView}
						tableRowEditHandler={handleEdit}
						tableRowDeleteHandler={handleRowDelete}
					/>
				</Grid>
			</Grid>

			{/* New Shipping Type Modal */}
			{isOpenNewShippingTypeModal && (
				<NewShippingTypeModel
					isOpen={isOpenNewShippingTypeModal}
					toggleModal={toggleNewShippingTypeModal}
					clickedRowData={{}}
					fetchAllShippingTypes={fetchAllShippingTypes}
					isTableMode=""
				/>
			)}

			{/* View Modal */}
			{isOpenShippingTypeViewModal && (
				<NewShippingTypeModel
					isOpen={isOpenShippingTypeViewModal}
					toggleModal={toggleShippingTypeViewModal}
					clickedRowData={selectedViewRowData}
					isTableMode="view"
					fetchAllShippingTypes={fetchAllShippingTypes}
				/>
			)}

			{/* Edit Modal */}
			{isOpenShippingTypeEditModal && (
				<NewShippingTypeModel
					isOpen={isOpenShippingTypeEditModal}
					toggleModal={toggleShippingTypeEditModal}
					clickedRowData={selectedEditRowData}
					isTableMode="edit"
					fetchAllShippingTypes={fetchAllShippingTypes}
				/>
			)}

			{isOpenActiveModal && (
				<ShippingTypeActiveComp
					toggleModal={toggleActiveModal}
					isOpen={isOpenActiveModal}
					clickedRowData={selectedActiveRowData}
					handleAlertForm={handleConfirmStatusChange}
				/>
			)}

			{isOpenDeleteModal && (
				<ShippingTypeDeleteAlertForm
					toggleModal={toggleDeleteModal}
					isOpen={isOpenDeleteModal}
					clickedRowData={selectedDeleteRowData}
					handleAlertForm={handleAlertForm}
				/>
			)}
		</div>
	);
}

export default ShippingTypes;
