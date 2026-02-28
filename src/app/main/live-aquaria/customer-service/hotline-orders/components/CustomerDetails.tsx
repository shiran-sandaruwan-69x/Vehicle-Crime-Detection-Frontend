import { Grid, TextField, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { Form, Formik } from "formik";
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import React, { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { CUSTOMERS } from "src/app/axios/services/AdminServices";
import { toast } from "react-toastify";
import FormDropdownAutoComplete from "src/app/common/FormComponents/FormDropdownAutoComplete";
import ExtendedAxiosError from "src/app/types/ExtendedAxiosError";
import FuseLoading from "@fuse/core/FuseLoading/FuseLoading";
import {
  CustomerDetailsByIdResponseInterface,
  CustomersInterface,
  CustomersResponseInterface,
} from "../interfaces";

interface Props {
  setSeletedCustomer: React.Dispatch<React.SetStateAction<any>>;
  seletedCustomer: CustomerDetailsByIdResponseInterface;
}

function CustomerDetails({ setSeletedCustomer, seletedCustomer }: Props) {
  const { t } = useTranslation("hotlineOrders");
  const [customersLOV, setCustomersLOV] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchCustomer();
  }, []);

  const fetchCustomer = async () => {
    setLoading(true);
    try {
      const response: AxiosResponse<CustomersResponseInterface> =
        await axios.get(CUSTOMERS);

      if (response.data.data.length > 0) {
        const data = response?.data?.data?.map((item: CustomersInterface) => ({
          value: item.id,
          label: `${item?.code} - ${item?.first_name} ${item?.last_name}`,
        }));
        setCustomersLOV(data);
      } else {
        setCustomersLOV([]);
      }
    } catch (error) {
      toast.error("Internal server error");
    } finally {
      setLoading(false);
    }
  };

  const schema = yup.object().shape({
    customerName: yup.string().required(t("CUSTOMER_NAME_REQUIRED")),
    customerCode: yup.string().required(t("CUSTOMER_CODE_REQUIRED")),
    email: yup.string().required(t("EMAIL_REQUIRED")),
    mobile: yup.string().required(t("MOBILE_NUMBER_REQUIRED")),
    creditsPoints: yup.string().required(t("AVAILABLE_CREDIT_POINTS_REQUIRED")),
    billingAddress: yup.object().shape({
      addressLine1: yup.string().required("Address Line 1 is required"),
      addressLine2: yup.string(),
      zipCode: yup.string().required("Zip Code is required"),
      city: yup.string().required("City is required"),
      state: yup.string().required("State is required"),
      country: yup.string().required("Country is required"),
    }),
    shippingAddress: yup.object().shape({
      addressLine1: yup.string().required("Address Line 1 is required"),
      addressLine2: yup.string(),
      zipCode: yup.string().required("Zip Code is required"),
      city: yup.string().required("City is required"),
      state: yup.string().required("State is required"),
      country: yup.string().required("Country is required"),
    }),
  });

  const renderAddressFields = (
    prefix: "default_billing_address" | "default_shipping_address"
  ) => (
    <Grid container spacing={2} className="pt-[5px]">
      <Grid item xs={12} className="!pt-[5px]">
        <Typography>*Address Line1:</Typography>
        <TextField
          id="outlined-basic"
          variant="outlined"
          disabled
          value={seletedCustomer?.[prefix]?.address_line_1}
          size="small"
          fullWidth
        />
        {/* <Field
          name={`${prefix}.addressLine1`}
          placeholder="Address Line 1"
          component={TextFormField}
          fullWidth
        /> */}
      </Grid>
      <Grid item xs={12} className="!pt-[5px]">
        <Typography>Address Line2:</Typography>
        <TextField
          id="outlined-basic"
          variant="outlined"
          disabled
          value={seletedCustomer?.[prefix]?.address_line_2}
          size="small"
          fullWidth
        />
        {/* <Field
          name={`${prefix}.addressLine2`}
          placeholder="Address Line 2"
          component={TextFormField}
          fullWidth
        /> */}
      </Grid>
      <Grid item xs={12} sm={6} className="!pt-[5px]">
        <Typography>*Zip Code:</Typography>
        <TextField
          id="outlined-basic"
          variant="outlined"
          disabled
          value={seletedCustomer?.[prefix]?.zip_code}
          size="small"
          fullWidth
        />
        {/* <Field
          name={`${prefix}.zipCode`}
          placeholder="Zip Code"
          component={TextFormField}
          fullWidth
        /> */}
      </Grid>
      <Grid item xs={12} sm={6} className="!pt-[5px]">
        <Typography>*City:</Typography>
        <TextField
          id="outlined-basic"
          variant="outlined"
          disabled
          value={seletedCustomer?.[prefix]?.city}
          size="small"
          fullWidth
        />
        {/* <Field
          name={`${prefix}.city`}
          placeholder="City"
          component={FormDropdown}
          fullWidth
          options={cityOptions}
        >
          {({ field, form }) => (
            <FormDropdown
              {...field}
              options={cityOptions}
              value={field.value || ""}
              onChange={(value) => form.setFieldValue(field.name, value)}
            />
          )}
        </Field> */}
      </Grid>
      <Grid item xs={12} sm={6} className="!pt-[5px]">
        <Typography>*State:</Typography>
        <TextField
          id="outlined-basic"
          variant="outlined"
          disabled
          value={seletedCustomer?.[prefix]?.state}
          size="small"
          fullWidth
        />
        {/* <Field
          name={`${prefix}.state`}
          placeholder="State"
          component={FormDropdown}
          fullWidth
          options={stateOptions}
        >
          {({ field, form }) => (
            <FormDropdown
              {...field}
              options={stateOptions}
              value={field.value || ""}
              onChange={(value) => form.setFieldValue(field.name, value)}
            />
          )}
        </Field> */}
      </Grid>
      <Grid item xs={12} sm={6} className="!pt-[5px]">
        <Typography>*Country:</Typography>
        <TextField
          id="outlined-basic"
          variant="outlined"
          disabled
          value={seletedCustomer?.[prefix]?.country?.name}
          size="small"
          fullWidth
        />
        {/* <Field
          name={`${prefix}.country`}
          placeholder="Country"
          component={FormDropdown}
          fullWidth
          options={countryOptions}
        >
          {({ field, form }) => (
            <FormDropdown
              {...field}
              options={countryOptions}
              value={field.value || ""}
              onChange={(value) => form.setFieldValue(field.name, value)}
            />
          )}
        </Field> */}
      </Grid>
    </Grid>
  );

  const handleChangeCustomer = async (id: any) => {
    if (!id) {
      setSeletedCustomer(null);
      return;
    }

    try {
      const response: AxiosResponse<{
        data: CustomerDetailsByIdResponseInterface;
      }> = await axios.get(`${CUSTOMERS}/${id}`);
      setSeletedCustomer(response.data.data);
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

  return loading ? (
    <FuseLoading />
  ) : (
    <Formik
      initialValues={{
        customer_id: seletedCustomer?.id ? seletedCustomer?.id : "",
        email: seletedCustomer?.email ? seletedCustomer?.email : "",
        customerName: "",
        customerCode: seletedCustomer?.code ? seletedCustomer?.code : "",
        mobile: seletedCustomer?.mobile_no ? seletedCustomer?.mobile_no : "",
        creditsPoints: seletedCustomer?.total_credit_points
          ? seletedCustomer?.total_credit_points
          : 0,
        billingAddress: seletedCustomer?.default_billing_address,
        shippingAddress: seletedCustomer?.default_shipping_address,
      }}
      onSubmit={() => {}}
      validationSchema={schema}
      enableReinitialize
    >
      {({ setFieldValue }) => (
        <Form>
          <Grid container spacing={2}>
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              xl={3}
              className="formikFormField pt-[5px!important]"
            >
              <Typography>
                {t("CUSTOMER_NAME")}
                <span className="text-red"> *</span>
              </Typography>
              <FormDropdownAutoComplete
                name="customer_id"
                id="customer_id"
                placeholder=""
                optionsValues={customersLOV}
                onChange={(value: string) => {
                  setFieldValue("customer_id", value);
                  handleChangeCustomer(value);
                }}
              />
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              xl={3}
              className="formikFormField pt-[5px!important]"
            >
              <Typography>{t("CUSTOMER_CODE")}</Typography>

              <TextField
                className="w-full"
                id="outlined-basic"
                variant="outlined"
                disabled
                value={seletedCustomer?.code}
                size="small"
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              xl={3}
              className="formikFormField pt-[5px!important]"
            >
              <Typography>
                {t("EMAIL")}
                <span className="text-red"> *</span>
              </Typography>
              <TextField
                className="w-full"
                id="outlined-basic"
                variant="outlined"
                disabled
                value={seletedCustomer?.email}
                size="small"
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              xl={3}
              className="formikFormField pt-[5px!important]"
            >
              <Typography>{t("MOBILE_NO")}</Typography>
              <TextField
                className="w-full"
                id="outlined-basic"
                variant="outlined"
                disabled
                value={seletedCustomer?.mobile_no}
                size="small"
              />
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              xl={3}
              className="formikFormField pt-[5px!important]"
            >
              <Typography>{t("CREDITS_POINTS")}</Typography>
              <TextField
                className="w-full"
                id="outlined-basic"
                variant="outlined"
                disabled
                value={seletedCustomer?.total_credit_points}
                size="small"
              />
            </Grid>
          </Grid>

          <Grid container spacing={2} className="pt-[10px]">
            <Grid item xs={12} md={6}>
              <div className="w-full p-[10px] border border-[#eeeeee] rounded-[6px] shadow-sm">
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <h6 className="text-[14px] sm:text-[16px] lg:text-[18px] text-gray-800 font-600">
                      Billing Address
                    </h6>
                  </Grid>
                  <Grid item xs={12}>
                    {renderAddressFields("default_billing_address")}
                  </Grid>
                </Grid>
              </div>
            </Grid>
            <Grid item xs={12} md={6}>
              <div className="w-full p-[10px] border border-[#eeeeee] rounded-[6px] shadow-sm">
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <h6 className="text-[14px] sm:text-[16px] lg:text-[18px] text-gray-800 font-600">
                      Shipping Address
                    </h6>
                  </Grid>
                  <Grid item xs={12}>
                    {renderAddressFields("default_shipping_address")}
                  </Grid>
                </Grid>
              </div>
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
              >
                Next
              </Button>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
}

export default CustomerDetails;
