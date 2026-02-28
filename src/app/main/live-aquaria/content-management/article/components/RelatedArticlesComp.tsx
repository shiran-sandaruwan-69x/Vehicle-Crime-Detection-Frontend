import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import {
	Button,
	CircularProgress,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete/Autocomplete';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import {
	getAllArticleWithOutPagination,
	getArticleUsingId,
	updateArticle
} from '../../../../../axios/services/live-aquaria-services/article-services/ArticleServices';
import TextFormField from '../../../../../common/FormComponents/FormTextField';
import {
	productOptionsDropDownDataType,
	productOptionsTableDataType
} from '../../../divers-den-advertisement/divers-den-advertisements/divers-den-advertisements-types/DriversDenAdvertisementsTypes';
import { OptionsSetDataDropDownData } from '../../../laq-master-data/product-list/product-list-types/ProductListTypes';
import {
	ArticleOptionsSetDataType,
	ArticleOptionsSubmitDataType,
	ArticleResponseType,
	ArticleType,
	MappedArticle,
	OnesObjectArticleType,
	RelatedArticleResponseType
} from '../../article-category/article-category-types/ArticleCategoryTypes';

interface Props {
	clickedRowData: MappedArticle;
	isTableMode: string;
	getAllArticle: () => void;
	toggleModal: () => void;
	isRelatedInitialData: ArticleOptionsSubmitDataType;
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

function RelatedArticlesComp({
	clickedRowData,
	isTableMode,
	getAllArticle,
	toggleModal,
	isRelatedInitialData,
	isCreatedId,
	isCreatedContentId
}: Props) {
	const { t } = useTranslation('article');
	const [cisCode, setCisCode] = useState<productOptionsDropDownDataType[]>([]);
	const [data, setData] = useState<ArticleOptionsSetDataType[]>([]);
	const [isArticleDataLoading, setArticleDataLoading] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isOneArticleData, setOneArticleData] = useState<ArticleResponseType>({});

	const schema = yup.object().shape({});

	const [initialValues, setInitialValues] = useState<ArticleOptionsSubmitDataType>(
		isRelatedInitialData?.reference
			? isRelatedInitialData
			: {
					reference: '',
					cisCode: '',
					tableData: []
				}
	);

	useEffect(() => {
		getCisCodeData();
	}, []);

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

			const data: ArticleOptionsSubmitDataType = {
				reference: response.data.reference ?? '',
				cisCode: '',
				tableData: response?.data?.related_articles?.map((item: RelatedArticleResponseType) => ({
					id: item.article_id,
					cisCode: item.code,
					title: item.title,
					author: item.author
				}))
			};
			setInitialValues(data);
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

	const getCisCodeData = async () => {
		try {
			const response: ArticleType = await getAllArticleWithOutPagination();
			const optionsSetData: ArticleOptionsSetDataType[] = response.data.map((item: ArticleResponseType) => ({
				id: item.id,
				cisCode: item.code,
				title: item.title,
				author: item.author
			}));

			setData(optionsSetData);
			const options: productOptionsDropDownDataType[] = response.data.map((item: ArticleResponseType) => ({
				label: item.code,
				value: item.code
			}));
			setCisCode(options);
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

	const handleDeleteRemark = (
		productId: string,
		setFieldValue: FormikHelpers<productOptionsTableDataType>['setFieldValue'],
		values: productOptionsTableDataType
	) => {
		const updatedTableData = values.tableData.filter((row) => row.cisCode !== productId);
		setFieldValue('tableData', updatedTableData);
	};

	const onSubmit = async (values: ArticleOptionsSubmitDataType) => {
		const relatedProducts: string[] = values?.tableData?.map((item: { id: string }) => item.id) ?? null;
		const mediaData = {
			reference: values.reference ?? null,
			related_articles: relatedProducts ?? null,
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
		} else if (isCreatedId && isCreatedContentId) {
			try {
				const response = await updateArticle(mediaData, isCreatedId);
				setArticleDataLoading(false);
				getAllArticle();
				toggleModal();
				toast.success('Created Successfully');
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
			setArticleDataLoading(false);
			toast.error('Article Details And Article Content is required');
		}
	};

	const handleClearForm = (resetForm: FormikHelpers<ArticleOptionsSubmitDataType>['resetForm']) => {
		resetForm({
			values: {
				reference: '',
				cisCode: '',
				tableData: []
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
				initialValues={initialValues}
				validationSchema={schema}
				onSubmit={onSubmit}
			>
				{({ values, setFieldValue, resetForm }) => (
					<Form>
						<Grid
							container
							spacing={2}
							className="pt-[5px] !pr-[15px] mx-auto"
						>
							<Grid
								item
								xs={12}
								className="formikFormField pt-[5px!important]"
							>
								<Typography className="formTypography">{t('Reference')}</Typography>
								<Field
									disabled={isTableMode === 'view'}
									name="reference"
									placeholder=""
									component={TextFormField}
									fullWidth
									multiline
									rows={2}
								/>
							</Grid>

							<Grid
								item
								md={12}
								sm={12}
								xs={12}
								key={1}
							>
								<Grid
									container
									spacing={2}
								>
									<Grid
										item
										xs={12}
										className=" pt-[5px!important]"
									>
										<hr />
									</Grid>
									<Grid
										item
										xl={3}
										lg={4}
										md={4}
										sm={6}
										xs={12}
										className="formikFormField pt-[5px!important]"
									>
										<Typography className="formTypography">{t('Article ID')}</Typography>
										<div className="flex flex-grow-[1] items-center mr-[1px]">
											<Autocomplete
												disabled={isTableMode === 'view'}
												options={cisCode}
												getOptionLabel={(option: OptionsSetDataDropDownData) => option.label}
												renderInput={(params) => (
													<TextField
														{...params}
														label=""
														variant="outlined"
														size="small"
														fullWidth
													/>
												)}
												onChange={(_, newValue: OptionsSetDataDropDownData) => {
													setFieldValue(`cisCode`, newValue ? newValue.value : '');
												}}
												value={
													cisCode.find((option) => option.value === values.cisCode) || null
												}
												isOptionEqualToValue={(option, value) => option.value === value}
												clearOnBlur
												handleHomeEndKeys
												freeSolo
												disableClearable
												sx={{ width: '100%' }}
											/>
											<IconButton
												onClick={() => {
													const currentCisCode = values.cisCode;

													if (currentCisCode) {
														// Filter the dataset based on the input cisCode
														const filteredData = data.filter(
															(item) => item.cisCode === currentCisCode
														);

														if (filteredData.length > 0) {
															// Check for duplicates in the existing tableData
															const isDuplicate = values.tableData.some(
																(row) => row.cisCode === currentCisCode
															);

															if (isDuplicate) {
																toast.error(`${currentCisCode} is already added.`);
															} else {
																// Update table data with filtered results
																const updatedTableData = [
																	...values.tableData,
																	...filteredData
																];
																setFieldValue('tableData', updatedTableData);
																setFieldValue('cisCode', '');
															}
														}
													}
												}}
												className="text-primaryBlue"
												disabled={isTableMode === 'view'}
											>
												<AddCircleIcon />
											</IconButton>
										</div>
									</Grid>
									<Grid
										item
										xs={12}
										className=" pt-[10px!important]"
									>
										<TableContainer>
											<Table
												size="small"
												className="custom-table"
											>
												<TableHead>
													<TableRow>
														<TableCell
															sx={{
																backgroundColor: '#354a95',
																color: 'white'
															}}
														>
															{t('Article ID')}
														</TableCell>
														<TableCell
															sx={{
																backgroundColor: '#354a95',
																color: 'white',
																minWidth: '450px',
																maxWidth: '450px',
																whiteSpace: 'nowrap'
															}}
														>
															{t('Title')}
														</TableCell>
														<TableCell
															sx={{
																backgroundColor: '#354a95',
																color: 'white'
															}}
														>
															{t('Author')}
														</TableCell>
														<TableCell
															sx={{
																backgroundColor: '#354a95',
																color: 'white'
															}}
														>
															{isTableMode === 'view' ? null : 'Action'}
														</TableCell>
													</TableRow>
												</TableHead>
												<TableBody>
													{values.tableData.map((row, rowIndex) => (
														<TableRow key={rowIndex}>
															<TableCell>{row.cisCode}</TableCell>
															<TableCell
																sx={{
																	whiteSpace: 'pre-wrap',
																	wordBreak: 'break-word',
																	minWidth: '450px',
																	maxWidth: '450px'
																}}
															>
																{row.title}
															</TableCell>
															<TableCell>{row.author}</TableCell>
															<TableCell>
																{isTableMode === 'view' ? null : (
																	<DeleteIcon
																		className="text-red-400"
																		fontSize="small"
																		sx={{ cursor: 'pointer' }}
																		onClick={() =>
																			handleDeleteRemark(
																				row.cisCode,
																				setFieldValue,
																				values
																			)
																		}
																	/>
																)}
															</TableCell>
														</TableRow>
													))}
												</TableBody>
											</Table>
										</TableContainer>
									</Grid>
								</Grid>
							</Grid>

							{/* Submit Buttons */}
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
										{isTableMode === 'edit' ? 'Update' : 'Save And Close'}
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
										className="flex justify-center ml-2 items-center min-w-[80px] sm:min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
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

export default RelatedArticlesComp;
