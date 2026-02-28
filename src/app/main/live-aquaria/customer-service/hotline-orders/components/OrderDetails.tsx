import {
  Button,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { Field, Form, Formik } from "formik";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import { FormControl } from "@mui/base";
import axios from "axios";
import { HOTLINE_ORDER_ORDER_CHECKOUT } from "src/app/axios/services/AdminServices";
import ExtendedAxiosError from "src/app/types/ExtendedAxiosError";
import { toast } from "react-toastify";
import TextFormField from "../../../../../common/FormComponents/FormTextField";
import CollectPaymentModal from "./CollectPaymentModal";
import {
  CartShipmentsWithSeletedMethodInterface,
  CustomerCartDetailsResponseInterface,
} from "../interfaces";
// import FormDropdown from '../../../../../../common/FormComponents/FormDropdown';
// import TextFormDateField from '../../../../../../common/FormComponents/TextFormDateField';
// import MaterialTableWrapper from '../../../../../../common/tableComponents/MaterialTableWrapper';

interface Props {
  toggleModal: () => void;
  seletedCustomerWithCartDetails: CustomerCartDetailsResponseInterface;
  seletedShippingMethods: CartShipmentsWithSeletedMethodInterface[];
}

function OrderDetails({
  toggleModal,
  seletedCustomerWithCartDetails,
  seletedShippingMethods,
}: Props) {
  const { t } = useTranslation("hotlineOrders");
  const [, setIsEditable] = useState(false);
  const [isOpenCollectPaymentModal, setIsOpenCollectPaymentModal] =
    useState(false);
  const toggleCollectPaymentModal = () =>
    setIsOpenCollectPaymentModal(!isOpenCollectPaymentModal);
  const [creaditPointsApplied, setCreditPointsApplied] = useState(0);
  const [giftCertificatesApplied, setGiftCertificatesApplied] = useState(0);

  const schema = yup.object().shape({
    orderStatus: yup.string().required(t("ORDER_STATUS_REQUIRED")),
    cancel_order_reason: yup
      .string()
      .required(t("CANCEL_ORDER_REASON_REQUIRED")),
    credit_points: yup.number().when("payment_mode", {
      is: "EMAIL",
      then: yup
        .number()
        .typeError("Must be a number")
        .min(0, "Cannot be negative")
        .max(
          seletedCustomerWithCartDetails?.total_credit_points,
          `Seleted customer has only $ ${seletedCustomerWithCartDetails?.total_credit_points} credit points.`
        )
        .required("Credit Points are required"),
      otherwise: yup.number().notRequired(),
    }),
  });

  // const handleCollectPaymentClick = () => {
  // 	toggleCollectPaymentModal();
  // };

  const orderCheckoutHandler = async () => {
    alert("clicked");
    try {
      await axios.post(`${HOTLINE_ORDER_ORDER_CHECKOUT}`, {
        customer_id: seletedCustomerWithCartDetails?.id,
        ref_number: "123",
        is_email_payment_link: isOpenCollectPaymentModal ? 0 : 1,
        cart_shipments: seletedShippingMethods,
        promo_ids: [],
        giftcard_ids: [],
        credit_points: 0,
        reward_points: 0,
      });
    } catch (error) {
      const axiosError = error as ExtendedAxiosError;

      if (axiosError?.response?.data?.message) {
        toast.error(axiosError.response.data.message);
      } else if (axiosError.message) {
        toast.error(axiosError.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  return (
    <Formik
      initialValues={{
        remarks: "",
        date: "",
        orderStatus: "",
        notify_customer: false,
        cancel_order_reason: "",
        payment_mode: "EMAIL",
        credit_points: 0,
      }}
      onSubmit={orderCheckoutHandler}
      validationSchema={schema}
    >
      {(formik) => (
        <Form>
          <Grid container spacing={2}>
            {/* Gender Radio Group */}
            <Grid item xs={12}>
              <FormControl>
                <RadioGroup
                  className="flex flex-wrap flex-row items-center gap-[10px]"
                  aria-labelledby="demo-radio-buttons-group-label"
                  name="payment_mode"
                  defaultValue={formik.values.payment_mode} // Formik value for gender
                  onChange={(e) =>
                    formik.setFieldValue("payment_mode", e.target.value)
                  }
                >
                  <FormControlLabel
                    className="w-max"
                    value="EMAIL"
                    control={<Radio />}
                    label="Email Payment Link"
                  />
                  <FormControlLabel
                    className="w-max"
                    value="PAYPAL"
                    control={<Radio />}
                    label="Collect Payment Here"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>
          {formik.values.payment_mode === "EMAIL" && (
            <Grid container spacing={2} className="!pt-[15px]">
              <Grid item xs={12} className="formikFormField pt-[5px!important]">
                <hr />
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                className="formikFormField pt-[5px!important]"
              >
                <Typography>Credit Points</Typography>
                <Field
                  type="number"
                  className="w-full"
                  name="credit_points"
                  id="credit_points"
                  placeholder=""
                  disabled={false}
                  component={TextFormField}
                />
              </Grid>
              {/* <Grid
							item
							xs={12}
							sm={6}
							md={4}
							lg={3}
							className="formikFormField pt-[5px!important]"
						>
							<Typography>Promo Code</Typography>
							<Field
								className="w-full rounded-r-0"
								name="promo_code"
								id="promo_code"
								placeholder=""
								disabled={false}
								component={TextFormField}
							/>
						</Grid> */}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                className="formikFormField pt-[5px!important]"
              >
                <Typography>Gift Certificates</Typography>
                <Field
                  className="w-full"
                  name="gift_certificates"
                  id="gift_certificates"
                  placeholder=""
                  disabled={false}
                  component={TextFormField}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                className="formikFormField !pt-[10px] md:!pt-[26px]"
              >
                <Button
                  className="flex justify-center items-center min-w-max lg:min-w-[100px] xl:min-w-[120px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
                  type="button"
                  variant="contained"
                  size="medium"
                  disabled={false}
                >
                  Apply
                </Button>
              </Grid>
            </Grid>
          )}

          {/* <Grid
						container
						spacing={2}
						className="!pt-[15px]"
					>
						<Grid
							item
							xs={12}
							className="formikFormField pt-[15px!important]"
						>
							<hr />
						</Grid>
						<Grid
							item
							xs={12}
							className="formikFormField flex flex-wrap sm:flex-nowrap justify-between items-center gap-[10px] pt-[5px!important]"
						>
							<FormControlLabel
								name="payment_link"
								id="payment_link"
								control={<Checkbox color="primary" />}
								label="Email Payment Link"
								checked
								// onChange={formik.handleChange}
							/>
							<Button
								className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
								type="button"
								onClick={handleCollectPaymentClick}
							>
								Collect Payment Here
							</Button>
						</Grid>
					</Grid> */}

          <div className="w-full p-[10px] mt-[10px] rounded-[6px] border border-[#eeeeee] shadow-sm">
            <Grid container spacing={2} className="!pt-[15px]">
              <Grid item xs={12} sm={6} lg={3} className="pt-[5px!important]">
                <h6 className="text-[12px] lg:text-[14px] mb-[5px]">
                  <span className="inline-block min-w-[149px] lg:min-w-[95px] font-600">
                    Cart Total
                  </span>{" "}
                  : $ {seletedCustomerWithCartDetails?.carts[0]?.total_amount}
                </h6>
                <h6 className="text-[12px] lg:text-[14px] mb-[5px]">
                  <span className="inline-block min-w-[149px] lg:min-w-[95px] font-600">
                    Box Charge
                  </span>{" "}
                  : $ {seletedCustomerWithCartDetails?.carts[0]?.box_charge}
                </h6>
                <h6 className="text-[12px] lg:text-[14px]">
                  <span className="inline-block min-w-[149px] lg:min-w-[95px] font-600">
                    Shipping Cost
                  </span>{" "}
                  : ${" "}
                  {
                    seletedCustomerWithCartDetails?.carts[0]
                      ?.total_shipping_cost
                  }
                </h6>
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                lg={3}
                className="flex flex-wrap place-content-end items-end pt-[5px!important]"
              >
                <h6 className="w-full text-[12px] lg:text-[14px] mb-[5px]">
                  <span className="inline-block min-w-[149px] lg:min-w-[78px] font-600">
                    Tax Total
                  </span>{" "}
                  : $ {seletedCustomerWithCartDetails?.carts[0]?.tax_amount}
                </h6>
                <h6 className="w-full text-[12px] lg:text-[14px] font-800">
                  <span className="inline-block min-w-[149px] lg:min-w-[78px] font-600">
                    Gross Total
                  </span>{" "}
                  : $ {seletedCustomerWithCartDetails?.carts[0]?.amount}
                </h6>
              </Grid>

              <Grid item xs={12} sm={6} lg={3} className="pt-[5px!important]">
                <h6 className="text-[12px] lg:text-[14px] mb-[5px]">
                  <span className="inline-block min-w-[149px] lg:min-w-[174px] font-600">
                    Credit Points Applied
                  </span>{" "}
                  : $ {isOpenCollectPaymentModal ? 0 : creaditPointsApplied}
                </h6>
                <h6 className="text-[12px] lg:text-[14px] mb-[5px]">
                  <span className="inline-block min-w-[149px] lg:min-w-[174px] font-600">
                    {" "}
                    Applicable Reward Points
                  </span>{" "}
                  : $ dummy
                </h6>
                <h6 className="text-[12px] lg:text-[14px]">
                  <span className="inline-block min-w-[149px] lg:min-w-[174px] font-600">
                    Applicable Promos
                  </span>{" "}
                  : $ {seletedCustomerWithCartDetails?.carts[0]?.redeem_promo}
                </h6>
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                lg={3}
                className="flex flex-wrap place-content-end items-end pt-[5px!important]"
              >
                <h6 className="w-full text-[12px] lg:text-[14px] mb-[5px]">
                  <span className="inline-block min-w-[149px] lg:min-w-[101px] font-600">
                    Gift Certificate
                  </span>{" "}
                  : $100
                </h6>
                <h6 className="w-full text-[12px] lg:text-[14px] font-800">
                  <span className="inline-block min-w-[149px] lg:min-w-[101px] font-600">
                    Net Total
                  </span>{" "}
                  : $ dummy
                </h6>
              </Grid>
            </Grid>
          </div>

          <Grid container spacing={2} className="!pt-[15px]">
            <Grid
              item
              md={12}
              sm={12}
              xs={12}
              className="flex flex-wrap sm:flex-nowrap justify-between items-center gap-[10px] pt-[15px!important]"
            >
              <Button className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80">
                Back
              </Button>
              <div className="flex justify-end items-center gap-[10px]">
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
              </div>
            </Grid>
            {isOpenCollectPaymentModal && (
              <CollectPaymentModal
                open={isOpenCollectPaymentModal}
                handleClose={toggleCollectPaymentModal}
              />
            )}
          </Grid>
        </Form>
      )}
    </Formik>
  );
}

export default OrderDetails;
