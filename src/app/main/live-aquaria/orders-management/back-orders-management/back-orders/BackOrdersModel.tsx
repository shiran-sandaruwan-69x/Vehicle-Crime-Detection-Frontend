import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import React, { ReactNode, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';
import { FETCH_BACK_ORDER_BY_ID } from 'src/app/axios/services/AdminServices';
import { toast } from 'react-toastify';
import ExtendedAxiosError from 'src/app/types/ExtendedAxiosError';
import FuseLoading from '@fuse/core/FuseLoading/FuseLoading';
import CustomTab from '../../../../../common/CustomTab';
import BackOrderCustomerAndOrderDetails from './components/BackOrderCustomerAndOrderDetails';
import BackOrderItemDetails from './components/BackOrderItemDetails';
import BackOrdersRemarks from './components/BackOrdersRemarks';

export interface OrderDetailsResponse {
  data: OrderDetailsData;
}

export interface OrderDetailsData {
  id: number;
  pickup_option: {
    option: string;
  };
  order_code: string;
  no_of_items: number | null;
  total_price: string;
  estimated_delivery_date: string;
  order_status: string;
  remark: string;
  cancel_reason: string | null;
  order: Order;
  order_shipment_items: OrderShipmentItem[];
  logs: any[]; // Assuming `logs` is an empty array with no specific structure provided
  created_at: string;
}

interface Order {
  id: number;
  order_no: string;
  order_date: string | null;
  amount: string;
  redeem_credits: string;
  redeem_promo: string;
  redeem_gifts: string;
  box_charge: string;
  total_shipping_cost: string;
  tax_rate: string;
  tax_amount: string;
  total_amount: string;
  remark: string | null;
  is_active: number;
  customer_details: CustomerDetails;
  billing_address: Address;
  shipping_address: Address;
  redeem_rewards: string;
}

interface CustomerDetails {
  id: string;
  code: string;
  first_name: string;
  last_name: string;
  mobile_no: string;
  email: string;
  gender: string | null;
  dob: string | null;
  is_active: number;
}

interface Address {
  id: string;
  address_line_1: string;
  address_line_2: string;
  address_line_3: string;
  zip_code: string;
  city: string;
  state: string;
  country: Country;
  is_default_billing: number;
  is_default_shipping: number;
}

interface Country {
  id: number;
  code: string;
  name: string;
  is_active: number;
}

interface OrderShipmentItem {
  id: number;
  quantity: number;
  unit_price: string;
  sub_total: string;
  is_active: number;
  is_auto_delivery: number;
  is_delivered: number;
  remark: string | null;
  item: Item;
}

interface Item {
  id: string;
  code: string;
  type: number;
  title: string;
  common_name: string;
  scientific_name: string;
  short_description: string;
  long_description: string;
  meta_keywords: string;
  meta_description: string;
  additional_information: string;
  is_loyalty_rewards: number;
  is_weekly_special: number;
  is_auto_delivery: number;
  is_availability_emails: number;
  special_message: string | null;
  is_admin_only: number;
  reject_reason: string | null;
  status: number;
  is_advertisement: number;
  is_active: number;
  average_product_rating: number;
  average_delivery_rating: number;
  item_attributes: ItemAttribute[][];
}

interface ItemAttribute {
  id: string;
  name: string;
  attributes: Attribute[];
}

interface Attribute {
  id: string;
  name: string;
  is_active: number;
}

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
      role='tabpanel'
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
  id: number;
}

function BackOrdersModel({
  toggleModal,
  isOpen,
  id,
}: BackOrdersHistoryModelProps) {
  const [value, setValue] = React.useState<number>(0);
  const [order, setOrder] = React.useState<OrderDetailsData>(null);

  useEffect(() => {
    // fetchOrderById(id);
  }, [id]);

  const fetchOrderById = async (orderId: number) => {
    try {
      const response: AxiosResponse<OrderDetailsResponse> = await axios.get(
        FETCH_BACK_ORDER_BY_ID + orderId
      );
      setOrder(response.data.data);
    } catch (error) {
      const axiosError = error as ExtendedAxiosError;

      if (axiosError?.response?.data?.message) {
        toast.error(axiosError.response.data.message);
      } else if (axiosError.message) {
        toast.error(axiosError.message);
      } else {
        toast.error('An unexpected error occurred');
      }
    }
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return order === null ? (
    <div className='flex justify-center items-center w-full h-[200px] bg-white z-[10001]'>
      <FuseLoading />
    </div>
  ) : (
    <Dialog
      fullWidth
      open={isOpen}
      maxWidth='xl'
      onClose={toggleModal}
      PaperProps={{
        style: {
          top: '40px',
          margin: 0,
          position: 'absolute',
        },
      }}
    >
      <DialogTitle className='pb-0'>
        <h6 className='text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-400'>
          Back Orders
        </h6>
      </DialogTitle>
      <DialogContent className='pb-0'>
        <Grid container spacing={2}>
          <Grid item md={12} sm={12} xs={12} className='pt-[5px!important]'>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label='basic tabs example'
              variant='fullWidth'
              className='h-[30px] min-h-[40px] border-b border-gray-300'
            >
              <CustomTab label='Customer & Order Details' index={0} />
              <CustomTab label='Item Details' index={1} />
              <CustomTab label='Back Order Status Modifier' index={2} />
            </Tabs>
            <CustomTabPanel value={value} index={0}>
              <BackOrderCustomerAndOrderDetails
                toggleModal={toggleModal}
                order={order}
              />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              <BackOrderItemDetails toggleModal={toggleModal} order={order} />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
              <BackOrdersRemarks toggleModal={toggleModal} order={order} />
            </CustomTabPanel>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

export default BackOrdersModel;
