import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Grid from '@mui/material/Grid';
import { Field, Form, Formik } from 'formik';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import CancelIcon from '@mui/icons-material/Cancel';
import IconButton from '@mui/material/IconButton';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { CircularProgress, Switch } from '@mui/material';
import FormDropdown from 'src/app/common/FormComponents/FormDropdown';
import axios from 'axios';
import { VIDEO_LIBRARY } from 'src/app/axios/services/AdminServices';
import ExtendedAxiosError from 'src/app/types/ExtendedAxiosError';
import TextFormField from '../../../../../common/FormComponents/FormTextField';
import { VediosLibraryInterface } from '../interfaces';

interface Props {
  toggleModal: () => void;
  isOpen: boolean;
  seletedRowData: VediosLibraryInterface;
  topics: { value: number; label: string }[];
  isAdd: boolean;
  isEdit: boolean;
  isView: boolean;
  // getCancelOrderReasons: () => void;
}

interface schemaInterface {
  title: string;
  type: string;
  topic: string | number;
  videoUrl: string;
}

function VideoLibraryDialogForm({
  toggleModal,
  isOpen,
  seletedRowData,
  topics,
  isAdd,
  isEdit,
  isView,
}: Props) {
  const { t } = useTranslation('videoLibrary');
  const [isCancelOrderReasonsDataLoading] = useState(false);

  const maxImageCount = 1;
  const maxImageSize = 5 * 1024 * 1024; // 5MB
  const maxVideoCount = 1;
  const maxVideoSize = 50 * 1024 * 1024; // 50MB
  const [images, setImages] = useState<{ file: File; base64: string }[]>(
    isEdit || isView
      ? [
          {
            file: null,
            base64: seletedRowData?.image,
          },
        ]
      : []
  );
  const [videos, setVideos] = useState<{ file: File; base64: string }[]>([]);
  const [, setIsSaveEnabled] = useState(false);

  const [, setVideoUrl] = useState(''); // For the video URL input
  const [isLinkMode, setIsLinkMode] = useState(
    seletedRowData?.type === 'video_link'
  ); // Track the toggle state

  useEffect(() => {
    if (seletedRowData) {
      fetchImageAndConvertBase64(seletedRowData?.image);

      if (seletedRowData?.type === 'video') {
        fetchAndConvertToBase64(seletedRowData?.video);
      }
    }
  }, [seletedRowData]);

  const fetchImageAndConvertBase64 = async (image: string) => {
    try {
      const response = await fetch(image);
      const blob = await response.blob();

      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        setImages([{ file: null, base64: reader.result as string }]);
      };
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

  const fetchAndConvertToBase64 = async (videoUrl: string) => {
    try {
      const response = await fetch(videoUrl);
      const blob = await response.blob();

      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        setVideos([{ file: null, base64: reader.result as string }]);
      };
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

  const onSubmit = async (values: schemaInterface) => {
    if (images.length === 0) {
      toast.error('Please upload an image');
      return;
    }

    if (!isLinkMode && videos.length === 0) {
      toast.error('Please upload a video');
      return;
    }

    if (isAdd) {
      try {
        const data = {
          video_library_topic_id: values?.topic,
          title: values?.title,
          is_active: 1,
          image: images[0].base64,
          video: isLinkMode ? values?.videoUrl : videos[0].base64,
        };
        await axios.post(VIDEO_LIBRARY, data);
        toast.success('Created successfully');
        toggleModal();
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
    }

    if (isEdit) {
      try {
        const data = {
          video_library_topic_id: values?.topic,
          title: values?.title,
          is_active: seletedRowData?.is_active,
          image: images[0].base64,
          video: isLinkMode ? values?.videoUrl : videos[0].base64,
        };

        await axios.put(`${VIDEO_LIBRARY}/${seletedRowData?.id}`, data);
        toast.success('Updated Successfully');
        toggleModal();
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
    }
  };

  const schema = yup.object().shape({
    topic: yup.string().required(t('Topic is required')),
    title: yup.string().required(t('Title is required')),
    videoUrl: isLinkMode
      ? yup.string().url('Invalid URL').required('Video URL is required')
      : yup.string().notRequired(),
  });

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { files } = event.target;

    if (files) {
      if (images.length + files.length > maxImageCount) {
        toast.error(
          `You can only upload a maximum of ${maxImageCount} images.`
        );
        return;
      }

      // const validImages: { file: File; base64: string }[] = [];
      // for (const file of Array.from(files)) {
      // 	const isValid = await validateImageDimensions(file);

      // 	if (isValid) {
      // 		const base64 = await convertToBase64(file);
      // 		validImages.push({ file, base64 });
      // 	}
      // }

      const validImages = await Promise.all(
        Array.from(files).map(async (file) => {
          const isValid = await validateImageDimensions(file);
          return isValid ? { file, base64: await convertToBase64(file) } : null;
        })
      ).then((results) => results.filter(Boolean));

      if (validImages.length > 0) {
        setImages([...images, ...validImages]);
        setIsSaveEnabled(true);
      }
    }
  };

  const validateImageDimensions = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        if (img.width === img.height && file.size <= maxImageSize) {
          // if (file.size <= maxImageSize) {
          resolve(true);
        }
        // else {
        // 	toast.error('Image upload failed: Width and height must be the same, and size should be <= 5MB.');
        // 	resolve(false);
        // }
        else if (img.width !== img.height) {
          toast.error(
            'Image upload failed: Width and height must be the same.'
          );
          resolve(false);
        } else if (file.size > maxImageSize) {
          toast.error('Image upload failed: Size should be <= 5MB.');
          resolve(false);
        }
      };
    });
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleVideoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { files } = event.target;

    if (files) {
      if (videos.length + files.length > maxVideoCount) {
        toast.error(
          `You can only upload a maximum of ${maxVideoCount} videos.`
        );
        return;
      }

      const validVideos: { file: File; base64: string }[] = [];
      // eslint-disable-next-line no-restricted-syntax
      for (const file of Array.from(files)) {
        // eslint-disable-next-line no-await-in-loop
        const isValid = await validateVideo(file);

        if (isValid) {
          // eslint-disable-next-line no-await-in-loop
          const base64 = await videoConvertToBase64(file);
          validVideos.push({ file, base64 });
        }
      }

      if (validVideos.length > 0) {
        setVideos([...videos, ...validVideos]);
      }
    }
  };

  const validateVideo = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.src = URL.createObjectURL(file);

      video.onloadedmetadata = () => {
        if (file.size <= maxVideoSize) {
          resolve(true);
        } else {
          toast.error(
            `Video size must be <= ${maxVideoSize / (1024 * 1024)}MB.`
          );
          resolve(false);
        }
      };

      video.onerror = () => {
        toast.error('Invalid video file.');
        resolve(false);
      };
    });
  };

  const videoConvertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    setIsSaveEnabled(newImages.length > 0);
  };

  const handleRemoveVideo = (index: number) => {
    const newVideo = videos.filter((_, i) => i !== index);
    setVideos(newVideo);
    setIsSaveEnabled(newVideo.length > 0);
  };

  const handleToggleChange = () => {
    setIsLinkMode(!isLinkMode);
    setVideos([]); // Clear videos if switching to link mode
    setVideoUrl(''); // Clear video URL if switching back to file upload
  };

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
      // PaperProps={{
      //     style: {
      //         top: '40px',
      //         margin: 0,
      //         position: 'absolute',
      //     },
      // }}
    >
      <DialogTitle className='pb-0'>
        <h2 className='text-sm md:text-base lg:text-lg text-gray-700 font-semibold'>
          {getTitle('Video Library')}
        </h2>
      </DialogTitle>
      <DialogContent>
        <Formik
          initialValues={{
            topic: seletedRowData?.video_library_topic?.id || '',
            title: seletedRowData?.title || '',
            videoUrl:
              seletedRowData?.type === 'video_link'
                ? seletedRowData?.video
                : '',
            type: seletedRowData?.type || '',
            // Need to add data as per our api
          }}
          validationSchema={schema}
          onSubmit={onSubmit}
        >
          {({ setFieldValue }) => (
            <Form>
              <Grid container spacing={2} className='pt-[10px]'>
                <Grid
                  item
                  md={6}
                  sm={12}
                  xs={12}
                  className='formikFormField pt-[5px!important]'
                >
                  <Typography className='formTypography'>
                    Select Video Topic
                    <span className='text-red'> *</span>
                  </Typography>
                  <FormDropdown
                    id='topic'
                    name='topic'
                    disabled={isView}
                    // value={values.category}
                    optionsValues={topics}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const { value } = e.target;
                      setFieldValue('topic', value);
                    }}
                  />
                </Grid>

                <Grid
                  item
                  md={6}
                  sm={12}
                  xs={12}
                  className='formikFormField pt-[5px!important]'
                >
                  <Typography className='formTypography'>
                    Title
                    <span className='text-red'> *</span>
                  </Typography>
                  <Field
                    name='title'
                    placeholder=''
                    component={TextFormField}
                    fullWidth
                    disabled={isView}
                    size='small'
                  />
                </Grid>

                <Grid
                  item
                  md={6}
                  sm={12}
                  xs={12}
                  className='formikFormField pt-[5px!important]'
                >
                  <Typography className='formTypography'>
                    Thumbnail Image
                    <span className='text-red'> *</span>
                  </Typography>
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      position: 'relative',
                      width: '100%',
                    }}
                  >
                    {images.map((image, index) => (
                      <div
                        key={index}
                        style={{
                          position: 'relative',
                          margin: '3px',
                          borderRadius: '10px',
                          overflow: 'hidden',
                          border: '2px solid #ccc',
                          flex: '1 1 calc(20% - 20px)',
                          width: '1000px',
                          height: 'auto',
                        }}
                      >
                        <img
                          src={
                            image.file
                              ? URL.createObjectURL(image.file)
                              : image.base64
                          }
                          alt='Thumbnail'
                          style={{
                            width: '100%',
                            height: 'auto',
                            objectFit: 'cover',
                            borderRadius: '10px',
                          }}
                        />
                        <IconButton
                          size='small'
                          sx={{
                            position: 'absolute',
                            top: '0px',
                            right: '0px',
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            padding: '2px',
                            borderRadius: '50%',
                            color: 'white',
                            transition: 'color 0.2s',
                            '&:hover': { color: 'red' },
                          }}
                          disabled={isView}
                          onClick={() => handleRemoveImage(index)}
                        >
                          <CancelIcon fontSize='small' />
                        </IconButton>
                      </div>
                    ))}

                    {images.length < maxImageCount && (
                      <div
                        style={{
                          flex: '1 1 calc(20% - 20px)',
                          maxWidth: '1000px',
                          height: '150px',
                          position: 'relative',
                          margin: '3px',
                          border: '2px solid #ccc',
                          borderRadius: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <IconButton
                          className='text-primaryBlue'
                          disabled={isView}
                          onClick={() =>
                            document.getElementById('imageUpload')?.click()
                          }
                        >
                          <AddCircleIcon fontSize='large' />
                        </IconButton>
                        <input
                          id='imageUpload'
                          type='file'
                          accept='image/*'
                          style={{ display: 'none' }}
                          multiple
                          onChange={handleImageUpload}
                          disabled={isView}
                        />
                      </div>
                    )}
                  </div>
                </Grid>
                <Grid
                  item
                  md={6}
                  sm={12}
                  xs={12}
                  className='formikFormField pt-[5px!important]'
                >
                  <div className='flex items-center justify-between'>
                    <Typography className='formTypography'>
                      Upload Video
                      <span className='text-red'> *</span>
                    </Typography>
                    <div>
                      <Typography component='span' className='mr-[10px]'>
                        Link
                      </Typography>
                      <Switch
                        checked={isLinkMode}
                        disabled={isView}
                        onChange={handleToggleChange}
                        size='small'
                        sx={{
                          '& .muiltr-kpgjex-MuiButtonBase-root-MuiSwitch-switchBase.Mui-checked+.MuiSwitch-track':
                            {
                              backgroundColor: '#387ed4',
                            },
                        }}
                      />
                    </div>
                  </div>
                  {isLinkMode ? (
                    <Field
                      disabled={isView}
                      name='videoUrl'
                      placeholder='Enter video URL'
                      component={TextFormField}
                      fullWidth
                      size='small'
                      variant='outlined'
                      // value={videoUrl}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setVideoUrl(e.target.value);
                        setFieldValue('videoUrl', e.target.value);
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        position: 'relative',
                        width: '100%',
                      }}
                    >
                      {videos.map(
                        (video: { file: File; base64: string }, index) => (
                          <div
                            key={index}
                            // className='relative w-[500px] h-[500px] m-[3px] border-[2px] border-[#ccc] rounded-[10px] overflow-hidden'
                            style={{
                              position: 'relative',
                              margin: '3px',
                              borderRadius: '10px',
                              overflow: 'hidden',
                              border: '2px solid #ccc',
                              flex: '1 1 calc(20% - 20px)',
                              width: '1000px',
                              height: 'auto',
                            }}
                          >
                            <video
                              width='100%'
                              height='100%'
                              className='w-full min-h-full object-cover object-center rounded-[10px]'
                              muted
                              controls
                            >
                              <source
                                src={
                                  video.file
                                    ? URL.createObjectURL(video.file)
                                    : video.base64
                                }
                                type={video?.file?.type}
                              />
                              Your browser does not support the video tag.
                            </video>
                            <IconButton
                              // disabled={isTableMode === 'view'}
                              size='small'
                              className='absolute top-0 right-0 text-white p-[2px] rounded-full bg-black/5 transition-colors duration-300 hover:text-red'
                              onClick={() => handleRemoveVideo(index)}
                            >
                              <CancelIcon fontSize='small' />
                            </IconButton>
                          </div>
                        )
                      )}

                      {videos.length < maxVideoCount && (
                        <div
                          style={{
                            flex: '1 1 calc(20% - 20px)',
                            maxWidth: '1000px',
                            height: '150px',
                            position: 'relative',
                            margin: '3px',
                            border: '2px solid #ccc',
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <IconButton
                            className='text-primaryBlue'
                            disabled={isView}
                            onClick={() =>
                              document.getElementById('videoUpload')?.click()
                            }
                          >
                            <AddCircleIcon fontSize='large' />
                          </IconButton>
                          <input
                            id='videoUpload'
                            type='file'
                            accept='video/*'
                            style={{ display: 'none' }}
                            multiple
                            onChange={handleVideoUpload}
                            disabled={isView}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </Grid>

                <Grid
                  item
                  md={12}
                  sm={12}
                  xs={12}
                  container
                  justifyContent='flex-end'
                  className='gap-[10px]'
                >
                  {!isView && (
                    <Button
                      className='flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80'
                      type='submit'
                      variant='contained'
                      size='medium'
                      // disabled={compType === 'view'}
                      disabled={isCancelOrderReasonsDataLoading}
                    >
                      {isAdd ? 'Add' : 'Update'}
                      {isCancelOrderReasonsDataLoading ? (
                        <CircularProgress
                          className='text-gray-600 ml-[5px]'
                          size={24}
                        />
                      ) : null}
                    </Button>
                  )}
                  <Button
                    onClick={toggleModal}
                    className='flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80'
                  >
                    Close
                  </Button>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}

export default VideoLibraryDialogForm;
