import UploadIcon from '@mui/icons-material/Upload';
import {
  Grid,
  IconButton,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { updateVarietyDetails } from '../../../../../../axios/services/live-aquaria-services/general-advertisement-services/GeneralAdvertisementService';
import {
  GeneralAdvItemSelection,
  GeneralAdvMainObject,
  GeneralAdvSelectionType,
  imageType,
  MediaModifyResponseData,
} from '../../types/general-advertisement-types';
import VarietyProductSelectionActiveComp from '../VarietyProductSelectionActiveComp';
import VarietyEditModel from './VarietyEditModel';

interface ErrorResponse {
  response?: {
    status?: number;
    data?: {
      message?: string;
    };
  };
}
interface VarietyProps {
  clickedRowData: GeneralAdvMainObject;
  isTableMode: string;
  fetchDataForProfileView: () => void;
  nextAndBackPage: (newValue: number) => void;
}

function Variety({
  clickedRowData,
  isTableMode,
  fetchDataForProfileView,
  nextAndBackPage,
}: VarietyProps) {
  const { t } = useTranslation('sampleComponent');
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedVariety, setSelectedVariety] =
    useState<GeneralAdvItemSelection | null>(null);
  const [varieties, setVarieties] = useState<GeneralAdvItemSelection[]>([]);
  const [itemId, setItemId] = useState<string>('');
  const [isMedia, setIsMedia] = useState<MediaModifyResponseData>({});
  const [isActiveData, setIsActiveData] = useState<GeneralAdvItemSelection>({});
  const [isOpenActiveModal, setOpenActiveModal] = useState(false);
  const toggleActiveModal = () => setOpenActiveModal(!isOpenActiveModal);
  useEffect(() => {
    setItemId(clickedRowData.id);
    setVarieties(clickedRowData.item_selection);
  }, [clickedRowData]);

  const handleToggleVariety = (
    varietyId: number,
    variety: GeneralAdvItemSelection
  ) => {
    setIsActiveData(variety);
    toggleActiveModal();
  };

  const handleEditClick = (variety: GeneralAdvItemSelection) => {
    setSelectedVariety(variety);
    const imageDetails: imageType[] = variety?.item_media
      ?.filter((item) => item.type === 'image')
      .map((item) => ({ id: item.id, link: item.link }));

    const videoDetails: imageType[] = variety?.item_media
      ?.filter((item) => item.type === 'video')
      .map((item) => ({ id: item.id, link: item.link }));

    const videoThumbnailImage: imageType[] = variety?.item_media
      ?.filter((item) => item.type === 'thumbnail')
      .map((item) => ({ id: item.id, link: item.link }));

    const mediaData: MediaModifyResponseData = {
      video_link: '',
      imagesIn: imageDetails,
      videoIn: videoDetails,
      videoThumbnailImage,
    };
    setIsMedia(mediaData);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedVariety(null);
  };

  const handleActiveAlertForm = async () => {
    toggleActiveModal();
    const id = isActiveData.id ?? null;
    const updatedValues = {
      is_active: isActiveData.is_active === 1 ? 0 : 1,
    };
    try {
      await updateVarietyDetails(clickedRowData.id, id, updatedValues);
      fetchDataForProfileView();

      if (updatedValues.is_active === 0) {
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
  const onBack = () => {
    nextAndBackPage(2);
  };

  const onNext = () => {
    nextAndBackPage(4);
  };

  return (
    <div className='min-w-full max-w-[100vw]'>
      <Paper className='p-[16px] mt-[-5px] rounded-[4px]'>
        <Grid container spacing={2} className='pt-0'>
          {varieties?.length > 0 ? (
            varieties.map((variety) => (
              <Grid
                item
                xs={12}
                className='pt-[5px!important]'
                key={variety.id}
              >
                <Grid container spacing={2} className='pt-[10px]'>
                  <Grid
                    item
                    xs={12}
                    className='flex justify-between items-center gap-[10px] pt-[5px!important]'
                  >
                    <div className='flex items-center gap-[10px]'>
                      <Typography
                        variant='h6'
                        className='text-[10px] sm:text-[12px] lg:text-[14px] font-600'
                      >
                        Selection {variety.name}
                      </Typography>
                      <Switch
                        disabled={isTableMode === 'view'}
                        checked={variety.is_active === 1}
                        onChange={() =>
                          handleToggleVariety(variety.id, variety)
                        }
                        size='small'
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: '#387ed4',
                          },
                          // '& .MuiSwitch-switchBase': { color: 'red' },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track':
                            {
                              backgroundColor: '#387ed4',
                            },
                          // '& .MuiSwitch-switchBase + .MuiSwitch-track': {
                          //   backgroundColor: 'red',
                          // },
                        }}
                      />
                    </div>

                    <div className='flex justify-end items-center gap-[2px]'>
                      <p className='text-[8px] sm:text-[10px] lg:text-[12px] text-gray-500 font-500 m-0'>
                        Upload Asset Files :
                      </p>
                      <IconButton onClick={() => handleEditClick(variety)}>
                        <UploadIcon />
                      </IconButton>
                    </div>
                  </Grid>

                  {/* Display Selection Types */}
                  <Grid
                    item
                    xs={12}
                    className='custom-table pt-[5px!important]'
                  >
                    <Typography
                      variant='subtitle1'
                      className='text-[10px] sm:text-[12px] lg:text-[14px]'
                    >
                      <strong>{t('PRODUCT_OFFERING_TYPES')}</strong>
                    </Typography>
                    <TableContainer component={Paper} sx={{ borderRadius: 0 }}>
                      <Table size='small' className='custom-table'>
                        <TableHead>
                          <TableRow>
                            <TableCell
                              sx={{
                                backgroundColor: '#354a95',
                                color: 'white',
                              }}
                            >
                              {t('Display Name')}
                            </TableCell>
                            <TableCell
                              sx={{
                                backgroundColor: '#354a95',
                                color: 'white',
                              }}
                            >
                              {t('Display Price ($)')}
                            </TableCell>
                            <TableCell
                              sx={{
                                backgroundColor: '#354a95',
                                color: 'white',
                              }}
                            >
                              {t('Consider Stock')}
                            </TableCell>
                            <TableCell
                              sx={{
                                backgroundColor: '#354a95',
                                color: 'white',
                              }}
                            >
                              {t('Remark')}
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {variety.selection_types.map(
                            (selectionType: GeneralAdvSelectionType) => (
                              <TableRow key={selectionType.id}>
                                <TableCell>
                                  {selectionType.display_name}
                                </TableCell>
                                <TableCell>
                                  $
                                  {parseFloat(
                                    selectionType.display_price
                                  ).toFixed(2)}
                                </TableCell>
                                <TableCell>
                                  <Switch
                                    checked={selectionType.consider_stock === 1}
                                    size='small'
                                    disabled
                                    sx={{
                                      '& .muiltr-kpgjex-MuiButtonBase-root-MuiSwitch-switchBase.Mui-checked+.MuiSwitch-track':
                                        {
                                          backgroundColor: '#387ed4',
                                        },
                                    }}
                                  />
                                </TableCell>
                                <TableCell>{selectionType.remark}</TableCell>
                              </TableRow>
                            )
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>

                  <Grid item xs={12} className='pt-[10px] pb-[5px]'>
                    <hr className='border' />
                  </Grid>
                </Grid>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography
                variant='h6'
                color='error'
                className='text-[12px] sm:text-[14px] lg:text-[16px]'
              >
                {t('No varieties available')}
              </Typography>
            </Grid>
          )}
        </Grid>

        <Grid
          item
          md={12}
          sm={12}
          xs={12}
          className='flex justify-end items-center gap-[10px] pt-[10px!important]'
        >
          {isTableMode !== 'view' && (
            <>
              {isTableMode === 'edit' ? null : (
                <Button
                  className='flex justify-center items-center min-w-[80px] sm:min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80'
                  type='button'
                  variant='contained'
                  size='medium'
                  onClick={() => onBack()}
                >
                  {t('Back')}
                </Button>
              )}
              {isTableMode === 'edit' ? null : (
                <Button
                  className='flex justify-center items-center min-w-[80px] sm:min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80'
                  type='button'
                  variant='contained'
                  size='medium'
                  onClick={() => onNext()}
                >
                  Next
                </Button>
              )}
            </>
          )}
        </Grid>
      </Paper>

      {selectedVariety && (
        <VarietyEditModel
          open={openModal}
          handleClose={handleCloseModal}
          variety={selectedVariety}
          isTableMode={isTableMode}
          isMedia={isMedia}
          itemId={itemId}
          fetchDataForProfileView={fetchDataForProfileView}
        />
      )}

      {isOpenActiveModal && (
        <VarietyProductSelectionActiveComp
          clickedRowData={isActiveData}
          toggleModal={toggleActiveModal}
          isOpen={isOpenActiveModal}
          handleAlertForm={handleActiveAlertForm}
        />
      )}
    </div>
  );
}

export default Variety;
