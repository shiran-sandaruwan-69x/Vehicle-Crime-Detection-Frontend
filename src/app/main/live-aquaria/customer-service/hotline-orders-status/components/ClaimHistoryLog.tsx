import { Button, Checkbox, FormControlLabel, Grid, TextField, Typography } from '@mui/material';
import { Field, Form, Formik } from 'formik';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import FormDropdown from '../../../../../common/FormComponents/FormDropdown';
import MaterialTableWrapper from '../../../../../common/tableComponents/MaterialTableWrapper';
import TextFormField from '../../../../../common/FormComponents/FormTextField';
// import FormDropdown from '../../../../../../common/FormComponents/FormDropdown';
// import TextFormDateField from '../../../../../../common/FormComponents/TextFormDateField';
// import MaterialTableWrapper from '../../../../../../common/tableComponents/MaterialTableWrapper';

interface Props {
	toggleModal: () => void;
	claim: any;
}

function ClaimHistoryLog({ toggleModal, claim }: Props) {
	const { t } = useTranslation('customerClaims');
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
		{ title: t('COMMENTS'), field: 'comments' }
	];

	const orderStatus = [
		{ value: '1', label: 'Active' },
		{ value: '2', label: 'Pending' },
		{ value: '3', label: 'Closed' }
	];

	const tableData = [
		{
			date: '2024-10-20',
			actionTaken: 'Approved',
			takenBy: 'John Doe',
			comments: 'Approved with no issues'
		},
		{
			date: '2024-10-21',
			actionTaken: 'Rejected',
			takenBy: 'Jane Smith',
			comments: 'Missing required documentation'
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
						className="pt-[5px]"
					>
						<Grid
							item
							xs={12}
							sm={6}
							md={4}
							lg={3}
							className="formikFormField pt-[5px!important]"
						>
							<Typography>
								{t('STATUS')}
								<span className="text-red"> *</span>
							</Typography>
							<FormDropdown
								name="status"
								id="status"
								placeholder=""
								optionsValues={orderStatus}
								disabled={false}
							/>
						</Grid>

						<Grid
							item
							xs={12}
							sm={6}
							md={4}
							lg={3}
							className="formikFormField pt-[5px!important]"
						>
							<Typography>{t('REFUND_AMOUNT')}</Typography>
							<Field
								name="refund_amount"
								id="refund_amount"
								placeholder=""
								disabled={false}
								component={TextFormField}
							/>
						</Grid>
						<Grid
							item
							xs={12}
							sm={6}
							md={2}
							lg={2}
							xl={2}
							className="formikFormField pt-[5px!important] sm:pt-[21px!important]"
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
							sm={6}
							md={2}
							lg={2}
							xl={2}
							className="formikFormField pt-[5px!important] sm:pt-[21px!important]"
						>
							<FormControlLabel
								name="credit_points"
								id="credit_points"
								control={<Checkbox color="primary" />}
								label="Update Credit Points"
								checked={formik.values.notify_customer}
								onChange={formik.handleChange}
							/>
						</Grid>

						<Grid
							item
							xs={12}
							className="formikFormField pt-[5px!important]"
						>
							<Typography className="formTypography">{t('Comment')}</Typography>
							<TextField
								name="comment"
								fullWidth
								multiline
								rows={4}
								placeholder="Placeholder"
								variant="outlined"
								label=""
								{...formik.getFieldProps('comment')}
							/>
						</Grid>

						<Grid
							item
							xs={12}
							className="pt-[15px!important]"
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
							className="flex justify-end items-center gap-[10px] pt-[15px!important] mb-[15px]"
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

export default ClaimHistoryLog;
