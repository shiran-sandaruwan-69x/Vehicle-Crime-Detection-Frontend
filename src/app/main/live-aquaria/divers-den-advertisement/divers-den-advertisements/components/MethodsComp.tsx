import { Button, CircularProgress } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import {
	createDiversAdvertisements,
	updateDiversAdvertisementsData
} from '../../../../../axios/services/live-aquaria-services/divers-advertisements-services/DiversAdvertisementsService';
import { getAllGuaranteeOptionsWithOutPagination } from '../../../../../axios/services/live-aquaria-services/master-data-services/MasterDataServices';
import CommonHeading from '../../../../../common/FormComponents/CommonHeading';
import TextFormField from '../../../../../common/FormComponents/FormTextField';
import {
	GuaranteeOptionsDataType,
	GuaranteeOptionType
} from '../../../laq-master-data/guarantee-options/guarantee-options-types/GuaranteeOptions';
import {
	FormValues,
	GuaranteeOptionsDiversDenAdvertisementsType,
	onNextAndOnBackUploadDataSubmitDataTypes,
	onNextGeneralViewTypes,
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
	isTableMode?: string;
	onBackRelatedProductPrices: (values: FormValues) => void;
	isMethodsInitialData: FormValues;
	isGeneralViewSubmitData: onNextGeneralViewTypes;
	isUploadSubmitData: onNextAndOnBackUploadDataSubmitDataTypes;
	isRelatedInitialData: productOptionsTableDataType;
	getRowDriverDenAdvertisements: () => void;
	handleNavigateMainComp: () => void;
	isId: string;
}

function MethodsComp({
	isTableMode,
	onBackRelatedProductPrices,
	isMethodsInitialData,
	isGeneralViewSubmitData,
	isUploadSubmitData,
	isRelatedInitialData,
	getRowDriverDenAdvertisements,
	isId,
	handleNavigateMainComp
}: Props) {
	const { t } = useTranslation('diversDenAdvertisements');
	const [isDiversDenAdvertisementsDataLoading, setDiversDenAdvertisementsDataLoading] = useState(false);
	const [guaranteeOptionsData, setGuaranteeOptionsData] = useState<GuaranteeOptionsDiversDenAdvertisementsType[]>([]);

	const [initialValues, setInitialValues] = useState<FormValues>(
		isMethodsInitialData || {
			specialMessage: '',
			displayLoyallyRewards: false,
			dealsAndSteals: false,
			adminOnly: false,
			selectedGuaranteeOption: null
		}
	);

	useEffect(() => {
		getAllGuaranteeOptions();
	}, []);

	const getAllGuaranteeOptions = async () => {
		try {
			const response: GuaranteeOptionsDataType = await getAllGuaranteeOptionsWithOutPagination();
			const options = response.data.map((item: GuaranteeOptionType) => ({
				id: item.id,
				guaranteeName: item.name,
				checked: false
			}));

			setGuaranteeOptionsData(options);
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

	const schema = yup.object().shape({});

	const handleSubmit = async (values: FormValues) => {
		setDiversDenAdvertisementsDataLoading(true);

		if (isTableMode === 'edit') {
			const id = isId ?? null;
			const data = {
				guarantee_option_id: values.selectedGuaranteeOption ?? null,
				is_deals_steals: values.dealsAndSteals,
				is_loyalty_rewards: values.displayLoyallyRewards,
				special_message: values.specialMessage,
				is_admin_only: values.adminOnly
			};

			try {
				const response = await updateDiversAdvertisementsData(data, id);
				setDiversDenAdvertisementsDataLoading(false);
				getRowDriverDenAdvertisements();
				toast.success('Updated Successfully');
			} catch (error) {
				setDiversDenAdvertisementsDataLoading(false);
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
			const relatedProducts: string[] =
				isRelatedInitialData?.tableData?.map((item: { id: string }) => item.id) ?? null;
			const data = {
				type: '1',
				title: isGeneralViewSubmitData.title ?? null,
				display_name: isGeneralViewSubmitData.display_name ?? null,
				parent_id: isGeneralViewSubmitData.parent_id ?? null,
				short_description: isGeneralViewSubmitData.short_description ?? null,
				long_description: isGeneralViewSubmitData.long_description ?? null,
				meta_keywords: isGeneralViewSubmitData.meta_keywords ?? null,
				meta_description: isGeneralViewSubmitData.meta_description ?? null,
				aquatic_type: isGeneralViewSubmitData.water_type === 'YES' ? 'fresh' : 'salt',
				additional_information: isGeneralViewSubmitData.additional_information ?? null,
				is_advertisement: '1',
				guarantee_option_id: values.selectedGuaranteeOption ?? null,
				is_deals_steals: values.dealsAndSteals,
				is_loyalty_rewards: values.displayLoyallyRewards,
				is_active: 1,
				is_admin_only: values.adminOnly,
				related_products: relatedProducts ?? null,
				special_message: values.specialMessage,

				video_link: isUploadSubmitData.video_link ?? null,
				images: isUploadSubmitData.images ?? null,
				videos: isUploadSubmitData.videos ?? null
			};
			try {
				const response = await createDiversAdvertisements(data);
				toast.success('Created Successfully');
				setDiversDenAdvertisementsDataLoading(false);
				handleNavigateMainComp();
			} catch (error) {
				setDiversDenAdvertisementsDataLoading(false);
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

	const handleClearForm = (resetForm: FormikHelpers<FormValues>['resetForm']) => {
		resetForm();
	};

	const handleCheckboxChange = (index: number, setFieldValue: FormikHelpers<FormValues>['setFieldValue']) => {
		const updatedOptions = guaranteeOptionsData.map((option, idx) => ({
			...option,
			checked: idx === index ? !option.checked : false
		}));
		setGuaranteeOptionsData(updatedOptions);

		// Toggle selectedGuaranteeOption based on checked status
		const selectedId: string | null = updatedOptions[index].checked ? updatedOptions[index].id : null;
		setFieldValue('selectedGuaranteeOption', selectedId);
	};

	const onBack = (values: FormValues) => {
		onBackRelatedProductPrices(values);
	};

	return (
		<div className="min-w-full max-w-[100vw]">
			<Paper className="rounded-[0px] p-[16px]">
				<Formik
					initialValues={initialValues}
					validationSchema={schema}
					onSubmit={handleSubmit}
					enableReinitialize
				>
					{({ values, setFieldValue }) => (
						<Form>
							<Grid
								container
								spacing={2}
							>
								<Grid
									item
									xs={12}
									className="pt-[10px!important]"
								>
									<CommonHeading title="Guarantee Options" />
								</Grid>
								<Grid
									item
									xs={12}
									className="pt-[5px!important]"
								>
									<Grid
										container
										spacing={2}
									>
										{guaranteeOptionsData.map((option, index) => (
											<Grid
												item
												xl={2}
												lg={3}
												md={4}
												sm={6}
												xs={12}
												key={option.id}
												className="pt-[10px!important]"
											>
												<FormControlLabel
													control={
														<Checkbox
															disabled={isTableMode === 'view'}
															checked={values.selectedGuaranteeOption === option.id}
															onChange={() => handleCheckboxChange(index, setFieldValue)}
															color="primary"
														/>
													}
													label={option.guaranteeName}
												/>
											</Grid>
										))}
									</Grid>
								</Grid>

								{/* Additional Options */}
								<Grid
									item
									xs={12}
									className="pt-[10px!important]"
								>
									{/* Additional Options and Special Message */}
									<CommonHeading title="Additional Options" />
								</Grid>
								<Grid
									item
									xl={2}
									lg={3}
									md={4}
									sm={6}
									xs={12}
									className="pt-[5px!important]"
								>
									<FormControlLabel
										control={
											<Checkbox
												disabled={isTableMode === 'view'}
												checked={values.displayLoyallyRewards}
												onChange={(event) =>
													setFieldValue('displayLoyallyRewards', event.target.checked)
												}
												color="primary"
											/>
										}
										label="Display Loyaly Rewards"
									/>
								</Grid>

								<Grid
									item
									xl={2}
									lg={3}
									md={4}
									sm={6}
									xs={12}
									className="pt-[5px!important]"
								>
									<FormControlLabel
										control={
											<Checkbox
												disabled={isTableMode === 'view'}
												checked={values.dealsAndSteals}
												onChange={(event) =>
													setFieldValue('dealsAndSteals', event.target.checked)
												}
												color="primary"
											/>
										}
										label="Deals & Steals"
									/>
								</Grid>

								<Grid
									item
									xl={2}
									lg={3}
									md={4}
									sm={6}
									xs={12}
									className="pt-[5px!important]"
								>
									<FormControlLabel
										control={
											<Checkbox
												disabled={isTableMode === 'view'}
												checked={values.adminOnly}
												onChange={(event) => setFieldValue('adminOnly', event.target.checked)}
												color="primary"
											/>
										}
										label="Admin Only"
									/>
								</Grid>

								<Grid
									item
									xs={12}
									className="pt-[10px!important]"
								>
									<Typography className="formTypography">{t('SPECIAL_MESSAGE')}</Typography>
									<Field
										disabled={isTableMode === 'view'}
										name="specialMessage"
										placeholder=""
										component={TextFormField}
										fullWidth
										multiline
										rows={3}
									/>
								</Grid>

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
													className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
													type="button"
													variant="contained"
													size="medium"
													disabled={isTableMode === 'view'}
													onClick={() => onBack(values)}
												>
													{t('Back')}
												</Button>
											)}

											<Button
												className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
												type="submit"
												variant="contained"
												size="medium"
												disabled={isTableMode === 'view'}
											>
												{isTableMode === 'edit' ? 'Update' : 'Save'}
												{isDiversDenAdvertisementsDataLoading && (
													<CircularProgress
														className="text-white ml-[5px]"
														size={24}
													/>
												)}
											</Button>
										</>
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

export default MethodsComp;
