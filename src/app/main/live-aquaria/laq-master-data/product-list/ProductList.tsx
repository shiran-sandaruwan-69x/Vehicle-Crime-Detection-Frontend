import { Autocomplete, Button, Grid, TextField } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import { Form, Formik, FormikHelpers, FormikProps } from 'formik';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import useDebounce from 'app/shared-components/useDebounce';
import {
  getAllAdvanceFilteringProductMasterDataWithPagination,
  getAllItemsWithPagination,
  updateItems,
} from '../../../../axios/services/live-aquaria-services/master-data-services/MasterDataServices';
import NavigationViewComp from '../../../../common/FormComponents/NavigationViewComp';
import MaterialTableWrapper from '../../../../common/tableComponents/MaterialTableWrapper';

import CreateProductMaster from './componets/CreateProductMaster';
import EditProductList from './componets/EditProductList';
import {
  AllProductSelectionResponseTypes,
  AllProductSelectionTypes,
  ProductMasterDataOnsubmitData,
  TableDataAllProductModifiedDataType,
} from './product-list-types/ProductListTypes';
import CustomFormTextField from '../../../../common/FormComponents/CustomFormTextField';
import TableProductSelectionTypeComp from './componets/TableProductSelectionTypeComp';
import ActiveAlertForm from './componets/ActiveAlertForm';
import { CommonProductMasterModifiedData } from '../common-product-master/common-product-master-types/CommonProductMasterTypes';

interface ErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}

function ProductList() {
  const { t } = useTranslation('productList');
  const [pageNo, setPageNo] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(5);
  const [count, setCount] = useState(100);
  const [isTableLoading, setTableLoading] = useState(false);
  const [isOpenProductListModal, setOpenProductListModal] = useState(false);
  const [isOpenProductListViewModal, setOpenProductListViewModal] =
    useState(false);
  const [isOpenProductListCreateModal, setOpenProductListCreateModal] =
    useState(false);
  const [isOpenInactivateModal, setOpenInactivateModal] = useState(false);
  const toggleProductListModal = () =>
    setOpenProductListModal(!isOpenProductListModal);
  const toggleProductListViewModal = () =>
    setOpenProductListViewModal(!isOpenProductListViewModal);
  const toggleProductListCreateModal = () =>
    setOpenProductListCreateModal(!isOpenProductListCreateModal);
  const toggleInactivateModal = () =>
    setOpenInactivateModal(!isOpenInactivateModal);
  const [isAquaticType, setAquaticType] = useState([]);
  const [clickedRowData, setClickedRowData] = useState(
    {} as TableDataAllProductModifiedDataType
  );
  const [clickedInactiveRowData, setClickedInactiveRowData] = useState(
    {} as TableDataAllProductModifiedDataType
  );
  const [clickedSelectionModalRowData, setClickedSelectionModalRowData] =
    useState({} as TableDataAllProductModifiedDataType);

  const [tableData, setTableData] = useState([]);
  const [isOpenSelectionModal, setOpenSelectionModal] = useState(false);
  const toggleSelectionModal = () =>
    setOpenSelectionModal(!isOpenSelectionModal);
  const handlePageChange = (page: number) => {
    setPageNo(page);
  };

  const [filteredValues, setFilteredValues] =
    useState<ProductMasterDataOnsubmitData>({
      productId: null,
      productName: null,
      category: null,
      productSelection: null,
      aquatic_type: null,
    });

  const debouncedFilter = useDebounce<ProductMasterDataOnsubmitData>(
    filteredValues,
    1000
  );

  const handlePageSizeChange = (pageSize: number) => {
    setPageSize(pageSize);
  };

  useEffect(() => {
    if (debouncedFilter) changePageNoOrPageSize(filteredValues);
  }, [debouncedFilter]);

  useEffect(() => {
    setAquaticType([
      {
        label: 'Saltwater',
        value: 'salt',
      },
      {
        label: 'Freshwater',
        value: 'fresh',
      },
      {
        label: 'Both',
        value: 'both',
      },
    ]);
    changePageNoOrPageSize(filteredValues);
  }, [pageNo, pageSize]);

  const fetchAllProductList = async () => {
    setTableLoading(true);
    try {
      const response: AllProductSelectionResponseTypes =
        await getAllItemsWithPagination(pageNo, pageSize);
      setCount(response.meta.total);
      const modifiedData: TableDataAllProductModifiedDataType[] =
        response.data.map((item: AllProductSelectionTypes) => ({
          ...item,
          itemNumber: item?.code,
          productName: item?.common_name,
          category: item?.item_category?.name,
          description: item?.short_description,
          active: item?.is_active === 1,
        }));
      setTableData(modifiedData);
      setTableLoading(false);
    } catch (error) {
      setTableLoading(false);
      const isErrorResponse = (error: unknown): error is ErrorResponse => {
        return (
          typeof error === 'object' && error !== null && 'response' in error
        );
      };

      if (isErrorResponse(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Internal server error');
      }
    }
  };

  const handleClearForm = (
    resetForm: FormikHelpers<ProductMasterDataOnsubmitData>['resetForm']
  ) => {
    resetForm();
    setFilteredValues({
      productId: null,
      productName: null,
      category: null,
      productSelection: null,
      aquatic_type: null,
    });
  };

  const handleSwitchChange =
    (index, rowData: TableDataAllProductModifiedDataType) => async (event) => {
      setClickedInactiveRowData(rowData);
      toggleInactivateModal();
    };

  const tableColumns = [
    {
      title: t('Item Code'),
      field: 'itemNumber',
    },
    {
      title: t('PRODUCT_NAME'),
      field: 'productName',
    },
    {
      title: t('CATEGORY'),
      field: 'category',
    },
    {
      title: t('Aquatic Type'),
      field: 'aquatic_type',
      render: (rowData: CommonProductMasterModifiedData, index: number) => {
        let chipColor;
        switch (rowData?.aquatic_type) {
          case 'salt':
            chipColor = 'Saltwater';
            break;
          case 'fresh':
            chipColor = 'Freshwater';
            break;
          case 'both':
            chipColor = 'Both';
            break;
          default:
            chipColor = '';
        }
        return <span>{chipColor}</span>;
      },
    },
    {
      title: 'Selection Types',
      field: 'selection_types',
      render: (rowData: TableDataAllProductModifiedDataType) => (
        <div className='flex items-center'>
          <span className='text-[10px] sm:text-[12px] lg:text-[14px] mr-[4px]'>
            View
          </span>{' '}
          <IconButton
            onClick={() => handleIconClick(rowData)}
            aria-label='select type'
          >
            <InfoIcon />
          </IconButton>
        </div>
      ),
    },
    {
      title: t('ACTIVE'),
      field: 'active',
      render: (rowData: TableDataAllProductModifiedDataType) => (
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={rowData.active}
                onChange={handleSwitchChange(rowData.id, rowData)}
                aria-label='active switch'
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

  const handleIconClick = (rowData: TableDataAllProductModifiedDataType) => {
    setClickedSelectionModalRowData(rowData);
    toggleSelectionModal();
  };

  const schema = yup.object().shape({});

  const tableRowViewHandler = (
    rowData: TableDataAllProductModifiedDataType
  ) => {
    setClickedRowData(rowData);
    toggleProductListViewModal();
  };

  const tableRowEditHandler = (
    rowData: TableDataAllProductModifiedDataType
  ) => {
    setClickedRowData(rowData);
    toggleProductListModal();
  };

  const handleOpenNewCustomerModal = () => {
    toggleProductListCreateModal();
  };

  const handleToggleInactivate = async () => {
    const requestData = {
      is_active: clickedInactiveRowData.active === true ? 0 : 1,
    };
    const id: string = clickedInactiveRowData.id
      ? clickedInactiveRowData.id
      : '';
    try {
      const response = await updateItems(requestData, id);
      fetchAllProductList();
      toggleInactivateModal();

      if (requestData.is_active === 0) {
        toast.success('Inactivated Successfully');
      } else {
        toast.success('Activated Successfully');
      }
    } catch (error) {
      toggleInactivateModal();
      const isErrorResponse = (error: unknown): error is ErrorResponse => {
        return (
          typeof error === 'object' && error !== null && 'response' in error
        );
      };

      if (isErrorResponse(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Internal server error');
      }
    }
  };

  const changePageNoOrPageSize = async (
    filteredValues: ProductMasterDataOnsubmitData
  ) => {
    setTableLoading(true);
    try {
      const response: AllProductSelectionResponseTypes =
        await getAllAdvanceFilteringProductMasterDataWithPagination(
          filteredValues.productId,
          filteredValues.productName,
          filteredValues.category,
          filteredValues.productSelection,
          filteredValues.aquatic_type,
          pageNo,
          pageSize
        );
      setCount(response.meta.total);
      const modifiedData: TableDataAllProductModifiedDataType[] =
        response.data.map((item: AllProductSelectionTypes) => ({
          ...item,
          itemNumber: item?.code,
          productName: item?.common_name,
          category: item?.item_category?.name,
          description: item?.short_description,
          active: item?.is_active === 1,
        }));
      setTableData(modifiedData);
      setTableLoading(false);
    } catch (error) {
      setTableLoading(false);
      const isErrorResponse = (error: unknown): error is ErrorResponse => {
        return (
          typeof error === 'object' && error !== null && 'response' in error
        );
      };

      if (isErrorResponse(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Internal server error');
      }
    }
  };

  const changeProductId = async (
    value: string,
    form: FormikProps<ProductMasterDataOnsubmitData>
  ) => {
    form.setFieldValue('productId', value);
    setFilteredValues({
      ...filteredValues,
      productId: value,
    });
  };

  const changeProductName = async (
    value: string,
    form: FormikProps<ProductMasterDataOnsubmitData>
  ) => {
    form.setFieldValue('productName', value);
    setFilteredValues({
      ...filteredValues,
      productName: value,
    });
  };

  const changeAquaticType = async (value: string) => {
    setFilteredValues({
      ...filteredValues,
      aquatic_type: value,
    });
  };

  const changeCategory = async (
    value: string,
    form: FormikProps<ProductMasterDataOnsubmitData>
  ) => {
    form.setFieldValue('category', value);
    setFilteredValues({
      ...filteredValues,
      category: value,
    });
  };

  const changeProductSelection = async (
    value: string,
    form: FormikProps<ProductMasterDataOnsubmitData>
  ) => {
    form.setFieldValue('productSelection', value);
    setFilteredValues({
      ...filteredValues,
      productSelection: value,
    });
  };

  const onSubmit = async (values: ProductMasterDataOnsubmitData) => {};

  return (
    <div className='min-w-full max-w-[100vw]'>
      <NavigationViewComp title={t('LAQ Item Master Data')} />

      <Formik
        initialValues={{
          productId: '',
          productName: '',
          category: '',
          productSelection: '',
          aquatic_type: '',
        }}
        validationSchema={schema}
        onSubmit={onSubmit}
      >
        {({ values, setFieldValue, isValid, resetForm }) => (
          <Form>
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
                  {t('ITEM_CODE')}
                </Typography>
                <CustomFormTextField
                  name='productId'
                  id='productId'
                  type='text'
                  placeholder=''
                  disabled={false}
                  changeInput={changeProductId}
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
                  {t('PRODUCT_NAME')}
                </Typography>
                <CustomFormTextField
                  name='productName'
                  id='productName'
                  type='text'
                  placeholder=''
                  disabled={false}
                  changeInput={changeProductName}
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
                  {t('CATEGORY')}
                </Typography>
                <CustomFormTextField
                  name='category'
                  id='category'
                  type='text'
                  placeholder=''
                  disabled={false}
                  changeInput={changeCategory}
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
                  {t('Aquatic Type')}
                </Typography>
                <Autocomplete
                  size='small'
                  disablePortal
                  options={isAquaticType}
                  className='w-full'
                  value={values.aquatic_type || null}
                  renderInput={(params) => (
                    <TextField {...params} name='aquatic_type' label='' />
                  )}
                  onChange={(
                    event: React.ChangeEvent<HTMLInputElement>,
                    value: { label: string; value: string } | null
                  ) => {
                    setFieldValue('aquatic_type', value?.label || null);
                    changeAquaticType(value?.value || null);
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
                  {t('CIS Code')}
                </Typography>
                <CustomFormTextField
                  name='productSelection'
                  id='productSelection'
                  type='text'
                  placeholder=''
                  disabled={false}
                  changeInput={changeProductSelection}
                />
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={9}
                xl={2}
                dxc
                className='flex flex-wrap justify-end lg:justify-end xl:justify-end items-end gap-[10px] xl:gap-[5px] 2xl:gap-[10px] pt-[10px!important]'
              >
                <Button
                  className='flex justify-center items-center min-w-max min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] 2xl:text-[14px] text-gray-600 font-500 !px-[5px] 2xl:!px-[10px] py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80'
                  type='button'
                  variant='contained'
                  size='medium'
                  disabled={false}
                  onClick={() => handleClearForm(resetForm)}
                >
                  {t('Clear Filters')}
                </Button>
                <Button
                  className='flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] 2xl:text-[14px] text-white font-500 !px-[5px] 2xl:!px-[10px] py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80'
                  type='button'
                  variant='contained'
                  size='medium'
                  disabled={false}
                  onClick={handleOpenNewCustomerModal}
                >
                  {/* {t('CREATE_DISPLAY_SET')} */}
                  New Display Set
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
            tableRowEditHandler={tableRowEditHandler}
            disableSearch
          />
        </Grid>
      </Grid>

      {isOpenProductListCreateModal && (
        <CreateProductMaster
          isOpen={isOpenProductListCreateModal}
          toggleModal={toggleProductListCreateModal}
          fetchAllProductList={fetchAllProductList}
        />
      )}

      {isOpenProductListViewModal && (
        <EditProductList
          isOpen={isOpenProductListViewModal}
          toggleModal={toggleProductListViewModal}
          clickedRowData={clickedRowData}
          fetchAllProductList={fetchAllProductList}
          isTableMode='viewMode'
        />
      )}

      {isOpenProductListModal && (
        <EditProductList
          isOpen={isOpenProductListModal}
          toggleModal={toggleProductListModal}
          clickedRowData={clickedRowData}
          fetchAllProductList={fetchAllProductList}
          isTableMode='edit'
        />
      )}

      {isOpenInactivateModal && (
        <ActiveAlertForm
          isOpen={isOpenInactivateModal}
          toggleModal={toggleInactivateModal}
          clickedRowData={clickedInactiveRowData}
          handleAlertForm={handleToggleInactivate}
        />
      )}

      {isOpenSelectionModal && (
        <TableProductSelectionTypeComp
          toggleModal={toggleSelectionModal}
          isOpen={isOpenSelectionModal}
          clickedRowData={clickedSelectionModalRowData}
        />
      )}
    </div>
  );
}

export default ProductList;
