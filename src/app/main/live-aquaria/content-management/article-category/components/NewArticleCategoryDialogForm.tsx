import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import * as yup from 'yup';

import { toast } from 'react-toastify';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { Field, Form, Formik } from 'formik';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CancelIcon from '@mui/icons-material/Cancel';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Button from '@mui/material/Button';
import { CircularProgress } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import TextFormField from '../../../../../common/FormComponents/FormTextField';
import { ArticleCategorySubmit } from '../article-category-types/ArticleCategoryTypes';
import { createArticleCategories } from '../../../../../axios/services/live-aquaria-services/article-services/ArticleServices';
import FormDropdown from "../../../../../common/FormComponents/FormDropdown";

interface Props {
	toggleModal: () => void;
	isOpen: boolean;
	getAllCategory: () => void;
}
interface ErrorResponse {
	response?: {
		data?: {
			message?: string;
		};
	};
}

function NewArticleCategoryDialogForm({ toggleModal, isOpen, getAllCategory }: Props) {
	const { t } = useTranslation('articleCategory');
	const maxImageCount = 1;
	const maxImageSize = 5 * 1024 * 1024; // 5MB
	const [images, setImages] = useState<{ file: File; base64: string }[]>([]);
	const [isSaveEnabled, setIsSaveEnabled] = useState(false);
	const [isArticleCategoryDataLoading, setArticleCategoryDataLoading] = useState(false);

	const schema = yup.object().shape({
		category: yup.string().required(t('Category name is required')),
		aquaticType: yup.string().required(t('Aquatic Type is required'))
	});

	const onSubmit = async (values: ArticleCategorySubmit) => {
		const image = images.length > 0 && images[0].base64 ? images[0].base64 : null;
		const mediaData = {
			name: values.category,
			aquatic_type: values.aquaticType,
			reference: values.referenceName ?? null,
			attachment: image,
			is_active: 1
		};

		if (image) {
			setArticleCategoryDataLoading(true);
			try {
				const response = await createArticleCategories(mediaData);
				getAllCategory();
				setArticleCategoryDataLoading(false);
				toggleModal();
				toast.success('Created Successfully');
			} catch (error) {
				setArticleCategoryDataLoading(false);
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
			toast.error('Image is required');
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

	const aquaticType = [
		{
			label:"Saltwater",
			value:"salt"
		},
		{
			label:"Freshwater",
			value:"fresh"
		},
		{
			label:"Both",
			value:"both"
		}
	];

	return (
		<Dialog
			fullWidth
			open={isOpen}
			maxWidth="xs"
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
				<h6 className="text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-400">
					Create Article Category
				</h6>
			</DialogTitle>
			<DialogContent>
				<Formik
					enableReinitialize
					initialValues={{
						category: '',
						aquaticType: '',
						referenceName: ''
					}}
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
									xs={12}
									className="formikFormField pt-[5px!important]"
								>
									<Typography className="formTypography">Aquatic Type
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
									xs={12}
									className="formikFormField pt-[5px!important]"
								>
									<Typography className="formTypography">
										Category Image
										<span className="text-red"> *</span>
									</Typography>
									<div className="relative flex flex-wrap gap-[10px]">
										{images.map((image, index) => (
											<div
												key={index}
												className="relative w-full h-[150px] m-0 border-[2px] border-[#ccc] rounded-[10px] overflow-hidden"
											>
												<img
													src={URL.createObjectURL(image.file)}
													alt="Thumbnail"
													className='w-full h-full rounded-[10px] object-contain object-center'
												/>
												<IconButton
													size="small"
													className='absolute top-[2px] right-[2px] text-red p-0 rounded-full bg-white transition-colors duration-300 hover:!text-red hover:bg-white'
													onClick={() => handleRemoveImage(index)}
												>
													<CancelIcon fontSize="small" />
												</IconButton>
											</div>
										))}

										{images.length < maxImageCount && (
											<div className='relative flex justify-center items-center w-full h-[150px] m-0 border-[2px] border-[#ccc] rounded-[10px]'>
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
										{isArticleCategoryDataLoading ? (
											<CircularProgress
												className="text-white ml-[5px]"
												size={24}
											/>
										) : null}
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

export default NewArticleCategoryDialogForm;
