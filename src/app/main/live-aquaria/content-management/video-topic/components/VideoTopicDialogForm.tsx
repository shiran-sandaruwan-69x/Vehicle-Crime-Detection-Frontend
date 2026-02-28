import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Grid from '@mui/material/Grid';
import { Field, Form, Formik } from 'formik';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import React, { useState } from 'react';
import { CircularProgress } from '@mui/material';
import { ReasonModifiedData } from '../video-topic-types/VideoTopicTypes';
import TextFormField from '../../../../../common/FormComponents/FormTextField';

interface Props {
	toggleModal: () => void;
	isOpen: boolean;
	clickedRowData: ReasonModifiedData;
	compType?: string;
}

function VideoTopicDialogForm({ toggleModal, isOpen, clickedRowData, compType }: Props) {
	const { t } = useTranslation('videoTopics');
	const [isVideoTopicDataLoading] = useState(false);

	const schema = yup.object().shape({
		cancelReason: yup.string().required(t('Cancel order reason is required'))
	});

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
				<h2 className="text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-400">Edit Topic</h2>
			</DialogTitle>
			<DialogContent>
				<Formik
					initialValues={{
						videoTopic: clickedRowData.reason ? clickedRowData.reason : ''
					}}
					validationSchema={schema}
					onSubmit={null}
				>
					{() => (
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
										{t('VIDEO_TOPIC')}
										<span className="text-red"> *</span>
									</Typography>
									<Field
										disabled={compType === 'view'}
										name="videoTopic"
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
									{compType !== 'view' && (
										<Button
											className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
											type="submit"
											variant="contained"
											size="medium"
											// disabled={compType === 'view'}
											disabled={isVideoTopicDataLoading}
										>
											{t('Update')}
											{isVideoTopicDataLoading ? (
												<CircularProgress
													className="text-gray-600 ml-[5px]"
													size={24}
												/>
											) : null}
										</Button>
									)}
									{/* <Button
										className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
										type="button"
										variant="contained"
										size="medium"
										disabled={compType === 'view'}
										onClick={() => handleClearForm(resetForm)}
									>
										{t('Reset')}
									</Button> */}
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

export default VideoTopicDialogForm;
