import {
  Autocomplete,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Select,
  TextField,
  Typography,
  MenuItem,
} from "@mui/material";
import { Field, Form, Formik } from "formik";
import { ChangeEvent, useEffect, useState } from "react";
import * as yup from "yup";
import axios, { AxiosResponse } from "axios";
import {
  AUTO_DELIVERY_DURATIONS,
  FETCH_MASTER_DATA_CSI,
  GET_CART_ITEMS_BY_CUSTOMER_ID,
  HOTLINE_CUSTOMER_AND_ORDERS,
  HOTLINE_ORDER,
  ORDER_ITEMS_INSERT,
  PRICE_CHANGE_REASONS,
} from "src/app/axios/services/AdminServices";
import { toast } from "react-toastify";
import useDebounce from "app/shared-components/useDebounce";
import ExtendedAxiosError from "src/app/types/ExtendedAxiosError";
import MaterialTableWrapper from "src/app/common/tableComponents/MaterialTableWrapper";
import FuseLoading from "@fuse/core/FuseLoading/FuseLoading";
import TextFormField from "../../../../../common/FormComponents/FormTextField";
import FormDropdown from "../../../../../common/FormComponents/FormDropdown";
import {
  AutoDeliveryDurationResponseInterface,
  AutoDeliveryDurations,
  CartItem,
  CartShipment,
  CartShipmentsWithSeletedMethodInterface,
  CISProductsResponseInterface,
  CustomerCartDetailsResponseInterface,
  CustomerDetailsByIdResponseInterface,
  CustomerWithCartResponseInterface,
  PriceChangeReasonInterface,
  ProductDetailsByCISCodeInterface,
  ProductDetailsByCISCodeResponseInterface,
  ShippingMethod,
} from "../interfaces";

interface Props {
  toggleModal: () => void;
  seletedCustomer: CustomerDetailsByIdResponseInterface;
  seletedShippingMethods: CartShipmentsWithSeletedMethodInterface[];
  setSeletedShippingMethods: React.Dispatch<
    React.SetStateAction<CartShipmentsWithSeletedMethodInterface[]>
  >;
  setSeletedCustomerWithCartDetails: React.Dispatch<
    React.SetStateAction<CustomerCartDetailsResponseInterface | null>
  >;
}

interface CISProductInterface {
  id: string;
  master_code: string;
  cis_code: string;
  member_code: string;
  vendor_code: string;
  country: string;
  common_name: string;
  scientific_name: string;
  description: string;
  gender: string;
  size: string;
  age: string;
  origins: string;
  length: string;
  selling_type: string | null;
  regular_price: string;
  inventory_qty: number;
  is_active: number;
  created_date: string; // Can be changed to Date if necessary
  is_assign: boolean;
  shipping_type: string | null;
  company: string | null;
  box_charge: any[]; // Change to a specific type if known
}

interface ListValues {
  value: string | number;
  label: string;
}

interface OrderItemsInterface {
  product: ProductDetailsByCISCodeInterface | null;
  product_name: string;
  product_size: string;
  cis_code: string;
  available_qty: number;
  quantity: number;
  change_price: boolean;
  unit_price: number;
  change_reason: number;
  autoDelivery: boolean;
  delivery_duration: number;
  remarks: string;
}

function ProductDetails({
  toggleModal,
  seletedCustomer,
  seletedShippingMethods,
  setSeletedShippingMethods,
  setSeletedCustomerWithCartDetails,
}: Props) {
  const [cis_search_values, setCis_search_values] = useState<string>("");
  const [cis_list, setCis_list] = useState<ListValues[]>([]);
  const [selectedProduct, setSelectedProduct] =
    useState<ProductDetailsByCISCodeInterface | null>(null);
  const [priceChangeReasonList, setPriceChangeReasonList] = useState<
    ListValues[]
  >([]);
  const [autoDeliveryDurationsList, setAutoDeliveryDurationsList] = useState<
    ListValues[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [savedCartDetails, setSavedCartDetails] =
    useState<CustomerCartDetailsResponseInterface | null>(null);
  const [cartShipmentsWithMethodIds, setCartShipmentsWithMethodIds] = useState<
    CartShipmentsWithSeletedMethodInterface[]
  >(seletedShippingMethods);
  const [seletedMethods, setSeletedMethods] = useState<ShippingMethod[]>([]);
  // const [orderItems, setOrderItems] = useState<OrderItemsInterface[]>([]);
  const debouncedFilter = useDebounce<string>(cis_search_values, 500);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchCSIList(cis_search_values),
      fetchPriceChangeReasonList(),
      fetchAutoDeliveryDurations(),
      fetchCartItemsByCustomerId(),
    ])
      .then(() => {
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    calculateShippingMethodsWithSelectedMethod();
  }, [savedCartDetails]);

  useEffect(() => {
    if (debouncedFilter) fetchCSIList(cis_search_values);
  }, [debouncedFilter]);

  const calculateShippingMethodsWithSelectedMethod = () => {
    const cartShipmentsWithMethodIds =
      savedCartDetails?.carts[0]?.cart_shipments?.map(
        (cartShipment: CartShipment) => {
          return {
            cart_shipment_id: cartShipment?.id,
            shipping_method_id:
              cartShipment?.shipping_type?.shipping_method[0]?.id,
          };
        }
      );
    setSeletedShippingMethods(cartShipmentsWithMethodIds);
  };

  const fetchCartItemsByCustomerId = async () => {
    try {
      const response: AxiosResponse<{
        data: CustomerCartDetailsResponseInterface;
      }> = await axios.get(
        `${GET_CART_ITEMS_BY_CUSTOMER_ID}/${seletedCustomer?.id}`
      );
      setSavedCartDetails(response.data.data);
      setSeletedCustomerWithCartDetails(response.data.data);
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

  const fetchAutoDeliveryDurations = async () => {
    try {
      const response: AxiosResponse<AutoDeliveryDurationResponseInterface> =
        await axios.get(AUTO_DELIVERY_DURATIONS);
      const list_values = response?.data?.data?.map(
        (item: AutoDeliveryDurations) => ({
          value: item.id,
          label: item.duration,
        })
      );
      setAutoDeliveryDurationsList(list_values);
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

  const fetchPriceChangeReasonList = async () => {
    try {
      const response: AxiosResponse<{ data: PriceChangeReasonInterface[] }> =
        await axios.get(`${PRICE_CHANGE_REASONS}`);
      const list_values = response?.data?.data?.map(
        (item: PriceChangeReasonInterface) => ({
          value: item.id,
          label: item.reason,
        })
      );
      setPriceChangeReasonList(list_values);
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

  const fetchCSIList = async (cis_search_values: string) => {
    try {
      const response: AxiosResponse<CISProductsResponseInterface> =
        await axios.get(
          `${FETCH_MASTER_DATA_CSI}?limit=30&filter=cis_code,${cis_search_values}|country,null|vendor_code,null|common_name,null|scientific_name,null|master_code,null|company.name,null`
        );

      if (response.data.data.length > 0) {
        const list_values = response?.data?.data?.map(
          (item: CISProductInterface) => ({
            value: item.cis_code,
            label: `${item.cis_code} - ${item.common_name}`,
          })
        );
        setCis_list(list_values);
      } else {
        setCis_list([]);
      }
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

  const tableColumns = [
    {
      title: "Product ID",
      field: "productID",
      render: (rowData: CartItem) => rowData?.item?.code,
    },
    {
      title: "Product Name",
      field: "productName",
      render: (rowData: CartItem) => rowData?.item?.common_name,
    },
    {
      title: "Size",
      field: "size",
      render: () => "dummy",
    },
    { title: "Quantity", field: "quantity" },
    {
      title: "Available Quantity",
      field: "availableQuantity",
      render: () => "dummy",
    },
    { title: "Warehouse", field: "warehouse", render: () => "dummy" },
    { title: "Remark", field: "remark" },
    { title: "Unit Price", field: "unit_price" },
    { title: "Total Price", field: "sub_total" },
    { title: "Action", field: "action" },
  ];

  const schema = yup.object().shape({
    // orderStatus: yup.string().required(t('ORDER_STATUS_REQUIRED')),
    // cancel_order_reason: yup.string().required(t('CANCEL_ORDER_REASON_REQUIRED'))
  });

  const fetchProductFromCISCode = async (value: string) => {
    try {
      const reponse: AxiosResponse<ProductDetailsByCISCodeResponseInterface> =
        await axios.get(`${HOTLINE_ORDER}/search/cis/${value}`);

      setSelectedProduct(reponse.data.data);
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

  const onSubmit = async (values: OrderItemsInterface) => {
    try {
      await axios.post(`${ORDER_ITEMS_INSERT}`, {
        customer_id: seletedCustomer?.id,
        item_selection_type_id:
          values?.product?.item_selection_types[0]?.item_selection_id,
        quantity: values?.quantity,
        unit_price: values?.unit_price,
        unit_price_change_reason_id: values?.change_reason,
        is_auto_delivery: values?.autoDelivery,
        delivery_duration_id: values?.delivery_duration,
        remark: values?.remarks,
      });
      toast.success("Order created successfully");
      fetchCartItemsByCustomerId();
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

  const fetchCustomerAndOrders = async () => {
    try {
      const response: AxiosResponse<CustomerWithCartResponseInterface> =
        await axios.get(
          `${HOTLINE_CUSTOMER_AND_ORDERS}/${seletedCustomer?.id}`
        );
      console.log(response.data);
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

  const returnShipmentMethodsList = (shippingMethods: ShippingMethod[]) => {
    return shippingMethods?.map((shippingMethod: ShippingMethod) => ({
      value: shippingMethod.id,
      label: shippingMethod.method,
    }));
  };

  const onChangeShipmentMethods = (shipmentId: number, methodId: number) => {
    const withoustSelectedMethod = seletedShippingMethods?.filter(
      (shippingMethod: CartShipmentsWithSeletedMethodInterface) =>
        shippingMethod?.cart_shipment_id !== shipmentId
    );

    const changedData = [
      ...withoustSelectedMethod,
      {
        cart_shipment_id: shipmentId,
        shipping_method_id: methodId,
      },
    ];

    setSeletedShippingMethods(changedData);
  };

  return loading ? (
    <FuseLoading />
  ) : (
    <Formik
      initialValues={{
        // date: '',
        // orderStatus: '',
        // notify_customer: false,
        // cancel_order_reason: '',
        product: selectedProduct || null,
        product_name: selectedProduct?.common_name
          ? selectedProduct.common_name
          : "",
        product_size: selectedProduct?.size ? selectedProduct.size : "",
        cis_code: selectedProduct?.cis_code ? selectedProduct.cis_code : "",
        available_qty: selectedProduct?.inventory_qty
          ? selectedProduct.inventory_qty
          : 0,
        quantity: selectedProduct?.quantity ? selectedProduct.quantity : 0,
        change_price: selectedProduct?.change_price
          ? selectedProduct.change_price
          : false,
        unit_price: selectedProduct?.unit_price
          ? selectedProduct.unit_price
          : 0,
        change_reason: selectedProduct?.change_reason
          ? selectedProduct.change_reason
          : null,
        autoDelivery: selectedProduct?.autoDelivery
          ? selectedProduct.autoDelivery
          : false,
        delivery_duration: selectedProduct?.delivery_duration
          ? selectedProduct.delivery_duration
          : null,
        remarks: selectedProduct?.remarks ? selectedProduct.remarks : "",
      }}
      onSubmit={onSubmit}
      validationSchema={schema}
      enableReinitialize
    >
      {(formik) => (
        <Form>
          <Grid container spacing={2}>
            <Grid
              item
              xs={12}
              sm={6}
              md={6}
              lg={6}
              className="formikFormField pt-[5px!important]"
            >
              <Typography>CIS Code</Typography>
              {/* <div className="flex items-center gap-[5px] w-full"> */}
              <Autocomplete
                size="small"
                options={cis_list}
                getOptionLabel={(option: { label: string }) => option.label} // Display  name
                onInputChange={(_, newInputValue) =>
                  setCis_search_values(newInputValue)
                } // Update search text
                onChange={(_, value: { label: string; value: string }) => {
                  if (value) {
                    formik.setFieldValue("cis_code", value.value);
                    fetchProductFromCISCode(value.value);
                  } else {
                    formik.setFieldValue("cis_code", "");
                    setSelectedProduct(null);
                  }
                }} // Store selected value
                renderInput={(params) => (
                  <TextField {...params} variant="outlined" />
                )}
              />
              {/* <Button className="flex justify-center items-center min-w-max min-h-[40px] max-h-[40px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-100 hover:bg-gray-50 active:scale-[0.8] transition-all ease-in-out duration-300">
                  <SearchIcon />
                </Button> */}
              {/* </div> */}
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={6}
              className="formikFormField pt-[5px!important]"
            >
              <Typography>Diver's Den Code</Typography>
              {/* <Autocomplete
                options={cis_list}
								size='small'
                getOptionLabel={(option) => option.label} // Display student name
                onInputChange={(event, newInputValue) =>
                  setCis_search_values(newInputValue)
                } // Update search text
                onChange={(event, value) =>
                  console.log(value)
                  // formik.setFieldValue("student", value)
                } // Store selected value
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search Student"
                    variant="outlined"
                  />
                )}
              /> */}
              {/* <Field
                className='w-full rounded-r-0'
                name='diver_den_code'
                id='diver_den_code'
                placeholder=''
                disabled={false}
                component={TextFormField}
              /> */}
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              className="formikFormField pt-[5px!important]"
            >
              <Typography>Quantity</Typography>
              <Field
                className="w-full rounded-r-0"
                name="quantity"
                id="quantity"
                placeholder=""
                type="number"
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
              className="formikFormField pt-[5px!important]"
            >
              <Typography>
                Product Name <span className="text-red"> *</span>
              </Typography>
              <Field
                className="w-full rounded-r-0"
                name="product_name"
                id="product_name"
                placeholder=""
                disabled
                component={TextFormField}
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
              <Typography>Product Size</Typography>
              <Field
                className="w-full rounded-r-0"
                name="product_size"
                id="product_size"
                placeholder=""
                disabled
                component={TextFormField}
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
              <Typography>Available Quantity</Typography>
              <Field
                className="w-full rounded-r-0"
                name="available_qty"
                id="available_qty"
                placeholder=""
                type="number"
                disabled
                component={TextFormField}
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
              <Typography>Warehouse</Typography>
              <Field
                className="w-full rounded-r-0"
                name="warehouse"
                id="warehouse"
                placeholder=""
                disabled
                component={TextFormField}
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
              <div className="flex justify-between items-center gap-[5px]">
                <Typography>Unit Price</Typography>
                <FormControlLabel
                  className="m-0"
                  name="change_price"
                  id="change_price"
                  control={
                    <Checkbox
                      color="primary"
                      className="!px-[5px] !py-0 hover:!bg-transparent"
                      size="small"
                    />
                  }
                  label="Change Price"
                  checked={formik.values.change_price}
                  onChange={
                    (e: ChangeEvent<HTMLInputElement>) =>
                      formik.setFieldValue("change_price", e.target.checked)
                    // setIsUnitPriceEditable(e.target.checked)
                  }
                />
              </div>
              <Field
                type="number"
                className="w-full rounded-r-0"
                name="unit_price"
                id="unit_price"
                placeholder=""
                disabled={!formik.values.change_price}
                component={TextFormField}
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
                Change Reason
                <span className="text-red"> *</span>
              </Typography>
              <FormDropdown
                name="change_reason"
                id="change_reason"
                placeholder=""
                optionsValues={priceChangeReasonList}
                disabled={false}
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
              <Typography>Total</Typography>
              <TextField
                className="w-full"
                id="outlined-basic"
                // label="Outlined"
                variant="outlined"
                value={formik.values.quantity * formik.values.unit_price}
                size="small"
                disabled
              />
              {/* <Field
								className="w-full rounded-r-0"
								// name="total"
								id="total"
								placeholder=""
								disabled={false}
								component={TextFormField}
								// value={formik.values.quantity * formik.values.unit_price}
							/> */}
            </Grid>
          </Grid>
          <Grid container spacing={2} className="!pt-[15px]">
            <Grid item xs={12} className="formikFormField pt-[15px!important]">
              <hr />
            </Grid>

            <Grid item xs={12} className="formikFormField pt-[5px!important]">
              <h6 className="text-[12px] sm:text-[14px] lg:text-[16px] text-gray-700 font-600">
                Auto Delivery
              </h6>
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              className="formikFormField pt-[5px!important]"
            >
              <div className="flex justify-between items-center gap-[5px]">
                <Typography>Duration</Typography>
                <FormControlLabel
                  className="m-0"
                  name="autoDelivery"
                  id="autoDelivery"
                  control={
                    <Checkbox
                      color="primary"
                      className="!px-[5px] !py-0 hover:!bg-transparent"
                      size="small"
                    />
                  }
                  label="Auto Delivery"
                  // checked={isUnitPriceEditable}
                  // onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  //   setIsUnitPriceEditable(e.target.checked)
                  // }
                />
              </div>
              <FormDropdown
                name="delivery_duration"
                id="delivery_duration"
                placeholder=""
                optionsValues={autoDeliveryDurationsList}
                disabled={false}
              />
            </Grid>

            <Grid
              item
              xs={12}
              sm={9}
              md={10}
              xl={6}
              className="formikFormField pt-[5px!important]"
            >
              <Typography className="formTypography">Remarks</Typography>
              <Field
                multiline
                rows={4}
                className="w-full rounded-r-0"
                name="remarks"
                id="remarks"
                placeholder=""
                component={TextFormField}
              />
              {/* <TextField
								name="remarks"
								fullWidth
								multiline
								rows={4}
								placeholder="Enter your remark..."
								variant="outlined"
								label=""
							/> */}
            </Grid>

            <Grid
              item
              xl={3}
              md={2}
              sm={3}
              xs={12}
              className="flex justify-end sm:justify-start items-end gap-[10px] !pt-[10px] sm:pt-[15px!important]"
            >
              <Button
                className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
                type="submit"
              >
                Add Product
              </Button>
            </Grid>

            <Grid item xs={12} className="formikFormField pt-[15px!important]">
              <hr />
            </Grid>

            <Grid
              item
              xs={12}
              className="max-h-[320px] pt-[15px!important] overflow-y-auto"
            >
              {savedCartDetails?.carts?.length > 0 &&
                savedCartDetails?.carts[0]?.cart_shipments?.map(
                  (shipment: CartShipment, index: number) => (
                    <>
                      Shipment {index + 1} of{" "}
                      {savedCartDetails?.carts[0]?.cart_shipments.length}
                      <br />
                      <MaterialTableWrapper
                        title=""
                        filterChanged={null}
                        handleColumnFilter={null}
                        tableColumns={tableColumns}
                        handleCommonSearchBar={null}
                        disableColumnFiltering
                        searchByText=""
                        exportToExcel={null}
                        handleRowDeleteAction={null}
                        externalAdd={null}
                        externalEdit={null}
                        externalView={null}
                        selection={false}
                        selectionExport={null}
                        disablePagination
                        disableSearch
                        isColumnChoser
                        records={shipment?.cart_items}
                      />
                      <Typography>Total : {shipment?.total_price}</Typography>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        lg={3}
                        className="formikFormField pt-[5px!important]"
                      >
                        <Typography>Select Shipping Method</Typography>

                        <Select
                          className="w-full"
                          labelId="demo-simple-select-helper-label"
                          id="demo-simple-select-helper"
                          defaultValue={
                            shipment?.shipping_type?.shipping_method[0]?.id
                          }
                          label="shipment_method"
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            onChangeShipmentMethods(
                              shipment?.id,
                              parseInt(e.target.value, 10)
                            )
                          }
                        >
                          {returnShipmentMethodsList(
                            shipment?.shipping_type?.shipping_method
                          )?.map((method: { value: number; label: string }) => (
                            <MenuItem value={method.value}>
                              {method.label}
                            </MenuItem>
                          ))}
                        </Select>

                        {/* <FormDropdown
													name="shipping_method"
													id="shipping_method"
													placeholder=""
													optionsValues={returnShipmentMethodsList(
														shipment?.shipping_type?.shipping_method
													)}
													disabled={false}
													value={shipment?.shipping_type?.shipping_method[0]?.id} // Default selected value
												/> */}
                      </Grid>
                    </>
                  )
                )}
            </Grid>

            <Grid
              item
              md={12}
              sm={12}
              xs={12}
              className="flex justify-between items-center gap-[10px] pt-[15px!important]"
            >
              <Button className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80">
                Back
              </Button>
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

export default ProductDetails;
