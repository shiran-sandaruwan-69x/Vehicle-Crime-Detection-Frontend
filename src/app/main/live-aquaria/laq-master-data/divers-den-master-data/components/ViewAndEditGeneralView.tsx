import { Button, CircularProgress, Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import FormDropdown from '../../../../../common/FormComponents/FormDropdown';
import TextFormField from '../../../../../common/FormComponents/FormTextField';
import {
	CreateGeneralViewTypes,
	GeneralViewModifyData,
	ItemCategory,
	MappedCategoryTypes,
	SubOptionsTypes
} from '../../product-list/product-list-types/ProductListTypes';
import {
	getAllCategoryManagementWithOutPagination,
	getDriversDenMasterData,
	updateDriversDenMasterData
} from '../../../../../axios/services/live-aquaria-services/master-data-services/MasterDataServices';
import {
	Category,
	CategoryType,
	ModifiedCategoryData
} from '../../category-nanagement/category-nanagement-types/CategoryManagementTypes';
import CommonHeading from '../../../../../common/FormComponents/CommonHeading';
import {
	OneProductDiversDenMasterType,
	ProductDiversDenMaster,
	ProductDiversDenMasterModifyData
} from '../drivers-den-types/DriversDenTypes';

interface ErrorResponse {
	response?: {
		data?: {
			message?: string;
		};
	};
}
interface Props {
	isTableMode: string;
	clickedRowData: ProductDiversDenMasterModifyData;
	fetchAllProductList: () => void;
	toggleModal?: () => void;
}

function ViewAndEditGeneralView({ clickedRowData, isTableMode, fetchAllProductList, toggleModal }: Props) {
	const { t } = useTranslation('diversDenMasterData');
	const [isCategory, setIsCategory] = useState<MappedCategoryTypes[]>([]);
	const [subCategory, setSubCategory] = useState<SubOptionsTypes[]>([]);

	const [isVProduct, setVProduct] = useState<GeneralViewModifyData>({});
	const [isGeneralViewProduct, setGeneralViewProduct] = useState<ProductDiversDenMaster>({});
	const [isProductSubmitDataLoading, setProductSubmitDataLoading] = useState(false);
	const [parentCategory1, setParentCategory1] = useState<ModifiedCategoryData[]>([]);
	const [parentCategory2, setParentCategory2] = useState<ModifiedCategoryData[]>([]);
	const [parentCategory3, setParentCategory3] = useState<ModifiedCategoryData[]>([]);
	const [parentCategory4, setParentCategory4] = useState<ModifiedCategoryData[]>([]);
	const [parentCategory5, setParentCategory5] = useState<ModifiedCategoryData[]>([]);
	const [allData, setAllData] = useState<Category[]>([]);
	const [initialValues, setAllInitialValues] = useState<CreateGeneralViewTypes>({});

	const schema = yup.object().shape({
		product_name: yup.string().required(t('Product Name is required')),
		scientific_name: yup.string().required(t('Scientific Name is required')),
		parentCategory1: yup.string().required('Parent Category is required'),
		parentCategory2: yup.string().when('parentCategory1', {
			is: (val) => !!val && parentCategory2.length > 0,
			then: yup.string().required('Category Level 1 is required')
		}),
		parentCategory3: yup.string().when('parentCategory2', {
			is: (val) => !!val && parentCategory3.length > 0,
			then: yup.string().required('Category Level 2 is required')
		}),
		parentCategory4: yup.string().when('parentCategory3', {
			is: (val) => !!val && parentCategory4.length > 0,
			then: yup.string().required('Category Level 3 is required')
		}),
		parentCategory5: yup.string().when('parentCategory4', {
			is: (val) => !!val && parentCategory5.length > 0,
			then: yup.string().required('Category Level 4 is required')
		})
	});

	const [isLoading, setIsLoading] = useState(false);

	const handleClearForm = (resetForm: FormikHelpers<CreateGeneralViewTypes>['resetForm']) => {
		resetForm({
			values: {
				product_name: '',
				scientific_name: '',
				parentCategory1: '',
				parentCategory2: '',
				parentCategory3: '',
				parentCategory4: '',
				parentCategory5: ''
			}
		});
	};

	useEffect(() => {
		fetchDataProductId();
	}, []);

	const fetchDataProductId = async () => {
		setIsLoading(true);
		try {
			const productId = clickedRowData.id ? clickedRowData.id : '';
			const response: OneProductDiversDenMasterType = await getDriversDenMasterData(productId);

			let initialData = {
				parentCategory1: '',
				parentCategory2: '',
				parentCategory3: '',
				parentCategory4: '',
				parentCategory5: ''
			};

			if (response?.data?.item_category === null) {
				initialData = {
					parentCategory1: '',
					parentCategory2: '',
					parentCategory3: '',
					parentCategory4: '',
					parentCategory5: ''
				};
			} else {
				let parentCategoryDepth: number = 0;
				let currentCategory: ItemCategory = response?.data?.item_category;

				while (currentCategory?.parent_item_category !== null) {
					parentCategoryDepth += 1;
					currentCategory = currentCategory.parent_item_category;
				}

				switch (parentCategoryDepth) {
					case 0:
						initialData = {
							parentCategory1: response.data.item_category.id,
							parentCategory2: '',
							parentCategory3: '',
							parentCategory4: '',
							parentCategory5: ''
						};
						break;
					case 1:
						initialData = {
							parentCategory1: response.data.item_category.parent_item_category.id,
							parentCategory2: response.data.item_category.id,
							parentCategory3: '',
							parentCategory4: '',
							parentCategory5: ''
						};
						break;
					case 2:
						initialData = {
							parentCategory1: response.data.item_category.parent_item_category.parent_item_category.id,
							parentCategory2: response.data.item_category.parent_item_category.id,
							parentCategory3: response.data.item_category.id,
							parentCategory4: '',
							parentCategory5: ''
						};
						break;
					case 3:
						initialData = {
							parentCategory1:
								response.data.item_category.parent_item_category.parent_item_category
									.parent_item_category.id,
							parentCategory2: response.data.item_category.parent_item_category.parent_item_category.id,
							parentCategory3: response.data.item_category.parent_item_category.id,
							parentCategory4: response.data.item_category.id,
							parentCategory5: ''
						};
						break;
					case 4:
						initialData = {
							parentCategory1:
								response.data.item_category.parent_item_category.parent_item_category
									.parent_item_category.parent_item_category.id,
							parentCategory2:
								response.data.item_category.parent_item_category.parent_item_category
									.parent_item_category.id,
							parentCategory3: response.data.item_category.parent_item_category.parent_item_category.id,
							parentCategory4: response.data.item_category.parent_item_category.id,
							parentCategory5: response.data.item_category.id
						};
						break;
					default:
						initialData = {
							parentCategory1: '',
							parentCategory2: '',
							parentCategory3: '',
							parentCategory4: '',
							parentCategory5: ''
						};
						break;
				}
			}

			setGeneralViewProduct(response.data);
			setAllInitialValues(initialData);
			setIsLoading(false);
		} catch (error) {
			const isErrorResponse = (error: unknown): error is ErrorResponse => {
				return typeof error === 'object' && error !== null && 'response' in error;
			};

			if (isErrorResponse(error) && error.response?.data?.message) {
				toast.error(error.response.data.message);
			} else {
				toast.error('Internal server error');
			}
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		getAllParentCategory();
	}, [initialValues]);
	const getAllParentCategory = async () => {
		try {
			const response: CategoryType = await getAllCategoryManagementWithOutPagination();
			setAllData([response?.data?.[0]]);
			setParentCategory1(
				[response?.data?.[0]]?.map((item) => ({
					value: item.id,
					label: item.name
				}))
			);
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

	useEffect(() => {
		if (parentCategory1.length > 0) {
			// Automatically load subcategories based on initial values
			loadSubCategories(
				initialValues.parentCategory1,
				setParentCategory2,
				() => {},
				() => {},
				() => {}
			);
			loadSubCategories(
				initialValues.parentCategory2,
				setParentCategory3,
				() => {},
				() => {},
				() => {}
			);
			loadSubCategories(
				initialValues.parentCategory3,
				setParentCategory4,
				() => {},
				() => {},
				() => {}
			);
			loadSubCategories(
				initialValues.parentCategory4,
				setParentCategory5,
				() => {},
				() => {},
				() => {}
			);
		}
	}, [parentCategory1]);

	useEffect(() => {
		if (isCategory.length > 0 && initialValues.category) {
			const selectedCategory = isCategory.find((code) => code.value === initialValues.category);

			if (selectedCategory && selectedCategory.subCategory) {
				const subOptions: SubOptionsTypes[] = selectedCategory.subCategory.map((sub) => ({
					value: sub.id,
					label: sub.name
				}));
				setSubCategory(subOptions);
			} else {
				setSubCategory([]);
			}
		}
	}, [isCategory, initialValues.category]);

	type LoadSubCategoriesType = (
		id: string,
		setCategory: React.Dispatch<React.SetStateAction<{ value: string; label: string }[]>>,
		setClearCategory3: React.Dispatch<React.SetStateAction<string>> | null,
		setClearCategory4: React.Dispatch<React.SetStateAction<string>> | null,
		setClearCategory5: React.Dispatch<React.SetStateAction<string>> | null
	) => void;

	const createSetFieldValue = (field: string, setFieldValue: (field: string, value: string) => void) => {
		return (value: string) => setFieldValue(field, value);
	};

	const loadSubCategories: LoadSubCategoriesType = (
		id,
		setCategory,
		setClearCategory3,
		setClearCategory4,
		setClearCategory5
	) => {
		if (!id || !allData || !allData.length) return;

		const findCategoryById = (categories: Category[], id: string): Category | null => {
			// eslint-disable-next-line no-restricted-syntax
			for (const category of categories) {
				if (category.id === id) {
					return category;
				}

				if (category.sub_item_categories && category.sub_item_categories.length) {
					const result = findCategoryById(category.sub_item_categories, id);

					if (result) return result;
				}
			}
			return null;
		};

		const parentCategory: Category = findCategoryById(allData, id);

		if (parentCategory) {
			if (parentCategory.sub_item_categories && parentCategory.sub_item_categories.length > 0) {
				setCategory(
					parentCategory.sub_item_categories.map((sub) => ({
						value: sub.id,
						label: sub.name
					}))
				);

				if (setClearCategory3) setClearCategory3('');

				if (setClearCategory4) setClearCategory4('');

				if (setClearCategory5) setClearCategory5('');
			} else {
				setCategory([]);

				if (setClearCategory3) setClearCategory3('');

				if (setClearCategory4) setClearCategory4('');

				if (setClearCategory5) setClearCategory5('');
			}
		} else {
			setCategory([]);

			if (setClearCategory3) setClearCategory3('');

			if (setClearCategory4) setClearCategory4('');

			if (setClearCategory5) setClearCategory5('');
		}
	};

	const handleCategoryChange = (
		newCategoryId,
		setFieldValue: FormikHelpers<CreateGeneralViewTypes>['setFieldValue']
	) => {
		const selectedCategory = isCategory.find((code) => code.value === newCategoryId);

		if (selectedCategory && selectedCategory.subCategory) {
			const subOptions = selectedCategory.subCategory.map((sub) => ({
				value: sub.id,
				label: sub.name
			}));
			setSubCategory(subOptions);
			setFieldValue('subCategory', '');
		} else {
			setSubCategory([]);
			setFieldValue('subCategory', '');
		}
	};

	const onSubmit = async (values: CreateGeneralViewTypes) => {
		let parentId: string;

		if (values?.parentCategory5) {
			parentId = values?.parentCategory5;
		} else if (values?.parentCategory4) {
			parentId = values?.parentCategory4;
		} else if (values?.parentCategory3) {
			parentId = values?.parentCategory3;
		} else if (values?.parentCategory2) {
			parentId = values?.parentCategory2;
		} else {
			parentId = values?.parentCategory1;
		}

		const reqData = {
			item_category_id: parentId,
			title: values.title,
			common_name: values.product_name,
			scientific_name: values.scientific_name,
			is_active: clickedRowData?.is_active ?? null
		};
		const id: string = clickedRowData.id ? clickedRowData.id : '';
		setProductSubmitDataLoading(true);
		try {
			const response = await updateDriversDenMasterData(reqData, id);
			setProductSubmitDataLoading(false);
			fetchDataProductId();
			fetchAllProductList();
			toast.success('Updated successfully');
		} catch (error: any) {
			setProductSubmitDataLoading(false);
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

	const defaultValues = {
		parentCategory1: initialValues.parentCategory1 || '',
		parentCategory2: initialValues.parentCategory2 || '',
		parentCategory3: initialValues.parentCategory3 || '',
		parentCategory4: initialValues.parentCategory4 || '',
		parentCategory5: initialValues.parentCategory5 || ''
	};

	if (isLoading) {
		return (
			<div className="flex justify-center items-center">
				<CircularProgress className="text-primaryBlueLight" />
			</div>
		);
	}

	return (
		<div className="min-w-full max-w-[100vw]">
			<Formik
				enableReinitialize
				initialValues={{
					cisCode: clickedRowData?.item_selection[0]?.selection_types[0]?.master_data?.cis_code || '',
					commonName: clickedRowData?.item_selection[0]?.selection_types[0]?.master_data?.common_name || '',
					scientific_name1:
						clickedRowData?.item_selection[0]?.selection_types[0]?.master_data?.scientific_name || '',
					description: clickedRowData?.item_selection[0]?.selection_types[0]?.master_data?.description || '',
					gender: clickedRowData?.item_selection[0]?.selection_types[0]?.master_data?.gender || '',
					size: clickedRowData?.item_selection[0]?.selection_types[0]?.master_data?.size || '',
					age: clickedRowData?.item_selection[0]?.selection_types[0]?.master_data?.age || '',
					origins: clickedRowData?.item_selection[0]?.selection_types[0]?.master_data?.origins || '',
					length: clickedRowData?.item_selection[0]?.selection_types[0]?.master_data?.length || '',
					product_name: isGeneralViewProduct?.common_name || '',
					scientific_name: isGeneralViewProduct?.scientific_name || '',
					category: isVProduct?.category || '',
					subCategory: isVProduct?.subCategory || '',
					...defaultValues
				}}
				validationSchema={schema}
				onSubmit={onSubmit}
			>
				{({ values, setFieldValue, isValid, resetForm, touched, errors }) => (
					<Form>
						{clickedRowData?.item_selection[0]?.selection_types[0]?.master_data && (
							<Grid
								container
								spacing={2}
								className="pt-0 mb-[20px]"
							>
								<Grid
									item
									md={12}
									lg={12}
									sm={12}
									xs={12}
								>
									<CommonHeading title="ETF Master Data" />
								</Grid>
								<Grid
									item
									lg={3}
									md={4}
									sm={6}
									xs={12}
									className="formikFormField pt-[5px!important]"
								>
									<Typography className="formTypography">{t('CIS_CODE')}</Typography>
									<Field
										name="cisCode"
										placeholder=""
										component={TextFormField}
										fullWidth
										disabled
										size="small"
									/>
								</Grid>
								<Grid
									item
									lg={3}
									md={4}
									sm={6}
									xs={12}
									className="formikFormField pt-[5px!important]"
								>
									<Typography className="formTypography">{t('COMMON_NAME')}</Typography>
									<Field
										name="commonName"
										placeholder=""
										component={TextFormField}
										fullWidth
										disabled
										size="small"
									/>
								</Grid>
								<Grid
									item
									lg={3}
									md={4}
									sm={6}
									xs={12}
									className="formikFormField pt-[5px!important]"
								>
									<Typography className="formTypography">{t('SCIENTIFIC_NAME')}</Typography>
									<Field
										name="scientific_name1"
										placeholder=""
										component={TextFormField}
										disabled
										fullWidth
										size="small"
									/>
								</Grid>

								<Grid
									item
									lg={3}
									md={4}
									sm={6}
									xs={12}
									className="formikFormField pt-[5px!important]"
								>
									<Typography className="formTypography">{t('GENDER')}</Typography>
									<Field
										name="gender"
										placeholder=""
										component={TextFormField}
										disabled
										fullWidth
										size="small"
									/>
								</Grid>

								<Grid
									item
									lg={12}
									md={4}
									sm={12}
									xs={12}
									className="formikFormField pt-[5px!important]"
								>
									<Typography className="formTypography">{t('DESCRIPTION')}</Typography>
									<Field
										name="description"
										placeholder=""
										component={TextFormField}
										fullWidth
										size="small"
										multiline
										rows={4}
										disabled
									/>
								</Grid>

								<Grid
									item
									lg={3}
									md={4}
									sm={6}
									xs={12}
									className="formikFormField pt-[5px!important]"
								>
									<Typography className="formTypography">{t('SIZE')}</Typography>
									<Field
										name="size"
										placeholder=""
										component={TextFormField}
										disabled
										fullWidth
										size="small"
									/>
								</Grid>

								<Grid
									item
									lg={3}
									md={4}
									sm={6}
									xs={12}
									className="formikFormField pt-[5px!important]"
								>
									<Typography className="formTypography">{t('AGE')}</Typography>
									<Field
										name="age"
										placeholder=""
										component={TextFormField}
										disabled
										fullWidth
										size="small"
									/>
								</Grid>

								<Grid
									item
									lg={3}
									md={4}
									sm={6}
									xs={12}
									className="formikFormField pt-[5px!important]"
								>
									<Typography className="formTypography">{t('ORIGIN')}</Typography>
									<Field
										name="origins"
										placeholder=""
										component={TextFormField}
										disabled
										fullWidth
										size="small"
									/>
								</Grid>

								<Grid
									item
									lg={3}
									md={4}
									sm={6}
									xs={12}
									className="formikFormField pt-[5px!important]"
								>
									<Typography className="formTypography">{t('LENGTH')}</Typography>
									<Field
										name="length"
										placeholder=""
										component={TextFormField}
										disabled
										fullWidth
										size="small"
									/>
								</Grid>
							</Grid>
						)}

						<Grid
							container
							spacing={2}
							className="pt-0"
						>
							<Grid
								item
								lg={3}
								md={4}
								sm={6}
								xs={12}
								className="formikFormField pt-[5px!important]"
							>
								<Typography className="formTypography">
									{t('PRODUCT_NAME')}
									<span className="text-red"> *</span>
								</Typography>
								<Field
									name="product_name"
									placeholder="Placeholder"
									component={TextFormField}
									fullWidth
									disabled={isTableMode === 'view'}
									size="small"
								/>
							</Grid>
							<Grid
								item
								lg={3}
								md={4}
								sm={6}
								xs={12}
								className="formikFormField pt-[5px!important]"
							>
								<Typography className="formTypography">
									{t('SCIENTIFIC_NAME')}
									<span className="text-red"> *</span>
								</Typography>
								<Field
									name="scientific_name"
									placeholder="Placeholder"
									component={TextFormField}
									disabled={isTableMode === 'view'}
									fullWidth
									size="small"
								/>
							</Grid>

							<Grid
								item
								lg={3}
								md={4}
								sm={6}
								xs={12}
								className="formikFormField pt-[5px!important]"
							>
								<Typography className="formTypography">
									Parent Category
									<span className="text-red"> *</span>
								</Typography>
								<FormDropdown
									name="parentCategory1"
									id="parentCategory1"
									placeholder=""
									value={values.parentCategory1}
									optionsValues={parentCategory1}
									disabled={isTableMode === 'view'}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
										const { value } = e.target;
										setFieldValue('parentCategory1', value);
										setFieldValue('parentCategory2', '');
										setFieldValue('parentCategory3', '');
										setFieldValue('parentCategory4', '');
										setFieldValue('parentCategory5', '');
										setParentCategory2([]);
										setParentCategory3([]);
										setParentCategory4([]);
										setParentCategory5([]);
										loadSubCategories(
											value,
											setParentCategory2,
											createSetFieldValue('parentCategory3', setFieldValue),
											createSetFieldValue('parentCategory4', setFieldValue),
											createSetFieldValue('parentCategory5', setFieldValue)
										);
									}}
								/>
							</Grid>

							{/* Parent Category 2 */}
							{parentCategory2.length > 0 && (
								<Grid
									item
									lg={3}
									md={4}
									sm={6}
									xs={12}
									className="formikFormField pt-[5px!important]"
								>
									<Typography>
										Category Level 1<span className="text-red"> *</span>
									</Typography>
									<FormDropdown
										id="parentCategory2"
										name="parentCategory2"
										disabled={isTableMode === 'view'}
										value={values.parentCategory2}
										optionsValues={parentCategory2}
										onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
											const { value } = e.target;
											setFieldValue('parentCategory2', value);
											setFieldValue('parentCategory3', '');
											setFieldValue('parentCategory4', '');
											setFieldValue('parentCategory5', '');
											setParentCategory3([]);
											setParentCategory4([]);
											setParentCategory5([]);

											if (value) {
												loadSubCategories(
													value,
													setParentCategory3,
													createSetFieldValue('parentCategory4', setFieldValue),
													createSetFieldValue('parentCategory3', setFieldValue),
													createSetFieldValue('parentCategory5', setFieldValue)
												);
											} else {
												setFieldValue('parentCategory3', '');
												setFieldValue('parentCategory4', '');
												setParentCategory3([]);
												setParentCategory4([]);
											}
										}}
									/>
								</Grid>
							)}

							{/* Parent Category 3 */}
							{parentCategory3.length > 0 && (
								<Grid
									item
									lg={3}
									md={4}
									sm={6}
									xs={12}
									className="formikFormField pt-[5px!important]"
								>
									<Typography>
										Category Level 2<span className="text-red"> *</span>
									</Typography>
									<FormDropdown
										id="parentCategory3"
										name="parentCategory3"
										disabled={isTableMode === 'view'}
										value={values.parentCategory3}
										optionsValues={parentCategory3}
										onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
											const { value } = e.target;
											setFieldValue('parentCategory3', value);
											setFieldValue('parentCategory4', '');
											setParentCategory4([]);

											if (value) {
												loadSubCategories(
													value,
													setParentCategory4,
													createSetFieldValue('parentCategory4', setFieldValue),
													null,
													null
												);
											} else {
												setFieldValue('parentCategory4', '');
												setParentCategory4([]);
											}
										}}
									/>
								</Grid>
							)}

							{/* Parent Category 4 */}
							{parentCategory4.length > 0 && (
								<Grid
									item
									lg={3}
									md={4}
									sm={6}
									xs={12}
									className="formikFormField pt-[5px!important]"
								>
									<Typography>
										Category Level 3<span className="text-red"> *</span>
									</Typography>
									<FormDropdown
										id="parentCategory4"
										name="parentCategory4"
										disabled={isTableMode === 'view'}
										value={values.parentCategory4}
										optionsValues={parentCategory4}
										onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
											const { value } = e.target;
											setFieldValue('parentCategory4', value);
											setFieldValue('parentCategory5', ''); // Clear next dropdown
											setParentCategory5([]); // Clear previous sub-category state

											if (value) {
												loadSubCategories(
													value,
													setParentCategory5, // Load subcategories for `parentCategory5`
													null, // No further categories to clear
													null,
													null
												);
											}
										}}
									/>
								</Grid>
							)}

							{/* Parent Category 5 */}
							{parentCategory5.length > 0 && (
								<Grid
									item
									lg={3}
									md={4}
									sm={6}
									xs={12}
									className="formikFormField pt-[5px!important]"
								>
									<Typography>
										Category Level 4<span className="text-red"> *</span>
									</Typography>
									<FormDropdown
										id="parentCategory5"
										name="parentCategory5"
										disabled={isTableMode === 'view'}
										value={values.parentCategory5}
										optionsValues={parentCategory5}
										onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
											const { value } = e.target;
											setFieldValue('parentCategory5', value);
										}}
									/>
								</Grid>
							)}

							<Grid
								item
								md={12}
								sm={12}
								xs={12}
								className="flex flex-wrap justify-end items-center gap-[10px] pt-[10px!important]"
							>
								{isTableMode === 'view' ? null : (
									<Button
										className="flex justify-center items-center min-w-[80px] sm:min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
										type="submit"
										variant="contained"
										size="medium"
										disabled={isTableMode === 'view'}
									>
										Update
										{isProductSubmitDataLoading ? (
											<CircularProgress
												className="text-white ml-[5px]"
												size={24}
											/>
										) : null}
									</Button>
								)}
								{isTableMode === 'view' ? null : (
									<Button
										className="flex justify-center items-center min-w-[80px] sm:min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
										type="button"
										variant="contained"
										size="medium"
										disabled={isTableMode === 'view'}
										onClick={() => handleClearForm(resetForm)}
									>
										{t('Reset')}
									</Button>
								)}
								<Button
									onClick={toggleModal}
									className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
								>
									Close
								</Button>
							</Grid>
						</Grid>
					</Form>
				)}
			</Formik>
		</div>
	);
}

export default ViewAndEditGeneralView;
