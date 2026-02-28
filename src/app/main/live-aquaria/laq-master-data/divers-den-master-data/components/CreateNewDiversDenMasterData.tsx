import { CircularProgress } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { Field, Form, Formik } from 'formik';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { searchCisCode } from '../../../../../axios/services/live-aquaria-services/master-data-services/MasterDataServices';
import CustomTab from '../../../../../common/CustomTab';
import TextFormField from '../../../../../common/FormComponents/FormTextField';
import {
	AttributeValueType,
	CreateGeneralViewTypes,
	ItemAttributeType
} from '../../product-list/product-list-types/ProductListTypes';
import {
	DriversDenCisCodeDataResponseType,
	DriversDenCisCodeDataType,
	PriceOptionSubmitFormTypes
} from '../drivers-den-types/DriversDenTypes';
import CreateGeneralView from './CreateGeneralView';
import CreateNewProductAttributes from './CreateNewProductAttributes';
import PriceOptionsComp from './PriceOptionsComp';

function CustomTabPanel({ children, value, index, ...other }) {
	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && <Box sx={{ p: 2 }}>{children}</Box>} {/* Slight padding reduction */}
		</div>
	);
}

interface ErrorResponse {
	response?: {
		status?:number;
		data?: {
			message?: string;
		};
	};
}

interface Props {
	toggleModal: () => void;
	isOpen: boolean;
	isTableMode: string;
	isSearchEnabled: boolean;
	getAllDriversDenMasterData: () => void;
}

function CreateNewDiversDenMasterData({
	toggleModal,
	isOpen,
	isTableMode,
	isSearchEnabled,
	getAllDriversDenMasterData
}: Props) {
	const { t } = useTranslation('diversDenMasterData');

	const [value, setValue] = React.useState(0);
	const [isGeneralViewData, setGeneralViewData] = useState<CreateGeneralViewTypes>({});
	const [isCisCodeData, setCisCodeData] = useState<DriversDenCisCodeDataType>({});
	const [isProductAttributeData, setProductAttributeData] = useState<ItemAttributeType>({});
	const [isPriceOptionsData, setPriceOptionsDataData] = useState({});
	const [initialsValues, setInitialsValues] = useState<AttributeValueType[]>([]);
	const [isETFMasterDataDataLoading, setETFMasterDataDataLoading] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const handleChange = (event, newValue) => {};

	const handleNextCreateGeneralTab = (values: CreateGeneralViewTypes) => {
		setValue(1);
		setGeneralViewData(values);
	};

	const handleNextProductAttributeTab = (requestData: ItemAttributeType, initialsValues: AttributeValueType[]) => {
		setValue(2);
		setProductAttributeData(requestData);
		setInitialsValues(initialsValues);
	};

	const handleBackCreateGeneralTab = (requestData: ItemAttributeType, initialsValues: AttributeValueType[]) => {
		setValue(0);
		setProductAttributeData(requestData);
		setInitialsValues(initialsValues);
	};

	const handleBackPriceOptionsTab = (initialsValues: PriceOptionSubmitFormTypes) => {
		setValue(1);
		setPriceOptionsDataData(initialsValues);
	};

	const schema = yup.object().shape({
		cisCode: yup.string().required(t('Cis code is required'))
	});

	const onSubmit = async (values: { cisCode: string }) => {
		const id = values.cisCode ? values.cisCode : '';
		setIsLoading(true);
		try {
			const response: DriversDenCisCodeDataResponseType = await searchCisCode(id);
			setCisCodeData(response.data);
			setIsLoading(false);
		} catch (error) {
			setIsLoading(false);
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
		}
	};

	// if (isLoading) {
	//   return (
	//       <div className="flex justify-center items-center mt-[100px]">
	//         <CircularProgress />
	//       </div>
	//   );
	// }

	return (
		<Dialog
			fullWidth
			open={isOpen}
			maxWidth="xl"
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
					{t('Create Divers Den Item')}
				</h6>
			</DialogTitle>

			<DialogContent className="pb-0">
				<Grid
					container
					spacing={2}
				>
					<Grid
						item
						md={12}
						sm={12}
						xs={12}
						className="mt-[6px]"
					>
						{!isSearchEnabled && (
							<Formik
								initialValues={{
									cisCode: ''
								}}
								validationSchema={schema}
								onSubmit={onSubmit}
							>
								{({ values, setFieldValue, isValid, resetForm }) => (
									<Form>
										<Grid
											container
											spacing={2}
											className="justify-end"
										>
											<Grid
												item
												xs={12}
												sm={6}
												md={6}
												lg={4}
												xl={4}
												className="formikFormField flex justify-end items-start gap-[15px] pt-[5px!important]"
											>
												<div className="w-full">
													<Typography className="formTypography">
														{t('CIS Code')}
														<span className="text-red"> *</span>
													</Typography>
													<Field
														disabled={value !== 0}
														name="cisCode"
														placeholder={t('')}
														component={TextFormField}
														fullWidth
														size="small"
													/>
												</div>
												<Button
													disabled={value !== 0}
													className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 mt-[22px] rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
													type="submit"
													variant="contained"
													size="medium"
												>
													{t('SEARCH')}
													{isETFMasterDataDataLoading ? (
														<CircularProgress
															className="text-gray-600 ml-[5px]"
															size={24}
														/>
													) : null}
												</Button>
											</Grid>
										</Grid>
									</Form>
								)}
							</Formik>
						)}
					</Grid>

					{isLoading ? (
						<Grid
							item
							md={12}
							sm={12}
							xs={12}
							className="flex justify-center items-center w-full pt-[0!important] mt-[100px] mb-[100px]"
						>
							<CircularProgress className="text-primaryBlue" />
						</Grid>
					) : (
						<Grid
							item
							md={12}
							sm={12}
							xs={12}
							className="pt-[0!important]"
						>
							<Tabs
								value={value}
								onChange={handleChange}
								aria-label="basic tabs example"
								variant="fullWidth"
								className="h-[30px] min-h-[40px] border-b border-gray-300"
							>
								<CustomTab
									label="General"
									index={0}
								/>
								<CustomTab
									label="Product Attributes"
									index={1}
								/>
								<CustomTab
									label="Price Options"
									index={2}
								/>
							</Tabs>

							<CustomTabPanel
								value={value}
								index={0}
							>
								<CreateGeneralView
									isTableMode=""
									onNext={handleNextCreateGeneralTab}
									initialValues={isGeneralViewData}
									isCisCodeData={isCisCodeData}
									setCisCodeData={setCisCodeData}
									toggleModal={toggleModal}
								/>
							</CustomTabPanel>

							<CustomTabPanel
								value={value}
								index={1}
							>
								<CreateNewProductAttributes
									isTableMode=""
									onNext={handleNextProductAttributeTab}
									onBack={handleBackCreateGeneralTab}
									initialsValues={initialsValues}
									toggleModal={toggleModal}
								/>
							</CustomTabPanel>

							<CustomTabPanel
								value={value}
								index={2}
							>
								<PriceOptionsComp
									isTableMode=""
									onBack={handleBackPriceOptionsTab}
									initialsValues={isPriceOptionsData}
									isCisCodeData={isCisCodeData}
									isProductAttributeData={isProductAttributeData}
									isGeneralViewData={isGeneralViewData}
									getAllDriversDenMasterData={getAllDriversDenMasterData}
									toggleModal={toggleModal}
								/>
							</CustomTabPanel>
						</Grid>
					)}
				</Grid>
			</DialogContent>
		</Dialog>
	);
}

export default CreateNewDiversDenMasterData;
