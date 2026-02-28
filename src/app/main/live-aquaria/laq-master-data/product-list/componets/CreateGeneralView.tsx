import React, { useEffect, useState } from 'react';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { Button, CircularProgress, Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import FormDropdown from '../../../../../common/FormComponents/FormDropdown';
import TextFormField from '../../../../../common/FormComponents/FormTextField';
import {
	Category,
	CategoryType,
	ModifiedCategoryData
} from '../../category-nanagement/category-nanagement-types/CategoryManagementTypes';
import { getAllCategoryManagementWithOutPagination } from '../../../../../axios/services/live-aquaria-services/master-data-services/MasterDataServices';
import { CreateGeneralViewTypes, MappedCategoryTypes, SubOptionsTypes } from '../product-list-types/ProductListTypes';

interface ErrorResponse {
	response?: {
		data?: {
			message?: string;
		};
	};
}
interface Props {
	isTableMode: string;
	onNext: (values: CreateGeneralViewTypes) => void;
	initialValues: CreateGeneralViewTypes;
	toggleModal: () => void;
}

function CreateGeneralView({ isTableMode, onNext, initialValues, toggleModal }: Props) {
	const { t } = useTranslation('productList');
	const [isCategory, setIsCategory] = useState<MappedCategoryTypes[]>([]);
	const [subCategory, setSubCategory] = useState<SubOptionsTypes[]>([]);
	const [parentCategory1, setParentCategory1] = useState<ModifiedCategoryData[]>([]);
	const [parentCategory2, setParentCategory2] = useState<ModifiedCategoryData[]>([]);
	const [parentCategory3, setParentCategory3] = useState<ModifiedCategoryData[]>([]);
	const [parentCategory4, setParentCategory4] = useState<ModifiedCategoryData[]>([]);
	const [parentCategory5, setParentCategory5] = useState<ModifiedCategoryData[]>([]);
	const [allData, setAllData] = useState<Category[]>([]);

	const schema = yup.object().shape({
		product_name: yup.string().required(t('Product Name is required')),
		title: yup.string().required(t('Title is required')),
		aquaticType: yup.string().required(t('Aquatic Type is required')),
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
		resetForm();
	};

	useEffect(() => {
		getAllParentCategory();
	}, []);
	const getAllParentCategory = async () => {
		try {
			const response: CategoryType = await getAllCategoryManagementWithOutPagination();
			const data1: Category[] = response.data.slice(1);
			setAllData(data1);
			setParentCategory1(
				data1.map((item) => ({
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

	if (isLoading) {
		return (
			<div className="flex justify-center items-center">
				<CircularProgress className="text-primaryBlueLight" />
			</div>
		);
	}

	const aquaticType = [
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
	];

	const onSubmit = (values: CreateGeneralViewTypes) => {
		let parentId: string;

		if (values.parentCategory4) {
			parentId = values.parentCategory4;
		} else if (values.parentCategory3) {
			parentId = values.parentCategory3;
		} else if (values.parentCategory2) {
			parentId = values.parentCategory2;
		} else {
			parentId = values.parentCategory1;
		}

		// Helper function to find a category by ID
		const findCategoryById = (categories: Category[], id: string): Category | null => {
			let result: Category | null = null;

			categories.forEach((category) => {
				if (category.id === id) {
					result = category;
					return;
				}

				if (category.sub_item_categories && category.sub_item_categories.length) {
					const subResult = findCategoryById(category.sub_item_categories, id);

					if (subResult) {
						result = subResult;
					}
				}
			});

			return result;
		};

		const parentCategory = parentId ? findCategoryById(allData, parentId) : null;

		// Validate aquaticType based on parent's aquatic_type
		if (parentCategory) {
			const parentAquaticType = parentCategory.aquatic_type;
			const selectedAquaticType = values.aquaticType;

			if (parentAquaticType === 'both' && !['both', 'fresh', 'salt'].includes(selectedAquaticType)) {
				toast.error(
					"Aquatic Type must be 'Both', 'Freshwater', or 'Saltwater' when parent's Aquatic Type is 'both'."
				);
				return;
			}

			if (parentAquaticType === 'fresh' && selectedAquaticType !== 'fresh') {
				toast.error("Aquatic Type must be 'Freshwater' when parent's Aquatic Type is 'Freshwater'.");
				return;
			}

			if (parentAquaticType === 'salt' && selectedAquaticType !== 'salt') {
				toast.error("Aquatic Type must be 'Saltwater' when parent's Aquatic Type is 'Saltwater'.");
				return;
			}
		}

		onNext(values);
	};

	return (
		<div className="min-w-full max-w-[100vw]">
			<Formik
				enableReinitialize
				initialValues={{
					product_name: initialValues.product_name || '',
					title: initialValues.title || '',
					aquaticType: initialValues.aquaticType || '',
					scientific_name: initialValues.scientific_name || '',
					category: initialValues.category || '',
					subCategory: initialValues.subCategory || '',
					parentCategory1: initialValues.parentCategory1 || '',
					parentCategory2: initialValues.parentCategory2 || '',
					parentCategory3: initialValues.parentCategory3 || '',
					parentCategory4: initialValues.parentCategory4 || '',
					parentCategory5: initialValues.parentCategory5 || ''
				}}
				validationSchema={schema}
				onSubmit={onSubmit}
			>
				{({ values, setFieldValue, isValid, resetForm, touched, errors }) => (
					<Form>
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
									disabled={isTableMode === 'viewMode'}
									size="small"
								/>
							</Grid>

							<Grid
								item
								lg={6}
								md={8}
								sm={6}
								xs={12}
								className="formikFormField pt-[5px!important]"
							>
								<Typography className="formTypography">
									{t('TITLE')}
									<span className="text-red"> *</span>
								</Typography>
								<Field
									name="title"
									placeholder="Placeholder"
									component={TextFormField}
									fullWidth
									disabled={isTableMode === 'viewMode'}
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
									disabled={isTableMode === 'viewMode'}
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
									disabled={false}
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
								lg={3}
								md={4}
								sm={6}
								xs={12}
								className="formikFormField pt-[5px!important]"
							>
								<Typography className="formTypography">
									Aquatic Type
									<span className="text-red"> *</span>
								</Typography>
								<FormDropdown
									optionsValues={aquaticType}
									name="aquaticType"
									id="aquaticType"
									placeholder=""
									disabled={false}
								/>
							</Grid>

							<Grid
								item
								md={12}
								sm={12}
								xs={12}
								className="flex flex-wrap justify-end items-center gap-[10px] pt-[10px!important]"
							>
								<Button
									className="flex justify-center items-center min-w-[80px] sm:min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
									type="submit"
									variant="contained"
									size="medium"
									disabled={isTableMode === 'viewMode'}
								>
									Next
								</Button>
								<Button
									className="flex justify-center items-center min-w-[80px] sm:min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
									type="button"
									variant="contained"
									size="medium"
									disabled={isTableMode === 'viewMode'}
									onClick={() => handleClearForm(resetForm)}
								>
									{t('Reset')}
								</Button>
								<Button
									onClick={toggleModal}
									className="flex justify-center items-center min-w-[80px] sm:min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
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

export default CreateGeneralView;
