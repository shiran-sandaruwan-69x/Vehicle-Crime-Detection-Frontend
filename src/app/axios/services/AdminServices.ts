const ADMIN_BASE_URL: string = import.meta.env.VITE_BASE_URL_SERVICE as string;

export const GET_USER_ROLES = `${ADMIN_BASE_URL}/api/roles`;
export const SAVE_ADMIN_ROLE = `${ADMIN_BASE_URL}/api/role/save`;
export const UPDATE_ADMIN_ROLE = `${ADMIN_BASE_URL}/api/role/update`;

export const GET_ADMIN_USERS = `${ADMIN_BASE_URL}/api/users`;

export const GET_PERMISSIONS_BY_ID = `${ADMIN_BASE_URL}/api/role`;
export const UPDATE_PERMISSIONS = `${ADMIN_BASE_URL}/api/admin/v1/permissions/`;

export const FETCH_ORDER_REVIEWS = `${ADMIN_BASE_URL}/api/admin/v1/order-reviews`;
export const FETCH_ORDER_REVIEW_BY_ID = `${ADMIN_BASE_URL}/api/admin/v1/order-reviews/`;

export const FETCH_ORDER_PLANINGS = `${ADMIN_BASE_URL}/api/admin/v1/order-planing`;
export const FETCH_ORDER_PLANING_BY_ID = `${ADMIN_BASE_URL}/api/admin/v1/order-planing/`;
export const CREATE_PLAN_FOR_TODAY = `${ADMIN_BASE_URL}/api/admin/v1/order-planing`;

export const FETCH_WAREHOUSE_PLANINGS = `${ADMIN_BASE_URL}/api/admin/v1/warehouse-planing`;
export const FETCH_WAREHOUSE_PLANING_BY_ID = `${ADMIN_BASE_URL}/api/admin/v1/warehouse-planing/`;

export const FETCH_ORDER_CANCEL_REASONS = `${ADMIN_BASE_URL}/api/admin/v1/order-cancel-reasons?paginate=false`;
export const FETCH_ORDER_STATUS = `${ADMIN_BASE_URL}/api/admin/v1/order-status`;

export const ORDER_REVIEW_UPDATE_ITEM = `${ADMIN_BASE_URL}/api/admin/v1/order-reviews/`;
export const ORDER_PLANING_DELETE_ITEM = `${ADMIN_BASE_URL}/api/admin/v1/order-reviews/`;
export const ORDER_REVIEW_UPDATE = `${ADMIN_BASE_URL}/api/admin/v1/order-reviews/`;

export const ORDER_PLANING_UPDATE = `${ADMIN_BASE_URL}/api/admin/v1/order-planing/`;

export const FETCH_PICKER_LIST = `${ADMIN_BASE_URL}/api/admin/v1/all-pickers`;
export const CREATE_PICKER_ASSIGN_WAREHOUSE_ORDERS = `${ADMIN_BASE_URL}/api/admin/v1/warehouse-planing`;

export const FETCH_ORDERS_FOR_PICKER = `${ADMIN_BASE_URL}/api/admin/v1/order-pickers`;

export const FETCH_BACK_ORDERS = `${ADMIN_BASE_URL}/api/admin/v1/back-orders`;
export const FETCH_BACK_ORDER_HISTORY = `${ADMIN_BASE_URL}/api/admin/v1/back-order-histories`;
export const FETCH_BACK_ORDER_BY_ID = `${ADMIN_BASE_URL}/api/admin/v1/back-orders/`;
export const BACK_ORDER_UPDATE_ITEM = `${ADMIN_BASE_URL}/api/admin/v1/back-orders/`;
export const BACK_ORDER_DELETE_ITEM = `${ADMIN_BASE_URL}/api/admin/v1/back-orders/`;
export const BACK_ORDER_UPDATE = `${ADMIN_BASE_URL}/api/admin/v1/back-orders/`;
export const FETCH_BACK_ORDER_HISTORY_BY_ID = `${ADMIN_BASE_URL}/api/admin/v1/back-order-histories/`;

export const FETCH_PICKER_LIST_BY_PICKER = `${ADMIN_BASE_URL}/api/admin/v1/order-pickers`;
export const FETCH_PICKER_LIST_BY_ORDER_ID = `${ADMIN_BASE_URL}/api/admin/v1/order-pickers/`;

export const POST_PICKERLIST_PRINT_BAG = `${ADMIN_BASE_URL}/api/admin/v1/bag-label-print`;
export const POST_PICKERLIST_BOX_LABEL = `${ADMIN_BASE_URL}/api/admin/v1/box-label-print`;
export const PUT_PICKERLIST_BOX_LABEL = `${ADMIN_BASE_URL}/api/admin/v1/order-pickers`;

export const GET_GENERAL_PAGES = `${ADMIN_BASE_URL}/api/admin/v1/general-pages`;
export const POST_GENERAL_PAGE = `${ADMIN_BASE_URL}/api/admin/v1/general-pages`;
export const UPDATE_GENERAL_PAGE = `${ADMIN_BASE_URL}/api/admin/v1/general-pages/`;

// export const DELETE_ADMIN_ROLE = `${ADMIN_BASE_URL}/userRole/delete`;
export const GET_LOTTERY_PROFILES = `${ADMIN_BASE_URL}/lotteryProfile/getAll`;
export const GET_ALL_LOTTERIES = `${ADMIN_BASE_URL}/lottery`;

export const GET_PERMISSION_MODULES = `${ADMIN_BASE_URL}/userRole/getAllModules`;

// cancel orders
export const GET_CANCEL_ORDERS = `${ADMIN_BASE_URL}/api/admin/v1/order-cancels`;
export const GET_CANCEL_ORDER_BY_ID = `${ADMIN_BASE_URL}/api/admin/v1/order-cancels/`;
export const CREATE_CANCEL_ORDER = `${ADMIN_BASE_URL}/api/admin/v1/order-cancels`;

// system settings
export const FREE_SHIPPING_SETTINGS = `${ADMIN_BASE_URL}/api/admin/v1/system-configurations/2`;
export const SYSTEM_SETTINGS_BACK_ORDER = `${ADMIN_BASE_URL}/api/admin/v1/system-configurations/6`;
export const SYSTEM_SETTINGS_DIVERS_DEN_SNEAL_PEEK_TIME = `${ADMIN_BASE_URL}/api/admin/v1/system-configurations/4`;
export const SYSTEM_SETTINGS_DIVERS_DEN_DAILY_TIME = `${ADMIN_BASE_URL}/api/admin/v1/system-configurations/5`;
export const SYSTEM_SETTINGS_REWARD_POINTS = `${ADMIN_BASE_URL}/api/admin/v1/system-configurations/1`;
export const SYSTEM_SETTINGS_BOX_CHARGE = `${ADMIN_BASE_URL}/api/admin/v1/system-configurations/3`;
export const SYSTEM_SETTINGS_COMPANIES = `${ADMIN_BASE_URL}/api/admin/v1/companies`;

// content management contact us subject manage
export const CONTACT_US_SUBJECT_MANAGEMENT = `${ADMIN_BASE_URL}/api/admin/v1/contact-us-subjects`;

// customer services
export const ORDER_CLAIMS = `${ADMIN_BASE_URL}/api/admin/v1/order-claims`;
export const HOTLINE_ORDERS = `${ADMIN_BASE_URL}/api/admin/v1/hotline-orders`;
export const HOTLINE_CUSTOMER_AND_ORDERS = `${ADMIN_BASE_URL}/api/admin/v1/hotline-order/customer-details`;

export const CUSTOMERS = `${ADMIN_BASE_URL}/api/admin/v1/customers`;

// vedio library
export const VIDEO_LIBRARY_TOPICS = `${ADMIN_BASE_URL}/api/admin/v1/video-library-topics`;
export const VIDEO_LIBRARY = `${ADMIN_BASE_URL}/api/admin/v1/video-libraries`;

// revirews
export const CUSTOMER_REVIEWS = `${ADMIN_BASE_URL}/api/admin/v1/customer-reviews`;
export const ALL_REVIEWS = `${ADMIN_BASE_URL}/api/admin/v1/reviews`;

// gift certificates
export const GIFT_CERRTIFICATE = `${ADMIN_BASE_URL}/api/admin/v1/gift-certificates`;
export const GIFT_CERTIFICATE_CODES = `${ADMIN_BASE_URL}/api/admin/v1/code-generators`;
export const GIFT_CERTIFICATE_HISTORY = `${ADMIN_BASE_URL}/api/admin/v1/purchase-history`;

export const FETCH_MASTER_DATA_CSI = `${ADMIN_BASE_URL}/api/admin/v1/master-datas`;

// hot line orders
export const HOTLINE_ORDER = `${ADMIN_BASE_URL}/api/admin/v1/hotline-order`;
export const PRICE_CHANGE_REASONS = `${ADMIN_BASE_URL}/api/admin/v1/unit-price-change-reasons?paginate=false`;
export const ORDER_ITEMS_INSERT = `${ADMIN_BASE_URL}/api/admin/v1/hotline-orders`;
export const AUTO_DELIVERY_DURATIONS = `${ADMIN_BASE_URL}/api/admin/v1/delivery-durations`;
export const GET_CART_ITEMS_BY_CUSTOMER_ID = `${ADMIN_BASE_URL}/api/admin/v1/hotline-order/customer-details`;
export const HOTLINE_ORDER_ORDER_CHECKOUT = `${ADMIN_BASE_URL}/api/admin/v1/hotline-order/checkout`;

// order fulfilment
export const ORDER_FULFILMENTS = `${ADMIN_BASE_URL}/api/admin/v1/order-fulfillments`;
export const ORDER_FULFILMENTS_PRINT_URL = `${ADMIN_BASE_URL}/api/admin/v1/order-fulfillment`;

// header Layout
export const HEADER_LAYOUT = `${ADMIN_BASE_URL}/api/admin/v1/header-layouts`;
export const FOOTER_LAYOUT = `${ADMIN_BASE_URL}/api/admin/v1/footer-layouts`;

// here images for frontend
export const HERO_SECTION_SLIDER = `${ADMIN_BASE_URL}/api/admin/v1/home-hero`;
export const PICKER_LIST_PRINTS = `${ADMIN_BASE_URL}/api/admin/v1/order-picker-print`;
export const PICKER_LIST_STATUS = `${ADMIN_BASE_URL}/api/admin/v1/order-picker-status`;
export const PICKER_LIST_BAG_PRINT = `${ADMIN_BASE_URL}/api/admin/v1/bag-label-print`;
export const ORDER_PLANING = `${ADMIN_BASE_URL}/api/admin/v1/orders`;
export const CODE_GENERATOR_INACTIVE = `${ADMIN_BASE_URL}/api/admin/v1/code-generators`;
export const BACK_ORDERS = `${ADMIN_BASE_URL}/api/admin/v1/back-orders`;
