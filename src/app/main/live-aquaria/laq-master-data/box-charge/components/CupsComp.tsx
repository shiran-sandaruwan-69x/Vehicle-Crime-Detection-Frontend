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
import {
	CupCompSubmitData,
	CupCompSubmitFormData,
	ModifiedPackingMaterialData
} from '../box-charge-types/BoxChargeTypes';
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

function CupsComp({ clickedRowData, compType, getBoxCharge, toggleModal }: Props) {
	const { t } = useTranslation('boxCharge');
	const [isNewBoxCompDialogFormDataLoading, setNewBoxCompDialogFormDataLoading] = useState(false);

	const schema = yup.object().shape({
		diameter1: yup
			.number()
			.required('Diameter is required')
			.positive('Only Positive numbers are allowed')
			.test('is-positive', 'Number of units must be greater than zero', (value) => value > 0),
		cupHeight: yup
			.number()
			.required('Cup height is required')
			.positive('Only Positive numbers are allowed')
			.test('is-positive', 'Number of units must be greater than zero', (value) => value > 0),
		incrementalHeight1: yup
			.number()
			.required('Incremental height is required')
			.positive('Only Positive numbers are allowed')
			.test('is-positive', 'Number of units must be greater than zero', (value) => value > 0),
		diameter2: yup
			.number()
			.required('Diameter is required')
			.positive('Only Positive numbers are allowed')
			.test('is-positive', 'Number of units must be greater than zero', (value) => value > 0),
		lidHeight: yup
			.number()
			.required('Lid height is required')
			.positive('Only Positive numbers are allowed')
			.test('is-positive', 'Number of units must be greater than zero', (value) => value > 0),
		incrementalHeight2: yup
			.number()
			.required('Incremental height is required')
			.positive('Only Positive numbers are allowed')
			.test('is-positive', 'Number of units must be greater than zero', (value) => value > 0),
		forAreaOfCup: yup.number().required('Area of the cup is required'),
		volumeOfCup: yup.number().required('Volume of the cup is required'),
		forAreaOfLid: yup.number().required('Area of the lid is required'),
		volumeOfLid: yup.number().required('Volume of the lid is required'),
		cupName: yup.string().required('Cup name is required'),
		cupCharge: yup
			.number()
			.required('Cup charge is required')
			.positive('Only Positive numbers are allowed')
			.test('is-positive', 'Number of units must be greater than zero', (value) => value > 0)
	});

	const handleClearForm = (resetForm: FormikHelpers<CupCompSubmitFormData>['resetForm']) => {
		resetForm({
			values: {
				diameter1: '',
				cupHeight: '',
				incrementalHeight1: '',
				diameter2: '',
				lidHeight: '',
				incrementalHeight2: '',
				forAreaOfCup: '',
				volumeOfCup: '',
				forAreaOfLid: '',
				volumeOfLid: '',
				cupName: '',
				cupCharge: ''
			}
		});
	};

	const changeDiameter1 = async (value: number, form: FormikProps<CupCompSubmitData>) => {
		form.setFieldValue('diameter1', value);
		const { cupHeight } = form.values;
		const r: number = value / 2;
		const calculatedVolume = r * r * 3.14;
		const volumeOfCup = calculatedVolume * cupHeight;
		form.setFieldValue('forAreaOfCup', calculatedVolume.toFixed(2));
		form.setFieldValue('volumeOfCup', volumeOfCup.toFixed(2));
	};

	const changeDiameter2 = async (value: number, form: FormikProps<CupCompSubmitData>) => {
		form.setFieldValue('diameter2', value);
		const { lidHeight } = form.values;
		const r = value / 2;
		const calculatedVolume = r * r * 3.14;
		const volumeOfCup = calculatedVolume * lidHeight;
		form.setFieldValue('forAreaOfLid', calculatedVolume.toFixed(2));
		form.setFieldValue('volumeOfLid', volumeOfCup.toFixed(2));
	};

	const changeCupHeight = async (value: number, form: FormikProps<CupCompSubmitData>) => {
		form.setFieldValue('cupHeight', value);
		const { forAreaOfCup } = form.values;
		const volumeOfCup = forAreaOfCup * value;
		form.setFieldValue('volumeOfCup', volumeOfCup.toFixed(2));
	};

	const changeLidHeight = async (value: number, form: FormikProps<CupCompSubmitData>) => {
		form.setFieldValue('lidHeight', value);
		const { forAreaOfLid } = form.values;
		const volumeOfLid = forAreaOfLid * value;
		form.setFieldValue('volumeOfLid', volumeOfLid.toFixed(2));
	};

	const onSubmit = async (values: CupCompSubmitFormData) => {
		setNewBoxCompDialogFormDataLoading(true);
		const data = {
			packing_type_id: 3,
			length: null,
			width: null,
			height: values.cupHeight,
			bottom_area: values.forAreaOfCup,
			volume: values.volumeOfCup,
			name: values.cupName,
			charge: values.cupCharge,
			diameter: values.diameter1,
			incremental_height: values.incrementalHeight1,
			lid_diameter: values.diameter2,
			lid_height: values.lidHeight,
			lid_incremental_height: values.incrementalHeight2,
			floor_area_of_lid: values.forAreaOfLid,
			volume_of_lid: values.volumeOfLid,
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
					diameter1: clickedRowData.diameter ? clickedRowData.diameter : '',
					cupHeight: clickedRowData.height ? clickedRowData.height : '',
					incrementalHeight1: clickedRowData.incremental_height ? clickedRowData.incremental_height : '',
					diameter2: clickedRowData.lid_diameter ? clickedRowData.lid_diameter : '',
					lidHeight: clickedRowData.lid_height ? clickedRowData.lid_height : '',
					incrementalHeight2: clickedRowData.lid_incremental_height
						? clickedRowData.lid_incremental_height
						: '',
					forAreaOfCup: clickedRowData.bottom_area ? clickedRowData.bottom_area : '',
					volumeOfCup: clickedRowData.volume ? clickedRowData.volume : '',
					forAreaOfLid: clickedRowData.floor_area_of_lid ? clickedRowData.floor_area_of_lid : '',
					volumeOfLid: clickedRowData.volume_of_lid ? clickedRowData.volume_of_lid : '',
					cupName: clickedRowData.name ? clickedRowData.name : '',
					cupCharge: clickedRowData.charge ? clickedRowData.charge : ''
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
								xs={12}
								className="formikFormField pt-[5px!important]"
							>
								<Typography className="text-[15px]">{t('Cup Dimensions')}</Typography>
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
									{t('DIAMETER')}
									<span className="text-red"> *</span>
								</Typography>
								<CustomFormTextField
									name="diameter1"
									id="diameter1"
									type="number"
									placeholder=""
									disabled={compType === 'view'}
									changeInput={changeDiameter1}
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
									{t('CUP_HEIGHT')}
									<span className="text-red"> *</span>
								</Typography>
								<CustomFormTextField
									name="cupHeight"
									id="cupHeight"
									type="number"
									placeholder=""
									disabled={compType === 'view'}
									changeInput={changeCupHeight}
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
									{t('INCREMENTAL_HEIGHT')}
									<span className="text-red"> *</span>
								</Typography>
								<Field
									name="incrementalHeight1"
									placeholder=""
									type="number"
									component={TextFormField}
									disabled={compType === 'view'}
									fullWidth
									size="small"
								/>
							</Grid>
							<Grid
								item
								xs={12}
								className="formikFormField pt-[10px!important]"
							>
								<hr />
							</Grid>
							<Grid
								item
								xs={12}
								className="formikFormField pt-[5px!important]"
							>
								<Typography className="text-[15px]">{t('Lid Dimensions')}</Typography>
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
									{t('DIAMETER')}
									<span className="text-red"> *</span>
								</Typography>
								<CustomFormTextField
									name="diameter2"
									id="diameter2"
									type="number"
									placeholder=""
									disabled={compType === 'view'}
									changeInput={changeDiameter2}
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
									{t('LID_HEIGHT')}
									<span className="text-red"> *</span>
								</Typography>
								<CustomFormTextField
									name="lidHeight"
									id="lidHeight"
									type="number"
									placeholder=""
									disabled={compType === 'view'}
									changeInput={changeLidHeight}
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
									{t('INCREMENTAL_HEIGHT')}
									<span className="text-red"> *</span>
								</Typography>
								<Field
									name="incrementalHeight2"
									placeholder=""
									type="number"
									component={TextFormField}
									fullWidth
									size="small"
									disabled={compType === 'view'}
								/>
							</Grid>

							<Grid
								item
								xs={12}
								className="formikFormField pt-[10px!important]"
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
								<Typography className="formTypography">
									{t('FOR_AREA_OF_CUP')}
									<span className="text-red"> *</span>
								</Typography>
								<Field
									name="forAreaOfCup"
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
									{t('VOLUME_OF_CUP')}
									<span className="text-red"> *</span>
								</Typography>
								<Field
									name="volumeOfCup"
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
									{t('FOR_AREA_OF_LID')}
									<span className="text-red"> *</span>
								</Typography>
								<Field
									name="forAreaOfLid"
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
									{t('VOLUME_OF_LID')}
									<span className="text-red"> *</span>
								</Typography>
								<Field
									name="volumeOfLid"
									placeholder=""
									component={TextFormField}
									fullWidth
									size="small"
									disabled
								/>
							</Grid>

							<Grid
								item
								xs={12}
								className="formikFormField pt-[10px!important]"
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
								<Typography className="formTypography">
									{t('CUP_NAME')}
									<span className="text-red"> *</span>
								</Typography>
								<Field
									name="cupName"
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
									{t('CUP_CHARGE')} ($)
									<span className="text-red"> *</span>
								</Typography>
								<Field
									name="cupCharge"
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

export default CupsComp;
