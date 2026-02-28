import {
	Box,
	Button,
	Checkbox,
	Chip,
	CircularProgress,
	Dialog,
	DialogContent,
	DialogTitle,
	FormControl,
	FormControlLabel,
	Grid,
	MenuItem,
	OutlinedInput,
	Select,
	Typography
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import axios, { AxiosResponse } from 'axios';
import { Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import {
	CREATE_SHIPPING_TYPE,
	GET_ALL_SHIPPING_METHODS
} from '../../../../../axios/services/live-aquaria-services/shipping-services/ShippingTypeService';
import TextFormField from '../../../../../common/FormComponents/FormTextField';
import {
	ShippingCreateType,
	ShippingMethodResponseWithOutPagination,
	ShippingMethodsObject,
	ShippingTypeModifiedData
} from '../types/ShippingTypes';

import { ShippingTypeDrp } from '../../shipping-methods/types/ShippingMethodsType';

interface ErrorResponse {
	response?: {
		data?: {
			message?: string;
		};
	};
}

interface Props {
	isOpen?: boolean;
	toggleModal?: () => void;
	clickedRowData: ShippingTypeModifiedData;
	fetchAllShippingTypes?: () => void;
	isTableMode: string;
}

function NewShippingTypeModel({ isOpen, toggleModal, clickedRowData, fetchAllShippingTypes, isTableMode }: Props) {
	const { t } = useTranslation('shippingTypes');
	const [isDataLoading, setDataLoading] = useState(false);
	const today = new Date().toISOString().split('T')[0];
	const [availableTypes, setAvailableTypes] = useState<ShippingTypeDrp[]>([]);
	const [selectedTypes, setSelectedTypes] = useState([]);

	const schema = yup.object().shape({
		shippingType: yup.string().required(t('Shipping Type name is required')),
		shipping_type_id: yup.array().of(yup.string()).min(1, t('Shipping Methods is required'))
	});

	useEffect(() => {
		fetchShippingTypes();
	}, []);

	const fetchShippingTypes = async () => {
		try {
			const response: AxiosResponse<ShippingMethodResponseWithOutPagination> = await axios.get(
				`${GET_ALL_SHIPPING_METHODS}?paginate=false`
			);
			const data: ShippingMethodsObject[] = response?.data?.data;
			const types = data.map((item: ShippingMethodsObject) => ({
				id: item.id,
				name: item.method,
				displayName: `${item.method} (${item.id})`
			}));
			setAvailableTypes(types);
			setSelectedTypes(clickedRowData?.shipping_method_ids);
		} catch (error) {
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

	const handleUpdateShippingType = async (values: ShippingCreateType) => {
		const convertedShippingMethodIds = values?.shipping_type_id?.map((id: string) => id.toString());
		const data = {
			name: values.shippingType ?? null,
			allow_transit_delay: values.allow_transit_delay ?? null,
			is_active: 1 ?? null,
			shipping_method_id: convertedShippingMethodIds ?? null
		};

		if (clickedRowData.id) {
			const id = clickedRowData.id ?? null;
			setDataLoading(true);
			try {
				const response: AxiosResponse<ShippingMethodResponseWithOutPagination> = await axios.put(
					`${CREATE_SHIPPING_TYPE}/${id}`,
					data
				);
				toast.success('Updated successfully');
				fetchAllShippingTypes();
				toggleModal();
				setDataLoading(false);
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
		} else {
			setDataLoading(true);
			try {
				const response: AxiosResponse<ShippingMethodResponseWithOutPagination> = await axios.post(
					`${CREATE_SHIPPING_TYPE}`,
					data
				);
				toast.success('Created successfully');
				fetchAllShippingTypes();
				toggleModal();
				setDataLoading(false);
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
		}
	};

	return (
		<Dialog
			open={isOpen}
			maxWidth="sm"
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
					{(() => {
						switch (isTableMode) {
							case 'view':
								return t('View');
							case 'edit':
								return t('Edit');
							default:
								return t('Create');
						}
					})()}{' '}
					{t('Shipping Type')}
				</h6>
			</DialogTitle>
			<DialogContent>
				<Formik
					initialValues={{
						shippingType: clickedRowData.shipping_type_name || '',
						create_date: clickedRowData.create_date || today,
						allow_transit_delay: clickedRowData.allow_transit_delay_type || false,
						shipping_type_id: selectedTypes || []
					}}
					onSubmit={(values: ShippingCreateType) => {
						handleUpdateShippingType(values);
					}}
					validationSchema={schema}
					enableReinitialize
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
									xs={12}
									className="formikFormField pt-[5px!important]"
								>
									<div className="flex flex-wrap sm:!flex-nowrap justify-between items-center gap-[10px]">
										<Typography className="formTypography">
											{t('Shipping Type Name')}
											<span className="text-red"> *</span>
										</Typography>
										<FormControlLabel
											disabled={isTableMode === 'view'}
											className="mr-0"
											name="allow_transit_delay"
											id="allow_transit_delay"
											control={
												<Checkbox
													color="primary"
													className="!pl-0 !py-0 hover:!bg-transparent"
												/>
											}
											label="Allow Transit Delay"
											checked={values.allow_transit_delay}
											onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
												setFieldValue('allow_transit_delay', event.target.checked)
											}
										/>
									</div>
									<Field
										disabled={isTableMode === 'view'}
										name="shippingType"
										component={TextFormField}
										fullWidth
										size="small"
										placeholder={t('')}
									/>
								</Grid>

								{/* <Grid
                  item
                  lg={4}
                  md={4}
                  sm={6}
                  xs={12}
                  className='formikFormField pt-[5px!important]'
                >
                  <Typography className='formTypography'>
                    {t('Created Date')}
                  </Typography>
                  <TextFormDateField
                    name='create_date'
                    type='date'
                    placeholder=''
                    id='create_date'
                    disabled
                  />
                </Grid> */}

								{/* <Grid
                  item
                  lg={4}
                  md={4}
                  sm={6}
                  xs={12}
                  className='pt-[5px!important] flex items-center gap-[5px]'
                >
                  <FormControlLabel
                    disabled={isTableMode === 'view'}
                    className='mt-[20px]'
                    name='allow_transit_delay'
                    id='allow_transit_delay'
                    control={<Checkbox color='primary' />}
                    label='Allow Transit Delay'
                    checked={values.allow_transit_delay}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      setFieldValue('allow_transit_delay', event.target.checked)
                    }
                  />
                </Grid> */}

								<Grid
									item
									xs={12}
									className="pt-[5px!important] sm:mb-[5px]"
								>
									<Typography className="formTypography">{t('Shipping Methods')}
										<span className="text-red"> *</span>
									</Typography>
									<FormControl
										size="small"
										fullWidth
										error={!!(touched.shipping_type_id && errors.shipping_type_id)}
									>
										<Select
											disabled={isTableMode === 'view'}
											labelId="shipping_type_id"
											id="shipping_type_id"
											multiple
											value={values.shipping_type_id}
											onChange={(event: SelectChangeEvent<string[]>) =>
												setFieldValue(
													'shipping_type_id',
													typeof event.target.value === 'string'
														? event.target.value.split(',')
														: event.target.value
												)
											}
											input={<OutlinedInput id="shipping_type_id" />}
											renderValue={(selected) => (
												<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '1px' }}>
													{selected.map((value) => {
														const matchedType = availableTypes.find(
															(type) => type.id === value
														);
														return (
															<Chip
																key={value}
																className="text-[10px] sm:text-[12px] text-gray-700 capitalize bg-gray-200"
																label={matchedType ? matchedType.name : value}
																size="small"
															/>
														);
													})}
												</Box>
											)}
										>
											{availableTypes.map((type) => (
												<MenuItem
													key={type.id}
													value={type.id}
												>
													{type.name}
												</MenuItem>
											))}
										</Select>
										{touched.shipping_type_id && errors.shipping_type_id && (
											<Typography
												variant="caption"
												color="error"
											>
												{errors.shipping_type_id}
											</Typography>
										)}
									</FormControl>
								</Grid>

								<Grid
									item
									xs={12}
									sm={6}
								>
									<Typography className="formTypography">
										{t('Created Date')} :{' '}
										<span className="inline-block font-600">
											{clickedRowData.create_date || today}
										</span>
									</Typography>
								</Grid>

								<Grid
									item
									sm={6}
									xs={12}
									className="flex justify-end items-start gap-[10px] pt-[10px!important]"
								>
									{isTableMode === 'view' ? null : (
										<Button
											type="submit"
											variant="contained"
											className="min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
										>
											{isTableMode === 'edit' ? 'Update' : 'Save'}
											{isDataLoading ? (
												<CircularProgress
													className="text-white ml-[5px]"
													size={24}
												/>
											) : null}
										</Button>
									)}
									<Button
										variant="contained"
										className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
										onClick={toggleModal}
									>
										{t('Close')}
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

export default NewShippingTypeModel;
