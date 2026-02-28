import { Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@mui/material/Button';
import axios, { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import {
  BACK_ORDER_UPDATE_ITEM,
  FETCH_BACK_ORDER_BY_ID,
} from 'src/app/axios/services/AdminServices';
import FuseLoading from '@fuse/core/FuseLoading/FuseLoading';

import MaterialTableWrapper from '../../../../../../common/tableComponents/MaterialTableWrapper';
import BackOrdersDeleteAlertForm from '../alert-models/BackOrdersDeleteAlertForm';
import BackOrdersEditAlertForm from '../alert-models/BackOrdersEditAlertForm';
import { OrderDetailsData, OrderDetailsResponse } from '../BackOrdersModel';

interface Props {
  toggleModal: () => void;
  order: OrderDetailsData;
}

function BackOrderItemDetails({ toggleModal, order }: Props) {
  const { t } = useTranslation('initialOrderReview');
  const [pageNo, setPageNo] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(5);
  const [count] = useState(100);
  const [isOpenNewMethod, setOpenNewMethodModal] = useState(false);
  const [items, setItems] = useState<any>([]);
  const [selectedItemRow, setSelectedItemRow] = useState<any>(null);
  const [isDeleteModel, setIsDeleteModel] = useState(false);
  const [seletedOldData, setSeletedOldData] = useState<any>(null);
  const [orderValue, setOrderValue] = React.useState<OrderDetailsData>(null);
  const [isEditModel, setIsEditModel] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  const toggleDeleteModel = () => {
    setIsDeleteModel(!isDeleteModel);
  };

  const toggleEditModel = () => {
    setIsEditModel(!isEditModel);
  };

  useEffect(() => {
    fetchOrderById(order.id);
  }, []);

  useEffect(() => {
    if (
      orderValue &&
      orderValue.order_shipment_items &&
      orderValue.order_shipment_items.length > 0
    ) {
      const itemData =
        orderValue?.order_shipment_items &&
        orderValue?.order_shipment_items.length > 0 &&
        orderValue?.order_shipment_items.map((item: any) => {
          return {
            id: item?.id,
            productId: item?.item?.id,
            productCode: item?.item?.code,
            productName: item?.item?.common_name,
            quantity: item?.quantity,
            customerRemark: item?.remark,
            adminRemark: item?.admin_remark,
            unitPrice: item?.unit_price,
            totalPrice: item?.sub_total,
            size: item?.item_selection_type?.master_data?.size
              ? item?.item_selection_type?.master_data?.size
              : '',
            order_status: orderValue?.order_status,
          };
        });
      setItems(itemData);
    }
  }, [orderValue, loading]);

  const fetchOrderById = async (orderId: number) => {
    setLoading(true);
    try {
      const response: AxiosResponse<OrderDetailsResponse> = await axios.get(
        FETCH_BACK_ORDER_BY_ID + orderId
      );
      setOrderValue(response.data.data);
      setLoading(false);
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Something went wrong');
      }

      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setPageNo(page);
  };

  const handlePageSizeChange = (pageSize: number) => {
    setPageSize(pageSize);
  };

  const tableRowEditHandler = (newData, oldData, resolve, setData) => {
    setSelectedItemRow(newData);
    setSeletedOldData(oldData);
    // Simulate an async operation (e.g., API call)
    setTimeout(() => {
      const dataUpdate = [...items];
      const index = oldData.tableData.id;
      dataUpdate[index] = newData;
      setItems(dataUpdate);
      resolve();
      toggleEditModel();
    }, 1000);
  };

  const itemUpdateHandler = async (newData) => {
    try {
      await axios.put(
        `${BACK_ORDER_UPDATE_ITEM}${order.id}/items/${newData.id}`,
        {
          quantity: newData.quantity,
          admin_remark: newData.adminRemark,
        }
      );
      toast.success('Item updated successfully');
      toggleEditModel();
    } catch (error) {
      toggleEditModel();

      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Something went wrong');
      }
    } finally {
      setTimeout(() => {
        fetchOrderById(order.id);
      }, 10);
    }
  };

  const itemRemoveHandler = async (data: any) => {
    setSelectedItemRow(data);
    toggleDeleteModel();
  };

  const tableColumns = [
    {
      title: t('PRODUCT_ID'),
      field: 'productCode',
      editable: 'never',
    },
    {
      title: t('PRODUCT_NAME'),
      field: 'productName',
      editable: 'never',
    },
    { title: t('SIZE'), field: 'size', editable: 'never' },
    {
      title: t('QUANTITY'),
      field: 'quantity',
      editable: 'always',
      type: 'numeric', // Ensures numeric input only
      validate: (rowData) => {
        if (rowData.quantity === undefined || rowData.quantity === null) {
          return 'Required';
        }

        if (rowData.quantity <= 0) {
          return 'Must be greater than 0';
        }

        const existingItem = items.find((item) => item.id === rowData.id);

        if (existingItem && existingItem.quantity < rowData.quantity) {
          return 'Must be less than or equal to Initial Seleted quantity';
        }

        return true; // Validation passed
      },
    },
    {
      title: t('AVAILABLE_QTY'),
      field: 'availableQuantity',
      editable: 'never',
    },
    {
      title: t('WAREHOUSE'),
      field: 'wareHouse',
      editable: 'never',
    },
    { title: t('STATUS'), field: 'order_status', editable: 'never' },
    // {
    //   title: t("CUSTOMER_REMARK"),
    //   field: "customerRemark",
    //   editable: "never",
    // },
    {
      title: t('ADMIN_REMARK'),
      field: 'adminRemark',
      editable: 'always',
      validate: (rowData) => {
        if (!rowData.adminRemark || rowData.adminRemark.trim() === '') {
          return 'Required';
        }

        if (rowData.adminRemark.length < 3) {
          return 'Must be at least 3 characters long';
        }

        return true; // Validation passed
      },
    },
    {
      title: t('UNIT_PRICE'),
      field: 'unitPrice',
      editable: 'never',
      align: 'right',
      render: (rowData: any) => (
        <span className='text-right'>
          {`$ ${new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
            .format(Number(rowData.unitPrice))
            .replace(/,/g, ' ')}`}
        </span>
      ),
    },
    {
      title: t('TOTAL_PRICE'),
      field: 'totalPrice',
      editable: 'never',
      align: 'right',
      render: (rowData: any) => (
        <span className='text-right'>
          {`$ ${new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
            .format(Number(rowData.totalPrice))
            .replace(/,/g, ' ')}`}
        </span>
      ),
    },
  ];

  return loading ? (
    <FuseLoading />
  ) : (
    <div className='min-w-full max-w-[100vw]'>
      <Grid container spacing={2}>
        <Grid item xs={12} className='pt-[5px!important]'>
          <h6 className='text-[12px] lg:text-[14px] text-primaryBlue font-600'>
            Item Details
          </h6>
        </Grid>

        <Grid item xs={12} className='pt-[5px!important]'>
          {items.length > 0 && (
            <MaterialTableWrapper
              title=''
              filterChanged={null}
              handleColumnFilter={null}
              tableColumns={tableColumns}
              handlePageChange={handlePageChange}
              handlePageSizeChange={handlePageSizeChange}
              handleCommonSearchBar={null}
              pageSize={pageSize}
              disableColumnFiltering
              pageIndex={pageNo}
              setPageSize={setPageSize}
              searchByText=''
              disablePagination
              count={count}
              exportToExcel={null}
              handleRowDeleteAction={null}
              externalAdd={null}
              externalEdit={null}
              externalView={null}
              selection={false}
              disableSearch
              isColumnChoser
              records={items}
              tableRowDeleteHandler={itemRemoveHandler}
              updateAction={tableRowEditHandler}
            />
          )}
        </Grid>
        <Grid item xs={12} className='pt-[15px!important]'>
          <hr />
        </Grid>
      </Grid>

      <Grid container spacing={2} className='mt-[10px]'>
        <Grid item xs={12} sm={6} lg={3} className='pt-[5px!important]'>
          <h6 className='text-[12px] lg:text-[14px] mb-[5px]'>
            <span className='inline-block min-w-[149px] lg:min-w-[95px] font-600'>
              Back Order Item Total
            </span>{' '}
            : ${orderValue?.order?.amount}- test
          </h6>
          <h6 className='text-[12px] lg:text-[14px] mb-[5px]'>
            <span className='inline-block min-w-[149px] lg:min-w-[95px] font-600'>
              Box Charge
            </span>{' '}
            : ${orderValue?.order?.box_charge} - test
          </h6>
          {/* <h6 className="text-[12px] lg:text-[14px]">
            <span className="inline-block min-w-[149px] lg:min-w-[95px] font-600">
              Shipping Cost
            </span>{" "}
            : ${orderValue?.shipping_cost}
          </h6> */}
        </Grid>

        <Grid item xs={12} sm={6} lg={3} className='pt-[5px!important]'>
          {/* <h6 className="text-[12px] lg:text-[14px] mb-[5px]">
            <span className="inline-block min-w-[149px] lg:min-w-[78px] font-600">
              Tax Total
            </span>{" "}
            : ${orderValue?.order?.tax_amount}
          </h6> */}
          <h6 className='text-[12px] lg:text-[14px] font-800'>
            <span className='inline-block min-w-[149px] lg:min-w-[78px] font-600'>
              Gross Total
            </span>{' '}
            : ${orderValue?.total_price}
          </h6>
        </Grid>

        {/* <Grid item xs={12} sm={6} lg={3} className="pt-[5px!important]">
          <h6 className="text-[12px] lg:text-[14px] mb-[5px]">
            <span className="inline-block min-w-[149px] lg:min-w-[174px] font-600">
              Credit Points Applied
            </span>{" "}
            : ${orderValue?.order?.redeem_credits}
          </h6>
          <h6 className="text-[12px] lg:text-[14px] mb-[5px]">
            <span className="inline-block min-w-[149px] lg:min-w-[174px] font-600">
              {" "}
              Applicable Reward Points
            </span>{" "}
            : ${orderValue?.order?.redeem_rewards}
          </h6>
          <h6 className="text-[12px] lg:text-[14px]">
            <span className="inline-block min-w-[149px] lg:min-w-[174px] font-600">
              Applicable Promos
            </span>{" "}
            : ${orderValue?.order?.redeem_promo}
          </h6>
        </Grid> */}

        <Grid item xs={12} sm={6} lg={3} className='pt-[5px!important]'>
          {/* <h6 className="text-[12px] lg:text-[14px] mb-[5px]">
            <span className="inline-block min-w-[149px] lg:min-w-[101px] font-600">
              Gift Certificate
            </span>{" "}
            : ${orderValue?.order?.redeem_gifts}
          </h6> */}
          <h6 className='text-[12px] lg:text-[14px] font-800'>
            <span className='inline-block min-w-[149px] lg:min-w-[101px] font-600'>
              Net Total
            </span>{' '}
            : ${orderValue?.total_price}
          </h6>
        </Grid>
      </Grid>

      <Grid container spacing={2} className='mt-[5px]'>
        <Grid
          item
          md={12}
          sm={12}
          xs={12}
          className='flex justify-end items-center gap-[10px] pt-[10px!important]'
        >
          <Button
            onClick={toggleModal}
            className='flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80'
          >
            Close
          </Button>
        </Grid>
      </Grid>

      {isDeleteModel && (
        <BackOrdersDeleteAlertForm
          toggleModal={() => {
            toggleDeleteModel();
            fetchOrderById(order.id);
          }}
          isOpen={isDeleteModel}
          clickedRowData={selectedItemRow}
          orderId={order.id}
        />
      )}

      {isEditModel && (
        <BackOrdersEditAlertForm
          toggleModal={() => {
            toggleEditModel();
            fetchOrderById(order.id);
          }}
          isOpen={isEditModel}
          clickedRowData={selectedItemRow}
          handleAlertForm={itemUpdateHandler}
          seletedOldData={seletedOldData}
        />
      )}
    </div>
  );
}

export default BackOrderItemDetails;
