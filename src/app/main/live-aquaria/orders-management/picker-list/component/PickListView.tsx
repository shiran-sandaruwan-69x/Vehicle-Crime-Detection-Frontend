/* eslint-disable prettier/prettier */
import PrintIcon from '@mui/icons-material/Print';
import {
  Button, CircularProgress,
  Grid,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios , {AxiosResponse} from 'axios';
import {
  PICKER_LIST_STATUS,
  POST_PICKERLIST_BOX_LABEL,
  POST_PICKERLIST_PRINT_BAG,
  PUT_PICKERLIST_BOX_LABEL
} from 'src/app/axios/services/AdminServices';
import { toast } from 'react-toastify';
import OrdersLogTable from 'src/app/common/OrdersLogTable';
import MaterialTableWrapper from '../../../../../common/tableComponents/MaterialTableWrapper';
import PickerListPopUp from './PickerListPopUp';
import { OrderData, OrderShipmentItem } from './PickerCustomTabPanel';
import BoxWeightForm from './BoxWeightForm';
import { FormikInitialValuesInterface } from '../Interfaces';
import {ItemsInterface} from '../../order-planning-management/order-planning/interfaces';



interface Props {
  toggleModal: () => void;
  order: OrderData;
  fetchOrdersToPicker:(id:string) => void;
  pickerListId:string;
  id:string;
  fetchOrderById:(id:string) => void;
}

interface ErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}

function PickListView({ toggleModal, order,fetchOrdersToPicker,pickerListId,id,fetchOrderById }: Props) {
  const { t } = useTranslation('pickerList');

  const [isPrintDialogOpen, setPrintDialogOpen] = useState(false);
  const togglePrintDialog = () => setPrintDialogOpen(!isPrintDialogOpen);
  const [items, setItems] = useState<ItemsInterface[]>([]);
  const [seletedItems, setSelectedItems] = useState<any>([]);
  const [isInitialValues, setIsInitialValues] = useState<any>([]);
  const [isDataLoading, setDataLoading] = useState(false);
  const [isPrintBagDataLoading, setPrintBagDataLoading] = useState(false);
  const [isPrintBoxLabelDataLoading, setPrintBoxLabelDataLoading] = useState(false);
  // const [itemsForDrowpdown, setItemsForDrowpdown] = useState<any>([]);

  useEffect(() => {
    const itemData = order?.order_shipment_items?.map((item: OrderShipmentItem) => {
      return {
        id: item?.id,
        value: item?.id,
        label: item?.item_selection_type?.master_data?.common_name,
        productId: item?.item?.id,
        productCode: item?.item?.code,
        productName: item?.item?.common_name,
        quantity: item?.quantity,
        customerRemark: item?.remark,
        adminRemark: item?.admin_remark,
        availableQuantity: item?.item_selection_type?.master_data?.inventory_qty,
        wareHouse: item?.item_selection_type?.master_data?.shipping_type?.company?.name,
        unitPrice: item?.unit_price,
        totalPrice: item?.sub_total,
        size: item?.item_selection_type?.master_data?.size ? item?.item_selection_type?.master_data?.size : '',
        status: item?.item?.status
      };
    });
    setItems(itemData);
    const changeData = order?.order_shipment_boxes?.map(item=>({
      weight:item?.box_weight,
      height:item?.box_height,
      length:item?.box_length,
      width:item?.box_width,
      seletedItems:item?.order_shipment_items?.map(item=>({
        id:item?.id,
        value:item?.id,
        label: item?.name
      }))
    }))
   setIsInitialValues(changeData);
  }, [order]);

  const tableColumn = [
    {
      title: t('PRODUCT_ID'),
      field: 'productCode',
      editable: 'never'
    },
    {
      title: t('PRODUCT_NAME'),
      field: 'productName',
      editable: 'never'
    },
    { title: t('SIZE'), field: 'size', editable: 'never' },
    {
      title: t('QUANTITY'),
      field: 'quantity',
      editable: 'always',
      validate: (rowData: ItemsInterface) => {
        if (rowData.quantity === undefined || rowData.quantity === null) {
          return 'Quantity is required';
        }

        if (rowData.quantity <= 0) {
          return 'Quantity must be greater than 0';
        }

        return true; // Validation passed
      }
    },
    {
      title: t('AVAILABLE_QTY'),
      field: 'availableQuantity',
      editable: 'never'
    },
    {
      title: t('BAG_AND_CUPS'),
      field: 'backAndCups',
    },
    {
      title: t('PACKING_MATERIALS'),
      field: 'packerMaterials',
    },
    {
      title: t('CUSTOMER_REMARK'),
      field: 'customerRemark',
      editable: 'never'
    },
    {
      title: t('ADMIN_REMARK'),
      field: 'adminRemark',
      editable: 'always',
      validate: (rowData: ItemsInterface) => {
        if (!rowData.adminRemark || rowData.adminRemark.trim() === '') {
          return 'Admin remark is required';
        }

        if (rowData.adminRemark.length < 3) {
          return 'Admin remark must be at least 3 characters long';
        }

        return true; // Validation passed
      }
    },
    {
      title: t('UNIT_PRICE'),
      field: 'unitPrice',
      editable: 'never',
      render: (rowData: ItemInterface) =>
          rowData.unitPrice
              ? `$${Number(rowData.unitPrice).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}`
              : ''
    },
    {
      title: t('TOTAL_PRICE'),
      field: 'totalPrice',
      editable: 'never',
      render: (rowData: ItemInterface) =>
          rowData.totalPrice
              ? `$${Number(rowData.totalPrice).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}`
              : ''
    }
  ];

  const handlePrintBagList = async () => {
    setPrintBagDataLoading(true);
    try {
      const response : AxiosResponse<{ pdf_base64: string}> = await axios.post(POST_PICKERLIST_PRINT_BAG, {
        shipment_item: seletedItems,
      });
      toast.success('Printed successfully');
      setPrintBagDataLoading(false);

      if(response?.data){
        openPdfInNewTab(response?.data?.pdf_base64);
      }
    } catch (error) {
      setPrintBagDataLoading(false);
      const isErrorResponse = (error: unknown): error is ErrorResponse => {
        return typeof error === 'object' && error !== null && 'response' in error;
      };

      if (isErrorResponse(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Internal server error');
      }
    }
  };

  const openPdfInNewTab = (pdfBase64) => {
    const byteCharacters = atob(pdfBase64);
    const byteNumbers = new Array(byteCharacters.length).fill(null).map((_, i) => byteCharacters.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });

    const pdfUrl = URL.createObjectURL(blob);
    window.open(pdfUrl, '_blank');
  };

  const handlePrintBoxLabelHandler = async (values: FormikInitialValuesInterface) => {
    setPrintBoxLabelDataLoading(true);
     try {
        const data_update = values.weights.map((weight: any) => {
          return {
            box_weight: weight?.weight,
            box_length: weight?.length,
            box_width: weight?.width,
            box_height: weight?.height,
            order_shipment_item_id: weight?.seletedItems?.map((item: any) => item?.id),
          };
        })
        const response = await axios.put(`${PUT_PICKERLIST_BOX_LABEL}/${order?.id}`, {
          boxes : data_update
        })
       setPrintBoxLabelDataLoading(false);

        if(response?.data){
          fetchOrderById(id);
          handlePrintBoxLabel();
        }
     } catch (error) {
       setPrintBoxLabelDataLoading(false);
       const isErrorResponse = (error: unknown): error is ErrorResponse => {
         return typeof error === 'object' && error !== null && 'response' in error;
       };

       if (isErrorResponse(error) && error.response?.data?.message) {
         toast.error(error.response.data.message);
       } else {
         toast.error('Internal server error');
       }
     }
  }

  const handlePrintBoxLabel = async () => {
    try {
      const response: AxiosResponse<any> = await axios.post(POST_PICKERLIST_BOX_LABEL, {
        order_shipment_id: [order.id]
      })

      if(response?.data){
        openPdfInNewTab(response?.data?.pdf_base64);
      }

      toast.success('Printed successfully');
    } catch (error) {
      const isErrorResponse = (error: unknown): error is ErrorResponse => {
        return typeof error === 'object' && error !== null && 'response' in error;
      };

      if (isErrorResponse(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Internal server error');
      }
    }
  }

  const handleReadyToDispatch = async ()=>{
    setDataLoading(true);
    try {
      await axios.post(`${PICKER_LIST_STATUS}/${order?.id}`)
      toast.success('Dispatched Successfully');
      setDataLoading(false);
      fetchOrdersToPicker(pickerListId);
      toggleModal();
    } catch (error) {
      setDataLoading(false);
      const isErrorResponse = (error: unknown): error is ErrorResponse => {
        return typeof error === 'object' && error !== null && 'response' in error;
      };

      if (isErrorResponse(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Internal server error');
      }
    }
  }

  return (
    <div className="min-w-full max-w-[100vw]">
      
            <Grid container spacing={2} className="pt-[10px]">
              <Grid item xs={12} sm={6} className="pt-[5px!important]">
                <h6 className="text-[12px] lg:text-[14px] text-primaryBlue font-600">
                  {t('ITEM_DETAILS')}
                </h6>
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                className="flex justify-end pt-[5px!important]"
              >
                <Button
                  className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
                  type="submit"
                  variant="contained"
                  size="medium"
                  disabled={seletedItems.length === 0}
                  startIcon={<PrintIcon />}
                  // onClick={handleOpenPopup}
                  onClick={handlePrintBagList}

                >
                  {t('PRINT_BAG_LIST')}
                  {isPrintBagDataLoading ? (
                      <CircularProgress
                          className="text-white ml-[5px]"
                          size={24}
                      />
                  ) : null}
                </Button>
              </Grid>

              <Grid item xs={12} className="pt-[10px!important]">
                {items.length > 0 && (
                  <MaterialTableWrapper
                    title=""
                    filterChanged={null}
                    handleColumnFilter={null}
                    tableColumns={tableColumn}
                    handleCommonSearchBar={null}
                    disableColumnFiltering
                    searchByText=""
                    disablePagination
                    exportToExcel={null}
                    handleRowDeleteAction={null}
                    externalAdd={null}
                    externalEdit={null}
                    externalView={null}
                    selection
                    disableSearch
                    isColumnChoser
                    records={items}
                    onSelectionChange={(rows: any[]) => {
                      rows.length > 0 && rows.map((row) => console.log(row.id));

                      if (rows.length > 0) {
                        const selectedItemsIds = rows.map((row) => row.id);
                        setSelectedItems(selectedItemsIds);
                      }
                      // setSelectedItems
                      // if (rows.length > 0) {
                      //   console.log("Selected Rows:", rows);
                      // } else {
                      //   console.log("No rows selected.");
                      // }
                    }}
                    // tableRowPrintHandler={handlePrintBoxLabel}
                  />
                )}
              </Grid>

              <Grid item xs={12} className="mb-[10px]">
                <hr />
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                className="flex items-center pt-[5px!important]"
              >
                <h6 className="text-[12px] lg:text-[14px] text-primaryBlue font-600">
                  {t('BOX_SIZE')}
                </h6>
              </Grid>

              {
                items && items.length > 0 && (
                  <BoxWeightForm items={items} handlePrintBoxLabel={handlePrintBoxLabelHandler}
                                 isInitialValues={isInitialValues} isPrintBoxLabelDataLoading={isPrintBoxLabelDataLoading}
                  />
                )
              }




              <Grid container spacing={2} />

              <Grid item xs={12} sm={6} className="pt-[5px!important]">
                <h6 className="text-[12px] lg:text-[14px] text-primaryBlue font-600">
                  {t('Order History Log')}
                </h6>
              </Grid>
              <Grid item xs={12} className="pt-[10px!important]">
                {/* <TextField
                  name="remarks"
                  fullWidth
                  multiline
                  rows={4}
                  placeholder="Placeholder"
                  variant="outlined"
                  label=""
                  {...formik.getFieldProps('remarks')}
                /> */}
              </Grid>

              <Grid
								item
								xs={12}
								className="pt-[10px!important]"
							>
								{order.logs && order.logs.length > 0 && (
									<OrdersLogTable tableData={order.logs} />
								)}
							</Grid>

              <Grid
                item
                md={12}
                sm={12}
                xs={12}
                className="flex justify-end items-center gap-[10px] pt-[15px!important]"
              >
                <Button
                  onClick={toggleModal}
                  className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
                >
                  Close
                </Button>
                <Button
                  disabled={order?.order_shipment_boxes?.length === 0}
                  className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
                  type="button"
                  onClick={()=>handleReadyToDispatch()}
                >
                  {t('READY_TO_DISPATCH')}
                  {isDataLoading ? (
                      <CircularProgress
                          className="text-white ml-[5px]"
                          size={24}
                      />
                  ) : null}
                </Button>
              </Grid>
            </Grid>
         

      {isPrintDialogOpen && (
        <PickerListPopUp
          isOpen={isPrintDialogOpen}
          toggleModal={togglePrintDialog}
          // clickedRowData={clickedRowData}
        />
      )}
    </div>
  );
}

export default PickListView;
