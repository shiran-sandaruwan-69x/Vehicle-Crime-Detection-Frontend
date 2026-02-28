import { Button, CircularProgress, Dialog, DialogTitle } from '@mui/material';
import DialogContent from '@mui/material/DialogContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Field, Form, Formik } from 'formik';
import 'jquery';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactSummernote from 'react-summernote';
import 'react-summernote/dist/react-summernote.css';
import { toast } from 'react-toastify';
import { CONTACT_US_SUBJECT_MANAGEMENT } from 'src/app/axios/services/AdminServices';
import * as yup from 'yup';
import ExtendedAxiosError from 'src/app/types/ExtendedAxiosError';
import { getArticleUsingId } from '../../../../../axios/services/live-aquaria-services/article-services/ArticleServices';
import TextFormField from '../../../../../common/FormComponents/FormTextField';
import {
	ArticleContentSubmit,
	ArticleResponseType,
	MappedArticle,
	OnesObjectArticleType
} from '../../article-category/article-category-types/ArticleCategoryTypes';

interface Props {
	clickedRowData: MappedArticle;
	isTableMode: string;
	toggleModal: () => void;
	isOpen: boolean;
	isAdd: boolean;
	isEdit: boolean;
	isView: boolean;
}

function ArticleContentComp({ clickedRowData, isTableMode, toggleModal, isOpen, isAdd, isEdit, isView }: Props) {
	const { t } = useTranslation('article');
	const [isArticlContentDataLoading, setArticleContentDataLoading] = useState(false);

	const [content, setContent] = useState<string>(clickedRowData ? clickedRowData.content : '');
	const [isLoading, setIsLoading] = useState(false);
	const [, setOneArticleData] = useState<ArticleResponseType>({});

	useEffect(() => {
		if (isTableMode === 'view' || isTableMode === 'edit') {
			getArticleById();
		}
	}, []);

	const getArticleById = async () => {
		const id: string = clickedRowData.id ? clickedRowData.id : '';
		setIsLoading(true);
		try {
			const response: OnesObjectArticleType = await getArticleUsingId(id);
			setOneArticleData(response.data);
			setContent(response?.data?.content);
			setIsLoading(false);
		} catch (error) {
			setIsLoading(false);
		}
	};

	const handleChange = (content: string) => {
		setContent(content);
	};

	const schema = yup.object().shape({
		title: yup.string().required(t('Subject is required'))
	});

	const onSubmit = async (values: ArticleContentSubmit) => {
		if (!content) {
			toast.error('Content is required');
			return;
		}

		if (isAdd === true) {
			try {
				const content_data = {
					title: values.title,
					content,
					is_active: 1
				};
				await axios.post(`${CONTACT_US_SUBJECT_MANAGEMENT}`, content_data);
				toast.success('Created Successfully');
			} catch (error) {
				const axiosError = error as ExtendedAxiosError;

				if (axiosError?.response?.data?.message) {
					toast.error(axiosError.response.data.message);
				} else if (axiosError.message) {
					toast.error(axiosError.message);
				} else {
					toast.error('An unexpected error occurred');
				}
			} finally {
				setArticleContentDataLoading(false);
				toggleModal();
			}
		} else {
			try {
				const content_data = {
					title: values.title,
					content,
					is_active: clickedRowData.is_active
				};
				await axios.put(`${CONTACT_US_SUBJECT_MANAGEMENT}/${clickedRowData.id}`, content_data);
				toast.success('Updated Successfully');
			} catch (error) {
				const axiosError = error as ExtendedAxiosError;

				if (axiosError?.response?.data?.message) {
					toast.error(axiosError.response.data.message);
				} else if (axiosError.message) {
					toast.error(axiosError.message);
				} else {
					toast.error('An unexpected error occurred');
				}
			} finally {
				setArticleContentDataLoading(false);
				toggleModal();
			}
		}
	};

	if (isLoading) {
		return (
			<div className="flex justify-center items-center w-full min-h-[100px]">
				<CircularProgress className="text-primaryBlue" />
			</div>
		);
	}

	const getTitle = (value: string): string => {
		if (isEdit) {
			return `Edit ${value}`;
		}

		if (isView) {
			return `View ${value}`;
		}

		return `Add ${value}`;
	};

	return (
		<Dialog
			fullWidth
			open={isOpen}
			maxWidth="xl"
			//   maxWidth="2xl"
			onClose={toggleModal}
			className="z-999"
			PaperProps={{
				style: {
					top: '40px',
					margin: 0,
					position: 'absolute'
				}
			}}
		>
			<DialogTitle className="pb-0">
				<h6 className="text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-400">
					{getTitle('Subject Management')}
				</h6>
			</DialogTitle>
			<DialogContent>
				<Formik
					initialValues={{
						title: clickedRowData?.title ? clickedRowData?.title : ''
					}}
					validationSchema={schema}
					onSubmit={onSubmit}
				>
					{() => (
						<Form>
							<Grid
								container
								spacing={2}
								className="pt-[10px]"
							>
								<Grid
									item
									lg={6}
									md={12}
									xs={12}
									className="formikFormField pt-[5px!important]"
								>
									<Typography className="formTypography">
										Subject
										<span className="text-red"> *</span>
									</Typography>
									<Field
										name="title"
										placeholder=""
										component={TextFormField}
										fullWidth
										disabled={isView}
										size="small"
									/>
								</Grid>

								<Grid
									item
									xs={12}
									className="p-0"
								/>

								{isAdd || isEdit ? (
									<Grid
										item
										xl={6}
										md={12}
										sm={12}
										xs={12}
										className="pt-[5px!important]"
									>
										<Typography className="formTypography">
											Content
											<span className="text-red"> *</span>
										</Typography>

										<ReactSummernote
											disabled={isTableMode === 'view'}
											value={content}
											options={{
												height: 350,
												dialogsInBody: true,
												imageDrag: true,
												toolbar: [
													['style', ['style']],
													['font', ['bold', 'italic', 'underline', 'clear']],
													['fontname', ['fontname']],
													['fontsize', ['fontsize']],
													['color', ['color']],
													// ['para', ['ul', 'ol', 'paragraph']],
													['table', ['table']],
													// ['insert', ['link']],
													['view', ['fullscreen']]
												]
											}}
											onChange={handleChange}
											onImageUpload={() => {
												return false; // Prevent image uploads
											}}
										>
											{' '}
											<div dangerouslySetInnerHTML={{ __html: content }} />
										</ReactSummernote>
									</Grid>
								) : null}

								<Grid
									item
									xl={isAdd || isEdit ? 6 : 12}
									md={12}
									sm={12}
									xs={12}
									className="pt-[5px!important]"
								>
									{/* Live Preview Section */}
									<Typography className="formTypography">Preview</Typography>

									<div className="w-full xl:min-h-[408px] xl:max-h-[600px] p-[10px] break-all whitespace-pre-wrap border !border-[#c4c4c4] overflow-y-auto rounded-[4px] bg-white">
										<div
											className="article-preview-content w-full max-w-full h-full p-0"
											dangerouslySetInnerHTML={{ __html: content }}
										/>
									</div>
								</Grid>

								<Grid
									item
									md={12}
									sm={12}
									xs={12}
									className="flex flex-wrap justify-end items-center gap-[10px] pt-[10px!important]"
								>
									{!isView && (
										<Button
											className="flex justify-center items-center min-w-[80px] sm:min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
											type="submit"
											variant="contained"
											size="medium"
											disabled={isView}
										>
											{isAdd ? 'Save' : 'Update'}
											{isArticlContentDataLoading ? (
												<CircularProgress
													className="text-white ml-[5px]"
													size={24}
												/>
											) : null}
										</Button>
									)}
									<Button
										className="flex justify-center items-center min-w-[80px] sm:min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
										type="button"
										variant="contained"
										size="medium"
										disabled={isTableMode === 'view'}
										// onClick={() => handleClearContentForm()}
										onClick={toggleModal}
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

export default ArticleContentComp;
