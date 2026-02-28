import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import Tabs from "@mui/material/Tabs";
import React, { ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";

import CustomerDetails from "./components/CustomerDetails";
import OrderDetails from "./components/OrderDetails";
import ProductDetails from "./components/ProductDetails";
import CustomTab from "../../../../common/CustomTab";
import {
  CartShipmentsWithSeletedMethodInterface,
  CustomerCartDetailsResponseInterface,
  CustomerDetailsByIdResponseInterface,
} from "./interfaces";

interface CustomTabPanelProps {
  children?: ReactNode;
  value: number;
  index: number;
  other?: object;
}

function CustomTabPanel({
  children,
  value,
  index,
  ...other
}: CustomTabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

interface BackOrdersHistoryModelProps {
  toggleModal: () => void;
  isOpen: boolean;
}

function HotlineOrdersCreateModal({
  toggleModal,
  isOpen,
}: BackOrdersHistoryModelProps) {
  const { t } = useTranslation("hotlineOrders");

  const [value, setValue] = React.useState<number>(0);
  const [seletedCustomer, setSeletedCustomer] =
    useState<CustomerDetailsByIdResponseInterface>(null);
  const [seletedCustomerWithCartDetails, setSeletedCustomerWithCartDetails] =
    useState<CustomerCartDetailsResponseInterface | null>(null);
  const [seletedShippingMethods, setSeletedShippingMethods] = useState<
    CartShipmentsWithSeletedMethodInterface[]
  >([]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Dialog
      fullWidth
      open={isOpen}
      maxWidth="xl"
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
          {t("CREATE_NEW_ORDER")}
        </h6>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid
            item
            md={12}
            sm={12}
            xs={12}
            className="!pt-[15px] sm:pt-[5px!important]"
          >
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
              variant="fullWidth"
              className="h-[30px] min-h-[40px] border-b border-gray-300"
            >
              <CustomTab label="Customer Details" index={0} />
              <CustomTab label="Product Details" index={1} />
              <CustomTab label="Order Details" index={2} />
            </Tabs>
            <CustomTabPanel value={value} index={0}>
              <CustomerDetails
                // toggleModal={toggleModal}
                setSeletedCustomer={setSeletedCustomer}
                seletedCustomer={seletedCustomer}
              />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              <ProductDetails
                toggleModal={toggleModal}
                seletedCustomer={seletedCustomer}
                seletedShippingMethods={seletedShippingMethods}
                setSeletedShippingMethods={setSeletedShippingMethods}
                setSeletedCustomerWithCartDetails={
                  setSeletedCustomerWithCartDetails
                }
              />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
              <OrderDetails
                toggleModal={toggleModal}
                seletedCustomerWithCartDetails={seletedCustomerWithCartDetails}
                seletedShippingMethods={seletedShippingMethods}
              />
            </CustomTabPanel>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

export default HotlineOrdersCreateModal;
