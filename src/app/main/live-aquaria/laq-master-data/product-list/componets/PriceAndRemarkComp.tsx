import * as yup from 'yup';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { Grid } from '@mui/material';
import { Field, Form, Formik, FormikProps } from 'formik';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Switch from '@mui/material/Switch';
import TextFormField from '../../../../../common/FormComponents/FormTextField';
import { PriceOptionSubmitFormTypes } from '../../divers-den-master-data/drivers-den-types/DriversDenTypes';
import CustomFormTextField from '../../../../../common/FormComponents/CustomFormTextField';
import { PriceAndRemarkSubmitForm, TableDataProductSelection } from '../product-list-types/ProductListTypes';

interface Props {
	toggleModal: () => void;
	isOpen: boolean;
	clickedRowData: TableDataProductSelection;
	handleAlertForm: (values: PriceAndRemarkSubmitForm) => void;
	isMode: string;
}

function PriceAndRemarkComp({ toggleModal, isOpen, clickedRowData, handleAlertForm, isMode }: Props) {
	const schema = yup.object().shape({
		displayName: yup.string().required('Display Name is required'),
		displayPrice: yup
			.number()
			.typeError('Selling Price must be a number')
			.positive('Selling Price must be a positive number')
			.required('Selling Price is required'),
		displayApplicable: yup
			.number()
			.typeError('Discount Applicable must be a number')
			.min(0, 'Discount Applicable must be at least 0')
			.max(100, 'Discount Applicable cannot be more than 100'),
		considerStock: yup.boolean(),
		remark: yup.string().when('considerStock', {
			is: false,
			then: (schema) => schema.required('Remark is required when Consider Stock is enabled'),
			otherwise: (schema) => schema.notRequired()
		})
	});

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
			<DialogTitle className="flex items-center gap-[5px] text-[16px] font-bold">
				<h6 className="text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-400">
					{(() => {
						switch (isMode) {
							case 'view':
								return 'View';
							case 'edit':
								return 'Edit';
							default:
								return 'New';
						}
					})()}{' '}
					Production Selection Details
				</h6>
			</DialogTitle>
			<DialogContent>
				<Formik
					initialValues={{
						displayName: clickedRowData.displayName || '',
						sellingPrice: clickedRowData.sellingPrice || '',
						displayPrice: (clickedRowData.displayPrice ? clickedRowData.displayPrice : clickedRowData.sellingPrice) || '',
						displayApplicable: clickedRowData.displayApplicable || '',
						discountPrice: '',
						isDiscounted: clickedRowData.isDiscounted || false,
						newPrice: clickedRowData.newPrice || '',
						considerStock: clickedRowData.considerStock || false,
						remark: clickedRowData.remark || ''
					}}
					validationSchema={schema}
					onSubmit={handleAlertForm}
				>
					{({ values, setFieldValue, isValid, resetForm, touched, errors }) => (
						<Form>
							<Grid
								container
								spacing={2}
								className="pt-[15px]"
							>
								<Grid
									item
									md={4}
									sm={12}
									xs={12}
									className="formikFormField pt-[5px!important]"
								>
									<Typography className="formTypography">
										Display Name <span className="text-red"> *</span>
									</Typography>
									<Field
										disabled={false}
										name="displayName"
										placeholder=""
										component={TextFormField}
										fullWidth
										size="small"
									/>
								</Grid>

								<Grid
									item
									xs={12}
									className="!pb-[5px]"
								>
									<hr />
								</Grid>

								<Grid
									item
									lg={3}
									md={4}
									sm={6}
									xs={12}
									className="formikFormField pt-[5px!important]"
								>
									<Typography className="formTypography">Regular Price</Typography>
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
										Selling Price
										<span className="text-red"> *</span>
									</Typography>
									<CustomFormTextField
										name="displayPrice"
										id="displayPrice"
										type="number"
										placeholder=""
										disabled={isMode === 'view'}
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
									<Typography className="formTypography">Display Applicable</Typography>
									<div className="flex items-center">
										<CustomFormTextField
											name="displayApplicable"
											id="displayApplicable"
											type="number"
											placeholder=""
											disabled={isMode === 'view' || values.isDiscounted === false}
											changeInput={changeDisplayApplicable}
											style={{ marginRight: '1px', flexGrow: 1 }}
										/>
										<FormControlLabel
											className="ml-[1px]"
											control={
												<Checkbox
													disabled={isMode === 'view'}
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
											label="%"
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
									<Typography className="formTypography">Display Price</Typography>
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
									xs={12}
									className="!pb-[5px]"
								>
									<hr />
								</Grid>

								<Grid
									item
									lg={3}
									md={4}
									sm={6}
									xs={12}
									className="formikFormField pt-[5px!important]"
								>
									<Typography className="formTypography">Consider Stock</Typography>
									<FormControlLabel
										control={
											<Switch
												name="considerStock"
												checked={values.considerStock}
												onChange={(e) => {
													if (e.target.checked === true) {
														setFieldValue('remark', '');
													}

													setFieldValue('considerStock', e.target.checked);
												}}
												disabled={isMode === 'view'}
											/>
										}
										label={values.considerStock ? 'Yes' : 'No'}
									/>
								</Grid>

								{(values.considerStock === false) && (
									<Grid
										item
										md={12}
										sm={12}
										xs={12}
										className="formikFormField pt-[5px!important]"
									>
										<Typography className="formTypography">
											Remark <span className="text-red"> *</span>
										</Typography>
										<Field
											disabled={false}
											name="remark"
											placeholder=""
											component={TextFormField}
											fullWidth
											size="small"
										/>
									</Grid>
								)}

								<Grid
									item
									md={12}
									sm={12}
									xs={12}
									className="flex justify-end items-center gap-[10px] pt-[15px!important]"
								>
									<Button
										className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
										type="submit"
										variant="contained"
										size="medium"
										disabled={false}
									>
										Confirm
									</Button>

									<Button
										className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
										type="button"
										variant="contained"
										size="medium"
										disabled={false}
										onClick={toggleModal}
									>
										Cancel
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

export default PriceAndRemarkComp;
