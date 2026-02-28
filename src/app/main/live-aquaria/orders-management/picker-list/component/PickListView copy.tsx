/* eslint-disable prettier/prettier */
import PrintIcon from '@mui/icons-material/Print';
import {
  Button,
  Grid,
  TextField,
} from '@mui/material';
import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { POST_PICKERLIST_PRINT_BAG } from 'src/app/axios/services/AdminServices';
import { z } from 'zod';
import MaterialTableWrapper from '../../../../../common/tableComponents/MaterialTableWrapper';
import PickerListPopUp from './PickerListPopUp';
import { OrderData, OrderShipmentItem } from './PickerCustomTabPanel';
import BoxWeightForm from './BoxWeightForm';

interface Props {
  toggleModal: () => void;
  order: OrderData;
}


// Define Zod Schema
const rowSchema = z.object({
  boxWeight: z
    .string()
    .min(1, 'Box weight is required')
    .regex(/^\d+(\.\d+)?$/, 'Must be a number'),
  itemCodes: z
    .array(z.string().min(1, 'Item code is required'))
    .nonempty('At least one item code is required'),
});



function PickListView({ toggleModal, order }: Props) {
  const { t } = useTranslation('pickerList');

  const [isPrintDialogOpen, setPrintDialogOpen] = useState(false);
  const togglePrintDialog = () => setPrintDialogOpen(!isPrintDialogOpen);
  const [items, setItems] = useState<any>([]);
  const [seletedItems, setSelectedItems] = useState<any>([]);
  // const [itemsForDrowpdown, setItemsForDrowpdown] = useState<any>([]);

  useEffect(() => {
    const itemData =
      order.order_shipment_items &&
      order.order_shipment_items.length > 0 &&
      order.order_shipment_items.map((item: OrderShipmentItem) => {
        return {
          id: item.id,
          value: item.id,
          label: item.item.title,
          productId: item.item.id,
          productCode: item.item.code,
          productName: item.item.title,
          quantity: item.quantity,
          status: item.item.status,
          customerRemark: item.remark,
          adminRemark: item.item.special_message,
          unitPrice: item.unit_price,
          totalPrice: item.sub_total,
        };
      });
    setItems(itemData);
  }, [order]);

  const tableColumn = [
    {
      title: t('CIS_CODE'),
      field: 'productId',
    },
    {
      title: t('PRODUCT_NAME'),
      field: 'productName',
    },
    {
      title: t('QUANTITY'),
      field: 'quantity',
    },
    {
      title: t('AVAILABLE_QTY'),
      field: 'availableQuantity',
    },
    {
      title: t('BAG_AND_CUPS'),
      field: 'size',
    },
    {
      title: t('PACKING_MATERIALS'),
      field: 'wareHouse',
    },
    { title: t('STATUS'), field: 'status' },
    {
      title: t('CUSTOMER_REMARK'),
      field: 'customerRemark',
    },
    {
      title: t('ADMIN_REMARK'),
      field: 'adminRemark',
    },
    {
      title: t('UNIT_PRICE'),
      field: 'unitPrice',
    },
    {
      title: t('TOTAL_PRICE'),
      field: 'totalPrice',
    },
  ];

  const tableColumns = [
    { title: t('DATE'), field: 'date' },
    {
      title: t('ACTION_TAKEN'),
      field: 'actionTaken',
    },
    {
      title: t('TAKEN_BY'),
      field: 'takenBy',
    },
    {
      title: t('DELIVERY_DATE'),
      field: 'deliverDate',
    },
    { title: t('STATUS'), field: 'status' },
    { title: t('REMARK'), field: 'remark' },
  ];

  const tableData = [
    {
      date: '2021-08-01',
      actionTaken: 'Action 1',
      takenBy: 'John Doe',
      deliverDate: '2021-08-01',
      status: 'Pending',
      remark: 'This is a remark',
    },
    {
      date: '2021-08-02',
      actionTaken: 'Action 2',
      takenBy: 'Jane Doe',
      deliverDate: '2021-08-02',
      status: 'Pending',
      remark: 'This is a remark',
    },
    {
      date: '2021-08-03',
      actionTaken: 'Action 3',
      takenBy: 'John Doe',
      deliverDate: '2021-08-03',
      status: 'Pending',
      remark: 'This is a remark',
    },
  ];



  const handlePrintBagList = () => {
    try {
      const response = axios.post(POST_PICKERLIST_PRINT_BAG, {
        shipment_item: seletedItems,
      });

      console.log(response);
    } catch (error) {
      // error management
    }
  };


  const onSubmit = (data: FormData) => {
    console.log('Form Data:', data);
    alert('Form Submitted Successfully!');
  };

  return (
    <div className="min-w-full max-w-[100vw]">
      <Formik
        initialValues={{
          remarks: '',
          date: '',
          orderStatus: '',
          notify_customer: false,
          cancel_order_reason: '',
        }}
        onSubmit={(values:any) => {
          console.log(values);
        }}
      >
        {(formik) => (
          <Form>
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
                  disabled={false}
                  startIcon={<PrintIcon />}
                  // onClick={handleOpenPopup}
                  onClick={handlePrintBagList}
                >
                  {t('PRINT_BAG_LIST')}
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
                      console.log(rows);
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
                    // tableRowPrintHandler={tableRowPrintHandler}
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
              {/* <BoxWeightForm items={items} /> */}




                





              <Grid container spacing={2}>
                
                {/* <Grid item xs={12} md={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setBoxWeightQty(boxWeightQty + 1)}
                  >
                    +
                  </Button>
                </Grid> */}
            
            
                       
                {/* <Grid item xs={12} md={6}>
                  <TextField
                    id="outlined-basic"
                    label="Outlined"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Autocomplete
                    disablePortal
                    id="demo-multiple-chip"
                    multiple
                    options={[
                      { value: "John", label: "John" },
                      { value: "Jane2", label: "Jane2" },
                    ]}
                    className="w-full"
                    size="small"
                    renderInput={(params) => (
                      <TextField {...params} label="Items" />
                    )}
                    // onChange={(event: any, newValue: LOVType | null) => {
                    // 	setUserValue(newValue);
                    // }}
                    // onInput={onInputUserHandler}
                  />
                </Grid> */}
              
              </Grid>
              {/* <Grid
                item
                xs={12}
                sm={6}
                className="flex justify-end items-center pt-[5px!important] gap-[16px]"
              >
                <Typography className="formTypography">
                  {t("BOX_SIZE")}
                </Typography>
                <Field
                  disabled={false}
                  name="box_weight"
                  placeholder={t("")}
                  component={TextFormField}
                  size="small"
                />
                <Button
                  className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
                  type="submit"
                  variant="contained"
                  size="medium"
                  disabled={false}
                  startIcon={<PrintIcon />}
                  // onClick={handleOpenPopup}
                >
                  {t("PRINT_PICK_LIST")}
                </Button>
              </Grid> */}

              <Grid item xs={12} className="pt-[10px!important]">
                <TextField
                  name="remarks"
                  fullWidth
                  multiline
                  rows={4}
                  placeholder="Placeholder"
                  variant="outlined"
                  label=""
                  {...formik.getFieldProps('remarks')}
                />
              </Grid>

              <Grid item xs={12} className="pt-[10px!important]">
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
                  records={tableData}
                />
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
                  className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
                  type="submit"
                >
                  {t('READY_TO_DISPATCH')}
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>

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
