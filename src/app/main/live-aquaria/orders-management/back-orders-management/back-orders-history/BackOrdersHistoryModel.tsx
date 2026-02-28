import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import React, { ReactNode, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';
import { FETCH_BACK_ORDER_HISTORY_BY_ID } from 'src/app/axios/services/AdminServices';
import FuseLoading from '@fuse/core/FuseLoading/FuseLoading';
import CustomTab from '../../../../../common/CustomTab';
import BackOrderHistoryCustomerAndOrderDetails from './components/BackOrderHistoryCustomerAndOrderDetails';
import BackOrderHistoryItemDetails from './components/BackOrderHistoryItemDetails';
import BackOrdersHistoryRemarks from './components/BackOrdersHistoryRemarks';

interface CustomTabPanelProps {
  children?: ReactNode;
  value: number;
  index: number;
  other?: object;
}

export interface OrderData {
  id: number;
  created_at: string;
  order_code: string;
  pickup_option: {
    option: string;
  };
  no_of_items: number | null;
  total_price: string;
  estimated_delivery_date: string;
  order_status: string;
  remark: string;
  cancel_reason: string;
  order: {
    id: number;
    order_no: string;
    order_date: string | null;
    amount: string;
    redeem_credits: string;
    redeem_rewards: string;
    redeem_promo: string;
    redeem_gifts: string;
    box_charge: string;
    total_shipping_cost: string;
    tax_rate: string;
    tax_amount: string;
    total_amount: string;
    remark: string | null;
    is_active: number;
    customer_details: {
      id: string;
      code: string;
      first_name: string;
      last_name: string;
      mobile_no: string;
      email: string;
      gender: string | null;
      dob: string;
      is_active: number;
    };
    billing_address: Address;
    shipping_address: Address;
  };
  order_shipment_items: OrderShipmentItem[];
  logs: Log[];
}

interface Address {
  id: string;
  address_line_1: string;
  address_line_2: string;
  address_line_3: string;
  zip_code: string;
  city: string;
  state: string;
  country: {
    id: number;
    code: string;
    name: string;
    is_active: number;
  };
  is_default_billing: number;
  is_default_shipping: number;
}

export interface OrderShipmentItem {
  id: number;
  quantity: number;
  unit_price: string;
  sub_total: string;
  is_active: number;
  is_auto_delivery: number;
  is_delivered: any;
  remark: string;
  delivered_date: string;
  admin_remark: string;
  delete_reason: string;
  item_old: string;
  item: Item;
  purchase_certificate: any;
}

export interface ItemOnShipmentItem {
  id: string;
  code: string;
  type: number;
  title: any;
  common_name: string;
  scientific_name: string;
  short_description: any;
  long_description: any;
  meta_keywords: any;
  meta_description: any;
  additional_information: any;
  water_type: any;
  is_loyalty_rewards: number;
  is_weekly_special: number;
  is_auto_delivery: number;
  is_availability_emails: number;
  special_message: any;
  is_admin_only: number;
  reject_reason: any;
  status: number;
  is_advertisement: number;
  is_active: number;
  average_product_rating: number;
  average_delivery_rating: number;
  item_attributes: ItemAttribute[][];
}

export interface ItemAttributeOnItem {
  id: string;
  name: string;
  attributes: Attribute[];
}

export interface AttributeOnItem {
  id: string;
  name: string;
  is_active: number;
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

interface Log {
  action: string;
  remark: string;
  details: string;
  created_at: string;
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

function BackOrdersHistoryModel({
  toggleModal,
  isOpen,
  id,
}: BackOrdersHistoryModelProps) {
  const [value, setValue] = React.useState<number>(0);
  const [order, setOrder] = React.useState<OrderData>(null);

  useEffect(() => {
    fetchOrderById(id);
  }, [id]);

  const fetchOrderById = async (orderId: number) => {
    try {
      const response: AxiosResponse<{ data: OrderData }> = await axios.get(
        FETCH_BACK_ORDER_HISTORY_BY_ID + orderId
      );
      setOrder(response.data.data);
    } catch (error) {
      //
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
          Back Orders History
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
              <CustomTab label='Back Orders History Status' index={2} />
            </Tabs>
            <CustomTabPanel value={value} index={0}>
              <BackOrderHistoryCustomerAndOrderDetails
                toggleModal={toggleModal}
                order={order}
              />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              <BackOrderHistoryItemDetails
                toggleModal={toggleModal}
                order={order}
              />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
              <BackOrdersHistoryRemarks
                toggleModal={toggleModal}
                order={order}
              />
            </CustomTabPanel>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

export default BackOrdersHistoryModel;
