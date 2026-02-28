import { CircularProgress, Grid } from '@mui/material';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import React, { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import Button from '@mui/material/Button';
import { toast } from 'react-toastify';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import FormControl from '@mui/material/FormControl';
import { updateDiversAdvertisementsData } from '../../../../../axios/services/live-aquaria-services/divers-advertisements-services/DiversAdvertisementsService';
import FormikMultipleSelectChip from '../../../../../common/FormComponents/FormikMultipleSelectChip';
import TextFormField from '../../../../../common/FormComponents/FormTextField';

import {
	CreateGeneralViewResetFormTypes,
	ProductDiversDenMaster
} from '../../../laq-master-data/divers-den-master-data/drivers-den-types/DriversDenTypes';
import { CreateGeneralViewTypes } from '../../../laq-master-data/product-list/product-list-types/ProductListTypes';
import {
	GeneralViewSubmitDiversDenAdvertisementsType,
	onNextGeneralViewTypes
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
	initialValues: CreateGeneralViewTypes;
	generalViewValues: ProductDiversDenMaster;
	getAllDriversDenAdvertisements: () => void;
	onNextQuickStats: (data: onNextGeneralViewTypes) => void;
	isGeneralViewSubmitData: onNextGeneralViewTypes;
	getRowDriverDenAdvertisements: () => void;
	isId: string;
}

function GeneralView({
	isTableMode,
	initialValues,
	generalViewValues,
	getAllDriversDenAdvertisements,
	onNextQuickStats,
	isGeneralViewSubmitData,
	getRowDriverDenAdvertisements,
	isId
}: Props) {
	const { t } = useTranslation('diversDenAdvertisements');
	const [isProductSubmitDataLoading, setProductSubmitDataLoading] = useState(false);

	const schema = yup.object().shape({
		title: yup.string().required('Title is required'),
		short_description: yup.string().required('Short Description is required'),
		long_description: yup.string().required('Long Description is required'),
		isSoldWaterOrFresh: yup.string().required(t('Product type is required'))
	});

	const [isLoading, setIsLoading] = useState(false);
	// const [initialValues, setInitialValues] = useState({
	//     category: '9d17ab9e-59d5-4231-8bce-231b74b11a93',
	//     subCategory: '9d1977f8-4c24-4128-9d05-1d1dffe225ba',
	// });

	const handleClearForm = (resetForm: FormikHelpers<CreateGeneralViewResetFormTypes>['resetForm']) => {
		resetForm({
			values: {
				title: '',
				short_description: '',
				long_description: '',
				product_tag_keywords: [],
				meta_description: '',
				additional_information: '',
				isSoldWaterOrFresh: ''
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

	const onSubmit = async (values: GeneralViewSubmitDiversDenAdvertisementsType) => {
		if (generalViewValues.id === undefined) {
			toast.error('Divers Den Master Data Code is required');
		} else if (isTableMode === 'edit') {
			setProductSubmitDataLoading(true);
			const id = isId ?? null;
			const data = {
				title: values.title ?? null,
				display_name: values.displayName ?? null,
				short_description: values.short_description ?? null,
				long_description: values.long_description ?? null,
				meta_keywords: values.product_tag_keywords.join(', ') ?? null,
				meta_description: values.meta_description ?? null,
				additional_information: values.additional_information ?? null,
				aquatic_type: values.isSoldWaterOrFresh === 'YES' ? 'fresh' : 'salt'
			};

			try {
				const response = await updateDiversAdvertisementsData(data, id);
				setProductSubmitDataLoading(false);
				getRowDriverDenAdvertisements();
				toast.success('Updated Successfully');
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
			const id = generalViewValues.id ?? null;
			const data: onNextGeneralViewTypes = {
				type: '1',
				parent_id: id ?? null,
				title: values.title ?? null,
				display_name: values.displayName ?? null,
				short_description: values.short_description ?? null,
				long_description: values.long_description ?? null,
				meta_keywords:
					values?.product_tag_keywords?.length === 0
						? null
						: values?.product_tag_keywords?.join(', ') ?? null,
				meta_description: values.meta_description ?? null,
				additional_information: values.additional_information ?? null,
				aquatic_type: values.isSoldWaterOrFresh
				// is_advertisement: 1
			};
			onNextQuickStats(data);
		}
	};

	return (
		<div className="min-w-full max-w-[100vw]">
			<Paper className="p-[16px] mt-[-5px] rounded-[4px]">
				<Formik
					enableReinitialize
					initialValues={{
						product_name: initialValues?.product_name || '',
						title: isGeneralViewSubmitData.title || '',
						scientific_name: initialValues?.scientific_name || '',
						category: initialValues?.category || '',
						subCategory: initialValues?.subCategory || '',
						isSoldWaterOrFresh: isGeneralViewSubmitData?.aquatic_type || '',
						short_description: isGeneralViewSubmitData.short_description || '',
						meta_description: isGeneralViewSubmitData.meta_description || '',
						long_description: isGeneralViewSubmitData.long_description || '',
						additional_information: isGeneralViewSubmitData.additional_information || '',
						product_tag_keywords: isGeneralViewSubmitData?.meta_keywords?.split(', ') || [],
						displayName: isGeneralViewSubmitData?.display_name || ''
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
									xl={3}
									lg={4}
									md={4}
									sm={6}
									xs={12}
									className="formikFormField pt-[5px!important]"
								>
									<Typography className="formTypography">{t('PRODUCT_NAME')}</Typography>
									<Field
										name="product_name"
										placeholder=""
										component={TextFormField}
										fullWidth
										disabled
										size="small"
									/>
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
									<Typography className="formTypography">{t('SCIENTIFIC_NAME')}</Typography>
									<Field
										name="scientific_name"
										placeholder=""
										component={TextFormField}
										disabled
										fullWidth
										size="small"
									/>
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
									<Typography className="formTypography">{t('CATEGORY')}</Typography>
									<Field
										name="category"
										placeholder=""
										component={TextFormField}
										disabled
										fullWidth
										size="small"
									/>
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
									xl={3}
									lg={4}
									md={4}
									sm={6}
									xs={12}
									className="formikFormField pt-[5px!important]"
								>
									<Typography className="formTypography">
										{t('Display Name')}
									</Typography>
									<Field
										name="displayName"
										placeholder=""
										component={TextFormField}
										fullWidth
										disabled={isTableMode === 'view'}
										size="small"
									/>
								</Grid>


								<Grid
									item
									xl={8}
									lg={8}
									md={8}
									sm={6}
									xs={12}
									className="formikFormField pt-[5px!important]"
								>
									<Typography className="formTypography">
										{t('Product Type')}
										<span className="text-red"> *</span>
									</Typography>
									<FormControl
										className="w-full min-w-full"
										error={Boolean(touched.isSoldWaterOrFresh && errors.isSoldWaterOrFresh)}
									>
										<RadioGroup
											row
											aria-labelledby="demo-row-radio-buttons-group-label"
											name="isSoldWaterOrFresh"
											value={values.isSoldWaterOrFresh}
											onChange={(event: ChangeEvent<HTMLInputElement>) =>
												setFieldValue('isSoldWaterOrFresh', event.target.value)
											}
										>
											<FormControlLabel
												disabled={isTableMode === 'view'}
												className="text-[12px] sm:text-[14px]"
												value="YES"
												control={<Radio className="mr-[-8px]" />}
												label="Freshwater"
											/>
											<FormControlLabel
												disabled={isTableMode === 'view'}
												className="text-[12px] sm:text-[14px]"
												value="NO"
												control={<Radio className="mr-[-8px]" />}
												label="Saltwater"
											/>
										</RadioGroup>
										{touched.isSoldWaterOrFresh && errors.isSoldWaterOrFresh && (
											<Typography
												color="error"
												className="text-sm text-red-500"
											>
												{errors.isSoldWaterOrFresh}
											</Typography>
										)}
									</FormControl>
								</Grid>
							</Grid>
							<Grid
								container
								spacing={2}
								className="mt-0"
							>
								<Grid
									item
									md={6}
									xs={12}
									className="formikFormField pt-[5px!important]"
									key="short_description"
								>
									<Typography className="formTypography">{t('SHORT_DESCRIPTION')}
										<span className="text-red"> *</span>
									</Typography>
									<Field
										disabled={isTableMode === 'view'}
										name="short_description"
										placeholder=""
										component={TextFormField}
										fullWidth
										size="small"
										multiline
									/>
								</Grid>
								<Grid
									item
									md={6}
									xs={12}
									className="formikFormField pt-[5px!important]"
									key="product_tag_keywords"
								>
									<Typography className="formTypography">
										{t('PRODUCT_TAG_KEYWORDS')}{' '}
										<span className="text-[10px] sm:text-[12px] text-gray-600">
											{t('DO_NOT_DUPLICATE_TAGS')}
										</span>
									</Typography>
									<Field
										component={FormikMultipleSelectChip}
										disabled={isTableMode === 'view'}
										name="product_tag_keywords"
										placeholder=""
										fullWidth
										size="small"
									/>
								</Grid>
								<Grid
									item
									md={6}
									xs={12}
									className="formikFormField pt-[5px!important]"
									key="meta_description"
								>
									<Typography className="formTypography">{t('META_DESCRIPTION')}</Typography>
									<Field
										disabled={isTableMode === 'view'}
										name="meta_description"
										placeholder=""
										component={TextFormField}
										fullWidth
										multiline
										rows={2}
									/>
								</Grid>
								<Grid
									item
									md={6}
									xs={12}
									className="formikFormField pt-[5px!important]"
									key="long_description"
								>
									<Typography className="formTypography">{t('ADDITIONAL_INFORMATION')}</Typography>
									<Field
										disabled={isTableMode === 'view'}
										name="additional_information"
										placeholder=""
										component={TextFormField}
										fullWidth
										multiline
										rows={2}
									/>
								</Grid>
								<Grid
									item
									xs={12}
									className="formikFormField"
									key="additional_information"
								>
									<Typography className="formTypography">
										{t('LONG_DESCRIPTION')}
										<span className="text-red"> *</span>
									</Typography>
									<Field
										disabled={isTableMode === 'view'}
										name="long_description"
										placeholder=""
										component={TextFormField}
										fullWidth
										multiline
										rows={6}
									/>
								</Grid>

								<Grid
									item
									md={12}
									sm={12}
									xs={12}
									className="flex justify-end items-center gap-[10px] pt-[10px!important]"
								>
									{isTableMode === 'view' ? null : (
										<Button
											className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
											type="submit"
											variant="contained"
											size="medium"
											disabled={isTableMode === 'view'}
										>
											{isTableMode === 'edit' ? 'Update' : 'Next'}
											{isProductSubmitDataLoading ? (
												<CircularProgress
													className="text-white ml-[5px]"
													size={24}
												/>
											) : null}
										</Button>
									)}
									{isTableMode === 'view' ? null : (
										<Button
											className="resetButton ml-4"
											type="button"
											variant="contained"
											size="medium"
											disabled={isTableMode === 'viewMode'}
											onClick={() => handleClearForm(resetForm)}
										>
											{t('Reset')}
										</Button>
									)}
								</Grid>
							</Grid>
						</Form>
					)}
				</Formik>
			</Paper>
		</div>
	);
}

export default GeneralView;
