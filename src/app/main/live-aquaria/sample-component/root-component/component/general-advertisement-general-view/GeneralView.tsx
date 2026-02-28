import React, { useState } from 'react';
import Paper from '@mui/material/Paper';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { CircularProgress, Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import Button from '@mui/material/Button';
import { toast } from 'react-toastify';
import TextFormField from '../../../../../../common/FormComponents/FormTextField';
import {
  GeneralAdvGeneralViewSubmitDataType,
  GeneralAdvMainObject,
} from '../../types/general-advertisement-types';
import { updateGeneralDetails } from '../../../../../../axios/services/live-aquaria-services/general-advertisement-services/GeneralAdvertisementService';
import FormikMultipleSelectChip from '../../../../../../common/FormComponents/FormikMultipleSelectChip';

interface ErrorResponse {
  response?: {
    status?: number;
    data?: {
      message?: string;
    };
  };
}
interface Props {
  clickedRowData: GeneralAdvMainObject;
  isTableMode: string;
  fetchDataForProfileView: () => void;
  nextAndBackPage: (newValue: number) => void;
}

function GeneralView({
  clickedRowData,
  isTableMode,
  fetchDataForProfileView,
  nextAndBackPage,
}: Props) {
  const { t } = useTranslation('sampleComponent');
  const [isProductSubmitDataLoading, setProductSubmitDataLoading] =
    useState(false);
  const schema = yup.object().shape({
    long_description: yup.string().required('Long Description is required'),
    short_description: yup.string().required('Short Description is required'),
  });

  const handleUpdate = async (values: GeneralAdvGeneralViewSubmitDataType) => {
    const generalDetails = {
      type: 'LAQ',
      title: values.title,
      common_name: values.product_name,
      scientific_name: values.scientific_name,
      short_description: values.short_description,
      long_description: values.long_description,
      meta_keywords: values.product_tag_keywords.join(', ') ?? null,
      meta_description: values.meta_description,
      additional_information: values.additional_information,
      is_advertisement: 1,
      // is_completed: skuNumberData?.is_completed,
      // is_published: skuNumberData?.is_published
    };

    const id = clickedRowData?.id || '';
    setProductSubmitDataLoading(true);

    const message: string =
      isTableMode === 'edit' ? 'Updated successfully' : 'Created successfully';

    try {
      if (clickedRowData?.id) {
        await updateGeneralDetails(id, generalDetails);
        fetchDataForProfileView();
        toast.success(message);
        setProductSubmitDataLoading(false);

        if (isTableMode !== 'edit') {
          nextAndBackPage(1);
        }
      } else {
        toast.error('LAQ Item Master Item Code is required');
        setProductSubmitDataLoading(false);
      }
    } catch (error) {
      setProductSubmitDataLoading(false);
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
    resetForm: FormikHelpers<GeneralAdvGeneralViewSubmitDataType>['resetForm']
  ) => {
    resetForm({
      values: {
        short_description: '',
        long_description: '',
        product_tag_keywords: [],
        meta_description: '',
        additional_information: '',
      },
    });
  };

  return (
    <div className='min-w-full max-w-[100vw]'>
      <Paper className='p-[16px] mt-[-5px] rounded-[4px]'>
        <Formik
          enableReinitialize
          initialValues={{
            product_name: clickedRowData?.common_name || '',
            title: clickedRowData?.title || '',
            scientific_name: clickedRowData?.scientific_name || '',
            category: clickedRowData?.item_category?.name || '',
            short_description: clickedRowData?.short_description || '',
            meta_description: clickedRowData?.meta_description || '',
            long_description: clickedRowData?.long_description || '',
            additional_information:
              clickedRowData?.additional_information || '',
            product_tag_keywords:
              clickedRowData?.meta_keywords?.split(', ') || [],
          }}
          validationSchema={schema}
          onSubmit={handleUpdate}
        >
          {({ values, setValues, resetForm }) => {
            return (
              <Form>
                <Grid container spacing={2} className='pt-0'>
                  <Grid
                    item
                    xl={3}
                    lg={3}
                    md={6}
                    sm={6}
                    xs={12}
                    className='formikFormField pt-[5px!important]'
                    key='product_name'
                  >
                    <Typography className='formTypography'>
                      {t('PRODUCT_NAME')}
                    </Typography>
                    <Field
                      disabled
                      name='product_name'
                      placeholder=''
                      component={TextFormField}
                      fullWidth
                      size='small'
                    />
                  </Grid>
                  <Grid
                    item
                    xl={3}
                    lg={3}
                    md={6}
                    sm={6}
                    xs={12}
                    className='formikFormField pt-[5px!important]'
                    key='title'
                  >
                    <Typography className='formTypography'>
                      {t('TITLE')}
                      <span className='text-red'> *</span>
                    </Typography>
                    <Field
                      disabled
                      name='title'
                      placeholder=''
                      component={TextFormField}
                      fullWidth
                      size='small'
                    />
                  </Grid>
                  <Grid
                    item
                    xl={3}
                    lg={3}
                    md={6}
                    sm={6}
                    xs={12}
                    className='formikFormField pt-[5px!important]'
                    key='scientific_name'
                  >
                    <Typography className='formTypography'>
                      {t('SCIENTIFIC_NAME')}
                    </Typography>
                    <Field
                      disabled
                      name='scientific_name'
                      placeholder=''
                      component={TextFormField}
                      fullWidth
                      size='small'
                    />
                  </Grid>
                  <Grid
                    item
                    xl={3}
                    lg={3}
                    md={6}
                    sm={6}
                    xs={12}
                    className='formikFormField pt-[5px!important]'
                    key='category'
                  >
                    <Typography className='formTypography'>
                      {t('CATEGORY')}
                    </Typography>
                    <Field
                      disabled
                      name='category'
                      placeholder=''
                      component={TextFormField}
                      fullWidth
                      size='small'
                    />
                  </Grid>

                  {/* Editable Fields */}
                  <Grid
                    item
                    md={6}
                    sm={12}
                    xs={12}
                    className='formikFormField pt-[5px!important]'
                    key='short_description'
                  >
                    <Typography className='formTypography'>
                      {t('SHORT_DESCRIPTION')}
                      <span className='text-red'> *</span>
                    </Typography>
                    <Field
                      disabled={isTableMode === 'view'}
                      name='short_description'
                      placeholder=''
                      component={TextFormField}
                      fullWidth
                      size='small'
                      multiline
                    />
                  </Grid>
                  <Grid
                    item
                    md={6}
                    sm={12}
                    xs={12}
                    className='formikFormField pt-[5px!important]'
                    key='product_tag_keywords'
                  >
                    <Typography className='formTypography'>
                      {t('PRODUCT_TAG_KEYWORDS')}{' '}
                      <span className='text-[10px] sm:text-[12px] text-gray-600'>
                        {t('DO_NOT_DUPLICATE_TAGS')}
                      </span>
                    </Typography>
                    <Field
                      component={FormikMultipleSelectChip}
                      disabled={isTableMode === 'view'}
                      name='product_tag_keywords'
                      placeholder=''
                      fullWidth
                      size='small'
                    />
                  </Grid>
                  <Grid
                    item
                    md={6}
                    sm={12}
                    xs={12}
                    className='formikFormField pt-[5px!important]'
                    key='meta_description'
                  >
                    <Typography className='formTypography'>
                      {t('META_DESCRIPTION')}
                    </Typography>
                    <Field
                      disabled={isTableMode === 'view'}
                      name='meta_description'
                      placeholder=''
                      component={TextFormField}
                      fullWidth
                      multiline
                      rows={2}
                    />
                  </Grid>
                  <Grid
                    item
                    md={6}
                    sm={12}
                    xs={12}
                    className='formikFormField pt-[5px!important]'
                    key='long_description'
                  >
                    <Typography className='formTypography'>
                      {t('ADDITIONAL_INFORMATION')}
                    </Typography>
                    <Field
                      disabled={isTableMode === 'view'}
                      name='additional_information'
                      placeholder=''
                      component={TextFormField}
                      fullWidth
                      multiline
                      rows={2}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    className='formikFormField pt-[5px!important]'
                    key='additional_information'
                  >
                    <Typography className='formTypography'>
                      {t('LONG_DESCRIPTION')}
                      <span className='text-red'> *</span>
                    </Typography>
                    <Field
                      disabled={isTableMode === 'view'}
                      name='long_description'
                      placeholder=''
                      component={TextFormField}
                      fullWidth
                      multiline
                      rows={6}
                    />
                  </Grid>

                  <Grid
                    item
                    md={12}
                    sm={12}
                    xs={12}
                    className='flex justify-end items-center gap-[15px] pt-[10px!important]'
                  >
                    {isTableMode !== 'view' && (
                      <Button
                        className='flex justify-center items-center w-[100px] min-w-max min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80'
                        type='submit'
                        variant='contained'
                        color='primary'
                        fullWidth
                        disabled={false}
                      >
                        {isTableMode === 'edit' ? 'Update' : 'Save And Next'}
                        {isProductSubmitDataLoading ? (
                          <CircularProgress
                            className='text-white ml-[5px]'
                            size={24}
                          />
                        ) : null}
                      </Button>
                    )}

                    {isTableMode === 'view' ? null : (
                      <Button
                        className='resetButton !w-[100px] !min-w-[100px] !max-w-[100px]'
                        type='button'
                        variant='contained'
                        size='medium'
                        disabled={isTableMode === 'viewMode'}
                        onClick={() => handleClearForm(resetForm)}
                      >
                        {t('Reset')}
                      </Button>
                    )}
                  </Grid>
                </Grid>
              </Form>
            );
          }}
        </Formik>
      </Paper>
    </div>
  );
}

export default GeneralView;
