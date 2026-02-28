import React, { useState } from 'react';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import BreadcrumbLink from '../../../../common/FormComponents/BreadcrumbLink';
import GeneralAdvertisementView from '../../sample-component/root-component/component/GeneralAdvertisementView';
import SampleThree from '../../sample-component/root-component/component/SampleThree';
import SampleTabFour from '../../sample-component/root-component/component/SampleTabFour';
import SampleTabFive from '../../sample-component/root-component/component/SampleTabFive';
import DiversDenAdvertisements from './DiversDenAdvertisements';
import NewDiversDenAdvertisementsTabsForm from './components/NewDiversDenAdvertisementsTabsForm';
import { DiversDenAdvertisementsModifiedDataResponseType } from './divers-den-advertisements-types/DriversDenAdvertisementsTypes';

function BreadCrumb() {
	const [activeTab, setActiveTab] = useState<string>('SAMPLE_TAB_ONE');
	const [clickedRowData, setClickedRowData] = useState<DiversDenAdvertisementsModifiedDataResponseType>({});
	const [isTableMode, setIsTableMode] = useState<string>('');
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
					<DiversDenAdvertisements
						onCreateClick={(
							rowData: DiversDenAdvertisementsModifiedDataResponseType,
							isTableMode,
							isSearchEnabled,
							getAllDriversDenAdvertisements: () => void
						) => {
							setIsTableMode(isTableMode);
							setClickedRowData(rowData);
							setIsSearchEnabled(isSearchEnabled);
							getAllDriversDenAdvertisements();
							handleNavigation('CREATE_DIVERS_DEN_ADVERTISEMENT_KEY');
						}}
						onViewClick={(
							rowData: DiversDenAdvertisementsModifiedDataResponseType,
							isTableMode,
							isSearchEnabled,
							getAllDriversDenAdvertisements: () => void
						) => {
							setIsTableMode(isTableMode);
							setClickedRowData(rowData);
							setIsSearchEnabled(isSearchEnabled);
							getAllDriversDenAdvertisements();
							handleNavigation('VIEW_DIVERS_DEN_ADVERTISEMENT_KEY');
						}}
						onEditClick={(
							rowData: DiversDenAdvertisementsModifiedDataResponseType,
							isTableMode,
							isSearchEnabled,
							getAllDriversDenAdvertisements: () => void
						) => {
							setIsTableMode(isTableMode);
							setClickedRowData(rowData);
							setIsSearchEnabled(isSearchEnabled);
							getAllDriversDenAdvertisements();
							handleNavigation('EDIT_DIVERS_DEN_ADVERTISEMENT_KEY');
						}}
					/>
				);
			case 'CREATE_DIVERS_DEN_ADVERTISEMENT_KEY':
			case 'VIEW_DIVERS_DEN_ADVERTISEMENT_KEY':
			case 'EDIT_DIVERS_DEN_ADVERTISEMENT_KEY':
				return (
					<NewDiversDenAdvertisementsTabsForm
						isTablePublishMode=""
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
			label: 'Diver\'s Den Management',
			tab: 'SAMPLE_TAB_ONE'
		});

		if (['CREATE_DIVERS_DEN_ADVERTISEMENT_KEY', 'SAMPLE_TAB_FOUR', 'SAMPLE_TAB_FIVE'].includes(activeTab)) {
			breadcrumbs.push({
				label: t('Create Diver\'s Den Management'),
				tab: 'CREATE_DIVERS_DEN_ADVERTISEMENT_KEY'
			});
		}

		if (['VIEW_DIVERS_DEN_ADVERTISEMENT_KEY', 'SAMPLE_TAB_FOUR', 'SAMPLE_TAB_FIVE'].includes(activeTab)) {
			breadcrumbs.push({
				label: t('View Diver\'s Den Management'),
				tab: 'VIEW_DIVERS_DEN_ADVERTISEMENT_KEY'
			});
		}

		if (['EDIT_DIVERS_DEN_ADVERTISEMENT_KEY', 'SAMPLE_TAB_FOUR', 'SAMPLE_TAB_FIVE'].includes(activeTab)) {
			breadcrumbs.push({
				label: t('Edit Diver\'s Den Management'),
				tab: 'EDIT_DIVERS_DEN_ADVERTISEMENT_KEY'
			});
		}

		if (['SAMPLE_TAB_THREE'].includes(activeTab)) {
			breadcrumbs.push({ label: 'SampleTabThree', tab: 'SAMPLE_TAB_THREE' });
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

export default BreadCrumb;
