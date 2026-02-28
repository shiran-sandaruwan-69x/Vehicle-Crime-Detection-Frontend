import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { CircularProgress, Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import TextFormField from '../../../../../common/FormComponents/FormTextField';
import FormDropdown from '../../../../../common/FormComponents/FormDropdown';
import {
	ModifiedPackingMaterialData,
	PackingMeterialCompType,
	PackingMeterialSubmitData,
	UnitOfMeasure,
	UnitOfMeasureType
} from '../box-charge-types/BoxChargeTypes';
import {
	Category,
	ModifiedCategoryData
} from '../../category-nanagement/category-nanagement-types/CategoryManagementTypes';
import {
	createBoxCharge,
	getAllUnitOfMeasureWithOutPagination,
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

function PackingMeterialComp({ clickedRowData, compType, getBoxCharge, toggleModal }: Props) {
	const { t } = useTranslation('boxCharge');
	const [isUnitOfMeasure, setUnitOfMeasure] = useState([]);
	const [isNewBoxCompDialogFormDataLoading, setNewBoxCompDialogFormDataLoading] = useState(false);

	const schema = yup.object().shape({
		packingMaterialsName: yup.string().required('Packing materials name is required'),
		unitOfMeasure: yup.string().required('Unit of measure is required'),
		noOfUnits: yup
			.number()
			.required('Number of units is required')
			.positive('Only Positive numbers are allowed')
			.test('is-positive', 'Number of units must be greater than zero', (value) => value > 0),
		price: yup
			.number()
			.required('Price is required')
			.positive('Only Positive numbers are allowed')
			.test('is-positive', 'Number of units must be greater than zero', (value) => value > 0)
	});

	useEffect(() => {
		getAllUnitOfMeasure();
	}, []);

	const getAllUnitOfMeasure = async () => {
		const response: UnitOfMeasureType = await getAllUnitOfMeasureWithOutPagination();
		const data1: UnitOfMeasure[] = response.data;
		const modifiedData: ModifiedCategoryData[] = data1.map((item: Category) => ({
			value: item.id,
			label: item.name
		}));
		setUnitOfMeasure(modifiedData);
	};

	const handleClearForm = (resetForm: FormikHelpers<PackingMeterialSubmitData>['resetForm']) => {
		resetForm({
			values: {
				packingMaterialsName: '',
				unitOfMeasure: '',
				noOfUnits: '',
				price: ''
			}
		});
	};

	const onSubmit = async (values: PackingMeterialCompType) => {
		setNewBoxCompDialogFormDataLoading(true);
		const data = {
			packing_type_id: 4,
			length: null,
			width: null,
			height: null,
			bottom_area: null,
			volume: null,
			name: values.packingMaterialsName,
			charge: null,
			diameter: null,
			incremental_height: null,
			lid_diameter: null,
			lid_height: null,
			lid_incremental_height: null,
			floor_area_of_lid: null,
			volume_of_lid: null,
			unit_of_measure_id: values.unitOfMeasure,
			unit_price: values.price,
			no_of_units: values.noOfUnits,
			is_active: true
		};

		if (clickedRowData.id) {
			const id = clickedRowData.id ? clickedRowData.id : '';
			try {
				const response = await updateBoxCharge(data, id);
				getBoxCharge();
				setNewBoxCompDialogFormDataLoading(false);
				toggleModal();
				toast.success('Updated Successfully');
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
				toggleModal();
				toast.success('Created Successfully');
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
					packingMaterialsName: clickedRowData.name ? clickedRowData.name : '',
					unitOfMeasure: clickedRowData.unit_of_measure_id ? clickedRowData.unit_of_measure_id : '',
					noOfUnits: clickedRowData.no_of_units ? clickedRowData.no_of_units : '',
					price: clickedRowData.unit_price ? clickedRowData.unit_price : ''
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
									{t('PACKING_MATERIALS_NAME')}
									<span className="text-red"> *</span>
								</Typography>
								<Field
									name="packingMaterialsName"
									placeholder=""
									component={TextFormField}
									fullWidth
									disabled={compType === 'view'}
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
									{t('UNIT_OF_MEASURE')}
									<span className="text-red"> *</span>
								</Typography>
								<FormDropdown
									name="unitOfMeasure"
									id="unitOfMeasure"
									placeholder=""
									optionsValues={isUnitOfMeasure}
									disabled={false}
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
									{t('NO_OF_UNITS')}
									<span className="text-red"> *</span>
								</Typography>
								<Field
									name="noOfUnits"
									type="number"
									placeholder="No Of Units"
									component={TextFormField}
									fullWidth
									disabled={compType === 'view'}
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
									{t('Price ($)')}
									<span className="text-red"> *</span>
								</Typography>
								<Field
									name="price"
									placeholder=""
									type="number"
									component={TextFormField}
									fullWidth
									disabled={compType === 'view'}
									size="small"
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

export default PackingMeterialComp;
