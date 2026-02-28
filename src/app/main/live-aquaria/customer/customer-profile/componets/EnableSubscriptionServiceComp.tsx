import ErrorIcon from '@mui/icons-material/Error';
import { DialogContentText } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

interface Props {
	toggleModal: () => void;
	isOpen: boolean;
	currentModal: string | null;
	clickedRowData: boolean;
	handleAlertForm: () => void;
}

const modalTitles: Record<string, string> = {
	toggleEnableEnableNewsLetterModel: 'News Letter Service',
	toggleEnableEarn5BackModel: 'Earn 5% Back Service',
	toggleEnableDiversDenSaltwaterSneakPeekModel: "Diver's Den Salt Water Sneak Peek Service",
	toggleEnableDiversDenSaltwaterOnceDailyModel: "Diver's Den Salt Water Once Daily Service",
	toggleEnableDiversDenFreshwaterSneakPeekModel: "Diver's Den Fresh Water Sneak Peek Service",
	toggleEnableDiversDenFreshwaterOnceDailyModel: "Diver's Den Fresh Water Once Daily Service"
};

function EnableSubscriptionServiceComp({ toggleModal, isOpen, clickedRowData, handleAlertForm, currentModal }: Props) {
	const getDialogTitle = () => {
		if (!currentModal) return null;

		const action = clickedRowData ? 'Disable' : 'Enable';
		return `${action} ${modalTitles[currentModal]}`;
	};
	return (
		<Dialog
			open={isOpen}
			onClose={toggleModal}
		>
			{currentModal && (
				<DialogTitle className="flex items-start gap-[5px] text-[12px] sm:text-[14px] lg:text-[16px] font-bold leading-[1.4]">
					<ErrorIcon className={`text-[20px] ${clickedRowData ? 'text-red' : 'text-green-500'}`} />
					{getDialogTitle()}
				</DialogTitle>
			)}
			{/* {toggleEnableEnableNewsLetterModal && (
        <DialogTitle className='flex items-start gap-[5px] text-[12px] sm:text-[14px] lg:text-[16px] font-bold leading-[1.4]'>
          {clickedRowData === true ? (
            <ErrorIcon className='text-red text-[20px]' />
          ) : (
            <ErrorIcon className='text-green-500 text-[20px]' />
          )}
          {clickedRowData === true ? 'Disable' : 'Enable'} News Letter Service
        </DialogTitle>
      )}

      {toggleEnableEarn5BackModal && (
        <DialogTitle className='flex items-start gap-[5px] text-[12px] sm:text-[14px] lg:text-[16px] font-bold leading-[1.4]'>
          {clickedRowData === true ? (
            <ErrorIcon className='text-red text-[20px]' />
          ) : (
            <ErrorIcon className='text-green-500 text-[20px]' />
          )}
          {clickedRowData === true ? 'Disable' : 'Enable'} Earn 5% Back Service
        </DialogTitle>
      )}

      {toggleEnableDiversDenSaltwaterSneakPeekModal && (
        <DialogTitle className='flex items-start gap-[5px] text-[12px] sm:text-[14px] lg:text-[16px] font-bold leading-[1.4]'>
          {clickedRowData === true ? (
            <ErrorIcon className='text-red text-[20px]' />
          ) : (
            <ErrorIcon className='text-green-500 text-[20px]' />
          )}
          {clickedRowData === true ? 'Disable' : 'Enable'} Diver's Den Salt
          Water Sneak Peek Service
        </DialogTitle>
      )}

      {toggleEnableDiversDenSaltwaterOnceDailyModal && (
        <DialogTitle className='flex items-start gap-[5px] text-[12px] sm:text-[14px] lg:text-[16px] font-bold leading-[1.4]'>
          {clickedRowData === true ? (
            <ErrorIcon className='text-red text-[20px]' />
          ) : (
            <ErrorIcon className='text-green-500 text-[20px]' />
          )}
          {clickedRowData === true ? 'Disable' : 'Enable'} Diver's Den Salt
          Water Once Daily Service
        </DialogTitle>
      )}

      {toggleEnableDiversDenFreshwaterSneakPeekModel && (
        <DialogTitle className='flex items-start gap-[5px] text-[12px] sm:text-[14px] lg:text-[16px] font-bold leading-[1.4]'>
          {clickedRowData === true ? (
            <ErrorIcon className='text-red text-[20px]' />
          ) : (
            <ErrorIcon className='text-green-500 text-[20px]' />
          )}
          {clickedRowData === true ? 'Disable' : 'Enable'} Diver's Den Fresh
          Water Sneak Peek Service
        </DialogTitle>
      )}

      {toggleEnableDiversDenFreshwaterOnceDailyModal && (
        <DialogTitle className='flex items-start gap-[5px] text-[12px] sm:text-[14px] lg:text-[16px] font-bold leading-[1.4]'>
          {clickedDiversDenFreshwaterOnceDailyRowData === true ? (
            <ErrorIcon className='text-red text-[20px]' />
          ) : (
            <ErrorIcon className='text-green-500 text-[20px]' />
          )}
          {clickedDiversDenFreshwaterOnceDailyRowData === true
            ? 'Disable'
            : 'Enable'}{' '}
          Diver's Den Fresh Water Once Daily Service
        </DialogTitle>
      )} */}
			<DialogContent>
				<DialogContentText className="text-[10px] sm:text-[12px] lg:text-[14px]">
					Are you sure you want to{' '}
					<span className="font-bold">{clickedRowData === true ? 'Disable' : 'Enable'}</span> this Service?
				</DialogContentText>
			</DialogContent>

			<DialogActions>
				<Button
					className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80 bokShadow"
					variant="contained"
					size="medium"
					onClick={handleAlertForm}
				>
					Confirm
				</Button>
				<Button
					className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80 boxShadow"
					onClick={toggleModal}
				>
					Cancel
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default EnableSubscriptionServiceComp;
