import { useTranslation } from 'react-i18next';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import IconButton from '@mui/material/IconButton';
import CancelIcon from '@mui/icons-material/Cancel';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import TextFormField from '../../../../../common/FormComponents/FormTextField';
import FormDropdown from '../../../../../common/FormComponents/FormDropdown';
import TextFormDateField from '../../../../../common/FormComponents/TextFormDateField';
import {
	createArticle,
	getAllArticleCategoriesWithOutPagination,
	getArticleUsingId,
	updateArticle
} from '../../../../../axios/services/live-aquaria-services/article-services/ArticleServices';
import {
	ArticleCategoryDropDown,
	ArticleCategoryResponse,
	ArticleCategoryType,
	ArticleDetailsSubmit,
	ArticleResponseType,
	MappedArticle,
	OnesObjectArticleType
} from '../../article-category/article-category-types/ArticleCategoryTypes';

interface Props {
	clickedRowData: MappedArticle;
	isTableMode: string;
	getAllArticle: () => void;
	toggleModal: () => void;
	handleArticleContent: (id: string) => void;
	isCreatedId: string;
	isCreatedContentId: string;
}
interface ErrorResponse {
	response?: {
		data?: {
			message?: string;
		};
	};
}

function ArticleDetailsComp({
	clickedRowData,
	isTableMode,
	getAllArticle,
	toggleModal,
	handleArticleContent,
	isCreatedId,
	isCreatedContentId
}: Props) {
	const { t } = useTranslation('article');
	const maxImageCount = 1;
	const maxImageSize = 5 * 1024 * 1024; // 5MB
	const [images, setImages] = useState<{ file: File; base64: string }[]>([]);
	const [isSaveEnabled, setIsSaveEnabled] = useState(false);
	const [isArticleCategory, setArticleCategory] = useState<ArticleCategoryDropDown[]>([]);
	const [isArticleDataLoading, setArticleDataLoading] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isOneArticleData, setOneArticleData] = useState<ArticleResponseType>({});

	const schema = yup.object().shape({
		category: yup.string().required(t('Article category is required'))
	});

	useEffect(() => {
		getAllArticleCategory();
	}, []);

	useEffect(() => {
		if (isTableMode === 'view' || isTableMode === 'edit') {
			getArticleById();
		}

		if (isTableMode === 'create' && isCreatedId) {
			getArticleByCreatedId(isCreatedId);
		}
	}, []);

	const getArticleById = async () => {
		const id: string = clickedRowData.id ? clickedRowData.id : '';
		setImages([]);
		setIsLoading(true);
		try {
			const response: OnesObjectArticleType = await getArticleUsingId(id);
			setOneArticleData(response.data);

			if (response?.data?.attachment) {
				loadImageFromURL(response?.data?.attachment);
			}

			setIsLoading(false);
		} catch (error) {
			setIsLoading(false);
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

	const getArticleByCreatedId = async (isCreatedId: string) => {
		setImages([]);
		setIsLoading(true);
		try {
			const response: OnesObjectArticleType = await getArticleUsingId(isCreatedId);
			setOneArticleData(response.data);

			if (response?.data?.attachment) {
				loadImageFromURL(response?.data?.attachment);
			}

			setIsLoading(false);
		} catch (error) {
			setIsLoading(false);
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

	const getAllArticleCategory = async () => {
		try {
			const response: ArticleCategoryType = await getAllArticleCategoriesWithOutPagination();
			const mapperData: ArticleCategoryDropDown[] = response.data.map((item: ArticleCategoryResponse) => ({
				label: item.name,
				value: item.id
			}));
			setArticleCategory(mapperData);
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

	const onSubmit = async (values: ArticleDetailsSubmit) => {
		const image = images.length > 0 && images[0].base64 ? images[0].base64 : null;

		const mediaData = {
			article_category_id: values.category,
			author: values.author ?? null,
			start_date: values.publishDate ?? null,
			end_date: values.expireDate ?? null,
			attachment: image,
			// is_active: 0
		};
		const id: string = clickedRowData.id ? clickedRowData.id : '';

		if (image) {
			setArticleDataLoading(true);

			if (isTableMode === 'edit') {
				try {
					const response = await updateArticle(mediaData, id);
					setArticleDataLoading(false);
					getAllArticle();
					getArticleById();
					toast.success('Updated Successfully');
				} catch (error) {
					setArticleDataLoading(false);
					const isErrorResponse = (error: unknown): error is ErrorResponse => {
						return typeof error === 'object' && error !== null && 'response' in error;
					};

					if (isErrorResponse(error) && error.response?.data?.message) {
						toast.error(error.response.data.message);
					} else {
						toast.error('Internal server error');
					}
				}
			} else if (isTableMode === 'create' && isCreatedContentId) {
				try {
					const response = await updateArticle(mediaData, isCreatedContentId);
					setArticleDataLoading(false);
					getAllArticle();
					toast.success('Created Successfully');
					handleArticleContent(isCreatedContentId);
				} catch (error) {
					setArticleDataLoading(false);
					const isErrorResponse = (error: unknown): error is ErrorResponse => {
						return typeof error === 'object' && error !== null && 'response' in error;
					};

					if (isErrorResponse(error) && error.response?.data?.message) {
						toast.error(error.response.data.message);
					} else {
						toast.error('Internal server error');
					}
				}
			} else {
				try {
					const response: OnesObjectArticleType = await createArticle(mediaData);
					setArticleDataLoading(false);
					getAllArticle();
					toast.success('Created Successfully');
					handleArticleContent(response.data.id);
				} catch (error) {
					setArticleDataLoading(false);
					const isErrorResponse = (error: unknown): error is ErrorResponse => {
						return typeof error === 'object' && error !== null && 'response' in error;
					};

					if (isErrorResponse(error) && error.response?.data?.message) {
						toast.error(error.response.data.message);
					} else {
						toast.error('Internal server error');
					}
				}
			}
		} else {
			toast.error('Image is required');
		}
	};

	const loadImageFromURL = async (url: string) => {
		try {
			const response = await fetch(url);
			const blob = await response.blob();
			const file = new File([blob], 'image.png', { type: blob.type });
			const base64 = await convertToBase64(file);
			setImages([{ file, base64 }]);
		} catch (error) {
			// toast.error('Failed to load image:');
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

	const handleClearForm = (resetForm: FormikHelpers<ArticleDetailsSubmit>['resetForm']) => {
		resetForm({
			values: {
				category: '',
				author: '',
				publishDate: '',
				expireDate: ''
			}
		});
	};

	if (isLoading) {
		return (
			<div className="flex justify-center items-center w-full min-h-[100px]">
				<CircularProgress className="text-primaryBlue" />
			</div>
		);
	}

	return (
		<div className="min-w-full max-w-[100vw] ml-[-15px]">
			<Formik
				initialValues={{
					category: isOneArticleData?.article_category?.id || '',
					author: isOneArticleData?.author || '',
					publishDate: isOneArticleData?.start_date || '',
					expireDate: isOneArticleData?.end_date || ''
				}}
				validationSchema={schema}
				onSubmit={onSubmit}
			>
				{({ values, setFieldValue, isValid, resetForm }) => (
					<Form>
						<Grid
							container
							spacing={2}
							className="pt-[5px] !pr-[15px] mx-auto"
						>
							<Grid
								item
								lg={3}
								md={4}
								sm={6}
								xs={12}
								className="formikFormField pt-[5px!important]"
							>
								<Typography>
									Article Category<span className="text-red"> *</span>
								</Typography>
								<FormDropdown
									id="category"
									name="category"
									disabled={isTableMode === 'view'}
									value={values.category}
									optionsValues={isArticleCategory}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
										const { value } = e.target;
										setFieldValue('category', value);
									}}
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
								<Typography className="formTypography">{t('AUTHOR')}</Typography>
								<Field
									name="author"
									placeholder=""
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
								<Typography className="formTypography">{t('PUBLISH_DATE')}</Typography>
								<TextFormDateField
									disabled={isTableMode === 'view'}
									name="publishDate"
									type="date"
									placeholder=""
									id="publishDate"
									min=""
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
								<Typography className="formTypography">{t('EXPIRE_DATE')}</Typography>
								<TextFormDateField
									disabled={isTableMode === 'view'}
									name="expireDate"
									type="date"
									placeholder=""
									id="expireDate"
									min=""
								/>
							</Grid>

							<Grid
								item
								lg={4}
								md={4}
								sm={6}
								xs={12}
								className="formikFormField pt-[5px!important]"
							>
								<Typography className="formTypography">
									Thumbnail Image
									<span className="text-red"> *</span>
								</Typography>
								<div className="relative flex flex-wrap gap-[10px]">
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
												className="absolute top-[2px] right-[2px] text-red p-0 rounded-full bg-white transition-colors duration-300 hover:!text-red hover:bg-white"
												onClick={() => handleRemoveImage(index)}
												disabled={isTableMode === 'view'}
											>
												<CancelIcon fontSize="small" />
											</IconButton>
										</div>
									))}

									{images.length < maxImageCount && (
										<div className="relative flex justify-center items-center w-[150px] h-[150px] m-0 border-[2px] border-[#ccc] rounded-[10px]">
											<IconButton
												className="text-primaryBlue"
												disabled={isTableMode === 'view'}
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
												disabled={isTableMode === 'view'}
											/>
										</div>
									)}
								</div>
								<span className="text-[10px] text-gray-700 italic mt-[5px]">
									<b className="text-red">Note : </b>
									Image dimensions must be 1:1, and size ≤ 5MB.
								</span>
							</Grid>

							<Grid
								item
								lg={8}
								md={4}
								sm={6}
								xs={12}
								className="flex flex-wrap justify-end items-end gap-[10px] pt-[10px!important]"
							>
								{isTableMode === 'view' ? null : (
									<Button
										className="flex justify-center items-center min-w-[80px] sm:min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
										type="submit"
										variant="contained"
										size="medium"
										disabled={isTableMode === 'view'}
									>
										{isTableMode === 'edit' ? 'Update' : 'Save And Next'}
										{isArticleDataLoading ? (
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

export default ArticleDetailsComp;
