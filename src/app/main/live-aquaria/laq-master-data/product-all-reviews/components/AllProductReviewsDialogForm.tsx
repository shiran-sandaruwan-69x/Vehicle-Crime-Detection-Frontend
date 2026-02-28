import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import {
  Avatar,
  Box,
  CircularProgress,
  Pagination,
  Rating,
} from '@mui/material';
import { showItemWiseReviews } from 'src/app/axios/services/live-aquaria-services/master-data-services/MasterDataServices';
import Logo from '../../../../../assets/Gold Fish.jpg';
import {
  ItemDetails,
  ItemDetailsModifiedData,
  ProductIdResponseTypes,
} from '../all-review-types/AllProductReviewsTypes';

interface Props {
  toggleModal: () => void;
  isOpen: boolean;
  clickedRowData: ItemDetailsModifiedData;
  compType: string;
}

function AllProductReviewsDialogForm({
  toggleModal,
  isOpen,
  clickedRowData,
  compType,
}: Props) {
  const { t } = useTranslation('productReviews');

  const [isReviews, setReviews] = useState<ItemDetails>({});
  const [isLoading, setIsLoading] = useState(true);

  const onSubmit = (values) => {};

  const schema = yup.object().shape({});

  useEffect(() => {
    showProductItemReviews();
  }, []);

  const showProductItemReviews = async () => {
    setIsLoading(true);
    try {
      const productId = clickedRowData.id ? clickedRowData.id : '';
      const response: ProductIdResponseTypes =
        await showItemWiseReviews(productId);
      setReviews(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching product data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // const reviewImages = clickedRowData.customer_reviews.images;

  // Maximum number of reviews per page
  const REVIEWS_PER_PAGE = 5;

  {
    /* Review Comments */
  }
  const [currentPage, setCurrentPage] = useState(1);
  const totalReviews = clickedRowData.customer_reviews.length;
  const totalPages = Math.ceil(totalReviews / REVIEWS_PER_PAGE);

  // Function to handle page change
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Calculate reviews to display for the current page
  const currentReviews = clickedRowData.customer_reviews.slice(
    (currentPage - 1) * REVIEWS_PER_PAGE,
    currentPage * REVIEWS_PER_PAGE
  );

  if (isLoading) {
    return (
      <div className='flex justify-center items-center w-full min-h-[100px]'>
        <CircularProgress className='text-primaryBlue' />
      </div>
    );
  }

  return (
    <Dialog fullWidth open={isOpen} maxWidth='lg' onClose={toggleModal}>
      <DialogTitle className='pb-0'>
        <h6 className='text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-400'>
          View All
        </h6>
      </DialogTitle>

      <DialogContent className='pb-0 !pt-[10px]'>
        <Formik
          initialValues={{
            productName: clickedRowData.title || '',
            productId: clickedRowData.code || '',
            scientificName: clickedRowData.scientific_name || '',
            title: clickedRowData.title,
            approvedStatus:
              clickedRowData.status === 0 ? 'Pending...!' : 'Approved',
            productRating: clickedRowData.average_product_rating || '',
            deliveryRating: clickedRowData.average_delivery_rating || '',
            cancellationRating: clickedRowData.average_product_rating || '',
            refundRating: clickedRowData.average_delivery_rating || '',
            satisfiedProductRating:
              clickedRowData.customer_reviews.map(
                (review) => review.product_rating
              ) || '',
            satisfiedDeliveryRating:
              clickedRowData.customer_reviews.map(
                (review) => review.delivery_rating
              ) || '',
            custName:
              clickedRowData.customer_reviews.map(
                (review) =>
                  `${review.customer_details.first_name} ${review.customer_details.last_name}`
              ) || '',
            custCode:
              clickedRowData.customer_reviews.map(
                (review) => review.customer_details.code
              ) || '',
            custFeedback:
              clickedRowData.customer_reviews.map(
                (review) => review.feedback
              ) || '',
            images:
              clickedRowData.customer_reviews.map((review) => review.images) ||
              [],

            // feedback: clickedRowData.feedback || '',
          }}
          validationSchema={schema}
          onSubmit={onSubmit}
        >
          {({ values }) => (
            <Form>
              <Grid container spacing={2} className='pt-[10px] pb-[20px]'>
                {/* Product Information */}
                <Grid item xl={2} md={2} sm={3} xs={12} className='!pt-[5px]'>
                  <div className='w-full max-w-[200px] aspect-square mx-auto rounded-full overflow-hidden'>
                    <img
                      src={
                        currentReviews && currentReviews.length > 0
                          ? currentReviews.find(
                              (review) =>
                                review.images && review.images.length > 0
                            )?.images[0].images || Logo
                          : Logo // Display default image
                      }
                      alt='Product'
                      className='w-full h-full object-cover object-center'
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
                  className='flex flex-wrap items-center h-full !pt-[30px]'
                >
                  <div className='flex flex-wrap sm:!flex-nowrap items-center gap-[5px] w-full mb-[10px]'>
                    <p className='min-w-[120px] text-[10px] sm:text-[12px] lg:text-[14px] mb-0'>
                      Product Name
                    </p>
                    <p className='text-[10px] sm:text-[12px] lg:text-[14px] font-500 mb-0'>
                      : {values.productName}
                    </p>
                  </div>

                  <div className='flex flex-wrap sm:!flex-nowrap items-center gap-[5px] w-full mb-[10px]'>
                    <p className='min-w-[120px] text-[10px] sm:text-[12px] lg:text-[14px] mb-0'>
                      Product CODE
                    </p>
                    <p className='text-[10px] sm:text-[12px] lg:text-[14px] font-500 mb-0'>
                      : {values.productId}
                    </p>
                  </div>

                  <div className='flex flex-wrap sm:!flex-nowrap items-center gap-[5px] w-full mb-[10px]'>
                    <p className='min-w-[120px] text-[10px] sm:text-[12px] lg:text-[14px] mb-0'>
                      Scientific Name
                    </p>
                    <p className='text-[10px] sm:text-[12px] lg:text-[14px] font-500 mb-0'>
                      : {values.scientificName}
                    </p>
                  </div>

                  <div className='flex flex-wrap sm:!flex-nowrap items-center gap-[5px] w-full'>
                    <p className='min-w-[120px] text-[10px] sm:text-[12px] lg:text-[14px] mb-0'>
                      Title
                    </p>
                    <p className='text-[10px] sm:text-[12px] lg:text-[14px] font-500 mb-0'>
                      : {values.title}
                    </p>
                  </div>
                </Grid>

                <Grid item xs={12} className='!py-[15px]'>
                  <hr />
                </Grid>

                {/* Rating Breakdown */}
                <Grid item xs={12} className='!pt-0'>
                  <h6 className='text-[12px] sm:text-[14px] lg:text-[16px] font-600 mb-[16px]'>
                    Rating Breakdown
                  </h6>
                  <Grid container spacing={2}>
                    <Grid
                      item
                      xs={12}
                      md={6}
                      className='flex flex-wrap justify-between md:justify-start items-center gap-[15px] !pt-[5px]'
                    >
                      <p className='text-[10px] sm:text-[12px] lg:text-[14px] mb-0'>
                        Customer ratings
                      </p>
                      <Rating
                        name='customerRating'
                        value={values.productRating}
                        readOnly
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      md={6}
                      className='flex flex-wrap justify-between md:justify-end items-center gap-[15px] !pt-[5px]'
                    >
                      <p className='text-[10px] sm:text-[12px] lg:text-[14px] mb-0'>
                        Rate of timely delivery of orders
                      </p>
                      <Rating
                        name='deliveryRating'
                        value={values.deliveryRating}
                        readOnly
                      />
                    </Grid>
                    {/* <Grid
											item
											xs={12}
											sm={6}
											lg={3}
											className="text-center !pt-[10px]"
										>
											<p className="text-[12px] sm:text-[14px] lg:text-[16px] font-600 !mb-[2px]">
												Rate of Order cancellations
											</p>
											<Rating
												name="cancellationRating"
												value={values.productRating}
												readOnly
											/>
										</Grid>
										<Grid
											item
											xs={12}
											sm={6}
											lg={3}
											className="text-center !pt-[10px]"
										>
											<p className="text-[12px] sm:text-[14px] lg:text-[16px] font-600 !mb-[2px]">
												Customer Code
											</p>
											<Rating
												name="refundRating"
												value={values.deliveryRating}
												readOnly
											/>
										</Grid> */}
                  </Grid>
                </Grid>
                <Grid item xs={12} className='!py-[15px]'>
                  <hr />
                </Grid>
                {/* Review Comments */}
                <Grid item xs={12} className='!pt-0'>
                  {/* {clickedRowData.customer_reviews.length > 0 ? ( */}
                  <h6 className='text-[12px] sm:text-[14px] lg:text-[16px] font-600 mb-[16px]'>
                    Review Comments ({clickedRowData.customer_reviews.length})
                  </h6>
                  {totalReviews > 0 ? (
                    <Grid container spacing={2}>
                      {currentReviews.map((review, index) => (
                        <Grid
                          key={review.id}
                          item
                          xs={12}
                          className='pb-[10px]'
                        >
                          <Grid key={index} container spacing={2}>
                            <Grid
                              item
                              xs={12}
                              md={6}
                              className='flex items-center gap-[10px] !pt-[5px]'
                            >
                              <Avatar
                                className='w-[36px] sm:w-[50px] min-w-[36px] sm:min-w-[50px] h-[36px] sm:h-[50px] bg-primaryBlueLight'
                                alt='User Image'
                              >
                                <AccountCircleIcon className='w-full text-[16px] sm:text-[24px] text-white' />
                              </Avatar>

                              <div className='w-full'>
                                <div className='flex flex-wrap sm:!flex-nowrap items-center gap-[5px] w-full mb-[5px]'>
                                  <p className='min-w-[120px] text-[10px] sm:text-[12px] lg:text-[14px] mb-0'>
                                    Name
                                  </p>
                                  <p className='text-[10px] sm:text-[12px] lg:text-[14px] font-500 mb-0'>
                                    :{' '}
                                    {`${review.customer_details.first_name} ${review.customer_details.last_name}`}{' '}
                                  </p>
                                </div>
                                <div className='flex flex-wrap sm:!flex-nowrap items-center gap-[5px] w-full mb-[5px]'>
                                  <p className='min-w-[120px] text-[10px] sm:text-[12px] lg:text-[14px] mb-0'>
                                    Customer Code
                                  </p>
                                  <p className='text-[10px] sm:text-[12px] lg:text-[14px] font-500 mb-0'>
                                    : {review.customer_details.code}
                                  </p>
                                </div>
                              </div>
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              md={6}
                              className='flex flex-wrap items-center gap-[5px] !pt-[5px]'
                            >
                              <div className='flex flex-wrap sm:!flex-nowrap md:justify-end items-center gap-[10px] w-full'>
                                <p className='text-[10px] sm:text-[12px] lg:text-[14px] mb-0'>
                                  Are you satisfied with the product?
                                </p>
                                <Rating
                                  name='satisfiedProductRating'
                                  value={review.product_rating}
                                  readOnly
                                />
                              </div>

                              <div className='flex flex-wrap sm:!flex-nowrap md:justify-end items-center gap-[10px] w-full'>
                                <p className='text-[10px] sm:text-[12px] lg:text-[14px] mb-0'>
                                  Are you satisfied with the Delivery?
                                </p>
                                <Rating
                                  name='satisfiedProductRating'
                                  value={review.delivery_rating}
                                  readOnly
                                />
                              </div>
                            </Grid>

                            {/* <Box
                            key={index}
                            display='flex'
                            justifyContent='space-between'
                            alignItems='center'
                          >
                            <Box display='flex' alignItems='center'>
                              <Avatar
                                alt='User Image'
                                style={{ marginRight: '8px' }}
                              >
                                <AccountCircleIcon />
                              </Avatar>
                              <Box ml={2}>
                                <Typography
                                  variant='body1'
                                  style={{
                                    fontWeight: 'bold',
                                    marginRight: '16px',
                                  }}
                                >
                                  Name: {review.customer_details.first_name}{' '}
                                </Typography>
                                <Typography
                                  mt={1}
                                  variant='body2'
                                  style={{ fontWeight: 'bold' }}
                                >
                                  Customer Code: {review.customer_details.code}
                                </Typography>
                              </Box>
                            </Box>
                            <Box
                              display='flex'
                              flexDirection='column'
                              alignItems='flex-end'
                            >
                              <Box display='flex' alignItems='center'>
                                <Typography>
                                  Are you satisfied with the product?
                                </Typography>
                                <Rating
                                  name='satisfiedProductRating'
                                  value={review.product_rating}
                                  readOnly
                                  style={{ marginLeft: '8px' }}
                                />
                              </Box>
                              <Box display='flex' alignItems='center' mt={1}>
                                <Typography>
                                  Are you satisfied with the delivery?
                                </Typography>
                                <Rating
                                  name='satisfiedDeliveryRating'
                                  value={review.delivery_rating}
                                  readOnly
                                  style={{ marginLeft: '8px' }}
                                />
                              </Box>
                            </Box>
                          </Box> */}

                            <Grid item xs={12} className='!py-[15px]'>
                              <hr />
                            </Grid>

                            <Grid item xs={12} className='!pt-0'>
                              <h6 className='text-[12px] sm:text-[14px] lg:text-[16px] font-600 mb-[10px]'>
                                Feedback
                              </h6>
                              <p className='text-[10px] sm:text-[12px] lg:text-[14px] mb-0'>
                                {review.feedback}
                              </p>
                            </Grid>

                            <Grid item xs={12} className='!py-[15px]'>
                              <hr />
                            </Grid>

                            {review.images && review.images.length > 0 && (
                              <Grid item xs={12} className='!pt-0'>
                                <h6 className='text-[12px] sm:text-[14px] lg:text-[16px] font-600 mb-[15px]'>
                                  Images
                                </h6>
                                <Grid container spacing={2}>
                                  {review.images.map((imageObj, index) => (
                                    <Grid
                                      item
                                      xs={6}
                                      sm={4}
                                      md={3}
                                      key={index}
                                      className='!pt-[10px]'
                                    >
                                      <div className='w-full aspect-square rounded-[12px] lg:rounded-[22px] overflow-hidden'>
                                        <img
                                          src={imageObj.images}
                                          alt='Product'
                                          className='w-full h-full object-cover object-center'
                                        />
                                      </div>
                                      {/* <Box
                                        sx={{
                                          width: '100%',
                                          height: 150,
                                          bgcolor: 'grey.300',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          backgroundImage: `url(${imageObj.images})`,
                                          backgroundSize: 'cover',
                                          backgroundPosition: 'center',
                                          borderRadius: '8px',
                                        }}
                                      >
                                        <p className="text-[10px] sm:text-[12px] lg:text-[14px] text-white text-justify lg:text-left font-400">
																					Image {index + 1}
																				</p>
                                      </Box> */}
                                    </Grid>
                                  ))}
                                </Grid>
                              </Grid>
                            )}
                          </Grid>
                        </Grid>
                      ))}
                      {/* Pagination Component */}
                      <Grid
                        item
                        xs={12}
                        className='flex justify-center items-center !pt-[15px]'
                      >
                        <Pagination
                          className='text-primaryBlue'
                          count={totalPages}
                          page={currentPage}
                          onChange={handlePageChange}
                          variant='outlined'
                          color='primary'
                        />
                      </Grid>
                    </Grid>
                  ) : (
                    <p className='text-[10px] sm:text-[12px] lg:text-[14px] mb-0'>
                      No reviews to display
                    </p>
                  )}
                </Grid>

                {/* Approve and Cancel Buttons */}
                <Grid
                  item
                  xs={12}
                  className='flex justify-end items-center gap-[10px] !pt-[15px]'
                >
                  <Button
                    className='flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80'
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

export default AllProductReviewsDialogForm;
