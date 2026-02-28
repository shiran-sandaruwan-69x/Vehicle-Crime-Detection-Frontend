import { Button, FormControl, FormControlLabel, Grid, Radio, RadioGroup, TextField, Typography } from '@mui/material';
import { Field, Form, Formik } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import OrdersLogTable from 'src/app/common/OrdersLogTable';
import IconButton from '@mui/material/IconButton';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { toast } from 'react-toastify';
import CancelIcon from '@mui/icons-material/Cancel';
import { selectUser } from 'src/app/auth/user/store/userSlice';
import { useAppSelector } from 'app/store/hooks';
import { User } from 'src/app/auth/user';
import axios from 'axios';
import { CREATE_CANCEL_ORDER } from 'src/app/axios/services/AdminServices';
import CircularProgress from '@mui/material/CircularProgress';
import TextFormField from '../../../../../common/FormComponents/FormTextField';
import FormDropdown from '../../../../../common/FormComponents/FormDropdown';
import { imageType } from '../../../sample-component/root-component/types/general-advertisement-types';

interface Props {
	toggleModal: () => void;
	order: any;
	isMedia: any;
}

interface ErrorResponse {
	response?: {
		data?: {
			message?: string;
		};
	};
}

function CancelOrderRemarks({ toggleModal, order, isMedia }: Props) {
	const { t } = useTranslation('cancelOrders');
	const [images, setImages] = useState<{ id?: number; link?: string; file?: File; base64?: string }[]>([]);
	const maxImageCount = 3;
	const maxImageSize = 5 * 1024 * 1024; // 5MB
	const [imageError] = useState('');
	const user: User = useAppSelector(selectUser);
	const [isImageLoading, setImageLoading] = useState(false);
	const [isSaveEnabled, setIsSaveEnabled] = useState(false);
	const [isDataLoading, setDataLoading] = useState(false);

	useEffect(() => {
		if (order?.order_cancel_details?.proof_documents.length) {
			const images: imageType[] = order?.order_cancel_details?.proof_documents?.map((item) => ({
				id: item?.id,
				link: item?.file_url
			}));
			loadImageById(images);
		}
	}, []);

	const loadImageById = async (imageData: imageType[]) => {
		setImageLoading(true);
		const loadedImages = await Promise.all(
			imageData.map(async (image) => {
				// Fetch the image to get the file
				const response = await fetch(image.link);
				const blob = await response.blob();
				const file = new File([blob], `image_${image.id}.png`, {
					type: blob.type
				});
				const base64 = await convertToBase64(file);
				return {
					id: image.id,
					link: image.link,
					file,
					base64
				};
			})
		);

		setImages(loadedImages);
		setImageLoading(false);
	};

	const validateImageDimensions = (file: File): Promise<boolean> => {
		return new Promise((resolve) => {
			const img = new Image();
			img.src = URL.createObjectURL(file);
			img.onload = () => {
				if (img.width === img.height && file.size <= maxImageSize) {
					resolve(true);
				} else {
					toast.error('Image upload failed: Width and height must be the same, and size should be <= 5MB.');
					resolve(false);
				}
			};
		});
	};

	const convertToBase64 = (file: File): Promise<string> => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onloadend = () => {
				resolve(reader.result as string);
			};
			reader.onerror = (error) => {
				reject(error);
			};
		});
	};

	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const { files } = event.target;

		if (files) {
			if (images.length + files.length > maxImageCount) {
				toast.error(`You can only upload a maximum of ${maxImageCount} images.`);
				return;
			}

			const validImages: {
				id: number;
				link: string;
				file: File;
				base64: string;
			}[] = [];
			// eslint-disable-next-line no-restricted-syntax
			for (const file of Array.from(files)) {
				// eslint-disable-next-line no-await-in-loop
				const isValid = await validateImageDimensions(file);

				if (isValid) {
					// eslint-disable-next-line no-await-in-loop
					const base64 = await convertToBase64(file);
					validImages.push({
						id: Date.now(),
						link: URL.createObjectURL(file),
						file,
						base64
					});
				}
			}

			if (validImages.length > 0) {
				setImages((prevImages) => [...prevImages, ...validImages]);
				setIsSaveEnabled(true);
			}
		}

		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	};

	const handleRemoveImage = (id: number) => {
		const newImages = images.filter((image) => image.id !== id);
		setImages(newImages);
	};

	const formSubmit = async (values: any) => {
		if (images.length === 0 && values.refund_mode === 'AMOUNT_RETURN') {
			toast.error('Please upload at least one proof document(Bank Slip)');
			return;
		}

		const filteredImages = images.filter(
			(image) => !isMedia?.imagesIn?.some((mediaItem) => mediaItem?.id === image?.id)
		);
		let submitImages = filteredImages.map((image) => image.base64);

		if (values?.refund_mode === 'CREDIT_POINTS') {
			submitImages = [];
		}

		try {
			setDataLoading(true);
			const updated_data = {
				order_shipment_id: order?.id,
				refund_mode: values?.refund_mode,
				responsible_person: user.id ? user?.id : '',
				remark: values?.remarks,
				proof_documents: submitImages || null
			};

			await axios.post(`${CREATE_CANCEL_ORDER}`, updated_data);
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
	};

	return (
		<Formik
			initialValues={{
				remarks: order?.order_cancel_details?.remark || '',
				refund_mode: order?.order_cancel_details?.refund_mode || 'AMOUNT_RETURN',
				orderStatus: '1',
				cancel_order_reason: order?.cancel_reason,
				reason: order?.remark
			}}
			onSubmit={formSubmit}
			enableReinitialize
		>
			{(formik) => (
				<Form>
					<Grid
						container
						spacing={2}
						className="pt-[5px]"
					>
						<Grid
							item
							xs={12}
							sm={6}
							md={3}
							className="formikFormField pt-[5px!important]"
						>
							<Typography>
								{t('ORDER_STATUS')}
								<span className="text-red"> *</span>
							</Typography>
							<FormDropdown
								name="orderStatus"
								id="orderStatus"
								placeholder=""
								optionsValues={[{ value: '1', label: 'Cancelled' }]}
								disabled
							/>
						</Grid>

						<Grid
							item
							xs={12}
							sm={6}
							md={3}
							className="formikFormField pt-[5px!important]"
						>
							<Typography>
								{t('CANCEL_ORDER_REASON')}
								<span className="text-red"> *</span>
							</Typography>
							<Field
								disabled
								name="cancel_order_reason"
								placeholder={t('')}
								component={TextFormField}
								fullWidth
								size="small"
							/>
						</Grid>

						{/* Gender Radio Group */}
						<Grid
							item
							xs={12}
							sm={6}
							md={3}
							className="formikFormField pt-[5px!important]"
						>
							<FormControl className="w-full">
								<RadioGroup
									className="flex flex-row justify-between items-center gap-[5px] w-full"
									aria-labelledby="demo-radio-buttons-group-label"
									name="gender"
									defaultValue={formik?.values?.refund_mode} // Formik value for gender
									onChange={(e) => formik.setFieldValue('refund_mode', e.target.value)}
								>
									<FormControlLabel
										disabled={order?.order_cancel_details !== null}
										className="m-0"
										value="AMOUNT_RETURN"
										control={<Radio />}
										label="Provide Refund"
									/>
									<FormControlLabel
										disabled={order?.order_cancel_details !== null}
										className="m-0"
										value="CREDIT_POINTS"
										control={<Radio />}
										label="Update Credit Points"
									/>
								</RadioGroup>
							</FormControl>
						</Grid>

						{formik?.values?.refund_mode === 'AMOUNT_RETURN' ? (
							<>
								<Grid
									item
									xs={12}
									sm={6}
									md={3}
									className="formikFormField pt-[5px!important]"
								>
									<Typography className="formTypography">{t('REFUND_AMOUNT')}</Typography>
									<Field
										disabled
										name="refund_amount"
										placeholder={t('')}
										component={TextFormField}
										fullWidth
										size="small"
										value={order?.total_price}
									/>
								</Grid>

								<Grid
									item
									xs={12}
									sm={6}
									md={3}
									className="formikFormField pt-[5px!important]"
								>
									<Typography className="formTypography">Proof Document(Bank Slip)</Typography>

									{/* Image Upload Section */}
									{isImageLoading ? (
										<Grid
											item
											md={6}
											xs={12}
											className="flex justify-start items-center w-full min-h-[100px] pl-[25px]"
										>
											<CircularProgress className="text-primaryBlue" />
										</Grid>
									) : (
										<Grid
											item
											md={6}
											xs={12}
											className="formikFormField"
										>
											<div className="relative flex flex-wrap gap-[10px]">
												{images.map((image) => (
													<div
														key={image.id}
														className="relative w-[100px] h-[100px] m-[3px] border-[2px] border-[#ccc] rounded-[10px] overflow-hidden"
													>
														<img
															src={image.link}
															alt={`Image ${image.id}`}
															className="w-full h-full rounded-[10px] object-contain object-center"
														/>
														<IconButton
															disabled={order?.order_cancel_details !== null}
															size="small"
															className="absolute top-0 right-0 text-red p-[2px] rounded-full bg-black/5 transition-colors duration-300 hover:text-red"
															onClick={() => handleRemoveImage(image.id)}
														>
															<CancelIcon fontSize="small" />
														</IconButton>
													</div>
												))}

												{images.length < maxImageCount && (
													<div className="relative flex justify-center items-center w-[100px] h-[100px] m-[3px] border-[2px] border-[#ccc] rounded-[10px]">
														<IconButton
															disabled={order?.order_cancel_details !== null}
															className="text-primaryBlue"
															onClick={() =>
																document.getElementById('imageUpload')?.click()
															}
														>
															<AddCircleIcon fontSize="large" />
														</IconButton>
														<input
															ref={fileInputRef}
															id="imageUpload"
															type="file"
															accept="image/*"
															style={{ display: 'none' }}
															multiple
															onChange={handleImageUpload}
														/>
													</div>
												)}
											</div>
											<span className="text-[10px] text-gray-700 italic">
												<b className="text-red">Note : </b>
												Image dimensions must be 1:1, and size ≤ 5MB.
											</span>
										</Grid>
									)}
								</Grid>
							</>
						) : (
							<Grid
								item
								xs={12}
								sm={6}
								md={6}
								className="formikFormField pt-[5px!important]"
							>
								<h3 className="text-[10px] sm:text-[12px] lg:text-[14px] text-gray-700 mb-1">
									Total Credit Points: $ {order?.total_price}
								</h3>
								<p className="text-[8px] sm:text-[10px] lg:text-[12px] text-gray-600">
									*By Updating the credit point{' '}
									{`${order?.order?.customer_details?.first_name} ${order?.order?.customer_details?.last_name}`}{' '}
									wii be updated with ${order?.total_price}
								</p>
							</Grid>
						)}

						<Grid
							item
							xs={12}
							sm={12}
							className="formikFormField pt-[5px!important]"
						>
							<Typography>Assign Picker Remarks</Typography>
							<TextField
								name="remarks"
								fullWidth
								multiline
								rows={4}
								placeholder=""
								variant="outlined"
								label=""
								{...formik.getFieldProps('remarks')}
								disabled={order?.order_cancel_details !== null}
							/>
						</Grid>

						<Grid
							item
							xs={12}
							className="pt-[10px!important]"
						>
							{order?.logs && order.logs?.length > 0 && <OrdersLogTable tableData={order?.logs} />}
						</Grid>

						<Grid
							item
							md={12}
							sm={12}
							xs={12}
							className="flex justify-end items-center gap-[10px] pt-[10px!important]"
						>
							<Button
								onClick={toggleModal}
								className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
							>
								Close
							</Button>
							{order?.order_cancel_details === null ? (
								<Button
									className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
									type="submit"
								>
									Update
									{isDataLoading ? (
										<CircularProgress
											className="text-white ml-[5px]"
											size={24}
										/>
									) : null}
								</Button>
							) : null}
						</Grid>
					</Grid>
				</Form>
			)}
		</Formik>
	);
}

export default CancelOrderRemarks;
