import { Button, Grid, Typography, CircularProgress } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Form, Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { ORDER_CLAIMS } from 'src/app/axios/services/AdminServices';
import MaterialTableWrapper from '../../../../common/tableComponents/MaterialTableWrapper';
import FormDropdown from '../../../../common/FormComponents/FormDropdown';
import NavigationViewComp from '../../../../common/FormComponents/NavigationViewComp';
import TextFormDateField from '../../../../common/FormComponents/TextFormDateField';
import HotlineOrderStatusModal from './HotlineOrderStatusModal';

function HotlineOrderStatus() {
  const { t } = useTranslation('hotlineOrderStatus');
  const [pageNo, setPageNo] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(5);
  const [count, setCount] = useState(100);
  const [isOpenNewMethod, setOpenNewMethodModal] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderClaims, setOrderClaims] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchCustomerClaims();
  }, []);

  const fetchCustomerClaims = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${ORDER_CLAIMS}?pageNo=${pageNo}&pageSize=${pageSize}`
      );
      setOrderClaims(response.data.data);
      setCount(response.data.meta.total);
    } catch (error) {
      //error
    } finally {
      setLoading(false);
    }
  };

  const toggleNewAdvertisementModal = () =>
    setOpenNewMethodModal(!isOpenNewMethod);

  const handleOpenNewMethodModal = () => {
    console.log('handleOpenNewMethodModal button clicked');
  };

  const handleFilterAll = (values) => {
    console.log('Form Values:', values);
    // You can add more logic here to handle the filtered values, e.g., sending them to an API or filtering data on the frontend
  };

  const handleViewIconClick = (rowData) => {
    setSelectedRowData(rowData);
    toggleNewAdvertisementModal();
    setIsModalOpen(true);
  };

  const tableColumns = [
    // {
    //   title: t('CLAIM_ID'),
    //   field: 'code',
    //   cellStyle: {
    //     padding: '4px 8px',
    //   },
    // },
    {
      title: t('ORDER_ID'),
      field: 'orderId',
      cellStyle: {
        padding: '4px 8px',
      },

      render: (rowData) => <p>{rowData?.order?.order_no}</p>,
    },
    {
      title: t('CUSTOMER_NAME'),
      field: 'customerName',
      cellStyle: {
        padding: '4px 8px',
      },
      render: (rowData) => (
        <p>
          {`${rowData?.order?.customer_details?.first_name} ${rowData?.order?.customer_details?.last_name}`}
        </p>
      ),
    },
    {
      title: t('EMAIL'),
      field: 'email',
      cellStyle: {
        padding: '4px 8px',
      },
    },
    {
      title: t('DATE'),
      field: 'created_at',
      cellStyle: {
        padding: '4px 8px',
      },
    },
    {
      title: t('ELAPSED_DAYS'),
      field: 'elapsed_days',
      cellStyle: {
        padding: '4px 8px',
      },
    },
    {
      title: t('ORDER_VALUE'),
      field: 'order_value',
      cellStyle: {
        padding: '4px 8px',
      },
    },
    {
      title: t('STATUS'),
      field: 'status',
      cellStyle: {
        padding: '4px 8px',
      },
    },
  ];

  const category = [
    { value: '1', label: 'Product 01' },
    { value: '2', label: 'Product 02' },
    { value: '3', label: 'Product 03' },
  ];

  const customerOptions = [
    { value: '1', label: 'John Doe' },
    { value: '2', label: 'Jane Smith' },
    { value: '3', label: 'Alice Johnson' },
  ];

  const statusOptions = [
    { value: '1', label: 'Active' },
    { value: '2', label: 'Inactive' },
  ];

  const tableRowViewHandler = (rowData) => {
    // Logic for viewing a row
  };

  const tableRowPrintHandler = (rowData) => {
    // Logic for editing a row
  };

  const handleSubmitCustomerDeleteForm = (rowData) => {
    // Logic for deleting
  };

  const handlePageChange = (page: number) => {
    setPageNo(page);
  };

  const handlePageSizeChange = (pageSize: number) => {
    setPageSize(pageSize);
  };

  return loading ? (
    <div className='flex justify-center items-center relative w-full h-[calc(100vh-64px)] z-[10000] bg-white/95'>
      <CircularProgress className='text-primaryBlue' />
    </div>
  ) : (
    <div className='min-w-full max-w-[100vw]'>
      <NavigationViewComp title='Customer Service / Hotline Order Status' />

      <Formik
        initialValues={{
          shippingType: '',
          category: '',
          status: '',
          transitDays: '',
        }}
        validationSchema={null}
        onSubmit={handleFilterAll} // Add the handleFilterAll function as the onSubmit handler
      >
        {({ values }) => (
          <Form>
            <Grid container spacing={2} className='pt-[10px] pr-[30px] mx-auto'>
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={2}
                className='pt-[5px!important]'
              >
                <Typography className='formTypography'>
                  {t('BY_DATE')}
                </Typography>
                <TextFormDateField
                  name='by_date'
                  type='date'
                  id='by_date'
                  max={new Date().toISOString().split('T')[0]}
                  disablePastDate
                  changeInput={(value: string) => {
                    setFieldValue('by_date', value).then((r) => r);
                  }}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={2}
                className='pt-[5px!important]'
              >
                <Typography className='formTypography'>
                  {t('PRODUCT')}
                </Typography>
                <FormDropdown
                  name='product'
                  id='product'
                  placeholder=''
                  optionsValues={category}
                  disabled={false}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={2}
                className='pt-[5px!important]'
              >
                <Typography className='formTypography'>
                  {t('LOCATION')}
                </Typography>
                <FormDropdown
                  name='location'
                  id='location'
                  placeholder=''
                  optionsValues={customerOptions}
                  disabled={false}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={2}
                className='pt-[5px!important]'
              >
                <Typography className='formTypography'>
                  {t('CUSTOMER')}
                </Typography>
                <FormDropdown
                  name='customer'
                  id='customer'
                  placeholder=''
                  optionsValues={customerOptions}
                  disabled={false}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={2}
                className='pt-[5px!important]'
              >
                <Typography className='formTypography'>
                  {t('STATUS')}
                </Typography>
                <FormDropdown
                  name='status'
                  id='status'
                  placeholder=''
                  optionsValues={statusOptions}
                  disabled={false}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={2}
                className='flex items-start gap-[10px] formikFormField pt-[26px!important]'
              >
                <Button
                  className='flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80'
                  type='submit'
                  variant='contained'
                  size='medium'
                  disabled={false}
                >
                  {t('CLEAR_ALL')}
                </Button>
                <Button
                  className='flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80'
                  type='button'
                  variant='contained'
                  size='medium'
                  disabled={false}
                  onClick={handleOpenNewMethodModal}
                >
                  {t('FILTER_ALL')}
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>

      <Grid container spacing={2} className='pt-[20px] pr-[30px] mx-auto'>
        <Grid item md={12} sm={12} xs={12} className='pt-[5px!important]'>
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
            // loading={isTableLoading}
            count={count}
            exportToExcel={null}
            handleRowDeleteAction={null}
            externalAdd={null}
            externalEdit={null}
            externalView={null}
            selection={false}
            selectionExport={null}
            disableSearch
            isColumnChoser
            records={orderClaims}
            tableRowViewHandler={handleViewIconClick}
            tableRowPrintHandler={tableRowPrintHandler}
          />
        </Grid>
      </Grid>
      {isOpenNewMethod && (
        <HotlineOrderStatusModal
          isOpen={isOpenNewMethod}
          toggleModal={toggleNewAdvertisementModal}
          selectedId={selectedRowData ? selectedRowData.id : null}
          // handleClose={setOpenNewMethodModal}
        />
      )}
    </div>
  );
}

export default HotlineOrderStatus;
