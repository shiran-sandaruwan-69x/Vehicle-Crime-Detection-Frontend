import { Button, Checkbox, FormControlLabel } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';

interface Props {
	open: boolean;
	handleClose: () => void;
}

function CollectPaymentModal({ open, handleClose }: Props) {
	return (
		<Dialog
			open={open}
			onClose={handleClose}
			fullWidth
			maxWidth="md"
		>
			<DialogTitle className="flex justify-end items-center gap-[10px] pb-0 mt-[-10px]">
				{/* <h6 className='text-[12px] sm:text-[14px] lg:text-[16px] text-center'>
          Text
        </h6> */}
				<IconButton
					edge="end"
					color="inherit"
					onClick={handleClose}
					aria-label="close"
				>
					<CloseIcon />
				</IconButton>
			</DialogTitle>
			<DialogContent>
				<div className="grid grid-cols-12 gap-[15px] w-full pb-[10px]">
					<div className="col-span-12">
						<FormControlLabel
							className="flex items-start m-0"
							name="collect_payment"
							id="collect_payment"
							control={
								<Checkbox
									color="primary"
									className="mt-[-8px] hover:bg-transparent"
								/>
							}
							label="I hereby authorize Liveaquaria Customer Care Team to add my payment details, on my behalf for the purpose of processing transactions related to my account or purchases with Liveaquaria website."
							checked
							// onChange={formik.handleChange}
						/>
					</div>
					<div className="col-span-12 flex justify-center">
						<Button
							className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
							type="button"
						>
							Collect Payment Here
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}

export default CollectPaymentModal;
