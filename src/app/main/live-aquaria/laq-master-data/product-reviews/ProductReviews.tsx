import HelpIcon from '@material-ui/icons/Help';
import {
  Autocomplete,
  Button,
  CircularProgress,
  TextField,
} from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Grid from '@mui/material/Grid';
import Switch from '@mui/material/Switch';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import {
  getAllProductItemReviews,
  updateProductItemReviews,
} from '../../../../axios/services/live-aquaria-services/master-data-services/MasterDataServices';
import FormDropdown from '../../../../common/FormComponents/FormDropdown';
import ProductReviewsDialogForm from './components/ProductReviewsDialogForm';
import {
  ItemDetails,
  ItemDetailsModifiedData,
  ItemDetailsType,
} from './product-reviews-types/ProductReviewsTypes';

import NavigationViewComp from '../../../../common/FormComponents/NavigationViewComp';
import MaterialTableWrapper from '../../../../common/tableComponents/MaterialTableWrapper';
import ProductReviewsFormActiveAlertForm from './product-reviews-types/ProductReviewsFormActiveAlertForm';
import useDebounce from 'app/shared-components/useDebounce';
import axios from 'axios';
import { CUSTOMER_REVIEWS } from 'src/app/axios/services/AdminServices';

interface FilterValues {
  product_code: string;
  product_name: string;
  category: string;
  status: string;
}

function ProductReviews() {
  const { t } = useTranslation('etfMasterData');
  const [pageNo, setPageNo] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(5);
  const [count, setCount] = useState(100);
  const [isTableLoading, setTableLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [tableRowData, setTableRowData] = useState({});
  const [isProductReviewsDataLoading, setETFMasterDataDataLoading] =
    useState(false);
  const [clickedRowData, setClickedRowData] = useState({});
  const [clickedActiveRowData, setClickedActiveRowData] = useState(
    {} as ItemDetailsModifiedData
  );
  const [isOpenProductReviewsModal, setOpenViewProductReviewsModal] =
    useState(false);
  const [
    isOpenActiveProductReviewsFormModal,
    setOpenActiveProductReviewsFormModal,
  ] = useState(false);

  const toggleViewETFMasterDataModal = () => {
    setOpenViewProductReviewsModal(!isOpenProductReviewsModal);
  };
  const [filteredValues, setFilteredValues] = useState<FilterValues>({
    product_code: null,
    product_name: null,
    category: null,
    status: null,
  });
  const debouncedFilter = useDebounce<any>(filteredValues, 1000);

  const navigate = useNavigate();

  const toggleActiveProductReviewsFormModal = () =>
    setOpenActiveProductReviewsFormModal(!isOpenActiveProductReviewsFormModal);

  useEffect(() => {
    productItemReviews(filteredValues);
  }, [pageNo, pageSize]);

  useEffect(() => {
    if (debouncedFilter) productItemReviews(filteredValues);
  }, [debouncedFilter]);

  const tableColumns = [
    {
      title: 'Code / Customer Name',
      field: 'customer_name_code',
    },
    {
      title: t('PRODUCT_NAME'),
      field: 'title',
    },
    {
      title: t('PRODUCT_ID'),
      field: 'item_id',
    },
    {
      title: 'Created Date & Time',
      field: 'createDate',
    },
    {
      title: t('APPROVED_STATUS'),
      field: 'approvedStatus',
      // render: (rowData: ItemDetailsModifiedData, index) => (
      //   <Tooltip title="Assigned ss " arrow>
      //     <span style={{ display: "flex", alignItems: "center" }}>
      //       {rowData.approvedStatus}
      //       <HelpIcon color="primary" style={{ marginLeft: "4px" }} />
      //     </span>
      //   </Tooltip>
      // ),
    },
    {
      title: t('ACTIVE'),
      field: 'active',
      render: (rowData: ItemDetailsModifiedData, index) => (
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={rowData.active}
                onChange={handleSwitchChange(rowData.id, rowData)}
                aria-label='login switch'
                size='small'
                sx={{
                  '& .muiltr-kpgjex-MuiButtonBase-root-MuiSwitch-switchBase.Mui-checked+.MuiSwitch-track':
                    {
                      backgroundColor: '#387ed4',
                    },
                }}
              />
            }
            label=''
          />
        </FormGroup>
      ),
    },
  ];

  const productItemReviews = async (filteredValues?: FilterValues) => {
    try {
      const response = await axios.get(
        `${CUSTOMER_REVIEWS}?filter=item.code,${filteredValues.product_code ? filteredValues.product_code : null}|item.title,${filteredValues.product_name ? filteredValues.product_name : null}|item.itemCategory.name,${filteredValues.category ? filteredValues.category : null}|status,${filteredValues.status ? filteredValues.status : null}&limit=${pageSize}&page=${pageNo + 1}`
      );
      setCount(response.data.meta.total);
      const data1: ItemDetails[] = response.data.data;
      const modifiedData: ItemDetailsModifiedData[] = data1.map(
        (item: ItemDetails) => ({
          ...item,
          customer_name_code:
            item?.customer_details?.code +
            ' / ' +
            item?.customer_details?.first_name +
            ' ' +
            item?.customer_details?.last_name,
          customer_id: item.customer_id,
          title: item.item_details.title,
          item_id: item.item_details.code,
          createDate: item.created_at,
          // approvedStatus: 'Pending',
          approvedStatus: item.status === 0 ? 'Pending' : 'Approved',
          active: item.is_active === 1,
        })
      );
      setTableData(modifiedData);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePageChange = (page: number) => {
    setPageNo(page);
  };

  const handlePageSizeChange = (pageSize: number) => {
    setPageSize(pageSize);
  };

  // Switch

  const handleSwitchChange =
    (index, rowData: ItemDetailsModifiedData) => async (event) => {
      setClickedActiveRowData(rowData);
      toggleActiveProductReviewsFormModal();
    };

  const schema = yup.object().shape({});

  const onSubmit = (values) => {
    console.log('values', values);
  };

  const handleAllReviewsClick = () => {
    navigate('/laq-master-data/all-product-reviews'); // Navigate to AllProductReviews page
  };

  const handleClearForm = (resetForm) => {};

  const tableRowViewHandler = (rowData: ItemDetailsModifiedData) => {
    setClickedRowData(rowData);
    toggleViewETFMasterDataModal();
  };

  const handleActiveAlertForm = async () => {
    const reasonId: string = clickedActiveRowData.id
      ? clickedActiveRowData.id
      : '';
    setTableLoading(true);
    const requestData = {
      is_active: clickedActiveRowData.active === true ? 0 : 1,
    };

    try {
      const response = await updateProductItemReviews(requestData, reasonId);
      setTableLoading(false);
      toggleActiveProductReviewsFormModal();
      productItemReviews(filteredValues);
      toast.success(
        clickedActiveRowData.is_active
          ? 'Inactivated Successfully'
          : 'Activated Successfully'
      );
      productItemReviews(filteredValues);
    } catch (error) {
      setTableLoading(false);
      toggleActiveProductReviewsFormModal();
      toast.error('fail');
    }
  };

  const handleUpdateSuccess = (updatedData: ItemDetailsModifiedData) => {
    setTableData((prevData) =>
      prevData.map((item) => (item.id === updatedData.id ? updatedData : item))
    );
  };

  const StatusOptions = [
    { value: '0', label: 'Pending' },
    { value: '1', label: 'Approved' },
  ];

  const clearFilterHandler = () => {
    const resetFilters: FilterValues = {
      product_code: '',
      product_name: '',
      category: '',
      status: '',
    };
    setFilteredValues(resetFilters);
    //   fetchOrderReviews(resetFilters);
  };

  return (
    <div className='min-w-full max-w-[100vw]'>
      <NavigationViewComp title='Product Reviews' />
      {/* <div className="flex justify-end mr-8 mb-6"> */}
      {/* <Grid container spacing={2} className='pt-[10px] pr-[30px] mx-auto flex'>
        <Grid item xs={12} sm={6} md={6} lg={3} xl={10} className='!pt-[5px]'>
          <Button
            className='min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80 mb-4'
            type='button'
            size='medium'
            onClick={handleAllReviewsClick} // Trigger navigation
            variant='contained'
          >
            {t('ALL_REVIEWS')}
          </Button>
        </Grid>
      </Grid> */}

      <Grid container spacing={2} className='pt-[10px] pr-[30px] mx-auto'>
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={4}
          xl={2}
          className='formikFormField pt-[5px!important]'
        >
          <Typography className='formTypography'>Product Code</Typography>
          <TextField
            id='outlined-basic'
            label=''
            variant='outlined'
            size='small'
            className='w-full'
            value={filteredValues.product_code}
            onChange={(event) => {
              setFilteredValues({
                ...filteredValues,
                product_code: event.target.value,
              });
            }}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={4}
          xl={2}
          className='formikFormField pt-[5px!important]'
        >
          <Typography className='formTypography'>Product Name</Typography>
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
          lg={4}
          xl={2}
          className='formikFormField pt-[5px!important]'
        >
          <Typography className='formTypography'>Category</Typography>
          <TextField
            id='outlined-basic'
            label=''
            variant='outlined'
            size='small'
            className='w-full'
            value={filteredValues.category}
            onChange={(event) => {
              setFilteredValues({
                ...filteredValues,
                category: event.target.value,
              });
            }}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={4}
          xl={2}
          className='formikFormField pt-[5px!important]'
        >
          <Typography className='formTypography'>Approved Status</Typography>
          <Autocomplete
            size='small'
            disablePortal
            options={StatusOptions}
            className='w-full'
            value={
              StatusOptions.find(
                (option) => option.value === filteredValues.status
              ) || null
            } // Ensure reset on clear
            renderInput={(params) => <TextField {...params} label='' />}
            onChange={(event, value) => {
              setFilteredValues({
                ...filteredValues,
                status: value?.value.toString() || '',
              });
            }}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          md={8}
          lg={8}
          xl={4}
          className='formikFormField flex justify-end md:justify-start pt-[10px!important] sm:!pt-[26px]'
        >
          <Button
            className='flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80'
            type='button'
            variant='contained'
            size='medium'
            disabled={false}
            onClick={clearFilterHandler}
          >
            {t('CLEAR_FILTERS')}
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
            records={tableData}
            tableRowViewHandler={tableRowViewHandler}
          />
        </Grid>
      </Grid>

      {isOpenProductReviewsModal && (
        <ProductReviewsDialogForm
          isOpen={isOpenProductReviewsModal}
          toggleModal={() => {
            productItemReviews(filteredValues);
            toggleViewETFMasterDataModal();
          }}
          clickedRowData={clickedRowData}
          compType='view'
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}

      {isOpenActiveProductReviewsFormModal && (
        <ProductReviewsFormActiveAlertForm
          isOpen={isOpenActiveProductReviewsFormModal}
          toggleModal={toggleActiveProductReviewsFormModal}
          clickedRowData={clickedActiveRowData}
          handleAlertForm={handleActiveAlertForm}
        />
      )}
    </div>
  );
}

export default ProductReviews;
