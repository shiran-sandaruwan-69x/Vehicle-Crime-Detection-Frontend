import { useTranslation } from 'react-i18next';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Grid from '@mui/material/Grid';
import { Field, Form, Formik } from 'formik';
import Button from '@mui/material/Button';
import React, { useState } from 'react';
import * as yup from 'yup';
import Typography from '@mui/material/Typography';
import { toast } from 'react-toastify';
import CancelIcon from '@mui/icons-material/Cancel';
import IconButton from '@mui/material/IconButton';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { CircularProgress, Switch } from '@mui/material';
import FormDropdown from '../../../../../common/FormComponents/FormDropdown';
import TextFormField from '../../../../../common/FormComponents/FormTextField';

import { Reason, ReasonModifiedData } from '../video-library-types/VideoLibraryTypes';

interface Props {
	toggleModal: () => void;
	isOpen: boolean;
	getAllCategory: () => void;
}

function NewVideoLibraryDialogForm({ toggleModal, isOpen, getAllCategory }: Props) {
	const { t } = useTranslation('videoLibrary');
	const maxImageCount = 1;
	const maxImageSize = 5 * 1024 * 1024; // 5MB
	const maxVideoCount = 1;
	const maxVideoSize = 50 * 1024 * 1024; // 50MB
	const [images, setImages] = useState<{ file: File; base64: string }[]>([]);
	const [videos, setVideos] = useState<{ file: File; base64: string }[]>([]);
	const [isSaveEnabled, setIsSaveEnabled] = useState(false);
	const [isSubmitImages, setSubmitImages] = useState({});
	const [parentCategory1, setParentCategory1] = useState<ReasonModifiedData[]>([]);
	const [parentCategory2, setParentCategory2] = useState<ReasonModifiedData[]>([]);
	const [parentCategory3, setParentCategory3] = useState<ReasonModifiedData[]>([]);
	const [parentCategory4, setParentCategory4] = useState<ReasonModifiedData[]>([]);
	const [isUnitPriceChargeReasonsDataLoading, setUnitPriceChargeReasonsDataLoading] = useState(false);

	const [allData, setAllData] = useState<Reason[]>([]);
	const [videoUrl, setVideoUrl] = useState(''); // For the video URL input
	const [isLinkMode, setIsLinkMode] = useState(false); // Track the toggle state

	const [initialValues, setInitialValues] = useState({
		parentCategory1: '',
		parentCategory2: '',
		parentCategory3: '',
		parentCategory4: '',
		title: ''
	});

	// useEffect(() => {
	// 	getAllParentCategory();
	// }, []);
	// const getAllParentCategory = async () => {
	// 	try {

	// 		const response: CategoryType = await getAllCategoryManagementWithOutPagination();
	// 		const data:Category[]  = response.data;
	// 		setAllData(data);
	// 		setParentCategory1(
	// 			data.map((item) => ({
	// 				value: item.id,
	// 				label: item.name
	// 			}))
	// 		);
	// 	} catch (error) {
	// 		console.log('error', error);
	// 	}
	// };

	const schema = yup.object().shape({
		title: yup.string().required(t('Title is required')),
		topic: yup.string().required(t('Topic is required')),
		imageUrl: yup.string().required(t('Image is required')),
		...(isLinkMode && { videoUrl: yup.string().url(t('Enter a valid URL')).required(t('Video URL is required')) })
	});

	// const onSubmit = async (values: CategoryFormData) => {

	// 	let parentId: string;

	// 	if (values.parentCategory4) {
	// 		parentId = values.parentCategory4;
	// 	} else if (values.parentCategory3) {
	// 		parentId = values.parentCategory3;
	// 	} else if (values.parentCategory2) {
	// 		parentId = values.parentCategory2;
	// 	} else {
	// 		parentId = values.parentCategory1;
	// 	}

	// 	console.log('Selected Parent ID:', parentId);

	// 	const image = images.length > 0 && images[0].base64 ? images[0].base64 : null;
	// 	const mediaData = {
	// 		parent_id: parentId ?? null,
	// 		name: values.category,
	// 		reference: values.referenceName ?? null,
	// 		attachment: image,
	// 		is_active: 1
	// 	};

	// 	if (image){
	// 		setUnitPriceChargeReasonsDataLoading(true);
	// 		try {
	// 			const response = await createCategoryManagement(mediaData);
	// 			getAllCategory();
	// 			setUnitPriceChargeReasonsDataLoading(false);
	// 			toggleModal();
	// 			toast.success('Successfully');
	// 		} catch (error) {
	// 			setUnitPriceChargeReasonsDataLoading(false);
	// 			toast.error('fail');
	// 		}
	// 	}else {
	// 		toast.error('Image is required');
	// 	}

	// };

	const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const { files } = event.target;

		if (files) {
			if (images.length + files.length > maxImageCount) {
				toast.error(`You can only upload a maximum of ${maxImageCount} images.`);
				return;
			}

			const validImages: { file: File; base64: string }[] = [];
			for (const file of Array.from(files)) {
				const isValid = await validateImageDimensions(file);

				if (isValid) {
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
					// if (file.size <= maxImageSize) {
					resolve(true);
				}
				// else {
				// 	toast.error('Image upload failed: Width and height must be the same, and size should be <= 5MB.');
				// 	resolve(false);
				// }
				else if (img.width !== img.height) {
					toast.error('Image upload failed: Width and height must be the same.');
					resolve(false);
				} else if (file.size > maxImageSize) {
					toast.error('Image upload failed: Size should be <= 5MB.');
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

	const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const { files } = event.target;

		if (files) {
			if (videos.length + files.length > maxVideoCount) {
				toast.error(`You can only upload a maximum of ${maxVideoCount} videos.`);
				return;
			}

			const validVideos: { file: File; base64: string }[] = [];
			for (const file of Array.from(files)) {
				const isValid = await validateVideo(file);

				if (isValid) {
					const base64 = await videoConvertToBase64(file);
					validVideos.push({ file, base64 });
				}
			}

			if (validVideos.length > 0) {
				setVideos([...videos, ...validVideos]);
			}
		}
	};

	const validateVideo = (file: File): Promise<boolean> => {
		return new Promise((resolve) => {
			const video = document.createElement('video');
			video.src = URL.createObjectURL(file);

			video.onloadedmetadata = () => {
				if (file.size <= maxVideoSize) {
					resolve(true);
				} else {
					toast.error(`Video size must be <= ${maxVideoSize / (1024 * 1024)}MB.`);
					resolve(false);
				}
			};

			video.onerror = () => {
				toast.error('Invalid video file.');
				resolve(false);
			};
		});
	};

	const videoConvertToBase64 = (file: File): Promise<string> => {
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

	const handleRemoveVideo = (index: number) => {
		const newVideo = videos.filter((_, i) => i !== index);
		setVideos(newVideo);
		setIsSaveEnabled(newVideo.length > 0);
	};

	const handleToggleChange = () => {
		setIsLinkMode(!isLinkMode);
		setVideos([]); // Clear videos if switching to link mode
		setVideoUrl(''); // Clear video URL if switching back to file upload
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

	// const loadSubCategories: LoadSubCategoriesType = (id, setCategory, setClearCategory3, setClearCategory4) => {
	// 	if (!id || !allData || !allData.length) return;

	// 	const findCategoryById = (categories: Category[], id: string): Category | null => {
	// 		// eslint-disable-next-line no-restricted-syntax
	// 		for (const category of categories) {
	// 			if (category.id === id) {
	// 				return category;
	// 			}

	// 			if (category.sub_item_categories && category.sub_item_categories.length) {
	// 				const result = findCategoryById(category.sub_item_categories, id);

	// 				if (result) return result;
	// 			}
	// 		}
	// 		return null;
	// 	};

	// 	const parentCategory: Category = findCategoryById(allData, id);

	// 	if (parentCategory) {
	// 		if (parentCategory.sub_item_categories && parentCategory.sub_item_categories.length > 0) {
	// 			setCategory(
	// 				parentCategory.sub_item_categories.map((sub) => ({
	// 					value: sub.id,
	// 					label: sub.name
	// 				}))
	// 			);

	// 			if (setClearCategory3) setClearCategory3('');

	// 			if (setClearCategory4) setClearCategory4('');
	// 		} else {
	// 			setCategory([]);

	// 			if (setClearCategory3) setClearCategory3('');

	// 			if (setClearCategory4) setClearCategory4('');
	// 		}
	// 	} else {
	// 		setCategory([]);

	// 		if (setClearCategory3) setClearCategory3('');

	// 		if (setClearCategory4) setClearCategory4('');
	// 	}
	// };

	return (
		<Dialog
			fullWidth
			open={isOpen}
			maxWidth="md"
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
				<h2 className="text-sm md:text-base lg:text-lg text-gray-700 font-semibold">{t('NEW_VIDEO')}</h2>
			</DialogTitle>
			<DialogContent>
				<Formik
					enableReinitialize
					initialValues={initialValues}
					validationSchema={schema}
					// onSubmit={onSubmit}
					onSubmit={(values) => {
						if (isLinkMode) {
							console.log('URL submitted:', videoUrl);
						} else {
							console.log('Files submitted:', videos);
						}
					}}
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
									md={4}
									sm={6}
									xs={12}
									className="formikFormField pt-[5px!important]"
								>
									<Typography className="formTypography">Video Topic</Typography>
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
											// loadSubCategories(
											// 	value,
											// 	setParentCategory2,
											// 	createSetFieldValue('parentCategory3', setFieldValue),
											// 	createSetFieldValue('parentCategory4', setFieldValue)
											// );
										}}
									/>
								</Grid>

								{/* Parent Category 2 */}
								{parentCategory2.length > 0 && (
									<Grid
										item
										md={4}
										sm={6}
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
													// loadSubCategories(
													// 	value,
													// 	setParentCategory3,
													// 	createSetFieldValue('parentCategory4', setFieldValue),
													// 	createSetFieldValue('parentCategory3', setFieldValue)
													// );
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
										md={4}
										sm={6}
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
													// loadSubCategories(
													// 	value,
													// 	setParentCategory4,
													// 	createSetFieldValue('parentCategory4', setFieldValue),
													// 	null
													// );
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
										md={4}
										sm={6}
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
									md={12}
									sm={12}
									xs={12}
									className="formikFormField pt-[5px!important]"
								>
									<Typography className="formTypography">
										Title
										<span className="text-red"> *</span>
									</Typography>
									<Field
										disabled={false}
										name="title"
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
									md={12}
									sm={12}
									xs={12}
									className="formikFormField pt-[5px!important]"
								>
									<Typography className="formTypography">
										Thumbnail Image
										<span className="text-red"> *</span>
									</Typography>
									<div
										style={{
											display: 'flex',
											flexWrap: 'wrap',
											position: 'relative',
											width: '100%'
										}}
									>
										{images.map((image, index) => (
											<div
												key={index}
												style={{
													position: 'relative',
													margin: '3px',
													borderRadius: '10px',
													overflow: 'hidden',
													border: '2px solid #ccc',
													flex: '1 1 calc(20% - 20px)',
													width: '1000px',
													height: 'auto'
												}}
											>
												<img
													src={URL.createObjectURL(image.file)}
													alt="Thumbnail"
													style={{
														width: '100%',
														height: 'auto',
														// objectFit: 'cover',
														borderRadius: '10px'
													}}
												/>
												<IconButton
													size="small"
													sx={{
														position: 'absolute',
														top: '0px',
														right: '0px',
														backgroundColor: 'rgba(0, 0, 0, 0.5)',
														padding: '2px',
														borderRadius: '50%',
														color: 'white',
														transition: 'color 0.2s',
														'&:hover': { color: 'red' }
													}}
													onClick={() => handleRemoveImage(index)}
												>
													<CancelIcon fontSize="small" />
												</IconButton>
											</div>
										))}

										{images.length < maxImageCount && (
											<div
												style={{
													flex: '1 1 calc(20% - 20px)',
													maxWidth: '1000px',
													height: '150px',
													position: 'relative',
													margin: '3px',
													border: '2px solid #ccc',
													borderRadius: '10px',
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center'
												}}
											>
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
								</Grid>

								<Grid
									item
									md={12}
									sm={12}
									xs={12}
									className="formikFormField pt-[5px!important] flex items-center justify-between"
								>
									<Typography className="formTypography">
										Upload Video
										<span className="text-red"> *</span>
									</Typography>
									<div>
										<Typography
											component="span"
											className="mr-[10px]"
										>
											Link
										</Typography>
										<Switch
											checked={isLinkMode}
											onChange={handleToggleChange}
											color="primary"
										/>
									</div>
								</Grid>

								<Grid
									item
									md={12}
									sm={12}
									xs={12}
									className="formikFormField pt-[5px!important]"
								>
									{isLinkMode ? (
										<Field
											disabled={false}
											name="videoUrl"
											placeholder="Enter video URL"
											component={TextFormField}
											fullWidth
											size="small"
											variant="outlined"
											value={videoUrl}
											onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
												setVideoUrl(e.target.value)
											}
										/>
									) : (
										<div
											style={{
												display: 'flex',
												flexWrap: 'wrap',
												position: 'relative',
												width: '100%'
											}}
										>
											{videos.map((video, index) => (
												<div
													key={index}
													style={{
														position: 'relative',
														margin: '3px',
														borderRadius: '10px',
														overflow: 'hidden',
														border: '2px solid #ccc',
														flex: '1 1 calc(20% - 20px)',
														width: '1000px',
														height: '150px'
													}}
												>
													<img
														src={URL.createObjectURL(video.file)}
														alt="Thumbnail"
														style={{
															width: '100%',
															height: '100%',
															objectFit: 'cover',
															borderRadius: '10px'
														}}
													/>
													<IconButton
														size="small"
														sx={{
															position: 'absolute',
															top: '0px',
															right: '0px',
															backgroundColor: 'rgba(0, 0, 0, 0.5)',
															padding: '2px',
															borderRadius: '50%',
															color: 'white',
															transition: 'color 0.2s',
															'&:hover': { color: 'red' }
														}}
														onClick={() => handleRemoveVideo(index)}
													>
														<CancelIcon fontSize="small" />
													</IconButton>
												</div>
											))}

											{videos.length < maxVideoCount && (
												<div
													style={{
														flex: '1 1 calc(20% - 20px)',
														maxWidth: '1000px',
														height: '150px',
														position: 'relative',
														margin: '3px',
														border: '2px solid #ccc',
														borderRadius: '10px',
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'center'
													}}
												>
													<IconButton
														className="text-primaryBlue"
														onClick={() => document.getElementById('videoUpload')?.click()}
													>
														<AddCircleIcon fontSize="large" />
													</IconButton>
													<input
														id="videoUpload"
														type="file"
														accept="video/*"
														style={{ display: 'none' }}
														multiple
														onChange={handleVideoUpload}
													/>
												</div>
											)}
										</div>
									)}
								</Grid>

								<Grid
									item
									md={12}
									sm={12}
									xs={12}
									className="flex justify-end items-center gap-[10px] pt-[5px!important]"
								>
									<Button
										className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
										type="submit"
										variant="contained"
										size="medium"
										disabled={false}
									>
										Validate & Save
										{isUnitPriceChargeReasonsDataLoading ? (
											<CircularProgress
												className="text-gray-600 ml-[5px]"
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

export default NewVideoLibraryDialogForm;
