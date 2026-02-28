import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Field, Form, Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import axios from 'axios';
import { SYSTEM_SETTINGS_COMPANIES } from 'src/app/axios/services/AdminServices';
import { toast } from 'react-toastify';
import ExtendedAxiosError from 'src/app/types/ExtendedAxiosError';
import TextFormField from '../../../../../common/FormComponents/FormTextField';
import { LAQCompanyInterface } from '../LAQCompaniesDetails';

interface companyDetailsProps {
  toggleModal: () => void;
  isOpen: boolean;
  clickedRowData: LAQCompanyInterface;
  isView: boolean;
  isEdit: boolean;
}

function CompanyDetails({
  toggleModal,
  isOpen,
  clickedRowData,
  isView,
  isEdit,
}: companyDetailsProps) {
  const { t } = useTranslation('cancelOrders');
  const onSubmit = async (values) => {
    try {
      await axios.put(
        `${SYSTEM_SETTINGS_COMPANIES}/${clickedRowData.id}`,
        values
      );
      toast.success('Company updated successfully');
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
      toggleModal();
    }
  };

  const Schema = Yup.object().shape({
    code: Yup.string()
      .required('Code is required')
      .min(3, 'Code must be at least 3 characters'),
    name: Yup.string()
      .required('Name is required')
      .min(3, 'Name must be at least 3 characters'),
    address_line_1: Yup.string()
      .required('Address Line 1 is required')
      .min(3, 'Address Line 1 must be at least 3 characters'),
    address_line_2: Yup.string()
      .required('Address Line 2 is required')
      .min(3, 'Address Line 2 must be at least 3 characters'),
    zip_code: Yup.string()
      .required('Zip Code is required')
      .typeError('Zip Code is required'),
    state: Yup.string()
      .required('State is required')
      .typeError('State is required'),
    country_code: Yup.string()
      .required('Country is required')
      .typeError('Country is required'),
    phone1: Yup.string()
      .required('Phone is required')
      .typeError('Phone is required'),
  });

  const getTitle = (value: string): string => {
    if (isEdit) {
      return `Edit ${value}`;
    }

    if (isView) {
      return `View ${value}`;
    }

    return `Add ${value}`;
  };

  return (
    <Dialog
      fullWidth
      open={isOpen}
      maxWidth='lg'
      onClose={toggleModal}
      PaperProps={{
        style: {
          top: '40px',
          margin: 0,
          position: 'absolute',
        },
      }}
    >
      <DialogTitle className='pb-0'>
        <h6 className='text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-400'>
          {getTitle('Company Details')}
        </h6>
      </DialogTitle>
      <DialogContent>
        <Formik
          initialValues={{
            code: clickedRowData ? clickedRowData?.code : '',
            name: clickedRowData ? clickedRowData?.name : '',
            description: clickedRowData ? clickedRowData?.description : '',
            registration_no: clickedRowData
              ? clickedRowData?.registration_no
              : '',
            tax_no: clickedRowData ? clickedRowData?.tax_no : '',
            address_line_1: clickedRowData
              ? clickedRowData?.address_line_1
              : '',
            address_line_2: clickedRowData
              ? clickedRowData?.address_line_2
              : '',
            address_line_3: clickedRowData
              ? clickedRowData?.address_line_3
              : '',
            zip_code: clickedRowData ? clickedRowData?.zip_code : '',
            city: clickedRowData ? clickedRowData?.city : '',
            state: clickedRowData ? clickedRowData?.state : '',
            country_code: clickedRowData ? clickedRowData?.country_code : '',
            email: clickedRowData ? clickedRowData?.email : '',
            phone1: clickedRowData ? clickedRowData?.phone1 : '',
            phone2: clickedRowData ? clickedRowData?.phone2 : '',
            fax: clickedRowData ? clickedRowData?.fax : '',
            web: clickedRowData ? clickedRowData?.web : '',
            is_active: 1,
          }}
          validationSchema={Schema}
          onSubmit={onSubmit}
        >
          <Form>
            <Grid container spacing={2} className='pt-[10px]'>
              <Grid
                item
                lg={4}
                md={4}
                sm={6}
                xs={12}
                className='formikFormField pt-[5px!important]'
              >
                <Typography className='formTypography'>
                  {t('COMPANY_NAME')}
                  <span className='text-red'> *</span>
                </Typography>
                <Field
                  disabled={isView}
                  name='name'
                  placeholder={t('')}
                  component={TextFormField}
                  fullWidth
                  size='small'
                />
              </Grid>
              <Grid
                item
                lg={4}
                md={4}
                sm={6}
                xs={12}
                className='formikFormField pt-[5px!important]'
              >
                <Typography className='formTypography'>
                  {t('COMPANY_MOBILE_NO')}
                  <span className='text-red'> *</span>
                </Typography>
                <Field
                  disabled={isView}
                  name='phone1'
                  placeholder={t('')}
                  component={TextFormField}
                  fullWidth
                  size='small'
                />
              </Grid>
              <Grid
                item
                lg={4}
                md={4}
                sm={6}
                xs={12}
                className='formikFormField pt-[5px!important]'
              >
                <Typography className='formTypography'>
                  {t('COMPANY_CODE')}
                  <span className='text-red'> *</span>
                </Typography>
                <Field
                  disabled={isView}
                  name='code'
                  placeholder={t('')}
                  component={TextFormField}
                  fullWidth
                  size='small'
                />
              </Grid>
              <Grid
                item
                lg={4}
                md={4}
                sm={6}
                xs={12}
                className='formikFormField pt-[5px!important]'
              >
                <Typography className='formTypography'>
                  {t('ADDRESS_LINE_1')}
                  <span className='text-red'> *</span>
                </Typography>
                <Field
                  disabled={isView}
                  name='address_line_1'
                  placeholder={t('')}
                  component={TextFormField}
                  fullWidth
                  size='small'
                />
              </Grid>
              <Grid
                item
                lg={4}
                md={4}
                sm={6}
                xs={12}
                className='formikFormField pt-[5px!important]'
              >
                <Typography className='formTypography'>
                  {t('ADDRESS_LINE_2')}
                  <span className='text-red'> *</span>
                </Typography>
                <Field
                  disabled={isView}
                  name='address_line_2'
                  placeholder={t('')}
                  component={TextFormField}
                  fullWidth
                  size='small'
                />
              </Grid>
              <Grid
                item
                lg={4}
                md={4}
                sm={6}
                xs={12}
                className='formikFormField pt-[5px!important]'
              >
                <Typography className='formTypography'>
                  {t('ADDRESS_LINE_3')}
                </Typography>
                <Field
                  disabled={isView}
                  name='address_line_3'
                  placeholder={t('')}
                  component={TextFormField}
                  fullWidth
                  size='small'
                />
              </Grid>

              <Grid
                item
                lg={4}
                md={4}
                sm={6}
                xs={12}
                className='formikFormField pt-[5px!important]'
              >
                <Typography className='formTypography'>
                  {t('COUNTRY')}
                  <span className='text-red'> *</span>
                </Typography>
                <Field
                  disabled={isView}
                  name='country_code'
                  placeholder={t('')}
                  component={TextFormField}
                  fullWidth
                  size='small'
                />
              </Grid>
              <Grid
                item
                lg={4}
                md={4}
                sm={6}
                xs={12}
                className='formikFormField pt-[5px!important]'
              >
                <Typography className='formTypography'>
                  {t('STATE')}
                  <span className='text-red'> *</span>
                </Typography>
                <Field
                  disabled={isView}
                  name='state'
                  placeholder={t('')}
                  component={TextFormField}
                  fullWidth
                  size='small'
                />
              </Grid>
              <Grid
                item
                lg={4}
                md={4}
                sm={6}
                xs={12}
                className='formikFormField pt-[5px!important]'
              >
                <Typography className='formTypography'>
                  {t('POSTAL_ZIP_CODE')}
                  <span className='text-red'> *</span>
                </Typography>
                <Field
                  disabled={isView}
                  name='zip_code'
                  placeholder={t('')}
                  component={TextFormField}
                  fullWidth
                  size='small'
                />
              </Grid>

              {/* <Grid
                item
                lg={4}
                md={4}
                sm={6}
                xs={12}
                className='formikFormField pt-[5px!important]'
              >
                <Typography className='formTypography'>
                  {t('ADDRESS_LINE_3')}
                  <span className='text-red'> *</span>
                </Typography>
                <Field
                  disabled={isView}
                  name='addressLine3'
                  placeholder={t('')}
                  component={TextFormField}
                  fullWidth
                  size='small'
                />
              </Grid> */}
              <Grid
                item
                xs={12}
                className='flex justify-end items-start gap-[10px] formikFormField pt-[15px!important]'
              >
                {isEdit && (
                  <Button
                    type='submit'
                    className='flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80'
                  >
                    Update
                  </Button>
                )}
                <Button
                  onClick={toggleModal}
                  className='flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80 boxShadow'
                >
                  Close
                </Button>
              </Grid>
            </Grid>
          </Form>
        </Formik>
      </DialogContent>
    </Dialog>
  );
}

export default CompanyDetails;
