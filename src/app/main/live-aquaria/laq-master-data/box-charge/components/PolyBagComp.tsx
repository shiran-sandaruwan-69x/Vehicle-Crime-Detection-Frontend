import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { Field, Form, Formik, FormikHelpers, FormikProps } from 'formik';
import { CircularProgress, Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import TextFormField from '../../../../../common/FormComponents/FormTextField';
import CustomFormTextField from '../../../../../common/FormComponents/CustomFormTextField';
import { ModifiedPackingMaterialData, PolyBagData, PolyBagSubmitData } from '../box-charge-types/BoxChargeTypes';
import {
	createBoxCharge,
	updateBoxCharge
} from '../../../../../axios/services/live-aquaria-services/master-data-services/MasterDataServices';

interface ErrorResponse {
	response?: {
		data?: {
			message?: string;
		};
	};
}
interface Props {
	clickedRowData: ModifiedPackingMaterialData;
	compType: string;
	getBoxCharge: () => void;
	toggleModal: () => void;
}

function PolyBagComp({ clickedRowData, compType, getBoxCharge, toggleModal }: Props) {
	const { t } = useTranslation('boxCharge');
	const [isNewBoxCompDialogFormDataLoading, setNewBoxCompDialogFormDataLoading] = useState(false);

	const schema = yup.object().shape({
		length: yup
			.number()
			.required('Length is required')
			.positive('Only Positive numbers are allowed')
			.test('is-positive', 'Number of units must be greater than zero', (value) => value > 0),
		width: yup
			.number()
			.required('Width is required')
			.positive('Only Positive numbers are allowed')
			.test('is-positive', 'Number of units must be greater than zero', (value) => value > 0),
		height: yup
			.number()
			.required('Height is required')
			.positive('Only Positive numbers are allowed')
			.test('is-positive', 'Number of units must be greater than zero', (value) => value > 0),
		bottomArea: yup.number().required('Bottom area is required'),
		boxVolume: yup.number().required('Box volume is required'),
		polyBagName: yup.string().required('Poly Bag name is required'),
		polyBagCharge: yup
			.number()
			.required('Poly Bag charge is required')
			.positive('Only Positive numbers are allowed')
			.test('is-positive', 'Number of units must be greater than zero', (value) => value > 0)
	});

	const handleClearForm = (resetForm: FormikHelpers<PolyBagData>['resetForm']) => {
		resetForm({
			values: {
				length: '',
				width: '',
				height: '',
				bottomArea: '',
				boxVolume: '',
				polyBagName: '',
				polyBagCharge: ''
			}
		});
	};

	const changeWidth = async (value, form: FormikProps<PolyBagSubmitData>) => {
		form.setFieldValue('width', value);

		const { length } = form.values;
		const { height } = form.values;

		const calArea = length * value;
		const calVolume = length * height * value;

		form.setFieldValue('bottomArea', calArea.toFixed(2));
		form.setFieldValue('boxVolume', calVolume.toFixed(2));
	};

	const changeLength = async (value, form: FormikProps<PolyBagSubmitData>) => {
		form.setFieldValue('length', value);
		const { width } = form.values;
		const { height } = form.values;

		const calArea = width * value;
		const calVolume = width * height * value;

		form.setFieldValue('bottomArea', calArea.toFixed(2));
		form.setFieldValue('boxVolume', calVolume.toFixed(2));
	};

	const changeHeight = async (value, form: FormikProps<PolyBagSubmitData>) => {
		form.setFieldValue('height', value);
		const { length } = form.values;
		const { width } = form.values;
		const calVolume = length * width * value;
		form.setFieldValue('boxVolume', calVolume.toFixed(2));
	};

	const onSubmit = async (values: PolyBagData) => {
		setNewBoxCompDialogFormDataLoading(true);
		const data = {
			packing_type_id: 2,
			length: values.length,
			width: values.width,
			height: values.height,
			bottom_area: values.bottomArea,
			volume: values.boxVolume,
			name: values.polyBagName,
			charge: values.polyBagCharge,
			diameter: null,
			incremental_height: null,
			lid_diameter: null,
			lid_height: null,
			lid_incremental_height: null,
			floor_area_of_lid: null,
			volume_of_lid: null,
			unit_of_measure_id: null,
			unit_price: null,
			no_of_units: null,
			is_active: true
		};

		if (clickedRowData.id) {
			const id = clickedRowData.id ? clickedRowData.id : '';
			try {
				const response = await updateBoxCharge(data, id);
				getBoxCharge();
				setNewBoxCompDialogFormDataLoading(false);
				toast.success('Updated Successfully');
				toggleModal();
			} catch (error) {
				setNewBoxCompDialogFormDataLoading(false);
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
			try {
				const response = await createBoxCharge(data);
				getBoxCharge();
				setNewBoxCompDialogFormDataLoading(false);
				toast.success('Created Successfully');
				toggleModal();
			} catch (error) {
				setNewBoxCompDialogFormDataLoading(false);
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

	return (
		<div className="min-w-full max-w-[100vw]">
			<Formik
				initialValues={{
					length: clickedRowData.length ? clickedRowData.length : '',
					width: clickedRowData.width ? clickedRowData.width : '',
					height: clickedRowData.height ? clickedRowData.height : '',
					bottomArea: clickedRowData.bottom_area ? clickedRowData.bottom_area : '',
					boxVolume: clickedRowData.volume ? clickedRowData.volume : '',
					polyBagName: clickedRowData.name ? clickedRowData.name : '',
					polyBagCharge: clickedRowData.charge ? clickedRowData.charge : ''
				}}
				validationSchema={schema}
				onSubmit={onSubmit}
			>
				{({ values, setFieldValue, isValid, resetForm }) => (
					<Form>
						<Grid
							container
							spacing={2}
							className="pt-0"
						>
							<Grid
								item
								lg={3}
								md={4}
								sm={6}
								xs={12}
								className="formikFormField pt-[5px!important]"
							>
								<Typography className="formTypography">
									{t('LENGTH')}
									<span className="text-red"> *</span>
								</Typography>
								<CustomFormTextField
									name="length"
									id="length"
									type="number"
									placeholder=""
									disabled={compType === 'view'}
									changeInput={changeLength}
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
									{t('WIDTH')}
									<span className="text-red"> *</span>
								</Typography>
								<CustomFormTextField
									name="width"
									id="width"
									type="number"
									placeholder=""
									disabled={compType === 'view'}
									changeInput={changeWidth}
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
									{t('HEIGHT')}
									<span className="text-red"> *</span>
								</Typography>
								<CustomFormTextField
									name="height"
									id="height"
									type="number"
									placeholder=""
									disabled={compType === 'view'}
									changeInput={changeHeight}
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
									{t('BOTTOM_AREA')}
									<span className="text-red"> *</span>
								</Typography>
								<Field
									name="bottomArea"
									placeholder=""
									component={TextFormField}
									fullWidth
									size="small"
									disabled
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
									{t('BOX_VOLUME')}
									<span className="text-red"> *</span>
								</Typography>
								<Field
									name="boxVolume"
									placeholder=""
									component={TextFormField}
									fullWidth
									size="small"
									disabled
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
									{t('POLY_BAG_NAME')}
									<span className="text-red"> *</span>
								</Typography>
								<Field
									name="polyBagName"
									placeholder=""
									component={TextFormField}
									fullWidth
									size="small"
									disabled={compType === 'view'}
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
									{t('POLY_BAG_CHARGE')} ($)
									<span className="text-red"> *</span>
								</Typography>
								<Field
									name="polyBagCharge"
									placeholder=""
									component={TextFormField}
									fullWidth
									type="number"
									size="small"
									disabled={compType === 'view'}
								/>
							</Grid>

							<Grid
								item
								md={12}
								sm={12}
								xs={12}
								className="flex justify-end items-center gap-[10px] pt-[10px!important]"
							>
								{compType === 'view' ? null : (
									<Button
										className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
										type="submit"
										variant="contained"
										size="medium"
										disabled={compType === 'view'}
									>
										{compType === 'edit' ? 'Update' : 'Save'}
										{isNewBoxCompDialogFormDataLoading ? (
											<CircularProgress
												className="text-white ml-[5px]"
												size={24}
											/>
										) : null}
									</Button>
								)}
								{compType === 'view' ? null : (
									<Button
										className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
										type="button"
										variant="contained"
										size="medium"
										disabled={compType === 'view'}
										onClick={() => handleClearForm(resetForm)}
									>
										{t('Reset')}
									</Button>
								)}
								<Button
									onClick={toggleModal}
									className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
								>
									Close
								</Button>
							</Grid>
						</Grid>
					</Form>
				)}
			</Formik>
		</div>
	);
}

export default PolyBagComp;
