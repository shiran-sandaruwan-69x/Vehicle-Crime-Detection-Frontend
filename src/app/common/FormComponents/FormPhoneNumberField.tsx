/* eslint-disable */
import React from 'react';
import { useField } from 'formik';
import MuiPhoneNumber from 'material-ui-phone-number';
// import VerifiedIcon from '@mui/icons-material/Verified';
import NewReleasesIcon from '@mui/icons-material/NewReleases';

function FormPhoneNumberField({ name, id, onChange, ...props }) {
  const [field, meta, helpers] = useField(name);

  const handleOnChange = (value) => {
    helpers.setValue(value);

    if (onChange) {
      onChange(value);
    }
  };

  return (
    <div className='relative w-full'>
      <div className='verified-label flex justify-center items-center absolute top-1/2 right-[8px] w-[18px] h-[18px] -translate-y-1/2'>
        {/* <VerifiedIcon className='text-[18px] text-green-500' /> */}
        {/* <NewReleasesIcon className='text-[18px] text-red' /> */}
      </div>
      <MuiPhoneNumber
        {...field}
        {...props}
        defaultCountry='lk'
        onChange={handleOnChange}
        className='max-h-[40px!important]'
        fullWidth
        sx={{
          border: '1px solid #ccc',
          borderRadius: '2px',
          padding: '2px',
          '& .MuiInputBase-root.MuiInput-root.MuiInput-underline': {
            width: 'calc(100% - 20px)',
            minHeight: '34px',
            maxHeight: '34px',
            margin: '0 auto',
            '&::before': {
              content: 'none',
            },
            '&::after': {
              content: 'none',
            },
          },
        }}
      />
      {meta.touched && meta.error && (
        <div className='text-[10px] sm:text-[12px] text-red mt-[1px]'>
          {meta.error}
        </div>
      )}
    </div>
  );
}

export default FormPhoneNumberField;
