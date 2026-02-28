import React, { ChangeEvent, useEffect, useState } from 'react';
import { Button, Dialog, DialogContent, DialogTitle, Grid, IconButton, Paper, Typography } from '@mui/material';
import { Field, Form, Formik } from 'formik';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import FormDropdown from 'src/app/common/FormComponents/FormDropdown';
import axios from 'axios';
import { GIFT_CERRTIFICATE, GIFT_CERTIFICATE_CODES } from 'src/app/axios/services/AdminServices';
import { toast } from 'react-toastify';
import TextFormDateField from '../../../../../common/FormComponents/TextFormDateField';
import TextFormField from '../../../../../common/FormComponents/FormTextField';
import { GiftCertificatesInterface } from '../GiftCertificate';

interface GiftCertificationsModalProps {
	isOpen: boolean;
	toggleModal: () => void;
	isAdd: boolean;
	isEdit: boolean;
	isView: boolean;
	selectedRow?: GiftCertificatesInterface;
}

const fetchImageAndConvertBase64 = async (image: string): Promise<{ file: null; base64: string }> => {
	try {
		const response = await fetch(image);
		const blob = await response.blob();

		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(blob);
			reader.onloadend = () => resolve({ file: null, base64: reader.result as string });
			reader.onerror = (error) => reject(error);
		});
	} catch (error) {
		console.error('Error fetching image:', error);
		return { file: null, base64: '' }; // Return an empty base64 in case of error
	}
};

function GiftCertificationsModal({
	isOpen,
	toggleModal,
	isAdd,
	isView,
	isEdit,
	selectedRow
}: GiftCertificationsModalProps) {
	const { t } = useTranslation('giftCertifications');
	const [isPriceEnabled, setIsPriceEnabled] = useState(true);
	const [thumbnails, setThumbnails] = useState<(any | null)[]>([null, null]);
	const [certificateCodes, setCertificateCodes] = useState<{ value: number; label: string }[]>([]);

	useEffect(() => {
		fetchGiftCodes();
	}, []);

	useEffect(() => {
		const fetchThumbnails = async () => {
			if (selectedRow) {
				try {
					const updatedThumbnail = await fetchImageAndConvertBase64(selectedRow.thumbnail);
					const updatedStyle = await fetchImageAndConvertBase64(selectedRow.style);
					setThumbnails([updatedThumbnail, updatedStyle]);
				} catch (error) {
					console.error('Error processing images:', error);
				}
			}
		};

		fetchThumbnails();
	}, [selectedRow]);

	const fetchGiftCodes = async () => {
		try {
			const response = await axios.get(`${GIFT_CERTIFICATE_CODES}?paginate=false`);

			const dropDownData = response.data?.data?.map((item) => ({
				value: item?.id,
				label: item?.name
			}));

			setCertificateCodes(dropDownData);
		} catch (error) {
			if (error.response?.data?.message) {
				toast.error(error.response.data.message);
			} else {
				toast.error('Something went wrong');
			}
		}
	};

	const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>, setFieldValue: any) => {
		const { checked } = event.target;
		setIsPriceEnabled(checked);
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		setFieldValue('price', '');
	};

	const handleImageUpload = (event: ChangeEvent<HTMLInputElement>, index: number) => {
		const file = event.target.files[0];

		if (file) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			const updatedThumbnails = [...thumbnails];
			updatedThumbnails[index] = file;
			setThumbnails(updatedThumbnails);
		}
	};

	const handleRemoveImage = (index: number) => {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		const updatedThumbnails = [...thumbnails];
		updatedThumbnails[index] = null;
		setThumbnails(updatedThumbnails);
	};

	const convertToBase64 = (file: any) => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onloadend = () => resolve(reader.result);
			reader.onerror = reject;
			// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
			reader.readAsDataURL(file);
		});
	};

	const schema = yup.object().shape({
		start_date: yup.string().nullable(),
		end_date: yup
			.string()
			.nullable()
			.when('start_date', (start_date, schema) => {
				return start_date
					? schema.test(
							'is-after-start',
							t('End Date must be after Start Date!'),
							(end_date) => !end_date || new Date(end_date) > new Date(start_date)
						)
					: schema;
			}),
		gift_card_name: yup.string().required(t('Gift Card Name is required!')),
		display_name: yup.string().required(t('Display Name is required!')),
		code_sequence: yup.number().required(t('Code Sequence is required!')),
		price: yup.number().when('enablePrice', {
			is: true, // Only apply this validation if price is enabled
			then: yup
				.number()
				.typeError(t('Price must be a number!'))
				.positive(t('Price must be greater than zero!'))
				.required(t('Price is required!')),
			otherwise: yup.number().notRequired() // If price is not enabled, it's not required
		})
	});

	const getTitle = (value: string): string => {
		if (isEdit) {
			return `Edit ${value}`;
		}

		if (isView) {
			return `View ${value}`;
		}

		return `Add ${value}`;
	};

	const onSubmit = async (values: any) => {
		if (isAdd) {
			const base64Thumbnails = await Promise.all(thumbnails.map((file) => (file ? convertToBase64(file) : null)));
			try {
				if (base64Thumbnails[0] === null || base64Thumbnails[1] === null) {
					toast.error('Please upload both images');
					return;
				}

				const data_save = {
					name: values.gift_card_name,
					display_name: values.display_name,
					start_date: values.start_date,
					end_date: values.end_date,
					code_generator_id: values.code_sequence,
					price: values.price,
					is_active: 1,
					thumbnail: base64Thumbnails[0],
					style: base64Thumbnails[1]
				};

				await axios.post(GIFT_CERRTIFICATE, data_save);
				toast.success('Created successfully');
				toggleModal();
			} catch (error) {
				if (error.response?.data?.message) {
					toast.error(error.response.data.message);
				} else {
					toast.error('Something went wrong');
				}
			}
		}

		if (isEdit) {
			try {

				// let thumnailBase64;
				const thumnailBase64 = thumbnails[0]?.base64
					? thumbnails[0]?.base64
					: await convertToBase64(thumbnails[0]);
				const styleBase64 = thumbnails[1]?.base64
					? thumbnails[1]?.base64
					: await convertToBase64(thumbnails[1]);

				if (thumnailBase64.length === 0 || styleBase64.length === 0) {
					toast.error('Please upload both images');
					return;
				}

				const data_save = {
					name: values.gift_card_name,
					display_name: values.display_name,
					start_date: values.start_date,
					end_date: values.end_date,
					code_generator_id: values.code_sequence,
					price: values.price,
					thumbnail: thumnailBase64,
					is_active: selectedRow?.is_active,
					style: styleBase64
				};

				await axios.put(`${GIFT_CERRTIFICATE}/${selectedRow?.id}`, data_save);
				toast.success('Updated successfully');
				toggleModal();
			} catch (error) {
				if (error.response?.data?.message) {
					toast.error(error.response.data.message);
				} else {
					toast.error('Please upload both images');
				}
			}
		}
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
					{getTitle('Gift Certificate')}
				</h6>
			</DialogTitle>
			<DialogContent className="pb-[15px]">
				<Formik
					initialValues={{
						gift_card_name: selectedRow?.name ? selectedRow?.name : '',
						display_name: selectedRow?.display_name ? selectedRow?.display_name : '',
						start_date: selectedRow?.start_date ? selectedRow?.start_date : '',
						end_date: selectedRow?.end_date ? selectedRow?.end_date : '',
						code_sequence: selectedRow?.code?.id ? selectedRow?.code?.id : '',
						price: selectedRow?.price ? selectedRow?.price : '',
						enablePrice: true
					}}
					onSubmit={onSubmit}
					validationSchema={schema}
					enableReinitialize
				>
					{({ setFieldValue, values }) => (
						<Form>
							<Grid
								container
								spacing={2}
								className="pt-[10px]"
							>
								{/* Gift Card Details */}
								<Grid
									item
									lg={3}
									md={4}
									sm={6}
									xs={12}
									className="formikFormField pt-[5px!important]"
								>
									<Typography>
										{t('GIFT_CARD_NAME')}
										<span className="text-red"> *</span>
									</Typography>
									<Field
										disabled={isView}
										name="gift_card_name"
										component={TextFormField}
										fullWidth
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
									<Typography>
										{t('DISPLAY_NAME')}
										<span className="text-red"> *</span>
									</Typography>
									<Field
										disabled={isView}
										name="display_name"
										component={TextFormField}
										fullWidth
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
									<Typography>{t('START_DATE')}</Typography>
									<TextFormDateField
										name="start_date"
										disabled={isView}
										type="date"
										placeholder=""
										min=""
										id="start_date"
										// max={new Date().toISOString().split("T")[0]}
										// disablePastDate
										changeInput={(
											value: string,
											form: {
												setFieldValue: (field: string, value: any) => void;
											}
										) => {
											form.setFieldValue('start_date', value);
										}}
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
									<Typography>{t('END_DATE')}</Typography>
									<TextFormDateField
										disabled={isView}
										name="end_date"
										type="date"
										id="end_date"
										placeholder=""
										min=""
										// max={new Date().toISOString().split("T")[0]}
										// disablePastDate
										changeInput={(
											value: string,
											form: {
												setFieldValue: (field: string, value: any) => void;
											}
										) => {
											form.setFieldValue('end_date', value);
										}}
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
									<Typography>
										{t('CODE_SEQUENCE')}
										<span className="text-red"> *</span>
									</Typography>
									<FormDropdown
										name="code_sequence"
										id="code_sequence"
										placeholder=""
										optionsValues={certificateCodes}
										disabled={isView}
									/>
									{/* <Field
										name="code_sequence"
										component={TextFormField}
										fullWidth
										size="small"
										type="number"
									/> */}
								</Grid>
								<Grid
									item
									lg={3}
									md={4}
									sm={6}
									xs={12}
									className="formikFormField pt-[5px!important]"
								>
									<Typography>{t('PRICE')}</Typography>
									<Field
										name="price"
										component={TextFormField}
										fullWidth
										size="small"
										type="number"
										disabled={!isPriceEnabled || isView}
									/>
								</Grid>
								<Grid
									item
									lg={3}
									md={4}
									sm={6}
									xs={12}
									className="flex items-center formikFormField pt-[5px!important]"
								>
									<FormControlLabel
										control={
											<Checkbox
												name="enablePrice"
												checked={isPriceEnabled}
												disabled={isView}
												onChange={(e: ChangeEvent<HTMLInputElement>) => {
													setFieldValue('enablePrice', e.target.checked);
													// eslint-disable-next-line @typescript-eslint/ban-ts-comment
													handleCheckboxChange(e, setFieldValue);
												}}
											/>
										}
										label={t('ENABLE_PRICE')}
									/>
								</Grid>

								{/* Image Uploads */}
								{thumbnails.map((thumbnail, index) => (
									<Grid
										item
										xs={12}
										sm={6}
										md={6}
										key={index}
										className="formikFormField pt-[5px!important]"
									>
										<Typography>
											{index === 0 ? 'Gift Certificate Thumbnail:' : 'Gift Certificate Style:'}
											<span className="text-red"> *</span>
										</Typography>
										<Paper
											elevation={0}
											style={{
												width: '100%',
												height: '150px',
												borderRadius: '8px',
												border: '1px solid #ccc',
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												position: 'relative'
											}}
										>
											{thumbnail ? (
												<>
													<img
														src={
															thumbnail?.base64
																? thumbnails[index].base64
																: thumbnail
																	? URL.createObjectURL(thumbnail)
																	: ''
														}
														alt="Thumbnail"
														style={{
															width: '100%',
															height: '100%',
															objectFit: 'contain',
															borderRadius: '8px'
														}}
													/>
													{!isView && (
														<IconButton
															size="small"
															onClick={() => handleRemoveImage(index)}
															style={{
																position: 'absolute',
																top: 0,
																right: 0,
																backgroundColor: 'rgba(0, 0, 0, 0.5)',
																color: 'white'
															}}
														>
															<CancelIcon />
														</IconButton>
													)}
												</>
											) : (
												<>
													<input
														type="file"
														onChange={(e) => handleImageUpload(e, index)}
														style={{ display: 'none' }}
														id={`image-upload-${index}`}
														accept="image/*"
													/>
													<label htmlFor={`image-upload-${index}`}>
														<IconButton
															color="primary"
															component="span"
														>
															<AddCircleIcon className="text-[40px] text-primaryBlue" />
														</IconButton>
													</label>
												</>
											)}
										</Paper>
									</Grid>
								))}

								<Grid
									item
									md={12}
									sm={12}
									xs={12}
									className="flex justify-end items-center gap-[10px] pt-[15px!important]"
								>
									{!isView && (
										<Button
											className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
											type="submit"
											variant="contained"
											size="medium"
										>
											{isAdd ? 'Save' : 'Update'}
										</Button>
									)}
									{/* <Button
                    className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
                    type="button"
                    variant="contained"
                    size="medium"
                  >
                    Clear
                  </Button> */}
									<Button
										className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
										type="button"
										variant="contained"
										size="medium"
										onClick={toggleModal}
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

export default GiftCertificationsModal;
