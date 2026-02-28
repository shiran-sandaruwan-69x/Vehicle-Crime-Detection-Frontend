import AddCircleIcon from '@mui/icons-material/AddCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import {
	Button,
	CircularProgress,
	Grid,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete/Autocomplete';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Field, FieldArray, Form, Formik, FormikHelpers } from 'formik';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import DeleteIcon from '@mui/icons-material/Delete';
import InactiveAlertForm from './InactiveAlertForm';
import VarietyEditForm from './VarietyEditForm';

import {
	createProductMaster,
	getAllEtfItemMasterDataWithOutPagination
} from '../../../../../axios/services/live-aquaria-services/master-data-services/MasterDataServices';
import TextFormField from '../../../../../common/FormComponents/FormTextField';
import {
	CisCodeDataItem,
	CisCodeResponse,
	CreateGeneralViewTypes,
	EditRemarkType,
	ItemAttributeType,
	OptionsSetDataDropDownData,
	OptionsSetDataItem,
	PriceAndRemarkSubmitForm,
	ProductSelectionsDataType,
	ProductSelectionTypes,
	ProductSelectionValuesType,
	TableDataProductSelection
} from '../product-list-types/ProductListTypes';
import PriceAndRemarkComp from './PriceAndRemarkComp';

interface ErrorResponse {
	response?: {
		data?: {
			message?: string;
		};
	};
}
interface Props {
	isGeneralViewData: CreateGeneralViewTypes;
	isProductAttributeData: ItemAttributeType;
	isTableMode: string;
	onBack: (values: ProductSelectionValuesType) => void;
	initialValuesData: ProductSelectionsDataType;
	fetchAllProductList: () => void;
	toggleModal: () => void;
}

function ProductSelectionsComp({
	isGeneralViewData,
	isProductAttributeData,
	isTableMode,
	onBack,
	initialValuesData,
	fetchAllProductList,
	toggleModal
}: Props) {
	const { t } = useTranslation('productList');
	const schema = yup.object().shape({});
	const [varieties, setVarieties] = useState([]);
	const [data, setData] = useState<OptionsSetDataItem[]>([]);
	const [cisCode, setCisCode] = useState<OptionsSetDataDropDownData[]>([]);
	const [isProductSubmitDataLoading, setProductSubmitDataLoading] = useState(false);

	const [isOpenRemarkEditModal, setOpenRemarkEditModal] = useState(false);
	const toggleRemarkEditModal = () => setOpenRemarkEditModal(!isOpenRemarkEditModal);

	const [isInactivateModalData, setInactivateModalData] = useState<TableDataProductSelection>(null);
	const [isOpenInactivateModal, setOpenInactivateModal] = useState(false);
	const [isOpenPriceAndRemarkModal, setOpenPriceAndRemarkModal] = useState(false);
	const toggleRemarkInactivateModal = () => setOpenInactivateModal(!isOpenInactivateModal);
	const togglePriceRemarkModal = () => setOpenPriceAndRemarkModal(!isOpenPriceAndRemarkModal);

	const [editRemark, setEditRemark] = useState<EditRemarkType>({});

	const [initialValues, setInitialValues] = useState(initialValuesData?.values || []);

	const handleClearForm = (resetForm: FormikHelpers<ProductSelectionValuesType>['resetForm']) => {
		resetForm();
	};

	useEffect(() => {
		getCisCodeData();
	}, []);

	const getCisCodeData = async () => {
		try {
			const response: CisCodeResponse = await getAllEtfItemMasterDataWithOutPagination();
			const optionsSetData: OptionsSetDataItem[] = response.data.map((item: CisCodeDataItem) => ({
				id: item.id,
				cisCode: item.cis_code,
				gender: item.gender,
				size: item.size,
				age: item.age,
				aquatic_type: item.aquatic_type,
				origin: item.origins,
				length: item.length,
				sellingPrice: item.regular_price,
				displayPrice: '',
				availableQty: item.inventory_qty,
				considerStock: 1,
				remark: ''
			}));

			setData(optionsSetData);
			const options: OptionsSetDataDropDownData[] = response.data.map((item: CisCodeDataItem) => ({
				label: item.cis_code,
				value: item.cis_code
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

	const handleAlertForm = async () => {};

	const handleToggleInactivate = async () => {};

	const onSubmit = async (values: ProductSelectionValuesType) => {
		if (values.values.length !== 0) {
			const areFieldsFilled = values.values.every((selection, selectionIndex) => {
				if (!selection.productSelectionName || selection.productSelectionName.trim() === '') {
					toast.error(`Product Selection Name is required in selection ${selectionIndex + 1}.`);
					return false;
				}

				if (!selection.tableData || selection.tableData.length === 0) {
					toast.error(`Each table must have at least one row in selection ${selectionIndex + 1}.`);
					return false;
				}

				return selection.tableData.every((row, rowIndex) => {
					if (!row.cisCode || row.cisCode.trim() === '') {
						toast.error(`CIS Code is required in row ${rowIndex + 1} of selection ${selectionIndex + 1}.`);
						return false;
					}

					if (!row.displayName || row.displayName.trim() === '') {
						toast.error(
							`Display Name is required in row ${rowIndex + 1} of selection ${selectionIndex + 1}.`
						);
						return false;
					}

					if (!row.displayPrice || row.displayPrice.trim() === '') {
						toast.error(
							`Selling Price is required in row ${rowIndex + 1} of selection ${selectionIndex + 1}.`
						);
						return false;
					}

					return true;
				});
			});

			if (areFieldsFilled) {
				const itemSelections = values.values.map((selection) => ({
					name: selection.productSelectionName, // Use the product selection name
					is_active: 1,
					selection_types: selection.tableData.map((row) => ({
						master_data_id: row.id,
						display_name: row.displayName,
						display_price: parseFloat(row.newPrice),
						remark: row.remark ?? null,
						discount_rate: row.displayApplicable ?? null,
						selling_price: row.displayPrice ?? null,
						consider_stock: (row.considerStock ? 1 : 0) ?? null,
						is_active: 1
					}))
				}));
				let parentId: string;

				if (isGeneralViewData.parentCategory5) {
					parentId = isGeneralViewData.parentCategory5;
				} else if (isGeneralViewData.parentCategory4) {
					parentId = isGeneralViewData.parentCategory4;
				} else if (isGeneralViewData.parentCategory3) {
					parentId = isGeneralViewData.parentCategory3;
				} else if (isGeneralViewData.parentCategory2) {
					parentId = isGeneralViewData.parentCategory2;
				} else {
					parentId = isGeneralViewData.parentCategory1;
				}

				const reqData = {
					type: '0',
					item_category_id: parentId,
					title: isGeneralViewData.title,
					aquatic_type: isGeneralViewData.aquaticType,
					common_name: isGeneralViewData.product_name,
					scientific_name: isGeneralViewData.scientific_name,
					short_description: null,
					long_description: null,
					meta_keywords: null,
					meta_description: null,
					additional_information: null,
					is_active: 1,
					// is_advertisement: 1,
					item_selections: itemSelections,
					item_attribute: isProductAttributeData.item_attribute
				};
				setProductSubmitDataLoading(true);
				try {
					const response = await createProductMaster(reqData);
					fetchAllProductList();
					setProductSubmitDataLoading(false);
					toast.success('Created Successfully');
					toggleModal();
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
				toast.error('Validation failed');
			}
		} else {
			toast.error('Product Selection Required');
		}
	};

	const onSubmitBack = (values: ProductSelectionValuesType) => {
		if (values.values.length !== 0) {
			const areFieldsFilled = values.values.every((selection, selectionIndex) => {
				if (!selection.productSelectionName || selection.productSelectionName.trim() === '') {
					toast.error(`Product Selection Name is required in selection ${selectionIndex + 1}.`);
					return false;
				}

				if (!selection.tableData || selection.tableData.length === 0) {
					toast.error(`Each table must have at least one row in selection ${selectionIndex + 1}.`);
					return false;
				}

				return selection.tableData.every((row, rowIndex) => {
					if (!row.cisCode || row.cisCode.trim() === '') {
						toast.error(`CIS Code is required in row ${rowIndex + 1} of selection ${selectionIndex + 1}.`);
						return false;
					}

					return true;
				});
			});

			if (areFieldsFilled) {
				onBack(values);
			} else {
				console.log('Validation failed.');
			}
		} else {
			toast.error('Product Selection Required');
		}
	};

	const handleDeleteRow = (
		varietyId: string,
		value: ProductSelectionTypes,
		row,
		setFieldValue: FormikHelpers<ProductSelectionValuesType>['setFieldValue'],
		index
	) => {
		const updatedTableData = value.tableData.filter((item) => item !== row);
		setFieldValue(`values.${index}.tableData`, updatedTableData);
	};

	const editPriceAndRemark = (row: TableDataProductSelection) => {
		setInactivateModalData(row);
		togglePriceRemarkModal();
	};

	const handlePriceAndRemark = (
		values: PriceAndRemarkSubmitForm,
		setValues: FormikHelpers<ProductSelectionValuesType>['setValues']
	) => {
		if (!isInactivateModalData) return;

		setValues((prevValues) => {
			const updatedValues = {
				...prevValues,
				values: prevValues.values.map((selection) => ({
					...selection,
					tableData: selection.tableData.map((row) =>
						row.id === isInactivateModalData.id
							? {
									...row,
									displayName: values.displayName,
									displayPrice: values.displayPrice,
									considerStock: values.considerStock,
									displayApplicable: values.displayApplicable,
									isDiscounted: values.isDiscounted,
									newPrice: values.newPrice,
									remark: values.remark
								}
							: row
					)
				}))
			};
			return updatedValues;
		});

		togglePriceRemarkModal();
	};

	return (
		<div className="min-w-full max-w-[100vw]">
			<Grid
				container
				spacing={2}
				className="pt-0"
			>
				{/* Title */}
				<Grid
					item
					xs={12}
					className="pt-[5px!important]"
				>
					<h6 className="text-[10px] sm:text-[12px] lg:text-[14px] text-gray-800 font-600">
						Product Selections
					</h6>
				</Grid>
				{/* Title */}
				<Grid
					item
					xs={12}
					className="pt-[5px!important]"
				>
					<Formik
						initialValues={{ values: initialValues }}
						validationSchema={schema}
						onSubmit={onSubmit}
					>
						{({ values, setFieldValue, resetForm, setValues }) => (
							<Form>
								<Grid
									container
									spacing={2}
									className="mt-[0]"
								>
									<FieldArray name="values">
										{({ push, remove }) => (
											<Grid
												item
												md={12}
												sm={12}
												xs={12}
												className="pt-[5px!important]"
											>
												<Grid
													container
													spacing={2}
												>
													{values.values.map((value, index) => (
														<Grid
															item
															md={11}
															sm={11}
															xs={11}
															key={index}
															className={`pt-[5px!important] ${
																index % 1 === 0 ? 'bg-transparent' : 'bg-transparent'
															}`}
														>
															{/* Product Selections Section */}
															<div className="flex flex-wrap sm:flex-nowrap items-end gap-[10px] w-full">
																<Grid
																	container
																	spacing={2}
																	className="min-w-full sm:min-w-[calc(100%-40px)] mt-0"
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
																			{t('PRODUCT_SELECTION_NAME')}
																		</Typography>
																		<Field
																			name={`values.${index}.productSelectionName`}
																			placeholder="Placeholder"
																			component={TextFormField}
																			fullWidth
																			disabled={false}
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
																			{t('CIS_CODE')}
																		</Typography>
																		<div className="flex items-center w-full">
																			<Autocomplete
																				options={cisCode} // Your cisCode options
																				getOptionLabel={(
																					option: OptionsSetDataDropDownData
																				) => option.label} // Display the label
																				renderInput={(params) => (
																					<TextField
																						{...params}
																						label=""
																						variant="outlined"
																						size="small"
																						fullWidth
																					/>
																				)}
																				onChange={(
																					event,
																					newValue: OptionsSetDataDropDownData
																				) => {
																					setFieldValue(
																						`values.${index}.cisCode`,
																						newValue ? newValue.value : ''
																					);
																				}}
																				value={
																					cisCode.find(
																						(option) =>
																							option.value ===
																							values.values[index].cisCode
																					) || null
																				}
																				isOptionEqualToValue={(option, value) =>
																					option.value === value
																				}
																				clearOnBlur
																				handleHomeEndKeys
																				freeSolo // Allow user input beyond options
																				disableClearable
																				className="w-full"
																			/>

																			<IconButton
																				className="text-primaryBlue"
																				onClick={() => {
																					const currentCisCode =
																						values.values[index].cisCode;

																					if (currentCisCode) {
																						// Filter the dataset based on the input cisCode
																						const filteredData =
																							data.filter(
																								(item) =>
																									item.cisCode ===
																									currentCisCode
																							);

																						if (filteredData.length > 0) {
																							// Check for duplicates in the existing tableData of all tables
																							const isDuplicate =
																								values.values.some(
																									(v, i) =>
																										i !== index &&
																										v.tableData.some(
																											(row) =>
																												row.cisCode ===
																												currentCisCode
																										)
																								);

																							if (isDuplicate) {
																								// Alert user or handle the duplicate case
																								toast.error(
																									`CIS Code "${currentCisCode}" is already added.`
																								);
																							} else {
																								// Check if the filtered data already exists in the tableData of the current table
																								const isAlreadyAdded =
																									values.values[
																										index
																									].tableData.some(
																										(row) =>
																											row.cisCode ===
																											currentCisCode
																									);

																								if (isAlreadyAdded) {
																									toast.error(
																										`CIS Code "${currentCisCode}" is already added to this selection.`
																									);
																								} else {

																									const updatedTableData =
																										[
																											...values
																												.values[
																												index
																											].tableData,
																											...filteredData
																										];

																									const newItemAquaticType =
																										filteredData[0]
																											?.aquatic_type;
																									const masterAquaticType =
																										isGeneralViewData.aquaticType;

																									if (
																										newItemAquaticType &&
																										masterAquaticType
																									) {
																										if (
																											newItemAquaticType ===
																												'fresh' &&
																											masterAquaticType !==
																												'fresh'
																										) {
																											toast.error(
																												"Cannot add item: Aquatic type mismatch. Item Master Data is 'Saltwater' but product is 'Freshwater'"
																											);
																										} else if (
																											newItemAquaticType ===
																												'salt' &&
																											masterAquaticType !==
																												'salt'
																										) {
																											toast.error(
																												"Cannot add item: Aquatic type mismatch. Item Master Data is 'Freshwater' but product is 'Saltwater'"
																											);
																										} else if (
																											newItemAquaticType ===
																												'both' &&
																											![
																												'fresh',
																												'salt',
																												'both'
																											].includes(
																												masterAquaticType
																											)
																										) {
																											toast.error(
																												"Invalid aquatic type combination. 'Both' type items can only be added to Freshwater, Saltwater, or Both-type products."
																											);
																										} else {
																											// All validations passed - update the form values
																											setFieldValue(
																												`values.${index}.tableData`,
																												updatedTableData
																											);
																											setFieldValue(
																												`values.${index}.cisCode`,
																												''
																											);
																										}
																									} else {
																										toast.error(
																											'Could not determine aquatic type for validation.'
																										);
																									}
																								}
																							}
																						}
																					}
																				}}
																			>
																				<AddCircleIcon />
																			</IconButton>
																		</div>
																	</Grid>

																	{/* Product Offering Type Table */}
																	<Grid
																		item
																		lg={12}
																		md={12}
																		sm={12}
																		xs={12}
																		className="formikFormField custom-table pt-[5px!important]"
																	>
																		<h6 className="text-[10px] sm:text-[12px] lg:text-[14px] text-gray-800 font-600 mb-[5px]">
																			{t('PRODUCT_OFFERING_TYPES')}
																		</h6>
																		<TableContainer
																			component={Paper}
																			sx={{ borderRadius: 0 }}
																		>
																			<Table size="small">
																				<TableHead>
																					<TableRow>
																						<TableCell
																							sx={{
																								backgroundColor:
																									'#354a95',
																								color: 'white'
																							}}
																						>
																							{t('CIS_CODE_SKU')}
																						</TableCell>
																						<TableCell
																							sx={{
																								backgroundColor:
																									'#354a95',
																								color: 'white'
																							}}
																						>
																							{t('Display Name')}
																						</TableCell>
																						<TableCell
																							sx={{
																								backgroundColor:
																									'#354a95',
																								color: 'white'
																							}}
																						>
																							{t('Regular Price($)')}
																						</TableCell>
																						<TableCell
																							sx={{
																								backgroundColor:
																									'#354a95',
																								color: 'white'
																							}}
																						>
																							{t('Selling Price($)')}
																						</TableCell>
																						<TableCell
																							sx={{
																								backgroundColor:
																									'#354a95',
																								color: 'white'
																							}}
																						>
																							{t(
																								'Discount Applicable(%)'
																							)}
																						</TableCell>
																						<TableCell
																							sx={{
																								backgroundColor:
																									'#354a95',
																								color: 'white'
																							}}
																						>
																							{t('Display Price($)')}
																						</TableCell>
																						<TableCell
																							sx={{
																								backgroundColor:
																									'#354a95',
																								color: 'white'
																							}}
																						>
																							{t('AVAILABLE_QUANTITY')}
																						</TableCell>
																						<TableCell
																							sx={{
																								backgroundColor:
																									'#354a95',
																								color: 'white'
																							}}
																						>
																							{t('ACTION')}
																						</TableCell>
																					</TableRow>
																				</TableHead>
																				<TableBody>
																					{/* Render Table Rows */}
																					{value.tableData?.map(
																						(
																							row: TableDataProductSelection,
																							rowIndex
																						) => (
																							<TableRow key={rowIndex}>
																								<TableCell>
																									{row.cisCode}
																								</TableCell>
																								<TableCell>
																									{row.displayName ||
																										''}
																								</TableCell>
																								<TableCell>
																									{row.sellingPrice ||
																										''}
																								</TableCell>
																								<TableCell>
																									{row.displayPrice ||
																										''}
																								</TableCell>
																								<TableCell>
																									{row.displayApplicable ||
																										''}
																								</TableCell>
																								<TableCell>
																									{row.newPrice || ''}
																								</TableCell>
																								<TableCell>
																									{row.availableQty}
																								</TableCell>
																								<TableCell>
																									{isTableMode ===
																									'view' ? null : (
																										<>
																											<EditIcon
																												style={{
																													color: 'green',
																													fontSize:
																														'18px'
																												}}
																												sx={{
																													cursor: 'pointer'
																												}}
																												onClick={() =>
																													editPriceAndRemark(
																														row
																													)
																												}
																											/>
																											<DeleteIcon
																												sx={{
																													cursor: 'pointer'
																												}}
																												onClick={() =>
																													handleDeleteRow(
																														row.oldId,
																														value,
																														row,
																														setFieldValue,
																														index
																													)
																												}
																											/>
																										</>
																									)}
																								</TableCell>
																							</TableRow>
																						)
																					)}
																				</TableBody>
																			</Table>
																		</TableContainer>
																	</Grid>
																	{/* Product Offering Type Table */}
																	<Grid
																		item
																		xs={12}
																		className="pt-[15px!important]"
																	>
																		<hr />
																	</Grid>
																</Grid>
																<div className="flex justify-end items-start gap-[10px] min-w-max pb-0 sm:pb-[24px]">
																	<IconButton
																		className="text-red"
																		onClick={() => remove(index)}
																		color="error"
																	>
																		<CancelIcon />
																	</IconButton>
																</div>
															</div>
														</Grid>
													))}

													{/* Add Button for Product Selections */}
													<Grid
														item
														md={values.values.length >= 1 ? 1 : 12}
														sm={values.values.length >= 1 ? 1 : 12}
														xs={1}
														className={`flex justify-end items-end gap-[10px] pt-[5px!important] pb-0 ${
															values.values.length >= 1 ? '' : 'mt-[-24px]'
														}`}
													>
														<IconButton
															className="text-primaryBlue"
															onClick={() =>
																push({
																	productSelectionName: '',
																	cisCode: '',
																	tableData: []
																})
															}
														>
															<AddCircleIcon />
														</IconButton>
													</Grid>
												</Grid>
											</Grid>
										)}
									</FieldArray>

									{/* Submit Button */}

									<Grid
										item
										xs={12}
										className="flex flex-wrap justify-between items-center gap-[10px] pt-[15px!important]"
									>
										<Button
											className="flex justify-center items-center min-w-[80px] sm:min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
											type="button" // Changed to button
											variant="contained"
											size="medium"
											onClick={() => onSubmitBack(values)}
										>
											{t('Back')}
										</Button>
										<div className="flex flex-wrap justify-start sm:justify-end items-center gap-[10px]">
											<Button
												className="flex justify-center items-center min-w-[80px] sm:min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
												type="button"
												variant="contained"
												size="medium"
												disabled={false}
												onClick={() => handleClearForm(resetForm)}
											>
												{t('Clear All')}
											</Button>
											<Button
												className="flex justify-center items-center min-w-[80px] sm:min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
												type="submit"
												variant="contained"
												size="medium"
												disabled={false}
											>
												{t('Save')}
												{isProductSubmitDataLoading ? (
													<CircularProgress
														className="text-gray-600 ml-[5px]"
														size={24}
													/>
												) : null}
											</Button>

											<Button
												onClick={toggleModal}
												className="flex justify-center items-center min-w-[80px] sm:min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
											>
												Close
											</Button>
										</div>
									</Grid>
								</Grid>

								{isOpenPriceAndRemarkModal && isInactivateModalData && (
									<PriceAndRemarkComp
										toggleModal={togglePriceRemarkModal}
										isOpen={isOpenPriceAndRemarkModal}
										clickedRowData={isInactivateModalData}
										handleAlertForm={(formValues) => handlePriceAndRemark(formValues, setValues)}
										isMode={isTableMode}
									/>
								)}
							</Form>
						)}
					</Formik>
				</Grid>
			</Grid>

			{isOpenRemarkEditModal && (
				<VarietyEditForm
					isOpen={isOpenRemarkEditModal}
					toggleModal={toggleRemarkEditModal}
					clickedRowData={editRemark}
					handleAlertForm={handleAlertForm}
				/>
			)}

			{isOpenInactivateModal && (
				<InactiveAlertForm
					isOpen={isOpenInactivateModal}
					toggleModal={toggleRemarkInactivateModal}
					clickedRowData=""
					handleAlertForm={handleToggleInactivate}
				/>
			)}
		</div>
	);
}

export default ProductSelectionsComp;
