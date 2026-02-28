import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import ReportIcon from '@mui/icons-material/Report';
import DialogContent from '@mui/material/DialogContent';
import { DialogContentText, Grid, Typography } from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { Form, Formik } from 'formik';
import TextFormDateField from 'src/app/common/FormComponents/TextFormDateField';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import axios from 'axios';
import { BACK_ORDER_DELETE_ITEM } from 'src/app/axios/services/AdminServices';
import ExtendedAxiosError from 'src/app/types/ExtendedAxiosError';

interface Props {
	toggleModal: () => void;
	isOpen: boolean;
	clickedRowData: any;
	orderId: number;
}

function BackOrdersDeleteAlertForm({ toggleModal, isOpen, clickedRowData, orderId }: Props) {
	const schema = yup.object().shape({
		delete_reason: yup.string().required('Delete Reason is required')
	});

	return (
		<Dialog
			open={isOpen}
			onClose={toggleModal}
		>
			<Formik
				initialValues={{
					delete_reason: '',
					credit_points: `$${clickedRowData?.totalPrice}`
				}}
				onSubmit={async (values) => {
					try {
						await axios.post(`${BACK_ORDER_DELETE_ITEM}${orderId}/items/${clickedRowData.id}`, {
							delete_reason: values.delete_reason
						});
						toast.success('Item deleted successfully');
						toggleModal();
					} catch (error) {
						const axiosError = error as ExtendedAxiosError;

						if (axiosError?.response?.data?.message) {
							toast.error(axiosError.response.data.message);
						} else if (axiosError.message) {
							toast.error(axiosError.message);
						} else {
							toast.error('An unexpected error occurred');
						}

						toggleModal();
					}
				}}
				validationSchema={schema}
			>
				{() => (
					<Form>
						<>
							<DialogTitle className="flex items-center gap-[5px] text-[16px] font-bold">
								<ReportIcon className="text-red text-[20px]" />
								Delete Confirmation
							</DialogTitle>
							<DialogContent>
								<DialogContentText className="text-[10px] sm:text-[12px] lg:text-[14px]">
									Are you sure you want to delete this Item ?
								</DialogContentText>
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
										className="formikFormField pt-[5px!important] w-68% ml-[0px]"
									>
										<Typography>
											Delete Reason<span className="text-red"> *</span>
										</Typography>

										<TextFormDateField
											placeholder=""
											id="date"
											name="delete_reason"
										/>
									</Grid>
									<Grid
										item
										xs={12}
										sm={6}
										md={4}
										lg={3}
										className="formikFormField pt-[5px!important] w-68% ml-[0px]"
									>
										<Typography>Credit Point</Typography>

										<TextFormDateField
											disabled
											placeholder=""
											id="date"
											name="credit_points"
										/>
									</Grid>
								</Grid>
							</DialogContent>
							<DialogActions>
								<Button
									className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80 bokShadow"
									variant="contained"
									size="medium"
									type="submit"
									// onClick={handleAlertForm}
								>
									Confirm
								</Button>
								<Button
									className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80 boxShadow"
									onClick={toggleModal}
								>
									Cancel
								</Button>
							</DialogActions>
						</>
					</Form>
				)}
			</Formik>
		</Dialog>
	);
}

export default BackOrdersDeleteAlertForm;
