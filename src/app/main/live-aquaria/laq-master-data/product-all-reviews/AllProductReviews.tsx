import Grid from '@mui/material/Grid';
import { Form, Formik } from 'formik';
import Typography from '@mui/material/Typography';
import {
  Autocomplete,
  Button,
  CircularProgress,
  Rating,
  TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import FormDropdown from '../../../../common/FormComponents/FormDropdown';
import AllProductReviewsDialogForm from './components/AllProductReviewsDialogForm';
import { getItemWiseReviews } from '../../../../axios/services/live-aquaria-services/master-data-services/MasterDataServices';
import {
  ItemDetails,
  ItemDetailsModifiedData,
  ItemDetailsType,
} from './all-review-types/AllProductReviewsTypes';
import useDebounce from 'app/shared-components/useDebounce';
import MaterialTableWrapper from '../../../../common/tableComponents/MaterialTableWrapper';
import NavigationViewComp from '../../../../common/FormComponents/NavigationViewComp';
import axios from 'axios';
import { ALL_REVIEWS } from 'src/app/axios/services/AdminServices';

interface FilterValues {
  product_code: string;
  product_name: string;
  category: string;
  product_rating: string;
  delivery_rating: string;
}

function AllProductReviews() {
  const { t } = useTranslation('etfMasterData');
  const [pageNo, setPageNo] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(15);
  const [count, setCount] = useState(100);
  const [isTableLoading, setTableLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [isETFMasterDataDataLoading, setETFMasterDataDataLoading] =
    useState(false);
  const [clickedRowData, setClickedRowData] = useState({});
  const [isOpenProductReviewsModal, setOpenViewProductReviewsModal] =
    useState(false);
  const [
    isOpenActiveProductReviewsFormModal,
    setOpenActiveProductReviewsFormModal,
  ] = useState(false);
  const toggleViewETFMasterDataModal = () =>
    setOpenViewProductReviewsModal(!isOpenProductReviewsModal);

  const [filteredValues, setFilteredValues] = useState<FilterValues>({
    product_code: null,
    product_name: null,
    category: null,
    product_rating: null,
    delivery_rating: null,
  });
  const debouncedFilter = useDebounce<any>(filteredValues, 1000);

  const toggleActiveProductReviewsFormModal = () =>
    setOpenActiveProductReviewsFormModal(!isOpenActiveProductReviewsFormModal);

  useEffect(() => {
    allProductItemReviews(filteredValues);
  }, [pageNo, pageSize]);

  useEffect(() => {
    if (debouncedFilter) allProductItemReviews(filteredValues);
  }, [debouncedFilter]);

  const tableColumns = [
    {
      title: t('PRODUCT_ID'),
      field: 'productCode',
    },
    {
      title: t('PRODUCT_NAME'),
      field: 'productName',
    },
    {
      title: t('CUSTOMER_PRODUCT_RATING'),
      field: 'productRating',
    },
    {
      title: t('DELIVERY_RATING'),
      field: 'deliveryRating',
    },
  ];

  const allProductItemReviews = async (filteredValues: FilterValues) => {
    try {
      const response = await axios.get(
        `${ALL_REVIEWS}?filter=code,${filteredValues.product_code ? filteredValues.product_code : null}|title,${filteredValues.product_name ? filteredValues.product_name : null}|itemCategory.name,${filteredValues.category ? filteredValues.category : null}|customerReviews.product_rating,${filteredValues.product_rating ? filteredValues.product_rating : null}|customerReviews.delivery_rating,${filteredValues.delivery_rating ? filteredValues.delivery_rating : null}&page=${pageNo + 1}&limit=${pageSize}`
      );
      setCount(response.data.meta.total);
      const data1: ItemDetails[] = response.data.data;
      const modifiedData: ItemDetailsModifiedData[] = data1.map(
        (item: ItemDetails) => ({
          ...item,
          productCode: item.code,
          productName: item.title,
          productRating: (
            <Rating
              name='productRating'
              value={item.average_product_rating}
              readOnly
            />
          ),
          deliveryRating: (
            <Rating
              name='deliveryRating'
              value={item.average_delivery_rating}
              readOnly
            />
          ),
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

  const tableRowViewHandler = (rowData: ItemDetailsModifiedData) => {
    setClickedRowData(rowData);
    toggleViewETFMasterDataModal();
  };

  const clearFilterHandler = () => {
    const resetFilters: FilterValues = {
      product_code: '',
      product_name: '',
      category: '',
      product_rating: '',
      delivery_rating: '',
    };
    setFilteredValues(resetFilters);
    //   fetchOrderReviews(resetFilters);
  };

  const StatusOptions = [
    { value: '0', label: '-' },
    { value: '1', label: '*' },
    { value: '2', label: '**' },
    { value: '3', label: '***' },
    { value: '4', label: '****' },
    { value: '5', label: '*****' },
  ];

  return (
    <div className='min-w-full max-w-[100vw]'>
      <NavigationViewComp title='Product Reviews / All Product Reviews' />

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
          <Typography className='formTypography'>
            Customer Product Rating
          </Typography>
          <Autocomplete
            size='small'
            disablePortal
            options={StatusOptions}
            className='w-full'
            value={
              StatusOptions.find(
                (option) => option.value === filteredValues.product_rating
              ) || null
            } // Ensure reset on clear
            renderInput={(params) => <TextField {...params} label='' />}
            onChange={(event, value) => {
              setFilteredValues({
                ...filteredValues,
                product_rating: value?.value.toString() || '',
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
          <Typography className='formTypography'>Delivery Rating</Typography>
          <Autocomplete
            size='small'
            disablePortal
            options={StatusOptions}
            className='w-full'
            value={
              StatusOptions.find(
                (option) => option.value === filteredValues.delivery_rating
              ) || null
            } // Ensure reset on clear
            renderInput={(params) => <TextField {...params} label='' />}
            onChange={(event, value) => {
              setFilteredValues({
                ...filteredValues,
                delivery_rating: value?.value.toString() || '',
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
        <AllProductReviewsDialogForm
          isOpen={isOpenProductReviewsModal}
          toggleModal={toggleViewETFMasterDataModal}
          clickedRowData={clickedRowData}
          compType='view'
        />
      )}
    </div>
  );
}

export default AllProductReviews;
