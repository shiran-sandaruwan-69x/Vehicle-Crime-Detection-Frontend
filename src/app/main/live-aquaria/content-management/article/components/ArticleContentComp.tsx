import { Button, CircularProgress } from '@mui/material';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import 'jquery';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactSummernote from 'react-summernote';
import 'react-summernote/dist/react-summernote.css';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import {
	createArticle,
	getArticleUsingId,
	updateArticle
} from '../../../../../axios/services/live-aquaria-services/article-services/ArticleServices';
import TextFormField from '../../../../../common/FormComponents/FormTextField';
import FormikMultipleSelectChip from '../../../../../common/FormComponents/FormikMultipleSelectChip';
import {
	ArticleContentSubmit,
	ArticleResponseType,
	MappedArticle,
	OnesObjectArticleType
} from '../../article-category/article-category-types/ArticleCategoryTypes';

interface Props {
	clickedRowData: MappedArticle;
	isTableMode: string;
	getAllArticle: () => void;
	toggleModal: () => void;
	isCreatedContentId: string;
	isCreatedId: string;
	handleRelatedArticles: (id: string) => void;
}
interface ErrorResponse {
	response?: {
		data?: {
			message?: string;
		};
	};
}

function ArticleContentComp({
	clickedRowData,
	isTableMode,
	getAllArticle,
	toggleModal,
	isCreatedContentId,
	isCreatedId,
	handleRelatedArticles
}: Props) {
	const { t } = useTranslation('article');
	const [isArticleDataLoading, setArticleDataLoading] = useState(false);
	const [content, setContent] = useState<string>('');
	const [isLoading, setIsLoading] = useState(false);
	const [isOneArticleData, setOneArticleData] = useState<ArticleResponseType>({});

	useEffect(() => {
		if (isTableMode === 'view' || isTableMode === 'edit') {
			getArticleById();
		}

		if (isTableMode === 'create' && isCreatedContentId) {
			getArticleByCreatedId(isCreatedContentId);
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

	const getArticleByCreatedId = async (id: string) => {
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

	const handleImageUpload = (files: FileList | null) => {
		const reader = new FileReader();
		reader.onloadend = () => {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call
			ReactSummernote.insertImage(reader.result);
		};
		reader.readAsDataURL(files[0]);
	};

	const schema = yup.object().shape({
		title: yup.string().required(t('Title is required'))
	});

	const onSubmit = async (values: ArticleContentSubmit) => {
		const mediaData = {
			title: values.title ?? null,
			abstract: values.abstract ?? null,
			keywords: values.tag_keywords.join(', ') ?? null,
			content: content ?? null,
			// is_active: 0
		};
		const id: string = clickedRowData.id ? clickedRowData.id : '';
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
		} else if (isTableMode === 'create' && isCreatedId) {
			try {
				const response = await updateArticle(mediaData, isCreatedId);
				setArticleDataLoading(false);
				getAllArticle();
				toast.success('Created Successfully');
				handleRelatedArticles(isCreatedId);
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
				handleRelatedArticles(response?.data?.id);
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
	};

	const handleClearForm = (resetForm: FormikHelpers<ArticleContentSubmit>['resetForm']) => {
		resetForm({
			values: {
				title: '',
				abstract: '',
				tag_keywords: []
			}
		});
		setContent('');
	};

	const handleClearContentForm = () => {
		setContent('');
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
					title: isOneArticleData?.title || '',
					abstract: isOneArticleData?.abstract || '',
					tag_keywords: isOneArticleData?.keywords?.split(', ') || []
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
								lg={6}
								md={12}
								xs={12}
								className="formikFormField pt-[5px!important]"
							>
								<Typography className="formTypography">
									{t('TITLE')}
									<span className="text-red"> *</span>
								</Typography>
								<Field
									name="title"
									placeholder=""
									component={TextFormField}
									fullWidth
									disabled={isTableMode === 'view'}
									size="small"
								/>
							</Grid>

							<Grid
								item
								lg={6}
								md={12}
								xs={12}
								className="formikFormField pt-[5px!important]"
							>
								<Typography className="formTypography">{t('ABSTRACT')}</Typography>
								<Field
									disabled={isTableMode === 'view'}
									name="abstract"
									placeholder=""
									component={TextFormField}
									fullWidth
									multiline
									rows={5}
								/>
							</Grid>

							<Grid
								item
								md={12}
								xs={12}
								className="formikFormField pt-[5px!important]"
							>
								<Typography className="formTypography">{t('TAG_KEYWORDS')}</Typography>
								<Field
									component={FormikMultipleSelectChip}
									disabled={isTableMode === 'view'}
									name="tag_keywords"
									placeholder=""
									fullWidth
									size="small"
								/>
							</Grid>
						</Grid>
						<Grid
							container
							spacing={2}
							className="pt-[10px] !pr-[15px] mx-auto"
						>
							<Grid
								item
								xl={6}
								md={12}
								sm={12}
								xs={12}
								className="pt-[10px!important]"
							>
								<Typography className="formTypography">Content</Typography>
								<ReactSummernote
									disabled={isTableMode === 'view'}
									value={content}
									options={{
										height: 350,
										dialogsInBody: false,
										imageDrag: true,
										toolbar: [
											['style', ['style']],
											['font', ['bold', 'italic', 'underline', 'clear']],
											['fontname', ['fontname']],
											['fontsize', ['fontsize']],
											['color', ['color']],
											['para', ['paragraph']],
											['table', ['table']],
											['insert', ['link', 'picture']],
											['view', ['fullscreen']]
										]
									}}
									onChange={handleChange}
									onImageUpload={handleImageUpload}
								>
									{' '}
									<div dangerouslySetInnerHTML={{ __html: content }} />
								</ReactSummernote>
							</Grid>
							<Grid
								item
								xl={6}
								md={12}
								sm={12}
								xs={12}
								className="pt-[10px!important]"
							>
								{/* Live Preview Section */}
								<Typography className="formTypography">Preview</Typography>

								<div className="w-full xl:min-h-[408px] xl:max-h-[600px] p-[10px] break-all whitespace-pre-wrap border !border-[#c4c4c4] overflow-y-auto rounded-[4px] bg-white">
									<div
										className="article-preview-content w-full max-w-full p-0"
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

export default ArticleContentComp;
