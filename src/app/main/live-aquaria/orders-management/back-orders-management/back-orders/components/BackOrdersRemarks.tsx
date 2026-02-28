import { Button, Grid, TextField, Typography } from "@mui/material";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import { toast } from "react-toastify";
import axios, { AxiosResponse } from "axios";
import {
  BACK_ORDER_UPDATE,
  FETCH_ORDER_CANCEL_REASONS,
  FETCH_ORDER_STATUS,
} from "src/app/axios/services/AdminServices";
import OrdersLogTable from "src/app/common/OrdersLogTable";
import { OrderDetailsData } from "../BackOrdersModel";
import TextFormDateField from "../../../../../../common/FormComponents/TextFormDateField";
import FormDropdown from "../../../../../../common/FormComponents/FormDropdown";

interface Props {
  toggleModal: () => void;
  order: OrderDetailsData;
}

function BackOrdersRemarks({ toggleModal, order }: Props) {
  const { t } = useTranslation("backOrders");
  const [canselOrderReasons, setCancelOrderReasons] = useState<
    { value: string; label: string }[]
  >([]);
  const [orderStatus, setOrderStatus] = useState<
    { value: number; label: string }[]
  >([]);

  useEffect(() => {
    fetchOrderCancelReasons();
    fetchOrderStatus();
  }, []);

  const fetchOrderCancelReasons = async () => {
    try {
      const response: AxiosResponse<{
        data: { id: number; reason: string; is_active: number }[];
      }> = await axios.get(`${FETCH_ORDER_CANCEL_REASONS}`);

      const modifiedData = response.data.data.map((item) => ({
        value: item.reason,
        label: item.reason,
      }));
      setCancelOrderReasons(modifiedData);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const fetchOrderStatus = async () => {
    try {
      const response: AxiosResponse<{
        data: { id: number; name: string; is_active: number }[];
      }> = await axios.get(`${FETCH_ORDER_STATUS}`);

      const modifiedData = response.data.data
        .filter(
          (item: any) => item.name == "Approved" || item.name == "Rejected"
        )
        .map((item) => ({
          value: item.id,
          label: item.name,
        }));

      setOrderStatus(modifiedData);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const schema = yup.object().shape({
    remarks: yup.string(),
    date: yup.string().required("Date is required"),
    orderStatus: yup.string().required("Order status is required"),
    cancel_order_reason: yup.string().when("orderStatus", {
      is: "3", // Assuming '3' means canceled
      then: yup.string().required("Cancel reason is required"),
      otherwise: yup.string(),
    }),
  });

  const formSubmit = async (values: any) => {
    try {
      await axios.put(`${BACK_ORDER_UPDATE}${order.id}`, {
        remark: values.remarks,
        estimated_delivery_date: values.date,
        order_status_id: values.orderStatus,
        cancel_reason: values.cancel_order_reason,
        is_notify_customer: true,
      });
      toast.success("Order updated successfully");
      toggleModal();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="min-w-full max-w-[100vw]">
      <Formik
        initialValues={{
          remarks: order?.remark,
          date: order?.estimated_delivery_date,
          orderStatus: order?.order_status,
          cancel_order_reason: "",
        }}
        onSubmit={formSubmit}
        validationSchema={schema}
      >
        {(formik) => (
          <Form>
            <Grid container spacing={2} className="pt-[5px]">
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                className="formikFormField pt-[5px!important]"
              >
                <Typography>{t("CHANGE_EXPECTED_DELIVERY_DATE")}</Typography>
                <TextFormDateField
                  name="date"
                  type="date"
                  placeholder=""
                  id="date"
				  min={new Date().toISOString().split('T')[0]} // Set today's date as min
				  max={new Date().toISOString().split('T')[0]} // Set max if needed
                  changeInput={(value: string, form: any) => {
                    form.setFieldValue("date", value);
                  }}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                className="formikFormField pt-[5px!important]"
              >
                <Typography>
                  {t("ORDER_STATUS")}
                  <span className="text-red"> *</span>
                </Typography>
                <FormDropdown
                  name="orderStatus"
                  id="orderStatus"
                  placeholder=""
                  optionsValues={orderStatus}
                  disabled={false}
                />
              </Grid>
              {formik.values.orderStatus === 3 && (
                <Grid
                  item
                  xs={12}
                  sm={12}
                  lg={3}
                  className="formikFormField pt-[5px!important]"
                >
                  <Typography>
                    {t("CANCEL_ORDER_REASON")}
                    <span className="text-red"> *</span>
                  </Typography>
                  <FormDropdown
                    name="cancel_order_reason"
                    id="cancel_order_reason"
                    placeholder=""
                    optionsValues={canselOrderReasons}
                    disabled={false}
                  />
                </Grid>
              )}

              <Grid item xs={12} className="formikFormField pt-[5px!important]">
                <Typography className="formTypography">Remarks</Typography>
                <TextField
                  name="remarks"
                  fullWidth
                  multiline
                  rows={4}
                  placeholder="Placeholder"
                  variant="outlined"
                  label=""
                  {...formik.getFieldProps("remarks")}
                />
				<div className="text-red">
                      {formik.errors.remarks?.message}
                    </div>
              </Grid>

              <Grid item xs={12} className="pt-[10px!important]">
                {order?.logs && order?.logs?.length > 0 && (
                  <OrdersLogTable tableData={order.logs} />
                )}
              </Grid>

              <Grid
                item
                md={12}
                sm={12}
                xs={12}
                className="flex justify-end items-center gap-[10px] pt-[15px!important] mb-[15px]"
              >
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
                  Update
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default BackOrdersRemarks;
