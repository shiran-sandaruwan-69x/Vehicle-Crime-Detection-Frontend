import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { Form, Formik, FormikHelpers, FormikProps } from 'formik';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';

import useDebounce from 'app/shared-components/useDebounce';
import NavigationViewComp from '../../../../common/FormComponents/NavigationViewComp';
import CustomFormTextField from '../../../../common/FormComponents/CustomFormTextField';
import MaterialTableWrapper from '../../../../common/tableComponents/MaterialTableWrapper';
import TextFormDateField from '../../../../common/FormComponents/TextFormDateField';
import ArticleTabComp from './components/ArticleTabComp';
import {
  ArticleResponseType,
  ArticleSubmitType,
  ArticleType,
  MappedArticle,
} from '../article-category/article-category-types/ArticleCategoryTypes';
import {
  deleteArticle,
  getAllAdvanceFilteringArticleDataWithPagination,
  getAllArticleWithPagination,
  updateArticle,
} from '../../../../axios/services/live-aquaria-services/article-services/ArticleServices';
import ArticleActiveAlertForm from './components/ArticleActiveAlertForm';
import ArticleDeleteAlertForm from './components/ArticleDeleteAlertForm';

interface ErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}

function Article() {
  const { t } = useTranslation('article');
  const [pageNo, setPageNo] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(5);
  const [count, setCount] = useState(100);
  const [isTableLoading, setTableLoading] = useState(false);
  const [tableData, setTableData] = useState<MappedArticle[]>([]);
  const [clickedRowData, setClickedRowData] = useState({} as MappedArticle);
  const [clickedEditRowData, setClickedEditRowData] = useState(
    {} as MappedArticle
  );
  const [clickedActiveRowData, setClickedActiveRowData] = useState(
    {} as MappedArticle
  );
  const [clickedDeleteRowData, setClickedDeleteRowData] = useState(
    {} as MappedArticle
  );
  const [isOpenNewArticleModal, setOpenNewArticleModal] = useState(false);
  const [isOpenViewArticleModal, setOpenViewArticleModal] = useState(false);
  const [isOpenEditArticleModal, setOpenEditArticleModal] = useState(false);
  const [isOpenActiveArticleDataFormModal, setOpenActiveArticleFormModal] =
    useState(false);
  const [isOpenDeleteCategoryModal, setOpenDeleteCategoryModal] =
    useState(false);
  const toggleNewArticleModal = () =>
    setOpenNewArticleModal(!isOpenNewArticleModal);
  const toggleViewArticleModal = () =>
    setOpenViewArticleModal(!isOpenViewArticleModal);
  const toggleEditArticleModal = () =>
    setOpenEditArticleModal(!isOpenEditArticleModal);
  const toggleActiveArticleFormModal = () =>
    setOpenActiveArticleFormModal(!isOpenActiveArticleDataFormModal);
  const toggleDeleteCategoryModal = () =>
    setOpenDeleteCategoryModal(!isOpenDeleteCategoryModal);
  const [filteredValues, setFilteredValues] = useState<ArticleSubmitType>({
    articleId: null,
    category: null,
    articleTitle: null,
    publishDate: null,
    author: null,
    keywords: null,
  });

  const debouncedFilter = useDebounce<ArticleSubmitType>(filteredValues, 1000);

  useEffect(() => {
    if (debouncedFilter) changePageNoOrPageSize(filteredValues);
  }, [debouncedFilter]);

  useEffect(() => {
    changePageNoOrPageSize(filteredValues);
  }, [pageNo, pageSize]);

  const tableColumns = [
    {
      title: t('NO'),
      field: 'no',
    },
    {
      title: t('ARTICLE_CODE'),
      field: 'articleCode',
    },
    {
      title: t('ARTICLE_CATEGORY'),
      field: 'category',
    },
    {
      title: t('ARTICLE_TITLE'),
      field: 'articleTitle',
      cellStyle: {
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        minWidth: '450px',
        maxWidth: '450px',
      },
      headerStyle: {
        minWidth: '450px',
        maxWidth: '450px',
        whiteSpace: 'nowrap',
      },
      render: (rowData: MappedArticle, index) => (
        <div style={{ whiteSpace: 'pre-wrap' }}>{rowData.articleTitle}</div>
      ),
    },
    {
      title: t('PUBLISH_DATE'),
      field: 'publishDate',
    },
    {
      title: t('Author'),
      field: 'author',
    },
    {
      title: t('PUBLISH'),
      field: 'active',
      render: (rowData: MappedArticle, index) => (
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

  const getAllArticle = async () => {
    setTableLoading(true);

    try {
      const response: ArticleType = await getAllArticleWithPagination(
        pageNo,
        pageSize
      );
      setCount(response.meta.total);

      const mapperData: MappedArticle[] = response.data.map(
        (item: ArticleResponseType, index: number) => ({
          ...item,
          no: index + 1,
          articleCode: item.code ?? '',
          category: item?.article_category?.name ?? '',
          articleTitle: item.title ?? '',
          publishDate: item.start_date ?? '',
          active: item.is_active === 1,
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

  const handlePageChange = (page: number) => {
    setPageNo(page);
  };

  const handlePageSizeChange = (pageSize: number) => {
    setPageSize(pageSize);
  };

  // Switch

  const handleSwitchChange =
    (index, rowData: MappedArticle) => async (event) => {
      setClickedActiveRowData(rowData);
      toggleActiveArticleFormModal();
    };

  const schema = yup.object().shape({});

  const onSubmit = (values: ArticleSubmitType) => {};

  const handleClearForm = (
    resetForm: FormikHelpers<ArticleSubmitType>['resetForm']
  ) => {
    resetForm();
    setFilteredValues({
      articleId: null,
      category: null,
      articleTitle: null,
      publishDate: null,
      author: null,
      keywords: null,
    });
  };

  const handleActiveAlertForm = async () => {
    const reasonId: string = clickedActiveRowData.id
      ? clickedActiveRowData.id
      : '';
    toggleActiveArticleFormModal();
    const requestData = {
      is_active: clickedActiveRowData.active === true ? 0 : 1,
    };

    if (clickedActiveRowData?.title) {
      setTableLoading(true);
      try {
        const response = await updateArticle(requestData, reasonId);
        setTableLoading(false);
        getAllArticle();

        if (requestData.is_active === 1) {
          toast.success('Published Successfully');
        } else {
          toast.success('Unpublished Successfully');
        }
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
    } else {
      toast.error('Title is required');
    }
  };

  const handleAlertForm = async () => {
    const id: string = clickedDeleteRowData.id ? clickedDeleteRowData.id : '';
    setTableLoading(true);
    toggleDeleteCategoryModal();
    try {
      const response = await deleteArticle(id);
      getAllArticle();
      setTableLoading(false);
      toast.success('Deleted Successfully');
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

  const changePageNoOrPageSize = async (filteredValues: ArticleSubmitType) => {
    setTableLoading(true);
    try {
      const response: ArticleType =
        await getAllAdvanceFilteringArticleDataWithPagination(
          filteredValues.articleId,
          filteredValues.category,
          filteredValues.articleTitle,
          filteredValues.publishDate,
          filteredValues.keywords,
          filteredValues.author,
          pageNo,
          pageSize
        );

      setCount(response.meta.total);
      const mapperData: MappedArticle[] = response.data.map(
        (item: ArticleResponseType, index: number) => ({
          ...item,
          no: index + 1,
          articleCode: item.code ?? '',
          category: item?.article_category?.name ?? '',
          articleTitle: item.title ?? '',
          publishDate: item.start_date ?? '',
          active: item.is_active === 1,
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

  const changeArticleId = async (
    value: string,
    form: FormikProps<ArticleSubmitType>
  ) => {
    form.setFieldValue('articleId', value);
    setFilteredValues({
      ...filteredValues,
      articleId: value.length === 0 ? null : value,
    });
  };

  const changeArticleTitle = async (
    value: string,
    form: FormikProps<ArticleSubmitType>
  ) => {
    form.setFieldValue('articleTitle', value);
    setFilteredValues({
      ...filteredValues,
      articleTitle: value.length === 0 ? null : value,
    });
  };

  const changeKeywords = async (
    value: string,
    form: FormikProps<ArticleSubmitType>
  ) => {
    form.setFieldValue('keywords', value);
    setFilteredValues({
      ...filteredValues,
      keywords: value.length === 0 ? null : value,
    });
  };

  const changeAuthor = async (
    value: string,
    form: FormikProps<ArticleSubmitType>
  ) => {
    form.setFieldValue('author', value);
    setFilteredValues({
      ...filteredValues,
      author: value.length === 0 ? null : value,
    });
  };

  const changePublishDate = async (
    value: string,
    form: FormikProps<ArticleSubmitType>
  ) => {
    form.setFieldValue('publishDate', value);
    setFilteredValues({
      ...filteredValues,
      publishDate: value.length === 0 ? null : value,
    });
  };

  const changeCategory = async (
    value: string,
    form: FormikProps<ArticleSubmitType>
  ) => {
    form.setFieldValue('category', value);
    setFilteredValues({
      ...filteredValues,
      category: value.length === 0 ? null : value,
    });
  };

  const handleOpenNewArticleModal = () => {
    toggleNewArticleModal();
  };

  const tableRowViewHandler = (rowData: MappedArticle) => {
    setClickedRowData(rowData);
    toggleViewArticleModal();
  };

  const tableRowEditHandler = (rowData: MappedArticle) => {
    setClickedEditRowData(rowData);
    toggleEditArticleModal();
  };

  const tableRowDeleteHandler = (rowData: MappedArticle) => {
    setClickedDeleteRowData(rowData);
    toggleDeleteCategoryModal();
  };

  return (
    <div className='min-w-full max-w-[100vw]'>
      <NavigationViewComp title='Article' />
      <Formik
        initialValues={{
          articleId: '',
          category: '',
          articleTitle: '',
          publishDate: '',
          author: '',
          keywords: '',
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
                  {t('ARTICLE_CODE')}
                </Typography>
                <CustomFormTextField
                  name='articleId'
                  id='articleId'
                  type='text'
                  placeholder=''
                  disabled={false}
                  changeInput={changeArticleId}
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
                  {t('Article Category')}
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
                  {t('ARTICLE_TITLE')}
                </Typography>
                <CustomFormTextField
                  name='articleTitle'
                  id='articleTitle'
                  type='text'
                  placeholder=''
                  disabled={false}
                  changeInput={changeArticleTitle}
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
                  {t('PUBLISH_DATE')}
                </Typography>
                <TextFormDateField
                  name='publishDate'
                  type='date'
                  placeholder=''
                  id='publishDate'
                  min=''
                  changeInput={changePublishDate}
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
                  {t('AUTHOR')}
                </Typography>
                <CustomFormTextField
                  name='author'
                  id='author'
                  type='text'
                  placeholder=''
                  disabled={false}
                  changeInput={changeAuthor}
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
                  {t('KEYWORDS')}
                </Typography>
                <CustomFormTextField
                  name='keywords'
                  id='keywords'
                  type='text'
                  placeholder=''
                  disabled={false}
                  changeInput={changeKeywords}
                />
              </Grid>

              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={6}
                xl={12}
                className='flex flex-wrap justify-between items-end gap-[10px] formikFormField pt-[10px!important]'
              >
                <Button
                  className='flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80'
                  type='button'
                  variant='contained'
                  size='medium'
                  disabled={false}
                  onClick={() => handleClearForm(resetForm)}
                >
                  {t('CLEAR_FILTERS')}
                </Button>

                <Button
                  className='flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80'
                  type='button'
                  variant='contained'
                  size='medium'
                  disabled={false}
                  onClick={() => handleOpenNewArticleModal()}
                >
                  {t('NEW_ARTICLE')}
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
          />
        </Grid>
      </Grid>

      {isOpenNewArticleModal && (
        <ArticleTabComp
          isOpen={isOpenNewArticleModal}
          toggleModal={toggleNewArticleModal}
          clickedRowData={{}}
          isTableMode='create'
          getAllArticle={getAllArticle}
        />
      )}

      {isOpenViewArticleModal && (
        <ArticleTabComp
          isOpen={isOpenViewArticleModal}
          toggleModal={toggleViewArticleModal}
          clickedRowData={clickedRowData}
          isTableMode='view'
          getAllArticle={getAllArticle}
        />
      )}

      {isOpenEditArticleModal && (
        <ArticleTabComp
          isOpen={isOpenEditArticleModal}
          toggleModal={toggleEditArticleModal}
          clickedRowData={clickedEditRowData}
          isTableMode='edit'
          getAllArticle={getAllArticle}
        />
      )}

      {isOpenActiveArticleDataFormModal && (
        <ArticleActiveAlertForm
          isOpen={isOpenActiveArticleDataFormModal}
          toggleModal={toggleActiveArticleFormModal}
          clickedRowData={clickedActiveRowData}
          handleAlertForm={handleActiveAlertForm}
        />
      )}

      {isOpenDeleteCategoryModal && (
        <ArticleDeleteAlertForm
          isOpen={isOpenDeleteCategoryModal}
          toggleModal={toggleDeleteCategoryModal}
          clickedRowData={clickedDeleteRowData}
          handleAlertForm={handleAlertForm}
        />
      )}
    </div>
  );
}

export default Article;
