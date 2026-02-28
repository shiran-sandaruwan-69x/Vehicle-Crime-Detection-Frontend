import FuseLoading from '@fuse/core/FuseLoading/FuseLoading';
import { Button, Grid, Switch, Typography } from '@mui/material';
import axios, { AxiosResponse } from 'axios';
import { Form, Formik, FormikProps } from 'formik';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  SYSTEM_SETTINGS_DIVERS_DEN_DAILY_TIME,
  SYSTEM_SETTINGS_DIVERS_DEN_SNEAL_PEEK_TIME,
} from 'src/app/axios/services/AdminServices';
import CustomFormTextField from 'src/app/common/FormComponents/CustomFormTextField';
import OrdersLogTableSystemSettings from 'src/app/common/OrdersLogTableSystemSettings';
import ExtendedAxiosError from 'src/app/types/ExtendedAxiosError';
import NavigationViewComp from '../../../../common/FormComponents/NavigationViewComp';

interface FormValuesSneakPeekTimeSettings {
  is_active: number;
  time: string;
}

interface FormValuesDailyEmailTimeSettings {
  is_active: number;
  time: string;
}

export interface DiversDenSettingsResponseInterface {
  id: number;
  label: string;
  category: string;
  value: string;
  is_active: number | boolean;
  logs: Log[];
}

export interface Log {
  id: number;
  action: string;
  created_at: string;
}

function DiversDenSettings() {
  // const [pageNo, setPageNo] = useState<number>(0);
  // const [pageSize, setPageSize] = useState<number>(5);
  // const [count] = useState<number>(100);
  const [loading, setLoading] = useState<boolean>(true);
  const [sneakPeekTimeSettings, setSneakPeekTimeSettings] =
    useState<DiversDenSettingsResponseInterface>(null);
  const [dailyEmailTimeSettings, setDailyEmailTimeSettings] =
    useState<DiversDenSettingsResponseInterface>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchSneakPeekTimeSettings(),
          fetchDailyEmailTimeSettings(),
        ]);
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

    fetchData();
  }, []);

  const formatTime = (time: string) => {
    // Ensure the time is in HH:mm format
    const [hours, minutes] = time.split(':');
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
  };

  const fetchSneakPeekTimeSettings = async () => {
    try {
      const response: AxiosResponse<{
        data: DiversDenSettingsResponseInterface;
      }> = await axios.get(`${SYSTEM_SETTINGS_DIVERS_DEN_SNEAL_PEEK_TIME}`);
      setSneakPeekTimeSettings(response.data.data);
    } catch (error: unknown) {
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

  const fetchDailyEmailTimeSettings = async () => {
    try {
      const response: AxiosResponse<{
        data: DiversDenSettingsResponseInterface;
      }> = await axios.get(`${SYSTEM_SETTINGS_DIVERS_DEN_DAILY_TIME}`);
      setDailyEmailTimeSettings(response.data.data);
    } catch (error: unknown) {
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

  const handleUpdateSneakPeekTimeSettings = async (
    values: FormValuesSneakPeekTimeSettings
  ) => {
    setLoading(true);
    try {
      const to_update_data = {
        value: values.time,
        is_active: Boolean(values?.is_active),
      };
      const response: AxiosResponse<{
        data: DiversDenSettingsResponseInterface;
      }> = await axios.put(
        `${SYSTEM_SETTINGS_DIVERS_DEN_SNEAL_PEEK_TIME}`,
        to_update_data
      );
      setSneakPeekTimeSettings(response.data.data);
      toast.success('Divers Den Sneak Peek settings updated successfully');
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

  const handleUpdateDailyEmailTimeSettings = async (
    values: FormValuesDailyEmailTimeSettings
  ) => {
    setLoading(true);
    try {
      const to_update_data = {
        value: values.time,
        is_active: Boolean(values?.is_active),
      };
      const response: AxiosResponse<{
        data: DiversDenSettingsResponseInterface;
      }> = await axios.put(
        `${SYSTEM_SETTINGS_DIVERS_DEN_DAILY_TIME}`,
        to_update_data
      );
      setDailyEmailTimeSettings(response.data.data);
      toast.success('Divers Den Daily Email settings updated successfully');
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

  const labelForSneakPeak = {
    inputProps: {
      'aria-label': `${sneakPeekTimeSettings?.is_active ? 'Active' : 'Inactive'}`,
    },
  };

  const labelForDailyEmail = {
    inputProps: {
      'aria-label': `${dailyEmailTimeSettings?.is_active ? 'Active' : 'Inactive'}`,
    },
  };

  return loading ? (
    <FuseLoading />
  ) : (
    <div className='min-w-full max-w-[100vw]'>
      <NavigationViewComp title="System Settings/Diver's Den Settings" />

      <div className='w-full max-w-[100vw]'>
        <Formik
          initialValues={{
            time: sneakPeekTimeSettings?.value
              ? formatTime(sneakPeekTimeSettings?.value)
              : '',
            is_active: sneakPeekTimeSettings?.is_active,
          }}
          onSubmit={handleUpdateSneakPeekTimeSettings}
        >
          {({
            setFieldValue,
            values,
          }: FormikProps<FormValuesSneakPeekTimeSettings>) => (
            <Form>
              <Grid
                container
                spacing={2}
                className='pt-[10px] pr-[30px] mx-auto'
              >
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
                    Sneak Peek Email
                  </Typography>
                  <CustomFormTextField
                    name='time'
                    id='time'
                    type='time'
                    placeholder=''
                    disabled={false}
                    // changeInput={changeArticleId}
                  />
                  <Typography className='formTypography text-[10px] text-gray-700 italic'>
                    <b className='text-red'>Note: </b>(Update time in Sneak Peek
                    email).
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
                    Email Time Scheduler
                  </Typography>

                  <div className='flex justify-between items-center gap-x-[15px] w-full'>
                    <div className='flex items-center gap-[10px] w-full max-w-max'>
                      <p
                        className={`text-[12px] lg:text-[14px] text-gray-700 m-0 ${Boolean(values.is_active) === true ? 'opacity-40' : 'opacity-100'}`}
                      >
                        Disabled
                      </p>
                      <Switch
                        className='mt-[2px]'
                        {...labelForSneakPeak}
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
                      {/* {sneakPeekTimeSettings?.is_active ? 'ON' : 'OFF'} */}
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
            {sneakPeekTimeSettings.logs &&
              sneakPeekTimeSettings.logs.length > 0 && (
                <OrdersLogTableSystemSettings
                  tableData={sneakPeekTimeSettings.logs}
                />
              )}
          </Grid>

          <Grid item xs={12} className='formikFormField pt-[20px!important]'>
            <hr />
          </Grid>
        </Grid>
      </div>

      <div className='w-full max-w-[100vw] mt-[20px]'>
        <Formik
          initialValues={{
            time: dailyEmailTimeSettings?.value
              ? formatTime(dailyEmailTimeSettings?.value)
              : '',
            is_active: dailyEmailTimeSettings?.is_active,
          }}
          onSubmit={handleUpdateDailyEmailTimeSettings}
        >
          {({
            setFieldValue,
            values,
          }: FormikProps<FormValuesDailyEmailTimeSettings>) => (
            <Form>
              <Grid
                container
                spacing={2}
                className='pt-[10px] pr-[30px] mx-auto'
              >
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
                    Daily Email
                  </Typography>
                  <CustomFormTextField
                    name='time'
                    id='time'
                    type='time'
                    placeholder=''
                    disabled={false}
                    // changeInput={changeArticleId}
                  />
                  <Typography className='formTypography text-[10px] text-gray-700 italic'>
                    <b className='text-red'>Note: </b>(Update time in Daily
                    email).
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
                    Email Time Scheduler
                  </Typography>
                  <div className='flex justify-between items-center gap-x-[15px] w-full'>
                    <div className='flex items-center gap-[10px] w-full max-w-max'>
                      <p
                        className={`text-[12px] lg:text-[14px] text-gray-700 m-0 ${Boolean(values.is_active) === true ? 'opacity-40' : 'opacity-100'}`}
                      >
                        Disabled
                      </p>
                      <Switch
                        className='mt-[2px]'
                        {...labelForDailyEmail}
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
                      {/* {dailyEmailTimeSettings?.is_active ? 'ON' : 'OFF'} */}
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
            {dailyEmailTimeSettings.logs &&
              dailyEmailTimeSettings.logs.length > 0 && (
                <OrdersLogTableSystemSettings
                  tableData={dailyEmailTimeSettings.logs}
                />
              )}
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default DiversDenSettings;
