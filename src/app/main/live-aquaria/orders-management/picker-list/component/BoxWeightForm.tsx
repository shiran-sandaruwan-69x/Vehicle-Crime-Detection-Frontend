import React from 'react';
import {
	TextField,
	Button,
	Box,
	Typography,
	Chip,
	Grid,
	IconButton,
	CircularProgress,
	Select,
	OutlinedInput,
	MenuItem,
	FormControl
} from '@mui/material';
import { FieldArray, Formik, Form } from 'formik';
import * as Yup from 'yup';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import PrintIcon from '@mui/icons-material/Print';
import { SelectChangeEvent } from '@mui/material/Select';
import { FormikInitialValuesInterface } from '../Interfaces';

// Validation Schema
const validationSchema = Yup.object().shape({
	weights: Yup.array().of(
		Yup.object().shape({
			weight: Yup.number()
				.required('Weight is required')
				.min(1, 'Postive Weight is required')
				.max(100, 'Max Weight is 100 Kg'),
			height: Yup.number()
				.required('Height is required')
				.min(1, 'Postive Height is required')
				.max(100, 'Max Height is 100 Inch'),
			length: Yup.number()
				.required('Length is required')
				.min(1, 'Postive Length is required')
				.max(100, 'Max Length is 100 Inch'),
			width: Yup.number()
				.required('Width is required')
				.min(1, 'Postive Width is required')
				.max(100, 'Max Width is 100 Inch'),
			seletedItems: Yup.array().min(1, 'Select at least one Item')
		})
	)
});

function BoxWeightForm({
	items,
	handlePrintBoxLabel,
	isInitialValues,
	isPrintBoxLabelDataLoading
}: {
	items: any[];
	handlePrintBoxLabel: (values: FormikInitialValuesInterface) => void;
	isInitialValues: any;
	isPrintBoxLabelDataLoading: boolean;
}) {
	const [itemsValues] = React.useState(items);

	return (
		<div className="min-w-full max-w-[100vw]">
			<Formik
				initialValues={{
					weights: isInitialValues.length
						? isInitialValues
						: [{ weight: 1, height: 1, length: 1, width: 1, seletedItems: [] }]
				}}
				validationSchema={validationSchema}
				onSubmit={handlePrintBoxLabel}
				enableReinitialize
			>
				{({ values, errors, touched, handleChange, handleBlur, setFieldValue }) => {
					// Get a list of all selected subjects across customers
					const selectedSubjects = values.weights.flatMap((box) =>
						box.seletedItems.map((item) => item.value)
					);

					console.log('selectedSubjects', selectedSubjects);

					return (
						<Form>
							<FieldArray name="weights">
								{({ push, remove }) => (
									<>
										{values.weights.map((customer, customerIndex) => {
											const availableSubjects = itemsValues.filter((item) => {
												const isSelectedElsewhere =
													selectedSubjects.includes(item.value) &&
													!customer.seletedItems.some(
														(selected) => selected.value === item.value
													);
												return !isSelectedElsewhere;
											});

											console.log('isInitialValues', isInitialValues);
											console.log('availableSubjects', availableSubjects);

											return (
												<Grid
													key={customerIndex}
													item
													xs={12}
													className="flex justify-between items-center pt-2 gap-4"
												>
													<Grid
														item
														xs={3}
														className="flex items-center gap-2"
													>
														<Typography>
															Box Weight (LBS)
															<span className="text-red"> *</span>
														</Typography>
														<TextField
															type="number"
															fullWidth
															label=""
															name={`weights[${customerIndex}].weight`}
															value={customer?.weight}
															onChange={handleChange}
															onBlur={handleBlur}
															error={
																touched.weights?.[customerIndex]?.weight !==
																	undefined &&
																typeof errors.weights?.[customerIndex] === 'object' &&
																Boolean(errors.weights?.[customerIndex]?.weight)
															}
															helperText={
																touched.weights?.[customerIndex]?.weight !==
																	undefined &&
																typeof errors.weights?.[customerIndex] === 'object' &&
																errors.weights?.[customerIndex]?.weight
															}
															margin="normal"
														/>
													</Grid>
													<Grid
														item
														xs={3}
														className="flex items-center gap-2"
													>
														<Typography>
															Box Height (Inch)
															<span className="text-red"> *</span>
														</Typography>
														<TextField
															type="number"
															fullWidth
															label=""
															name={`weights[${customerIndex}].height`}
															value={customer?.height}
															onChange={handleChange}
															onBlur={handleBlur}
															error={
																touched.weights?.[customerIndex]?.height !==
																	undefined &&
																typeof errors.weights?.[customerIndex] === 'object' &&
																Boolean(errors.weights?.[customerIndex]?.height)
															}
															helperText={
																touched.weights?.[customerIndex]?.height !==
																	undefined &&
																typeof errors.weights?.[customerIndex] === 'object' &&
																errors.weights?.[customerIndex]?.height
															}
															margin="normal"
														/>
													</Grid>
													<Grid
														item
														xs={3}
														className="flex items-center gap-2"
													>
														<Typography>
															Box Length (Inch)
															<span className="text-red"> *</span>
														</Typography>
														<TextField
															type="number"
															fullWidth
															label=""
															name={`weights[${customerIndex}].length`}
															value={customer?.length}
															onChange={handleChange}
															onBlur={handleBlur}
															error={
																touched.weights?.[customerIndex]?.length !==
																	undefined &&
																typeof errors.weights?.[customerIndex] === 'object' &&
																Boolean(errors.weights?.[customerIndex]?.length)
															}
															helperText={
																touched.weights?.[customerIndex]?.length !==
																	undefined &&
																typeof errors.weights?.[customerIndex] === 'object' &&
																errors.weights?.[customerIndex]?.length
															}
															margin="normal"
														/>
													</Grid>
													<Grid
														item
														xs={3}
														className="flex items-center gap-2"
													>
														<Typography>
															Box Width (Inch)
															<span className="text-red"> *</span>
														</Typography>
														<TextField
															type="number"
															fullWidth
															label=""
															name={`weights[${customerIndex}].width`}
															value={customer?.width}
															onChange={handleChange}
															onBlur={handleBlur}
															error={
																touched.weights?.[customerIndex]?.width !== undefined &&
																typeof errors.weights?.[customerIndex] === 'object' &&
																Boolean(errors.weights?.[customerIndex]?.width)
															}
															helperText={
																touched.weights?.[customerIndex]?.width !== undefined &&
																typeof errors.weights?.[customerIndex] === 'object' &&
																errors.weights?.[customerIndex]?.width
															}
															margin="normal"
														/>
													</Grid>
													<Grid
														item
														xs={3}
														className="flex items-center gap-2"
													>
														<Typography>
															Select Items
															<span className="text-red"> *</span>
														</Typography>

														<FormControl
															fullWidth
															size="small"
															error={
																!!(
																	touched.weights?.[customerIndex]?.seletedItems &&
																	errors.weights?.[customerIndex]?.seletedItems
																)
															}
														>
															<Select
																multiple
																value={customer.seletedItems.map(
																	(item: any) => item.value
																)}
																onChange={(event: SelectChangeEvent<string[]>) => {
																	const selected = event.target.value;
																	const mapped = availableSubjects.filter((subject) =>
																		selected.includes(subject.value)
																	);
																	setFieldValue(
																		`weights[${customerIndex}].seletedItems`,
																		mapped
																	);
																}}
																input={
																	<OutlinedInput
																		id={`select-items-${customerIndex}`}
																	/>
																}
																renderValue={(selected: string[]) => (
																	<Box
																		sx={{
																			display: 'flex',
																			flexWrap: 'wrap',
																			gap: 0.5
																		}}
																	>
																		{selected.map((value) => {
																			const matched = availableSubjects.find(
																				(item) => item.value === value
																			);
																			return (
																				<Chip
																					key={value}
																					label={matched?.label || value}
																					size="small"
																				/>
																			);
																		})}
																	</Box>
																)}
															>
																{availableSubjects.map((option) => (
																	<MenuItem
																		key={option.value}
																		value={option.value}
																	>
																		{option.label}
																	</MenuItem>
																))}
															</Select>

															{touched.weights?.[customerIndex]?.seletedItems &&
																errors.weights?.[customerIndex]?.seletedItems && (
																	<Typography
																		variant="caption"
																		color="error"
																	>
																		{
																			errors.weights[customerIndex]
																				?.seletedItems as string
																		}
																	</Typography>
																)}
														</FormControl>
													</Grid>

													<Box
														key={customerIndex}
														sx={{
															mb: 3,
															p: 2,
															border: '1px solid lightgray',
															borderRadius: 1
														}}
													>
														{values.weights.length > 1 && (
															<IconButton onClick={() => remove(customerIndex)}>
																<CloseIcon />
															</IconButton>
														)}
													</Box>
												</Grid>
											);
										})}

										<Grid
											item
											xs={12}
											className="flex justify-end pt-2"
										>
											<IconButton
												onClick={() => {
													push({
														weight: 1,
														height: 1,
														length: 1,
														width: 1,
														seletedItems: []
													});
												}}
												sx={{ backgroundColor: '#1976d2', color: 'white' }}
											>
												<AddIcon />
											</IconButton>
										</Grid>
									</>
								)}
							</FieldArray>

							{/* Submit Button */}
							<Grid
								item
								xs={12}
								className="flex justify-center pt-2"
							>
								<Button
									type="submit"
									variant="contained"
									color="success"
									fullWidth
									sx={{ mt: 3 }}
									startIcon={<PrintIcon />}
								>
									Print Box Label
									{isPrintBoxLabelDataLoading ? (
										<CircularProgress
											className="text-white ml-[5px]"
											size={24}
										/>
									) : null}
								</Button>
							</Grid>
							{/* </Box> */}
						</Form>
					);
				}}
			</Formik>
		</div>
	);
}

export default BoxWeightForm;
