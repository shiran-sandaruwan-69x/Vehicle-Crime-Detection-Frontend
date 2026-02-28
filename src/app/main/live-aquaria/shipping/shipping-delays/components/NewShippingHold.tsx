import { useTranslation } from 'react-i18next';
import { Button, CircularProgress, Dialog, DialogContent, Grid, Typography } from '@mui/material';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import React, { useEffect, useState } from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import DialogTitle from '@mui/material/DialogTitle';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import axios, { AxiosResponse } from 'axios';
import TextFormField from '../../../../../common/FormComponents/FormTextField';
import TextFormDateField from '../../../../../common/FormComponents/TextFormDateField';
import FormDropdown from '../../../../../common/FormComponents/FormDropdown';
import ResponsiveTimePickers from '../../../../../common/FormComponents/ResponsiveTimePickers';
import { ShippingHoldsModifiedData, ShippingHoldsSubmitType } from '../shipping-holds-types/ShippingHoldsType';
import { ShippingScheduleTypeDrp } from '../../shipping-methods/types/ShippingMethodsType';
import {
	ShippingStateApiResponse,
	ShippingStateResponse
} from '../../additional-cost/additional-cost-types/AdditionalCostTypes';
import { CREATE_SHIPPING_STATES } from '../../../../../axios/services/live-aquaria-services/shipping-services/ShippingTypeService';
import { CREATE_SHIPPING_HOLDS } from '../../../../../axios/services/live-aquaria-services/shipping-services/ShippingMethods';
import {
	CreateGeneralViewTypes,
	ItemCategory,
	MappedCategoryTypes,
	SubOptionsTypes
} from '../../../laq-master-data/product-list/product-list-types/ProductListTypes';
import {
	Category,
	CategoryType,
	ModifiedCategoryData
} from '../../../laq-master-data/category-nanagement/category-nanagement-types/CategoryManagementTypes';
import { getAllCategoryManagementWithOutPagination } from '../../../../../axios/services/live-aquaria-services/master-data-services/MasterDataServices';

interface ErrorResponse {
	response?: {
		data?: {
			message?: string;
		};
	};
}
interface Props {
	toggleModal: () => void;
	isOpen: boolean;
	clickedRowData: ShippingHoldsModifiedData;
	fetchAllShippingDelayDetails: () => void;
	isMode: string;
}

function NewShippingScheduleModal({
	isOpen,
	toggleModal,
	clickedRowData,
	fetchAllShippingDelayDetails,
	isMode
}: Props) {
	const { t } = useTranslation('ShippingDelays');
	const [isDataLoading, setDataLoading] = useState(false);
	const today = new Date().toISOString().split('T')[0];
	const [shippingStateData, setShippingStateData] = useState<ShippingScheduleTypeDrp[]>([]);

	// Category
	const [isCategory, setIsCategory] = useState<MappedCategoryTypes[]>([]);
	const [subCategory, setSubCategory] = useState<SubOptionsTypes[]>([]);
	const [parentCategory1, setParentCategory1] = useState<ModifiedCategoryData[]>([]);
	const [parentCategory2, setParentCategory2] = useState<ModifiedCategoryData[]>([]);
	const [parentCategory3, setParentCategory3] = useState<ModifiedCategoryData[]>([]);
	const [parentCategory4, setParentCategory4] = useState<ModifiedCategoryData[]>([]);
	const [parentCategory5, setParentCategory5] = useState<ModifiedCategoryData[]>([]);
	const [allData, setAllData] = useState<Category[]>([]);
	const [initialValues, setAllInitialValues] = useState<CreateGeneralViewTypes>({});

	const schema = yup.object().shape({
		startDate: yup.string().required('Start Date is required'),
		endDate: yup.string().required('End Date is required')
	});

	useEffect(() => {
		getAllState();
	}, []);

	const getAllState = async () => {
		try {
			const response: AxiosResponse<ShippingStateApiResponse> = await axios.get(
				`${CREATE_SHIPPING_STATES}?paginate=false`
			);
			const transformedData: ShippingScheduleTypeDrp[] = response?.data?.data?.map(
				(item: ShippingStateResponse) => ({
					label: item?.name,
					value: item?.id
				})
			);
			setShippingStateData(transformedData);
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

	useEffect(() => {
		if (isMode === 'view' || isMode === 'edit') {
			fetchDataProductId();
		}
	}, []);

	const fetchDataProductId = () => {
		let initialData = {
			parentCategory1: '',
			parentCategory2: '',
			parentCategory3: '',
			parentCategory4: '',
			parentCategory5: ''
		};

		if (clickedRowData.item_category === null) {
			initialData = {
				parentCategory1: '',
				parentCategory2: '',
				parentCategory3: '',
				parentCategory4: '',
				parentCategory5: ''
			};
		} else {
			let parentCategoryDepth: number = 0;
			let currentCategory: ItemCategory = clickedRowData.item_category;

			while (currentCategory?.parent_item_category !== null) {
				parentCategoryDepth += 1;
				currentCategory = currentCategory.parent_item_category;
			}

			switch (parentCategoryDepth) {
				case 0:
					initialData = {
						parentCategory1: clickedRowData.item_category.id,
						parentCategory2: '',
						parentCategory3: '',
						parentCategory4: '',
						parentCategory5: ''
					};
					break;
				case 1:
					initialData = {
						parentCategory1: clickedRowData.item_category.parent_item_category.id,
						parentCategory2: clickedRowData.item_category.id,
						parentCategory3: '',
						parentCategory4: '',
						parentCategory5: ''
					};
					break;
				case 2:
					initialData = {
						parentCategory1: clickedRowData.item_category.parent_item_category.parent_item_category.id,
						parentCategory2: clickedRowData.item_category.parent_item_category.id,
						parentCategory3: clickedRowData.item_category.id,
						parentCategory4: '',
						parentCategory5: ''
					};
					break;
				case 3:
					initialData = {
						parentCategory1:
							clickedRowData.item_category.parent_item_category.parent_item_category.parent_item_category
								.id,
						parentCategory2: clickedRowData.item_category.parent_item_category.parent_item_category.id,
						parentCategory3: clickedRowData.item_category.parent_item_category.id,
						parentCategory4: clickedRowData.item_category.id,
						parentCategory5: ''
					};
					break;
				case 4:
					initialData = {
						parentCategory1:
							clickedRowData.item_category.parent_item_category.parent_item_category.parent_item_category
								.parent_item_category.id,
						parentCategory2:
							clickedRowData.item_category.parent_item_category.parent_item_category.parent_item_category
								.id,
						parentCategory3: clickedRowData.item_category.parent_item_category.parent_item_category.id,
						parentCategory4: clickedRowData.item_category.parent_item_category.id,
						parentCategory5: clickedRowData.item_category.id
					};
					break;
				default:
					initialData = {
						parentCategory1: '',
						parentCategory2: '',
						parentCategory3: '',
						parentCategory4: '',
						parentCategory5: ''
					};
					break;
			}
		}

		setAllInitialValues(initialData);
	};

	useEffect(() => {
		getAllParentCategory();
	}, [initialValues]);
	const getAllParentCategory = async () => {
		try {
			const response: CategoryType = await getAllCategoryManagementWithOutPagination();
			const data1: Category[] = response.data;
			setAllData(data1);
			setParentCategory1(
				data1.map((item) => ({
					value: item.id,
					label: item.name
				}))
			);
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

	useEffect(() => {
		if (parentCategory1.length > 0) {
			// Automatically load subcategories based on initial values
			loadSubCategories(
				initialValues.parentCategory1,
				setParentCategory2,
				() => {},
				() => {},
				() => {}
			);
			loadSubCategories(
				initialValues.parentCategory2,
				setParentCategory3,
				() => {},
				() => {},
				() => {}
			);
			loadSubCategories(
				initialValues.parentCategory3,
				setParentCategory4,
				() => {},
				() => {},
				() => {}
			);
			loadSubCategories(
				initialValues.parentCategory4,
				setParentCategory5,
				() => {},
				() => {},
				() => {}
			);
		}
	}, [parentCategory1]);

	useEffect(() => {
		if (isCategory.length > 0 && initialValues.category) {
			const selectedCategory = isCategory.find((code) => code.value === initialValues.category);

			if (selectedCategory && selectedCategory.subCategory) {
				const subOptions: SubOptionsTypes[] = selectedCategory.subCategory.map((sub) => ({
					value: sub.id,
					label: sub.name
				}));
				setSubCategory(subOptions);
			} else {
				setSubCategory([]);
			}
		}
	}, [isCategory, initialValues.category]);

	type LoadSubCategoriesType = (
		id: string,
		setCategory: React.Dispatch<React.SetStateAction<{ value: string; label: string }[]>>,
		setClearCategory3: React.Dispatch<React.SetStateAction<string>> | null,
		setClearCategory4: React.Dispatch<React.SetStateAction<string>> | null,
		setClearCategory5: React.Dispatch<React.SetStateAction<string>> | null
	) => void;

	const createSetFieldValue = (field: string, setFieldValue: (field: string, value: string) => void) => {
		return (value: string) => setFieldValue(field, value);
	};

	const loadSubCategories: LoadSubCategoriesType = (
		id,
		setCategory,
		setClearCategory3,
		setClearCategory4,
		setClearCategory5
	) => {
		if (!id || !allData || !allData.length) return;

		const findCategoryById = (categories: Category[], id: string): Category | null => {
			// eslint-disable-next-line no-restricted-syntax
			for (const category of categories) {
				if (category.id === id) {
					return category;
				}

				if (category.sub_item_categories && category.sub_item_categories.length) {
					const result = findCategoryById(category.sub_item_categories, id);

					if (result) return result;
				}
			}
			return null;
		};

		const parentCategory: Category = findCategoryById(allData, id);

		if (parentCategory) {
			if (parentCategory.sub_item_categories && parentCategory.sub_item_categories.length > 0) {
				setCategory(
					parentCategory.sub_item_categories.map((sub) => ({
						value: sub.id,
						label: sub.name
					}))
				);

				if (setClearCategory3) setClearCategory3('');

				if (setClearCategory4) setClearCategory4('');

				if (setClearCategory5) setClearCategory5('');
			} else {
				setCategory([]);

				if (setClearCategory3) setClearCategory3('');

				if (setClearCategory4) setClearCategory4('');

				if (setClearCategory5) setClearCategory5('');
			}
		} else {
			setCategory([]);

			if (setClearCategory3) setClearCategory3('');

			if (setClearCategory4) setClearCategory4('');

			if (setClearCategory5) setClearCategory5('');
		}
	};

	const formatTime = (time: string | null) => {
		return time ? time.replace(/(\d{2}):(\d{2}):([APM]+)/, '$1:$2 $3') : null;
	};

	const createShippingHold = async (values: ShippingHoldsSubmitType) => {
		let parentId: string;

		if (values?.parentCategory5) {
			parentId = values?.parentCategory5;
		} else if (values?.parentCategory4) {
			parentId = values?.parentCategory4;
		} else if (values?.parentCategory3) {
			parentId = values?.parentCategory3;
		} else if (values?.parentCategory2) {
			parentId = values?.parentCategory2;
		} else {
			parentId = values?.parentCategory1;
		}

		const formattedStartTime: string | null = formatTime(values?.startTime);
		const formattedEndTime: string | null = formatTime(values?.endTime);

		const data = {
			start_date: values?.startDate ?? null,
			start_time: formattedStartTime,
			end_date: values?.endDate ?? null,
			end_time: formattedEndTime,
			state_id: values?.appliedState ?? null,
			item_category_id: parentId ?? null,
			reason: values?.reason ?? null,
			is_inform_customers: values?.informCustomers ?? null,
			is_active: clickedRowData?.is_active ? clickedRowData?.is_active : 1
		};

		if (isMode === 'edit') {
			const id = clickedRowData?.id ?? null;
			try {
				setDataLoading(true);
				await axios.put(`${CREATE_SHIPPING_HOLDS}/${id}`, data);
				fetchAllShippingDelayDetails();
				toast.success('Updated successfully');
				setDataLoading(false);
				toggleModal();
			} catch (error) {
				setDataLoading(false);
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
				setDataLoading(true);
				await axios.post(`${CREATE_SHIPPING_HOLDS}`, data);
				fetchAllShippingDelayDetails();
				toast.success('Created successfully');
				setDataLoading(false);
				toggleModal();
			} catch (error) {
				setDataLoading(false);
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

	const status = [
		{ value: '1', label: 'Current' },
		{ value: '2', label: 'Future' },
		{ value: '3', label: 'Expired' }
	];

	const handleClearForm = (resetForm: FormikHelpers<ShippingHoldsSubmitType>['resetForm']) => {
		resetForm({
			values: {
				startDate: '',
				startTime: '',
				endDate: '',
				endTime: '',
				appliedState: '',
				appliedCategory: '',
				informCustomers: false,
				reason: '',
				status: '',
				parentCategory1: '',
				parentCategory2: '',
				parentCategory3: '',
				parentCategory4: '',
				parentCategory5: ''
			}
		});
	};

	const getStatusValue = (status: string) => {
		switch (status) {
			case 'expired':
				return '3';
			case 'current':
				return '1';
			case 'future':
				return '2';
			default:
				return '';
		}
	};

	const defaultValues = {
		parentCategory1: initialValues.parentCategory1 || '',
		parentCategory2: initialValues.parentCategory2 || '',
		parentCategory3: initialValues.parentCategory3 || '',
		parentCategory4: initialValues.parentCategory4 || '',
		parentCategory5: initialValues.parentCategory5 || ''
	};

	return (
		<Dialog
			fullWidth
			open={isOpen}
			maxWidth="lg"
			onClose={toggleModal}
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
					{(() => {
						switch (isMode) {
							case 'view':
								return t('View');
							case 'edit':
								return t('Edit');
							default:
								return t('New');
						}
					})()}{' '}
					Shipping Holds
				</h6>
			</DialogTitle>
			<DialogContent>
				<Formik
					initialValues={{
						startDate: clickedRowData?.start_date || '',
						startTime: clickedRowData?.startTime || '',
						endDate: clickedRowData?.end_date || '',
						endTime: clickedRowData?.endTime || '',
						appliedState: clickedRowData?.state?.id || '',
						appliedCategory: clickedRowData?.item_category?.id || '',
						informCustomers: clickedRowData?.informCustomers || false,
						reason: clickedRowData?.reason || '',
						status: getStatusValue(clickedRowData?.status),
						...defaultValues
					}}
					onSubmit={createShippingHold}
					validationSchema={schema}
					enableReinitialize
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
									lg={3}
									md={4}
									sm={6}
									xs={12}
									className="formikFormField pt-[5px!important]"
								>
									<Typography className="formTypography">
										{t('START_DATE')}
										<span className="text-red-500">*</span>
									</Typography>
									<TextFormDateField
										disabled={isMode === 'view'}
										name="startDate"
										type="date"
										placeholder=""
										id="startDate"
										min={today}
										max=""
										disablePastDate={false}
										changeInput={(value: string, form: FormikHelpers<ShippingHoldsSubmitType>) => {
											if (value) {
												const status = today === value ? '1' : '2';
												form.setFieldValue('status', status);
											} else {
												form.setFieldValue('status', '');
											}

											form.setFieldValue('startDate', value);
										}}
									/>
								</Grid>
								<Grid
									item
									lg={3}
									md={4}
									sm={6}
									xs={12}
									className="customField pt-[5px!important]"
								>
									<Typography className="formTypography">{t('START_TIME')}</Typography>
									<Field
										disabled={isMode === 'view'}
										name="startTime"
										component={ResponsiveTimePickers}
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
										{t('END_DATE')}
										<span className="text-red"> *</span>
									</Typography>
									<TextFormDateField
										disabled={isMode === 'view'}
										name="endDate"
										type="date"
										placeholder=""
										id="endDate"
										min={values.startDate ? values.startDate : today}
										max=""
										disablePastDate={false}
										changeInput={(value: string, form: FormikHelpers<ShippingHoldsSubmitType>) => {
											form.setFieldValue('endDate', value);
										}}
									/>
								</Grid>
								<Grid
									item
									lg={3}
									md={4}
									sm={6}
									xs={12}
									className="customField pt-[5px!important]"
								>
									<Typography className="formTypography">{t('END_TIME')}</Typography>
									<Field
										disabled={isMode === 'view'}
										name="endTime"
										component={ResponsiveTimePickers}
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
									<Typography className="formTypography">{t('APPLIED_STATE')}</Typography>
									<FormDropdown
										name="appliedState"
										id="appliedState"
										placeholder=""
										optionsValues={shippingStateData}
										disabled={isMode === 'view'}
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
									<Typography className="formTypography">Parent Category</Typography>
									<FormDropdown
										name="parentCategory1"
										id="parentCategory1"
										placeholder=""
										value={values.parentCategory1}
										optionsValues={parentCategory1}
										disabled={isMode === 'view'}
										onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
											const { value } = e.target;
											setFieldValue('parentCategory1', value);
											setFieldValue('parentCategory2', '');
											setFieldValue('parentCategory3', '');
											setFieldValue('parentCategory4', '');
											setFieldValue('parentCategory5', '');
											setParentCategory2([]);
											setParentCategory3([]);
											setParentCategory4([]);
											setParentCategory5([]);
											loadSubCategories(
												value,
												setParentCategory2,
												createSetFieldValue('parentCategory3', setFieldValue),
												createSetFieldValue('parentCategory4', setFieldValue),
												createSetFieldValue('parentCategory5', setFieldValue)
											);
										}}
									/>
								</Grid>

								{/* Parent Category 2 */}
								{parentCategory2.length > 0 && (
									<Grid
										item
										lg={3}
										md={4}
										sm={6}
										xs={12}
										className="formikFormField pt-[5px!important]"
									>
										<Typography>Category Level 1</Typography>
										<FormDropdown
											id="parentCategory2"
											name="parentCategory2"
											disabled={isMode === 'view'}
											value={values.parentCategory2}
											optionsValues={parentCategory2}
											onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
												const { value } = e.target;
												setFieldValue('parentCategory2', value);
												setFieldValue('parentCategory3', '');
												setFieldValue('parentCategory4', '');
												setFieldValue('parentCategory5', '');
												setParentCategory3([]);
												setParentCategory4([]);
												setParentCategory5([]);

												if (value) {
													loadSubCategories(
														value,
														setParentCategory3,
														createSetFieldValue('parentCategory4', setFieldValue),
														createSetFieldValue('parentCategory3', setFieldValue),
														createSetFieldValue('parentCategory5', setFieldValue)
													);
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
										lg={3}
										md={4}
										sm={6}
										xs={12}
										className="formikFormField pt-[5px!important]"
									>
										<Typography>Category Level 2</Typography>
										<FormDropdown
											id="parentCategory3"
											name="parentCategory3"
											disabled={isMode === 'view'}
											value={values.parentCategory3}
											optionsValues={parentCategory3}
											onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
												const { value } = e.target;
												setFieldValue('parentCategory3', value);
												setFieldValue('parentCategory4', '');
												setParentCategory4([]);

												if (value) {
													loadSubCategories(
														value,
														setParentCategory4,
														createSetFieldValue('parentCategory4', setFieldValue),
														null,
														null
													);
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
										lg={3}
										md={4}
										sm={6}
										xs={12}
										className="formikFormField pt-[5px!important]"
									>
										<Typography>Category Level 3</Typography>
										<FormDropdown
											id="parentCategory4"
											name="parentCategory4"
											disabled={isMode === 'view'}
											value={values.parentCategory4}
											optionsValues={parentCategory4}
											onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
												const { value } = e.target;
												setFieldValue('parentCategory4', value);
												setFieldValue('parentCategory5', ''); // Clear next dropdown
												setParentCategory5([]); // Clear previous sub-category state

												if (value) {
													loadSubCategories(
														value,
														setParentCategory5, // Load subcategories for `parentCategory5`
														null, // No further categories to clear
														null,
														null
													);
												}
											}}
										/>
									</Grid>
								)}

								{/* Parent Category 5 */}
								{parentCategory5.length > 0 && (
									<Grid
										item
										lg={3}
										md={4}
										sm={6}
										xs={12}
										className="formikFormField pt-[5px!important]"
									>
										<Typography>Category Level 4</Typography>
										<FormDropdown
											id="parentCategory5"
											name="parentCategory5"
											disabled={isMode === 'view'}
											value={values.parentCategory5}
											optionsValues={parentCategory5}
											onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
												const { value } = e.target;
												setFieldValue('parentCategory5', value);
											}}
										/>
									</Grid>
								)}

								<Grid
									item
									lg={3}
									md={4}
									sm={6}
									xs={12}
									className="formikFormField flex items-end pt-[5px!important]"
								>
									<FormControlLabel
										control={
											<Checkbox
												disabled={isMode === 'view'}
												checked={values.informCustomers}
												onChange={(event) =>
													setFieldValue('informCustomers', event.target.checked)
												}
												color="primary"
											/>
										}
										label={t('Inform Customers')}
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
									<Typography className="formTypography">{t('STATUS')}</Typography>
									<FormDropdown
										optionsValues={status}
										name="status"
										id="status"
										placeholder=""
										disabled
									/>
								</Grid>
								<Grid
									item
									xs={12}
									className="formikFormField pt-[5px!important]"
								>
									<Typography>{t('REASON')}</Typography>
									<Field
										name="reason"
										component={TextFormField}
										fullWidth
										multiline
										rows={3}
										size="small"
										placeholder={t('')}
										disabled={isMode === 'view'}
									/>
								</Grid>

								<Grid
									item
									xs={12}
									sm={12}
									md={12}
									className="flex flex-wrap justify-end items-end gap-[10px] pt-[10px!important]"
								>
									{isMode === 'view' ? null : (
										<Button
											className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
											type="submit"
											variant="contained"
											size="medium"
											disabled={false}
										>
											{isMode === 'edit' ? 'Update' : 'Save'}
											{isDataLoading ? (
												<CircularProgress
													className="text-white ml-[5px]"
													size={24}
												/>
											) : null}
										</Button>
									)}

									{isMode === 'view' ? null : (
										<Button
											className="flex justify-center items-center min-w-[80px] sm:min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
											type="button"
											variant="contained"
											size="medium"
											disabled={isMode === 'view'}
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
			</DialogContent>
		</Dialog>
	);
}

export default NewShippingScheduleModal;
