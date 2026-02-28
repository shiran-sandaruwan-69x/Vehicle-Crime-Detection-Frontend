import { Button, Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import { HEADER_LAYOUT } from 'src/app/axios/services/AdminServices';
import useDebounce from 'app/shared-components/useDebounce';
import ExtendedAxiosError from 'src/app/types/ExtendedAxiosError';
import { toast } from 'react-toastify';
import NavigationViewComp from '../../../../common/FormComponents/NavigationViewComp';
import MaterialTableWrapper from '../../../../common/tableComponents/MaterialTableWrapper';

//   import UserRolesForm from "src/app/main/user-management/roles/UserRolesForm";
import UsersForm from './HeaderLayoutForm';
import {
  GeneralPageInterface,
  GeneralPagesResponseInterface,
} from './interfaces';
import HeaderLayoutDeleteAlertForm from './HeaderLayoutDeleteAlertForm';

interface FilterValues {
  name: string | null;
}

function HeaderLayoutApp() {
  const [pageNo, setPageNo] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(5);
  const [userRoles] = useState<{ label: string; value: number }[]>([]);
  const [count, setCount] = useState(100);
  const [isTableLoading] = useState(false);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isView, setIsView] = useState(false);
  const [selectedRow, setSelectedRow] = useState<GeneralPageInterface>(null);
  const [generalPages, setGeneralPages] = useState<GeneralPageInterface[]>([]);
  const [clickedDeleteRowData, setClickedDeleteRowData] =
    useState<GeneralPageInterface>(null);
  const [isDeleteModel, setIsDeleteModel] = useState<boolean>(false);
  const toggleDeleteModel = () => setIsDeleteModel(!isDeleteModel);
  const [filteredValues, setFilteredValues] = useState<FilterValues>({
    name: null,
  });
  const debouncedFilter = useDebounce<FilterValues>(filteredValues, 1000);

  useEffect(() => {
    fetchGeneralPages(filteredValues);
  }, [pageSize, pageNo]);

  useEffect(() => {
    if (debouncedFilter) fetchGeneralPages(filteredValues);
  }, [debouncedFilter]);

  const fetchGeneralPages = async (filteredValues: FilterValues) => {
    try {
      const response: AxiosResponse<GeneralPagesResponseInterface> =
        await axios.get(
          `${HEADER_LAYOUT}?filter=name,${filteredValues.name ? filteredValues.name : null}&limit=${pageSize}&page=${pageNo + 1}`
        );
      setGeneralPages(response.data.data);
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

  const handlePageChange = (page: number) => {
    setPageNo(page);
  };

  const handlePageSizeChange = (pageSize: number) => {
    setPageSize(pageSize);
  };

  const tableColumns = [
    {
      title: 'Layout Name',
      field: 'name',
    },
    {
      title: 'Header Top Color',
      field: 'header_top_color',
      render: (data: GeneralPageInterface) => (
        <div
          className='w-[36px] min-w-[36px] h-[36px] rounded-full border-[4px] border-white'
          style={{
            backgroundColor: data.header_top_color,
          }}
        />
      ),
    },
    {
      title: 'Header Bottom Color',
      field: 'header_bottom_color',
      render: (data: GeneralPageInterface) => (
        <div
          className='w-[36px] min-w-[36px] h-[36px] rounded-full border-[4px] border-white'
          style={{
            backgroundColor: data.header_bottom_color,
          }}
        />
      ),
    },
    {
      title: 'Status',
      field: 'is_active',
      render: (data: GeneralPageInterface) => (
        <div
        // style={{
        // 	color: data.is_active === 1 ? 'green' : 'red'
        // }}
        >
          {data.is_active === 1 ? 'Active' : 'Inactive'}
        </div>
      ),
    },
  ];

  const handleFormModelOpen = (
    isNew: boolean,
    isEdit: boolean,
    isView: boolean,
    seletedData: GeneralPageInterface
  ) => {
    setIsAdd(isNew);
    setIsEdit(isEdit);
    setIsView(isView);
    setSelectedRow(seletedData);
    setIsModelOpen(true);
  };

  const tableRowViewHandler = (rowData: GeneralPageInterface) => {
    handleFormModelOpen(false, false, true, rowData);
  };

  const tableRowEditHandler = (rowData: GeneralPageInterface) => {
    handleFormModelOpen(false, true, false, rowData);
  };

  const tableRowDeleteHandler = (rowData: GeneralPageInterface) => {
    setClickedDeleteRowData(rowData);
    toggleDeleteModel();
  };

  const onCloseHandler = () => {
    setIsModelOpen(false);
    fetchGeneralPages(filteredValues);
  };

  const GeneralPagesRemoveHandler = async () => {
    toggleDeleteModel();
    try {
      await axios.delete(`${HEADER_LAYOUT}/${clickedDeleteRowData.id}`);
      toast.success('Deleted Successfully');
    } catch (error) {
      const axiosError = error as ExtendedAxiosError;

      if (axiosError?.response?.data?.message) {
        toast.error(axiosError.response.data.message);
      } else if (axiosError.message) {
        toast.error(axiosError.message);
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      fetchGeneralPages(filteredValues);
    }
  };

  return (
    <div className='min-w-full max-w-[100vw]'>
      <NavigationViewComp title='Header Layout' />

      <Grid container spacing={2} className='pt-[10px] pr-[30px] mx-auto'>
        <Grid
          item
          xs={12}
          className='flex flex-wrap justify-end items-end gap-[10px] pt-[10px!important]'
        >
          <Button
            className='flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80'
            type='button'
            variant='contained'
            size='medium'
            onClick={() => handleFormModelOpen(true, false, false, null)}
          >
            Add New Header Layout
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
            records={generalPages}
            tableRowViewHandler={tableRowViewHandler}
            tableRowEditHandler={tableRowEditHandler}
            tableRowDeleteHandler={tableRowDeleteHandler}
            disableSearch
          />
        </Grid>
      </Grid>

      {isModelOpen && (
        <UsersForm
          isOpen={isModelOpen}
          isAdd={isAdd}
          isEdit={isEdit}
          isView={isView}
          selectedRow={selectedRow}
          setIsFormOpen={setIsModelOpen}
          onCloseHandler={onCloseHandler}
          userRoles={userRoles}
        />
      )}

      {isDeleteModel && (
        <HeaderLayoutDeleteAlertForm
          toggleModal={toggleDeleteModel}
          isOpen={isDeleteModel}
          handleAlertForm={GeneralPagesRemoveHandler}
          clickedDeleteRowData={clickedDeleteRowData}
        />
      )}
    </div>
  );
}

export default HeaderLayoutApp;
