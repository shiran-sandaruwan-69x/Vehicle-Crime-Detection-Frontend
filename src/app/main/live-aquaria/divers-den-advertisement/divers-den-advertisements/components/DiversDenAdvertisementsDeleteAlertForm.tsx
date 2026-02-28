import * as yup from 'yup';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import ReportIcon from '@mui/icons-material/Report';
import DialogContent from '@mui/material/DialogContent';
import { Grid } from '@mui/material';
import { Form, Formik } from 'formik';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import FormDropdown from '../../../../../common/FormComponents/FormDropdown';

import { productOptionsDropDownDataType } from '../divers-den-advertisements-types/DriversDenAdvertisementsTypes';
import {
	DiversDenItemDeleteReason,
	DiversDenItemDeleteReasonType
} from '../../../laq-master-data/divers-den-item/divers-den-item-types/DiversDenItemTypes';
import { getAllDiversDenItemDeleteReasonWithOutPagination } from '../../../../../axios/services/live-aquaria-services/divers-advertisements-services/DiversAdvertisementsService';

interface ErrorResponse {
	response?: {
		data?: {
			message?: string;
		};
	};
}
interface Props {
	toggleModal: () => void;
	isOpen: boolean;
	handleAlertForm: (values: { reason: string }) => void;
}

function DiversDenAdvertisementsDeleteAlertForm({ toggleModal, isOpen, handleAlertForm }: Props) {
	const [isDeleteReason, setDeleteReason] = useState<productOptionsDropDownDataType[]>([]);

	const schema = yup.object().shape({
		reason: yup.string().required('Delete Reason is required')
	});

	useEffect(() => {
		getDiversDenItemDeletion();
	}, []);

	const getDiversDenItemDeletion = async () => {
		try {
			const response: DiversDenItemDeleteReasonType = await getAllDiversDenItemDeleteReasonWithOutPagination();
			const data1: DiversDenItemDeleteReason[] = response.data;
			const modifiedData: productOptionsDropDownDataType[] = data1.map((item: DiversDenItemDeleteReason) => ({
				value: item.id,
				label: item.reason
			}));
			setDeleteReason(modifiedData);
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
		<Dialog
			open={isOpen}
			onClose={toggleModal}
		>
			<DialogTitle className="flex items-center gap-[5px] text-[16px] font-bold">
				<ReportIcon className="text-red text-[20px]" />
				Confirmation
			</DialogTitle>
			<DialogContent>
				<Formik
					initialValues={{
						reason: ''
					}}
					validationSchema={schema}
					onSubmit={handleAlertForm}
				>
					{({ values, setFieldValue, isValid, resetForm }) => (
						<Form>
							<Grid
								container
								spacing={2}
								className="pt-[15px]"
							>
								<Grid
									item
									md={12}
									sm={12}
									xs={12}
									className="formikFormField pt-[5px!important]"
								>
									<Typography className="formTypography">
										Delete Reason <span className="text-red"> *</span>
									</Typography>
									<FormDropdown
										id="reason"
										name="reason"
										value={values.reason}
										optionsValues={isDeleteReason}
										onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
											const { value } = e.target;
											setFieldValue('reason', value);
										}}
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
										className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
										type="submit"
										variant="contained"
										size="medium"
										disabled={false}
									>
										Confirm
									</Button>

									<Button
										className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
										type="button"
										variant="contained"
										size="medium"
										disabled={false}
										onClick={toggleModal}
									>
										Cancel
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

export default DiversDenAdvertisementsDeleteAlertForm;
