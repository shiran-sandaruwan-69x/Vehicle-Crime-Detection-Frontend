import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
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
import { Field, Form, Formik, FormikHelpers } from 'formik';
import DeleteIcon from '@mui/icons-material/Delete';
import Paper from '@mui/material/Paper';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import * as yup from 'yup';
import Autocomplete from '@mui/material/Autocomplete/Autocomplete';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import { toast } from 'react-toastify';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteAlertForm from './DeleteAlertForm';
import CommonHeading from '../../../../../common/FormComponents/CommonHeading';
import TextFormField from '../../../../../common/FormComponents/FormTextField';
import CustomFormTextField from '../../../../../common/FormComponents/CustomFormTextField';
import { ProductDiversDenMaster } from '../../../laq-master-data/divers-den-master-data/drivers-den-types/DriversDenTypes';
import { OptionsSetDataDropDownData } from '../../../laq-master-data/product-list/product-list-types/ProductListTypes';

import {
	getAllProductWithOutPagination,
	updateDiversAdvertisementsRelatedProductsData
} from '../../../../../axios/services/live-aquaria-services/divers-advertisements-services/DiversAdvertisementsService';
import {
	getAllProductResponseType,
	getAllProductType,
	productOptionsDropDownDataType,
	productOptionsSetDataType,
	productOptionsTableDataType
} from '../divers-den-advertisements-types/DriversDenAdvertisementsTypes';

interface ErrorResponse {
	response?: {
		data?: {
			message?: string;
		};
	};
}

interface Props {
	isTableMode: string;
	clickedRowData: ProductDiversDenMaster;
	onNextMethods: (values: productOptionsTableDataType) => void;
	isRelatedInitialData: productOptionsTableDataType;
	onBackUploadThumbnail: (values: productOptionsTableDataType) => void;
	getRowDriverDenAdvertisements: () => void;
	isId: string;
}

function RelatedComp({
	isTableMode,
	clickedRowData,
	onNextMethods,
	isRelatedInitialData,
	onBackUploadThumbnail,
	getRowDriverDenAdvertisements,
	isId
}: Props) {
	const theme = useTheme();
	const { t } = useTranslation('diversDenAdvertisements');
	const [isOpenDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
	const toggleDeleteModal = () => setOpenDeleteModal(!isOpenDeleteModal);
	const [deleteProductId, setDeleteProductId] = useState<string>('');
	const [cisCode, setCisCode] = useState<productOptionsDropDownDataType[]>([]);
	const [data, setData] = useState<productOptionsSetDataType[]>([]);
	const [initialValues, setInitialValues] = useState<productOptionsTableDataType>(
		isRelatedInitialData?.tableData
			? isRelatedInitialData
			: {
					cisCode: '',
					tableData: []
				}
	);

	const [isProductSubmitDataLoading, setProductSubmitDataLoading] = useState(false);

	useEffect(() => {
		getCisCodeData();
	}, []);

	const getCisCodeData = async () => {
		try {
			const response: getAllProductResponseType = await getAllProductWithOutPagination();
			const optionsSetData: productOptionsSetDataType[] = response.data.map((item: getAllProductType) => ({
				id: item.id,
				cisCode: item.code,
				title: item.title
			}));

			setData(optionsSetData);
			const options: productOptionsDropDownDataType[] = response.data.map((item: getAllProductType) => ({
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

	const handleAlertForm = () => {
		toggleDeleteModal();
	};

	const schema = yup.object().shape({});

	const onSubmitBack = (values: productOptionsTableDataType) => {
		onBackUploadThumbnail(values);
	};

	const handleClearForm = (resetForm: FormikHelpers<productOptionsTableDataType>['resetForm']) => {
		resetForm();
	};

	const onNext = async (values: productOptionsTableDataType) => {
		if (isTableMode === 'edit') {
			setProductSubmitDataLoading(true);
			const id = isId ?? null;
			const relatedProducts: string[] = values?.tableData?.map((item: { id: string }) => item.id) ?? null;
			const data = {
				related_products: relatedProducts
			};
			try {
				updateDiversAdvertisementsRelatedProductsData(data, id);
				toast.success('Updated Successfully');
				setProductSubmitDataLoading(false);
				getRowDriverDenAdvertisements();
			} catch (error) {
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
		} else {
			onNextMethods(values);
		}
	};

	return (
		<div className="min-w-full max-w-[100vw]">
			<Paper className="rounded-[0px] p-[16px]">
				<Formik
					enableReinitialize
					initialValues={{
						sellingPrice:
							clickedRowData?.item_selection?.[0]?.selection_types?.[0]?.master_data?.regular_price || '',
						displayPrice: clickedRowData?.item_selection?.[0]?.selection_types?.[0]?.selling_price || '',
						displayApplicable:
							clickedRowData?.item_selection?.[0]?.selection_types?.[0]?.discount_rate || '',
						discountPrice: clickedRowData?.item_selection?.[0]?.selection_types?.[0]?.discount_price || '',
						isDiscounted: clickedRowData?.item_selection?.[0]?.selection_types?.[0]?.discount_rate !== null,
						newPrice: clickedRowData?.item_selection?.[0]?.selection_types?.[0]?.display_price || ''
					}}
					validationSchema={schema}
					onSubmit={(values) => {}}
				>
					{({ values, setFieldValue, isValid, resetForm, touched, errors }) => (
						<Form>
							<Grid
								container
								spacing={2}
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
									xl={2}
									lg={3}
									md={4}
									sm={6}
									xs={12}
									className="formikFormField pt-[5px!important]"
								>
									<Typography className="formTypography">{t('SELLING_PRICE')}</Typography>
									<Field
										name="sellingPrice"
										placeholder=""
										type="number"
										component={TextFormField}
										fullWidth
										disabled
										size="small"
									/>
								</Grid>

								<Grid
									item
									xl={2}
									lg={3}
									md={4}
									sm={6}
									xs={12}
									className="formikFormField pt-[5px!important]"
								>
									<Typography className="formTypography">{t('DISPLAY_PRICE')}</Typography>
									<CustomFormTextField
										name="displayPrice"
										id="displayPrice"
										type="number"
										placeholder=""
										disabled
									/>
								</Grid>

								<Grid
									item
									xl={4}
									lg={6}
									md={4}
									sm={6}
									xs={12}
									className="formikFormField pt-[5px!important]"
								>
									<Typography className="formTypography">{t('DISPLAY_APPLICABLE')}</Typography>
									<div className="flex flex-grow-[1] items-center mr-[1px]">
										<CustomFormTextField
											name="displayApplicable"
											id="displayApplicable"
											type="number"
											placeholder=""
											disabled
										/>
										<FormControlLabel
											className="ml-[1px] mr-0"
											control={
												<Checkbox
													name="isDiscounted"
													checked={values.isDiscounted}
												/>
											}
											disabled
											label={t('%')}
										/>
									</div>
								</Grid>
								<Grid
									item
									xl={2}
									lg={3}
									md={4}
									sm={6}
									xs={12}
									className="formikFormField pt-[5px!important]"
								>
									<Typography className="formTypography">{t('DISCOUNT_PRICE')}</Typography>
									<Field
										name="discountPrice"
										type="number"
										placeholder=""
										component={TextFormField}
										fullWidth
										disabled
										size="small"
									/>
								</Grid>

								<Grid
									item
									xl={2}
									lg={3}
									md={4}
									sm={6}
									xs={12}
									className="formikFormField pt-[5px!important]"
								>
									<Typography className="formTypography">{t('NEW_PRICE')}</Typography>
									<Field
										name="newPrice"
										type="number"
										placeholder=""
										component={TextFormField}
										fullWidth
										disabled
										size="small"
									/>
								</Grid>
							</Grid>
						</Form>
					)}
				</Formik>

				<Formik
					initialValues={initialValues}
					validationSchema={schema}
					onSubmit={onNext}
				>
					{({ values, setFieldValue, resetForm }) => (
						<Form>
							<Grid
								container
								spacing={2}
								className="mt-0"
							>
								<Grid
									item
									md={12}
									sm={12}
									xs={12}
								>
									<hr />
								</Grid>

								<Grid
									item
									md={12}
									sm={12}
									xs={12}
									key={1}
								>
									{/* Product Selections Section */}
									<CommonHeading title="Related Products" />
									<Grid
										container
										spacing={2}
										className="mt-0"
									>
										<Grid
											item
											lg={3}
											md={4}
											sm={6}
											xs={12}
											className="formikFormField pt-[5px!important]"
										>
											<Typography className="formTypography">{t('Product ID')}</Typography>
											<div className="flex justify-between items-center gap-[10px]">
												<Autocomplete
													className="w-full"
													disabled={isTableMode === 'view'}
													options={cisCode}
													getOptionLabel={(option: OptionsSetDataDropDownData) =>
														option.label
													}
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
														setFieldValue(
															`cisCode`, // Corrected path to set the cisCode
															newValue ? newValue.value : ''
														);
													}}
													value={
														cisCode.find((option) => option.value === values.cisCode) ||
														null
													}
													isOptionEqualToValue={(option, value) => option.value === value}
													clearOnBlur
													handleHomeEndKeys
													freeSolo
													disableClearable
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
																	setFieldValue('tableData', updatedTableData); // Update the path
																	setFieldValue('cisCode', ''); // Clear the input field
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
											className="pt-[10px!important]"
										>
											<Typography className="text-[10px] sm:text-[12px] text-gray-800 mb-[5px]">
												<strong>{t('PRODUCT_OFFERING_TYPES')}</strong>
											</Typography>
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
																{t('Product ID')}
															</TableCell>
															<TableCell
																sx={{
																	backgroundColor: '#354a95',
																	color: 'white'
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
																{t('Action')}
															</TableCell>
														</TableRow>
													</TableHead>
													<TableBody>
														{values.tableData.map((row, rowIndex) => (
															<TableRow key={rowIndex}>
																<TableCell>{row.cisCode}</TableCell>
																<TableCell>{row.title}</TableCell>
																<TableCell>
																	{isTableMode === 'view' ? (
																		<DeleteIcon
																			className="text-red-400"
																			fontSize="small"
																		/>
																	) : (
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
									className={`flex items-center gap-[10px] pt-[10px!important] ${isTableMode === 'edit' ? 'justify-end' : 'justify-between'}`}
								>
									{isTableMode === 'view' ? null : (
										<>
											{isTableMode === 'edit' ? null : (
												<Button
													className="flex justify-center items-center min-w-[80px] sm:min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
													type="button"
													variant="contained"
													size="medium"
													onClick={() => onSubmitBack(values)}
												>
													{t('Back')}
												</Button>
											)}

											<Button
												className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
												type="submit"
												variant="contained"
												size="medium"
												disabled={false}
											>
												{isTableMode === 'edit' ? 'Update' : 'Next'}
												{isProductSubmitDataLoading ? (
													<CircularProgress
														className="text-white ml-[5px]"
														size={24}
													/>
												) : null}
											</Button>
										</>
									)}
								</Grid>
							</Grid>
						</Form>
					)}
				</Formik>
			</Paper>

			{isOpenDeleteModal && (
				<DeleteAlertForm
					isOpen={isOpenDeleteModal}
					toggleModal={toggleDeleteModal}
					clickedRowData={deleteProductId}
					handleAlertForm={handleAlertForm}
				/>
			)}
		</div>
	);
}

export default RelatedComp;
