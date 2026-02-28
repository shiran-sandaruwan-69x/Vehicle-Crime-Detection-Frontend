import PrintIcon from '@mui/icons-material/Print';
import {Button, CircularProgress, Grid, Paper} from '@mui/material';
import Typography from '@mui/material/Typography';
import { Field, Form, Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import FormDropdown from '../../../../common/FormComponents/FormDropdown';
import TextFormField from '../../../../common/FormComponents/FormTextField';
import NavigationViewComp from '../../../../common/FormComponents/NavigationViewComp';
import {toast} from "react-toastify";
import axios from "axios";
import {ORDER_PLANING} from "../../../../axios/services/AdminServices";
import React, {useState} from "react";

interface ErrorResponse {
	response?: {
		data?: {
			message?: string;
		};
	};
}

function Dispatch() {
	const { t } = useTranslation('dispatching');
	const [isDataLoading, setDataLoading] = useState(false);
	const [isData, setData] = useState<any>(null);
	const [isPrintDataLoading, setPrintDataLoading] = useState(false);

	const service_provider = [
		{ value: '1', label: 'UPS' }
	];

	const generateShippingLabel = async (values:any)=>{
		setDataLoading(true);
		try {
			const response = await axios.get(`${ORDER_PLANING}/${values?.po_number ? values?.po_number : null}/ups-shipping-label`);
			setData(response?.data);
			toast.success('Generated Successfully');
			setDataLoading(false);
		}catch (error){
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
	};

	const printShippingLabel = () => {
		if (!isData?.labelImage) {
			toast.error("Shipping label not available");
			return;
		}

		openPdfInNewTab(isData?.labelImage);
	};

	const openPdfInNewTab = (base64Data: string) => {
		let mimeType = 'application/pdf';
		if (base64Data.startsWith('iVBORw0KGgo')) {
			mimeType = 'image/png';
		} else if (base64Data.startsWith('R0lGOD')) {
			mimeType = 'image/gif';
		} else if (!base64Data.startsWith('JVBERi0')) {
			// Not a PDF
			toast.error('Unsupported file format for preview');
			return;
		}

		const byteCharacters = atob(base64Data);
		const byteNumbers = new Array(byteCharacters.length)
			.fill(null)
			.map((_, i) => byteCharacters.charCodeAt(i));
		const byteArray = new Uint8Array(byteNumbers);
		const blob = new Blob([byteArray], { type: mimeType });

		const fileUrl = URL.createObjectURL(blob);
		window.open(fileUrl, '_blank');
	};


	return (
		<div className="min-w-full max-w-[100vw]">
			<NavigationViewComp title="Order Review / Dispatching" />
			<Formik
				initialValues={{
					po_number:'',
					service_provider:'1',
				}}
				onSubmit={generateShippingLabel}
			>
				{(formik) => (
					<Form>
						<Grid
							container
							spacing={2}
							className="pr-[30px] mx-auto"
						>
							{/* PO Number and Service Provider */}
							<Grid
								item
								xs={12}
								sm={6}
								md={4}
								lg={3}
								xl={2}
								className="formikFormField"
							>
								<Typography className="formTypography">{t('PO_NUMBER')}</Typography>
								<Field
									disabled={false}
									name="po_number"
									placeholder={t('')}
									component={TextFormField}
									fullWidth
									size="small"
								/>
							</Grid>
							<Grid
								item
								xs={12}
								sm={6}
								md={4}
								lg={3}
								xl={2}
								className="formikFormField"
							>
								<Typography className="formTypography">{t('SERVICE_PROVIDER')}</Typography>
								<FormDropdown
									name="service_provider"
									id="service_provider"
									placeholder=""
									optionsValues={service_provider}
									disabled={false}
								/>
							</Grid>
							<Grid
								item
								xs={12}
								sm={6}
								md={4}
								lg={3}
								xl={3}
								className="formikFormField md:pt-[36px!important]"
							>
								<Button
									className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
									type="submit"
									variant="contained"
									size="medium"
									disabled={false}
								>
									{t('GENERATE_SHIPPING_LABELS')}
									{isDataLoading ? (
										<CircularProgress
											className="text-white ml-[5px]"
											size={24}
										/>
									) : null}
								</Button>
							</Grid>

							<Grid
								item
								xs={12}
								sm={6}
								md={12}
								lg={3}
								xl={5}
								className="flex justify-end formikFormField md:pt-[36px!important]"
							>
								<Button
									className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
									type="button"
									variant="contained"
									size="medium"
									disabled={false}
									startIcon={<PrintIcon />}
									onClick={()=>printShippingLabel()}
								>
									{t('PRINT')}
									{isPrintDataLoading ? (
										<CircularProgress
											className="text-white ml-[5px]"
											size={24}
										/>
									) : null}
								</Button>
							</Grid>

							<Grid
								item
								xs={12}
								lg={8}
								className="formikFormField mt-[16px]"
							>
								<Paper className="h-full pb-[10px]">
									<Grid
										container
										spacing={2}
										className="mx-auto pr-[30px]"
									>
										<Grid
											item
											xs={12}
											className="flex flex-wrap justify-between items-center gap-[10px] mb-[20px]"
										>
											<Typography variant="h6">
												{t('TRACKING_NUMBER')} :{' '}
												<span>{isData?.trackingNumber}</span>
											</Typography>
										</Grid>

										<Grid
											item
											xs={12}
											sm={6}
											md={6}
											className="pt-[5px!important]"
										>
											<h6 className="text-[12px] lg:text-[14px] mb-[4px]">
												<span className="inline-block min-w-[148px] font-600">
													{t('PO_NUMBER')}
												</span>{' '}
												: {isData?.order_code}
											</h6>
											<h6 className="text-[12px] lg:text-[14px] mb-[4px]">
												<span className="inline-block min-w-[148px] font-600">
													{t('SHIPPING_METHOD')}
												</span>{' '}
												: {isData?.shippingMethod}
											</h6>
											<h6 className="text-[12px] lg:text-[14px] mb-[4px]">
												<span className="inline-block min-w-[148px] font-600">
													{t('Box Weight')}
												</span>{' '}
												: {isData?.weight} {isData?.weight_unit}
											</h6>
										</Grid>
										<Grid
											item
											xs={12}
											sm={6}
											md={6}
											className="pt-[5px!important]"
										>
											<h6 className="text-[12px] lg:text-[14px] mb-[4px]">
												<span className="block font-600">Shipping Address:</span>
												{isData?.shipping_address?.address_line_1}
												{isData?.shipping_address?.address_line_1 ? (<br />) : null}
												{isData?.shipping_address?.address_line_2}
												{isData?.shipping_address?.address_line_2 ? (<br />) : null}
												{isData?.shipping_address?.address_line_3}
												{isData?.shipping_address?.address_line_3 ? (<br />) : null}
												{isData?.shipping_address?.city ? `${isData?.shipping_address?.city},` : ''}{' '}
												{isData?.shipping_address?.state}
												<br />
												{isData?.shipping_address?.zip_code}
												<br />
												{isData?.shipping_address?.country?.name}
												<br />
											</h6>
										</Grid>
									</Grid>
								</Paper>
							</Grid>

							{isData?.labelImage && (
								<Grid
									item
									xs={12}
									lg={4}
									className="formikFormField mt-[16px] d-none"
								>
									<Paper className="pb-[10px]">
										<Grid
											container
											spacing={2}
											className="mx-auto pr-[30px]"
										>
											<Grid
												item
												xs={12}
											>
												<Typography variant="h6">Shipping Label Preview</Typography>
											</Grid>
											<Grid
												item
												xs={12}
												className="mb-[10px]"
											>
												<img
													className="w-full md:max-w-[95%] h-full object-contain object-center mx-auto"
													src={`data:image/gif;base64,${isData?.labelImage}`}
													alt="Shipping Label"
												/>
											</Grid>
										</Grid>
									</Paper>
								</Grid>
							)}

						</Grid>
					</Form>
				)}
			</Formik>
		</div>
	);
}

export default Dispatch;
