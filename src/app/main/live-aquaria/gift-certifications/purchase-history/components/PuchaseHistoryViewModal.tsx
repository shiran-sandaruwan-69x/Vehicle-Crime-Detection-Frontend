import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { Field, Form, Formik } from "formik";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import TextFormField from "../../../../../common/FormComponents/FormTextField";
import TextFormDateField from "../../../../../common/FormComponents/TextFormDateField";
import { GiftCertificateMainInterface } from "../PurchaseHistory";

interface PurchaseHistoryProps {
  isOpen: boolean;
  toggleModal: () => void;
  clickedRowData: GiftCertificateMainInterface;
}

function PurchaseHistoryViewModal({
  isOpen,
  toggleModal,
  clickedRowData,
}: PurchaseHistoryProps) {
  console.log("clickedRowData", clickedRowData);

  const { t } = useTranslation("purchaseHistory");
  const [thumbnail, setThumbnail] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      setThumbnail(file);
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const schema = yup.object().shape({
    // gift_card_name: yup.string().required(t("Gift Card Name is required!")),
    // display_name: yup.string().required(t("Display Name is required!")),
    // code_sequence: yup.number().required(t("Code Sequence is required!")),
  });

  return (
    <Dialog
      fullWidth
      open={isOpen}
      maxWidth="lg"
      onClose={toggleModal}
      PaperProps={{
        style: {
          top: "40px",
          margin: 0,
          position: "absolute",
        },
      }}
    >
      <DialogTitle className="pb-0">
        <h6 className="text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-400">
          View a Gift Certificate
        </h6>
      </DialogTitle>
      <DialogContent>
        <Formik
          initialValues={{
            order_id: clickedRowData?.order_id,
            customer_id: clickedRowData?.customer?.code,
            gift_card_code: clickedRowData?.code,
            recipient_email: clickedRowData?.email,
            gift_card_name: clickedRowData?.gift_certificate?.name,
            display_name: clickedRowData?.gift_certificate?.display_name,
            purchase_date: clickedRowData?.created_at
              ? new Date(clickedRowData?.created_at).toISOString().split("T")[0]
              : null,
            expire_date: clickedRowData?.gift_certificate?.end_date,
            price: clickedRowData?.gift_certificate?.price,
          }}
          onSubmit={async (values) => {
            // const base64Thumbnail = thumbnail ? await convertToBase64(thumbnail) : null;
            // console.log({ ...values, thumbnail: base64Thumbnail });
          }}
          validationSchema={schema}
          enableReinitialize
        >
          {({ setFieldValue, values }) => (
            <Form>
              <Grid container spacing={2} className="pt-[10px]">
                <Grid
                  item
                  lg={3}
                  md={4}
                  sm={6}
                  xs={12}
                  className="formikFormField pt-[5px!important]"
                >
                  <Typography>{t("ORDER_ID")}</Typography>
                  <Field
                    name="order_id"
                    component={TextFormField}
                    fullWidth
                    size="small"
                    placeholder="Placeholder"
                    disabled
                  />
                </Grid>
                <Grid
                  item
                  lg={3}
                  md={4}
                  sm={6}
                  xs={12}
                  className="formikFormField pt-[5px!important]"
                >
                  <Typography>{t("CUSTOMER_ID")}</Typography>
                  <Field
                    name="customer_id"
                    component={TextFormField}
                    fullWidth
                    size="small"
                    placeholder="Placeholder"
                    disabled
                  />
                </Grid>
                <Grid
                  item
                  lg={3}
                  md={4}
                  sm={6}
                  xs={12}
                  className="formikFormField pt-[5px!important]"
                >
                  <Typography>{t("GIFT_CARD_CODE")}</Typography>
                  <Field
                    name="gift_card_code"
                    component={TextFormField}
                    fullWidth
                    size="small"
                    placeholder="Placeholder"
                    disabled
                  />
                </Grid>
                <Grid
                  item
                  lg={3}
                  md={4}
                  sm={6}
                  xs={12}
                  className="formikFormField pt-[5px!important]"
                >
                  <Typography>{t("RECIPIENT_EMAIL")}</Typography>{" "}
                  <Field
                    name="recipient_email"
                    component={TextFormField}
                    fullWidth
                    size="small"
                    placeholder="Placeholder"
                    disabled
                  />
                </Grid>

                {/* Row 2 */}
                <Grid
                  item
                  lg={3}
                  md={4}
                  sm={6}
                  xs={12}
                  className="formikFormField pt-[5px!important]"
                >
                  <Typography>
                    {t("GIFT_CARD_NAME")}
                    <span style={{ color: "#BC1C4C" }}> *</span>
                  </Typography>
                  <Field
                    name="gift_card_name"
                    component={TextFormField}
                    fullWidth
                    size="small"
                    disabled
                    placeholder="Placeholder"
                  />
                </Grid>
                <Grid
                  item
                  lg={3}
                  md={4}
                  sm={6}
                  xs={12}
                  className="formikFormField pt-[5px!important]"
                >
                  <Typography>
                    {t("DISPLAY_NAME")}
                    <span style={{ color: "#BC1C4C" }}> *</span>
                  </Typography>
                  <Field
                    name="display_name"
                    component={TextFormField}
                    fullWidth
                    size="small"
                    placeholder="Placeholder"
                    disabled
                  />
                </Grid>
                <Grid
                  item
                  lg={3}
                  md={4}
                  sm={6}
                  xs={12}
                  className="formikFormField pt-[5px!important]"
                >
                  <Typography>{t("PURCHASE_DATE")}</Typography>
                  <TextFormDateField
                    name="purchase_date"
                    type="date"
                    disabled
                    id="purchase_date"
                    placeholder=""
                  />
                </Grid>
                <Grid
                  item
                  lg={3}
                  md={4}
                  sm={6}
                  xs={12}
                  className="formikFormField pt-[5px!important]"
                >
                  <Typography>{t("EXPIRE_DATE")}</Typography>
                  <TextFormDateField
                    name="expire_date"
                    type="date"
                    id="expire_date"
                    disabled
                    placeholder=""
                  />
                </Grid>

                {/* Row 3 */}
                <Grid
                  item
                  lg={3}
                  md={4}
                  sm={6}
                  xs={12}
                  className="formikFormField pt-[5px!important]"
                >
                  <Typography>{t("PRICE")}</Typography>
                  <Field
                    name="price"
                    component={TextFormField}
                    fullWidth
                    size="small"
                    type="number"
                    disabled
                  />
                </Grid>

                <Grid item xs={12} className="!pt-0"></Grid>

                {/* Image Upload */}
                <Grid
                  item
                  lg={6}
                  md={6}
                  sm={12}
                  xs={12}
                  className="formikFormField pt-[5px!important]"
                >
                  <Typography>Gift Certificate Thumbnail</Typography>
                  <Paper
                    elevation={0}
                    className="relative flex justify-center items-center w-full h-[400px] border border-[#ccc] rounded-[8px] overflow-hidden"
                  >
                    <img
                      src={
                        clickedRowData?.gift_certificate?.thumbnail
                          ? clickedRowData?.gift_certificate?.thumbnail // Use uploaded image
                          : "" // Default image
                      }
                      alt="Gift Certificate Thumbnail"
                      className="w-full h-full object-contain object-center rounded-[8px]"
                    />
                    <input
                      type="file"
                      onChange={handleImageUpload}
                      style={{ display: "none" }}
                      id="image-upload"
                    />
                  </Paper>
                </Grid>

                <Grid
                  item
                  lg={6}
                  md={6}
                  sm={12}
                  xs={12}
                  className="formikFormField pt-[5px!important]"
                >
                  <Typography>Gift Certificate Style</Typography>
                  <Paper
                    elevation={0}
                    className="relative flex justify-center items-center w-full h-[400px] border border-[#ccc] rounded-[8px] overflow-hidden"
                  >
                    <img
                      src={
                        clickedRowData?.gift_certificate?.style
                          ? clickedRowData?.gift_certificate?.style // Use uploaded image
                          : "" // Default image
                      }
                      alt="Gift Certificate Thumbnail"
                      className="w-full h-full object-contain object-center rounded-[8px]"
                    />
                    <input
                      type="file"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                  </Paper>
                </Grid>

                {/* Buttons */}
                <Grid
                  item
                  md={12}
                  sm={12}
                  xs={12}
                  className="flex justify-end items-center gap-[10px] pt-[15px!important]"
                >
                  <Button
                    className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
                    type="button"
                    variant="contained"
                    size="medium"
                    onClick={toggleModal}
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

export default PurchaseHistoryViewModal;
