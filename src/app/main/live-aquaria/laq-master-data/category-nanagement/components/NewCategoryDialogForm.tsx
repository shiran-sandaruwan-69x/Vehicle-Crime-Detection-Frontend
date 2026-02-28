import { useTranslation } from 'react-i18next';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Grid from '@mui/material/Grid';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import Button from '@mui/material/Button';
import React, { useEffect, useState } from 'react';
import * as yup from 'yup';
import Typography from '@mui/material/Typography';
import { toast } from 'react-toastify';
import CancelIcon from '@mui/icons-material/Cancel';
import IconButton from '@mui/material/IconButton';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { CircularProgress } from '@mui/material';
import FormDropdown from '../../../../../common/FormComponents/FormDropdown';
import TextFormField from '../../../../../common/FormComponents/FormTextField';
import {
	createCategoryManagement,
	getAllCategoryManagementWithOutPagination
} from '../../../../../axios/services/live-aquaria-services/master-data-services/MasterDataServices';
import {
	Category,
	CategoryFormData,
	CategoryType,
	ModifiedCategoryData
} from '../category-nanagement-types/CategoryManagementTypes';

interface ErrorResponse {
	response?: {
		data?: {
			message?: string;
		};
	};
}
interface Props {
	toggleModal: () => void;
	isOpen: boolean;
	getAllCategory: () => void;
}

function NewCategoryDialogForm({ toggleModal, isOpen, getAllCategory }: Props) {
	const { t } = useTranslation('categoryManagement');
	const maxImageCount = 1;
	const maxImageSize = 5 * 1024 * 1024; // 5MB
	const [images, setImages] = useState<{ file: File; base64: string }[]>([]);
	const [isSaveEnabled, setIsSaveEnabled] = useState(false);
	const [parentCategory1, setParentCategory1] = useState<ModifiedCategoryData[]>([]);
	const [parentCategory2, setParentCategory2] = useState<ModifiedCategoryData[]>([]);
	const [parentCategory3, setParentCategory3] = useState<ModifiedCategoryData[]>([]);
	const [parentCategory4, setParentCategory4] = useState<ModifiedCategoryData[]>([]);
	const [isFormDataLoading, setFormDataLoading] = useState(false);

	const [allData, setAllData] = useState<Category[]>([]);
	const [isGoodType, setGoodType] = useState([
		{
			label: 'Live',
			value: 'live'
		},
		{
			label: 'Hard',
			value: 'hard'
		}
	]);

	const [initialValues, setInitialValues] = useState({
		parentCategory1: '',
		parentCategory2: '',
		parentCategory3: '',
		parentCategory4: '',
		category: '',
		referenceName: '',
		aquaticType: '',
		goodType: ''
	});

	useEffect(() => {
		getAllParentCategory();
	}, []);
	const getAllParentCategory = async () => {
		try {
			const response: CategoryType = await getAllCategoryManagementWithOutPagination();
			const { data } = response;
			setAllData(data);
			setParentCategory1(
				data.map((item) => ({
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

	const schema = yup.object().shape({
		category: yup.string().required(t('Category is required')),
		goodType: yup.string().required(t('Good Type is required')),
		aquaticType: yup.string().required(t('Aquatic Type is required'))
	});

	const onSubmit = async (values: CategoryFormData) => {
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

		const image = images.length > 0 && images[0].base64 ? images[0].base64 : null;
		const mediaData = {
			parent_id: parentId ?? null,
			name: values.category,
			aquatic_type: values.aquaticType,
			reference: values.referenceName ?? null,
			attachment: image,
			goods_type: values.goodType ?? null,
			is_active: 1
		};

		if (parentId && parentId.length > 0) {
			if (!image) {
				toast.error('Image is required for Sub Categories');
				return;
			}
		}

		setFormDataLoading(true);
		try {
			const response = await createCategoryManagement(mediaData);
			getAllCategory();
			setFormDataLoading(false);
			toggleModal();
			toast.success('Created successfully');
		} catch (error: any) {
			setFormDataLoading(false);
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

	const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const { files } = event.target;

		if (files) {
			if (images.length + files.length > maxImageCount) {
				toast.error(`You can only upload a maximum of ${maxImageCount} images.`);
				return;
			}

			const validImages: { file: File; base64: string }[] = [];
			// eslint-disable-next-line no-restricted-syntax
			for (const file of Array.from(files)) {
				// eslint-disable-next-line no-await-in-loop
				const isValid = await validateImageDimensions(file);

				if (isValid) {
					// eslint-disable-next-line no-await-in-loop
					const base64 = await convertToBase64(file);
					validImages.push({ file, base64 });
				}
			}

			if (validImages.length > 0) {
				setImages([...images, ...validImages]);
				setIsSaveEnabled(true);
			}
		}
	};

	const validateImageDimensions = (file: File): Promise<boolean> => {
		return new Promise((resolve) => {
			const img = new Image();
			img.src = URL.createObjectURL(file);
			img.onload = () => {
				if (img.width === img.height && file.size <= maxImageSize) {
					resolve(true);
				} else {
					toast.error('Image upload failed: Width and height must be the same, and size should be <= 5MB.');
					resolve(false);
				}
			};
		});
	};

	const convertToBase64 = (file: File): Promise<string> => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onloadend = () => {
				resolve(reader.result as string);
			};
			reader.onerror = (error) => {
				reject(error);
			};
		});
	};

	const handleRemoveImage = (index: number) => {
		const newImages = images.filter((_, i) => i !== index);
		setImages(newImages);
		setIsSaveEnabled(newImages.length > 0);
	};

	type LoadSubCategoriesType = (
		id: string,
		setCategory: React.Dispatch<React.SetStateAction<{ value: string; label: string }[]>>,
		setClearCategory3: React.Dispatch<React.SetStateAction<string>> | null,
		setClearCategory4: React.Dispatch<React.SetStateAction<string>> | null
	) => void;

	const createSetFieldValue = (field: string, setFieldValue: (field: string, value: string) => void) => {
		return (value: string) => setFieldValue(field, value);
	};

	const loadSubCategories: LoadSubCategoriesType = (id, setCategory, setClearCategory3, setClearCategory4) => {
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
			} else {
				setCategory([]);

				if (setClearCategory3) setClearCategory3('');

				if (setClearCategory4) setClearCategory4('');
			}
		} else {
			setCategory([]);

			if (setClearCategory3) setClearCategory3('');

			if (setClearCategory4) setClearCategory4('');
		}
	};

	const handleClearForm = (resetForm: FormikHelpers<CategoryFormData>['resetForm']) => {
		resetForm();
		setParentCategory2([]);
		setParentCategory3([]);
		setParentCategory4([]);
	};

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

	return (
		<Dialog
			fullWidth
			open={isOpen}
			maxWidth="lg"
			onClose={toggleModal}
			// PaperProps={{
			//     style: {
			//         top: '40px',
			//         margin: 0,
			//         position: 'absolute',
			//     },
			// }}
		>
			<DialogTitle className="pb-0">
				<h6 className="text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-400">New Category</h6>
			</DialogTitle>
			<DialogContent>
				<Formik
					enableReinitialize
					initialValues={initialValues}
					validationSchema={schema}
					onSubmit={onSubmit}
				>
					{({ values, setFieldValue, isValid, resetForm }) => (
						<Form>
							<Grid
								container
								spacing={2}
								className="pt-[10px]"
							>
								<Grid
									item
									lg={3}
									md={6}
									xs={12}
									className="formikFormField pt-[5px!important]"
								>
									<Typography className="formTypography">Parent Category 1</Typography>
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
											setParentCategory2([]);
											setParentCategory3([]);
											setParentCategory4([]);
											loadSubCategories(
												value,
												setParentCategory2,
												createSetFieldValue('parentCategory3', setFieldValue),
												createSetFieldValue('parentCategory4', setFieldValue)
											);
										}}
									/>
								</Grid>

								{/* Parent Category 2 */}
								{parentCategory2.length > 0 && (
									<Grid
										item
										lg={3}
										md={6}
										xs={12}
										className="formikFormField pt-[5px!important]"
									>
										<Typography>Parent Category 2</Typography>
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
												setParentCategory3([]);
												setParentCategory4([]);

												if (value) {
													loadSubCategories(
														value,
														setParentCategory3,
														createSetFieldValue('parentCategory4', setFieldValue),
														createSetFieldValue('parentCategory3', setFieldValue)
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
										md={6}
										xs={12}
										className="formikFormField pt-[5px!important]"
									>
										<Typography>Parent Category 3</Typography>
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
										md={6}
										xs={12}
										className="formikFormField pt-[5px!important]"
									>
										<Typography>Parent Category 4</Typography>
										<FormDropdown
											id="parentCategory4"
											name="parentCategory4"
											value={values.parentCategory4}
											optionsValues={parentCategory4}
										/>
									</Grid>
								)}

								{/* image */}

								<Grid
									item
									lg={3}
									md={6}
									xs={12}
									className="formikFormField pt-[5px!important]"
								>
									<Typography className="formTypography">
										Category Name
										<span className="text-red"> *</span>
									</Typography>
									<Field
										disabled={false}
										name="category"
										placeholder={t('')}
										component={TextFormField}
										fullWidth
										size="small"
										variant="outlined"
										type="text"
										className=""
									/>
								</Grid>

								<Grid
									item
									lg={3}
									md={6}
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
									lg={3}
									md={6}
									xs={12}
									className="formikFormField pt-[5px!important]"
								>
									<Typography>
										Good Type
										<span className="text-red"> *</span>
									</Typography>
									<FormDropdown
										id="goodType"
										name="goodType"
										value={values.goodType}
										optionsValues={isGoodType}
									/>
								</Grid>

								<Grid
									item
									lg={3}
									md={6}
									xs={12}
									className="formikFormField pt-[5px!important]"
								>
									<Typography className="formTypography">Reference Name</Typography>
									<Field
										disabled={false}
										name="referenceName"
										placeholder={t('')}
										component={TextFormField}
										fullWidth
										size="small"
										variant="outlined"
										type="text"
										className=""
									/>
								</Grid>

								<Grid
									item
									md={6}
									xs={12}
									className="formikFormField pt-[5px!important]"
								>
									<Typography className="formTypography">Category Image</Typography>
									<div className="relative flex flex-wrap">
										{images.map((image, index) => (
											<div
												key={index}
												className="relative w-[150px] h-[150px] m-0 border-[2px] border-[#ccc] rounded-[10px] overflow-hidden"
											>
												<img
													src={URL.createObjectURL(image.file)}
													alt="Thumbnail"
													className="w-full h-full rounded-[10px] object-contain object-center"
												/>
												<IconButton
													size="small"
													className="absolute top-0 right-0 text-red p-[2px] rounded-full bg-black/5 transition-colors duration-300 hover:!text-red hover:bg-white"
													onClick={() => handleRemoveImage(index)}
												>
													<CancelIcon fontSize="small" />
												</IconButton>
											</div>
										))}

										{images.length < maxImageCount && (
											<div className="relative flex justify-center items-center w-[150px] h-[150px] m-0 border-[2px] border-[#ccc] rounded-[10px]">
												<IconButton
													className="text-primaryBlue"
													onClick={() => document.getElementById('imageUpload')?.click()}
												>
													<AddCircleIcon fontSize="large" />
												</IconButton>
												<input
													id="imageUpload"
													type="file"
													accept="image/*"
													style={{ display: 'none' }}
													multiple
													onChange={handleImageUpload}
												/>
											</div>
										)}
									</div>
									<span className="text-[10px] text-gray-700 italic">
										<b className="text-red">Note : </b>
										Image dimensions must be 1:1, and size ≤ 5MB.
									</span>
								</Grid>

								<Grid
									item
									md={12}
									sm={12}
									xs={12}
									className="flex justify-end items-center gap-[10px] pt-[10px!important]"
								>
									<Button
										className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
										type="submit"
										variant="contained"
										size="medium"
										disabled={false}
									>
										Save
										{isFormDataLoading ? (
											<CircularProgress
												className="text-white ml-[5px]"
												size={24}
											/>
										) : null}
									</Button>
									<Button
										className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
										type="button"
										variant="contained"
										size="medium"
										disabled={false}
										onClick={() => handleClearForm(resetForm)}
									>
										{t('Reset')}
									</Button>
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
			</DialogContent>
		</Dialog>
	);
}

export default NewCategoryDialogForm;
