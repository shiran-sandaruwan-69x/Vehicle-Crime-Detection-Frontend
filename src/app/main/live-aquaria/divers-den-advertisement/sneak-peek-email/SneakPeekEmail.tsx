import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';
import useDebounce from 'app/shared-components/useDebounce';
import { Button, Chip } from '@mui/material';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { Form, Formik, FormikHelpers, FormikProps } from 'formik';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import axios, { AxiosResponse } from 'axios';
import DescriptionIcon from '@mui/icons-material/Description';
import Tooltip from '@mui/material/Tooltip';
import { CREATE_SNEAK_PEEK } from '../../../../axios/services/live-aquaria-services/divers-advertisements-services/DiversAdvertisementsService';
import CustomFormTextField from '../../../../common/FormComponents/CustomFormTextField';
import MaterialTableWrapper from '../../../../common/tableComponents/MaterialTableWrapper';
import NavigationViewComp from '../../../../common/FormComponents/NavigationViewComp';
import NewSneakPeekEmailComp from './components/NewSneakPeekEmailComp';
import {
  SneakPeekApiRes,
  SneakPeekEmailFilter,
  SneakPeekRes,
} from './sneak-peek-email-type/SneakPeekEmailType';
import TextFormDateField from '../../../../common/FormComponents/TextFormDateField';
import SneakPeekEmailDeleteAlertForm from './components/SneakPeekEmailDeleteAlertForm';

interface ErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}

function SneakPeekEmail() {
  const { t } = useTranslation('sneakPeekEmail');
  const [pageNo, setPageNo] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(5);
  const [count, setCount] = useState(100);
  const [isTableLoading, setTableLoading] = useState(false);
  const [tableData, setTableData] = useState<SneakPeekRes[]>([]);
  const [isOpenCreateSneakPeekEmailModal, setOpenCreateSneakPeekEmailModal] =
    useState(false);
  const [isOpenViewSneakPeekEmailModal, setOpenViewSneakPeekEmailModal] =
    useState(false);
  const [isOpenEditSneakPeekEmailModal, setOpenEditSneakPeekEmailModal] =
    useState(false);
  const [isOpenSneakPeekDeletionModal, setOpenSneakPeekDeletionModal] =
    useState(false);
  const toggleCreateSneakPeekEmailModal = () =>
    setOpenCreateSneakPeekEmailModal(!isOpenCreateSneakPeekEmailModal);
  const toggleViewSneakPeekEmailModal = () =>
    setOpenViewSneakPeekEmailModal(!isOpenViewSneakPeekEmailModal);
  const toggleEditSneakPeekEmailModal = () =>
    setOpenEditSneakPeekEmailModal(!isOpenEditSneakPeekEmailModal);
  const toggleSneakPeekDeletionModal = () =>
    setOpenSneakPeekDeletionModal(!isOpenSneakPeekDeletionModal);
  const [tableViewRowData, setTableViewRowData] = useState({} as SneakPeekRes);
  const [tableEditRowData, setTableEditRowData] = useState({} as SneakPeekRes);
  const [clickedDeleteRowData, setClickedDeleteRowData] = useState(
    {} as SneakPeekRes
  );
  const [filteredValues, setFilteredValues] = useState<SneakPeekEmailFilter>({
    category: null,
    product: null,
    scheduledDate: null,
  });
  const debouncedFilter = useDebounce<SneakPeekEmailFilter>(
    filteredValues,
    1000
  );

  const tableColumns = [
    {
      title: t('No'),
      field: 'no',
    },
    {
      title: t('Date'),
      field: 'date',
    },
    {
      title: t('Time'),
      field: 'time',
    },
    {
      title: t('Description'),
      field: 'description',
      render: (rowData: SneakPeekRes, index: number) => {
        return (
          <div className='flex flex-wrap items-center'>
            <Tooltip title={rowData?.description || ''} arrow>
              <span className='flex items-center cursor-default'>
                <DescriptionIcon
                  style={{
                    fontSize: '23px',
                    color: '#3558AE',
                    marginRight: '5px',
                  }}
                />
              </span>
            </Tooltip>
          </div>
        );
      },
    },
    {
      title: t('Sent Status'),
      field: 'status',
      render: (rowData: SneakPeekRes, index: number) => {
        let chipColor;
        switch (rowData?.status) {
          case '1':
            chipColor = 'bg-blue-50 [&>*]:!text-blue-800';
            break;
          case '0':
            chipColor = 'bg-green-50 [&>*]:!text-green-800';
            break;
          default:
            chipColor = 'bg-gray-50 [&>*]:!text-gray-800';
        }
        return (
          <div className='flex flex-wrap gap-[5px]'>
            <span>
              <Chip
                className={`min-w-[85px] ${chipColor} text-[10px] sm:text-[12px] font-[500] px-[6px] py-[2px]`}
                size='small'
                key={index}
                label={rowData.status === '1' ? 'Sent' : 'Scheduled'}
              />
            </span>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    if (debouncedFilter) changePageNoOrPageSize(filteredValues);
  }, [debouncedFilter]);

  useEffect(() => {
    changePageNoOrPageSize(filteredValues);
  }, [pageNo, pageSize]);

  const handlePageChange = (page: number) => {
    setPageNo(page);
  };

  const handlePageSizeChange = (pageSize: number) => {
    setPageSize(pageSize);
  };

  const getAllSneakPeek = async () => {
    setTableLoading(true);
    try {
      const response: AxiosResponse<SneakPeekApiRes> = await axios.get(
        `${CREATE_SNEAK_PEEK}?limit=${pageSize}&page=${pageNo}`
      );

      setCount(response?.data?.meta.total);
      const mapperData: SneakPeekRes[] = response?.data?.data.map(
        (item: SneakPeekRes, index: number) => ({
          ...item,
          no: index + 1,
        })
      );
      setTableData(mapperData);
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

  const schema = yup.object().shape({});

  const onSubmit = (values: SneakPeekEmailFilter) => {};

  const handleOpenNewSneakPeekEmailModal = () => {
    toggleCreateSneakPeekEmailModal();
  };

  const tableRowDeleteHandler = (rowData: SneakPeekRes) => {
    if (rowData?.status !== '1') {
      setClickedDeleteRowData(rowData);
      toggleSneakPeekDeletionModal();
    } else {
      toast.error(
        'The delete feature is only enabled for rows with "Scheduled" status'
      );
    }
  };

  const tableRowViewHandler = (rowData: SneakPeekRes) => {
    setTableViewRowData(rowData);
    toggleViewSneakPeekEmailModal();
  };

  const tableRowEditHandler = (rowData: SneakPeekRes) => {
    if (rowData.status !== '1') {
      setTableEditRowData(rowData);
      toggleEditSneakPeekEmailModal();
    } else {
      toast.error(
        'The edit feature is only enabled for rows with "Scheduled" status'
      );
    }
  };

  const handleDeleteAlertForm = async () => {
    const id: string = clickedDeleteRowData.id ? clickedDeleteRowData.id : '';
    toggleSneakPeekDeletionModal();
    try {
      await axios.delete(`${CREATE_SNEAK_PEEK}/${id}`);
      toast.success('Deleted Successfully');
      getAllSneakPeek();
    } catch (error) {
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
    filteredValues: SneakPeekEmailFilter
  ) => {
    setTableLoading(true);
    try {
      const response: AxiosResponse<SneakPeekApiRes> = await axios.get(
        `${CREATE_SNEAK_PEEK}?filter=created_at,${filteredValues.scheduledDate}|emailItem.parentItem.itemCategory.name,${filteredValues.category}|emailItem.code,${filteredValues.product}&limit=${pageSize}&page=${pageNo}`
      );
      setCount(response?.data?.meta.total);
      const mapperData: SneakPeekRes[] = response?.data?.data.map(
        (item: SneakPeekRes, index: number) => ({
          ...item,
          no: index + 1,
        })
      );
      setTableData(mapperData);
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

  const changeCategory = async (
    value: string,
    form: FormikProps<SneakPeekEmailFilter>
  ) => {
    form.setFieldValue('category', value);
    setFilteredValues({
      ...filteredValues,
      category: value,
    });
  };

  const changeProduct = async (
    value: string,
    form: FormikProps<SneakPeekEmailFilter>
  ) => {
    form.setFieldValue('product', value);
    setFilteredValues({
      ...filteredValues,
      product: value,
    });
  };

  const changeScheduledDate = async (value: string) => {
    setFilteredValues({
      ...filteredValues,
      scheduledDate: value,
    });
  };

  const handleClearForm = (
    resetForm: FormikHelpers<SneakPeekEmailFilter>['resetForm']
  ) => {
    resetForm();
    setFilteredValues({
      category: null,
      product: null,
      scheduledDate: null,
    });
  };

  return (
    <div className='min-w-full max-w-[100vw]'>
      <NavigationViewComp title='Sneak Peek Email' />

      <Formik
        initialValues={{
          category: '',
          product: '',
          scheduledDate: '',
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
                lg={4}
                xl={2}
                className='formikFormField pt-[5px!important]'
              >
                <Typography className='formTypography'>
                  {t('Category')}
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
                lg={4}
                xl={2}
                className='formikFormField pt-[5px!important]'
              >
                <Typography className='formTypography'>
                  {t('Product Code')}
                </Typography>
                <CustomFormTextField
                  name='product'
                  id='product'
                  type='text'
                  placeholder=''
                  disabled={false}
                  changeInput={changeProduct}
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
                  {t('Scheduled Date')}
                </Typography>
                <TextFormDateField
                  name='scheduledDate'
                  type='date'
                  placeholder=''
                  id='scheduledDate'
                  min=''
                  max=''
                  disablePastDate={false}
                  changeInput={(
                    value: string,
                    form: FormikHelpers<FormValues>
                  ) => {
                    changeScheduledDate(value);
                    form.setFieldValue('scheduledDate', value);
                  }}
                />
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                md={12}
                lg={12}
                xl={6}
                className='flex flex-wrap justify-between items-end gap-[10px] pt-[10px!important]'
              >
                <Button
                  className='flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80'
                  type='button'
                  variant='contained'
                  size='medium'
                  disabled={false}
                  onClick={() => handleClearForm(resetForm)}
                >
                  {t('Clear Filters')}
                </Button>
                <Button
                  className='flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80'
                  type='button'
                  variant='contained'
                  size='medium'
                  disabled={false}
                  onClick={() => handleOpenNewSneakPeekEmailModal()}
                >
                  <span className='xl:hidden'>{t('New Sneak Peek Email')}</span>
                  <span className='hidden xl:inline-block'>
                    {t('New Sneak Peek Email')}
                  </span>
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
            tableRowDeleteHandler={tableRowDeleteHandler}
            disableSearch
          />
        </Grid>
      </Grid>

      {isOpenCreateSneakPeekEmailModal && (
        <NewSneakPeekEmailComp
          isOpen={isOpenCreateSneakPeekEmailModal}
          toggleModal={toggleCreateSneakPeekEmailModal}
          clickedRowData={{}}
          getAllSneakPeek={getAllSneakPeek}
          isMode='create'
        />
      )}

      {isOpenViewSneakPeekEmailModal && (
        <NewSneakPeekEmailComp
          isOpen={isOpenViewSneakPeekEmailModal}
          toggleModal={toggleViewSneakPeekEmailModal}
          clickedRowData={tableViewRowData}
          getAllSneakPeek={getAllSneakPeek}
          isMode='view'
        />
      )}

      {isOpenEditSneakPeekEmailModal && (
        <NewSneakPeekEmailComp
          isOpen={isOpenEditSneakPeekEmailModal}
          toggleModal={toggleEditSneakPeekEmailModal}
          clickedRowData={tableEditRowData}
          getAllSneakPeek={getAllSneakPeek}
          isMode='edit'
        />
      )}

      {isOpenSneakPeekDeletionModal && (
        <SneakPeekEmailDeleteAlertForm
          toggleModal={toggleSneakPeekDeletionModal}
          isOpen={isOpenSneakPeekDeletionModal}
          handleAlertForm={handleDeleteAlertForm}
        />
      )}
    </div>
  );
}

export default SneakPeekEmail;
