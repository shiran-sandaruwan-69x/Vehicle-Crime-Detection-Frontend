import {Autocomplete, Button, TextField} from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Grid from '@mui/material/Grid';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import { Form, Formik, FormikHelpers, FormikProps } from 'formik';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import useDebounce from 'app/shared-components/useDebounce';
import NavigationViewComp from '../../../../common/FormComponents/NavigationViewComp';
import MaterialTableWrapper from '../../../../common/tableComponents/MaterialTableWrapper';
import CategoryDeleteAlertForm from './components/CategoryDeleteAlertForm';
import NewCategoryDialogForm from './components/NewCategoryDialogForm';
import ViewCategoryDialogForm from './components/ViewCategoryDialogForm';

import {
	deleteCategoryManagement,
	getAllAdvanceFilteringItemCategoriesDataWithPagination,
	getAllCategoryManagementWithPagination,
	updateCategoryManagement
} from '../../../../axios/services/live-aquaria-services/master-data-services/MasterDataServices';
import {
	Category,
	CategorySearchFormData,
	CategoryType,
	FlattenedCategory
} from './category-nanagement-types/CategoryManagementTypes';
import CategoryActiveAlertForm from './components/CategoryActiveAlertForm';

import CustomFormTextField from '../../../../common/FormComponents/CustomFormTextField';
import {
	CommonProductMasterModifiedData
} from "../common-product-master/common-product-master-types/CommonProductMasterTypes";

interface ErrorResponse {
	response?: {
		data?: {
			message?: string;
		};
	};
}

function CategoryManagement() {
	const { t } = useTranslation('categoryManagement');
	const [pageNo, setPageNo] = useState<number>(0);
	const [pageSize, setPageSize] = useState<number>(5);
	const [count, setCount] = useState(100);
	const [isTableLoading, setTableLoading] = useState(false);
	const [tableData, setTableData] = useState<FlattenedCategory[]>([]);
	const [isOpenNewCategoryModal, setOpenNewCategoryModal] = useState(false);
	const [isOpenViewCategoryModal, setOpenViewCategoryModal] = useState(false);
	const [isOpenEditCategoryModal, setOpenEditCategoryModal] = useState(false);
	const [isOpenDeleteCategoryModal, setOpenDeleteCategoryModal] = useState(false);
	const [isOpenActiveCategoryModal, setOpenActiveCategoryModal] = useState(false);
	const toggleNewCategoryModal = () => setOpenNewCategoryModal(!isOpenNewCategoryModal);
	const toggleViewCategoryModal = () => setOpenViewCategoryModal(!isOpenViewCategoryModal);
	const toggleEditCategoryModal = () => setOpenEditCategoryModal(!isOpenEditCategoryModal);
	const toggleDeleteCategoryModal = () => setOpenDeleteCategoryModal(!isOpenDeleteCategoryModal);
	const toggleActiveCategoryModal = () => setOpenActiveCategoryModal(!isOpenActiveCategoryModal);
	const [isAquaticType, setAquaticType] = useState([]);
	const [clickedRowData, setClickedRowData] = useState({} as FlattenedCategory);
	const [clickedEditRowData, setClickedEditRowData] = useState({} as FlattenedCategory);
	const [clickedDeleteRowData, setClickedDeleteRowData] = useState({} as FlattenedCategory);
	const [clickedActiveRowData, setClickedActiveRowData] = useState({} as FlattenedCategory);

	const [filteredValues, setFilteredValues] = useState<CategorySearchFormData>({
		categoryName: null,
		aquatic_type: null
	});
	const debouncedFilter = useDebounce<CategorySearchFormData>(filteredValues, 1000);

	const schema = yup.object().shape({});

	useEffect(() => {
		if (debouncedFilter) changePageNoOrPageSize(filteredValues);
	}, [debouncedFilter]);

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
		changePageNoOrPageSize(filteredValues);
	}, [pageNo, pageSize]);

	const tableColumns = [
		{
			title: t('CATEGORY'),
			field: 'category'
		},
		{
			title: t('CATEGORY_NAME'),
			field: 'categoryName'
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
			title: t('REFERENCE_NAME'),
			field: 'referenceName'
		},
		{
			title: t('ACTIVE'),
			field: 'active',
			render: (rowData: FlattenedCategory, index) => (
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

	const getAllCategory = async () => {
		setTableLoading(true);
		try {
			const response: CategoryType = await getAllCategoryManagementWithPagination(pageNo, pageSize);
			setCount(response.meta.total);
			const data1: Category[] = response.data;
			const flattenData = (items: Category[], parentId: string | null = null): FlattenedCategory[] => {
				return items.reduce((acc: FlattenedCategory[], item: Category) => {
					const newItem: FlattenedCategory = {
						id: item.id,
						category: item.name,
						goodsType: item.goods_type,
						aquatic_type: item.aquatic_type,
						categoryName: Array.isArray(item.sub_item_categories)
							? item.sub_item_categories.map((sub) => sub.name).join(', ')
							: '',
						referenceName: item.reference,
						attachment: item.attachment,
						active: item.is_active === 1,
						parentId
					};

					const subCategories = flattenData(item.sub_item_categories || [], item.id);

					return acc.concat(newItem, subCategories);
				}, []);
			};

			const modifiedData: FlattenedCategory[] = flattenData(data1);
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

	const handleSwitchChange = (index, rowData: FlattenedCategory) => async (event) => {
		setClickedActiveRowData(rowData);
		toggleActiveCategoryModal();
	};

	const onSubmit = (values: CategorySearchFormData) => {};

	const handleClearForm = (resetForm: FormikHelpers<CategorySearchFormData>['resetForm']) => {
		resetForm();
		setFilteredValues({
			categoryName: null,
			aquatic_type: null
		});
	};

	const handleOpenNewCategoryModal = () => {
		toggleNewCategoryModal();
	};

	const tableRowViewHandler = (rowData: FlattenedCategory) => {
		setClickedRowData(rowData);
		toggleViewCategoryModal();
	};

	const tableRowEditHandler = (rowData: FlattenedCategory) => {
		setClickedEditRowData(rowData);
		toggleEditCategoryModal();
	};

	const tableRowDeleteHandler = (rowData: FlattenedCategory) => {
		setClickedDeleteRowData(rowData);
		toggleDeleteCategoryModal();
	};

	const handleAlertForm = async () => {
		const id: string = clickedDeleteRowData.id ? clickedDeleteRowData.id : '';

		try {
			const response = await deleteCategoryManagement(id);
			getAllCategory();
			toggleDeleteCategoryModal();
			toast.success('Deleted Successfully');
		} catch (error: any) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			if (error?.response && error?.response?.data?.message) {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-argument
				toast.error(error?.response?.data?.message);
			} else {
				toast.error('Internal server error');
			}

			toggleDeleteCategoryModal();
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
		const id: string = clickedActiveRowData.id ? clickedActiveRowData.id : '';
		const requestData = {
			name: clickedActiveRowData.category ?? null,
			is_active: clickedActiveRowData.active === true ? 0 : 1
		};

		try {
			const response = await updateCategoryManagement(requestData, id);
			getAllCategory();
			toggleActiveCategoryModal();

			if (requestData.is_active === 0) {
				toast.success('Inactivated Successfully');
			} else {
				toast.success('Activated Successfully');
			}
		} catch (error: any) {
			toggleActiveCategoryModal();
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

	type RowType = {
		id: string;
		parentId?: string | null;
		[key: string]: any;
	};

	const changePageNoOrPageSize = async (filteredValues: CategorySearchFormData) => {
		setTableLoading(true);
		try {
			const response: CategoryType = await getAllAdvanceFilteringItemCategoriesDataWithPagination(
				filteredValues.categoryName,
				filteredValues.aquatic_type,
				pageNo,
				pageSize
			);
			setCount(response.meta.total);
			const data1: Category[] = response.data;
			const flattenData = (items: Category[], parentId: string | null = null): FlattenedCategory[] => {
				return items.reduce((acc: FlattenedCategory[], item: Category) => {
					const newItem: FlattenedCategory = {
						id: item.id,
						category: item.name,
						goodsType: item.goods_type,
						aquatic_type: item.aquatic_type,
						categoryName: Array.isArray(item.sub_item_categories)
							? item.sub_item_categories.map((sub) => sub.name).join(', ')
							: '',
						referenceName: item.reference,
						attachment: item.attachment,
						active: item.is_active === 1,
						parentId
					};

					const subCategories = flattenData(item.sub_item_categories || [], item.id);

					return acc.concat(newItem, subCategories);
				}, []);
			};

			const modifiedData: FlattenedCategory[] = flattenData(data1);
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

	const changeCategoryName = async (value: string, form: FormikProps<CategorySearchFormData>) => {
		form.setFieldValue('categoryName', value);
		setFilteredValues({
			...filteredValues,
			categoryName: value
		});
	};

	const changeAquaticType = async (value: string) => {
		setFilteredValues({
			...filteredValues,
			aquatic_type: value
		});
	};

	return (
		<div className="min-w-full max-w-[100vw]">
			<NavigationViewComp title="Category Management" />

			<Formik
				initialValues={{
					categoryName: '',
					aquatic_type: ''
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
								<Typography className="formTypography">{t('CATEGORY_NAME')}</Typography>
								<CustomFormTextField
									name="categoryName"
									id="categoryName"
									type="text"
									placeholder=""
									disabled={false}
									changeInput={changeCategoryName}
								/>
							</Grid>

							<Grid
								item
								xs={12}
								sm={6}
								md={4}
								lg={3}
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
								lg={6}
								className="flex flex-wrap justify-between items-start gap-[10px] formikFormField pt-[10px!important] sm:pt-[26px!important]"
							>
								<Button
									className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
									type="button"
									variant="contained"
									size="medium"
									disabled={false}
									onClick={() => handleClearForm(resetForm)}
								>
									{t('Clear')}
								</Button>

								<Button
									className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
									type="button"
									variant="contained"
									size="medium"
									disabled={false}
									onClick={handleOpenNewCategoryModal}
								>
									{t('CREATE_CATEGORY')}
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
						parentChildData={(row: RowType, rows: RowType[]) => {
							return rows.find((a: RowType) => a.id === row.parentId);
						}}
						disableSearch
					/>
				</Grid>
			</Grid>

			{isOpenNewCategoryModal && (
				<NewCategoryDialogForm
					isOpen={isOpenNewCategoryModal}
					toggleModal={toggleNewCategoryModal}
					getAllCategory={getAllCategory}
				/>
			)}

			{isOpenViewCategoryModal && (
				<ViewCategoryDialogForm
					isOpen={isOpenViewCategoryModal}
					toggleModal={toggleViewCategoryModal}
					clickedRowData={clickedRowData}
					compType="view"
					getAllCategory={getAllCategory}
				/>
			)}

			{isOpenEditCategoryModal && (
				<ViewCategoryDialogForm
					isOpen={isOpenEditCategoryModal}
					toggleModal={toggleEditCategoryModal}
					clickedRowData={clickedEditRowData}
					compType=""
					getAllCategory={getAllCategory}
				/>
			)}

			{isOpenDeleteCategoryModal && (
				<CategoryDeleteAlertForm
					isOpen={isOpenDeleteCategoryModal}
					toggleModal={toggleDeleteCategoryModal}
					clickedRowData={clickedDeleteRowData}
					handleAlertForm={handleAlertForm}
				/>
			)}

			{isOpenActiveCategoryModal && (
				<CategoryActiveAlertForm
					isOpen={isOpenActiveCategoryModal}
					toggleModal={toggleActiveCategoryModal}
					clickedRowData={clickedActiveRowData}
					handleAlertForm={handleActiveAlertForm}
				/>
			)}
		</div>
	);
}

export default CategoryManagement;
