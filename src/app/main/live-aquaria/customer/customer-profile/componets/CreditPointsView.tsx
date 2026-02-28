import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
	Button,
	CircularProgress,
	Grid,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow
} from '@mui/material';
import Typography from '@mui/material/Typography';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import * as yup from 'yup';

import {
	createCreditPoints,
	deleteCreditPoints,
	getCreatedCreditPoints,
	getUsedCreditPoints,
	updateCreditPoints
} from '../../../../../axios/services/live-aquaria-services/customer-services/CustomerService';
import TextFormField from '../../../../../common/FormComponents/FormTextField';
import {
	CustomerPointsData,
	CustomerPointsDataResponse,
	CustomerProfileCreditPointsSubmitData,
	CustomerUsedPoints,
	CustomerUsedPointsDataResponse,
	TableRowData
} from '../customer-types/CustomerTypes';
import CustomerDeleteCreditPointsAlertForm from './CustomerDeleteCreditPointsAlertForm';
import EditCreditPointsModal from './EditCreditPointsModal';

interface ErrorResponse {
	response?: {
		data?: {
			message?: string;
		};
	};
}

interface Props {
	toggleModal: () => void;
	clickedRowData: TableRowData;
	fetchAllCustomers: () => void;
}
export default function CreditPointsView({ toggleModal, clickedRowData, fetchAllCustomers }: Props) {
	const { t } = useTranslation('customerProfile');

	const [isOpenDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
	const [deleteProductId, setDeleteProductId] = useState<string>('');
	const [isCreateCustomerPoints, setCreateCustomerPoints] = useState<CustomerPointsData[]>([]);
	const [isUsedCustomerPoints, setUsedCustomerPoints] = useState<CustomerUsedPoints[]>([]);
	const [isProductSubmitDataLoading, setProductSubmitDataLoading] = useState(false);
	const [isEditCustomerPoints, setEditCustomerPoints] = useState<CustomerPointsData>({});
	const [isOpenEditModal, setOpenEditModal] = useState(false);
	const [isPoints, setPoints] = useState<string>('0');
	const [isUsedPoints, setUsedPoints] = useState<string>('0');
	const toggleEditModal = () => setOpenEditModal(!isOpenEditModal);
	const toggleDeleteModal = () => setOpenDeleteModal(!isOpenDeleteModal);

	useEffect(() => {
		getUsedPoints();
		getCreatedPoints();
	}, []);
	const handleDeleteRemark = (deleteId: string) => {
		setDeleteProductId(deleteId);
		toggleDeleteModal();
	};

	const handleEditRemark = (row: CustomerPointsData) => {
		setEditCustomerPoints(row);
		toggleEditModal();
	};

	const schema = yup.object().shape({
		creditPoints: yup
			.number()
			.typeError('Credit Points must be a number')
			.positive('Credit Points must be a positive number')
			.required('Credit Points is required'),
		remark: yup.string().required(t('Remark is required'))
	});

	const getUsedPoints = async () => {
		try {
			const userId = clickedRowData.id ?? null;
			const response: CustomerUsedPointsDataResponse = await getUsedCreditPoints(userId);
			setUsedCustomerPoints(response.data);
			setUsedPoints(response?.used_points);
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

	const getCreatedPoints = async () => {
		try {
			const userId = clickedRowData.id ?? null;
			const response: CustomerPointsDataResponse = await getCreatedCreditPoints(userId);
			setCreateCustomerPoints(response.data);
			setPoints(response?.credit_points_balance);
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

	const handleSave = async (
		values: CustomerProfileCreditPointsSubmitData,
		formikHelpers: FormikHelpers<CustomerProfileCreditPointsSubmitData>
	) => {
		const { resetForm } = formikHelpers;
		setProductSubmitDataLoading(true);
		try {
			const userId = clickedRowData.id ?? null;
			const data = {
				points: values.creditPoints,
				remark: values.remark
			};
			const response = await createCreditPoints(userId, data);
			getCreatedPoints();
			getUsedPoints();
			fetchAllCustomers();
			resetForm();
			setProductSubmitDataLoading(false);
			toast.success('Created Successfully');
		} catch (error) {
			setProductSubmitDataLoading(false);
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

	const handleEditModal = async (values: CustomerProfileCreditPointsSubmitData) => {
		toggleEditModal();
		try {
			const userId = clickedRowData.id ?? null;
			const pointId = isEditCustomerPoints.id ?? null;
			const data = {
				points: values.creditPoints,
				remark: values.remark
			};
			const response = await updateCreditPoints(userId, pointId, data);
			getCreatedPoints();
			getUsedPoints();
			fetchAllCustomers();
			toast.success('Updated Successfully');
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

	const confirmDeleteCreditPoints = async () => {
		toggleDeleteModal();
		try {
			const userId = clickedRowData.id ?? null;
			const pointId = deleteProductId ?? null;
			const response = await deleteCreditPoints(userId, pointId);
			getCreatedPoints();
			getUsedPoints();
			fetchAllCustomers();
			toast.success('Deleted Successfully');
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

	return (
		<div className="min-w-full max-w-[100vw]">
			<Formik
				initialValues={{
					creditPoints: '',
					remark: ''
				}}
				validationSchema={schema}
				onSubmit={handleSave}
			>
				{({ values, setFieldValue, resetForm }) => (
					<Form>
						<Grid
							container
							spacing={2}
						>
							<Grid
								item
								md={12}
								sm={12}
								xs={12}
								key={1}
							>
								{/* Product Selections Section */}
								<h6 className="text-[8px] sm:text-[10px] lg:text-[12px] font-600">
									Credit Points Balance :{' '}
									<span className="text-[10px] sm:text-[12px] lg:text-[14px]">${isPoints}</span>
								</h6>
								<Grid
									container
									spacing={2}
									className="mt-0"
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
											{t('Credit Points')}
											<span className="text-red"> *</span>
										</Typography>
										<Field
											disabled={false}
											name="creditPoints"
											placeholder={t('')}
											component={TextFormField}
											fullWidth
											size="small"
											variant="outlined"
											type="number"
											className=""
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
											{t('Remark')}
											<span className="text-red"> *</span>
										</Typography>
										<Field
											disabled={false}
											name="remark"
											placeholder={t('')}
											component={TextFormField}
											fullWidth
											size="small"
											variant="outlined"
											type="text"
											className=""
										/>
									</Grid>

									{/* Submit Buttons */}
									<Grid
										item
										lg={3}
										md={4}
										sm={12}
										xs={12}
										className="flex justify-start items-center gap-[10px] pt-[20px!important]"
									>
										<Button
											className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
											type="submit"
											variant="contained"
											size="medium"
											disabled={false}
										>
											Save
											{isProductSubmitDataLoading ? (
												<CircularProgress
													className="text-white ml-[5px]"
													size={24}
												/>
											) : null}
										</Button>
									</Grid>

									<Grid
										item
										xs={12}
										className="pt-[10px!important] max-h-[200px] overflow-y-auto"
									>
										<TableContainer>
											<Table
												size="small"
												className="custom-table"
											>
												<TableHead>
													<TableRow>
														<TableCell
															sx={{
																backgroundColor: '#354a95',
																color: 'white'
															}}
														>
															{t('Date Added & Time')}
														</TableCell>
														<TableCell
															sx={{
																backgroundColor: '#354a95',
																color: 'white'
															}}
														>
															{t('Points Added')}
														</TableCell>
														<TableCell
															sx={{
																backgroundColor: '#354a95',
																color: 'white'
															}}
														>
															{t('Point Value ($)')}
														</TableCell>
														<TableCell
															sx={{
																backgroundColor: '#354a95',
																color: 'white'
															}}
														>
															{t('Remark')}
														</TableCell>
														<TableCell
															sx={{
																backgroundColor: '#354a95',
																color: 'white'
															}}
														>
															{t('Action')}
														</TableCell>
													</TableRow>
												</TableHead>
												<TableBody>
													{isCreateCustomerPoints?.map((row, rowIndex) => (
														<TableRow key={rowIndex}>
															<TableCell>{row.created_at}</TableCell>
															<TableCell>{row.points}</TableCell>
															<TableCell>{row.points}</TableCell>
															<TableCell>{row.remark}</TableCell>
															<TableCell>
																<EditIcon
																	fontSize="small"
																	sx={{
																		cursor: 'pointer'
																	}}
																	onClick={() => handleEditRemark(row)}
																/>
																<DeleteIcon
																	className="text-red-400"
																	fontSize="small"
																	sx={{ cursor: 'pointer' }}
																	onClick={() => handleDeleteRemark(row.id)}
																/>
															</TableCell>
														</TableRow>
													))}
												</TableBody>
											</Table>
										</TableContainer>
									</Grid>

									<Grid
										item
										xs={12}
										className="pt-[10px!important] !mt-[5px]"
									>
										<h6 className="text-[8px] sm:text-[10px] lg:text-[12px] font-600">
											Used Credit Points :
											<span className="text-[10px] sm:text-[12px] lg:text-[14px]">
												${isUsedPoints}
											</span>
										</h6>
									</Grid>
									<Grid
										item
										xs={12}
										className="pt-[10px!important] max-h-[200px] overflow-y-auto"
									>
										<TableContainer>
											<Table
												size="small"
												className="custom-table"
											>
												<TableHead>
													<TableRow>
														<TableCell
															sx={{
																backgroundColor: '#354a95',
																color: 'white'
															}}
														>
															{t('Order No')}
														</TableCell>
														<TableCell
															sx={{
																backgroundColor: '#354a95',
																color: 'white'
															}}
														>
															{t('Used Date & Time')}
														</TableCell>
														<TableCell
															sx={{
																backgroundColor: '#354a95',
																color: 'white'
															}}
														>
															{t('Points Used')}
														</TableCell>
														<TableCell
															sx={{
																backgroundColor: '#354a95',
																color: 'white'
															}}
														>
															{t('Point Value ($)')}
														</TableCell>
													</TableRow>
												</TableHead>
												<TableBody>
													{isUsedCustomerPoints?.map((row, rowIndex) => (
														<TableRow key={rowIndex}>
															<TableCell>{row.order_no}</TableCell>
															<TableCell>{row.created_at}</TableCell>
															<TableCell>{row.redeem_credits}</TableCell>
															<TableCell>{row.redeem_credits}</TableCell>
														</TableRow>
													))}
												</TableBody>
											</Table>
										</TableContainer>
									</Grid>
								</Grid>
							</Grid>
						</Grid>
					</Form>
				)}
			</Formik>

			{isOpenEditModal && (
				<EditCreditPointsModal
					toggleModal={toggleEditModal}
					isOpen={isOpenEditModal}
					clickedRowData={isEditCustomerPoints}
					handleAlertForm={handleEditModal}
				/>
			)}

			{isOpenDeleteModal && (
				<CustomerDeleteCreditPointsAlertForm
					isOpen={isOpenDeleteModal}
					toggleModal={toggleDeleteModal}
					handleAlertForm={confirmDeleteCreditPoints}
				/>
			)}
		</div>
	);
}
