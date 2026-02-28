import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import ReportIcon from '@mui/icons-material/Report';
import DialogContent from '@mui/material/DialogContent';
import { DialogContentText } from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import React from 'react';
import { MappedArticle } from '../../article-category/article-category-types/ArticleCategoryTypes';

interface Props {
	toggleModal: () => void;
	isOpen: boolean;
	clickedRowData: MappedArticle;
	handleAlertForm: () => void;
}

function ArticleActiveAlertForm({ toggleModal, isOpen, clickedRowData, handleAlertForm }: Props) {
	return (
		<Dialog
			open={isOpen}
			onClose={toggleModal}
		>
			<DialogTitle className="text-[16px] font-bold">
				<ReportIcon className="text-red-400 mr-2 text-[20px]" />
				Confirmation
			</DialogTitle>
			<DialogContent>
				<DialogContentText>
					Are you sure you want to{' '}
					<span className="font-bold">{clickedRowData.active === true ? 'Unpublish' : 'Publish'}</span> this
					Article?
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button
					className="bokShadow flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
					variant="contained"
					size="medium"
					onClick={handleAlertForm}
				>
					Confirm
				</Button>
				<Button
					className="boxShadow flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80 boxShadow"
					onClick={toggleModal}
				>
					Cancel
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default ArticleActiveAlertForm;
