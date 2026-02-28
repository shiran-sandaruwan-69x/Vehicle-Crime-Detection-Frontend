import Paper from '@mui/material/Paper';
import { Field, FieldArray, Form, Formik, FormikHelpers } from 'formik';
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
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { toast } from 'react-toastify';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete/Autocomplete';
import DeleteIcon from '@mui/icons-material/Delete';
import VarietyEditForm from './VarietyEditForm';
import InactiveAlertForm from './InactiveAlertForm';

import TextFormField from '../../../../../common/FormComponents/FormTextField';
import {
	AllProductSelectionResponseOnesObjectTypes,
	CisCodeDataItem,
	CisCodeResponse,
	handleToggleConsiderStockData,
	ItemSelection,
	ModifiedDataItemViewProductSelection,
	OptionsSetDataDropDownData,
	OptionsSetDataItem,
	PriceAndRemarkSubmitForm,
	ProductSelectionsCompTableDataType,
	ProductSelectionType,
	ProductSelectionTypes,
	ProductSelectionValuesType,
	SelectionType,
	TableDataAllProductModifiedDataType,
	TableDataProductSelection
} from '../product-list-types/ProductListTypes';
import {
	createItemsSelections,
	deleteItemsProductSelections,
	deleteItemsSelections,
	getAllEtfItemMasterDataWithOutPagination,
	getProduct,
	updateItemsSelections
} from '../../../../../axios/services/live-aquaria-services/master-data-services/MasterDataServices';
import SelectionDeleteAlertForm from './SelectionDeleteAlertForm';
import PriceAndRemarkComp from './PriceAndRemarkComp';

interface ErrorResponse {
	response?: {
		data?: {
			message?: string;
		};
	};
}
interface Props {
	clickedRowData: TableDataAllProductModifiedDataType;
	isTableMode: string;
	fetchAllProductList: () => void;
	toggleModal: () => void;
}

function ProductSelectionsViewComp({ clickedRowData, isTableMode, fetchAllProductList, toggleModal }: Props) {
	const { t } = useTranslation('productList');
	const schema = yup.object().shape({});
	const [varieties, setVarieties] = useState([]);
	const [isAquaticType, setAquaticType] = useState('');
	const [data, setData] = useState<OptionsSetDataItem[]>([]);
	const [cisCode, setCisCode] = useState<OptionsSetDataDropDownData[]>([]);
	const [isProductSubmitDataLoading, setProductSubmitDataLoading] = useState(false);

	const [isOpenRemarkEditModal, setOpenRemarkEditModal] = useState(false);
	const toggleRemarkEditModal = () => setOpenRemarkEditModal(!isOpenRemarkEditModal);

	const [isInactivateModalData, setInactivateModalData] = useState<TableDataProductSelection>(null);
	const [isOpenInactivateModal, setOpenInactivateModal] = useState(false);
	const [isOpenDeleteModal, setOpenDeleteModal] = useState(false);
	const [isOpenPriceAndRemarkModal, setOpenPriceAndRemarkModal] = useState(false);
	const [isOpenProductSelectionDeleteModal, setOpenProductSelectionDeleteModal] = useState(false);
	const togglePriceRemarkModal = () => setOpenPriceAndRemarkModal(!isOpenPriceAndRemarkModal);
	const toggleRemarkInactivateModal = () => setOpenInactivateModal(!isOpenInactivateModal);
	const toggleRemarkDeleteModal = () => setOpenDeleteModal(!isOpenDeleteModal);
	const toggleProductSelectionDeleteModal = () =>
		setOpenProductSelectionDeleteModal(!isOpenProductSelectionDeleteModal);

	const [editRemark, setEditRemark] = useState<handleToggleConsiderStockData>({});
	const [deleteProductSelectionData, setDeleteProductSelectionData] = useState<ProductSelectionTypes>({});

	const [initialValues, setInitialValues] = useState<ModifiedDataItemViewProductSelection[]>([]);

	const handleClearForm = (resetForm: FormikHelpers<ProductSelectionValuesType>['resetForm']) => {
		resetForm();
	};

	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		getCisCodeData();
	}, []);

	useEffect(() => {
		fetchDataProductId();
	}, []);

	const fetchDataProductId = async () => {
		setIsLoading(true);
		try {
			const productId = clickedRowData.id ? clickedRowData.id : '';
			const response: AllProductSelectionResponseOnesObjectTypes = await getProduct(productId);
			const aquaticType: string = response?.data?.aquatic_type;
			setAquaticType(aquaticType);
			const modifiedData: ModifiedDataItemViewProductSelection[] = response.data?.item_selection.map(
				(itemSelection: ItemSelection) => ({
					selectionId: itemSelection?.id,
					productSelectionName: itemSelection?.name,
					cisCode: '',
					tableData: itemSelection?.selection_types.map((selectionType: SelectionType) => ({
						oldId: selectionType?.id,
						cisCode: selectionType?.master_data?.cis_code,
						masterDataId: selectionType?.master_data?.id,
						gender: selectionType?.master_data?.gender,
						size: selectionType?.master_data?.size,
						age: selectionType?.master_data?.age,
						origin: selectionType?.master_data?.origins,
						length: selectionType?.master_data?.length,
						sellingPrice: selectionType?.master_data?.regular_price,
						displayPrice: selectionType?.selling_price,
						displayApplicable: selectionType?.discount_rate,
						isDiscounted: selectionType?.discount_rate !== null,
						newPrice: selectionType?.display_price,
						availableQty: selectionType?.master_data?.inventory_qty,
						considerStock: selectionType?.consider_stock === 1,
						remark: selectionType?.remark,
						displayName: selectionType?.display_name
					})),
					active: itemSelection?.is_active === 1
				})
			);
			setInitialValues(modifiedData);
			setIsLoading(false);
		} catch (error) {
			const isErrorResponse = (error: unknown): error is ErrorResponse => {
				return typeof error === 'object' && error !== null && 'response' in error;
			};

			if (isErrorResponse(error) && error.response?.data?.message) {
				toast.error(error.response.data.message);
			} else {
				toast.error('Internal server error');
			}
		} finally {
			setIsLoading(false);
		}
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
				origin: item.origins,
				aquatic_type: item.aquatic_type,
				length: item.length,
				sellingPrice: item.regular_price,
				displayPrice: '',
				availableQty: item.inventory_qty,
				considerStock: 1,
				remark: ''
			}));

			setData(optionsSetData);
			const options: OptionsSetDataDropDownData[] = response.data.map((item) => ({
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

	const handleDeleteRow = (
		varietyId: string,
		value: ProductSelectionTypes,
		row,
		setFieldValue: FormikHelpers<ProductSelectionValuesType>['setFieldValue'],
		index
	) => {
		if (varietyId) {
			const data: handleToggleConsiderStockData = {
				mainId: value.selectionId,
				rowId: varietyId
			};
			setEditRemark(data);
			toggleRemarkDeleteModal();
		} else {
			const updatedTableData = value.tableData.filter((item) => item !== row);
			setFieldValue(`values.${index}.tableData`, updatedTableData);
		}
	};

	const handleAlertForm = async (values: { remark: string }) => {
		const data = {
			selection_types: [
				{
					id: editRemark.rowId,
					master_data_id: editRemark.masterDataId,
					is_active: 1,
					consider_stock: 0,
					remark: values.remark ? values.remark : editRemark.remark
				}
			]
		};
		const id: string = clickedRowData.id ? clickedRowData.id : '';
		const selectionId: string = editRemark.mainId ? editRemark.mainId : '';
		try {
			const response = await updateItemsSelections(data, id, selectionId);
			toggleRemarkEditModal();
			fetchDataProductId();
			toast.success('Updated successfully');
		} catch (error: any) {
			toggleRemarkEditModal();
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

	const handleToggleInactivate = async () => {
		const data = {
			selection_types: [
				{
					id: editRemark.rowId,
					master_data_id: editRemark.masterDataId,
					is_active: 1,
					consider_stock: 1,
					remark: null
				}
			]
		};
		const id: string = clickedRowData.id ? clickedRowData.id : '';
		const selectionId: string = editRemark.mainId ? editRemark.mainId : '';

		try {
			const response = await updateItemsSelections(data, id, selectionId);
			toggleRemarkInactivateModal();
			fetchDataProductId();
			toast.success('Updated Successfully');
		} catch (error: any) {
			toggleRemarkInactivateModal();
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

	const handleToggleDelete = async () => {
		const id: string = clickedRowData.id ? clickedRowData.id : '';
		const selectionId: string = editRemark.mainId ? editRemark.mainId : '';
		const rowId: string = editRemark.rowId ? editRemark.rowId : '';
		try {
			const response = await deleteItemsSelections(id, selectionId, rowId);
			toggleRemarkDeleteModal();
			fetchDataProductId();
			toast.success('Deleted Successfully');
		} catch (error) {
			toggleRemarkDeleteModal();
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

	const onSubmit = async (values: ProductSelectionValuesType) => {};

	const validateProductSelection = (selection: ProductSelectionTypes) => {
		if (!selection.productSelectionName || selection.productSelectionName.trim() === '') {
			toast.error('Product Selection Name is required.');
			return false;
		}

		if (!selection.tableData || selection.tableData.length === 0) {
			toast.error('Table must have at least one row.');
			return false;
		}

		const isTableDataValid = selection.tableData.every((row: TableDataProductSelection, rowIndex: number) => {
			if (!row.cisCode || row.cisCode.trim() === '') {
				toast.error(`CIS Code is required in row ${rowIndex + 1}.`);
				return false;
			}

			if (!row.displayName || row.displayName.trim() === '') {
				toast.error(`Display Name is required in row ${rowIndex + 1}.`);
				return false;
			}

			if (!row.displayPrice || row.displayPrice.trim() === '') {
				toast.error(`Selling Price is required in row ${rowIndex + 1}.`);
				return false;
			}

			return true;
		});

		return isTableDataValid;
	};

	const rowSubmit = async (values: ProductSelectionTypes) => {
		const isSelectionValid = validateProductSelection(values);

		if (isSelectionValid) {
			const data = {
				name: values.productSelectionName,
				is_active: 1,
				selection_types: values.tableData.map((row) => ({
					id: row.oldId ? row.oldId : null,
					master_data_id: row.id ? row.id : row.masterDataId,
					display_name: row.displayName,
					display_price: parseFloat(row.newPrice),
					remark: row.remark ?? null,
					discount_rate: row.displayApplicable ?? null,
					selling_price: row.displayPrice ?? null,
					consider_stock: (row.considerStock ? 1 : 0) ?? null,
					is_active: 1
				}))
			};
			const id: string = clickedRowData.id ? clickedRowData.id : '';
			const selectionId: string = values.selectionId ? values.selectionId : '';

			if (values.selectionId) {
				try {
					const response = await updateItemsSelections(data, id, selectionId);
					fetchDataProductId();
					fetchAllProductList();
					toast.success('Updated Successfully');
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
			} else {
				try {
					const response = await createItemsSelections(data, id);
					fetchDataProductId();
					toast.success('Created successfully');
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
			}
		}
	};

	const removeSelection = async (remove: (index) => void, index, value: ProductSelectionTypes) => {
		if (value.selectionId) {
			if (isTableMode === 'edit') {
				toggleProductSelectionDeleteModal();
				setDeleteProductSelectionData(value);
			}
		} else {
			remove(index);
		}
	};

	const handleToggleProductSelectionDelete = async () => {
		const id: string = clickedRowData.id ? clickedRowData.id : '';
		const selectionId: string = deleteProductSelectionData.selectionId
			? deleteProductSelectionData.selectionId
			: '';

		try {
			const response = await deleteItemsProductSelections(id, selectionId);
			toggleProductSelectionDeleteModal();
			fetchDataProductId();
			toast.success('Deleted Successfully');
		} catch (error) {
			toggleProductSelectionDeleteModal();
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

	const editPriceAndRemark = (row: TableDataProductSelection) => {
		setInactivateModalData(row);
		togglePriceRemarkModal();
	};

	const handlePriceAndRemark = (
		values: PriceAndRemarkSubmitForm,
		setValues: FormikHelpers<ProductSelectionValuesType>['setValues']
	) => {
		if (!isInactivateModalData) return;

		setValues((prevValues: ProductSelectionValuesType) => {
			return {
				...prevValues,
				values: prevValues.values.map((selection: ProductSelectionType) => ({
					...selection,
					tableData: selection.tableData.map((row: ProductSelectionsCompTableDataType) => {
						const shouldUpdate =
							(row.masterDataId &&
								isInactivateModalData.masterDataId &&
								row.masterDataId === isInactivateModalData.masterDataId) ||
							(row.id && isInactivateModalData.id && row.id === isInactivateModalData.id) ||
							(row.oldId && isInactivateModalData.oldId && row.oldId === isInactivateModalData.oldId);

						return shouldUpdate
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
							: row;
					})
				}))
			};
		});

		togglePriceRemarkModal();
	};

	if (isLoading) {
		return (
			<div className="flex justify-center items-center">
				<CircularProgress className="text-primaryBlueLight" />
			</div>
		);
	}

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
					<h6 className="text-[10px] text-gray-700 italic">
						<b>Product Selections : </b>Make sure to maintain at least one product selection prior to update
						LAQ master data
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
													{values.values.map((value: ProductSelectionTypes, index) => (
														<Grid
															item
															md={isTableMode === 'viewMode' ? 12 : 11}
															sm={isTableMode === 'viewMode' ? 12 : 11}
															xs={isTableMode === 'viewMode' ? 12 : 11}
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
																			{t('CIS_CODE')}
																		</Typography>
																		<div className="flex items-center w-full">
																			<Autocomplete
																				disabled={isTableMode === 'viewMode'}
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
																					// Update form value when a new option is selected
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
																				disabled={isTableMode === 'viewMode'}
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

																									const newItemAquaticType: string =
																										filteredData[0]
																											?.aquatic_type;

																									if (
																										newItemAquaticType &&
																										isAquaticType
																									) {
																										if (
																											newItemAquaticType ===
																												'fresh' &&
																											isAquaticType !==
																												'fresh'
																										) {
																											toast.error(
																												"Cannot add item: Aquatic type mismatch. Item Master Data is 'Saltwater' but product is 'Freshwater'"
																											);
																										} else if (
																											newItemAquaticType ===
																												'salt' &&
																											isAquaticType !==
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
																												isAquaticType
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
																											'Aquatic type is not assigned. Please ensure the CIS code is linked to an aquatic type before adding it.'
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
																		className="formikFormField pt-[5px!important] custom-table"
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

																								{/* <TableCell className="text-center"> */}
																								{/*	{row.remark} */}
																								{/*	{(isTableMode === */}
																								{/*		'view' || */}
																								{/*		isTableMode === */}
																								{/*			'edit') && */}
																								{/*		(row.remark ? ( */}
																								{/*			<div className="flex justify-center items-center gap-[10px]"> */}
																								{/*				{isTableMode === */}
																								{/*				'view' ? null : ( */}
																								{/*					<EditIcon */}
																								{/*						sx={{ */}
																								{/*							cursor: 'pointer' */}
																								{/*						}} */}
																								{/*						onClick={() => */}
																								{/*							handleEditRemark( */}
																								{/*								row.oldId, */}
																								{/*								row.masterDataId, */}
																								{/*								row.remark, */}
																								{/*								value, */}
																								{/*								row.considerStock */}
																								{/*							) */}
																								{/*						} */}
																								{/*					/> */}
																								{/*				)} */}
																								{/*			</div> */}
																								{/*		) : null)} */}
																								{/* </TableCell> */}
																								<TableCell>
																									{(isTableMode ===
																										'view' ||
																										isTableMode ===
																											'edit') &&
																										(isTableMode ===
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
																										))}
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
																		className="flex flex-wrap justify-end items-center gap-[10px] pt-[10px!important]"
																	>
																		{isTableMode === 'viewMode' ? null : (
																			<Button
																				className="flex justify-center items-center min-w-[80px] sm:min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
																				type="button"
																				variant="contained"
																				size="medium"
																				onClick={() => rowSubmit(value)}
																				disabled={isTableMode === 'viewMode'}
																			>
																				{isTableMode === 'edit'
																					? 'Update'
																					: 'Save'}
																				{isProductSubmitDataLoading ? (
																					<CircularProgress
																						className="text-gray-600 ml-[5px]"
																						size={24}
																					/>
																				) : null}
																			</Button>
																		)}
																	</Grid>
																	<Grid
																		item
																		xs={12}
																		className="pt-[15px!important]"
																	>
																		<hr />
																	</Grid>
																</Grid>
																<div
																	className={`flex justify-end items-start gap-[10px] min-w-max pb-0 ${
																		isTableMode === 'viewMode' ||
																		isTableMode === 'edit'
																			? 'sm:pb-[15px]'
																			: 'sm:pb-[24px]'
																	}`}
																>
																	<IconButton
																		onClick={() =>
																			removeSelection(remove, index, value)
																		}
																		color="error"
																		disabled={isTableMode === 'viewMode'}
																	>
																		<CancelIcon />
																	</IconButton>
																</div>
															</div>
														</Grid>
													))}
													{/* Add Button for Product Selections */}
													{isTableMode === 'viewMode' ? (
														''
													) : (
														<Grid
															item
															md={values.values.length >= 1 ? 1 : 12}
															sm={values.values.length >= 1 ? 1 : 12}
															xs={1}
															className={`flex justify-end items-end gap-[10px] pt-[5px!important] pb-0 ${
																values.values.length >= 1 ? '' : 'mt-[-24px]'
															} ${
																isTableMode === 'viewMode' || isTableMode === 'edit'
																	? 'sm:pb-[15px]'
																	: 'sm:pb-[24px]'
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
													)}
												</Grid>
											</Grid>
										)}
									</FieldArray>

									<Grid
										item
										xs={12}
										className="flex flex-wrap justify-end items-center gap-[10px] pt-[15px!important]"
									>
										<Button
											onClick={toggleModal}
											className="flex justify-center items-center min-w-[80px] sm:min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
										>
											Close
										</Button>
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
					clickedRowData="The existing remark will be deleted"
					handleAlertForm={handleToggleInactivate}
				/>
			)}

			{isOpenDeleteModal && (
				<InactiveAlertForm
					isOpen={isOpenDeleteModal}
					toggleModal={toggleRemarkDeleteModal}
					clickedRowData=""
					handleAlertForm={handleToggleDelete}
				/>
			)}

			{isOpenProductSelectionDeleteModal && (
				<SelectionDeleteAlertForm
					isOpen={isOpenProductSelectionDeleteModal}
					toggleModal={toggleProductSelectionDeleteModal}
					clickedRowData=""
					handleAlertForm={handleToggleProductSelectionDelete}
				/>
			)}
		</div>
	);
}

export default ProductSelectionsViewComp;
