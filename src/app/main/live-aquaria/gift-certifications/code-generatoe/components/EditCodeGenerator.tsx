import {
	Button,
	Checkbox, CircularProgress,
	Dialog,
	DialogContent,
	FormControlLabel,
	Grid,
	Radio,
	RadioGroup,
	Typography
} from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import React, { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { updateCodeFormat } from '../../../../../axios/services/live-aquaria-services/gift-certifications/codeGenerator';
import FormDropdown from '../../../../../common/FormComponents/FormDropdown';
import TextFormField from '../../../../../common/FormComponents/FormTextField';

interface NewCodeGeneratorProps {
	isOpen: boolean;
	toggleModal: () => void;
	clickedRowData: CodeData;
	fetchAllGeneratedCodeValues: () => void;
}

interface CodeComponent {
	id: number;
	type: string;
	format: string;
	order: string;
}

interface FormValues {
	codeName: string;
	description: string;
	codePrefix: string;
	yearFormat: string;
	monthFormat: string;
	noOfDigits: number;
	code_prefix_order?: string;
	year_order?: string;
	month_order?: string;
	no_of_digits_order?: string;
}

interface CodeData {
	id: number;
	name: string;
	description: string;
	format: string;
	components: CodeComponent[];
	created_at: string;
	full_code: string;
	code_name: string;
	created_date: string;
	no_of_digits: string;
	active: boolean;
	tableData: {
		id: number;
	};
}

interface ErrorResponse {
	response?: {
		data?: {
			message?: string;
		};
	};
}

function EditCodeGenerator({ isOpen, toggleModal, clickedRowData,fetchAllGeneratedCodeValues }: NewCodeGeneratorProps) {
	const { t } = useTranslation('giftCertifications');
	const [isYearEnabled, setIsYearEnabled] = useState(true);
	const [isMonthEnabled, setIsMonthEnabled] = useState(true);
	const [isDataLoading, setDataLoading] = useState(false);
	const currentDate = new Date();
	const currentYear = currentDate.getFullYear().toString();
	const currentMonthNumber = currentDate.getMonth() + 1;
	const currentMonthName = currentDate.toLocaleString('default', { month: 'short' }).toUpperCase();

	const handleYearCheckboxChange = (
		event: ChangeEvent<HTMLInputElement>,
		setFieldValue: (field: string, value: any) => void
	) => {
		const { checked } = event.target;
		setIsYearEnabled(checked);

		if (!checked) {
			setFieldValue('yearFormat', '');
			setFieldValue('year_order', '');
		}
	};

	const handleMonthCheckboxChange = (
		event: ChangeEvent<HTMLInputElement>,
		setFieldValue: (field: string, value: any) => void
	) => {
		const { checked } = event.target;
		setIsMonthEnabled(checked);

		if (!checked) {
			setFieldValue('monthFormat', '');
			setFieldValue('month_order', '');
		}
	};

	const generateCode = (values: FormValues) => {
		const codeParts = ['', '', '', ''];

		if (values.code_prefix_order) {
			codeParts[parseInt(values.code_prefix_order, 10) - 1] = values.codePrefix || '';
		}

		if (values.year_order) {
			codeParts[parseInt(values.year_order, 10) - 1] =
				values.yearFormat === 'YYYY' ? currentYear : currentYear.slice(-2);
		}

		if (values.month_order) {
			codeParts[parseInt(values.month_order, 10) - 1] =
				values.monthFormat === 'Name' ? currentMonthName : currentMonthNumber.toString().padStart(2, '0');
		}

		if (values.no_of_digits_order) {
			codeParts[parseInt(values.no_of_digits_order, 10) - 1] = '0'.repeat(values.noOfDigits);
		}

		return codeParts.join('');
	};

	const createNewCode = async (values: FormValues, formikHelpers: FormikHelpers<FormValues>) => {
		setDataLoading(true);
		try {
			const data = {
				name: values.codeName,
				description: values.description,
				format: generateCode(values),
				is_active:clickedRowData?.is_active ?? 1,
				components: [
					{
						type: 'Code Prefix',
						format: values.codePrefix,
						order: values.code_prefix_order
					},
					{
						type: 'Year',
						format: values.yearFormat,
						order: values.year_order
					},
					{
						type: 'Month',
						format: values.monthFormat.toString(),
						order: values.month_order.toString()
					},
					{
						type: 'Digits',
						format: values.noOfDigits.toString(),
						order: values.no_of_digits_order.toString()
					}
				] as CodeComponent[]
			};

			await updateCodeFormat(clickedRowData.id, data);
			setDataLoading(false);
			toast.success('Updated successfully');
			fetchAllGeneratedCodeValues();
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
		} finally {
			formikHelpers.setSubmitting(false);
		}
	};

	const schema = yup.object().shape({
		codeName: yup.string().required('Code Name is required'),
		noOfDigits: yup.number().required('Number of Digits is required')
	});

	return (
		<Dialog
			fullWidth
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
					Edit Generated Code
				</h6>
			</DialogTitle>
			<DialogContent>
				<Formik<FormValues>
					initialValues={{
						codeName: clickedRowData?.name || '',
						description: clickedRowData?.description || '',
						codePrefix:
							clickedRowData?.components.find((comp: CodeComponent) => comp.type === 'Code Prefix')
								?.format || '',
						yearFormat:
							clickedRowData?.components.find((comp: CodeComponent) => comp.type === 'Year')?.format ||
							'YYYY',
						monthFormat:
							clickedRowData?.components.find((comp: CodeComponent) => comp.type === 'Month')?.format ||
							'Name',
						noOfDigits:
							parseInt(
								clickedRowData?.components.find((comp: CodeComponent) => comp.type === 'Digits')
									?.format,
								10
							) || 5,
						code_prefix_order:
							clickedRowData?.components.find((comp: CodeComponent) => comp.type === 'Code Prefix')
								?.order || '',
						year_order:
							clickedRowData?.components.find((comp: CodeComponent) => comp.type === 'Year')?.order || '',
						month_order:
							clickedRowData?.components.find((comp: CodeComponent) => comp.type === 'Month')?.order ||
							'',
						no_of_digits_order:
							clickedRowData?.components.find((comp: CodeComponent) => comp.type === 'Digits')?.order ||
							''
					}}
					onSubmit={createNewCode}
					validationSchema={schema}
					enableReinitialize
				>
					{({ values, setFieldValue }) => {
						const getOrderOptions = (currentFieldName: string) => {
							const allOrders = ['1', '2', '3', '4'];
							const selectedOrders = [
								{
									field: 'code_prefix_order',
									value: values.code_prefix_order
								},
								{ field: 'year_order', value: values.year_order },
								{
									field: 'month_order',
									value: values.month_order
								},
								{
									field: 'no_of_digits_order',
									value: values.no_of_digits_order
								}
							];

							const otherSelectedValues = selectedOrders
								.filter((item) => item.field !== currentFieldName && item.value)
								.map((item) => item.value);

							return allOrders.map((order) => ({
								value: order,
								label: order,
								disabled: otherSelectedValues.includes(order)
							}));
						};

						return (
							<Form>
								<Grid
									container
									spacing={2}
									className="!pt-[10px]"
								>
									<Grid
										item
										md={6}
										sm={6}
										xs={12}
										className="pt-[5px!important]"
									>
										<Typography>
											{t('CODE_NAME')}
											<span className="text-red"> *</span>
										</Typography>
										<Field
											name="codeName"
											component={TextFormField}
											fullWidth
											size="small"
										/>
									</Grid>
									<Grid
										item
										md={6}
										sm={6}
										xs={12}
										className="pt-[5px!important]"
									>
										<Typography>{t('DESCRIPTION')}</Typography>
										<Field
											name="description"
											component={TextFormField}
											fullWidth
											size="small"
										/>
									</Grid>
								</Grid>

								<Grid
									container
									spacing={2}
									className="!pt-[15px]"
								>
									<Grid
										item
										xs={12}
										sm={12}
										md={12}
									/>
									<Grid
										item
										md={6}
										sm={6}
										xs={12}
										className="pt-[5px!important]"
									>
										<div className="flex justify-between items-center gap-[5px]">
											<Typography>{t('CODE_PREFIX')}</Typography>
											<FormControlLabel
												className="relative mr-0 my-[-10px] z-[1]"
												control={
													<Checkbox
														checked={values.codePrefix !== ''}
														onChange={(e) =>
															setFieldValue('codePrefix', e.target.checked ? 'CHR' : '')
														}
													/>
												}
												label="Code Prefix"
											/>
										</div>
										<div className="relative w-full z-[2]">
											<Field
												name="codePrefix"
												component={TextFormField}
												fullWidth
												size="small"
											/>
										</div>
									</Grid>
									<Grid
										item
										md={6}
										sm={6}
										xs={12}
										className="pt-[5px!important]"
									>
										<Typography>{t('CODE_PREFIX_ORDER')}</Typography>
										<FormDropdown
											name="code_prefix_order"
											id="code_prefix_order"
											placeholder=""
											optionsValues={getOrderOptions('code_prefix_order')}
										/>
									</Grid>
									<Grid
										item
										md={6}
										sm={6}
										xs={12}
										className="pt-[5px!important]"
									>
										<FormControlLabel
											className="relative mr-0 my-[-10px] z-[1]"
											control={
												<Checkbox
													checked={isYearEnabled}
													onChange={(e) => handleYearCheckboxChange(e, setFieldValue)}
												/>
											}
											label="Year"
										/>
										<RadioGroup
											row
											value={values.yearFormat}
											onChange={(e) => setFieldValue('yearFormat', e.target.value)}
										>
											<FormControlLabel
												value="YYYY"
												control={<Radio disabled={!isYearEnabled} />}
												label="YYYY"
											/>
											<FormControlLabel
												value="YY"
												control={<Radio disabled={!isYearEnabled} />}
												label="YY"
											/>
										</RadioGroup>
									</Grid>
									<Grid
										item
										md={6}
										sm={6}
										xs={12}
										className="pt-[5px!important]"
									>
										<Typography>{t('YEAR_ORDER')}</Typography>
										<FormDropdown
											name="year_order"
											id="year_order"
											placeholder=""
											optionsValues={getOrderOptions('year_order')}
											disabled={!isYearEnabled}
										/>
									</Grid>
									<Grid
										item
										md={6}
										sm={6}
										xs={12}
										className="pt-[5px!important]"
									>
										<FormControlLabel
											className="relative mr-0 my-[-10px] z-[1]"
											control={
												<Checkbox
													checked={isMonthEnabled}
													onChange={(e) => handleMonthCheckboxChange(e, setFieldValue)}
												/>
											}
											label="Month"
										/>
										<RadioGroup
											row
											value={values.monthFormat}
											onChange={(e) => setFieldValue('monthFormat', e.target.value)}
										>
											<FormControlLabel
												value="Name"
												control={<Radio disabled={!isMonthEnabled} />}
												label={`Name (ex: ${currentMonthName})`}
											/>
											<FormControlLabel
												value="No"
												control={<Radio disabled={!isMonthEnabled} />}
												label={`No (ex: ${currentMonthNumber.toString().padStart(2, '0')})`}
											/>
										</RadioGroup>
									</Grid>
									<Grid
										item
										md={6}
										sm={6}
										xs={12}
										className="pt-[5px!important]"
									>
										<Typography>{t('MONTH_ORDER')}</Typography>
										<FormDropdown
											name="month_order"
											id="month_order"
											placeholder=""
											optionsValues={getOrderOptions('month_order')}
											disabled={!isMonthEnabled}
										/>
									</Grid>
									<Grid
										item
										md={6}
										sm={6}
										xs={12}
										className="pt-[5px!important]"
									>
										<Typography>{t('NO_OF_DIGITS')}</Typography>
										<Field
											name="noOfDigits"
											component={TextFormField}
											fullWidth
											type="number"
											size="small"
										/>
									</Grid>
									<Grid
										item
										md={6}
										sm={6}
										xs={12}
										className="pt-[5px!important]"
									>
										<Typography>
											{t('NO_OF_DIGITS_ORDER')}
											<span className="text-red"> *</span>
										</Typography>
										<FormDropdown
											id="no_of_digits_order"
											placeholder=""
											name="no_of_digits_order"
											optionsValues={getOrderOptions('no_of_digits_order')}
										/>
									</Grid>
									<Grid
										item
										xs={12}
										className="pt-[10px!important]"
									>
										<div className="text-center p-[15px] rounded-[6px] bg-gray-200">
											<Typography
												variant="h6"
												className="text-[14px] sm:text-[16px] lg:text-[18px]"
											>
												{generateCode(values)}
											</Typography>
										</div>
									</Grid>
								</Grid>

								<Grid
									container
									spacing={2}
									className="pt-[20px]"
								>
									<Grid
										item
										lg={12}
										md={12}
										sm={12}
										xs={12}
										className="flex justify-end items-start gap-[10px] pt-[26px!important] lg:pt-[10px!important]"
									>
										<Button
											type="reset"
											className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
											variant="contained"
											size="medium"
										>
											{t('CLEAR')}
										</Button>
										<Button
											type="submit"
											className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
											variant="contained"
											size="medium"
										>
											{t('Update')}
											{isDataLoading ? (
												<CircularProgress
													className="text-white ml-[5px]"
													size={24}
												/>
											) : null}
										</Button>
										<Button
											className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80 boxShadow"
											color="primary"
											onClick={toggleModal}
										>
											{t('Close')}
										</Button>
									</Grid>
								</Grid>
							</Form>
						);
					}}
				</Formik>
			</DialogContent>
		</Dialog>
	);
}

export default EditCodeGenerator;
