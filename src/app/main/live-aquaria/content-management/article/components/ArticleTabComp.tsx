import Box from '@mui/material/Box';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import { CircularProgress } from '@mui/material';
import CustomTab from '../../../../../common/CustomTab';
import ArticleDetailsComp from './ArticleDetailsComp';
import ArticleContentComp from './ArticleContentComp';
import RelatedArticlesComp from './RelatedArticlesComp';
import { MappedArticle } from '../../article-category/article-category-types/ArticleCategoryTypes';

function CustomTabPanel({ children, value, index, ...other }) {
	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && <Box sx={{ p: 2 }}>{children}</Box>} {/* Slight padding reduction */}
		</div>
	);
}

interface Props {
	toggleModal: () => void;
	isOpen: boolean;
	clickedRowData: MappedArticle;
	getAllArticle: () => void;
	isTableMode: string;
}

function ArticleTabComp({ toggleModal, isOpen, clickedRowData, getAllArticle, isTableMode }: Props) {
	const { t } = useTranslation('article');

	const [value, setValue] = React.useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [isCreatedId, setIsSetCreatedId] = useState<string>(null);
	const [isCreatedContentId, setIsSetCreatedContentId] = useState<string>(null);
	const handleChange = (event, newValue: number) => {
		setValue(newValue);
	};

	const handleArticleContent = (id: string) => {
		setIsSetCreatedId(id);
		setValue(1);
	};
	const handleRelatedArticles = (id: string) => {
		setIsSetCreatedContentId(id);
		setValue(2);
	};

	return (
		<Dialog
			fullWidth
			open={isOpen}
			maxWidth="xl"
			onClose={toggleModal}
			PaperProps={{
				style: {
					top: '40px',
					margin: 0,
					position: 'absolute'
				}
			}}
		>
			<DialogTitle className="pb-0">
				<h6 className="text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-400">
					{(() => {
						switch (isTableMode) {
							case 'view':
								return t('View');
							case 'edit':
								return t('Edit');
							default:
								return t('Create');
						}
					})()}{' '}
					Article
				</h6>
			</DialogTitle>
			<DialogContent className="pb-0">
				<Grid
					container
					spacing={2}
				>
					{isLoading ? (
						<div className="flex justify-center items-center w-full min-h-[100px]">
							<CircularProgress className="text-primaryBlue" />
						</div>
					) : (
						<Grid
							item
							md={12}
							sm={12}
							xs={12}
							className="pt-[5px!important]"
						>
							<Tabs
								value={value}
								onChange={handleChange}
								aria-label="basic tabs example"
								variant="fullWidth"
								className="h-[30px] min-h-[40px] border-b border-gray-300"
							>
								<CustomTab
									label="Article Details"
									index={0}
								/>
								<CustomTab
									label="Article Content"
									index={1}
								/>
								<CustomTab
									label="Related Articles"
									index={2}
								/>
							</Tabs>

							<CustomTabPanel
								value={value}
								index={0}
							>
								<ArticleDetailsComp
									clickedRowData={clickedRowData}
									isTableMode={isTableMode}
									toggleModal={toggleModal}
									getAllArticle={getAllArticle}
									handleArticleContent={handleArticleContent}
									isCreatedId={isCreatedId}
									isCreatedContentId={isCreatedContentId}
								/>
							</CustomTabPanel>

							<CustomTabPanel
								value={value}
								index={1}
							>
								<ArticleContentComp
									clickedRowData={clickedRowData}
									isTableMode={isTableMode}
									toggleModal={toggleModal}
									getAllArticle={getAllArticle}
									isCreatedContentId={isCreatedContentId}
									isCreatedId={isCreatedId}
									handleRelatedArticles={handleRelatedArticles}
								/>
							</CustomTabPanel>

							<CustomTabPanel
								value={value}
								index={2}
							>
								<RelatedArticlesComp
									clickedRowData={clickedRowData}
									isTableMode={isTableMode}
									toggleModal={toggleModal}
									getAllArticle={getAllArticle}
									isRelatedInitialData={{}}
									isCreatedId={isCreatedId}
									isCreatedContentId={isCreatedContentId}
								/>
							</CustomTabPanel>
						</Grid>
					)}
				</Grid>
			</DialogContent>
		</Dialog>
	);
}

export default ArticleTabComp;
