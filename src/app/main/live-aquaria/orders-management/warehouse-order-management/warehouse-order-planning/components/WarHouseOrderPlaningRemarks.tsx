import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';
import { Checkbox, FormControlLabel, Grid, IconButton, TextField, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import Button from '@mui/material/Button';
import FormDropdown from '../../../../../../common/FormComponents/FormDropdown';
import TextFormDateField from '../../../../../../common/FormComponents/TextFormDateField';
import MaterialTableWrapper from '../../../../../../common/tableComponents/MaterialTableWrapper';

interface Props {
	toggleModal: () => void;
}

function WarHouseOrderPlaningRemarks({ toggleModal }: Props) {
	const { t } = useTranslation('backOrders');
	const [, setIsEditable] = useState(false);

	const toggleEditable = useCallback(() => {
		setIsEditable((prev) => !prev);
	}, []);

	const tableColumns = [
		{ title: t('DATE'), field: 'date' },
		{
			title: t('ACTION_TAKEN'),
			field: 'actionTaken'
		},
		{
			title: t('TAKEN_BY'),
			field: 'takenBy'
		},
		{
			title: t('DELIVERY_DATE'),
			field: 'deliverDate'
		},
		{ title: t('STATUS'), field: 'status' },
		{
			title: t('REMARK'),
			field: 'remark'
		}
	];

	const orderStatus = [
		{ value: '1', label: 'Active' },
		{ value: '2', label: 'Pending' },
		{ value: '3', label: 'Closed' }
	];

	const cancelOrderReason = [
		{ value: '1', label: 'Customer changed their mind' },
		{
			value: '2',
			label: 'Product out of stock'
		},
		{ value: '3', label: 'Pricing error' },
		{ value: '4', label: 'Incorrect shipping address' },
		{
			value: '5',
			label: 'Product no longer needed'
		},
		{ value: '6', label: 'Longer than expected delivery time' },
		{ value: '7', label: 'Payment issues' }
	];

	const tableData = [
		{
			date: '2021-08-01',
			actionTaken: 'Action 1',
			takenBy: 'John Doe',
			deliverDate: '2021-08-01',
			status: 'Pending',
			remark: 'This is a remark'
		},
		{
			date: '2021-08-02',
			actionTaken: 'Action 2',
			takenBy: 'Jane Doe',
			deliverDate: '2021-08-02',
			status: 'Pending',
			remark: 'This is a remark'
		},
		{
			date: '2021-08-03',
			actionTaken: 'Action 3',
			takenBy: 'John Doe',
			deliverDate: '2021-08-03',
			status: 'Pending',
			remark: 'This is a remark'
		}
	];

	const schema = yup.object().shape({
		orderStatus: yup.string().required(t('ORDER_STATUS_REQUIRED')),
		cancel_order_reason: yup.string().required(t('CANCEL_ORDER_REASON_REQUIRED'))
	});

	return (
		<Formik
			initialValues={{
				remarks: '',
				date: '',
				orderStatus: '',
				notify_customer: false,
				cancel_order_reason: ''
			}}
			onSubmit={() => {}}
			validationSchema={schema}
		>
			{(formik) => (
				<Form>
					<Grid
						container
						spacing={2}
						className="pt-0"
					>
						<Grid
							item
							xs={12}
							sm={6}
							md={3}
							className="formikFormField pt-[5px!important]"
						>
							<Typography>{t('CHANGE_EXPECTED_DELIVERY_DATE')}</Typography>
							<TextFormDateField
								name="date"
								type="date"
								placeholder=""
								id="date"
								min=""
								max={new Date().toISOString().split('T')[0]}
								disablePastDate
								changeInput={(value: string, form: any) => {
									// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call
									form.setFieldValue('date', value);
								}}
							/>
						</Grid>
						<Grid
							item
							xs={12}
							sm={6}
							md={3}
							className="flex justify-start gap-[2px] formikFormField pt-[21px!important]"
						>
							<IconButton
								className="min-w-[45px]"
								onClick={toggleEditable}
							>
								<EditIcon />
							</IconButton>
							<IconButton
								className="min-w-[45px]"
								onClick={() => {
									formik.handleSubmit();
									toggleEditable();
								}}
							>
								<CheckIcon />
							</IconButton>
						</Grid>

						<Grid
							item
							xs={12}
							sm={6}
							md={3}
							className="formikFormField pt-[5px!important]"
						>
							<Typography>
								{t('ORDER_STATUS')}
								<span className="text-red"> *</span>
							</Typography>
							<FormDropdown
								name="orderStatus"
								id="orderStatus"
								placeholder=""
								optionsValues={orderStatus}
								disabled={false}
							/>
						</Grid>
						<Grid
							item
							xs={12}
							sm={6}
							md={3}
							className="formikFormField pt-[21px!important]"
						>
							<FormControlLabel
								name="notify_customer"
								id="notify_customer"
								control={<Checkbox color="primary" />}
								label="Notify customer"
								checked={formik.values.notify_customer}
								onChange={formik.handleChange}
							/>
						</Grid>

						<Grid
							item
							xs={12}
							className="formikFormField pt-[5px!important]"
						>
							<Typography className="formTypography">{t('Assign Picker Remarks')}</Typography>
							<TextField
								name="remarks"
								fullWidth
								multiline
								rows={4}
								placeholder="Placeholder"
								variant="outlined"
								label=""
								{...formik.getFieldProps('remarks')}
							/>
						</Grid>

						<Grid
							item
							xs={12}
							className="pt-[10px!important]"
						>
							<MaterialTableWrapper
								title=""
								filterChanged={null}
								handleColumnFilter={null}
								tableColumns={tableColumns}
								handleCommonSearchBar={null}
								disableColumnFiltering
								searchByText=""
								exportToExcel={null}
								handleRowDeleteAction={null}
								externalAdd={null}
								externalEdit={null}
								externalView={null}
								selection={false}
								selectionExport={null}
								disablePagination
								disableSearch
								isColumnChoser
								records={tableData}
							/>
						</Grid>

						<Grid
							item
							md={12}
							sm={12}
							xs={12}
							className="flex justify-end items-center gap-[10px] pt-[15px!important]"
						>
							<Button
								onClick={toggleModal}
								className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
							>
								Close
							</Button>
							<Button
								className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
								type="submit"
							>
								Save
							</Button>
						</Grid>
					</Grid>
				</Form>
			)}
		</Formik>
	);
}

export default WarHouseOrderPlaningRemarks;
