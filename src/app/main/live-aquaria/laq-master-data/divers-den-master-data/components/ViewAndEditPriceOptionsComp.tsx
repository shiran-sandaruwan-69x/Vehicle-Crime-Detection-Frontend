import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';
import { Button, CircularProgress, Grid } from '@mui/material';
import * as yup from 'yup';
import { Field, Form, Formik, FormikHelpers, FormikProps } from 'formik';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { toast } from 'react-toastify';
import TextFormField from '../../../../../common/FormComponents/FormTextField';
import CustomFormTextField from '../../../../../common/FormComponents/CustomFormTextField';
import {
	OneProductDiversDenMasterType,
	PriceOptionSubmitFormTypes,
	ProductDiversDenMaster,
	ProductDiversDenMasterModifyData
} from '../drivers-den-types/DriversDenTypes';
import {
	getDriversDenMasterData,
	updateDriversDenMasterData
} from '../../../../../axios/services/live-aquaria-services/master-data-services/MasterDataServices';

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

function ViewAndEditPriceOptionsComp({ clickedRowData, isTableMode, fetchAllProductList, toggleModal }: Props) {
	const { t } = useTranslation('diversDenMasterData');
	const [isLoading, setIsLoading] = useState(false);
	const [isProductSubmitDataLoading, setProductSubmitDataLoading] = useState(false);
	const [isPriceOption, setPriceOption] = useState<ProductDiversDenMaster>({});

	const schema = yup.object().shape({
		displayPrice: yup.number()
			.typeError('Selling Price must be a number')
			.positive('Selling Price must be a positive number')
			.required(t('Selling Price is required')),
		displayApplicable: yup.number()
			.typeError('Discount Applicable must be a number')
			.min(0, 'Discount Applicable must be at least 0')
			.max(100, 'Discount Applicable cannot be more than 100')
	});

	useEffect(() => {
		fetchDataProductId();
	}, []);

	const fetchDataProductId = async () => {
		setIsLoading(true);
		try {
			const productId = clickedRowData.id ? clickedRowData.id : '';
			const response: OneProductDiversDenMasterType = await getDriversDenMasterData(productId);
			setPriceOption(response.data);
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

	const handleClearForm = (resetForm: FormikHelpers<PriceOptionSubmitFormTypes>['resetForm']) => {
		resetForm({
			values: {
				displayPrice: '',
				displayApplicable: '',
				discountPrice: '',
				isDiscounted: false,
				newPrice: ''
			}
		});
	};

	const changeDisplayApplicable = async (value, form: FormikProps<PriceOptionSubmitFormTypes>) => {
		form.setFieldValue('displayApplicable', value);
		const displayPrice = parseFloat(form.values.displayPrice);

		if (Number.isNaN(displayPrice)) {
			form.setFieldValue('discountPrice', 0);
			form.setFieldValue('newPrice', 0);
			return;
		}

		const discountPrice = (displayPrice * value) / 100;
		const newPrice = displayPrice - discountPrice;
		form.setFieldValue('discountPrice', discountPrice.toFixed(2));
		form.setFieldValue('newPrice', newPrice.toFixed(2));
	};

	const changeDisplayPrice = async (value, form: FormikProps<PriceOptionSubmitFormTypes>) => {
		form.setFieldValue('displayPrice', value);
		const displayApplicable = parseFloat(form.values.displayApplicable);

		if (Number.isNaN(displayApplicable)) {
			form.setFieldValue('discountPrice', 0);
			form.setFieldValue('newPrice', value);
			return;
		}

		const discountPrice = (value * displayApplicable) / 100;
		const newPrice = value - discountPrice;
		form.setFieldValue('discountPrice', discountPrice.toFixed(2));
		form.setFieldValue('newPrice', newPrice.toFixed(2));
	};

	const onSubmit = async (values: PriceOptionSubmitFormTypes) => {
		setProductSubmitDataLoading(true);
		const data = {
			selection_types: [
				{
					master_data_id: isPriceOption?.item_selection?.[0]?.selection_types?.[0]?.master_data?.id ?? null,
					display_price: values.newPrice,
					discount_rate: values.displayApplicable,
					discount_price: values.discountPrice,
					selling_price: values.displayPrice
				}
			]
		};
		const id: string = clickedRowData.id ? clickedRowData.id : '';

		try {
			const response = await updateDriversDenMasterData(data, id);
			setProductSubmitDataLoading(false);
			fetchDataProductId();
			fetchAllProductList();
			toast.success('Updated successfully');
		} catch (error: any) {
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
			<Formik
				enableReinitialize
				initialValues={{
					sellingPrice:
						isPriceOption?.item_selection?.[0]?.selection_types?.[0]?.master_data?.regular_price || '',
					displayPrice: isPriceOption?.item_selection?.[0]?.selection_types?.[0]?.selling_price || '',
					displayApplicable: isPriceOption?.item_selection?.[0]?.selection_types?.[0]?.discount_rate || '',
					discountPrice: isPriceOption?.item_selection?.[0]?.selection_types?.[0]?.discount_price || '',
					isDiscounted: isPriceOption?.item_selection?.[0]?.selection_types?.[0]?.discount_rate !== null,
					newPrice: isPriceOption?.item_selection?.[0]?.selection_types?.[0]?.display_price || ''
				}}
				validationSchema={schema}
				onSubmit={onSubmit}
			>
				{({ values, setFieldValue, isValid, resetForm, touched, errors }) => (
					<Form>
						<Grid
							container
							spacing={2}
							className="pt-0"
						>
							<Grid
								item
								lg={3}
								md={4}
								sm={6}
								xs={12}
								className="formikFormField pt-[5px!important]"
							>
								<Typography className="formTypography">{t('Regular Price')}</Typography>
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
								lg={3}
								md={4}
								sm={6}
								xs={12}
								className="formikFormField pt-[5px!important]"
							>
								<Typography className="formTypography">
									{t('Selling Price')}
									<span className="text-red"> *</span>
								</Typography>
								<CustomFormTextField
									name="displayPrice"
									id="displayPrice"
									type="number"
									placeholder=""
									disabled={isTableMode === 'view'}
									changeInput={changeDisplayPrice}
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
								<Typography className="formTypography">{t('DISPLAY_APPLICABLE')}</Typography>
								<div className="flex items-center">
									<CustomFormTextField
										name="displayApplicable"
										id="displayApplicable"
										type="number"
										placeholder=""
										disabled={isTableMode === 'view' || values.isDiscounted === false}
										changeInput={changeDisplayApplicable}
										style={{ marginRight: '1px', flexGrow: 1 }}
									/>
									<FormControlLabel
										className="ml-[1px]"
										control={
											<Checkbox
												disabled={isTableMode === 'view'}
												name="isDiscounted"
												checked={values.isDiscounted}
												onChange={(e) => {
													setFieldValue('isDiscounted', e.target.checked);

													if (e.target.checked !== true) {
														setFieldValue('displayApplicable', 0);
														setFieldValue('discountPrice', 0);
														setFieldValue('newPrice', values.displayPrice);
													}
												}}
											/>
										}
										label={t('%')}
									/>
								</div>
							</Grid>
							<Grid
								item
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
								lg={3}
								md={4}
								sm={6}
								xs={12}
								className="formikFormField pt-[5px!important]"
							>
								<Typography className="formTypography">{t('Display Price')}</Typography>
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

							<Grid
								item
								md={12}
								sm={12}
								xs={12}
								className="flex flex-wrap justify-end items-center gap-[10px] pt-[10px!important]"
							>
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
								{isTableMode === 'view' ? null : (
									<Button
										className="flex justify-center items-center min-w-[80px] sm:min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
										type="submit"
										variant="contained"
										size="medium"
										disabled={isTableMode === 'view'}
									>
										Update
										{isProductSubmitDataLoading ? (
											<CircularProgress
												className="text-white ml-[5px]"
												size={24}
											/>
										) : null}
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

export default ViewAndEditPriceOptionsComp;
