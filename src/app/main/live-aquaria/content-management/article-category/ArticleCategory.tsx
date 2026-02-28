import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';
import * as yup from 'yup';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { Form, Formik, FormikHelpers, FormikProps } from 'formik';
import { toast } from 'react-toastify';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Autocomplete, Button, TextField } from '@mui/material';
import useDebounce from 'app/shared-components/useDebounce';
import NavigationViewComp from '../../../../common/FormComponents/NavigationViewComp';

import { CategorySearchFormData } from '../../laq-master-data/category-nanagement/category-nanagement-types/CategoryManagementTypes';
import MaterialTableWrapper from '../../../../common/tableComponents/MaterialTableWrapper';
import NewArticleCategoryDialogForm from './components/NewArticleCategoryDialogForm';
import ViewArticleCategoryCategoryDialogForm from './components/ViewArticleCategoryCategoryDialogForm';
import ArticleCategoryDeleteAlertForm from './components/ArticleCategoryDeleteAlertForm';
import ArticleCategoryActiveAlertForm from './components/ArticleCategoryActiveAlertForm';

import {
	ArticleCategoryType,
	MappedArticleCategory,
	ArticleCategoryResponse
} from './article-category-types/ArticleCategoryTypes';
import {
	deleteArticleCategories,
	getAllAdvanceFilteringArticleCategoriesDataWithPagination,
	getAllArticleCategoriesWithPagination,
	updateArticleCategories
} from '../../../../axios/services/live-aquaria-services/article-services/ArticleServices';
import CustomFormTextField from '../../../../common/FormComponents/CustomFormTextField';
import { CommonProductMasterModifiedData } from '../../laq-master-data/common-product-master/common-product-master-types/CommonProductMasterTypes';

interface ErrorResponse {
	response?: {
		data?: {
			message?: string;
		};
	};
}

function ArticleCategory() {
	const { t } = useTranslation('articleCategory');
	const [pageNo, setPageNo] = useState<number>(0);
	const [pageSize, setPageSize] = useState<number>(5);
	const [count, setCount] = useState(100);
	const [isTableLoading, setTableLoading] = useState(false);
	const [tableData, setTableData] = useState<MappedArticleCategory[]>([]);
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
	const [clickedRowData, setClickedRowData] = useState({} as MappedArticleCategory);
	const [clickedEditRowData, setClickedEditRowData] = useState({} as MappedArticleCategory);
	const [clickedDeleteRowData, setClickedDeleteRowData] = useState({} as MappedArticleCategory);
	const [clickedActiveRowData, setClickedActiveRowData] = useState({} as MappedArticleCategory);
	const [filteredValues, setFilteredValues] = useState<CategorySearchFormData>({
		categoryName: null,
		aquatic_type: null
	});

	const debouncedFilter = useDebounce<CategorySearchFormData>(filteredValues, 1000);

	useEffect(() => {
		if (debouncedFilter) changePageNoOrPageSize(filteredValues);
	}, [debouncedFilter]);

	useEffect(() => {
		changePageNoOrPageSize(filteredValues);
	}, [pageNo, pageSize]);
	const schema = yup.object().shape({});

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
		getAllCategory();
	}, [pageNo, pageSize]);

	const tableColumns = [
		{
			title: t('CATEGORY_NAME'),
			field: 'categoryName'
		},
		{
			title: t('REFERENCE_NAME'),
			field: 'referenceName'
		},
		{
			title: t('Aquatic Type'),
			field: 'aquatic_type',
			render: (rowData: CommonProductMasterModifiedData, index: number) => {
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
				return <span>{chipColor}</span>;
			}
		},
		{
			title: t('ACTIVE'),
			field: 'active',
			render: (rowData: MappedArticleCategory, index) => (
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
			const response: ArticleCategoryType = await getAllArticleCategoriesWithPagination(pageNo, pageSize);
			setCount(response.meta.total);
			const mapperData: MappedArticleCategory[] = response.data.map((item: ArticleCategoryResponse) => ({
				...item,
				categoryName: item.name,
				referenceName: item.reference,
				active: item.is_active === 1
			}));
			setTableData(mapperData);
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
	const handleSwitchChange = (index, rowData: MappedArticleCategory) => async (event) => {
		setClickedActiveRowData(rowData);
		toggleActiveCategoryModal();
	};

	const onSubmit = (values: CategorySearchFormData) => {};

	const handleOpenNewCategoryModal = () => {
		toggleNewCategoryModal();
	};

	const tableRowViewHandler = (rowData: MappedArticleCategory) => {
		setClickedRowData(rowData);
		toggleViewCategoryModal();
	};

	const tableRowEditHandler = (rowData: MappedArticleCategory) => {
		setClickedEditRowData(rowData);
		toggleEditCategoryModal();
	};

	const tableRowDeleteHandler = (rowData: MappedArticleCategory) => {
		setClickedDeleteRowData(rowData);
		toggleDeleteCategoryModal();
	};

	const handleAlertForm = async () => {
		const id: string = clickedDeleteRowData.id ? clickedDeleteRowData.id : '';
		setTableLoading(true);
		toggleDeleteCategoryModal();
		try {
			const response = await deleteArticleCategories(id);
			getAllCategory();
			setTableLoading(false);
			toast.success('Deleted Successfully');
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
		const id: string = clickedActiveRowData.id ? clickedActiveRowData.id : '';
		toggleActiveCategoryModal();
		setTableLoading(true);
		const requestData = {
			name: clickedActiveRowData.name ?? null,
			is_active: clickedActiveRowData.active === true ? 0 : 1
		};

		try {
			const response = await updateArticleCategories(requestData, id);
			getAllCategory();
			setTableLoading(false);

			if (requestData.is_active === 1) {
				toast.success('Activated Successfully');
			} else {
				toast.success('Inactivated Successfully');
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

	const changePageNoOrPageSize = async (filteredValues: CategorySearchFormData) => {
		setTableLoading(true);
		try {
			const response: ArticleCategoryType = await getAllAdvanceFilteringArticleCategoriesDataWithPagination(
				filteredValues.categoryName,
				filteredValues.aquatic_type,
				pageNo,
				pageSize
			);
			setCount(response.meta.total);
			const mapperData: MappedArticleCategory[] = response.data.map((item: ArticleCategoryResponse) => ({
				...item,
				categoryName: item.name,
				referenceName: item.reference,
				active: item.is_active === 1
			}));
			setTableData(mapperData);
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
			categoryName: value.length === 0 ? null : value
		});
	};

	const changeAquaticType = async (value: string) => {
		setFilteredValues({
			...filteredValues,
			aquatic_type: value
		});
	};

	const handleClearForm = (resetForm: FormikHelpers<CategorySearchFormData>['resetForm']) => {
		resetForm();
		setFilteredValues({
			categoryName: null,
			aquatic_type: null
		});
	};

	return (
		<div className="min-w-full max-w-[100vw]">
			<NavigationViewComp title="Article Category" />

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
					/>
				</Grid>
			</Grid>

			{isOpenNewCategoryModal && (
				<NewArticleCategoryDialogForm
					isOpen={isOpenNewCategoryModal}
					toggleModal={toggleNewCategoryModal}
					getAllCategory={getAllCategory}
				/>
			)}

			{isOpenViewCategoryModal && (
				<ViewArticleCategoryCategoryDialogForm
					isOpen={isOpenViewCategoryModal}
					toggleModal={toggleViewCategoryModal}
					clickedRowData={clickedRowData}
					compType="view"
					getAllCategory={getAllCategory}
				/>
			)}

			{isOpenEditCategoryModal && (
				<ViewArticleCategoryCategoryDialogForm
					isOpen={isOpenEditCategoryModal}
					toggleModal={toggleEditCategoryModal}
					clickedRowData={clickedEditRowData}
					compType=""
					getAllCategory={getAllCategory}
				/>
			)}

			{isOpenDeleteCategoryModal && (
				<ArticleCategoryDeleteAlertForm
					isOpen={isOpenDeleteCategoryModal}
					toggleModal={toggleDeleteCategoryModal}
					clickedRowData={clickedDeleteRowData}
					handleAlertForm={handleAlertForm}
				/>
			)}

			{isOpenActiveCategoryModal && (
				<ArticleCategoryActiveAlertForm
					isOpen={isOpenActiveCategoryModal}
					toggleModal={toggleActiveCategoryModal}
					clickedRowData={clickedActiveRowData}
					handleAlertForm={handleActiveAlertForm}
				/>
			)}
		</div>
	);
}

export default ArticleCategory;
