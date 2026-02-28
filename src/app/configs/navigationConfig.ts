import i18next from 'i18next';
import { FuseNavItemType } from '@fuse/core/FuseNavigation/types/FuseNavItemType';
import ar from './navigation-i18n/ar';
import en from './navigation-i18n/en';
import tr from './navigation-i18n/tr';

i18next.addResourceBundle('en', 'navigation', en);
i18next.addResourceBundle('tr', 'navigation', tr);
i18next.addResourceBundle('ar', 'navigation', ar);

/**
 * The navigationConfig object is an array of navigation items for the Fuse application.
 */
const navigationConfig: FuseNavItemType[] = [
	{
		id: 'usermanagement',
		title: 'UserManagement',
		// subtitle: 'User Roles, Permissions, etc.',
		type: 'group',
		icon: 'heroicons-outline:home',
		translate: 'USER_MANAGEMENT',
		children: [
			{
				id: 'usermanagement.roles',
				title: 'Roles',
				type: 'item',
				icon: 'heroicons-outline:user-group',
				url: '/user-management/roles',
				translate: 'ROLES'
			},
			{
				id: 'usermanagement.permissions',
				title: 'Permissions',
				type: 'item',
				icon: 'heroicons-outline:lock-closed',
				url: '/user-management/permissions',
				translate: 'PERMISSIONS'
			},
			{
				id: 'usermanagement.users',
				title: 'Users',
				type: 'item',
				icon: 'heroicons-outline:user',
				url: '/user-management/users',
				translate: 'USERS'
			}
		]
	},
	{
		id: 'systemSettings',
		title: 'System Settings',
		// subtitle: 'User Roles, Permissions, etc.',
		type: 'group',
		icon: 'heroicons-outline:home',
		translate: 'SYSTEM_SETTINGS',
		children: [
			{
				id: 'systemSettings.free-shipping-settings',
				title: 'Free Shipping Settings',
				type: 'item',
				icon: 'heroicons-outline:user-group',
				url: '/system-settings/free-shipping-settings'
				// translate: 'ROLES'
			},
			{
				id: 'systemSettings.back-order-settings',
				title: 'Back Order Settings',
				type: 'item',
				icon: 'heroicons-outline:lock-closed',
				url: '/system-settings/back-order-settings'
				// translate: 'PERMISSIONS'
			},
			{
				id: 'systemSettings.divers-den-settings',
				title: 'Divers Den Settings',
				type: 'item',
				icon: 'heroicons-outline:user',
				url: '/system-settings/divers-den-settings'
				// translate: 'USERS'
			},
			{
				id: 'systemSettings.reward-point-settings',
				title: 'Reward Point Settings',
				type: 'item',
				icon: 'heroicons-outline:user',
				url: '/system-settings/reward-point-settings'
				// translate: 'USERS'
			},
			{
				id: 'systemSettings.box-charge-settings',
				title: 'Box Charge Settings',
				type: 'item',
				icon: 'heroicons-outline:user',
				url: '/system-settings/box-charge-settings'
				// translate: 'USERS'
			},
			{
				id: 'systemSettings.laq-companies-details',
				title: 'LAQ / CIS Company Details',
				type: 'item',
				icon: 'heroicons-outline:user',
				url: '/system-settings/companies-details'
				// translate: 'USERS'
			}
		]
	},

	{
		id: 'customerService',
		title: 'customerService',
		subtitle: '',
		type: 'group',
		translate: 'CUSTOMER_SERVICE',
		children: [
			{
				id: 'customerService.claims',
				title: 'Claims',
				icon: 'heroicons-outline:chart-pie',
				type: 'item',
				url: 'customer-service/customer-claims',
				end: true
			},
			{
				id: 'customerService.hotlineOrders',
				title: 'Hotline Orders',
				icon: 'heroicons-outline:chart-pie',
				type: 'item',
				url: 'customer-service/hotline-orders',
				end: true
			}
			// {
			// 	id: 'customerService.hotlineOrdersStatus',
			// 	title: 'Hotline Orders Status',
			// 	icon: 'heroicons-outline:chart-pie',
			// 	type: 'item',
			// 	url: 'customer-service/hotline-orders-status',
			// 	end: true
			// }
		]
	},

	// =================================================== Conflict End =================================================== //
	// {
	// 	id: 'customerService',
	// 	title: 'customerService',
	// 	subtitle: '',
	// 	type: 'group',
	// 	translate: 'CUSTOMER_SERVICE',
	// 	children: [
	// 		{
	// 			id: 'customerService.claims',
	// 			title: 'Claims',
	// 			icon: 'heroicons-outline:chart-pie',
	// 			type: 'item',
	// 			url: 'customer-service/customer-claims',
	// 			end: true
	// 		},
	// 		{
	// 			id: 'customerService.hotlineOrders',
	// 			title: 'Hotline Orders',
	// 			icon: 'heroicons-outline:chart-pie',
	// 			type: 'item',
	// 			url: 'customer-service/hotline-orders',
	// 			end: true
	// 		},
	// 		{
	// 			id: 'customerService.hotlineOrdersStatus',
	// 			title: 'Hotline Orders Status',
	// 			icon: 'heroicons-outline:chart-pie',
	// 			type: 'item',
	// 			url: 'customer-service/hotline-orders-status',
	// 			end: true
	// 		}
	// 	]
	// },
	{
		id: 'promotion',
		title: 'promotion',
		subtitle: '',
		type: 'group',
		translate: 'PROMOTION',
		children: [
			{
				id: 'promotion.promotionCycle',
				title: 'Promotion Cycle',
				icon: 'heroicons-outline:chart-pie',
				type: 'item',
				url: 'promotion/promotion-cycle',
				end: true
			},
			{
				id: 'promotion.promotions',
				title: 'Promotion',
				icon: 'heroicons-outline:chart-pie',
				type: 'item',
				url: 'promotion/promotions',
				end: true
			},
			{
				id: 'promotion.termsAndConditions',
				title: 'Terms & Conditions',
				icon: 'heroicons-outline:chart-pie',
				type: 'item',
				url: 'promotion/terms-and-conditions',
				end: true
			}
		]
	},

	{
		id: 'ordersManagement',
		title: 'Orders Management',
		subtitle: '',
		type: 'group',
		translate: 'INITIAL_ORDER_REVIEW',
		children: [
			{
				id: 'ordersManagement.adminOrderReview',
				title: 'Initial Orders Review',
				icon: 'heroicons-outline:user',
				type: 'item',
				url: 'orders-management/initial-order-review',
				end: true
			},
			{
				id: 'ordersManagement.backOrders',
				title: 'Back Orders Management',
				type: 'collapse',
				children: [
					{
						id: 'generalAdvertisement.backOrders.back_orders',
						title: 'Back Order',
						icon: 'heroicons-outline:user',
						type: 'item',
						url: 'order-management/back-orders',
						end: true
					},
					{
						id: 'generalAdvertisement.backOrders.backOrderHistory',
						title: 'Back Order History',
						icon: 'heroicons-outline:user',
						type: 'item',
						url: 'order-management/back-orders-history',
						end: true
					}
				]
			},
			{
				id: 'ordersManagement.orderPlanningManagement',
				title: 'Order Planning Management',
				type: 'collapse',
				children: [
					{
						id: 'ordersManagement.orderPlanningManagement.orderPlanning',
						title: 'Order Planning',
						icon: 'heroicons-outline:user',
						type: 'item',
						url: 'order-management/order-planning',
						end: true
					}
					// {
					// 	id: 'ordersManagement.orderPlanningManagement.planSummery',
					// 	title: 'Plan Summery',
					// 	icon: 'heroicons-outline:user',
					// 	type: 'item',
					// 	url: 'order-management/plan-summery',
					// 	end: true
					// }
				]
			},
			{
				id: 'ordersManagement.wareHouseOrderPlaning',
				title: 'Warehouse Order Management',
				type: 'collapse',
				children: [
					// {
					// 	id: 'generalAdvertisement.orderPlaning.wareHouseOrderPlaning',
					// 	title: 'Warehouse Order Planing',
					// 	icon: 'heroicons-outline:user',
					// 	type: 'item',
					// 	url: 'order-management/ware-house-order-planing',
					// 	end: true
					// },
					{
						id: 'generalAdvertisement.orderPlaning.assignAPicker',
						title: 'Assign Picker',
						icon: 'heroicons-outline:user',
						type: 'item',
						url: 'order-management/assign-a-picker',
						end: true
					}
				]
			},
			{
				id: 'ordersManagement.pickerList',
				title: 'Picker List',
				icon: 'heroicons-outline:user',
				type: 'item',
				url: 'orders-management/picker-list',
				end: true
			},
			{
				id: 'ordersManagement.dispatching',
				title: 'Dispatching',
				icon: 'heroicons-outline:user',
				type: 'item',
				url: 'orders-management/dispatching',
				end: true
			},
			{
				id: 'ordersManagement.cancelOrders',
				title: 'Cancel Orders',
				icon: 'heroicons-outline:user',
				type: 'item',
				url: 'orders-management/cancel-orders',
				end: true
			},
			{
				id: 'ordersManagement.orderFulfilment',
				title: 'Order Fulfilment',
				icon: 'heroicons-outline:user',
				type: 'item',
				url: 'orders-management/order-fulfilment',
				end: true
			}
		]
	},

	// {order-management/order-planing
	// 	id: 'ordersManagement',
	// 	title: 'Orders Management',
	// 	subtitle: '',
	// 	type: 'group',
	// 	translate: 'ORDERS_MANAGEMENT',
	// 	children: [
	//
	// 		]
	// },

	{
		id: 'customers',
		title: 'Customer Management',
		subtitle: '',
		type: 'group',
		translate: 'CUSTOMER_MANAGEMENT',
		children: [
			{
				id: 'customers.customer-view',
				title: 'Customers',
				icon: 'heroicons-outline:users',
				type: 'item',
				url: 'customers/customer-view',
				end: true
			}
		]
	},
	//
	{
		id: 'pdPManagement',
		title: 'PDP Management',
		subtitle: '',
		type: 'group',
		translate: 'PDP_MANAGEMENT',
		children: [
			{
				id: 'pdPManagement.pdPManagementView',
				title: 'Product Display Pages',
				icon: 'heroicons-outline:film',
				type: 'item',
				url: 'pdp-management/pdm-management-view',
				end: true
			},
			{
				id: 'pdPManagement.pdPManagementPublish',
				title: 'Publish',
				icon: 'heroicons-outline:film',
				type: 'item',
				url: 'pdp-management/pdm-publish',
				end: true
			}
		]
	},

	{
		id: 'diversDenPdp',
		title: 'Divers Den Management',
		subtitle: '',
		type: 'group',
		translate: 'DIVER_DEN_ADVERTISEMENT',
		children: [
			{
				id: 'diversDenPdp.diversDenManagement',
				title: "Diver's Den PDP",
				icon: 'heroicons-outline:film',
				type: 'item',
				url: 'divers-den-management/divers-den-pdp',
				end: true
			},
			{
				id: 'diversDenPdp.diversDenPdpPublish',
				title: 'Publish',
				icon: 'heroicons-outline:film',
				type: 'item',
				url: 'divers-den-management/divers-den-pdp-publish',
				end: true
			},
			{
				id: 'diversDenPdp.sneakPeekEmail',
				title: 'Sneak Peek Email',
				icon: 'heroicons-outline:film',
				type: 'item',
				url: 'divers-den-management/sneak-peek-email',
				end: true
			},
			{
				id: 'diversDenPdp.dailyEmail',
				title: 'Daily Email',
				icon: 'heroicons-outline:film',
				type: 'item',
				url: 'divers-den-management/daily-email',
				end: true
			}
		]
	},

	{
		id: 'laqMasterData',
		title: 'LAQ master data',
		subtitle: '',
		type: 'group',
		translate: 'LAQ_MASTER_DATA',
		children: [
			{
				id: 'laqMasterData.productMaster',
				title: 'Product Master',
				type: 'collapse',
				icon: 'heroicons-outline:cube',
				children: [
					{
						id: 'laqMasterData.productMaster.ETFMasterData',
						title: 'ETF Item Master Data',
						// icon: 'heroicons-outline:user',
						type: 'item',
						url: 'laq-master-data/etf-master-data',
						end: true
					},
					{
						id: 'laqMasterData.productMaster.CommonProductMaster',
						title: 'Common Product Master',
						// icon: 'heroicons-outline:user',
						type: 'item',
						url: 'laq-master-data/common-product-master',
						end: true
					},
					{
						id: 'laqMasterData.productMaster.productMasterData',
						title: 'LAQ Item Master Data',
						// icon: 'heroicons-outline:user',
						type: 'item',
						url: 'laq-master-data/product-list-view',
						end: true
					},
					{
						id: 'laqMasterData.productMaster.diversDenMasterData',
						title: 'Divers Den Master Data',
						// icon: 'heroicons-outline:user',
						type: 'item',
						url: 'laq-master-data/divers-den-master-data',
						end: true
					},

					{
						id: 'laqMasterData.productMaster.productReviews',
						title: 'Product Reviews',
						// icon: 'heroicons-outline:user',
						type: 'item',
						url: 'laq-master-data/product-reviews',
						end: true
					},

					{
						id: 'laqMasterData.productMaster.allReviews',
						title: 'All Reviews',
						// icon: 'heroicons-outline:user',
						type: 'item',
						url: 'laq-master-data/all-product-reviews',
						end: true
					}
				]
			},
			{
				id: 'laqMasterData.categoryManagement',
				title: 'Category Management',
				type: 'item',
				icon: 'heroicons-outline:chart-pie',
				url: 'laq-master-data/category-management',
				end: true
			},
			{
				id: 'laqMasterData.Attribute',
				title: 'Attribute',
				type: 'item',
				icon: 'heroicons-outline:presentation-chart-bar',
				url: 'laq-master-data/attribute',
				end: true
			},
			{
				id: 'laqMasterData.packingMaterialCharge',
				title: 'Packing Material Charge',
				type: 'item',
				icon: 'heroicons-outline:gift',
				url: 'laq-master-data/packing-material-charge',
				end: true
			},
			{
				id: 'laqMasterData.driversDenItem',
				title: 'DD Item Deletion Reason',
				type: 'item',
				icon: 'heroicons-outline:presentation-chart-bar',
				url: 'laq-master-data/divers-den-item',
				end: true
			},
			{
				id: 'laqMasterData.guaranteeOptions',
				title: 'Guarantee Options',
				type: 'item',
				icon: 'heroicons-outline:shield-check',
				url: 'laq-master-data/guarantee-options',
				end: true
			},
			{
				id: 'laqMasterData.CancelOrderReasons',
				title: 'Cancel Order Reasons',
				type: 'item',
				icon: 'heroicons-outline:document',
				url: 'laq-master-data/cancel-order-reasons',
				end: true
			},
			{
				id: 'laqMasterData.UnitPriceChargeReasons',
				title: 'Unit Price Change Reasons',
				type: 'item',
				icon: 'heroicons-outline:document-text',
				url: 'laq-master-data/unit-price-charge-reasons',
				end: true
			}
			// {
			// 	id: 'laqMasterData.StorePickupOptions',
			// 	title: 'Store Pickup Options',
			// 	type: 'item',
			// 	icon: 'heroicons-outline:truck',
			// 	url: 'laq-master-data/store-pickup-options',
			// 	end: true
			// },
			// {
			// 	id: 'laqMasterData.DropshipperOrderStatus',
			// 	title: 'Dropshipper Order Status',
			// 	type: 'item',
			// 	icon: 'heroicons-outline:folder-open',
			// 	url: 'laq-master-data/dropshipper-order-status',
			// 	end: true
			// },
			// {
			// 	id: 'laqMasterData.ProductWiseDisplayPriceMargin',
			// 	title: 'Price Markup',
			// 	type: 'item',
			// 	icon: 'heroicons-outline:currency-dollar',
			// 	url: 'laq-master-data/product-wise-display-price-margin',
			// 	end: true
			// }
		]
	},

	// {
	// 	id: 'generalAdvertisement',
	// 	title: 'General Advertisement',
	// 	subtitle: '',
	// 	type: 'group',
	// 	translate: 'GENERAL_ADVERTISEMENT',
	// 	children: [
	// 		{
	// 			id: 'generalAdvertisement.laq-view',
	// 			title: 'General Advertisement',
	// 			icon: 'heroicons-outline:user',
	// 			type: 'item',
	// 			url: 'general-advertisement/general-advertisement-view',
	// 			end: true
	// 		}
	// 	]
	// },

	{
		id: 'shipping',
		title: 'Shipping',
		subtitle: '',
		type: 'group',
		translate: 'SHIPPING',
		children: [
			{
				id: 'shipping.holidayCalender',
				title: 'Holiday Calender',
				icon: 'heroicons-outline:chart-pie',
				type: 'item',
				url: 'shipping/holiday-calender',
				end: true
			},
			{
				id: 'shipping.schedule',
				title: 'Shipping Schedule',
				icon: 'heroicons-outline:calendar',
				type: 'item',
				url: 'shipping/shipping-schedule',
				end: true
			},
			{
				id: 'shipping.shippingMethods',
				title: 'Shipping Methods',
				icon: 'heroicons-outline:presentation-chart-bar',
				type: 'item',
				url: 'shipping/shipping-methods',
				end: true
			},
			{
				id: 'shipping.shippingTypes',
				title: 'Shipping Types',
				icon: 'heroicons-outline:chart-pie',
				type: 'item',
				url: 'shipping/shipping-types',
				end: true
			},
			{
				id: 'shipping.additionalCost',
				title: 'Additional Cost',
				icon: 'heroicons-outline:currency-dollar',
				type: 'item',
				url: 'shipping/additional-cost',
				end: true
			},
			{
				id: 'shipping.shippingHolds',
				title: 'Shipping Holds',
				icon: 'heroicons-outline:clock',
				type: 'item',
				url: 'shipping/shipping-holds',
				end: true
			}
		]
	},

	{
		id: 'giftCertificate',
		title: 'Gift Certificate',
		subtitle: '',
		type: 'group',
		translate: 'GIFT_CERTIFICATE',
		children: [
			{
				id: 'giftCertificate.giftCertificate',
				title: 'Gift Certificate',
				type: 'item',
				icon: 'heroicons-outline:ticket',
				url: '/gift-certifications/gift-certificate',
				end: true
			},
			{
				id: 'giftCertificate.codeGenerator',
				title: 'Code Generator',
				type: 'item',
				icon: 'heroicons-outline:cube-transparent',
				url: '/gift-certifications/code-generator',
				end: true
			},
			{
				id: 'giftCertificate.purchasHistory',
				title: 'Purchase History',
				type: 'item',
				icon: 'heroicons-outline:cube-transparent',
				url: '/gift-certifications/purchase-history',
				end: true
			}
		]
	},

	{
		id: 'dashboards',
		title: 'Dashboards',
		subtitle: 'Unique dashboard designs',
		type: 'group',
		icon: 'heroicons-outline:home',
		translate: 'DASHBOARDS',
		children: [
			{
				id: 'dashboards.project',
				title: 'Dashboard',
				type: 'item',
				icon: 'heroicons-outline:presentation-chart-line',
				url: '/dashboards/project'
			}
			// {
			// 	id: 'dashboards.analytics',
			// 	title: 'Analytics',
			// 	type: 'item',
			// 	icon: 'heroicons-outline:chart-pie',
			// 	url: '/dashboards/analytics'
			// },
			// {
			// 	id: 'dashboards.finance',
			// 	title: 'Finance',
			// 	type: 'item',
			// 	icon: 'heroicons-outline:cash',
			// 	url: '/dashboards/finance'
			// },
			// {
			// 	id: 'dashboards.crypto',
			// 	title: 'Crypto',
			// 	type: 'item',
			// 	icon: 'heroicons-outline:currency-dollar',
			// 	url: '/dashboards/crypto'
			// }
		]
	},
	{
		id: 'usermanagement',
		title: 'UserManagement',
		subtitle: 'User Roles, Permissions, etc.',
		type: 'group',
		icon: 'heroicons-outline:home',
		translate: 'USER_MANAGEMENT',
		children: [
			{
				id: 'usermanagement.roles',
				title: 'Roles',
				type: 'item',
				icon: 'heroicons-outline:user-group',
				url: '/user-management/roles',
				translate: 'ROLES'
			},
			{
				id: 'usermanagement.permissions',
				title: 'Permissions',
				type: 'item',
				icon: 'heroicons-outline:lock-closed',
				url: '/user-management/permissions',
				translate: 'PERMISSIONS'
			},
			{
				id: 'usermanagement.users',
				title: 'Users',
				type: 'item',
				icon: 'heroicons-outline:user',
				url: '/user-management/users',
				translate: 'USERS'
			}
		]
	},

	{
		id: 'contentManagement',
		title: 'ContentManagement',
		subtitle: '',
		type: 'group',
		icon: 'heroicons-outline:home',
		translate: 'CONTENT_MANAGEMENT',
		children: [
			{
				id: 'contentManagement.articleCategoryContact',
				title: 'Contact Us Subject Maintenance',
				type: 'item',
				icon: 'heroicons-outline:presentation-chart-line',
				url: '/content-management/contact-us-subject-maintenance',
				end: true
			},
			{
				id: 'contentManagement.articleCategory',
				title: 'Article Category',
				type: 'item',
				icon: 'heroicons-outline:presentation-chart-line',
				url: '/content-management/article-category',
				end: true
			},
			{
				id: 'contentManagement.article',
				title: 'Article',
				type: 'item',
				icon: 'heroicons-outline:presentation-chart-line',
				url: '/content-management/article',
				end: true
			},
			{
				id: 'contentManagement.generalPages',
				title: 'General Pages',
				type: 'item',
				icon: 'heroicons-outline:presentation-chart-line',
				url: '/content-management/general-pages',
				end: true
			},
			{
				id: 'contentManagement.VideoLibrary',
				title: 'Video Library',
				type: 'collapse',
				icon: 'heroicons-outline:presentation-chart-line',
				children: [
					{
						id: 'contentManagement.VideoLibrary.VideoTopics',
						title: 'Video Topics',
						type: 'item',
						url: '/content-management/video-topic',
						end: true
					},
					{
						id: 'contentManagement.VideoLibrary.VideoLibrary',
						title: 'Video Library',
						type: 'item',
						url: '/content-management/video-library',
						end: true
					}
				]
			},
			{
				id: 'contentManagement.ComponentsTypes',
				title: 'Component Layouts',
				type: 'collapse',
				icon: 'heroicons-outline:presentation-chart-line',
				children: [
					{
						id: 'contentManagement.ComponentsTypes.textEditorComponent',
						title: 'Text Editor Component',
						type: 'item',
						url: '/content-management/components-layouts/text-editor-component',
						end: true
					},
					{
						id: 'contentManagement.ComponentsTypes.productCarouselComponent',
						title: 'Product Carousel Component',
						type: 'item',
						url: '/content-management/components-layouts/product-carousel-component',
						end: true
					}
				]
			},
			{
				id: 'contentManagement.headerLayout',
				title: 'Header Layout',
				type: 'item',
				icon: 'heroicons-outline:presentation-chart-line',
				url: '/content-management/header-layout',
				end: true
			},
			{
				id: 'contentManagement.footerLayout',
				title: 'Footer Layout',
				type: 'item',
				icon: 'heroicons-outline:presentation-chart-line',
				url: '/content-management/footer-layout',
				end: true
			}
		]
	}

	// {
	// 	id: 'ticketmanagement',
	// 	title: 'TicketManagement',
	// 	subtitle: 'Profiles, All Lotteries, etc.',
	// 	type: 'group',
	// 	icon: 'heroicons-outline:home',
	// 	translate: 'TICKET_MANAGEMENT',
	// 	children: [
	// 		{
	// 			id: 'ticketmanagement.lotteries_profile',
	// 			title: 'Lotteries Profile',
	// 			type: 'item',
	// 			icon: 'heroicons-outline:clipboard-check',
	// 			url: 'ticket-management/all-lottery-profiles',
	// 			translate: 'LOTTERIES_PROFILE'
	// 		},
	// 		{
	// 			id: 'ticketmanagement.all_lotteries',
	// 			title: 'All Lotteries',
	// 			type: 'item',
	// 			icon: 'heroicons-outline:chart-pie',
	// 			url: '/ticket-management/all-lotteries',
	// 			translate: 'ALL_LOTTERIES'
	// 		},
	// 		{
	// 			id: 'ticketmanagement.ticket_approvals',
	// 			title: 'Ticket Approvals',
	// 			type: 'item',
	// 			icon: 'heroicons-outline:check-circle',
	// 			url: '/ticket-management/ticket-approvals',
	// 			translate: 'TICKET_APPROVALS'
	// 		}
	// 	]
	// },
	// {
	//   id: 'customerManagement',
	//   title: 'CustomersManagement',
	//   subtitle: 'All Registered Customers, etc.',
	//   type: 'group',
	//   icon: 'heroicons-outline:users',
	//   translate: 'CUSTOMERS_MANAGEMENT',
	//   children: [
	//     {
	//       id: 'customerManagement.all_registered_customers',
	//       title: 'All Registered Customers',
	//       type: 'item',
	//       icon: 'heroicons-outline:users',
	//       url: 'customer-management/all-registered-customers',
	//       translate: 'ALL_REGISTERED_CUSTOMERS',
	//     },
	//   ],
	// },
	// {
	// 	id: 'paymentManagement',
	// 	title: 'PaymentManagement',
	// 	subtitle: 'Winning Funds, etc.',
	// 	type: 'group',
	// 	icon: 'heroicons-outline:doller',
	// 	translate: 'PAYMENT_MANAGEMENT',
	// 	children: [
	// 		{
	// 			id: 'paymentManagement.winning_funds',
	// 			title: 'Winning Funds',
	// 			type: 'item',
	// 			icon: 'heroicons-outline:currency-dollar',
	// 			url: '/payment-management/winning-funds',
	// 			translate: 'WINNING_FUNDS'
	// 		}
	// 	]
	// }
	// ,{
	// 	id: 'apps',
	// 	title: 'Applications',
	// 	subtitle: 'Custom made application designs',
	// 	type: 'group',
	// 	icon: 'heroicons-outline:cube',
	// 	translate: 'APPLICATIONS',
	// 	children: [
	// 		{
	// 			id: 'apps.academy',
	// 			title: 'Academy',
	// 			type: 'item',
	// 			icon: 'heroicons-outline:academic-cap',
	// 			url: '/apps/academy',
	// 			translate: 'ACADEMY'
	// 		},
	// 		{
	// 			id: 'apps.calendar',
	// 			title: 'Calendar',
	// 			subtitle: '3 upcoming events',
	// 			type: 'item',
	// 			icon: 'heroicons-outline:calendar',
	// 			url: '/apps/calendar',
	// 			translate: 'CALENDAR'
	// 		},
	// 		{
	// 			id: 'apps.messenger',
	// 			title: 'Messenger',
	// 			type: 'item',
	// 			icon: 'heroicons-outline:chat-alt',
	// 			url: '/apps/messenger',
	// 			translate: 'MESSENGER'
	// 		},
	// 		{
	// 			id: 'apps.contacts',
	// 			title: 'Contacts',
	// 			type: 'item',
	// 			icon: 'heroicons-outline:user-group',
	// 			url: '/apps/contacts',
	// 			translate: 'CONTACTS'
	// 		},
	// 	]
	// },
	// 		{
	// 			id: 'apps.ecommerce',
	// 			title: 'ECommerce',
	// 			type: 'collapse',
	// 			icon: 'heroicons-outline:shopping-cart',
	// 			translate: 'ECOMMERCE',
	// 			children: [
	// 				{
	// 					id: 'e-commerce-products',
	// 					title: 'Products',
	// 					type: 'item',
	// 					url: 'apps/e-commerce/products',
	// 					end: true
	// 				},
	// 				{
	// 					id: 'e-commerce-product-detail',
	// 					title: 'Product Detail',
	// 					type: 'item',
	// 					url: 'apps/e-commerce/products/1/a-walk-amongst-friends-canvas-print'
	// 				},
	// 				{
	// 					id: 'e-commerce-new-product',
	// 					title: 'New Product',
	// 					type: 'item',
	// 					url: 'apps/e-commerce/products/new'
	// 				},
	// 				{
	// 					id: 'e-commerce-orders',
	// 					title: 'Orders',
	// 					type: 'item',
	// 					url: 'apps/e-commerce/orders',
	// 					end: true
	// 				},
	// 				{
	// 					id: 'e-commerce-order-detail',
	// 					title: 'Order Detail',
	// 					type: 'item',
	// 					url: 'apps/e-commerce/orders/1'
	// 				}
	// 			]
	// 		},
	// 		{
	// 			id: 'apps.file-manager',
	// 			title: 'File Manager',
	// 			type: 'item',
	// 			icon: 'heroicons-outline:cloud',
	// 			url: '/apps/file-manager',
	// 			end: true,
	// 			translate: 'FILE_MANAGER'
	// 		},
	// 		{
	// 			id: 'apps.help-center',
	// 			title: 'Help Center',
	// 			type: 'collapse',
	// 			icon: 'heroicons-outline:support',
	// 			url: '/apps/help-center',
	// 			children: [
	// 				{
	// 					id: 'apps.help-center.home',
	// 					title: 'Home',
	// 					type: 'item',
	// 					url: '/apps/help-center',
	// 					end: true
	// 				},
	// 				{
	// 					id: 'apps.help-center.faqs',
	// 					title: 'FAQs',
	// 					type: 'item',
	// 					url: '/apps/help-center/faqs'
	// 				},
	// 				{
	// 					id: 'apps.help-center.guides',
	// 					title: 'Guides',
	// 					type: 'item',
	// 					url: '/apps/help-center/guides'
	// 				},
	// 				{
	// 					id: 'apps.help-center.support',
	// 					title: 'Support',
	// 					type: 'item',
	// 					url: '/apps/help-center/support'
	// 				}
	// 			]
	// 		},
	// 		{
	// 			id: 'apps.mailbox',
	// 			title: 'Mailbox',
	// 			type: 'item',
	// 			icon: 'heroicons-outline:mail',
	// 			url: '/apps/mailbox',
	// 			translate: 'MAIL',
	// 			badge: {
	// 				title: '27',
	// 				classes: 'px-8 bg-pink-600 text-white rounded-full'
	// 			}
	// 		},
	// 		{
	// 			id: 'apps.notes',
	// 			title: 'Notes',
	// 			type: 'item',
	// 			icon: 'heroicons-outline:pencil-alt',
	// 			url: '/apps/notes',
	// 			translate: 'NOTES'
	// 		},
	// 		{
	// 			id: 'apps.scrumboard',
	// 			title: 'Scrumboard',
	// 			type: 'item',
	// 			icon: 'heroicons-outline:view-boards',
	// 			url: '/apps/scrumboard',
	// 			translate: 'SCRUMBOARD'
	// 		},
	// 		{
	// 			id: 'apps.tasks',
	// 			title: 'Tasks',
	// 			subtitle: '12 remaining tasks',
	// 			type: 'item',
	// 			icon: 'heroicons-outline:check-circle',
	// 			url: '/apps/tasks',
	// 			translate: 'TASKS'
	// 		},
	// 		{
	// 			id: 'apps.profile',
	// 			title: 'Profile',
	// 			type: 'item',
	// 			icon: 'heroicons-outline:user-circle',
	// 			url: '/apps/profile'
	// 		},
	// 		{
	// 			id: 'apps.notifications',
	// 			title: 'Notifications',
	// 			type: 'item',
	// 			icon: 'heroicons-outline:bell',
	// 			url: '/apps/notifications'
	// 		}
	// 	]
	// },
	// {
	// 	id: 'pages',
	// 	title: 'Pages',
	// 	subtitle: 'Custom made page designs',
	// 	type: 'group',
	// 	icon: 'heroicons-outline:document',
	// 	children: [
	// 		{
	// 			id: 'pages.activities',
	// 			title: 'Activities',
	// 			type: 'item',
	// 			icon: 'heroicons-outline:menu-alt-2',
	// 			url: '/pages/activities'
	// 		},
	// 		{
	// 			id: 'pages.authentication',
	// 			title: 'Authentication',
	// 			type: 'collapse',
	// 			icon: 'heroicons-outline:lock-closed',
	// 			children: [
	// 				{
	// 					id: 'pages.authentication.sign-in',
	// 					title: 'Sign in',
	// 					type: 'collapse',
	// 					children: [
	// 						{
	// 							id: 'pages.authentication.sign-in.classic',
	// 							title: 'Classic',
	// 							type: 'item',
	// 							url: '/pages/authentication/sign-in/classic'
	// 						},
	// 						{
	// 							id: 'pages.authentication.sign-in.modern',
	// 							title: 'Modern',
	// 							type: 'item',
	// 							url: '/pages/authentication/sign-in/modern'
	// 						},
	// 						{
	// 							id: 'pages.authentication.sign-in.modern-reversed',
	// 							title: 'Modern Reversed',
	// 							type: 'item',
	// 							url: '/pages/authentication/sign-in/modern-reversed'
	// 						},
	// 						{
	// 							id: 'pages.authentication.sign-in.split-screen',
	// 							title: 'Split Screen',
	// 							type: 'item',
	// 							url: '/pages/authentication/sign-in/split-screen'
	// 						},
	// 						{
	// 							id: 'pages.authentication.sign-in.split-screen-reversed',
	// 							title: 'Split Screen Reversed',
	// 							type: 'item',
	// 							url: '/pages/authentication/sign-in/split-screen-reversed'
	// 						},
	// 						{
	// 							id: 'pages.authentication.sign-in.full-screen',
	// 							title: 'Full Screen',
	// 							type: 'item',
	// 							url: '/pages/authentication/sign-in/full-screen'
	// 						},
	// 						{
	// 							id: 'pages.authentication.sign-in.full-screen-reversed',
	// 							title: 'Full Screen Reversed',
	// 							type: 'item',
	// 							url: '/pages/authentication/sign-in/full-screen-reversed'
	// 						}
	// 					]
	// 				},
	// 				{
	// 					id: 'pages.authentication.sign-up',
	// 					title: 'Sign up',
	// 					type: 'collapse',
	// 					children: [
	// 						{
	// 							id: 'pages.authentication.sign-up.classic',
	// 							title: 'Classic',
	// 							type: 'item',
	// 							url: '/pages/authentication/sign-up/classic'
	// 						},
	// 						{
	// 							id: 'pages.authentication.sign-up.modern',
	// 							title: 'Modern',
	// 							type: 'item',
	// 							url: '/pages/authentication/sign-up/modern'
	// 						},
	// 						{
	// 							id: 'pages.authentication.sign-up.modern-reversed',
	// 							title: 'Modern Reversed',
	// 							type: 'item',
	// 							url: '/pages/authentication/sign-up/modern-reversed'
	// 						},
	// 						{
	// 							id: 'pages.authentication.sign-up.split-screen',
	// 							title: 'Split Screen',
	// 							type: 'item',
	// 							url: '/pages/authentication/sign-up/split-screen'
	// 						},
	// 						{
	// 							id: 'pages.authentication.sign-up.split-screen-reversed',
	// 							title: 'Split Screen Reversed',
	// 							type: 'item',
	// 							url: '/pages/authentication/sign-up/split-screen-reversed'
	// 						},
	// 						{
	// 							id: 'pages.authentication.sign-up.full-screen',
	// 							title: 'Full Screen',
	// 							type: 'item',
	// 							url: '/pages/authentication/sign-up/full-screen'
	// 						},
	// 						{
	// 							id: 'pages.authentication.sign-up.full-screen-reversed',
	// 							title: 'Full Screen Reversed',
	// 							type: 'item',
	// 							url: '/pages/authentication/sign-up/full-screen-reversed'
	// 						}
	// 					]
	// 				},
	// 				{
	// 					id: 'pages.authentication.sign-out',
	// 					title: 'Sign out',
	// 					type: 'collapse',
	// 					children: [
	// 						{
	// 							id: 'pages.authentication.sign-out.classic',
	// 							title: 'Classic',
	// 							type: 'item',
	// 							url: '/pages/authentication/sign-out/classic'
	// 						},
	// 						{
	// 							id: 'pages.authentication.sign-out.modern',
	// 							title: 'Modern',
	// 							type: 'item',
	// 							url: '/pages/authentication/sign-out/modern'
	// 						},
	// 						{
	// 							id: 'pages.authentication.sign-out.modern-reversed',
	// 							title: 'Modern Reversed',
	// 							type: 'item',
	// 							url: '/pages/authentication/sign-out/modern-reversed'
	// 						},
	// 						{
	// 							id: 'pages.authentication.sign-out.split-screen',
	// 							title: 'Split Screen',
	// 							type: 'item',
	// 							url: '/pages/authentication/sign-out/split-screen'
	// 						},
	// 						{
	// 							id: 'pages.authentication.sign-out.split-screen-reversed',
	// 							title: 'Split Screen Reversed',
	// 							type: 'item',
	// 							url: '/pages/authentication/sign-out/split-screen-reversed'
	// 						},
	// 						{
	// 							id: 'pages.authentication.sign-out.full-screen',
	// 							title: 'Full Screen',
	// 							type: 'item',
	// 							url: '/pages/authentication/sign-out/full-screen'
	// 						},
	// 						{
	// 							id: 'pages.authentication.sign-out.full-screen-reversed',
	// 							title: 'Full Screen Reversed',
	// 							type: 'item',
	// 							url: '/pages/authentication/sign-out/full-screen-reversed'
	// 						}
	// 					]
	// 				},
	// 				{
	// 					id: 'pages.authentication.forgot-password',
	// 					title: 'Forgot password',
	// 					type: 'collapse',
	// 					children: [
	// 						{
	// 							id: 'pages.authentication.forgot-password.classic',
	// 							title: 'Classic',
	// 							type: 'item',
	// 							url: '/pages/authentication/forgot-password/classic'
	// 						},
	// 						{
	// 							id: 'pages.authentication.forgot-password.modern',
	// 							title: 'Modern',
	// 							type: 'item',
	// 							url: '/pages/authentication/forgot-password/modern'
	// 						},
	// 						{
	// 							id: 'pages.authentication.forgot-password.modern-reversed',
	// 							title: 'Modern Reversed',
	// 							type: 'item',
	// 							url: '/pages/authentication/forgot-password/modern-reversed'
	// 						},
	// 						{
	// 							id: 'pages.authentication.forgot-password.split-screen',
	// 							title: 'Split Screen',
	// 							type: 'item',
	// 							url: '/pages/authentication/forgot-password/split-screen'
	// 						},
	// 						{
	// 							id: 'pages.authentication.forgot-password.split-screen-reversed',
	// 							title: 'Split Screen Reversed',
	// 							type: 'item',
	// 							url: '/pages/authentication/forgot-password/split-screen-reversed'
	// 						},
	// 						{
	// 							id: 'pages.authentication.forgot-password.full-screen',
	// 							title: 'Full Screen',
	// 							type: 'item',
	// 							url: '/pages/authentication/forgot-password/full-screen'
	// 						},
	// 						{
	// 							id: 'pages.authentication.forgot-password.full-screen-reversed',
	// 							title: 'Full Screen Reversed',
	// 							type: 'item',
	// 							url: '/pages/authentication/forgot-password/full-screen-reversed'
	// 						}
	// 					]
	// 				},
	// 				{
	// 					id: 'pages.authentication.reset-password',
	// 					title: 'Reset password',
	// 					type: 'collapse',
	// 					children: [
	// 						{
	// 							id: 'pages.authentication.reset-password.classic',
	// 							title: 'Classic',
	// 							type: 'item',
	// 							url: '/pages/authentication/reset-password/classic'
	// 						},
	// 						{
	// 							id: 'pages.authentication.reset-password.modern',
	// 							title: 'Modern',
	// 							type: 'item',
	// 							url: '/pages/authentication/reset-password/modern'
	// 						},
	// 						{
	// 							id: 'pages.authentication.reset-password.modern-reversed',
	// 							title: 'Modern Reversed',
	// 							type: 'item',
	// 							url: '/pages/authentication/reset-password/modern-reversed'
	// 						},
	// 						{
	// 							id: 'pages.authentication.reset-password.split-screen',
	// 							title: 'Split Screen',
	// 							type: 'item',
	// 							url: '/pages/authentication/reset-password/split-screen'
	// 						},
	// 						{
	// 							id: 'pages.authentication.reset-password.split-screen-reversed',
	// 							title: 'Split Screen Reversed',
	// 							type: 'item',
	// 							url: '/pages/authentication/reset-password/split-screen-reversed'
	// 						},
	// 						{
	// 							id: 'pages.authentication.reset-password.full-screen',
	// 							title: 'Full Screen',
	// 							type: 'item',
	// 							url: '/pages/authentication/reset-password/full-screen'
	// 						},
	// 						{
	// 							id: 'pages.authentication.reset-password.full-screen-reversed',
	// 							title: 'Full Screen Reversed',
	// 							type: 'item',
	// 							url: '/pages/authentication/reset-password/full-screen-reversed'
	// 						}
	// 					]
	// 				},
	// 				{
	// 					id: 'pages.authentication.unlock-session',
	// 					title: 'Unlock session',
	// 					type: 'collapse',
	// 					children: [
	// 						{
	// 							id: 'pages.authentication.unlock-session.classic',
	// 							title: 'Classic',
	// 							type: 'item',
	// 							url: '/pages/authentication/unlock-session/classic'
	// 						},
	// 						{
	// 							id: 'pages.authentication.unlock-session.modern',
	// 							title: 'Modern',
	// 							type: 'item',
	// 							url: '/pages/authentication/unlock-session/modern'
	// 						},
	// 						{
	// 							id: 'pages.authentication.unlock-session.modern-reversed',
	// 							title: 'Modern Reversed',
	// 							type: 'item',
	// 							url: '/pages/authentication/unlock-session/modern-reversed'
	// 						},
	// 						{
	// 							id: 'pages.authentication.unlock-session.split-screen',
	// 							title: 'Split Screen',
	// 							type: 'item',
	// 							url: '/pages/authentication/unlock-session/split-screen'
	// 						},
	// 						{
	// 							id: 'pages.authentication.unlock-session.split-screen-reversed',
	// 							title: 'Split Screen Reversed',
	// 							type: 'item',
	// 							url: '/pages/authentication/unlock-session/split-screen-reversed'
	// 						},
	// 						{
	// 							id: 'pages.authentication.unlock-session.full-screen',
	// 							title: 'Full Screen',
	// 							type: 'item',
	// 							url: '/pages/authentication/unlock-session/full-screen'
	// 						},
	// 						{
	// 							id: 'pages.authentication.unlock-session.full-screen-reversed',
	// 							title: 'Full Screen Reversed',
	// 							type: 'item',
	// 							url: '/pages/authentication/unlock-session/full-screen-reversed'
	// 						}
	// 					]
	// 				},
	// 				{
	// 					id: 'pages.authentication.confirmation-required',
	// 					title: 'Confirmation required',
	// 					type: 'collapse',
	// 					children: [
	// 						{
	// 							id: 'pages.authentication.confirmation-required.classic',
	// 							title: 'Classic',
	// 							type: 'item',
	// 							url: '/pages/authentication/confirmation-required/classic'
	// 						},
	// 						{
	// 							id: 'pages.authentication.confirmation-required.modern',
	// 							title: 'Modern',
	// 							type: 'item',
	// 							url: '/pages/authentication/confirmation-required/modern'
	// 						},
	// 						{
	// 							id: 'pages.authentication.confirmation-required.modern-reversed',
	// 							title: 'Modern Reversed',
	// 							type: 'item',
	// 							url: '/pages/authentication/confirmation-required/modern-reversed'
	// 						},
	// 						{
	// 							id: 'pages.authentication.confirmation-required.split-screen',
	// 							title: 'Split Screen',
	// 							type: 'item',
	// 							url: '/pages/authentication/confirmation-required/split-screen'
	// 						},
	// 						{
	// 							id: 'pages.authentication.confirmation-required.split-screen-reversed',
	// 							title: 'Split Screen Reversed',
	// 							type: 'item',
	// 							url: '/pages/authentication/confirmation-required/split-screen-reversed'
	// 						},
	// 						{
	// 							id: 'pages.authentication.confirmation-required.full-screen',
	// 							title: 'Full Screen',
	// 							type: 'item',
	// 							url: '/pages/authentication/confirmation-required/full-screen'
	// 						},
	// 						{
	// 							id: 'pages.authentication.confirmation-required.full-screen-reversed',
	// 							title: 'Full Screen Reversed',
	// 							type: 'item',
	// 							url: '/pages/authentication/confirmation-required/full-screen-reversed'
	// 						}
	// 					]
	// 				}
	// 			]
	// 		},
	// 		{
	// 			id: 'pages.coming-soon',
	// 			title: 'Coming Soon',
	// 			type: 'collapse',
	// 			icon: 'heroicons-outline:clock',
	// 			url: '/pages/coming-soon',
	// 			children: [
	// 				{
	// 					id: 'pages.coming-soon.classic',
	// 					title: 'Classic',
	// 					type: 'item',
	// 					url: '/pages/coming-soon/classic'
	// 				},
	// 				{
	// 					id: 'pages.coming-soon.modern',
	// 					title: 'Modern',
	// 					type: 'item',
	// 					url: '/pages/coming-soon/modern'
	// 				},
	// 				{
	// 					id: 'pages.coming-soon.modern-reversed',
	// 					title: 'Modern Reversed',
	// 					type: 'item',
	// 					url: '/pages/coming-soon/modern-reversed'
	// 				},
	// 				{
	// 					id: 'pages.coming-soon.split-screen',
	// 					title: 'Split Screen',
	// 					type: 'item',
	// 					url: '/pages/coming-soon/split-screen'
	// 				},
	// 				{
	// 					id: 'pages.coming-soon.split-screen-reversed',
	// 					title: 'Split Screen Reversed',
	// 					type: 'item',
	// 					url: '/pages/coming-soon/split-screen-reversed'
	// 				},
	// 				{
	// 					id: 'pages.coming-soon.full-screen',
	// 					title: 'Full Screen',
	// 					type: 'item',
	// 					url: '/pages/coming-soon/full-screen'
	// 				},
	// 				{
	// 					id: 'pages.coming-soon.full-screen-reversed',
	// 					title: 'Full Screen Reversed',
	// 					type: 'item',
	// 					url: '/pages/coming-soon/full-screen-reversed'
	// 				}
	// 			]
	// 		},
	// 		{
	// 			id: 'pages.error',
	// 			title: 'Error',
	// 			type: 'collapse',
	// 			icon: 'heroicons-outline:exclamation-circle',
	// 			children: [
	// 				{
	// 					id: 'pages.error.404',
	// 					title: '404',
	// 					type: 'item',
	// 					url: '/pages/error/404'
	// 				},
	// 				{
	// 					id: 'pages.error.500',
	// 					title: '500',
	// 					type: 'item',
	// 					url: '/pages/error/500'
	// 				}
	// 			]
	// 		},
	// 		{
	// 			id: 'pages.invoice',
	// 			title: 'Invoice',
	// 			type: 'collapse',
	// 			icon: 'heroicons-outline:calculator',
	// 			children: [
	// 				{
	// 					id: 'pages.invoice.printable',
	// 					title: 'Printable',
	// 					type: 'collapse',
	// 					children: [
	// 						{
	// 							id: 'pages.invoice.printable.compact',
	// 							title: 'Compact',
	// 							type: 'item',
	// 							url: '/pages/invoice/printable/compact'
	// 						},
	// 						{
	// 							id: 'pages.invoice.printable.modern',
	// 							title: 'Modern',
	// 							type: 'item',
	// 							url: '/pages/invoice/printable/modern'
	// 						}
	// 					]
	// 				}
	// 			]
	// 		},
	// 		{
	// 			id: 'pages.maintenance',
	// 			title: 'Maintenance',
	// 			type: 'item',
	// 			icon: 'heroicons-outline:exclamation',
	// 			url: '/pages/maintenance'
	// 		},
	// 		{
	// 			id: 'pages.pricing',
	// 			title: 'Pricing',
	// 			type: 'collapse',
	// 			icon: 'heroicons-outline:cash',
	// 			children: [
	// 				{
	// 					id: 'pages.pricing.modern',
	// 					title: 'Modern',
	// 					type: 'item',
	// 					url: '/pages/pricing/modern'
	// 				},
	// 				{
	// 					id: 'pages.pricing.simple',
	// 					title: 'Simple',
	// 					type: 'item',
	// 					url: '/pages/pricing/simple'
	// 				},
	// 				{
	// 					id: 'pages.pricing.single',
	// 					title: 'Single',
	// 					type: 'item',
	// 					url: '/pages/pricing/single'
	// 				},
	// 				{
	// 					id: 'pages.pricing.table',
	// 					title: 'Table',
	// 					type: 'item',
	// 					url: '/pages/pricing/table'
	// 				}
	// 			]
	// 		},
	// 		{
	// 			id: 'pages.search',
	// 			title: 'Search',
	// 			type: 'collapse',
	// 			icon: 'search',
	// 			children: [
	// 				{
	// 					id: 'pages.search.classic-search',
	// 					title: 'Classic Search',
	// 					type: 'item',
	// 					url: 'pages/search/classic'
	// 				},
	// 				{
	// 					id: 'pages.search.modern-search',
	// 					title: 'Modern Search',
	// 					type: 'item',
	// 					url: 'pages/search/modern'
	// 				}
	// 			]
	// 		}
	// 	]
	// },
	// {
	// 	id: 'user-interface',
	// 	title: 'User Interface',
	// 	subtitle: 'Building blocks of the UI & UX',
	// 	type: 'group',
	// 	icon: 'heroicons-outline:collection',
	// 	children: [
	// 		{
	// 			id: 'user-interface.tailwindcss',
	// 			title: 'TailwindCSS',
	// 			type: 'item',
	// 			icon: 'heroicons-outline:sparkles',
	// 			url: '/ui/tailwindcss'
	// 		},
	// 		{
	// 			id: 'user-interface.icons',
	// 			title: 'Icons',
	// 			type: 'collapse',
	// 			icon: 'heroicons-outline:lightning-bolt',
	// 			children: [
	// 				{
	// 					id: 'user-interface.icons.heroicons-outline',
	// 					title: 'Heroicons Outline',
	// 					type: 'item',
	// 					url: '/ui/icons/heroicons/outline'
	// 				},
	// 				{
	// 					id: 'user-interface.icons.heroicons-solid',
	// 					title: 'Heroicons Solid',
	// 					type: 'item',
	// 					url: '/ui/icons/heroicons/solid'
	// 				},
	// 				{
	// 					id: 'user-interface.icons.material-twotone',
	// 					title: 'Material Twotone',
	// 					type: 'item',
	// 					url: '/ui/icons/material/twotone'
	// 				},
	// 				{
	// 					id: 'user-interface.icons.material-outline',
	// 					title: 'Material Outline',
	// 					type: 'item',
	// 					url: '/ui/icons/material/outline'
	// 				},
	// 				{
	// 					id: 'user-interface.icons.material-solid',
	// 					title: 'Material Solid',
	// 					type: 'item',
	// 					url: '/ui/icons/material/solid'
	// 				},
	// 				{
	// 					id: 'user-interface.icons.feather',
	// 					title: 'Feather',
	// 					type: 'item',
	// 					url: '/ui/icons/feather'
	// 				}
	// 			]
	// 		},
	// 		{
	// 			id: 'user-interface.page-layouts',
	// 			title: 'Page Layouts',
	// 			type: 'collapse',
	// 			icon: 'heroicons-outline:template',
	// 			children: [
	// 				{
	// 					id: 'user-interface.page-layouts.overview',
	// 					title: 'Overview',
	// 					type: 'item',
	// 					url: '/ui/page-layouts/overview'
	// 				},
	// 				{
	// 					id: 'user-interface.page-layouts.carded',
	// 					title: 'Carded',
	// 					type: 'collapse',
	// 					children: [
	// 						{
	// 							id: 'user-interface.page-layouts.carded.full-width',
	// 							title: 'Full Width',
	// 							type: 'collapse',
	// 							url: '/ui/page-layouts/carded/full-width',
	// 							children: [
	// 								{
	// 									id: 'user-interface.page-layouts.carded.full-width.overview',
	// 									title: 'Full Width Overview',
	// 									type: 'item',
	// 									url: '/ui/page-layouts/carded/full-width/overview'
	// 								},
	// 								{
	// 									id: 'user-interface.page-layouts.carded.full-width.normal-scroll',
	// 									title: 'Full Width Normal Scroll',
	// 									type: 'item',
	// 									url: '/ui/page-layouts/carded/full-width/normal-scroll'
	// 								},
	// 								{
	// 									id: 'user-interface.page-layouts.carded.full-width.page-scroll',
	// 									title: 'Full Width Page Scroll',
	// 									type: 'item',
	// 									url: '/ui/page-layouts/carded/full-width/page-scroll'
	// 								},
	// 								{
	// 									id: 'user-interface.page-layouts.carded.full-width.content-scroll',
	// 									title: 'Full Width Content Scroll',
	// 									type: 'item',
	// 									url: '/ui/page-layouts/carded/full-width/content-scroll'
	// 								}
	// 							]
	// 						},
	// 						{
	// 							id: 'user-interface.page-layouts.carded.with-sidebars',
	// 							title: 'With Sidebars',
	// 							type: 'collapse',
	// 							url: '/ui/page-layouts/carded/with-sidebars',
	// 							children: [
	// 								{
	// 									id: 'user-interface.page-layouts.carded.with-sidebars.overview',
	// 									title: 'With Sidebars Overview',
	// 									type: 'item',
	// 									url: '/ui/page-layouts/carded/with-sidebars/overview'
	// 								},
	// 								{
	// 									id: 'user-interface.page-layouts.carded.with-sidebars.normal-scroll',
	// 									title: 'With Sidebars Normal Scroll',
	// 									type: 'item',
	// 									url: '/ui/page-layouts/carded/with-sidebars/normal-scroll'
	// 								},
	// 								{
	// 									id: 'user-interface.page-layouts.carded.with-sidebars.page-scroll',
	// 									title: 'With Sidebars Page Scroll',
	// 									type: 'item',
	// 									url: '/ui/page-layouts/carded/with-sidebars/page-scroll'
	// 								},
	// 								{
	// 									id: 'user-interface.page-layouts.carded.with-sidebars.content-scroll',
	// 									title: 'With Sidebars Content Scroll',
	// 									type: 'item',
	// 									url: '/ui/page-layouts/carded/with-sidebars/content-scroll'
	// 								}
	// 							]
	// 						}
	// 					]
	// 				},
	// 				{
	// 					id: 'user-interface.page-layouts.simple',
	// 					title: 'Simple',
	// 					type: 'collapse',
	// 					children: [
	// 						{
	// 							id: 'user-interface.page-layouts.simple.full-width',
	// 							title: 'Full Width',
	// 							type: 'collapse',
	// 							url: '/ui/page-layouts/simple/full-width',
	// 							children: [
	// 								{
	// 									id: 'user-interface.page-layouts.simple.full-width.overview',
	// 									title: 'Full Width Overview',
	// 									type: 'item',
	// 									url: '/ui/page-layouts/simple/full-width/overview'
	// 								},
	// 								{
	// 									id: 'user-interface.page-layouts.simple.full-width.normal-scroll',
	// 									title: 'Full Width Normal Scroll',
	// 									type: 'item',
	// 									url: '/ui/page-layouts/simple/full-width/normal-scroll'
	// 								},
	// 								{
	// 									id: 'user-interface.page-layouts.simple.full-width.page-scroll',
	// 									title: 'Full Width Page Scroll',
	// 									type: 'item',
	// 									url: '/ui/page-layouts/simple/full-width/page-scroll'
	// 								},
	// 								{
	// 									id: 'user-interface.page-layouts.simple.full-width.content-scroll',
	// 									title: 'Full Width Content Scroll',
	// 									type: 'item',
	// 									url: '/ui/page-layouts/simple/full-width/content-scroll'
	// 								}
	// 							]
	// 						},
	// 						{
	// 							id: 'user-interface.page-layouts.simple.with-sidebars',
	// 							title: 'With Sidebars',
	// 							type: 'collapse',
	// 							url: '/ui/page-layouts/simple/with-sidebars',
	// 							children: [
	// 								{
	// 									id: 'user-interface.page-layouts.simple.with-sidebars.overview',
	// 									title: 'With Sidebars Overview',
	// 									type: 'item',
	// 									url: '/ui/page-layouts/simple/with-sidebars/overview'
	// 								},
	// 								{
	// 									id: 'user-interface.page-layouts.simple.with-sidebars.normal-scroll',
	// 									title: 'With Sidebars Normal Scroll',
	// 									type: 'item',
	// 									url: '/ui/page-layouts/simple/with-sidebars/normal-scroll'
	// 								},
	// 								{
	// 									id: 'user-interface.page-layouts.simple.with-sidebars.page-scroll',
	// 									title: 'With Sidebars Page Scroll',
	// 									type: 'item',
	// 									url: '/ui/page-layouts/simple/with-sidebars/page-scroll'
	// 								},
	// 								{
	// 									id: 'user-interface.page-layouts.simple.with-sidebars.content-scroll',
	// 									title: 'With Sidebars Content Scroll',
	// 									type: 'item',
	// 									url: '/ui/page-layouts/simple/with-sidebars/content-scroll'
	// 								}
	// 							]
	// 						}
	// 					]
	// 				},
	// 				{
	// 					id: 'user-interface.page-layouts.empty',
	// 					title: 'Empty Page',
	// 					type: 'item',
	// 					url: '/ui/page-layouts/empty'
	// 				}
	// 			]
	// 		},
	// 		{
	// 			id: 'user-interface.typography',
	// 			title: 'Typography',
	// 			type: 'item',
	// 			icon: 'heroicons-outline:pencil',
	// 			url: '/ui/typography'
	// 		}
	// 	]
	// },
	// {
	// 	id: 'divider-1',
	// 	type: 'divider'
	// },
	// DocumentationNavigation,
	// {
	// 	id: 'auth',
	// 	title: 'Auth',
	// 	type: 'group',
	// 	icon: 'verified_user',
	// 	children: [
	// 		{
	// 			id: 'sign-in',
	// 			title: 'Sign in',
	// 			type: 'item',
	// 			url: 'sign-in',
	// 			auth: authRoles.onlyGuest,
	// 			icon: 'lock'
	// 		},
	// 		{
	// 			id: 'register',
	// 			title: 'Register',
	// 			type: 'item',
	// 			url: 'register',
	// 			auth: authRoles.onlyGuest,
	// 			icon: 'person_add'
	// 		},
	// 		{
	// 			id: 'sign-out',
	// 			title: 'Sign out',
	// 			type: 'item',
	// 			auth: authRoles.user,
	// 			url: 'sign-out',
	// 			icon: 'exit_to_app'
	// 		},
	// 		{
	// 			id: 'auth-admin-example',
	// 			title: 'Admin: Auth protected page',
	// 			type: 'item',
	// 			url: 'auth/admin-role-example',
	// 			icon: 'security'
	// 		},
	// 		{
	// 			id: 'only-admin-navigation-item',
	// 			title: 'Nav item only for Admin',
	// 			type: 'item',
	// 			auth: authRoles.admin,
	// 			url: 'auth/admin-role-example',
	// 			icon: 'verified_user'
	// 		},
	// 		{
	// 			id: 'auth-staff-example',
	// 			title: 'Staff: Auth protected page',
	// 			type: 'item',
	// 			url: 'auth/staff-role-example',
	// 			icon: 'security'
	// 		},
	// 		{
	// 			id: 'only-staff-navigation-item',
	// 			title: 'Nav item only for Staff',
	// 			type: 'item',
	// 			auth: authRoles.staff,
	// 			url: 'auth/staff-role-example',
	// 			icon: 'verified_user'
	// 		},
	// 		{
	// 			id: 'auth-guest-example',
	// 			title: 'Guest: Auth protected page',
	// 			type: 'item',
	// 			url: 'auth/guest-role-example',
	// 			icon: 'security'
	// 		},
	// 		{
	// 			id: 'only-guest-navigation-item',
	// 			title: 'Nav item only for Guest',
	// 			type: 'item',
	// 			auth: authRoles.onlyGuest,
	// 			url: 'auth/guest-role-example',
	// 			icon: 'verified_user'
	// 		}
	// 	]
	// },
	// {
	// 	type: 'divider',
	// 	id: 'divider-2'
	// },
	// {
	// 	id: 'navigation-features',
	// 	title: 'Navigation features',
	// 	subtitle: 'Collapsable levels & badge styles',
	// 	type: 'group',
	// 	icon: 'heroicons-outline:menu',
	// 	children: [
	// 		{
	// 			id: 'navigation-features.level.0',
	// 			title: 'Level 0',
	// 			icon: 'heroicons-outline:check-circle',
	// 			type: 'collapse',
	// 			children: [
	// 				{
	// 					id: 'navigation-features.level.0.1',
	// 					title: 'Level 1',
	// 					type: 'collapse',
	// 					children: [
	// 						{
	// 							id: 'navigation-features.level.0.1.2',
	// 							title: 'Level 2',
	// 							type: 'collapse',
	// 							children: [
	// 								{
	// 									id: 'navigation-features.level.0.1.2.3',
	// 									title: 'Level 3',
	// 									type: 'collapse',
	// 									children: [
	// 										{
	// 											id: 'navigation-features.level.0.1.2.3.4',
	// 											title: 'Level 4',
	// 											type: 'collapse',
	// 											children: [
	// 												{
	// 													id: 'navigation-features.level.0.1.2.3.4.5',
	// 													title: 'Level 5',
	// 													type: 'collapse',
	// 													children: [
	// 														{
	// 															id: 'navigation-features.level.0.1.2.3.4.5.6',
	// 															title: 'Level 6',
	// 															type: 'item'
	// 														}
	// 													]
	// 												}
	// 											]
	// 										}
	// 									]
	// 								}
	// 							]
	// 						}
	// 					]
	// 				}
	// 			]
	// 		},
	// 		{
	// 			id: 'navigation-features2.level.0',
	// 			title: 'Level 0',
	// 			subtitle: 'With subtitle',
	// 			icon: 'heroicons-outline:check-circle',
	// 			type: 'collapse',
	// 			children: [
	// 				{
	// 					id: 'navigation-features2.level.0.1-1',
	// 					title: 'Level 1.1',
	// 					type: 'item'
	// 				},
	// 				{
	// 					id: 'navigation-features2.level.0.1-2',
	// 					title: 'Level 1.2',
	// 					type: 'item'
	// 				}
	// 			]
	// 		},
	// 		{
	// 			id: 'navigation-features.active',
	// 			title: 'Active item',
	// 			subtitle: 'Manually marked as active',
	// 			icon: 'heroicons-outline:check-circle',
	// 			type: 'item',
	// 			active: true
	// 		},
	// 		{
	// 			id: 'navigation-features.disabled-collapse',
	// 			title: 'Disabled collapse',
	// 			subtitle: 'Some subtitle',
	// 			icon: 'heroicons-outline:check-circle',
	// 			type: 'collapse',
	// 			disabled: true,
	// 			children: [
	// 				{
	// 					id: 'navigation-features.disabled-collapse.child',
	// 					title: "You shouldn't be able to see this child",
	// 					type: 'item'
	// 				}
	// 			]
	// 		},
	// 		{
	// 			id: 'navigation-features.disabled-item',
	// 			title: 'Disabled item',
	// 			subtitle: 'Some subtitle',
	// 			icon: 'heroicons-outline:check-circle',
	// 			type: 'item',
	// 			disabled: true
	// 		},
	// 		{
	// 			id: 'navigation-features.badge-style-oval',
	// 			title: 'Oval badge',
	// 			icon: 'heroicons-outline:tag',
	// 			type: 'item',
	// 			badge: {
	// 				title: '8',
	// 				classes: 'w-20 h-20 bg-teal-400 text-black rounded-full'
	// 			}
	// 		},
	// 		{
	// 			id: 'navigation-features.badge-style-rectangle',
	// 			title: 'Rectangle badge',
	// 			icon: 'heroicons-outline:tag',
	// 			type: 'item',
	// 			badge: {
	// 				title: 'Updated!',
	// 				classes: 'px-8 bg-teal-400 text-black rounded'
	// 			}
	// 		},
	// 		{
	// 			id: 'navigation-features.badge-style-rounded',
	// 			title: 'Rounded badge',
	// 			icon: 'heroicons-outline:tag',
	// 			type: 'item',
	// 			badge: {
	// 				title: 'NEW',
	// 				classes: 'px-10 bg-teal-400 text-black rounded-full'
	// 			}
	// 		},
	// 		{
	// 			id: 'navigation-features.badge-style-simple',
	// 			title: 'Simple badge',
	// 			icon: 'heroicons-outline:tag',
	// 			type: 'item',
	// 			badge: {
	// 				title: '87 Unread',
	// 				classes: 'bg-transparent text-teal-500'
	// 			}
	// 		}
	// 	]
	// }
];

export default navigationConfig;
