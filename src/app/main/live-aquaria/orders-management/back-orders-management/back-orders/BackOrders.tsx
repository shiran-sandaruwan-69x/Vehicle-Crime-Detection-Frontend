import { Button, Grid, TextField } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios, { AxiosResponse } from 'axios';
import { FETCH_BACK_ORDERS } from 'src/app/axios/services/AdminServices';
import useDebounce from 'app/shared-components/useDebounce';
import moment from 'moment';
import ExtendedAxiosError from 'src/app/types/ExtendedAxiosError';
import { toast } from 'react-toastify';
import { useAppSelector } from 'app/store/hooks';
import { selectUser } from 'src/app/auth/user/store/userSlice';
import { UserPermissions } from 'src/app/types/PermissionsInterfaces';
import NavigationViewComp from '../../../../../common/FormComponents/NavigationViewComp';
import MaterialTableWrapper from '../../../../../common/tableComponents/MaterialTableWrapper';
import BackOrdersModel from './BackOrdersModel';
import {
  BackOrderDetailsInterface,
  BackOrdersResponseInterface,
} from './interfaces';

interface FilterValues {
  start_date: string;
  end_date: string;
  code: string;
  first_name: string;
  last_name: string;
  product_name: string;
}

function BackOrders() {
  const { t } = useTranslation('backOrders');

  const [pageNo, setPageNo] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [count, setCount] = useState(100);
  const [isTableLoading] = useState(false);
  const [isOpenNewAdvertisement, setOpenNewAdvertisementModal] =
    useState(false);
  const [orders, setOrders] = useState<BackOrderDetailsInterface[]>([]);
  const [seletedRow, setSelectedRow] =
    useState<BackOrderDetailsInterface>(null);
  const [filteredValues, setFilteredValues] = useState<FilterValues>({
    start_date: null,
    end_date: null,
    code: null,
    first_name: null,
    last_name: null,
    product_name: null,
  });
  const debouncedFilter = useDebounce<FilterValues>(filteredValues, 1000);

  const user = useAppSelector(selectUser);
  const PermissionMain: string = 'Order Management';
  const permissionSub = 'back-orders';
  const userPermissions =
    (user.permissions as UserPermissions)?.[PermissionMain]?.[permissionSub] ||
    null;
  const permissionsToShow =
    userPermissions?.find((permission) => permission.name === 'show') || null;
  // const permissionsToStore = userPermissions?.find((permission) => permission.name === 'store') || null;
  // const permissionsToUpdate = userPermissions?.find((permission) => permission.name === 'update') || null;
  // const permissionsToDelete = userPermissions?.find((permission) => permission.name === 'destroy') || null;

  useEffect(() => {
    fetchOrders(filteredValues);
  }, [pageNo, pageSize]);

  useEffect(() => {
    if (debouncedFilter) fetchOrders(filteredValues);
  }, [debouncedFilter]);

  const fetchOrders = async (filteredValues: FilterValues) => {
    try {
      const response: AxiosResponse<BackOrdersResponseInterface> =
        await axios.get(
          `${FETCH_BACK_ORDERS}?filter=order.customer.last_name,${filteredValues.last_name ? filteredValues.last_name : null}|order.customer.first_name,${filteredValues.first_name ? filteredValues.first_name : null}|order.customer.number,${filteredValues.code ? filteredValues.code : null}|orderShipmentItems.itemSelectionType.itemSelection.item.common_name,${filteredValues.product_name ? filteredValues.product_name : null}|start_date,${filteredValues.start_date ? filteredValues.start_date : null}|end_date,${filteredValues.end_date ? filteredValues.end_date : null}&limit=${pageSize}&page=${pageNo + 1}`
        );
      const data = response.data.data.map(
        (item: BackOrderDetailsInterface) => ({
          ...item,
          code: item?.order_code,
          customer_name: `${item?.order?.customer_details?.first_name} ${item?.order?.customer_details?.first_name}`,
          email: item?.order?.customer_details?.email,
          date: item?.created_at,
          total_amount: item?.total_price,
          status: item?.order_status,
          elapsedTime: item?.elapsed_date,
        })
      );
      setOrders(data);
      setCount(response.data.meta.total);
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

  const toggleNewAdvertisementModal = () =>
    setOpenNewAdvertisementModal(!isOpenNewAdvertisement);

  const handlePageChange = (page: number) => {
    setPageNo(page);
  };

  const handlePageSizeChange = (pageSize: number) => {
    setPageSize(pageSize);
  };

  const tableRowViewHandler = (rowData: BackOrderDetailsInterface) => {
    setSelectedRow(rowData);
    toggleNewAdvertisementModal();
  };

  const handlePrintRow = async (rowData: BackOrderDetailsInterface) => {
    try {
      const response: AxiosResponse<{ base64: string }> = await axios.get(
        `${FETCH_BACK_ORDERS}/${rowData.id}/print`
      );

      if (response.data) {
        openPdfInNewTab(response.data.base64);
      }
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

  const openPdfInNewTab = (pdfBase64: string) => {
    const byteCharacters = atob(pdfBase64);
    const byteNumbers = new Array(byteCharacters.length)
      .fill(null)
      .map((_, i) => byteCharacters.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });

    const pdfUrl = URL.createObjectURL(blob);
    window.open(pdfUrl, '_blank');
  };

  const tableColumns = [
    {
      title: 'Back Order No',
      field: 'code',
    },
    {
      title: t('CUSTOMER_NAME'),
      field: 'customer_name',
    },
    {
      title: t('EMAIL'),
      field: 'email',
    },
    {
      title: t('DATE'),
      field: 'date',
      render: (rowData: BackOrderDetailsInterface) => (
        <span>{moment(rowData.date).format('YYYY-MM-DD')}</span>
      ),
    },
    {
      title: t('ELAPSED_TIME'),
      field: 'elapsedTime',
    },
    {
      title: t('TOTAL_AMOUNT'),
      field: 'total_amount',
      align: 'right',
      render: (rowData: BackOrderDetailsInterface) => (
        <span className='text-right'>
          {`$ ${new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
            .format(Number(rowData.total_amount))
            .replace(/,/g, ' ')}`}
        </span>
      ),
    },
    {
      title: t('STATUS'),
      field: 'status',
      render: (rowData: BackOrderDetailsInterface) => (
        <span className={rowData?.status ? 'text-[#4DCD3C]' : 'text-[#FF0000]'}>
          {rowData.status ? t('ACTIVE') : t('INACTIVE')}
        </span>
      ),
    },
  ];

  const clearFilterHandler = () => {
    const resetFilters: FilterValues = {
      start_date: '',
      end_date: '',
      code: '',
      first_name: '',
      last_name: '',
      product_name: '',
    };
    setFilteredValues(resetFilters);
  };

  return (
    <div className='min-w-full max-w-[100vw]'>
      <NavigationViewComp title='Order Review / Back Orders' />

      <Grid container spacing={2} className='pt-[10px] pr-[30px] mx-auto'>
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={2}
          className='formikFormField pt-[5px!important]'
        >
          <Typography className='formTypography'>
            Order By Date/ From
          </Typography>
          <TextField
            type='date'
            id='outlined-basic'
            label=''
            variant='outlined'
            size='small'
            className='w-full'
            value={filteredValues.start_date}
            onChange={(event) => {
              setFilteredValues({
                ...filteredValues,
                start_date: event.target.value,
              });
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
          className='formikFormField pt-[5px!important]'
        >
          <Typography className='formTypography'>Order By Date/ To</Typography>
          <TextField
            type='date'
            id='outlined-basic'
            label=''
            variant='outlined'
            size='small'
            className='w-full'
            value={filteredValues.end_date}
            onChange={(event) => {
              setFilteredValues({
                ...filteredValues,
                end_date: event.target.value,
              });
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
          className='formikFormField pt-[5px!important]'
        >
          <Typography className='formTypography'>Product</Typography>
          <TextField
            id='outlined-basic'
            label=''
            variant='outlined'
            size='small'
            className='w-full'
            value={filteredValues.product_name}
            onChange={(event) => {
              setFilteredValues({
                ...filteredValues,
                product_name: event.target.value,
              });
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
          className='formikFormField pt-[5px!important]'
        >
          <Typography className='formTypography'>Customer Code</Typography>
          <TextField
            id='outlined-basic'
            label=''
            variant='outlined'
            size='small'
            className='w-full'
            value={filteredValues.code}
            onChange={(event) => {
              setFilteredValues({
                ...filteredValues,
                code: event.target.value,
              });
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
          className='formikFormField pt-[5px!important]'
        >
          <Typography className='formTypography'>
            Customer First Name
          </Typography>
          <TextField
            id='outlined-basic'
            label=''
            variant='outlined'
            size='small'
            className='w-full'
            value={filteredValues.first_name}
            onChange={(event) => {
              setFilteredValues({
                ...filteredValues,
                first_name: event.target.value,
              });
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
          className='formikFormField pt-[5px!important]'
        >
          <Typography className='formTypography'>Customer Last Name</Typography>
          <TextField
            id='outlined-basic'
            label=''
            variant='outlined'
            size='small'
            className='w-full'
            value={filteredValues.last_name}
            onChange={(event) => {
              setFilteredValues({
                ...filteredValues,
                last_name: event.target.value,
              });
            }}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          className='flex justify-end xl:justify-end items-end gap-[10px] pt-[10px!important]'
        >
          <Button
            className='flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80'
            type='button'
            variant='contained'
            size='medium'
            disabled={false}
            onClick={clearFilterHandler}
          >
            Clear All Filters
          </Button>
        </Grid>
      </Grid>

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
            loading={isTableLoading}
            count={count}
            exportToExcel={null}
            handleRowDeleteAction={null}
            externalAdd={null}
            externalEdit={null}
            externalView={null}
            selection={false}
            selectionExport={null}
            isColumnChoser
            records={orders}
            tableRowViewHandler={
              permissionsToShow && permissionsToShow.action
                ? tableRowViewHandler
                : null
            }
            tableRowPrintHandler={handlePrintRow}
            disableSearch
          />
        </Grid>
      </Grid>

      {isOpenNewAdvertisement && seletedRow.id && (
        <BackOrdersModel
          isOpen={isOpenNewAdvertisement}
          toggleModal={toggleNewAdvertisementModal}
          id={seletedRow.id}
        />
      )}
    </div>
  );
}

export default BackOrders;
