import { Grid, Paper, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import { Field, Form, Formik } from 'formik';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import TextFormField from '../../../../../../common/FormComponents/FormTextField';
import { GeneralAdvMainObject } from '../../types/general-advertisement-types';

interface Props {
	clickedRowData: GeneralAdvMainObject;
	isTableMode: string;
	nextAndBackPage: (newValue: number) => void;
}

interface FormValues {
	[key: string]: string;
}

function QuickStatusView({ clickedRowData, isTableMode, nextAndBackPage }: Props) {
	const { t } = useTranslation();

	const flattenedAttributes = useMemo(() => {
		if (Array.isArray(clickedRowData?.item_attributes)) {
			return clickedRowData.item_attributes.flat();
		}

		return [];
	}, [clickedRowData]);

	const quickStats = flattenedAttributes;

	const schema = yup.object().shape({});

	const initialValues: FormValues = useMemo(() => {
		return quickStats.reduce((acc, item) => {
			if (item?.attributes) {
				acc[item.name] = item.attributes.map((attr) => attr.name).join(', ');
			}

			return acc;
		}, {} as FormValues);
	}, [quickStats]);

	const onBack = () => {
		nextAndBackPage(0);
	};

	const onNext = () => {
		nextAndBackPage(2);
	};

	return (
		<div className="min-w-full max-w-[100vw]">
			<Paper className="p-[16px] mt-[-5px] rounded-[4px]">
				{quickStats.length > 0 ? (
					<Formik
						enableReinitialize
						initialValues={initialValues}
						validationSchema={schema}
						onSubmit={(values) => {}}
					>
						{({ values }) => (
							<Form>
								<Grid
									container
									spacing={2}
									className="pt-[5px]"
								>
									{quickStats.map((item) => {
										const fieldName = item?.name;
										const fieldLabel = t(fieldName);
										const fieldValue = values[fieldName];

										return (
											<Grid
												item
												xl={3}
												lg={3}
												md={6}
												sm={6}
												xs={12}
												className="formikFormField pt-[5px!important]"
												key={item?.id}
											>
												{fieldValue !== undefined ? (
													<>
														<Typography>{fieldLabel}</Typography>
														<Field
															name={fieldName}
															id={fieldName}
															component={TextFormField}
															fullWidth
															disabled
															value={fieldValue}
														/>
													</>
												) : (
													<Typography
														variant="h6"
														color="error"
														className="text-[12px] sm:text-[14px] lg:text-[16px]"
													>
														No Stats available.
													</Typography>
												)}
											</Grid>
										);
									})}
									<Grid
										item
										md={12}
										sm={12}
										xs={12}
										className="flex justify-end items-center gap-[10px] pt-[10px!important]"
									>
										{isTableMode !== 'view' && (
											<>
												{isTableMode === 'edit' ? null : (
													<Button
														className="flex justify-center items-center min-w-[80px] sm:min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
														type="button"
														variant="contained"
														size="medium"
														onClick={() => onBack()}
													>
														{t('Back')}
													</Button>
												)}
												{isTableMode === 'edit' ? null : (
													<Button
														className="flex justify-center items-center min-w-[80px] sm:min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
														type="button"
														variant="contained"
														size="medium"
														onClick={() => onNext()}
													>
														Next
													</Button>
												)}
											</>
										)}
									</Grid>
								</Grid>
							</Form>
						)}
					</Formik>
				) : (
					<Typography
						variant="h6"
						color="error"
						className="text-[12px] sm:text-[14px] lg:text-[16px]"
					>
						No Stats available.
					</Typography>
				)}
			</Paper>
		</div>
	);
}

export default QuickStatusView;
