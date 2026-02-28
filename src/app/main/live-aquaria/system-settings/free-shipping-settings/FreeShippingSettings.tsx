import FuseLoading from '@fuse/core/FuseLoading/FuseLoading';
import { Button, Grid, Switch, Typography } from '@mui/material';
import axios, { AxiosResponse } from 'axios';
import { Form, Formik, FormikProps } from 'formik';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FREE_SHIPPING_SETTINGS } from 'src/app/axios/services/AdminServices';
import CustomFormTextField from 'src/app/common/FormComponents/CustomFormTextField';
import OrdersLogTableSystemSettings from 'src/app/common/OrdersLogTableSystemSettings';
import ExtendedAxiosError from 'src/app/types/ExtendedAxiosError';
import * as yup from 'yup';
import NavigationViewComp from '../../../../common/FormComponents/NavigationViewComp';

interface FormValues {
  is_active: boolean;
  treshold: string;
}

export interface FreeShippingSettingsResponse {
  id: number;
  label: string;
  category: string;
  value: string;
  is_active: number | boolean;
  logs: Log[];
}

export interface FreeShippingSettingsAfterSaveResponse {
  id: number;
  label: string;
  category: string;
  value: string;
  is_active: boolean;
  logs: Log[];
}

export interface Log {
  id: number;
  action: string;
  created_at: string;
}

function FreeShippingSettings() {
  // const [pageNo, setPageNo] = useState<number>(0);
  // const [pageSize, setPageSize] = useState<number>(5);
  // const [count] = useState<number>(100);
  const [loading, setLoading] = useState<boolean>(true);
  const [systemSettings, setSystemSettings] =
    useState<FreeShippingSettingsResponse>(null);
  useEffect(() => {
    fetchFreeShippingsSettings();
  }, []);

  const fetchFreeShippingsSettings = async () => {
    setLoading(true);
    try {
      const response: AxiosResponse<{ data: FreeShippingSettingsResponse }> =
        await axios.get(`${FREE_SHIPPING_SETTINGS}`);
      setSystemSettings(response.data.data);
    } catch (error: unknown) {
      const axiosError = error as ExtendedAxiosError;

      if (axiosError?.response?.data?.message) {
        toast.error(axiosError.response.data.message);
      } else if (axiosError.message) {
        toast.error(axiosError.message);
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSystemSettings = async (values: FormValues) => {
    setLoading(true);
    try {
      const to_update_data = {
        value: values.treshold,
        is_active: Boolean(values?.is_active),
      };
      const response: AxiosResponse<{ data: FreeShippingSettingsResponse }> =
        await axios.put(`${FREE_SHIPPING_SETTINGS}`, to_update_data);
      setSystemSettings(response.data.data);
      toast.success('Free shipping settings updated successfully');
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
      setLoading(false);
    }
  };

  const label = {
    inputProps: {
      'aria-label': `${systemSettings?.is_active ? 'Active' : 'Inactive'}`,
    },
  };

  const schema = yup.object().shape({
    treshold: yup
      .number()
      .required('Threshold is required')
      .typeError('Threshold must be a number')
      .positive('Threshold must be a positive number'),
  });

  return loading ? (
    <FuseLoading />
  ) : (
    <div className='min-w-full max-w-[100vw]'>
      <NavigationViewComp title='System Settings/Free Shipping Settings' />

      <Formik
        initialValues={{
          treshold: systemSettings?.value,
          is_active: systemSettings?.is_active,
        }}
        onSubmit={handleUpdateSystemSettings}
        validationSchema={schema}
        enableReinitialize
      >
        {({ setFieldValue, values }: FormikProps<FormValues>) => (
          <Form>
            <Grid container spacing={2} className='pt-[10px] pr-[30px] mx-auto'>
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={4}
                xl={3}
                className='formikFormField pt-[5px!important]'
              >
                <Typography className='formTypography'>
                  Current Threshold Value
                </Typography>
                <CustomFormTextField
                  name='treshold'
                  id='treshold'
                  type='number'
                  placeholder=''
                  disabled={false}
                  // changeInput={changeArticleId}
                />
                <Typography className='formTypography text-[10px] text-gray-700 italic'>
                  <b className='text-red'>Note: </b>(Enter the new $ amount to
                  update the shipping threshold value).
                </Typography>
              </Grid>

              <Grid
                item
                xs={12}
                sm={3}
                md={4}
                lg={4}
                xl={2}
                className='formikFormField pt-[5px!important]'
              >
                <Typography className='formTypography'>
                  Free Shipping Threshold
                </Typography>

                <div className='flex justify-between items-center gap-x-[15px] sm:gap-x-[30px] w-full'>
                  <div className='flex items-center gap-[10px] w-full max-w-max'>
                    <p
                      className={`text-[12px] lg:text-[14px] text-gray-700 m-0 ${Boolean(values.is_active) === true ? 'opacity-40' : 'opacity-100'}`}
                    >
                      Disabled
                    </p>
                    <Switch
                      className='mt-[2px]'
                      {...label}
                      defaultChecked={Boolean(values.is_active) === true}
                      onChange={(e) =>
                        setFieldValue('is_active', e.target.checked)
                      }
                      size='medium'
                      sx={{
                        '& .Mui-checked .MuiSwitch-thumb': {
                          backgroundColor: '#387ed4',
                        },
                        '& .muiltr-kpgjex-MuiButtonBase-root-MuiSwitch-switchBase.Mui-checked+.MuiSwitch-track':
                          {
                            backgroundColor: '#387ed4',
                          },
                      }}
                    />
                    {/* {systemSettings?.is_active ? 'Active' : 'Inactive'} */}
                    <p
                      className={`text-[12px] lg:text-[14px] text-gray-700 m-0 ${Boolean(values.is_active) === true ? 'opacity-100' : 'opacity-40'}`}
                    >
                      Enabled
                    </p>
                  </div>
                  {/* <Button
                    className='flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80'
                    type='submit'
                    variant='contained'
                    size='medium'
                    disabled={false}
                  >
                    Update
                  </Button> */}
                </div>
              </Grid>
              <Grid
                item
                xs={12}
                sm={3}
                md={4}
                lg={4}
                xl={7}
                className='flex justify-end formikFormField pt-[10px!important] sm:!pt-[26px]'
              >
                <Button
                  className='flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80'
                  type='submit'
                  variant='contained'
                  size='medium'
                  disabled={false}
                >
                  Update
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>

      <Grid container spacing={2} className='pt-[20px] pr-[30px] mx-auto'>
        <Grid item md={12} sm={12} xs={12} className='pt-[5px!important]'>
          {systemSettings.logs && systemSettings.logs.length > 0 && (
            <OrdersLogTableSystemSettings tableData={systemSettings.logs} />
          )}
        </Grid>
      </Grid>
    </div>
  );
}

export default FreeShippingSettings;
