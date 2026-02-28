import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';

import { toast } from 'react-toastify';
import * as yup from 'yup';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { CircularProgress } from '@mui/material';
import TextFormField from '../../../../../common/FormComponents/FormTextField';

import {
	createDiversDenItemDelete,
	DiversDenItemDeleteReasonModifiedData
} from '../divers-den-item-types/DiversDenItemTypes';
import { updateDiversDenItemDeleteReason } from '../../../../../axios/services/live-aquaria-services/divers-advertisements-services/DiversAdvertisementsService';

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
	clickedRowData: DiversDenItemDeleteReasonModifiedData;
	compType: string;
	getCancelOrderReasons: () => void;
}

function DiversDenItemReasonsDialogForm({
	toggleModal,
	isOpen,
	clickedRowData,
	compType,
	getCancelOrderReasons
}: Props) {
	const { t } = useTranslation('diversDenItem');
	const [isDiversDenItemReasonsDataLoading, setDiversDenItemReasonsDataLoading] = useState(false);

	const onSubmit = async (values: createDiversDenItemDelete) => {
		setDiversDenItemReasonsDataLoading(true);
		const reasonId = clickedRowData?.id ? clickedRowData?.id : '';
		const requestData = {
			reason: values.diversDenItem ? values.diversDenItem : '',
			is_active: clickedRowData.active === true ? 1 : 0
		};
		try {
			const response = await updateDiversDenItemDeleteReason(requestData, reasonId);
			setDiversDenItemReasonsDataLoading(false);
			getCancelOrderReasons();
			toggleModal();
			toast.success('Updated Successfully');
		} catch (error) {
			setDiversDenItemReasonsDataLoading(false);
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

	const schema = yup.object().shape({
		diversDenItem: yup.string().required(t('Divers den item deletion reason is required'))
	});

	const handleClearForm = (resetForm: FormikHelpers<createDiversDenItemDelete>['resetForm']) => {
		resetForm({
			values: {
				diversDenItem: ''
			}
		});
	};

	return (
		<Dialog
			fullWidth
			open={isOpen}
			maxWidth="sm"
			onClose={toggleModal}
			// PaperProps={{
			//     style: {
			//         top: '40px',
			//         margin: 0,
			//         position: 'absolute',
			//     },
			// }}
		>
			<DialogTitle className="pb-0">
				<h6 className="text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-400">
					{compType === 'view' ? 'View' : 'Edit'} Divers Den Item Deletion Reason
				</h6>
			</DialogTitle>
			<DialogContent>
				<Formik
					initialValues={{
						diversDenItem: clickedRowData.reason ? clickedRowData.reason : ''
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
									md={12}
									sm={12}
									xs={12}
									className="formikFormField pt-[5px!important]"
								>
									<Typography className="formTypography">
										{t('DIVERS_DEN_ITEM_DELETION_REASON')}
										<span className="text-red"> *</span>
									</Typography>
									<Field
										disabled={compType === 'view'}
										name="diversDenItem"
										placeholder={t('')}
										component={TextFormField}
										fullWidth
										size="small"
										variant="outlined"
										type="text"
										className=""
									/>
								</Grid>

								<Grid
									item
									md={12}
									sm={12}
									xs={12}
									container
									justifyContent="flex-end"
									className="gap-[10px]"
								>
									{compType === 'view' ? null : (
										<Button
											className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
											type="submit"
											variant="contained"
											size="medium"
											disabled={compType === 'view'}
										>
											{t('Update')}
											{isDiversDenItemReasonsDataLoading ? (
												<CircularProgress
													className="text-white ml-[5px]"
													size={24}
												/>
											) : null}
										</Button>
									)}
									{compType === 'view' ? null : (
										<Button
											className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
											type="button"
											variant="contained"
											size="medium"
											disabled={compType === 'view'}
											onClick={() => handleClearForm(resetForm)}
										>
											{t('Reset')}
										</Button>
									)}
									<Button
										onClick={toggleModal}
										className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
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

export default DiversDenItemReasonsDialogForm;
