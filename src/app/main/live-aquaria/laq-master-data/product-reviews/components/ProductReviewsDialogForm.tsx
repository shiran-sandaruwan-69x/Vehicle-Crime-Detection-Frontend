import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import { Form, Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import { Rating } from '@mui/material';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { updateProductItemReviews } from 'src/app/axios/services/live-aquaria-services/master-data-services/MasterDataServices';
import Logo from '../../../../../assets/Gold Fish.jpg';
import { ItemDetailsModifiedData } from '../product-reviews-types/ProductReviewsTypes';

interface Props {
	toggleModal: () => void;
	isOpen: boolean;
	clickedRowData: ItemDetailsModifiedData;
	compType: string;
	onUpdateSuccess: (updatedData: ItemDetailsModifiedData) => void;
}

function ProductReviewsDialogForm({ toggleModal, isOpen, clickedRowData, compType, onUpdateSuccess }: Props) {
	const { t } = useTranslation('productReviews');
	const [localStatus, setLocalStatus] = useState(clickedRowData.status);

	const onSubmit = async (values) => {};

	const schema = yup.object().shape({});

	const handleApprove = async (values) => {
		setLocalStatus(1);

		// Send the update to the backend
		const updateData = {
			status: 1 // Approved status
		};

		try {
			await updateProductItemReviews(updateData, clickedRowData.id);
			toast.success('Approved Successfully');
			// You can show a success message or take any other action after successful update
			// const updatedRowData = {
			// 	...clickedRowData,
			// 	status: 1,
			// 	approvedStatus: 'Approved'
			// };
			// onUpdateSuccess(updatedRowData);
			toggleModal(); // Close the modal after successful update
		} catch (error) {
			// Handle error here (e.g., show an error message)
			setLocalStatus(clickedRowData.status);

			if (error.response?.data?.message) {
				toast.error(error.response.data.message);
			} else {
				toast.error('Something went wrong');
			}
		}
	};

	return (
		<Dialog
			fullWidth
			open={isOpen}
			maxWidth="lg"
			onClose={toggleModal}
		>
			<DialogTitle className="pb-0">
				<h6 className="text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-400">
					{t('Product Reviews')}
				</h6>
			</DialogTitle>

			<DialogContent className="pb-0 !pt-[10px]">
				<Formik
					initialValues={{
						productName: clickedRowData.item_details.title || '',
						productId: clickedRowData.item_details.code || '',
						scientificName: clickedRowData.item_details.scientific_name || '',
						title: clickedRowData.item_details.title  || '',
						approvedStatus: clickedRowData.status === 0 ? 'Pending' : 'Approved',
						productRating: clickedRowData.product_rating || '',
						deliveryRating: clickedRowData.delivery_rating || '',
						feedback: clickedRowData.feedback || '',
						images: clickedRowData.images || []
					}}
					validationSchema={schema}
					onSubmit={onSubmit}
				>
					{({ values }) => (
						<Form>
							<Grid
								container
								spacing={2}
								className="pt-[10px] pb-[20px]"
							>
								{/* Product Information */}
								<Grid
									item
									xl={2}
									md={2}
									sm={3}
									xs={12}
									className="!pt-[5px]"
								>
									<div className="w-full max-w-[200px] aspect-square mx-auto rounded-full overflow-hidden">
										<img
											src={
												clickedRowData.images && clickedRowData.images.length > 0
													? clickedRowData.images[0].images // Display first image from the array
													: Logo // Display default image
											}
											alt="Product"
											className="w-full h-full object-cover object-center"
										/>
									</div>
								</Grid>

								{/* Product information section */}
								<Grid
									item
									xl={10}
									md={10}
									sm={9}
									xs={12}
									className="flex flex-wrap items-center h-full !pt-[5px]"
								>
									<div className="flex flex-wrap sm:!flex-nowrap justify-center sm:justify-end items-center gap-[5px] w-full">
										{/* <p className='min-w-[120px] text-[10px] sm:text-[12px] lg:text-[14px] mb-0'>
                      Status
                    </p> */}
										<p
											className={`text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 px-[20px] md:px-[30px] py-[5px] md:py-[10px] mb-0 rounded-full ${
												values.approvedStatus === 'Pending'
													? 'bg-orange-400'
													: values.approvedStatus === 'Approved'
														? 'bg-primaryBlueLight'
														: 'bg-primaryBlueLight'
											}`}
										>
											{values.approvedStatus}
										</p>
									</div>
									<div className="flex flex-wrap sm:!flex-nowrap items-center gap-[5px] w-full mb-[5px] md:mb-[10px]">
										<p className="min-w-[120px] text-[10px] sm:text-[12px] lg:text-[14px] mb-0">
											Product Name
										</p>
										<p className="text-[10px] sm:text-[12px] lg:text-[14px] font-500 mb-0">
											: {values.productName}
										</p>
									</div>

									<div className="flex flex-wrap sm:!flex-nowrap items-center gap-[5px] w-full mb-[5px] md:mb-[10px]">
										<p className="min-w-[120px] text-[10px] sm:text-[12px] lg:text-[14px] mb-0">
											Product CODE
										</p>
										<p className="text-[10px] sm:text-[12px] lg:text-[14px] font-500 mb-0">
											: {values.productId}
										</p>
									</div>

									<div className="flex flex-wrap sm:!flex-nowrap items-center gap-[5px] w-full mb-[5px] md:mb-[10px]">
										<p className="min-w-[120px] text-[10px] sm:text-[12px] lg:text-[14px] mb-0">
											Scientific Name
										</p>
										<p className="text-[10px] sm:text-[12px] lg:text-[14px] font-500 mb-0">
											: {values.scientificName}
										</p>
									</div>

									<div className="flex flex-wrap sm:!flex-nowrap items-center gap-[5px] w-full">
										<p className="min-w-[120px] text-[10px] sm:text-[12px] lg:text-[14px] mb-0">
											Title
										</p>
										<p className="text-[10px] sm:text-[12px] lg:text-[14px] font-500 mb-0">
											: {values.title}
										</p>
									</div>
								</Grid>
								<Grid
									item
									xs={12}
									className="!py-[15px]"
								>
									<hr />
								</Grid>
								{/* Rating Breakdown */}
								<Grid
									item
									xs={12}
									className="!pt-0"
								>
									<h6 className="text-[12px] sm:text-[14px] lg:text-[16px] font-600 mb-[16px]">
										Rating Breakdown
									</h6>
									<Grid
										container
										spacing={2}
									>
										<Grid
											item
											xs={12}
											md={6}
											className="flex flex-wrap justify-between md:justify-start items-center gap-[15px] !pt-[5px]"
										>
											<p className="text-[10px] sm:text-[12px] lg:text-[14px] mb-0">
												Customer ratings
											</p>
											<Rating
												name="customerRating"
												value={values.productRating}
												readOnly
											/>
										</Grid>
										<Grid
											item
											xs={12}
											md={6}
											className="flex flex-wrap justify-between md:justify-end items-center gap-[15px] !pt-[5px]"
										>
											<p className="text-[10px] sm:text-[12px] lg:text-[14px] mb-0">
												Rate of timely delivery of orders
											</p>
											<Rating
												name="deliveryRating"
												value={values.deliveryRating}
												readOnly
											/>
										</Grid>
									</Grid>
								</Grid>
								<Grid
									item
									xs={12}
									className="!py-[15px]"
								>
									<hr />
								</Grid>
								{/* Feedback Section */}
								<Grid
									item
									xs={12}
									className="!pt-0"
								>
									<h6 className="text-[12px] sm:text-[14px] lg:text-[16px] font-600 mb-[10px]">
										Feedback
									</h6>
									<p className="text-[10px] sm:text-[12px] lg:text-[14px] mb-0">{values.feedback}</p>
								</Grid>

								<Grid
									item
									xs={12}
									className="!py-[15px]"
								>
									<hr />
								</Grid>

								{clickedRowData.images && clickedRowData.images.length > 0 && (
									<Grid
										item
										xs={12}
										className="!pt-0"
									>
										<h6 className="text-[12px] sm:text-[14px] lg:text-[16px] font-600 mb-[15px]">
											Images
										</h6>
										<Grid
											container
											spacing={2}
										>
											{clickedRowData.images.map((imageObj, index) => (
												<Grid
													item
													xs={6}
													sm={4}
													md={3}
													key={index}
													className="!pt-[10px]"
												>
													<div className="w-full aspect-square rounded-[12px] lg:rounded-[22px] overflow-hidden">
														<img
															src={imageObj.images}
															alt="Product"
															className="w-full h-full object-cover object-center"
														/>
													</div>
													{/* <Box
                            sx={{
                              width: '100%',
                              height: 200,
                              bgcolor: 'grey.300',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundImage: `url(${imageObj.images})`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                              borderRadius: '8px',
                            }}
                          ></Box> */}
												</Grid>
											))}
										</Grid>
									</Grid>
								)}

								{/* Approve and Cancel Buttons */}
								<Grid
									item
									xs={12}
									className="flex justify-end items-center gap-[10px] !pt-[15px]"
								>
									{localStatus === 0 && (
										<Button
											className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue"
											onClick={() => handleApprove(values)}
										>
											Approve
										</Button>
									)}
									<Button
										className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
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

export default ProductReviewsDialogForm;
