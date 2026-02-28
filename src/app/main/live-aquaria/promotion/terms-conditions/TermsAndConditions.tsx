import {
  Button,
  FormControlLabel,
  FormGroup,
  Grid,
  Switch,
} from '@mui/material';
import axios, { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import NavigationViewComp from '../../../../common/FormComponents/NavigationViewComp';
import MaterialTableWrapper from '../../../../common/tableComponents/MaterialTableWrapper';
import { ShippingHoldsModifiedData } from '../../shipping/shipping-delays/shipping-holds-types/ShippingHoldsType';
import TermsAndConditionsNew from './components/TermsAndConditionsNew';

import { CREATE_PROMOTION_CONDITIONS } from '../../../../axios/services/live-aquaria-services/promotion-services/PromotionsServices';
import TermsConditionActiveAlertForm from './components/TermsConditionActiveAlertForm';
import TermsConditionDeleteAlertForm from './components/TermsConditionDeleteAlertForm';
import {
  TermsAndConditionModifiedData,
  TermsAndConditionTypeApiRes,
  TermsAndConditionTypeRes,
} from './terms-conditions-types/TermsAndConditionsType';

interface ErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}

function TermsAndConditions() {
  const { t } = useTranslation('termsAndConditions');
  const [pageNo, setPageNo] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(5);
  const [count, setCount] = useState<number>(100);
  const [isTableLoading, setTableLoading] = useState(false);
  const [tableData, setTableData] = useState<TermsAndConditionModifiedData[]>(
    []
  );
  const [selectedActiveRowData, setSelectedActiveRowData] =
    useState<TermsAndConditionModifiedData>(null);
  const [selectedDeleteRowData, setSelectedDeleteRowData] =
    useState<TermsAndConditionModifiedData>(null);
  const [selectedViewRowData, setSelectedViewRowData] =
    useState<TermsAndConditionModifiedData>(null);
  const [selectedEditRowData, setSelectedEditRowData] =
    useState<TermsAndConditionModifiedData>(null);
  const [isOpenNewMethod, setOpenNewMethodModal] = useState<boolean>(false);
  const [isOpenViewMethod, setOpenViewMethodModal] = useState<boolean>(false);
  const [isOpenEditMethod, setOpenEditMethodModal] = useState<boolean>(false);
  const [isOpenActiveModal, setOpenActiveModal] = useState<boolean>(false);
  const [isOpenDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const toggleNewModal = () => setOpenNewMethodModal(!isOpenNewMethod);
  const toggleViewModal = () => setOpenViewMethodModal(!isOpenViewMethod);
  const toggleEditModal = () => setOpenEditMethodModal(!isOpenEditMethod);
  const toggleActiveModal = () => setOpenActiveModal(!isOpenActiveModal);
  const toggleDeleteModal = () => setOpenDeleteModal(!isOpenDeleteModal);

  useEffect(() => {
    fetchAllPromotionConditions();
  }, [pageNo, pageSize]);

  const handlePageChange = (page: number) => {
    setPageNo(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
  };

  const tableColumns = [
    {
      title: t('Promotion Name'),
      field: 'promotionName',
      cellStyle: {
        padding: '4px 8px',
      },
    },
    {
      title: t('Active'),
      field: 'active',
      render: (rowData: TermsAndConditionModifiedData, index) => (
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

  const handleSwitchChange =
    (index, rowData: ShippingHoldsModifiedData) => async (event) => {
      setSelectedActiveRowData(rowData);
      toggleActiveModal();
    };

  const detailPanels = [
    {
      tooltip: 'Show All Conditions',
      render: (rowData: TermsAndConditionModifiedData) => {
        return (
          <div className='w-full px-[10px] py-[5px] my-[5px] rounded-[6px] bg-gray-200'>
            <ul className='flex flex-col gap-[5px] !m-0'>
              {rowData.conditionModify.map((cond: string, index: number) => (
                <li
                  key={index}
                  className='text-[10px] sm:text-[12px] lg:text-[14px] text-gray-700'
                >
                  {cond}
                </li>
              ))}
            </ul>
          </div>
        );
      },
    },
  ];

  const handleRowDelete = (rowData: TermsAndConditionModifiedData) => {
    setSelectedDeleteRowData(rowData);
    toggleDeleteModal();
  };

  const handleView = (rowData: TermsAndConditionModifiedData) => {
    setSelectedViewRowData(rowData);
    toggleViewModal();
  };

  const handleEdit = (rowData: TermsAndConditionModifiedData) => {
    setSelectedEditRowData(rowData);
    toggleEditModal();
  };

  const handleNewShippingType = () => {
    toggleNewModal();
  };

  const fetchAllPromotionConditions = async () => {
    setTableLoading(true);
    try {
      const response: AxiosResponse<TermsAndConditionTypeApiRes> =
        await axios.get(
          `${CREATE_PROMOTION_CONDITIONS}?limit=${pageSize}&page=${pageNo}`
        );

      const transformedData: TermsAndConditionModifiedData[] =
        response?.data?.data?.map((item: TermsAndConditionTypeRes) => ({
          ...item,
          promotionName: item?.promotion?.name,
          conditionModify: item?.condition?.map((cond) => cond.condition) ?? [],
          active: item?.is_active === 1,
        }));
      setTableData(transformedData);
      setCount(response?.data?.meta?.total);
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

  const handleAlertForm = async () => {
    toggleActiveModal();
    const id = selectedActiveRowData?.id ?? null;
    try {
      const data = {
        is_active: selectedActiveRowData?.active === true ? 0 : 1,
      };
      await axios.put(`${CREATE_PROMOTION_CONDITIONS}/${id}`, data);
      fetchAllPromotionConditions();

      if (data.is_active === 0) {
        toast.success('Inactivated Successfully');
      } else {
        toast.success('Activated Successfully');
      }
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

  const handleDeleteAlertForm = async () => {
    toggleDeleteModal();
    const id = selectedDeleteRowData?.id ?? null;
    try {
      await axios.delete(`${CREATE_PROMOTION_CONDITIONS}/${id}`);
      fetchAllPromotionConditions();
      toast.success('Deleted successfully');
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

  return (
    <div className='min-w-full max-w-[100vw]'>
      <NavigationViewComp title='Promotion / Terms & Conditions' />
      <Grid container spacing={2} className='pt-[10px] pr-[30px] mx-auto'>
        <Grid
          item
          xs={12}
          className='formikFormField flex justify-end items-center pt-[5px!important]'
        >
          <Button
            className='flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] xl:text-[14px] text-white font-500 lg:!px-[2px] xl:!p-[16px] py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80'
            type='button'
            variant='contained'
            size='medium'
            onClick={() => handleNewShippingType()}
          >
            {t('Create New Terms & Conditions')}
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
            loading={isTableLoading}
            handlePageChange={handlePageChange}
            handlePageSizeChange={handlePageSizeChange}
            handleCommonSearchBar={null}
            pageSize={pageSize}
            disableColumnFiltering
            setPageSize={setPageSize}
            pageIndex={pageNo}
            searchByText=''
            count={count}
            exportToExcel={null}
            externalAdd={null}
            externalEdit={null}
            externalView={null}
            selection={false}
            selectionExport={null}
            isColumnChoser
            disableSearch
            records={tableData}
            tableRowViewHandler={handleView}
            tableRowEditHandler={handleEdit}
            tableRowDeleteHandler={handleRowDelete}
            detailPanel={detailPanels}
          />
        </Grid>
      </Grid>

      {isOpenNewMethod && (
        <TermsAndConditionsNew
          isOpen={isOpenNewMethod}
          toggleModal={toggleNewModal}
          clickedRowData={{}}
          isMode='create'
          fetchAllPromotionConditions={fetchAllPromotionConditions}
        />
      )}

      {isOpenEditMethod && (
        <TermsAndConditionsNew
          isOpen={isOpenEditMethod}
          toggleModal={toggleEditModal}
          clickedRowData={selectedEditRowData}
          isMode='edit'
          fetchAllPromotionConditions={fetchAllPromotionConditions}
        />
      )}

      {isOpenViewMethod && (
        <TermsAndConditionsNew
          isOpen={isOpenViewMethod}
          toggleModal={toggleViewModal}
          clickedRowData={selectedViewRowData}
          isMode='view'
          fetchAllPromotionConditions={fetchAllPromotionConditions}
        />
      )}

      {isOpenActiveModal && (
        <TermsConditionActiveAlertForm
          toggleModal={toggleActiveModal}
          isOpen={isOpenActiveModal}
          clickedRowData={selectedActiveRowData}
          handleAlertForm={handleAlertForm}
        />
      )}

      {isOpenDeleteModal && (
        <TermsConditionDeleteAlertForm
          toggleModal={toggleDeleteModal}
          isOpen={isOpenDeleteModal}
          handleAlertForm={handleDeleteAlertForm}
        />
      )}
    </div>
  );
}

export default TermsAndConditions;
