import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Grid from '@mui/material/Grid';
import { Form, Formik } from 'formik';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import CancelIcon from '@mui/icons-material/Cancel';
import IconButton from '@mui/material/IconButton';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { CircularProgress } from '@mui/material';
import { updateOrderReason } from '../../../../../axios/services/live-aquaria-services/master-data-services/MasterDataServices';
import { ReasonCreateData, ReasonModifiedData } from '../video-library-types/VideoLibraryTypes';

interface Props {
	toggleModal: () => void;
	isOpen: boolean;
	clickedRowData: ReasonModifiedData;
	compType: string;
	getCancelOrderReasons: () => void;
}

function ViewVideoLibraryDialogForm({ toggleModal, isOpen, clickedRowData, compType, getCancelOrderReasons }: Props) {
	const { t } = useTranslation('videoLibrary');
	const [isCancelOrderReasonsDataLoading, setCancelOrderReasonsDataLoading] = useState(false);

	const maxVideoCount = 1;
	const maxVideoSize = 50 * 1024 * 1024; // 50MB
	const [videos, setVideos] = useState<{ file: File; base64: string }[]>([]);
	const [isSaveEnabled, setIsSaveEnabled] = useState(false);

	const onSubmit = async (values: ReasonCreateData) => {
		setCancelOrderReasonsDataLoading(true);
		const reasonId: number | '' = clickedRowData?.id ? clickedRowData?.id : '';
		const requestData = {
			reason: values.cancelReason ? values.cancelReason : '',
			is_active: clickedRowData.active === true ? 1 : 0
		};
		try {
			const response = await updateOrderReason(requestData, reasonId);
			setCancelOrderReasonsDataLoading(false);
			getCancelOrderReasons();
			toggleModal();
			toast.success('Successfully');
		} catch (error) {
			setCancelOrderReasonsDataLoading(false);
			toggleModal();
			if(error.response?.data?.message){
				toast.error(error.response.data.message);
			  }else{
				toast.error('Something went wrong');
			  }
		}
	};

	const schema = yup.object().shape({
		topic: yup.string().required(t('Topic is required')),
		title: yup.string().required(t('Title is required'))
	});

	const convertToBase64 = (file: File): Promise<string> => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onloadend = () => {
				resolve(reader.result as string);
			};
			reader.onerror = (error) => {
				reject(error);
			};
		});
	};

	const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const { files } = event.target;

		if (files) {
			if (videos.length + files.length > maxVideoCount) {
				toast.error(`You can only upload a maximum of ${maxVideoCount} videos.`);
				return;
			}

			const validVideos: { file: File; base64: string }[] = [];
			for (const file of Array.from(files)) {
				const isValid = await validateVideo(file);

				if (isValid) {
					const base64 = await videoConvertToBase64(file);
					validVideos.push({ file, base64 });
				}
			}

			if (validVideos.length > 0) {
				setVideos([...videos, ...validVideos]);
			}
		}
	};

	const validateVideo = (file: File): Promise<boolean> => {
		return new Promise((resolve) => {
			const video = document.createElement('video');
			video.src = URL.createObjectURL(file);

			video.onloadedmetadata = () => {
				if (file.size <= maxVideoSize) {
					resolve(true);
				} else {
					toast.error(`Video size must be <= ${maxVideoSize / (1024 * 1024)}MB.`);
					resolve(false);
				}
			};

			video.onerror = () => {
				toast.error('Invalid video file.');
				resolve(false);
			};
		});
	};

	const videoConvertToBase64 = (file: File): Promise<string> => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onloadend = () => {
				resolve(reader.result as string);
			};
			reader.onerror = (error) => {
				reject(error);
			};
		});
	};

	const handleRemoveVideo = (index: number) => {
		const newVideo = videos.filter((_, i) => i !== index);
		setVideos(newVideo);
		setIsSaveEnabled(newVideo.length > 0);
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
				<h2 className="text-sm md:text-base lg:text-lg text-gray-700 font-semibold">
					{/* {t('EDIT_VIDEO')} */}
					{compType === 'edit' ? t('EDIT_VIDEO') : t('VIEW_VIDEO')}
				</h2>
			</DialogTitle>
			<DialogContent>
				<Formik
					initialValues={{
						title: clickedRowData.reason ? clickedRowData.reason : ''
						// Need to add data as per our api
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
									<Typography className="valueDisplay">
										<h2>{clickedRowData.reason || 'No Title Provided'}</h2>
									</Typography>
								</Grid>

								<Grid
									item
									md={12}
									sm={12}
									xs={12}
									className="formikFormField pt-[5px!important]"
								>
									<div
										style={{
											display: 'flex',
											flexWrap: 'wrap',
											position: 'relative',
											width: '100%'
										}}
									>
										{videos.map((video, index) => (
											<div
												key={index}
												style={{
													position: 'relative',
													margin: '3px',
													borderRadius: '10px',
													overflow: 'hidden',
													border: '2px solid #ccc',
													flex: '1 1 calc(20% - 20px)',
													width: '1000px',
													height: '150px'
												}}
											>
												<img
													src={URL.createObjectURL(video.file)}
													alt="Thumbnail"
													style={{
														width: '100%',
														height: '100%',
														objectFit: 'cover',
														borderRadius: '10px'
													}}
												/>
												<IconButton
													size="small"
													sx={{
														position: 'absolute',
														top: '0px',
														right: '0px',
														backgroundColor: 'rgba(0, 0, 0, 0.5)',
														padding: '2px',
														borderRadius: '50%',
														color: 'white',
														transition: 'color 0.2s',
														'&:hover': { color: 'red' }
													}}
													disabled={compType === 'view'}
													onClick={() => handleRemoveVideo(index)}
												>
													<CancelIcon fontSize="small" />
												</IconButton>
											</div>
										))}

										{videos.length < maxVideoCount && (
											<div
												style={{
													flex: '1 1 calc(20% - 20px)',
													maxWidth: '1000px',
													height: '150px',
													position: 'relative',
													margin: '3px',
													border: '2px solid #ccc',
													borderRadius: '10px',
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center'
												}}
											>
												<IconButton
													className="text-primaryBlue"
													disabled={compType === 'view'}
													onClick={() => document.getElementById('videoUpload')?.click()}
												>
													<AddCircleIcon fontSize="large" />
												</IconButton>
												<input
													id="videoUpload"
													type="file"
													accept="video/*"
													style={{ display: 'none' }}
													multiple
													onChange={handleVideoUpload}
													disabled={compType === 'view'}
												/>
											</div>
										)}
									</div>
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
											disabled={isCancelOrderReasonsDataLoading}
										>
											{t('UPDATE')}
											{isCancelOrderReasonsDataLoading ? (
												<CircularProgress
													className="text-gray-600 ml-[5px]"
													size={24}
												/>
											) : null}
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

export default ViewVideoLibraryDialogForm;
