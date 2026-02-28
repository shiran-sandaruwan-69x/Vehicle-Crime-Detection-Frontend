import { Button, FormControl, FormControlLabel, Grid, Radio, RadioGroup, TextField, Typography } from '@mui/material';
import { Field, Form, Formik } from 'formik';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import IconButton from '@mui/material/IconButton';
// import FormDropdown from '../../../../../../common/FormComponents/FormDropdown';
// import TextFormDateField from '../../../../../../common/FormComponents/TextFormDateField';
// import MaterialTableWrapper from '../../../../../../common/tableComponents/MaterialTableWrapper';
import CancelIcon from '@mui/icons-material/Cancel';
import { toast } from 'react-toastify';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { User } from 'src/app/auth/user';
import { useAppSelector } from 'app/store/hooks';
import { selectUser } from 'src/app/auth/user/store/userSlice';
import OrdersLogTable from 'src/app/common/OrdersLogTable';
import axios from 'axios';
import { ORDER_CLAIMS } from 'src/app/axios/services/AdminServices';
import TextFormField from '../../../../../common/FormComponents/FormTextField';
import FormDropdown from '../../../../../common/FormComponents/FormDropdown';

interface Props {
	toggleModal: () => void;
	claim: any;
}

function ClaimHistoryLog({ toggleModal, claim }: Props) {
	const user: User = useAppSelector(selectUser);
	const { t } = useTranslation('customerClaims');
	const [, setIsEditable] = useState(false);
	const [images, setImages] = useState<{ id?: number; link?: string; file?: File; base64?: string }[]>([]);
	const maxImageCount = 1;
	const maxImageSize = 5 * 1024 * 1024; // 5MB
	const [imageError] = useState('');

	const toggleEditable = useCallback(() => {
		setIsEditable((prev) => !prev);
	}, []);

	const tableColumns = [
		{ title: t('DATE'), field: 'date' },
		{
			title: t('ACTION_TAKEN'),
			field: 'actionTaken'
		},
		{
			title: t('TAKEN_BY'),
			field: 'takenBy'
		},
		{ title: t('COMMENTS'), field: 'comments' }
	];

	const schema = yup.object().shape({
		orderStatus: yup.string().required(t('ORDER_STATUS_REQUIRED')),
		refund_mode: yup.string().required('Refund mode is required'),
		refund_amount: yup.number().min(0, 'Refund amount must be positive')
		// refund_amount: yup.string().when('refund_mode', {
		// 	is: 'AMOUNT_RETURN',
		// 	then: (schema) => schema.required('Refund amount is required'),
		// 	otherwise: (schema) => schema.notRequired()
		// })

		// remarks: yup.string().when('orderStatus', {
		// 	is: 'rejected',
		// 	then: (schema) => schema.required('Refund amount is required'),
		// 	otherwise: (schema) => schema.notRequired()
		// })
	});

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
				// const isValid = await validateImageDimensions(file);
				const isValid = true;

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
			}
		}
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

	const handleRemoveImage = (id: number) => {
		const newImages = images.filter((image) => image.id !== id);
		setImages(newImages);
	};

	const formSubmit = async (values: any) => {
		if (values.orderStatus === 'pending') {
			toast.error('Please select an order status.');
			return;
		}

		if (images.length === 0 && values.orderStatus === 'approved' && values.refund_mode === 'AMOUNT_RETURN') {
			toast.error('Please upload at least one image.');
			return;
		}

		try {
			const updated_data = {
				status: values?.orderStatus,
				refund_mode: values.refund_mode, // CREDIT_POINTS
				responsible_person: user.id ? user?.id : '',
				remark: values.remarks,
				proof_document: images[0]?.base64 ? images[0].base64 : '',
				refund_amount: values.refund_amount
			};

			await axios.put(`${ORDER_CLAIMS}/${claim?.id}`, updated_data);
			toast.success('Claim updated successfully');
			toggleModal();
		} catch (error) {
			console.log(error);
			toast.error(error.response.data.message);
		}
	};

	return (
		<Formik
			initialValues={{
				remarks: '',
				refund_mode: 'AMOUNT_RETURN',
				orderStatus: claim?.status,
				cancel_order_reason: '',
				reason: '',
				refund_amount: claim?.refund_amount ? claim?.refund_amount : 0
				// cancel_order_reason: order.cancel_reason,
				// reason: order.remark
			}}
			onSubmit={formSubmit}
			validationSchema={schema}
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
								Status
								<span className="text-red"> *</span>
							</Typography>
							<FormDropdown
								disabled={!!(claim?.status !== 'PENDING' || 'Pending' || 'pending')}
								name="orderStatus"
								id="orderStatus"
								placeholder=""
								optionsValues={[
									{ value: 'pending', label: 'Pending' },
									{ value: 'approved', label: 'Approved' },
									{ value: 'rejected', label: 'Rejected' }
								]}
							/>
						</Grid>

						{formik.values.orderStatus === 'approved' && (
							<>
								{/* Gender Radio Group */}
								<Grid
									item
									xs={12}
								>
									<FormControl>
										<RadioGroup
											aria-labelledby="demo-radio-buttons-group-label"
											name="gender"
											defaultValue={formik.values.refund_mode} // Formik value for gender
											onChange={(e) => formik.setFieldValue('refund_mode', e.target.value)}
										>
											<FormControlLabel
												value="AMOUNT_RETURN"
												control={<Radio />}
												label="Provide Refund"
												disabled={!!(claim?.status !== 'PENDING' || 'Pending' || 'pending')}
											/>
											<FormControlLabel
												value="CREDIT_POINTS"
												control={<Radio />}
												label="Update Credit Points"
												disabled={!!(claim?.status !== 'PENDING' || 'Pending' || 'pending')}
											/>
										</RadioGroup>
									</FormControl>
								</Grid>

								{formik.values.refund_mode === 'AMOUNT_RETURN' ? (
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
												name="refund_amount"
												placeholder={t('')}
												component={TextFormField}
												fullWidth
												size="small"
												type="number"
												disabled={!!(claim?.status !== 'PENDING' || 'Pending' || 'pending')}
												// value={order.total_price}
											/>
										</Grid>

										{claim?.status === 'PENDING' || 
											claim?.status === 'Pending' ||
											(claim?.status === 'pending' ? (
												<Grid
													item
													xs={12}
													sm={6}
													md={3}
													className="formikFormField pt-[5px!important]"
												>
													<Typography className="formTypography">
														Proof Document(Bank Slip)
													</Typography>

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
																// disabled={isTableMode === 'view'}
																// size="small"
																className="absolute top-0 right-0 text-red p-[2px] rounded-full bg-black/5 transition-colors duration-300 hover:text-red"
																onClick={() => handleRemoveImage(image.id)}
															>
																<CancelIcon fontSize="small" />
															</IconButton>
														</div>
													))}

													<div className="relative flex justify-center items-center w-[100px] h-[100px] m-[3px] border-[2px] border-[#ccc] rounded-[10px]">
														<IconButton
															className="text-primaryBlue"
															// disabled={isTableMode === 'view'}
															onClick={() =>
																document.getElementById('imageUpload')?.click()
															}
														>
															<AddCircleIcon fontSize="large" />
														</IconButton>
														<input
															id="imageUpload"
															type="file"
															accept="image/*"
															style={{ display: 'none' }}
															multiple
															onChange={handleImageUpload}
														/>
														<div className="text-center text-red-800">{imageError}</div>
													</div>
												</Grid>
											) : (
												<Grid>
													<img
														src={claim?.proof_document}
														alt="Proof Document"
														width="500"
														height="500"
														className="p-10 rounded-[10px] object-contain object-center"
													/>
												</Grid>
											))}
									</>
								) : (
									<>
										<h3>Total Credit Points: ${/* {order.total_price} */}</h3>
										<br />
										<p>
											*By Updating the credit point{' '}
											{`${claim?.order?.customer_details?.first_name} ${claim?.order?.customer_details?.last_name}`}{' '}
											wii be updated with ${claim?.order_shipment?.total_price}
										</p>
									</>
								)}
							</>
						)}

						{formik.values.orderStatus === 'rejected' && (
							<Grid
								item
								xs={12}
								sm={12}
								className="formikFormField pt-[5px!important]"
							>
								<Typography>Remarks</Typography>

								{/* <Field
                    name="remarks"
                    placeholder={t("Enter remarks")}
                    component={TextField}
                    fullWidth
                    size="small"
                    multiline // Enables textarea mode
                    rows={4} // Adjusts textarea height
                    variant="outlined"
                  /> */}
								<TextField
									name="remarks"
									fullWidth
									multiline
									rows={4}
									placeholder="Placeholder"
									variant="outlined"
									label=""
									{...formik.getFieldProps('remarks')}
								/>
								{formik.touched.remarks && formik.errors.remarks && (
									<div className="text-red">{/* {formik.errors.remarks?.message} */}</div>
								)}
							</Grid>
						)}

						<Grid
							item
							xs={12}
							className="pt-[10px!important]"
						>
							{claim.claim_logs && claim.claim_logs.length > 0 && (
								<OrdersLogTable tableData={claim.claim_logs} />
							)}
						</Grid>

						<Grid
							item
							md={12}
							sm={12}
							xs={12}
							className="flex justify-end items-center gap-[10px] pt-[15px!important]"
						>
							<Button
								onClick={toggleModal}
								className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
							>
								Close
							</Button>
							<Button
								className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
								type="submit"
							>
								Update
							</Button>
						</Grid>
					</Grid>
				</Form>
			)}
		</Formik>
	);
}

export default ClaimHistoryLog;
