import { Theme, useTheme } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
	Button,
	Chip,
	CircularProgress,
	FormControl,
	Grid,
	IconButton,
	MenuItem,
	OutlinedInput,
	Select
} from '@mui/material';
import FormHelperText from '@mui/material/FormHelperText';
import CancelIcon from '@mui/icons-material/Cancel';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import {
	getAllAttributeListWithOutPagination,
	getDriversDenMasterData,
	updateDriversDenMasterData
} from '../../../../../axios/services/live-aquaria-services/master-data-services/MasterDataServices';
import {
	AttributeItemType,
	AttributeResponse,
	AttributeResponseType,
	PastAttributesType
} from '../../product-list/product-list-types/ProductListTypes';
import {
	OneProductDiversDenMasterType,
	ProductDiversDenMaster,
	ProductDiversDenMasterModifyData
} from '../drivers-den-types/DriversDenTypes';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width: 250
		}
	}
};

function getStyles(name: string, personName: readonly string[], theme: Theme) {
	return {
		fontWeight:
			personName.indexOf(name) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium
	};
}

interface ErrorResponse {
	response?: {
		data?: {
			message?: string;
		};
	};
}
interface Props {
	isTableMode: string;
	clickedRowData: ProductDiversDenMasterModifyData;
	fetchAllProductList: () => void;
	toggleModal?: () => void;
}

function ViewAndEditProductAttributes({ clickedRowData, isTableMode, fetchAllProductList, toggleModal }: Props) {
	const theme = useTheme();

	const [past, setPast] = useState<PastAttributesType>({});

	const [predefinedAttributes, setPredefinedAttributes] = useState<PastAttributesType>({});

	const [attributes, setAttributes] = useState<AttributeItemType[]>([]);
	const [allAttributes, setAllAttributes] = useState<AttributeResponseType[]>([]);
	const [isEditLoading, setEditLoading] = useState(false);

	const [isProduct, setVProduct] = useState<ProductDiversDenMaster>({});
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		fetchDataProductId();
	}, []);

	const fetchDataProductId = async () => {
		const productId = clickedRowData.id ? clickedRowData.id : '';
		setIsLoading(true);
		try {
			const response: OneProductDiversDenMasterType = await getDriversDenMasterData(productId);
			setVProduct(response.data);
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
		if (isProduct?.id) {
			// Ensure product data is loaded
			fetchAllAttribute();
		}
	}, [isProduct]);

	const fetchAllAttribute = async () => {
		try {
			const response: AttributeResponse = await getAllAttributeListWithOutPagination();
			const newValues = {};
			const preValues = {};
			let propsAtt: AttributeItemType[] = [];

			setAllAttributes(response.data);
			response.data.forEach((attribute) => {
				const categoryName = attribute.name;
				const attributeValues = attribute.item_attribute.map((item) => item.name);

				// Find matching attributes from clickedRowData
				const matchingAttributes = isProduct.item_attributes.flatMap((attrArray) =>
					attrArray
						.filter((attr) => attr.name === categoryName)
						.map((attr) => ({
							attribute: attr.name,
							attributeId: attr.id,
							selectedValuesWithId: Array.isArray(attr.attributes)
								? attr.attributes.map((item) => ({
										name: item.name,
										id: item.id
									}))
								: [],
							selectedValues: Array.isArray(attr.attributes)
								? attr.attributes.map((item) => item.name)
								: [],
							newChipValue: '',
							editingIndex: -1,
							error: ''
						}))
				);

				newValues[categoryName] = attributeValues;
				preValues[categoryName] =
					matchingAttributes.length > 0 ? matchingAttributes.flatMap((attr) => attr.selectedValues) : [];

				propsAtt = [...propsAtt, ...matchingAttributes];
			});

			setPast(newValues);
			setPredefinedAttributes(preValues);
			setAttributes(propsAtt);
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

	const getAvailableAttributes = () => {
		const selectedAttributes = attributes.map((attr) => attr.attribute).filter((attr) => attr !== '');
		return Object.keys(predefinedAttributes).filter((attr) => !selectedAttributes.includes(attr));
	};

	// Handle changing the attribute
	const handleChangeAttribute = (attrIndex: number, newAttribute: string) => {
		const newAttributes: AttributeItemType[] = [...attributes];
		newAttributes[attrIndex].attribute = newAttribute;
		newAttributes[attrIndex].values = predefinedAttributes[newAttribute] || [];
		newAttributes[attrIndex].selectedValues = predefinedAttributes[newAttribute] || [];
		newAttributes[attrIndex].error = '';
		setAttributes(newAttributes);
	};

	// Add a new attribute block
	const handleAddAttribute = () => {
		setAttributes([
			...attributes,
			{
				attribute: '',
				values: [],
				newChipValue: '',
				editingIndex: -1,
				error: ''
			}
		]);
	};

	// Remove an attribute block
	const handleRemoveAttribute = (attrIndex: number) => {
		const newAttributes: AttributeItemType[] = attributes.filter((_, index) => index !== attrIndex);
		setAttributes(newAttributes);
	};

	// Handle form submission
	const handleSubmit = async () => {
		const newAttributes = [...attributes];
		let isValid = true;

		newAttributes.forEach((attr, index) => {
			if (!attr.attribute) {
				newAttributes[index].error = 'Attribute is required';
				isValid = false;
			} else {
				newAttributes[index].error = '';
			}

			const selectedValues = attr.selectedValues || [];

			if (selectedValues.length === 0) {
				newAttributes[index].error = `Value is required`;
				isValid = false;
			}
		});

		setAttributes(newAttributes);

		if (isValid) {
			const data = {
				item_attribute: []
			};

			newAttributes.forEach((attr: AttributeItemType) => {
				const matchingAttributes = allAttributes
					.filter((allAttr) => allAttr.name === attr.attribute)
					.flatMap((allAttr) =>
						allAttr.item_attribute
							.filter((itemAttr) => attr.selectedValues.includes(itemAttr.name))
							.map((itemAttr) => itemAttr.id)
					);

				if (matchingAttributes.length > 0) {
					data.item_attribute.push(...matchingAttributes);
				}
			});

			const requestData = {
				item_attribute: data.item_attribute
			};
			const id: string = clickedRowData.id ? clickedRowData.id : '';
			try {
				setEditLoading(true);
				const response = await updateDriversDenMasterData(requestData, id);
				fetchDataProductId();
				fetchAllProductList();
				toast.success('Updated successfully');
				setEditLoading(false);
			} catch (error: any) {
				setEditLoading(false);
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

	const handleChangeValues = (attrIndex: number, event: { target: { value: string | string[] } }) => {
		const {
			target: { value }
		} = event;

		const updatedAttributes: AttributeItemType[] = [...attributes];

		updatedAttributes[attrIndex].selectedValues = typeof value === 'string' ? value.split(',') : value;

		updatedAttributes[attrIndex].error = '';

		setAttributes(updatedAttributes);
	};

	const availableAttributes = React.useMemo(() => getAvailableAttributes(), [attributes, predefinedAttributes]);

	if (isLoading) {
		return (
			<div className="flex justify-center items-center">
				<CircularProgress className="text-primaryBlueLight" />
			</div>
		);
	}

	return (
		<div className="min-w-full max-w-[100vw] pt-[5px]">
			<Grid
				container
				spacing={2}
			>
				<Grid
					item
					xs={12}
					className="pt-[15px!important]"
				>
					<h6 className="text-[10px] text-gray-700 italic">
						<b>Product Attributes : </b>Make sure to maintain at least one Attribute & value prior to update
						Divers Den Item
					</h6>
				</Grid>
				<Grid
					item
					xs={11}
					sm={11}
				>
					{attributes.map((attr, attrIndex) => (
						<div
							key={attrIndex}
							className="mb-[20px]"
						>
							<Grid
								container
								spacing={2}
							>
								<Grid
									item
									xs={10}
									md={3}
									lg={3}
									sm={4}
									className="pt-[5px!important]"
								>
									<FormControl
										fullWidth
										size="small"
									>
										<Select
											fullWidth
											disabled={isTableMode === 'view'}
											label=""
											value={attr.attribute || ''}
											onChange={(e) => handleChangeAttribute(attrIndex, e.target.value)}
											displayEmpty
											renderValue={(selected) => selected || <em>Select an Attribute</em>}
											MenuProps={MenuProps}
										>
											{getAvailableAttributes().map((attribute) => (
												<MenuItem
													key={attribute}
													value={attribute}
												>
													{attribute}
												</MenuItem>
											))}
										</Select>
										{attributes[attrIndex].error === 'Attribute is required' && (
											<FormHelperText>{attributes[attrIndex].error}</FormHelperText>
										)}
									</FormControl>
								</Grid>

								<Grid
									item
									xs={10}
									sm={7}
									md={8}
									className="pt-[5px!important]"
								>
									<FormControl
										fullWidth
										size="small"
									>
										<Select
											labelId=""
											id="demo-multiple-chip"
											multiple
											size="small"
											disabled={isTableMode === 'view'}
											value={attributes[attrIndex].selectedValues || []}
											onChange={(e) => handleChangeValues(attrIndex, e)}
											input={
												<OutlinedInput
													id="select-multiple-chip"
													label=""
												/>
											}
											renderValue={(selected) => (
												<div className="flex flex-wrap justify-start items-center gap-[5px]">
													{selected.map((value) => (
														<Chip
															className="text-[11px] font-500 capitalize"
															key={value}
															label={value}
															size="small"
															sx={{
																'& span': {
																	lineHeight: 1.2
																}
															}}
														/>
													))}
												</div>
											)}
											MenuProps={MenuProps}
										>
											{past[attr.attribute] &&
												past[attr.attribute].map((value) => (
													<MenuItem
														key={value}
														value={value}
														style={getStyles(
															value,
															attributes[attrIndex].selectedValues || [],
															theme
														)}
													>
														{value}
													</MenuItem>
												))}
										</Select>
										{attributes[attrIndex].error === 'Value is required' && (
											<FormHelperText className="text-red-400 text-[10px]">
												{attributes[attrIndex].error}
											</FormHelperText>
										)}
									</FormControl>
								</Grid>
								<Grid
									item
									xs={2}
									sm={1}
									md={1}
									className="flex justify-center pt-[5px!important]"
								>
									<IconButton
										onClick={() => handleRemoveAttribute(attrIndex)}
										className="text-red"
										disabled={isTableMode === 'view'}
									>
										<CancelIcon />
									</IconButton>
								</Grid>
								<Grid
									item
									xs={12}
									md={12}
									className="pt-[10px!important]"
								>
									<hr />
								</Grid>
							</Grid>
						</div>
					))}
				</Grid>
				<Grid
					item
					xs={1}
					sm={1}
					className="flex justify-center items-end pt-[5px!important] pb-[30px]"
				>
					{isTableMode === 'view' ? null : (
						<IconButton
							onClick={handleAddAttribute}
							className="text-primaryBlue"
							disabled={availableAttributes.length === 0}
						>
							<AddCircleIcon fontSize="medium" />
						</IconButton>
					)}
				</Grid>
			</Grid>

			<Grid
				container
				spacing={2}
			>
				<Grid
					item
					xs={12}
					md={12}
					className="flex justify-end items-center pt-[10px!important]"
				>
					{isTableMode === 'view' ? null : (
						<Button
							className="flex justify-center items-center min-w-[80px] sm:min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
							variant="contained"
							size="medium"
							onClick={handleSubmit}
						>
							Update
							{isEditLoading ? (
								<CircularProgress
									className="text-white ml-[5px]"
									size={24}
								/>
							) : null}
						</Button>
					)}
					<Button
						onClick={toggleModal}
						className="flex ml-[5px] justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
					>
						Close
					</Button>
				</Grid>
			</Grid>
		</div>
	);
}

export default ViewAndEditProductAttributes;
