import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import ReportIcon from '@mui/icons-material/Report';
import DialogContent from '@mui/material/DialogContent';
import { DialogContentText } from '@mui/material';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import React from 'react';

interface Props {
	toggleModal: () => void;
	isOpen: boolean;
	clickedRowData: string;
	handleAlertForm: () => void;
}

function DeleteAlertForm({ toggleModal, isOpen, clickedRowData, handleAlertForm }: Props) {
	return (
		<Dialog
			open={isOpen}
			onClose={toggleModal}
		>
			<DialogTitle className="flex items-center gap-[5px] text-[16px] font-bold">
				<ReportIcon className="text-red text-[20px]" />
				Confirmation
			</DialogTitle>
			<DialogContent>
				<DialogContentText className="text-[10px] sm:text-[12px] lg:text-[14px]">
					Are you sure you want to delete <span className="font-bold">{clickedRowData || ''}</span> this
					Product?
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

export default DeleteAlertForm;
