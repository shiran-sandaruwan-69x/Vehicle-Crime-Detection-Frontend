import { useTranslation } from 'react-i18next';
import React from 'react';
import * as yup from 'yup';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Grid from '@mui/material/Grid';
import { Field, Form, Formik } from 'formik';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextFormField from '../../../../../common/FormComponents/FormTextField';

import { ItemDetailsModifiedData } from '../etf-master-data-types/ETFMasterDataTypes';

interface Props {
	toggleModal: () => void;
	isOpen: boolean;
	clickedRowData: ItemDetailsModifiedData;
	compType: string;
}

function EtsMasterDataDialogForm({ toggleModal, isOpen, clickedRowData, compType }: Props) {
	const { t } = useTranslation('etfMasterData');

	const onSubmit = (values) => {};

	const schema = yup.object().shape({});

	return (
		<Dialog
			fullWidth
			open={isOpen}
			maxWidth="lg"
			onClose={toggleModal}
		>
			<DialogTitle className="pb-0">
				<h6 className="text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-400">
					{t('View ETF Master Data')}
				</h6>
			</DialogTitle>
			<DialogContent>
				<Formik
					initialValues={{
						cisCode: clickedRowData.cis_code ? clickedRowData.cis_code : '',
						memberCode: clickedRowData.member_code ? clickedRowData.member_code : '',
						vendorCode: clickedRowData.vendor_code ? clickedRowData.vendor_code : '',
						country: clickedRowData.country ? clickedRowData.country : '',
						commonName: clickedRowData.common_name ? clickedRowData.common_name : '',
						scientificName: clickedRowData.scientific_name ? clickedRowData.scientific_name : '',
						description: clickedRowData.description ? clickedRowData.description : '',
						gender: clickedRowData.gender ? clickedRowData.gender : '',
						size: clickedRowData.size ? clickedRowData.size : '',
						age: clickedRowData.age ? clickedRowData.age : '',
						origins: clickedRowData.origins ? clickedRowData.origins : '',
						length: clickedRowData.length ? clickedRowData.length : '',
						sellingType: clickedRowData.selling_type ? clickedRowData.selling_type : '',
						regularPrice: clickedRowData.regular_price ? clickedRowData.regular_price : '',
						inventoryQty: clickedRowData.inventory_qty !== undefined ? clickedRowData.inventory_qty : 0
					}}
					validationSchema={schema}
					onSubmit={onSubmit}
				>
					{({ values, setFieldValue, isValid, resetForm }) => (
						<Form>
							<Grid
								container
								spacing={2}
								className="pt-[10px]"
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
										{t('CIS_CODE')}
										<span className="text-red"> *</span>
									</Typography>
									<Field
										disabled={compType === 'view'}
										name="cisCode"
										placeholder={t('')}
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
									<Typography className="formTypography">
										{t('MEMBER_CODE')}
										<span className="text-red"> *</span>
									</Typography>
									<Field
										disabled={compType === 'view'}
										name="memberCode"
										placeholder={t('')}
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
									<Typography className="formTypography">{t('VENDOR_CODE')}</Typography>
									<Field
										disabled={compType === 'view'}
										name="vendorCode"
										placeholder={t('')}
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
									<Typography className="formTypography">{t('COUNTRY')}</Typography>
									<Field
										disabled={compType === 'view'}
										name="country"
										placeholder={t('')}
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
									<Typography className="formTypography">{t('COMMON_NAME')}</Typography>
									<Field
										disabled={compType === 'view'}
										name="commonName"
										placeholder={t('')}
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
									<Typography className="formTypography">{t('SCIENTIFIC_NAME')}</Typography>
									<Field
										disabled={compType === 'view'}
										name="scientificName"
										placeholder={t('')}
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
									<Typography className="formTypography">{t('DESCRIPTION')}</Typography>
									<Field
										disabled={compType === 'view'}
										name="description"
										placeholder={t('')}
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
									<Typography className="formTypography">{t('GENDER')}</Typography>
									<Field
										disabled={compType === 'view'}
										name="gender"
										placeholder={t('')}
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
									<Typography className="formTypography">{t('SIZE')}</Typography>
									<Field
										disabled={compType === 'view'}
										name="size"
										placeholder={t('')}
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
									<Typography className="formTypography">{t('AGE')}</Typography>
									<Field
										disabled={compType === 'view'}
										name="age"
										placeholder={t('')}
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
									<Typography className="formTypography">{t('ORIGINS')}</Typography>
									<Field
										disabled={compType === 'view'}
										name="origins"
										placeholder={t('')}
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
									<Typography className="formTypography">{t('LENGTH')}</Typography>
									<Field
										disabled={compType === 'view'}
										name="length"
										placeholder={t('')}
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
									<Typography className="formTypography">{t('SELLING_TYPE')}</Typography>
									<Field
										disabled={compType === 'view'}
										name="sellingType"
										placeholder={t('')}
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
									<Typography className="formTypography">{t('REGULAR_PRICE')}</Typography>
									<Field
										disabled={compType === 'view'}
										name="regularPrice"
										placeholder={t('')}
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
									<Typography className="formTypography">{t('INVENTORY_QTY')}</Typography>
									<Field
										disabled={compType === 'view'}
										name="inventoryQty"
										placeholder={t('')}
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
									className="flex justify-end items-start gap-[10px] formikFormField pt-[5px!important] sm:pt-[26px!important]"
								>
									<Button
										onClick={toggleModal}
										className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80 boxShadow"
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

export default EtsMasterDataDialogForm;
