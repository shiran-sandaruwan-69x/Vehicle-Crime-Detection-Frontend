import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { toast } from "react-toastify";
import * as yup from "yup";
import { Field, Form, Formik } from "formik";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { Button, CircularProgress, Grid, Typography } from "@mui/material";
import { ShippingScheduleTypeDrp } from "../../../shipping/shipping-methods/types/ShippingMethodsType";

import TextFormField from "../../../../../common/FormComponents/FormTextField";
import FormDropdown from "../../../../../common/FormComponents/FormDropdown";
import MaterialTableWrapper from "../../../../../common/tableComponents/MaterialTableWrapper";
import {
  ShippingTypeApiResponse,
  ShippingTypeResponse,
} from "../../../shipping/shipping-types/types/ShippingTypes";
import {
  BoxChargeRes,
  CommonProductMasterApiRes,
  CommonProductMasterCreateFormData,
  CommonProductMasterModifiedData,
  CommonProductMasterRes,
  CommonProductMasterSubmitFormData,
  CompanyData,
  CompanyDataApiRes,
} from "../common-product-master-types/CommonProductMasterTypes";

import {
  CREATE_ETF_MASTER_DATA,
  GET_LOCATION,
  GET_PACKING_CHARGES,
} from "../../../../../axios/services/live-aquaria-services/master-data-services/MasterDataServices";
import { CREATE_SHIPPING_TYPE } from "../../../../../axios/services/live-aquaria-services/shipping-services/ShippingTypeService";
import {
  PackingMaterialData,
  PackingMaterialType,
} from "../../box-charge/box-charge-types/BoxChargeTypes";
import EditCommonProductMasterTableData from "./EditCommonProductMasterTableData";

interface ErrorResponse {
  response?: {
    status?: number;
    data?: {
      message?: string;
    };
  };
}
interface Props {
  isOpen?: boolean;
  toggleModal?: () => void;
  clickedRowData: CommonProductMasterModifiedData;
  getCommonProductMasterData?: () => void;
  isMode?: string;
}

function CreateNewCommonProduct({
  isOpen,
  toggleModal,
  clickedRowData,
  getCommonProductMasterData,
  isMode,
}: Props) {
  const { t } = useTranslation("commonProductMaster");
  const [shippingTypeData, setShippingTypeData] = useState<
    ShippingScheduleTypeDrp[]
  >([]);
  const [locationData, setLocationData] = useState<ShippingScheduleTypeDrp[]>(
    []
  );
  const [polyBagData, setPolyBagData] = useState<ShippingScheduleTypeDrp[]>([]);
  const [polyBagDataEditModal, setPolyBagDataEditModal] = useState<
    ShippingScheduleTypeDrp[]
  >([]);
  const [isDataLoading, setDataLoading] = useState(false);
  const [isSearchDataLoading, setSearchDataLoading] = useState(false);

  const [pageNo, setPageNo] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(5);
  const [count, setCount] = useState(100);
  const [isSearchData, setSearchData] = useState<CommonProductMasterRes>(null);
  const [tableData, setTableData] = useState<
    CommonProductMasterCreateFormData[]
  >(clickedRowData?.tblData ? clickedRowData?.tblData : []);
  const [isTableEditData, setTableEditData] =
    useState<CommonProductMasterCreateFormData>({});
  const [isOpenEditModal, setOpenEditModal] = useState(false);
  const toggleEditModal = () => setOpenEditModal(!isOpenEditModal);
  const handlePageChange = (page: number) => {};

  const handlePageSizeChange = (pageSize: number) => {};

  const tableColumns = [
    {
      title: t("Poly Bag / Volume (cm³)"),
      field: "polyBagSize",
      cellStyle: { padding: "4px 8px" },
    },
    {
      title: t("Min Num Of Products"),
      field: "minNumOfProduct",
      cellStyle: { padding: "4px 8px" },
    },
    {
      title: t("Max Num Of Products"),
      field: "maxNumOfProduct",
      cellStyle: { padding: "4px 8px" },
    },
  ];

  useEffect(() => {
    loadAllShippingTypeToDropDown();
    loadLocationToDropDown();
    loadPolyBagToDropDown();
  }, []);

  const schemaSearch = yup.object().shape({
    cisCode: yup.string().required("CIS Code is required"),
  });

  const searchCisCode = async (values: { cisCode: string }) => {
    const id: string = values.cisCode ?? null;
    setSearchDataLoading(true);
    try {
      const response: AxiosResponse<CommonProductMasterApiRes> =
        await axios.get(`${CREATE_ETF_MASTER_DATA}/${id}/search`);
      setSearchData(response?.data?.data);
      const tblData: CommonProductMasterCreateFormData[] =
        response.data.data.box_charge.map((polyBag: BoxChargeRes) => ({
          polyBagSizeId: Number(polyBag?.packing_material?.id),
          polyBagSize: `${polyBag?.packing_material?.name} - ${polyBag?.packing_material?.volume}cm³`,
          minNumOfProduct: polyBag?.min_no_of_products,
          maxNumOfProduct: polyBag?.max_no_of_product,
        }));
      setTableData(tblData);
      setSearchDataLoading(false);
    } catch (error) {
      setSearchDataLoading(false);
      const isErrorResponse = (error: unknown): error is ErrorResponse => {
        return (
          typeof error === "object" && error !== null && "response" in error
        );
      };

      if (isErrorResponse(error) && error?.response?.status === 404) {
        toast.error("Not Found");
        return;
      }

      if (isErrorResponse(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Internal server error");
      }
    }
  };

  const loadAllShippingTypeToDropDown = async () => {
    try {
      const response: AxiosResponse<ShippingTypeApiResponse> = await axios.get(
        `${CREATE_SHIPPING_TYPE}?paginate=false`
      );
      const schedules: ShippingScheduleTypeDrp[] = response?.data?.data?.map(
        (shippingType: ShippingTypeResponse) => ({
          label: shippingType?.name,
          value: shippingType?.id,
        })
      );
      setShippingTypeData(schedules);
    } catch (error) {
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

  const loadLocationToDropDown = async () => {
    try {
      const response: AxiosResponse<CompanyDataApiRes> = await axios.get(
        `${GET_LOCATION}?paginate=false`
      );
      const schedules: ShippingScheduleTypeDrp[] = response?.data?.data?.map(
        (shippingType: CompanyData) => ({
          label: shippingType?.name,
          value: shippingType?.id,
        })
      );
      setLocationData(schedules);
    } catch (error) {
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

  const loadPolyBagToDropDown = async () => {
    try {
      const response: AxiosResponse<PackingMaterialType> = await axios.get(
        `${GET_PACKING_CHARGES}?paginate=false`
      );
      const polyBagData1: ShippingScheduleTypeDrp[] = response?.data?.data
        .filter(
          (shippingType: PackingMaterialData) =>
            shippingType?.packing_type_name === "Poly Bag"
        )
        .map((shippingType: PackingMaterialData) => ({
          label: `${shippingType?.name} - ${shippingType?.volume}cm³`,
          value: `${shippingType?.id} - ${shippingType?.name} - ${shippingType?.volume}cm³`,
        }));
      const polyBagData2: ShippingScheduleTypeDrp[] = response?.data?.data
        .filter(
          (shippingType: PackingMaterialData) =>
            shippingType?.packing_type_name === "Poly Bag"
        )
        .map((shippingType: PackingMaterialData) => ({
          label: `${shippingType?.name} - ${shippingType?.volume}cm³`,
          value: shippingType?.id,
        }));
      setPolyBagData(polyBagData1);
      setPolyBagDataEditModal(polyBagData2);
    } catch (error) {
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

  const handleCreateShippingMethod = async (
    values: CommonProductMasterSubmitFormData
  ) => {
    setDataLoading(true);
    const id = clickedRowData?.id ? clickedRowData?.id : isSearchData?.id;

    if (isMode === "create" && isSearchData === null) {
      toast.error("CIS Code is required");
      return;
    }

    const tblData = tableData?.map(
      (item: CommonProductMasterCreateFormData) => ({
        packing_material_charge_id: item?.polyBagSizeId?.toString(),
        min_no_of_product: item?.minNumOfProduct,
        max_no_of_product: item?.maxNumOfProduct,
      })
    );

    const data = {
      company_id: values?.location?.toString(),
      shipping_type_id: values?.shippingType?.toString(),
      aquatic_type: values?.aquatic_type,
      box_charge: tblData ?? null,
      is_active: clickedRowData?.is_active ? clickedRowData?.is_active : 1,
    };

    try {
      await axios.put(`${CREATE_ETF_MASTER_DATA}/${id}`, data);
      getCommonProductMasterData();

      if (isMode === "create") {
        toast.success("Created successfully");
      } else {
        toast.success("Updated successfully");
      }

      setDataLoading(false);
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
  };

  const schema = yup.object().shape({
    location: yup.string().required("Location is required"),
    shippingType: yup.string().required("Shipping Type is required"),
    aquatic_type: yup.string().required("Aquatic Type is required"),
    minNumOfProduct: yup
      .number()
      .integer("Min Num Of Products must be an integer")
      .typeError("Min Num Of Products must be a number")
      .positive("Min Num Of Products must be a positive number"),
    maxNumOfProduct: yup
      .number()
      .integer("Max Num Of Products must be an integer")
      .typeError("Max Num Of Products must be a number")
      .positive("Max Num Of Products must be a positive number"),
  });

  const tableRowEditHandler = (values: CommonProductMasterCreateFormData) => {
    setTableEditData(values);
    toggleEditModal();
  };

  const tableRowDeleteHandler = (values: CommonProductMasterCreateFormData) => {
    setTableData((prevTableData) =>
      prevTableData.filter(
        (item) => item.tableData?.id !== values?.tableData?.id
      )
    );
  };

  const onConfirmCommonProductMasterTableData = (
    values: CommonProductMasterCreateFormData
  ) => {
    toggleEditModal();
    setTableData((prevTableData) =>
      prevTableData.map((item) =>
        item.tableData.id === values.tableData.id
          ? {
              ...item,
              minNumOfProduct: values?.minNumOfProduct,
              maxNumOfProduct: values?.maxNumOfProduct,
            }
          : item
      )
    );
  };

  const handleAddToTable = async (
    values: CommonProductMasterSubmitFormData,
    setFieldValue: (field: string, value: any) => void
  ) => {
    try {
      const validationSchema = yup.object().shape({
        polyBagSize: yup.string().required("Poly Bag are required"),
        minNumOfProduct: yup
          .number()
          .integer("Min Num Of Products must be an integer")
          .typeError("Min Num Of Products are required")
          .positive("Min Num Of Products must be a positive number"),
        maxNumOfProduct: yup
          .number()
          .integer("Max Num Of Products must be an integer")
          .typeError("Max Num Of Products are required")
          .positive("Max Num Of Products must be a positive number"),
      });

      await validationSchema.validate(values, { abortEarly: false });

      if (
        !values.polyBagSize ||
        !values.minNumOfProduct ||
        !values.maxNumOfProduct
      ) {
        toast.error(
          "Poly Bag / Volume & Min Num Of Products & Max Num Of Products are required"
        );
        return;
      }

      const parts = values.polyBagSize.split(" - ");
      const polyBagSizeId = Number(parts[0]);
      const polyName = parts.slice(1).join(" - ");

      const isDuplicate = tableData.some(
        (item: CommonProductMasterCreateFormData) =>
          item?.polyBagSizeId === polyBagSizeId
      );

      if (isDuplicate) {
        toast.error("This Poly Bag / Volume is already added to the table");
        return;
      }

      if (values.maxNumOfProduct < values.minNumOfProduct) {
        toast.error(
          "Max Num Of Products must be greater than or equal to Min Num Of Products"
        );
        return;
      }

      setFieldValue("polyBagSizeId", "");
      setFieldValue("polyBagSize", "");
      setFieldValue("minNumOfProduct", "");
      setFieldValue("maxNumOfProduct", "");

      setTableData((prevTableData: CommonProductMasterCreateFormData[]) => [
        ...prevTableData,
        {
          polyBagSizeId,
          polyBagSize: polyName,
          minNumOfProduct: values.minNumOfProduct,
          maxNumOfProduct: values.maxNumOfProduct,
        },
      ]);
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        error.inner.forEach((err) => toast.error(err.message));
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  const aquaticType = [
    {
      label: "Saltwater",
      value: "salt",
    },
    {
      label: "Freshwater",
      value: "fresh",
    },
    {
      label: "Both",
      value: "both",
    },
  ];

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
          {(() => {
            switch (isMode) {
              case "view":
                return t("View");
              case "edit":
                return t("Edit");
              default:
                return t("Create New");
            }
          })()}{" "}
          {t("Product Allocation")}
        </h6>
      </DialogTitle>
      <DialogContent>
        {isMode !== "create" ? null : (
          <Formik
            initialValues={{
              cisCode: "",
            }}
            onSubmit={searchCisCode}
            validationSchema={schemaSearch}
            enableReinitialize
          >
            {({ values, setFieldValue, isValid, resetForm }) => (
              <Form>
                <Grid container spacing={2} className="pt-[10px]">
                  <Grid
                    item
                    md={6}
                    sm={6}
                    xs={12}
                    className="pt-[5px!important]"
                  >
                    <Typography className="formTypography">
                      {t("CIS Code")}
                      <span className="text-red"> *</span>
                    </Typography>
                    <Field
                      disabled={false}
                      name="cisCode"
                      component={TextFormField}
                      fullWidth
                      size="small"
                    />
                  </Grid>

                  <Grid
                    item
                    md={6}
                    sm={6}
                    xs={12}
                    className="flex justify-end items-start gap-[10px] !pt-[10px] sm:!pt-[26px]"
                  >
                    <Button
                      className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
                      variant="contained"
                      color="primary"
                      type="submit"
                    >
                      Search
                      {isSearchDataLoading ? (
                        <CircularProgress
                          className="text-white ml-[5px]"
                          size={24}
                        />
                      ) : null}
                    </Button>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        )}

        <Grid container spacing={2} className="mt-[10px]">
          <Grid item xs={12} sm={6} md={4} className="pt-[5px!important]">
            <h6 className="flex flex-wrap sm:!flex-nowrap items-center text-[12px] lg:text-[14px] mb-[4px]">
              <span className="inline-block w-full sm:w-auto min-w-[158px] font-600">
                CIS Code
              </span>{" "}
              :{" "}
              {clickedRowData.cis_code
                ? clickedRowData?.cis_code
                : isSearchData?.cis_code}
            </h6>
            <h6 className="flex flex-wrap sm:!flex-nowrap items-center text-[12px] lg:text-[14px] mb-[4px]">
              <span className="inline-block w-full sm:w-auto min-w-[158px] font-600">
                Common Name
              </span>{" "}
              :{" "}
              {clickedRowData.common_name
                ? clickedRowData?.common_name
                : isSearchData?.common_name}
            </h6>
            <h6 className="flex flex-wrap sm:!flex-nowrap items-center text-[12px] lg:text-[14px] mb-[4px]">
              <span className="inline-block w-full sm:w-auto min-w-[158px] font-600">
                Size
              </span>{" "}
              :{" "}
              {clickedRowData.size ? clickedRowData?.size : isSearchData?.size}
            </h6>
            <h6 className="flex flex-wrap sm:!flex-nowrap items-center text-[12px] lg:text-[14px] mb-[4px]">
              <span className="inline-block w-full sm:w-auto min-w-[158px] font-600">
                Selling Type
              </span>{" "}
              :{" "}
              {clickedRowData.selling_type
                ? clickedRowData?.selling_type
                : isSearchData?.selling_type}
            </h6>
          </Grid>
          <Grid item xs={12} sm={6} md={4} className="pt-[5px!important]">
            <h6 className="flex flex-wrap sm:!flex-nowrap items-center text-[12px] lg:text-[14px] mb-[4px]">
              <span className="inline-block w-full sm:w-auto min-w-[158px] font-600">
                Member Code
              </span>{" "}
              :{" "}
              {clickedRowData.member_code
                ? clickedRowData?.member_code
                : isSearchData?.member_code}
            </h6>
            <h6 className="flex flex-wrap sm:!flex-nowrap items-center text-[12px] lg:text-[14px] mb-[4px]">
              <span className="inline-block w-full sm:w-auto min-w-[158px] font-600">
                Scientific Name
              </span>{" "}
              :{" "}
              {clickedRowData.scientific_name
                ? clickedRowData?.scientific_name
                : isSearchData?.scientific_name}
            </h6>
            <h6 className="flex flex-wrap sm:!flex-nowrap items-center text-[12px] lg:text-[14px] mb-[4px]">
              <span className="inline-block w-full sm:w-auto min-w-[158px] font-600">
                Age
              </span>{" "}
              : {clickedRowData.age ? clickedRowData?.age : isSearchData?.age}
            </h6>
            <h6 className="flex flex-wrap sm:!flex-nowrap items-center text-[12px] lg:text-[14px] mb-[4px]">
              <span className="inline-block w-full sm:w-auto min-w-[158px] font-600">
                Regular Price
              </span>{" "}
              :{" "}
              {clickedRowData.regular_price
                ? clickedRowData?.regular_price
                : isSearchData?.regular_price}
            </h6>
          </Grid>
          <Grid item xs={12} sm={6} md={4} className="pt-[5px!important]">
            <h6 className="flex flex-wrap sm:!flex-nowrap items-center text-[12px] lg:text-[14px] mb-[4px]">
              <span className="inline-block w-full sm:w-auto min-w-[158px] font-600">
                Vendor Code
              </span>{" "}
              :{" "}
              {clickedRowData.vendor_code
                ? clickedRowData?.vendor_code
                : isSearchData?.vendor_code}
            </h6>
            <h6 className="flex flex-wrap sm:!flex-nowrap items-center text-[12px] lg:text-[14px] mb-[4px]">
              <span className="inline-block w-full sm:w-auto min-w-[158px] font-600">
                Description
              </span>{" "}
              :{" "}
              {clickedRowData.description
                ? clickedRowData?.description
                : isSearchData?.description}
            </h6>
            <h6 className="flex flex-wrap sm:!flex-nowrap items-center text-[12px] lg:text-[14px] mb-[4px]">
              <span className="inline-block w-full sm:w-auto min-w-[158px] font-600">
                Origins
              </span>{" "}
              :{" "}
              {clickedRowData.origins
                ? clickedRowData?.origins
                : isSearchData?.origins}
            </h6>
            <h6 className="flex flex-wrap sm:!flex-nowrap items-center text-[12px] lg:text-[14px] mb-[4px]">
              <span className="inline-block w-full sm:w-auto min-w-[158px] font-600">
                Inventory QTY
              </span>{" "}
              :{" "}
              {clickedRowData.inventory_qty
                ? clickedRowData?.inventory_qty
                : isSearchData?.inventory_qty}
            </h6>
          </Grid>
          <Grid item xs={12} sm={6} md={4} className="pt-[5px!important]">
            <h6 className="flex flex-wrap sm:!flex-nowrap items-center text-[12px] lg:text-[14px] mb-[4px]">
              <span className="inline-block w-full sm:w-auto min-w-[158px] font-600">
                Country
              </span>{" "}
              :{" "}
              {clickedRowData.country
                ? clickedRowData?.country
                : isSearchData?.country}
            </h6>
            <h6 className="flex flex-wrap sm:!flex-nowrap items-center text-[12px] lg:text-[14px] mb-[4px]">
              <span className="inline-block w-full sm:w-auto min-w-[158px] font-600">
                Gender
              </span>{" "}
              :{" "}
              {clickedRowData.gender
                ? clickedRowData?.gender
                : isSearchData?.gender}
            </h6>
            <h6 className="flex flex-wrap sm:!flex-nowrap items-center text-[12px] lg:text-[14px] mb-[4px]">
              <span className="inline-block w-full sm:w-auto min-w-[158px] font-600">
                Length
              </span>{" "}
              :{" "}
              {clickedRowData.length
                ? clickedRowData?.length
                : isSearchData?.length}
            </h6>
          </Grid>
        </Grid>
        <Formik
          initialValues={{
            location:
              isSearchData?.company?.id || clickedRowData?.company?.id || "",
            aquatic_type:
              isSearchData?.aquatic_type || clickedRowData?.aquatic_type || "",
            shippingType:
              isSearchData?.shipping_type?.id ||
              clickedRowData?.shipping_type?.id ||
              "",
            polyBagSizeId: "",
            polyBagSize: "",
            minNumOfProduct: "",
            maxNumOfProduct: "",
          }}
          onSubmit={handleCreateShippingMethod}
          validationSchema={schema}
          enableReinitialize
        >
          {({ dirty, isValid, values, errors, touched, setFieldValue }) => (
            <Form>
              <Grid container spacing={2} className="!mt-[10px] pt-[10px]">
                <Grid item md={4} sm={6} xs={12} className="pt-[5px!important]">
                  <Typography className="formTypography">
                    {t("Location")}
                    <span className="text-red"> *</span>
                  </Typography>
                  <FormDropdown
                    name="location"
                    id="location"
                    placeholder=""
                    optionsValues={locationData}
                    disabled={isMode === "view"}
                  />
                </Grid>

                <Grid item md={4} sm={6} xs={12} className="pt-[5px!important]">
                  <Typography className="formTypography">
                    Aquatic Type
                  </Typography>
                  <FormDropdown
                    optionsValues={aquaticType}
                    name="aquatic_type"
                    id="aquatic_type"
                    placeholder=""
                    disabled={false}
                  />
                </Grid>

                <Grid item md={4} sm={6} xs={12} className="pt-[5px!important]">
                  <Typography className="formTypography">
                    {t("Shipping Type")}
                    <span className="text-red"> *</span>
                  </Typography>
                  <FormDropdown
                    name="shippingType"
                    id="shippingType"
                    placeholder=""
                    optionsValues={shippingTypeData}
                    disabled={isMode === "view"}
                  />
                </Grid>

                <Grid item xs={12} className="!pb-[5px]">
                  <hr />
                </Grid>

                <Grid
                  item
                  md={4}
                  sm={6}
                  xs={12}
                  className="formikFormField pt-[5px!important]"
                >
                  <Typography>
                    {t("Poly Bag / Volume (cm³)")}
                    <span className="text-red"> *</span>
                  </Typography>
                  <FormDropdown
                    name="polyBagSize"
                    id="polyBagSize"
                    placeholder=""
                    optionsValues={polyBagData}
                    disabled={isMode === "view"}
                  />
                </Grid>

                <Grid
                  item
                  md={4}
                  sm={6}
                  xs={12}
                  className="formikFormField pt-[5px!important]"
                >
                  <Typography>
                    {t("Min Num Of Products")}
                    <span className="text-red"> *</span>
                  </Typography>
                  <Field
                    type="number"
                    disabled={isMode === "view"}
                    name="minNumOfProduct"
                    component={TextFormField}
                    fullWidth
                    size="small"
                  />
                </Grid>

                <Grid
                  item
                  md={4}
                  sm={6}
                  xs={12}
                  className="flex flex-wrap md:!flex-nowrap justify-end gap-x-[16px] formikFormField pt-[5px!important]"
                >
                  <div className="w-full">
                    <Typography>
                      {t("Max Num Of Products")}
                      <span className="text-red"> *</span>
                    </Typography>
                    <Field
                      type="number"
                      disabled={isMode === "view"}
                      name="maxNumOfProduct"
                      component={TextFormField}
                      fullWidth
                      size="small"
                    />
                  </div>
                  <Button
                    disabled={isMode === "view"}
                    className="flex justify-center items-center gap-[10px] min-w-max min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 mt-[10px] md:mt-[21px] rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
                    type="button"
                    variant="contained"
                    size="medium"
                    onClick={() => handleAddToTable(values, setFieldValue)}
                  >
                    Add
                  </Button>
                </Grid>

                <Grid
                  item
                  xs={12}
                  className="flex gap-[16px] formikFormField !pt-[10px]"
                >
                  <MaterialTableWrapper
                    title=""
                    tableColumns={tableColumns}
                    records={tableData}
                    disableColumnFiltering
                    isColumnChoser
                    pageSize={pageSize}
                    selection={false}
                    setPageSize={setPageSize}
                    pageIndex={pageNo}
                    count={count}
                    handlePageChange={handlePageChange}
                    handlePageSizeChange={handlePageSizeChange}
                    {...(isMode === "edit" || isMode === "create"
                      ? { tableRowEditHandler }
                      : {})}
                    {...(isMode === "edit" || isMode === "create"
                      ? { tableRowDeleteHandler }
                      : {})}
                  />
                </Grid>

                <Grid
                  item
                  md={12}
                  sm={12}
                  xs={12}
                  className="flex justify-end items-start gap-[10px] !pt-[10px] sm:!pt-[26px]"
                >
                  {isMode === "view" ? null : (
                    <Button
                      className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
                      variant="contained"
                      color="primary"
                      type="submit"
                    >
                      {isMode === "edit" ? "Update" : "Save"}
                      {isDataLoading ? (
                        <CircularProgress
                          className="text-white ml-[5px]"
                          size={24}
                        />
                      ) : null}
                    </Button>
                  )}

                  <Button
                    className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80 boxShadow"
                    color="primary"
                    onClick={toggleModal}
                  >
                    {t("Close")}
                  </Button>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </DialogContent>
      {isOpenEditModal && (
        <EditCommonProductMasterTableData
          toggleModal={toggleEditModal}
          isOpen={isOpenEditModal}
          clickedRowData={isTableEditData}
          onConfirmCommonProductMasterTableData={
            onConfirmCommonProductMasterTableData
          }
          polyBagData={polyBagDataEditModal}
        />
      )}
    </Dialog>
  );
}

export default CreateNewCommonProduct;
