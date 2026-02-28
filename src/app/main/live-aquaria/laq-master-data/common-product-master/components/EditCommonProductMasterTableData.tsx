import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { Button, Dialog, DialogContent, DialogTitle, Grid, Typography } from '@mui/material';
import { Field, Form, Formik } from 'formik';
import React from 'react';
import { toast } from 'react-toastify';
import TextFormField from '../../../../../common/FormComponents/FormTextField';
import FormDropdown from '../../../../../common/FormComponents/FormDropdown';
import { ShippingScheduleTypeDrp } from '../../../shipping/shipping-methods/types/ShippingMethodsType';
import { CommonProductMasterCreateFormData } from '../common-product-master-types/CommonProductMasterTypes';

interface Props {
	toggleModal: () => void;
	isOpen: boolean;
	clickedRowData: CommonProductMasterCreateFormData;
	onConfirmCommonProductMasterTableData: (values: CommonProductMasterCreateFormData) => void;
	polyBagData: ShippingScheduleTypeDrp[];
}

function EditCommonProductMasterTableData({
	isOpen,
	toggleModal,
	clickedRowData,
	onConfirmCommonProductMasterTableData,
	polyBagData
}: Props) {
	const { t } = useTranslation('commonProductMaster');

	const schema = yup.object().shape({
		minNumOfProduct: yup
			.number()
			.integer('Min Num Of Products must be an integer')
			.typeError('Min Num Of Products must be a number')
			.positive('Min Num Of Products must be a positive number'),
		maxNumOfProduct: yup
			.number()
			.integer('Max Num Of Products must be an integer')
			.typeError('Max Num Of Products must be a number')
			.positive('Max Num Of Products must be a positive number')
	});

	const onSubmit = (values: { minNumOfProduct?: string; maxNumOfProduct?: string }) => {
		if (values.minNumOfProduct && values.maxNumOfProduct) {
			if (values.maxNumOfProduct < values.minNumOfProduct) {
				toast.error('Max Num Of Products must be greater than or equal to Min Num Of Products');
				return;
			}

			const data: CommonProductMasterCreateFormData = {
				...clickedRowData,
				minNumOfProduct: values.minNumOfProduct,
				maxNumOfProduct: values.maxNumOfProduct
			};

			onConfirmCommonProductMasterTableData(data);
		}
	};

	return (
		<Dialog
			fullWidth
			open={isOpen}
			maxWidth="sm"
			onClose={toggleModal}
			// PaperProps={{ style: { top: '40px', margin: 0, position: 'absolute' } }}
		>
			<DialogTitle className="pb-0">
				<h6 className="text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-400">
					Edit Min Num And Max Num QTY Per Bag
				</h6>
			</DialogTitle>
			<DialogContent>
				<Formik
					initialValues={{
						polyBagSize: clickedRowData?.polyBagSizeId || '',
						minNumOfProduct: clickedRowData?.minNumOfProduct || '',
						maxNumOfProduct: clickedRowData?.maxNumOfProduct || ''
					}}
					onSubmit={onSubmit}
					enableReinitialize
					validationSchema={schema}
				>
					{({ dirty, isValid, values, errors, touched, setFieldValue }) => (
						<Form>
							<Grid
								container
								spacing={2}
								className="pt-[10px]"
							>
								<Grid
									item
									md={12}
									sm={12}
									xs={12}
									className="formikFormField pt-[5px!important]"
								>
									<Typography>
										{t('Poly Bag / Volume (cm³)')}
										<span className="text-red"> *</span>
									</Typography>
									<FormDropdown
										name="polyBagSize"
										id="polyBagSize"
										placeholder=""
										optionsValues={polyBagData}
										disabled
									/>
								</Grid>

								<Grid
									item
									md={12}
									sm={12}
									xs={12}
									className="formikFormField pt-[5px!important]"
								>
									<Typography>
										{t('Min Num Of Products')}
										<span className="text-red"> *</span>
									</Typography>
									<Field
										type="number"
										disabled={false}
										name="minNumOfProduct"
										component={TextFormField}
										fullWidth
										size="small"
									/>
								</Grid>
								<Grid
									item
									md={12}
									sm={12}
									xs={12}
									className="formikFormField pt-[5px!important]"
								>
									<Typography>
										{t('Max Num Of Products')}
										<span className="text-red"> *</span>
									</Typography>
									<Field
										type="number"
										disabled={false}
										name="maxNumOfProduct"
										component={TextFormField}
										fullWidth
										size="small"
									/>
								</Grid>
							</Grid>
							<Grid
								item
								md={12}
								sm={12}
								xs={12}
								className="flex justify-end items-center gap-[10px] pt-[10px!important]"
							>
								<Button
									className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
									onClick={toggleModal}
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
						</Form>
					)}
				</Formik>
			</DialogContent>
		</Dialog>
	);
}

export default EditCommonProductMasterTableData;
