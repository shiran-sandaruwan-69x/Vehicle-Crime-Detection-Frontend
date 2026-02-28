import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { FormControlLabel, Grid, Switch, Typography } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import clsx from 'clsx';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import { FOOTER_LAYOUT } from 'src/app/axios/services/AdminServices';
import { toast } from 'react-toastify';
import ExtendedAxiosError from 'src/app/types/ExtendedAxiosError';
import Editor from '@monaco-editor/react';

interface GeneralPageFormData {
  id?: number;
  name: string;
  css: string;
  content: string;
  is_active: number;
}

const schema = z.object({
  name: z.string().min(1, 'Required'),
  css: z.string().min(3, 'Must be at least 3 characters'),
  content: z.string().min(3, 'Must be at least 3 characters'),
  is_active: z.number(),
});

interface Props {
  isAdd: boolean;
  className?: string;
  isOpen: boolean;
  setIsFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isEdit?: boolean;
  selectedRow?: GeneralPageFormData;
  onCloseHandler?: () => void;
  isView?: boolean;
  userRoles?: { value: number; label: string }[];
}

function FooterLayoutForm(props: Props) {
  const {
    isAdd,
    className,
    isOpen,
    setIsFormOpen,
    isEdit,
    selectedRow,
    onCloseHandler,
    isView,
  } = props;
  const [openDialog, setOpenDialog] = useState(isOpen);
  const [loading, setLoading] = useState(false);
  const [fullWidth] = useState(true);
  const defaultValues = selectedRow || null;
  const { handleSubmit, formState, control } = useForm<GeneralPageFormData>({
    mode: 'onChange',
    defaultValues,
    resolver: zodResolver(schema),
  });

  const { errors } = formState;

  function handleCloseDialog() {
    setOpenDialog(false);
    setIsFormOpen(false);
    onCloseHandler();
  }

  function onSubmit(data: GeneralPageFormData) {
    if (isEdit) {
      updateGeneralPage(data);
    } else {
      saveGeneralPage(data);
    }
  }

  async function saveGeneralPage(data: GeneralPageFormData) {
    setLoading(true);
    try {
      await axios.post(FOOTER_LAYOUT, data);
      toast.success('Footer Layout created successfully');
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
      onCloseHandler();
    }
  }

  async function updateGeneralPage(data: GeneralPageFormData) {
    setLoading(true);
    try {
      await axios.put(`${FOOTER_LAYOUT}/${selectedRow.id}`, data);
      toast.success('Footer Layout updated successfully');
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
      onCloseHandler();
    }
  }

  const getTitle = (value: string): string => {
    if (isEdit) {
      return `Edit ${value}`;
    }

    if (isView) {
      return `View ${value}`;
    }

    return `Add ${value}`;
  };

  return loading ? (
    <div className='flex justify-center items-center w-[111.2vw] h-[111.2svh] fixed top-0 left-0 z-[10000] bg-white/95'>
      <div className='flex flex-col items-center justify-center w-full gap-4'>
        <div className='w-[60px] h-[60px] border-4 border-transparent text-primaryPurple text-4xl animate-spin flex items-center justify-center border-t-primaryPurple rounded-full'>
          <div className='w-[50px] h-[50px] border-4 border-transparent text-primaryPurple text-2xl animate-spin flex items-center justify-center border-t-primaryPurple rounded-full' />
        </div>
      </div>
    </div>
  ) : (
    <div className={clsx('', className)}>
      <Dialog
        fullWidth={fullWidth}
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby='form-dialog-title'
        scroll='body'
        maxWidth='xl'
      >
        <DialogTitle className='pb-0'>
          <h6 className='text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-400'>
            {getTitle('Footer Layout')}
          </h6>
        </DialogTitle>

        <DialogContent>
          <form noValidate onSubmit={handleSubmit(onSubmit)} className='w-full'>
            <Grid container spacing={2} className='!pt-[10px]'>
              <Grid
                item
                lg={6}
                md={6}
                sm={6}
                xs={12}
                className='formikFormField pt-[5px!important]'
              >
                <Typography className='formTypography'>
                  Name
                  <span className='text-red-500'>*</span>
                </Typography>
                <Controller
                  name='name'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className='m-0'
                      // label='Name'
                      id='name'
                      variant='outlined'
                      fullWidth
                      size='small'
                      error={!!errors.name}
                      helperText={errors?.name?.message}
                      required
                      disabled={isView}
                    // inputProps={{ readOnly: true }}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} className='!pt-[15px]'>
              <Grid
                item
                xs={12}
                md={12}
                lg={6}
                className='formikFormField pt-[5px!important]'
              >
                <Typography className='formTypography' classes='!mb-[5px]'>
                  Add Your HTML Code Here
                </Typography>
                <Controller
                  name='content'
                  control={control}
                  render={({ field }) => (
                    <div className='w-full h-[400px] border rounded-[12px] overflow-hidden'>
                      <Editor
                        height='400px'
                        language='html'
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        theme='vs-light'
                        options={{
                          readOnly: isView, // Disable if in view mode
                          minimap: { enabled: false }, // Hide minimap for cleaner UI
                          lineNumbers: 'on',
                        }}
                      />
                      {errors.content && (
                        <p style={{ color: 'red' }}>{errors.content.message}</p>
                      )}
                    </div>
                  )}
                />
                {errors.content && (
                  <p style={{ color: 'red' }}>{errors.content.message}</p>
                )}
              </Grid>

              <Grid
                item
                xs={12}
                md={12}
                lg={6}
                className='formikFormField pt-[5px!important]'
              >
                <Typography className='formTypography' classes='!mb-[5px]'>
                  Add Your CSS Styles Here
                </Typography>
                <Controller
                  name='css'
                  control={control}
                  render={({ field }) => (
                    <div className='w-full h-[400px] border rounded-[12px] overflow-hidden'>
                      <Editor
                        height='400px'
                        language='css'
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        theme='vs-light'
                        options={{
                          readOnly: isView, // Disable if in view mode
                          minimap: { enabled: false }, // Hide minimap for cleaner UI
                          lineNumbers: 'on',
                        }}
                      />
                      {errors.css && (
                        <p style={{ color: 'red' }}>{errors.css.message}</p>
                      )}
                    </div>
                  )}
                />
                {errors.css && (
                  <p style={{ color: 'red' }}>{errors.css.message}</p>
                )}
              </Grid>

              <Grid
                item
                xs={12}
                md={12}
                className='flex justify-end items-center gap-[16px] py-[10px!important]'
              >
                <Controller
                  name='is_active'
                  control={control}
                  defaultValue={0}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Switch
                          {...field}
                          defaultChecked={field.value === 1}
                          disabled={isView}
                          onChange={(e) =>
                            field.onChange(e.target.checked === true ? 1 : 0)
                          }
                          size='small'
                          sx={{
                            '& .muiltr-kpgjex-MuiButtonBase-root-MuiSwitch-switchBase.Mui-checked+.MuiSwitch-track':
                            {
                              backgroundColor: '#387ed4',
                            },
                          }}
                        />
                      }
                      label={`Footer is ${field.value === 1 ? 'Active' : 'Inactive'}`}
                    />
                  )}
                />
              </Grid>

              <Grid
                item
                xs={12}
                md={12}
                className='flex flex-wrap justify-end items-end gap-[10px] pt-[10px!important]'
              >
                {!isView && (
                  <Button
                    className='flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80'
                    type='submit'
                    variant='contained'
                    size='medium'
                    // disabled={_.isEmpty(dirtyFields) || !isValid}
                    disabled={loading}
                  >
                    {loading && <CircularProgress size={16} />}
                    {isEdit ? 'Update' : 'Save'}
                  </Button>
                )}

                <Button
                  type='button'
                  variant='contained'
                  size='medium'
                  // disabled={_.isEmpty(dirtyFields) || !isValid}
                  onClick={handleCloseDialog}
                  className='flex justify-center items-center min-w-[80px] sm:min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80'
                >
                  Close
                </Button>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default FooterLayoutForm;
