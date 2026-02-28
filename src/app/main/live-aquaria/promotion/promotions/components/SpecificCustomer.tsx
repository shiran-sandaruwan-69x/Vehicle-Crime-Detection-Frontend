import React, { ChangeEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Grid,
  Typography,
  Button,
  RadioGroup,
  Radio,
  CircularProgress,
} from "@mui/material";
import { Field, Form, Formik, FormikHelpers } from "formik";
import * as yup from "yup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { toast } from "react-toastify";
import axios, { AxiosResponse } from "axios";
import TextFormField from "../../../../../common/FormComponents/FormTextField";
import FormDropdown from "../../../../../common/FormComponents/FormDropdown";
import TextFormDateField from "../../../../../common/FormComponents/TextFormDateField";
import {
  DiscountPromotionForm,
  PromotionCustomerApiRes,
  PromotionCustomerRes,
  PromotionModifiedData,
} from "../promotions-types/PromotionsTypes";
import { ShippingHoldsSubmitType } from "../../../shipping/shipping-delays/shipping-holds-types/ShippingHoldsType";
import {
  CREATE_PROMOTION,
  GET_CUSTOMER,
} from "../../../../../axios/services/live-aquaria-services/promotion-services/PromotionsServices";

interface ErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}

interface Props {
  toggleModal?: () => void;
  isMode?: string;
  fetchAllPromotion: () => void;
  clickedRowData: PromotionModifiedData;
}

function SpecificCustomer({
  toggleModal,
  isMode,
  fetchAllPromotion,
  clickedRowData,
}: Props) {
  const { t } = useTranslation("promotions");
  const [isDataLoading, setDataLoading] = useState(false);
  const [isSearchDataLoading, setSearchDataLoading] = useState(false);
  const [isPriceEnabled, setIsPriceEnabled] = useState(true);
  const today = new Date().toISOString().split("T")[0];

  const maxImageCount = 1;
  const maxImageSize = 5 * 1024 * 1024; // 5MB
  const [images, setImages] = useState<{ file: File; base64: string }[]>([]);
  const [isSaveEnabled, setIsSaveEnabled] = useState(false);

  const [isYearEnabled, setIsYearEnabled] = useState(true);
  const [isMonthEnabled, setIsMonthEnabled] = useState(true);
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear().toString();
  const currentMonthNumber = currentDate.getMonth() + 1;
  const currentMonthName = currentDate
    .toLocaleString("default", { month: "short" })
    .toUpperCase();
  const [randomDigits, setRandomDigits] = useState("");

  const [customerDetails, setCustomerDetails] =
    useState<PromotionCustomerRes>(null);
  const [isCustomerDataLoading, setCustomerDataLoading] = useState(false);

  useEffect(() => {
    setRandomDigits("");

    if (clickedRowData?.banner) {
      loadImageFromURL(clickedRowData?.banner);
    }
  }, []);

  const schema = yup.object().shape({
    promotionName: yup.string().required("Promotion Name is required"),
    activeForm: yup.string().required("Active From is required"),
    activeUntil: yup.string().required("Active Until is required"),
    promotionPercentage: yup
      .number()
      .typeError("Promotion Percentage must be a number")
      .required("Promotion Percentage is required")
      .min(0, "Negative values are not allowed")
      .test(
        "is-not-negative-zero",
        "Negative zero (-0) is not allowed",
        (value: number) => value !== -0
      ),
    noOfDigits: yup
      .number()
      .min(1, "Must be at least 1")
      .max(9, "Cannot be more than 9")
      .integer("Must be a whole number"),
    customerCode: yup.string().required("Customer Code is required"),
  });

  // image fun
  const loadImageFromURL = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const file = new File([blob], "image.png", { type: blob.type });
      const base64 = await convertToBase64(file);
      setImages([{ file, base64 }]);
    } catch (error) {
      // toast.error('Failed to load image:');
    }
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { files } = event.target;

    if (files) {
      if (images.length + files.length > maxImageCount) {
        toast.error(
          `You can only upload a maximum of ${maxImageCount} images.`
        );
        return;
      }

      const validImages: { file: File; base64: string }[] = [];
      // eslint-disable-next-line no-restricted-syntax
      for (const file of Array.from(files)) {
        // eslint-disable-next-line no-await-in-loop
        const isValid = await validateImageDimensions(file);

        if (isValid) {
          // eslint-disable-next-line no-await-in-loop
          const base64 = await convertToBase64(file);
          validImages.push({ file, base64 });
        }
      }

      if (validImages.length > 0) {
        setImages([...images, ...validImages]);
        setIsSaveEnabled(true);
      }
    }
  };

  const validateImageDimensions = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        if (img.width === img.height && file.size <= maxImageSize) {
          resolve(true);
        } else {
          toast.error(
            "Image upload failed: Width and height must be the same, and size should be <= 5MB."
          );
          resolve(false);
        }
      };
    });
  };

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

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    setIsSaveEnabled(newImages.length > 0);
  };

  // code generate
  const handleYearCheckboxChange = (
    event: ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: any) => void
  ) => {
    const { checked } = event.target;
    setIsYearEnabled(checked);

    if (!checked) {
      setFieldValue("yearFormat", "");
      setFieldValue("year_order", "");
    }

    if (checked) {
      setFieldValue("yearFormat", "YYYY");
      setFieldValue("year_order", "");
    }
  };

  const handleMonthCheckboxChange = (
    event: ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: any) => void
  ) => {
    const { checked } = event.target;
    setIsMonthEnabled(checked);

    if (!checked) {
      setFieldValue("monthFormat", "");
      setFieldValue("month_order", "");
    }

    if (checked) {
      setFieldValue("monthFormat", "Name");
      setFieldValue("month_order", "");
    }
  };

  const generateCode = (values: DiscountPromotionForm) => {
    const codeParts = ["", "", "", ""];

    if (values.code_prefix_order) {
      codeParts[parseInt(values.code_prefix_order, 10) - 1] =
        values.codePrefix || "";
    }

    if (values.year_order && values.yearFormat) {
      codeParts[parseInt(values.year_order, 10) - 1] =
        values.yearFormat === "YYYY" ? currentYear : currentYear.slice(-2);
    }

    if (values.month_order && values.monthFormat) {
      codeParts[parseInt(values.month_order, 10) - 1] =
        values.monthFormat === "Name"
          ? currentMonthName
          : currentMonthNumber.toString().padStart(2, "0");
    }

    if (values.no_of_digits_order && values.noOfDigits) {
      if (values.noOfDigits < 10) {
        // Generate new random digits only if they don't exist or if noOfDigits has changed
        if (!randomDigits || randomDigits.length !== values.noOfDigits) {
          let newRandomDigits = "";
          for (let i = 0; i < values.noOfDigits; i++) {
            newRandomDigits += Math.floor(Math.random() * 10).toString();
          }
          setRandomDigits(newRandomDigits);
          codeParts[parseInt(values.no_of_digits_order, 10) - 1] =
            newRandomDigits;
        } else {
          codeParts[parseInt(values.no_of_digits_order, 10) - 1] = randomDigits;
        }
      }
    }

    return codeParts.join("");
  };

  // customer code search button
  const searchCustomerCode = async (values: DiscountPromotionForm) => {
    try {
      setCustomerDataLoading(true);
      const response: AxiosResponse<PromotionCustomerApiRes> = await axios.get(
        `${GET_CUSTOMER}?code=${values.customerCode}`
      );
      setCustomerDetails(response?.data?.data[0]);
      setCustomerDataLoading(false);
    } catch (error) {
      setCustomerDataLoading(false);
      const isErrorResponse = (error: unknown): error is ErrorResponse => {
        return (
          typeof error === "object" && error !== null && "response" in error
        );
      };

      if (isErrorResponse(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Internal server error");
      }
    }
  };

  const onSubmit = async (values: DiscountPromotionForm) => {
    const image =
      images.length > 0 && images[0].base64 ? images[0].base64 : null;
    const finalCode = generateCode(values);

    if (isMode === "edit") {
      const id: string = clickedRowData.id ?? null;
      try {
        const data = {
          type: "3",
          ref_no: null,
          name: values.promotionName ?? null,
          percentage: values.promotionPercentage.toString() ?? null,
          active_from: values.activeForm ?? null,
          active_until: values.activeUntil ?? null,
          promotion_cycle_id: null,
          description: values?.description ?? null,
          customer_id: customerDetails?.id
            ? customerDetails?.id
            : clickedRowData?.customer?.id,
          promo_code: finalCode || clickedRowData?.promo_code,
          banner: image ?? null,
          is_active: clickedRowData?.is_active ?? 1,
        };
        setDataLoading(true);
        await axios.put(`${CREATE_PROMOTION}/${id}`, data);
        fetchAllPromotion();
        setDataLoading(false);
        toast.success("Updated successfully");
        toggleModal();
      } catch (error) {
        setDataLoading(false);
        const isErrorResponse = (error: unknown): error is ErrorResponse => {
          return (
            typeof error === "object" && error !== null && "response" in error
          );
        };

        if (isErrorResponse(error) && error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Internal server error");
        }
      }
    } else {
      try {
        if (finalCode) {
          const data = {
            type: "3",
            ref_no: null,
            name: values.promotionName ?? null,
            percentage: values.promotionPercentage.toString() ?? null,
            active_from: values.activeForm ?? null,
            active_until: values.activeUntil ?? null,
            promotion_cycle_id: null,
            description: values?.description ?? null,
            customer_id: customerDetails?.id ?? null,
            promo_code: finalCode ?? null,
            banner: image ?? null,
            is_active: 1,
          };
          setDataLoading(true);
          await axios.post(`${CREATE_PROMOTION}`, data);
          fetchAllPromotion();
          setDataLoading(false);
          toast.success("Created successfully");
          toggleModal();
        } else {
          toast.error("Promotion Code is required");
        }
      } catch (error) {
        setDataLoading(false);
        const isErrorResponse = (error: unknown): error is ErrorResponse => {
          return (
            typeof error === "object" && error !== null && "response" in error
          );
        };

        if (isErrorResponse(error) && error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Internal server error");
        }
      }
    }
  };

  return (
    <div className="discount-promotion">
      <hr className="w-full border-[1px] border-gray-300 my-[20px]" />
      <Formik
        initialValues={{
          promotionName: clickedRowData?.promotionName || "",
          activeForm: clickedRowData?.active_from || today,
          activeUntil: clickedRowData?.active_until || today,
          promotionPercentage: clickedRowData?.percentage || "",
          description: clickedRowData?.description || "",
          codePrefix: "",
          yearFormat: "YYYY",
          monthFormat: "Name",
          noOfDigits: 5,
          code_prefix_order: "",
          year_order: "",
          month_order: "",
          no_of_digits_order: "",
          customerCode: clickedRowData?.customer?.code || "",
        }}
        onSubmit={onSubmit}
        validationSchema={schema}
      >
        {({ values, setFieldValue, isValid, resetForm }) => {
          const getOrderOptions = (currentFieldName: string) => {
            const allOrders = ["1", "2", "3", "4"];
            const selectedOrders = [
              {
                field: "code_prefix_order",
                value: values.code_prefix_order,
              },
              { field: "year_order", value: values.year_order },
              {
                field: "month_order",
                value: values.month_order,
              },
              { field: "no_of_digits_order", value: values.no_of_digits_order },
            ];

            const otherSelectedValues = selectedOrders
              .filter((item) => item.field !== currentFieldName && item.value)
              .map((item) => item.value);

            return allOrders.map((order) => ({
              value: order,
              label: order,
              disabled: otherSelectedValues.includes(order),
            }));
          };

          return (
            <Form>
              <Grid container spacing={2} className="pt-[10px]">
                <Grid item xs={12} className="pt-[5px!important]">
                  <span className="text-[10px] text-gray-700 italic">
                    <b className="text-red">Note : </b>
                    The Edit option is disabled when New Customer or Specific
                    Customer are selected
                  </span>
                </Grid>
                <Grid
                  item
                  lg={6}
                  md={6}
                  sm={12}
                  xs={12}
                  className="pt-[5px!important]"
                >
                  <Typography className="formTypography">
                    {t("Promotion Name")}
                    <span className="text-red"> *</span>
                  </Typography>
                  <Field
                    disabled={isMode === "view"}
                    name="promotionName"
                    component={TextFormField}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid
                  item
                  lg={6}
                  md={6}
                  sm={12}
                  xs={12}
                  className="pt-[5px!important]"
                >
                  <Typography className="formTypography">
                    {t("PROMOTION_PERCENTAGE")}
                    <span className="text-red"> *</span>
                  </Typography>
                  <Field
                    disabled={isMode === "view"}
                    name="promotionPercentage"
                    component={TextFormField}
                    type="number"
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid
                  item
                  lg={6}
                  md={6}
                  sm={12}
                  xs={12}
                  className="pt-[5px!important]"
                >
                  <Typography className="formTypography">
                    {t("ACTIVE_FROM")}
                    <span className="text-red"> *</span>
                  </Typography>
                  <TextFormDateField
                    disabled={isMode === "view"}
                    name="activeForm"
                    type="date"
                    placeholder=""
                    id="activeForm"
                    min={today}
                    max=""
                    disablePastDate={false}
                    changeInput={(
                      value: string,
                      form: FormikHelpers<ShippingHoldsSubmitType>
                    ) => {
                      form.setFieldValue("activeForm", value);
                    }}
                  />
                </Grid>
                <Grid
                  item
                  lg={6}
                  md={6}
                  sm={12}
                  xs={12}
                  className="pt-[5px!important]"
                >
                  <Typography className="formTypography">
                    {t("ACTIVE_UNTIL")}
                    <span className="text-red"> *</span>
                  </Typography>
                  <TextFormDateField
                    disabled={isMode === "view"}
                    name="activeUntil"
                    type="date"
                    placeholder=""
                    id="activeUntil"
                    min={values.activeForm ? values.activeForm : today}
                    max=""
                    disablePastDate={false}
                    changeInput={(
                      value: string,
                      form: FormikHelpers<ShippingHoldsSubmitType>
                    ) => {
                      form.setFieldValue("activeUntil", value);
                    }}
                  />
                </Grid>

                <Grid
                  item
                  xs={12}
                  className="formikFormField pt-[5px!important]"
                >
                  <Typography className="formTypography">
                    {t("DESCRIPTION")}
                  </Typography>
                  <Field
                    disabled={isMode === "view"}
                    name="description"
                    component={TextFormField}
                    fullWidth
                    multiline
                    rows={3}
                    size="small"
                    placeholder={t("")}
                  />
                </Grid>
                <Grid
                  item
                  lg={6}
                  md={6}
                  sm={12}
                  xs={12}
                  className="pt-[5px!important]"
                >
                  <h4 className="text-[10px] sm:text-[12px] lg:text-[14px] font-600 mb-[5px]">
                    {t("PROMOTION_BANNER")}
                  </h4>
                  <div className="relative flex flex-wrap gap-[10px]">
                    {images.map((image, index) => (
                      <div
                        key={index}
                        className="relative w-[150px] h-[150px] m-0 border-[2px] border-[#ccc] rounded-[10px] overflow-hidden"
                      >
                        <img
                          src={URL.createObjectURL(image.file)}
                          alt="Thumbnail"
                          className="w-full h-full rounded-[10px] object-contain object-center"
                        />
                        <IconButton
                          size="small"
                          className="absolute top-[2px] right-[2px] text-red p-0 rounded-full bg-white transition-colors duration-300 hover:!text-red hover:bg-white"
                          onClick={() => handleRemoveImage(index)}
                          disabled={isMode === "view"}
                        >
                          <CancelIcon fontSize="small" />
                        </IconButton>
                      </div>
                    ))}

                    {images.length < maxImageCount && (
                      <div className="relative flex justify-center items-center w-[150px] h-[150px] m-0 border-[2px] border-[#ccc] rounded-[10px]">
                        <IconButton
                          className="text-primaryBlue"
                          disabled={isMode === "view"}
                          onClick={() =>
                            document.getElementById("imageUpload")?.click()
                          }
                        >
                          <AddCircleIcon fontSize="large" />
                        </IconButton>
                        <input
                          id="imageUpload"
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          multiple
                          onChange={handleImageUpload}
                          disabled={isMode === "view"}
                        />
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-gray-700 italic mt-[5px]">
                    <b className="text-red">Note : </b>
                    Image dimensions must be 1:1, and size ≤ 5MB.
                  </span>
                </Grid>
              </Grid>
              <Grid container spacing={2} className="pt-[10px]">
                <Grid item xs={12} className="pt-[5px!important]">
                  <hr className="w-full border-[1px] border-gray-300 my-[10px]" />
                </Grid>
                <Grid
                  item
                  lg={12}
                  md={12}
                  sm={12}
                  xs={12}
                  className={`${isMode === "view" ? "" : "flex items-center justify-center gap-[16px]"} !pt-[5px] !pb-[10px]`}
                >
                  <div className="w-full">
                    <Typography className="formTypography">
                      {t("CUSTOMER_CODE")}
                      <span className="text-red"> *</span>
                    </Typography>
                    <Field
                      disabled={isMode === "view"}
                      name="customerCode"
                      component={TextFormField}
                      fullWidth
                      size="small"
                    />
                  </div>

                  {isMode === "view" ? null : (
                    <Button
                      className="flex justify-center items-center mt-14 min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
                      type="button"
                      onClick={() => {
                        searchCustomerCode(values);
                      }}
                    >
                      Search
                      {isCustomerDataLoading ? (
                        <CircularProgress
                          className="text-white ml-[5px]"
                          size={24}
                        />
                      ) : null}
                    </Button>
                  )}
                </Grid>
                <Grid
                  item
                  lg={6}
                  md={6}
                  sm={12}
                  xs={12}
                  className="pt-[5px!important] flex items-center"
                >
                  <h6 className="text-[12px] lg:text-[14px]">
                    <span className="font-600">Customer Name</span> :{" "}
                    {customerDetails?.first_name
                      ? customerDetails?.first_name
                      : clickedRowData?.customer?.first_name}{" "}
                    {customerDetails?.last_name
                      ? customerDetails?.last_name
                      : clickedRowData?.customer?.last_name}
                  </h6>
                </Grid>
                <Grid
                  item
                  lg={6}
                  md={6}
                  sm={12}
                  xs={12}
                  className="pt-[5px!important] flex items-center"
                >
                  <h6 className="text-[12px] lg:text-[14px]">
                    <span className="font-600">Customer Email</span> :{" "}
                    {customerDetails?.email
                      ? customerDetails?.email
                      : clickedRowData?.customer?.email}
                  </h6>
                </Grid>
              </Grid>

              <Grid container spacing={2} className="pt-[10px]">
                <Grid item xs={12} className="pt-[5px!important]">
                  <hr className="w-full border-[1px] border-gray-300 my-[10px]" />
                </Grid>

                <Grid
                  item
                  lg={6}
                  md={6}
                  sm={12}
                  xs={12}
                  className="pt-[5px!important]"
                >
                  <div className="flex justify-between items-center gap-[5px]">
                    <Typography>{t("CODE_PREFIX")}</Typography>
                    <FormControlLabel
                      className="relative mr-0 my-[-10px] z-[1]"
                      control={
                        <Checkbox
                          checked={values.codePrefix !== ""}
                          disabled={isMode === "view"}
                          onChange={(e) =>
                            setFieldValue(
                              "codePrefix",
                              e.target.checked ? "CHR" : ""
                            )
                          }
                        />
                      }
                      label="Code Prefix"
                    />
                  </div>
                  <div className="relative w-full z-[2]">
                    <Field
                      disabled={isMode === "view"}
                      name="codePrefix"
                      component={TextFormField}
                      fullWidth
                      size="small"
                    />
                  </div>
                </Grid>
                <Grid
                  item
                  lg={6}
                  md={6}
                  sm={12}
                  xs={12}
                  className="pt-[5px!important]"
                >
                  <Typography>{t("CODE_PREFIX_ORDER")}</Typography>
                  <FormDropdown
                    disabled={isMode === "view"}
                    name="code_prefix_order"
                    id="code_prefix_order"
                    placeholder=""
                    optionsValues={getOrderOptions("code_prefix_order")}
                  />
                </Grid>
                <Grid
                  item
                  lg={6}
                  md={6}
                  sm={12}
                  xs={12}
                  className="pt-[5px!important]"
                >
                  <FormControlLabel
                    className="relative mr-0 my-[-10px] z-[1]"
                    disabled={isMode === "view"}
                    control={
                      <Checkbox
                        checked={isYearEnabled}
                        onChange={(e) =>
                          handleYearCheckboxChange(e, setFieldValue)
                        }
                      />
                    }
                    label="Year"
                  />
                  <RadioGroup
                    row
                    value={values.yearFormat}
                    onChange={(e) =>
                      setFieldValue("yearFormat", e.target.value)
                    }
                  >
                    <FormControlLabel
                      value="YYYY"
                      disabled={isMode === "view"}
                      control={<Radio disabled={isMode === "view"} />}
                      label="YYYY"
                    />
                    <FormControlLabel
                      value="YY"
                      disabled={isMode === "view"}
                      control={<Radio disabled={isMode === "view"} />}
                      label="YY"
                    />
                  </RadioGroup>
                </Grid>
                <Grid
                  item
                  lg={6}
                  md={6}
                  sm={12}
                  xs={12}
                  className="pt-[5px!important]"
                >
                  <Typography>{t("YEAR_ORDER")}</Typography>
                  <FormDropdown
                    name="year_order"
                    id="year_order"
                    placeholder=""
                    optionsValues={getOrderOptions("year_order")}
                    disabled={isMode === "view"}
                  />
                </Grid>
                <Grid
                  item
                  lg={6}
                  md={6}
                  sm={12}
                  xs={12}
                  className="pt-[5px!important]"
                >
                  <FormControlLabel
                    className="relative mr-0 my-[-10px] z-[1]"
                    disabled={isMode === "view"}
                    control={
                      <Checkbox
                        checked={isMonthEnabled}
                        onChange={(e) =>
                          handleMonthCheckboxChange(e, setFieldValue)
                        }
                      />
                    }
                    label="Month"
                  />
                  <RadioGroup
                    row
                    value={values.monthFormat}
                    onChange={(e) =>
                      setFieldValue("monthFormat", e.target.value)
                    }
                  >
                    <FormControlLabel
                      value="Name"
                      disabled={isMode === "view"}
                      control={<Radio disabled={isMode === "view"} />}
                      label={`Name (ex: ${currentMonthName})`}
                    />
                    <FormControlLabel
                      value="No"
                      disabled={isMode === "view"}
                      control={<Radio disabled={isMode === "view"} />}
                      label={`No (ex: ${currentMonthNumber.toString().padStart(2, "0")})`}
                    />
                  </RadioGroup>
                </Grid>
                <Grid
                  item
                  lg={6}
                  md={6}
                  sm={12}
                  xs={12}
                  className="pt-[5px!important]"
                >
                  <Typography>{t("MONTH_ORDER")}</Typography>
                  <FormDropdown
                    name="month_order"
                    id="month_order"
                    placeholder=""
                    optionsValues={getOrderOptions("month_order")}
                    disabled={isMode === "view"}
                  />
                </Grid>
                <Grid
                  item
                  lg={6}
                  md={6}
                  sm={12}
                  xs={12}
                  className="pt-[5px!important]"
                >
                  <Typography>{t("NO_OF_DIGITS")}</Typography>
                  <Field
                    name="noOfDigits"
                    disabled={isMode === "view"}
                    component={TextFormField}
                    fullWidth
                    type="number"
                    size="small"
                    inputProps={{
                      min: 1,
                      max: 9,
                      step: 1,
                    }}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const { value } = e.target;

                      if (value === "" || /^[1-9]\d*$/.test(value)) {
                        setFieldValue(
                          "noOfDigits",
                          value === "" ? "" : parseInt(value, 10)
                        );
                      }
                    }}
                  />
                </Grid>
                <Grid
                  item
                  lg={6}
                  md={6}
                  sm={12}
                  xs={12}
                  className="pt-[5px!important]"
                >
                  <Typography>
                    {t("NO_OF_DIGITS_ORDER")}
                    <span style={{ color: "#BC1C4C" }}> *</span>
                  </Typography>
                  <FormDropdown
                    id="no_of_digits_order"
                    disabled={isMode === "view"}
                    placeholder=""
                    name="no_of_digits_order"
                    optionsValues={getOrderOptions("no_of_digits_order")}
                  />
                </Grid>

                {clickedRowData?.promo_code ? (
                  <Grid item xs={12} className="pt-[5px!important]">
                    <div className="text-center p-[15px] rounded-[6px] bg-gray-200">
                      <Typography
                        variant="h6"
                        className="text-[14px] sm:text-[16px] lg:text-[18px]"
                      >
                        <span className="font-500">Early generated code :</span>{" "}
                        {clickedRowData?.promo_code}
                      </Typography>
                    </div>
                  </Grid>
                ) : null}
                {clickedRowData?.promo_code ? (
                  <Grid item xs={12} className="pt-[10px!important]">
                    <span className="text-[10px] text-gray-700 italic">
                      <b className="text-red">Note : </b>
                      Please note that modifying the code format will result in
                      the removal of the existing promo code and the update of a
                      new one.
                    </span>
                  </Grid>
                ) : null}

                <Grid item xs={12} className="pt-[10px!important]">
                  <div className="text-center p-[15px] rounded-[6px] bg-gray-200">
                    <Typography
                      variant="h4"
                      className="text-[14px] sm:text-[16px] lg:text-[18px]"
                    >
                      {generateCode(values)}
                    </Typography>
                  </div>
                </Grid>
              </Grid>

              <Grid container spacing={2} className="pt-[20px]">
                <Grid
                  item
                  lg={12}
                  md={12}
                  sm={12}
                  xs={12}
                  className="flex justify-end items-start gap-[10px] pt-[26px!important] lg:pt-[10px!important]"
                >
                  <Button
                    className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
                    onClick={toggleModal}
                  >
                    Close
                  </Button>
                  {isMode === "view" ? null : (
                    <Button
                      className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
                      type="submit"
                    >
                      {isMode === "edit" ? "Update" : "Create"}
                      {isDataLoading ? (
                        <CircularProgress
                          className="text-white ml-[5px]"
                          size={24}
                        />
                      ) : null}
                    </Button>
                  )}
                </Grid>
              </Grid>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}

export default SpecificCustomer;
