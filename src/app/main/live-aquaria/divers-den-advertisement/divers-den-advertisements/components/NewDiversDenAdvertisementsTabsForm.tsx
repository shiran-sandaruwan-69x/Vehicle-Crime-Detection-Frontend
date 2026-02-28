import { CircularProgress } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import {
	getOneDriversDenAdvertisements,
	getSearchDriversDenAdvertisements,
	publishDiversAdvertisements,
	rejectDiversAdvertisements
} from '../../../../../axios/services/live-aquaria-services/divers-advertisements-services/DiversAdvertisementsService';
import CustomTab from '../../../../../common/CustomTab';
import TextFormField from '../../../../../common/FormComponents/FormTextField';
import {
	OneProductDiversDenMasterType,
	ProductDiversDenMaster
} from '../../../laq-master-data/divers-den-master-data/drivers-den-types/DriversDenTypes';
import { CreateGeneralViewTypes } from '../../../laq-master-data/product-list/product-list-types/ProductListTypes';
import {
	imageType,
	MediaModifyResponseData
} from '../../../sample-component/root-component/types/general-advertisement-types';
import {
	DiversDenAdvertisementsModifiedDataResponseType,
	FormValues,
	GetOneDiversDenAdvertisementsResponseType,
	onNextAndOnBackUploadDataSubmitDataTypes,
	onNextAndOnBackUploadDataTypes,
	onNextGeneralViewTypes,
	productOptionsTableDataType
} from '../divers-den-advertisements-types/DriversDenAdvertisementsTypes';
import GeneralView from './GeneralView';
import MethodsComp from './MethodsComp';
import OnApproveComp from './OnApproveComp';
import OnRejectComp from './OnRejectComp';
import QuickStatus from './QuickStatus';
import RelatedComp from './RelatedComp';
import UploadComp from './UploadComp';

function CustomTabPanel({ children, value, index, ...other }) {
	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && <Box sx={{ p: 2 }}>{children}</Box>}
		</div>
	);
}

interface ErrorResponse {
	response?: {
		status?: number;
		data?: {
			message?: string;
		};
	};
}
interface Props {
	isTablePublishMode: string;
	clickedRowData: DiversDenAdvertisementsModifiedDataResponseType;
	isTableMode: string;
	isSearchEnabled: boolean;
	getAllDriversDenAdvertisements: () => void;
	handleNavigateMainComp: () => void;
}

function NewDiversDenAdvertisementsTabsForm({
	isTablePublishMode,
	clickedRowData,
	isTableMode,
	isSearchEnabled,
	getAllDriversDenAdvertisements,
	handleNavigateMainComp
}: Props) {
	const { t } = useTranslation('diversDenAdvertisements');
	const [value, setValue] = React.useState(0);
	const [isETFMasterDataDataLoading, setETFMasterDataDataLoading] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isGeneralViewData, setGeneralViewData] = useState<CreateGeneralViewTypes>({});
	const [isGeneralViewProduct, setGeneralViewProduct] = useState<ProductDiversDenMaster>({});
	const [isGeneralViewSubmitData, setGeneralViewSubmitData] = useState<onNextGeneralViewTypes>({});
	const [isUploadInitialData, setUploadInitialData] = useState<onNextAndOnBackUploadDataTypes>({});
	const [isUploadSubmitData, setUploadSubmitData] = useState<onNextAndOnBackUploadDataSubmitDataTypes>({});
	const [isRelatedInitialData, setRelatedInitialData] = useState<productOptionsTableDataType>({});
	const [isMethodsInitialData, setMethodsInitialData] = useState<FormValues>();
	const [isOneRowData, setOneRowData] = useState<DiversDenAdvertisementsModifiedDataResponseType>();
	const [isId, setIsId] = useState<string>('');
	const [textImgUrl, setTextImgUrl] = useState<string[]>([]);
	const [textVideoUrl, setTextVideoUrl] = useState<string>('');

	const [isOpenRejectModal, setOpenRejectModal] = useState(false);
	const [isOpenReasonModal, setOpenReasonModal] = useState(false);
	const [isDiversDenAdvertisementsPublishDataLoading, setDiversDenAdvertisementsPublishDataLoading] = useState(false);
	const [isDiversDenAdvertisementsRejectDataLoading, setDiversDenAdvertisementsRejectDataLoading] = useState(false);
	const toggleRejectModal = () => setOpenRejectModal(!isOpenRejectModal);
	const toggleReasonModal = () => setOpenReasonModal(!isOpenReasonModal);
	const [isMedia, setIsMedia] = useState<MediaModifyResponseData>({});

	useEffect(() => {
		if (isTableMode === 'edit' || isTableMode === 'view') {
			getRowDriverDenAdvertisements();
		}
	}, []);

	const handleChange = (event, newValue: number) => {
		if (isTableMode === 'edit' || isTableMode === 'view') {
			setValue(newValue);
		}
	};

	const schema = yup.object().shape({
		diversDenId: yup.string().required(t('Divers Den Master Data Code is required'))
	});

	const onSubmit = async (values: { diversDenId: string }) => {
		setIsLoading(true);
		try {
			const productId = values.diversDenId ? values.diversDenId : '';
			const response: OneProductDiversDenMasterType = await getSearchDriversDenAdvertisements(productId);

			const modifyData: CreateGeneralViewTypes = {
				product_name: response?.data?.common_name,
				scientific_name: response?.data?.scientific_name,
				category: response?.data?.item_category?.name,
				subCategory: ''
			};

			setGeneralViewProduct(response.data);
			setGeneralViewData(modifyData);
			setIsLoading(false);
		} catch (error) {
			const isErrorResponse = (error: unknown): error is ErrorResponse => {
				return typeof error === 'object' && error !== null && 'response' in error;
			};

			if (isErrorResponse(error) && error?.response?.status === 404) {
				toast.error('Not Found');
				return;
			}

			if (isErrorResponse(error) && error.response?.data?.message) {
				toast.error(error.response.data.message);
			} else {
				toast.error('Internal server error');
			}
		} finally {
			setIsLoading(false);
		}
	};

	const onNextQuickStats = (data: onNextGeneralViewTypes) => {
		setValue(1);
		setGeneralViewSubmitData(data);
	};

	const onBackGeneralView = () => {
		setValue(0);
	};

	const onBackQuickStats = (data: onNextAndOnBackUploadDataTypes) => {
		setUploadInitialData(data);
		setValue(1);
	};

	const onNextUploadThumbnail = () => {
		setValue(2);
	};

	const onBackUploadThumbnail = (values: productOptionsTableDataType) => {
		setValue(2);
		setRelatedInitialData(values);
	};

	const onNextRelatedProductPrices = (
		data: onNextAndOnBackUploadDataTypes,
		mediaData: onNextAndOnBackUploadDataSubmitDataTypes
	) => {
		setUploadInitialData(data);
		setUploadSubmitData(mediaData);
		setValue(3);
	};

	const onBackRelatedProductPrices = (values: FormValues) => {
		setValue(3);
		setMethodsInitialData(values);
	};

	const onNextMethods = (values: productOptionsTableDataType) => {
		setValue(4);
		setRelatedInitialData(values);
	};

	const getRowDriverDenAdvertisements = async () => {
		const id = clickedRowData.id ?? null;
		setIsLoading(true);
		try {
			const response: GetOneDiversDenAdvertisementsResponseType = await getOneDriversDenAdvertisements(id);

			setIsId(response?.data?.id ?? '');
			const modifyData = {
				id: response.data.parent.id,
				code: response.data.parent.code,
				title: response.data.title,
				common_name: response.data.parent.common_name,
				scientific_name: response.data.parent.scientific_name,
				short_description: response.data.short_description,
				long_description: response.data.long_description,
				meta_keywords: response.data.meta_keywords,
				meta_description: response.data.meta_description,
				additional_information: response.data.additional_information,
				is_active: response.data.is_active,
				item_selection: response.data.parent.item_selection,
				item_attributes: response.data.parent.item_attributes,
				item_category: response.data.parent.item_category
			};

			const generalViewInitialData = {
				product_name: response?.data?.parent.common_name,
				scientific_name: response?.data?.parent.scientific_name,
				category: response?.data?.parent?.item_category?.name,
				subCategory: ''
			};

			const relatedCompData = {
				cisCode: '',
				tableData: response.data.related_product.map((item) => ({
					id: item.id,
					cisCode: item.code,
					title: item.title
				}))
			};

			const methodsInitialData: FormValues = {
				displayLoyallyRewards: response?.data?.is_loyalty_rewards === 1,
				dealsAndSteals: response?.data?.is_deals_steals === 1,
				adminOnly: response?.data?.is_admin_only === 1,
				selectedGuaranteeOption: response?.data.guarantee_options?.[0]?.id,
				specialMessage: response?.data?.special_message
			};

			const generalViewSubmitInitialData = {
				title: response?.data?.title,
				display_name: response?.data?.display_name,
				aquatic_type: response?.data?.aquatic_type === "fresh" ? 'YES' : 'NO',
				short_description: response?.data?.short_description,
				meta_description: response?.data.meta_description,
				long_description: response?.data?.long_description,
				additional_information: response?.data?.additional_information,
				meta_keywords: response?.data?.meta_keywords
			};

			const videoLink: string =
				response?.data?.item_media?.find((item) => item.type === 'video_link')?.link || '';

			const imageDetails: imageType[] = response?.data?.item_media
				?.filter((item) => item.type === 'image')
				.map((item) => ({ id: item.id, link: item.link }));

			const videoDetails: imageType[] = response?.data?.item_media
				?.filter((item) => item.type === 'video')
				.map((item) => ({ id: item.id, link: item.link }));

			const mediaData: MediaModifyResponseData = {
				video_link: videoLink,
				imagesIn: imageDetails,
				videoIn: videoDetails
			};
			setIsMedia(mediaData);

			setGeneralViewSubmitData(generalViewSubmitInitialData);
			setMethodsInitialData(methodsInitialData);
			setRelatedInitialData(relatedCompData);
			setGeneralViewProduct(modifyData);
			setOneRowData(response.data);
			setGeneralViewData(generalViewInitialData);
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

	const onReject = () => {
		toggleRejectModal();
	};

	const onApprove = () => {
		toggleReasonModal();
	};

	const handleAlertForm = async (values: { reason: string }) => {
		toggleRejectModal();

		if (clickedRowData?.id) {
			setDiversDenAdvertisementsRejectDataLoading(true);
			const id = clickedRowData.id ?? null;
			const data = {
				status: '2',
				reject_reason: values.reason ?? null
			};
			try {
				const response = await rejectDiversAdvertisements(data, id);
				setDiversDenAdvertisementsRejectDataLoading(false);
				toast.success('Rejected Successfully');
				handleNavigateMainComp();
			} catch (error) {
				setDiversDenAdvertisementsRejectDataLoading(false);
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

	const handleReasonAlertForm = async () => {
		toggleReasonModal();

		if (clickedRowData?.id) {
			const imageMedia = clickedRowData.item_media?.filter((media) => media.type === 'image') || [];

			if (imageMedia?.length !== 2) {
				toast.error('Two Thumbnail Images are required');
				return;
			}

			setDiversDenAdvertisementsPublishDataLoading(true);
			const data = {
				advertisement_id: [clickedRowData.id ? clickedRowData.id : null]
			};
			try {
				const response = await publishDiversAdvertisements(data);
				setDiversDenAdvertisementsPublishDataLoading(false);
				toast.success('Published Successfully');
				handleNavigateMainComp();
			} catch (error) {
				setDiversDenAdvertisementsPublishDataLoading(false);
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

	function getHeaderTitle(isTableMode) {
		if (isTableMode === 'view') {
			return 'View';
		}

		if (isTableMode === 'edit') {
			return 'Edit';
		}

		return 'Create';
	}

	return (
		<div className="min-w-full max-w-[100vw]">
			<Grid
				container
				spacing={2}
				className="pt-0 px-[15px] mt-[-5px]"
			>
				<Grid
					item
					xl={8}
					md={6}
					sm={12}
					xs={12}
					className="pt-[5px!important]"
				>
					<h6 className="text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-400">
						{getHeaderTitle(isTableMode)} {t('Diver\'s Den Management')}
					</h6>
				</Grid>

				{!isSearchEnabled && (
					<Grid
						item
						xl={4}
						md={6}
						sm={12}
						xs={12}
						className="pt-[5px!important]"
					>
						<Formik
							initialValues={{
								diversDenId: ''
							}}
							validationSchema={schema}
							onSubmit={onSubmit}
						>
							{({ values, setFieldValue, isValid, resetForm }) => (
								<Form>
									<div className="flex flex-wrap sm:flex-nowrap justify-end items-start gap-x-[15px]">
										<div className="w-full">
											<Typography className="formTypography">
												{t('Divers Den Master Data Code')}
												<span className="text-red"> *</span>
											</Typography>
											<Field
												disabled={value !== 0}
												name="diversDenId"
												placeholder={t('')}
												component={TextFormField}
												fullWidth
												size="small"
											/>
										</div>
										<div className="sm:pt-[24px]">
											<Button
												className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
												type="submit"
												variant="contained"
												size="medium"
												disabled={value !== 0}
											>
												{t('SEARCH')}
												{isETFMasterDataDataLoading ? (
													<CircularProgress
														className="text-white ml-[5px]"
														size={24}
													/>
												) : null}
											</Button>
										</div>
									</div>
								</Form>
							)}
						</Formik>
					</Grid>
				)}

				{isLoading ? (
					<Grid
						item
						md={12}
						sm={12}
						xs={12}
						className="flex justify-center items-center w-full min-h-[100px]"
					>
						<CircularProgress className="text-primaryBlueLight" />
					</Grid>
				) : (
					<Grid
						item
						md={12}
						sm={12}
						xs={12}
						className="!pt-[5px]"
					>
						<Grid
							container
							spacing={2}
						>
							<Grid
								item
								md={12}
								sm={12}
								xs={12}
								className="!pt-[5px] custom-tabs"
							>
								<Tabs
									value={value}
									onChange={handleChange}
									aria-label="basic tabs example"
									allowScrollButtonsMobile
									variant="scrollable"
									className="h-[30px] min-h-[40px] border-b border-gray-300"
								>
									<CustomTab
										label="General"
										index={0}
									/>
									<CustomTab
										label="Quick Stats"
										index={1}
									/>
									<CustomTab
										label="Upload Thumbnails"
										index={2}
									/>
									<CustomTab
										label="Related Products / Prices"
										index={3}
									/>
									<CustomTab
										label="Methods"
										index={4}
									/>
								</Tabs>

								<CustomTabPanel
									value={value}
									index={0}
								>
									<GeneralView
										isTableMode={isTableMode}
										initialValues={isGeneralViewData}
										generalViewValues={isGeneralViewProduct}
										getAllDriversDenAdvertisements={getAllDriversDenAdvertisements}
										onNextQuickStats={onNextQuickStats}
										isGeneralViewSubmitData={isGeneralViewSubmitData}
										getRowDriverDenAdvertisements={getRowDriverDenAdvertisements}
										isId={isId}
									/>
								</CustomTabPanel>
								<CustomTabPanel
									value={value}
									index={1}
								>
									<QuickStatus
										isTableMode={isTableMode}
										generalViewValues={isGeneralViewProduct}
										clickedRowData={{}}
										onBackGeneralView={onBackGeneralView}
										onNextUploadThumbnail={onNextUploadThumbnail}
									/>
								</CustomTabPanel>
								<CustomTabPanel
									value={value}
									index={2}
								>
									<UploadComp
										isTableMode={isTableMode}
										generalViewValues={isGeneralViewProduct}
										getAllDriversDenAdvertisements={getAllDriversDenAdvertisements}
										onBackQuickStats={onBackQuickStats}
										isUploadInitialData={isUploadInitialData}
										onNextRelatedProductPrices={onNextRelatedProductPrices}
										textImgUrls={textImgUrl}
										textVideoUrl={textVideoUrl}
										isMedia={isMedia}
										getRowDriverDenAdvertisements={getRowDriverDenAdvertisements}
										isId={isId}
									/>
								</CustomTabPanel>
								<CustomTabPanel
									value={value}
									index={3}
								>
									<RelatedComp
										isTableMode={isTableMode}
										clickedRowData={isGeneralViewProduct}
										onNextMethods={onNextMethods}
										isRelatedInitialData={isRelatedInitialData}
										onBackUploadThumbnail={onBackUploadThumbnail}
										getRowDriverDenAdvertisements={getRowDriverDenAdvertisements}
										isId={isId}
									/>
								</CustomTabPanel>
								<CustomTabPanel
									value={value}
									index={4}
								>
									<MethodsComp
										isTableMode={isTableMode}
										onBackRelatedProductPrices={onBackRelatedProductPrices}
										isMethodsInitialData={isMethodsInitialData}
										isGeneralViewSubmitData={isGeneralViewSubmitData}
										isUploadSubmitData={isUploadSubmitData}
										isRelatedInitialData={isRelatedInitialData}
										getRowDriverDenAdvertisements={getRowDriverDenAdvertisements}
										isId={isId}
										handleNavigateMainComp={handleNavigateMainComp}
									/>
								</CustomTabPanel>
							</Grid>

							{isTablePublishMode === 'publish' && (
								<Grid
									item
									md={12}
									sm={12}
									xs={12}
									className="flex items-end mb-10 justify-end gap-[10px] formikFormField pt-[0!important] px-[15px]"
								>
									{/* <Button */}
									{/*	className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80" */}
									{/*	type="button" */}
									{/*	variant="contained" */}
									{/*	size="medium" */}
									{/* > */}
									{/*	{t('CANCEL')} */}
									{/* </Button> */}
									<Button
										className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-red-400 hover:bg-red-400/80"
										type="button"
										variant="contained"
										size="medium"
										onClick={() => onReject()}
									>
										{t('REJECT')}
										{isDiversDenAdvertisementsRejectDataLoading ? (
											<CircularProgress
												className="text-white ml-[5px]"
												size={24}
											/>
										) : null}
									</Button>
									<Button
										className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
										type="button"
										variant="contained"
										size="medium"
										onClick={() => onApprove()}
									>
										{t('APPROVE')}
										{isDiversDenAdvertisementsPublishDataLoading ? (
											<CircularProgress
												className="text-white ml-[5px]"
												size={24}
											/>
										) : null}
									</Button>
								</Grid>
							)}
						</Grid>
					</Grid>
				)}
			</Grid>

			{isOpenRejectModal && (
				<OnRejectComp
					isOpen={isOpenRejectModal}
					toggleModal={toggleRejectModal}
					handleAlertForm={handleAlertForm}
				/>
			)}

			{isOpenReasonModal && (
				<OnApproveComp
					isOpen={isOpenReasonModal}
					toggleModal={toggleReasonModal}
					handleAlertForm={handleReasonAlertForm}
					showText="Diver's Den PDP"
				/>
			)}
		</div>
	);
}

export default NewDiversDenAdvertisementsTabsForm;
