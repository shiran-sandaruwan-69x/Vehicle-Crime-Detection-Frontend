import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios, { AxiosResponse } from 'axios';
import { FETCH_ORDER_PLANING_BY_ID } from 'src/app/axios/services/AdminServices';
import { DialogContent } from '@mui/material';
import FuseLoading from '@fuse/core/FuseLoading/FuseLoading';
import CustomTab from '../../../../../common/CustomTab';
import OrderPlanningDetails from './components/OrderPlanningDetails';
import OrderPlanningItemDetails from './components/OrderPlanningItemDetails';
import OrderPlanningRemarks from './components/OrderPlanningRemarks';
import { OrderShipmentInterface } from './interfaces';

export interface OrderData {
  id: number;
  order_code: string;
  no_of_items: number | null;
  total_price: string;
  estimated_delivery_date: string;
  order_status: string | null;
  remark: string;
  cancel_reason: string;
  order: OrderDetails;
  order_shipment_items: OrderShipmentItem[];
}

export interface OrderDetails {
  id: number;
  order_no: string;
  order_date: string | null;
  amount: string;
  redeem_credits: string;
  redeem_promo: string;
  redeem_gifts: string;
  box_charge: string;
  total_shipping_cost: string;
  tax_rate: string | null;
  tax_amount: string;
  total_amount: string;
  remark: string | null;
  is_active: number;
  customer_details: CustomerDetails;
  billing_address: Address;
  shipping_address: Address;
}

interface CustomerDetails {
  id: string;
  first_name: string;
  last_name: string;
  mobile_no: string;
  email: string;
  gender: string | null;
  dob: string;
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

export interface OrderShipmentItem {
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
  special_message: string;
  is_admin_only: number;
  reject_reason: string | null;
  status: number;
  is_advertisement: number;
  is_active: number;
  average_product_rating: number;
  average_delivery_rating: number;
  item_attributes: ItemAttribute[];
}

interface ItemAttribute {
  id: number;
  name: string;
  attributes: {
    id: number;
    name: string;
    is_active: number;
  }[];
}

function CustomTabPanel({ children, value, index, ...other }: any) {
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
  orderId?: number;
}

function OrderPlanningModel({
  toggleModal,
  isOpen,
  orderId,
}: BackOrdersHistoryModelProps) {
  const { t } = useTranslation('orderPlanning');

  const [value, setValue] = React.useState<number>(0);
  const [order, setOrder] = useState<OrderShipmentInterface>(null);

  useEffect(() => {
    fetchOrderById(orderId);
  }, [orderId]);

  const fetchOrderById = async (orderId: number) => {
    try {
      const response: AxiosResponse<{ data: OrderShipmentInterface }> =
        await axios.get(FETCH_ORDER_PLANING_BY_ID + orderId);
      setOrder(response?.data?.data);
    } catch (error) {
      //
    }
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return order === null ? (
    <FuseLoading />
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
          {t('ORDER_PLANNING')}
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
              <CustomTab label='Order Planning Remarks' index={2} />
            </Tabs>
            <CustomTabPanel value={value} index={0}>
              <OrderPlanningDetails toggleModal={toggleModal} order={order} />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              <OrderPlanningItemDetails
                toggleModal={toggleModal}
                order={order}
              />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
              <OrderPlanningRemarks toggleModal={toggleModal} order={order} />
            </CustomTabPanel>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

export default OrderPlanningModel;
