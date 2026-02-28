import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@mui/material';
import { DiversDenAdvertisementsModifiedDataResponseType } from '../divers-den-advertisements/divers-den-advertisements-types/DriversDenAdvertisementsTypes';
import NewDiversDenAdvertisementsTabsForm from '../divers-den-advertisements/components/NewDiversDenAdvertisementsTabsForm';
import DiversDenAdvertisementsPublish from './DiversDenAdvertisementsPublish';
import SampleThree from '../../sample-component/root-component/component/SampleThree';
import SampleTabFour from '../../sample-component/root-component/component/SampleTabFour';
import SampleTabFive from '../../sample-component/root-component/component/SampleTabFive';
import GeneralAdvertisementView from '../../sample-component/root-component/component/GeneralAdvertisementView';
import BreadcrumbLink from '../../../../common/FormComponents/BreadcrumbLink';

function DiversDenAdvertisementPublishBreadCrumb() {
	const [activeTab, setActiveTab] = useState<string>('SAMPLE_TAB_ONE');
	const [clickedRowData, setClickedRowData] = useState<DiversDenAdvertisementsModifiedDataResponseType>();
	const [isTableMode, setIsTableMode] = useState<string>('');
	const [isTablePublishMode, setIsTablePublishMode] = useState<string>('');
	const [isGetAllFunction, setIsGetAllFunction] = useState<() => void>(() => {});
	const [isSearchEnabled, setIsSearchEnabled] = useState(false);

	const { t } = useTranslation('diversDenAdvertisements');

	const handleNavigation = (tab: string) => {
		setActiveTab(tab);
	};

	const renderActiveComponent = () => {
		switch (activeTab) {
			case 'SAMPLE_TAB_ONE':
				return (
					<DiversDenAdvertisementsPublish
						onViewClick={(
							rowData: DiversDenAdvertisementsModifiedDataResponseType,
							isTableMode,
							isSearchEnabled,
							getAllDriversDenAdvertisements: () => void
						) => {
							setIsTablePublishMode('publish');
							setIsTableMode(isTableMode);
							setClickedRowData(rowData);
							setIsSearchEnabled(isSearchEnabled);
							getAllDriversDenAdvertisements();
							handleNavigation('VIEW_DIVERS_DEN_ADVERTISEMENT_KEY');
						}}
					/>
				);
			case 'CREATE_DIVERS_DEN_ADVERTISEMENT_KEY':
			case 'VIEW_DIVERS_DEN_ADVERTISEMENT_KEY':
			case 'EDIT_DIVERS_DEN_ADVERTISEMENT_KEY':
				return (
					<NewDiversDenAdvertisementsTabsForm
						isTablePublishMode={isTablePublishMode}
						clickedRowData={clickedRowData}
						isTableMode={isTableMode}
						isSearchEnabled={isSearchEnabled}
						getAllDriversDenAdvertisements={isGetAllFunction}
						handleNavigateMainComp={handleNavigateMainComp}
					/>
				);
			case 'SAMPLE_TAB_THREE':
				return <SampleThree />;
			case 'SAMPLE_TAB_FOUR':
				return <SampleTabFour onEditClick={() => handleNavigation('SAMPLE_TAB_FIVE')} />;
			case 'SAMPLE_TAB_FIVE':
				return <SampleTabFive />;
			default:
				return (
					<GeneralAdvertisementView
						onEditClick={() => handleNavigation('CREATE_DIVERS_DEN_ADVERTISEMENT_KEY')}
						onUpdateClick={() => handleNavigation('SAMPLE_TAB_THREE')}
					/>
				);
		}
	};

	const handleNavigateMainComp = () => {
		handleNavigation('SAMPLE_TAB_ONE');
	};

	const renderBreadcrumbs = () => {
		const breadcrumbs = [{ label: t('Live Aquaria'), tab: 'SAMPLE_TAB_ONE' }];

		breadcrumbs.push({
			label: 'Diver\'s Den Management Publish',
			tab: 'SAMPLE_TAB_ONE'
		});

		if (['CREATE_DIVERS_DEN_ADVERTISEMENT_KEY', 'SAMPLE_TAB_FOUR', 'SAMPLE_TAB_FIVE'].includes(activeTab)) {
			breadcrumbs.push({
				label: t('CREATE_DIVERS_DEN_ADVERTISEMENT'),
				tab: 'CREATE_DIVERS_DEN_ADVERTISEMENT_KEY'
			});
		}

		if (
			[
				'VIEW_DIVERS_DEN_ADVERTISEMENT_KEY',
				'DIVERS_DEN_ADVERTISEMENT_PUBLISH',
				'SAMPLE_TAB_FOUR',
				'SAMPLE_TAB_FIVE'
			].includes(activeTab)
		) {
			breadcrumbs.push({
				label: t('View Diver\'s Den Management'),
				tab: 'VIEW_DIVERS_DEN_ADVERTISEMENT_KEY'
			});
		}

		// if (
		// 	[
		// 		'VIEW_DIVERS_DEN_ADVERTISEMENT_KEY',
		// 		'SAMPLE_TAB_FOUR',
		// 		'SAMPLE_TAB_FIVE',
		// 	].includes(activeTab)
		// ) {
		// 	breadcrumbs.push({
		// 		label: t('VIEW_DIVERS_DEN_ADVERTISEMENT'),
		// 		tab: 'VIEW_DIVERS_DEN_ADVERTISEMENT_KEY',
		// 	});
		// }

		if (['DIVERS_DEN_ADVERTISEMENT_PUBLISH', 'SAMPLE_TAB_FOUR', 'SAMPLE_TAB_FIVE'].includes(activeTab)) {
			breadcrumbs.push({
				label: t('DIVERS_DEN_ADVERTISEMENT_PUBLISH'),
				tab: 'VIEW_DIVERS_DEN_ADVERTISEMENT_KEY'
			});
		}

		if (['EDIT_DIVERS_DEN_ADVERTISEMENT_KEY', 'SAMPLE_TAB_FOUR', 'SAMPLE_TAB_FIVE'].includes(activeTab)) {
			breadcrumbs.push({
				label: t('EDIT_DIVERS_DEN_ADVERTISEMENT'),
				tab: 'EDIT_DIVERS_DEN_ADVERTISEMENT_KEY'
			});
		}

		if (['SAMPLE_TAB_THREE'].includes(activeTab)) {
			breadcrumbs.push({ label: 'SampleTabThree', tab: 'SAMPLE_TAB_THREE' });
		}

		if (['DIVERS_DEN_ADVERTISEMENT_PUBLISH'].includes(activeTab)) {
			breadcrumbs.push({ label: 'DIVERS_DEN_ADVERTISEMENT_PUBLISH', tab: 'DIVERS_DEN_ADVERTISEMENT_PUBLISH' });
		}

		if (['SAMPLE_TAB_FOUR', 'SAMPLE_TAB_FIVE'].includes(activeTab)) {
			breadcrumbs.push({ label: 'SampleTabFour', tab: 'SAMPLE_TAB_FOUR' });
		}

		if (activeTab === 'SAMPLE_TAB_FIVE') {
			breadcrumbs.push({ label: 'SampleTabFive', tab: 'SAMPLE_TAB_FIVE' });
		}

		return breadcrumbs.map((breadcrumb, index) => (
			<React.Fragment key={index}>
				{index !== 0 && (
					<Typography className="text-[8px] sm:text-[10px] lg:text-[12px] text-gray-600 font-500 leading-[1.2]">
						/
					</Typography>
				)}
				<BreadcrumbLink
					label={breadcrumb.label}
					onClick={breadcrumb.tab ? () => handleNavigation(breadcrumb.tab) : undefined}
				/>
			</React.Fragment>
		));
	};

	return (
		<div className="min-w-full max-w-[100vw]">
			<div className="grid grid-cols-12 gap-[5px] w-full">
				<div className="col-span-12">
					<h6 className="w-full flex flex-wrap items-center gap-[5px] text-[8px] sm:text-[10px] lg:text-[12px] text-gray-600 font-500 leading-[1.2] px-[15px] py-[4px]">
						{renderBreadcrumbs()}
					</h6>
				</div>
				<div className="col-span-12">{renderActiveComponent()}</div>
			</div>
		</div>
	);
}

export default DiversDenAdvertisementPublishBreadCrumb;
