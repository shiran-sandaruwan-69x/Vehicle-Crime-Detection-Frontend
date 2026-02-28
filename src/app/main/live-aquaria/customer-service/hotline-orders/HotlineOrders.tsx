import { Button, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { HOTLINE_ORDERS } from "src/app/axios/services/AdminServices";
import useDebounce from "app/shared-components/useDebounce";
import MaterialTableWrapper from "../../../../common/tableComponents/MaterialTableWrapper";
import NavigationViewComp from "../../../../common/FormComponents/NavigationViewComp";
import HotlineOrdersCreateModal from "./HotlineOrdersCreateModal";
import OrderStatusModal from "./components/OrderStatusModal";

interface FilterValues {
  by_date: string;
  product: string;
  first_name: string;
  status: string;
  location: string;
}

function HotlineOrders() {
  const { t } = useTranslation("hotlineOrders");
  const [pageNo, setPageNo] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(5);
  const [count, setCount] = useState(100);
  const [isOpenOrderCreateModal, setIsOpenOrderCreateModal] = useState(false);
  const [isOpenOrderViewModal, setIsOpenOrderViewModal] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [hotlineOrders, setHotlineOrders] = useState([]);

  const [filteredValues, setFilteredValues] = useState<FilterValues>({
    by_date: null,
    product: null,
    location: null,
    first_name: null,
    status: null,
  });
  const debouncedFilter = useDebounce<FilterValues>(filteredValues, 1000);

  useEffect(() => {
    fetchHotLineOrders(filteredValues);
  }, []);

  const fetchHotLineOrders = async (filteredValues: FilterValues) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${HOTLINE_ORDERS}?pageNo=${pageNo}&pageSize=${pageSize}`
      );

      const data =
        response.data.data.length > 0 &&
        response.data.data.map((item: any) => ({
          id: item?.id,
          orderId: item?.order_no,
          customerName: `${item?.customer_details?.first_name} ${item?.customer_details?.last_name}`,
          email: item?.customer_details?.email,
          date: item?.order_date,
          elapsedDays: "dummy",
          orderValue: `$${item?.total_amount}`,
          status: item?.status,
        }));
      setHotlineOrders(data);
      setCount(response.data.meta.total);
    } catch (error) {
      // error
    } finally {
      setLoading(false);
    }
  };

  const category = [
    { value: "1", label: "Product 01" },
    { value: "2", label: "Product 02" },
    { value: "3", label: "Product 03" },
  ];

  const customerOptions = [
    { value: "1", label: "John Doe" },
    { value: "2", label: "Jane Smith" },
    { value: "3", label: "Alice Johnson" },
  ];

  const statusOptions = [
    { value: "1", label: "Active" },
    { value: "2", label: "Inactive" },
  ];

  const [filteredCustomerOptions, setFilteredCustomerOptions] =
    useState(customerOptions);

  // const [customerOptions, setCustomerOptions] = useState([]);
  // const [filteredCustomerOptions, setFilteredCustomerOptions] = useState([]);

  // useEffect(() => {
  //     // Fetch customer options from an API
  //     fetch('/api/customers')
  //         .then((response) => response.json())
  //         .then((data) => {
  //             const options = data.map((customer) => ({
  //                 label: customer.name,
  //                 value: customer.id,
  //             }));
  //             setCustomerOptions(options);
  //             setFilteredCustomerOptions(options); // Initialize filtered options
  //         });
  // }, []);

  // const handleSearchByCustomer = (searchTerm: string) => {
  //     const filteredCustomers = customerOptions.filter((customer) =>
  //         customer.label.toLowerCase().includes(searchTerm.toLowerCase())
  //     );
  //     setFilteredCustomerOptions(filteredCustomers);
  // };

  const toggleHotlineOrdersCreateModal = () =>
    setIsOpenOrderCreateModal(!isOpenOrderCreateModal);

  const toggleHotlineOrderStatusModal = () =>
    setIsOpenOrderViewModal(!isOpenOrderViewModal);

  const handleCreateButtonClick = () => {
    toggleHotlineOrdersCreateModal();
    setIsModalOpen(true);
  };

  const handleOpenNewMethodModal = () => {};

  const handleViewIconClick = (rowData) => {
    setSelectedRowData(rowData);
    toggleHotlineOrderStatusModal();
    setIsModalOpen(true);
  };

  const tableColumns = [
    {
      title: t("ORDER_ID"),
      field: "orderId",
      cellStyle: {
        padding: "4px 8px",
      },
    },
    {
      title: t("CUSTOMER_NAME"),
      field: "customerName",
      cellStyle: {
        padding: "4px 8px",
      },
    },
    {
      title: t("EMAIL"),
      field: "email",
      cellStyle: {
        padding: "4px 8px",
      },
    },
    {
      title: t("DATE"),
      field: "date",
      cellStyle: {
        padding: "4px 8px",
      },
    },
    {
      title: t("ELAPSED_DAYS"),
      field: "elapsedDays",
      cellStyle: {
        padding: "4px 8px",
      },
    },
    {
      title: t("ORDER_VALUE"),
      field: "orderValue",
      cellStyle: {
        padding: "4px 8px",
      },
    },
    {
      title: t("STATUS"),
      field: "status",
      cellStyle: {
        padding: "4px 8px",
      },
    },
  ];

  const tableRowPrintHandler = (rowData) => {
    // Logic for editing a row
  };

  const handlePageChange = (page: number) => {
    setPageNo(page);
  };

  const handlePageSizeChange = (pageSize: number) => {
    setPageSize(pageSize);
  };

  return (
    <div className="min-w-full max-w-[100vw]">
      <NavigationViewComp title="Customer Service / Hotline Orders" />
      <div className="mx-auto">
        <Grid container spacing={2} className="pt-[10px] pr-[30px] mx-auto">
          {/* <Grid
						item
						xs={12}
						sm={6}
						md={4}
						lg={3}
						xl={2}
						className="pt-[5px!important]"
					>
						<Typography className="formTypography">{t('BY_DATE')}</Typography>
						<TextFormDateField
							name="by_date"
							type="date"
							id="by_date"
							max={new Date().toISOString().split('T')[0]}
							disablePastDate
							// changeInput={(value: string) => {
							// 	setFieldValue('by_date', value).then((r) => r);
							// }}
						/>
					</Grid>
					<Grid
						item
						xs={12}
						sm={6}
						md={4}
						lg={3}
						xl={2}
						className="pt-[5px!important]"
					>
						<Typography className="formTypography">{t('PRODUCT')}</Typography>
						<FormDropdown
							name="product"
							id="product"
							placeholder=""
							optionsValues={category}
							disabled={false}
						/>
					</Grid>
					<Grid
						item
						xs={12}
						sm={6}
						md={4}
						lg={3}
						xl={2}
						className="pt-[5px!important]"
					>
						<Typography className="formTypography">{t('LOCATION')}</Typography>
						<FormDropdown
							name="location"
							id="location"
							placeholder=""
							optionsValues={category}
							disabled={false}
						/>
					</Grid>
					<Grid
						item
						xs={12}
						sm={6}
						md={4}
						lg={3}
						xl={2}
						className="pt-[5px!important]"
					>
						<Typography className="formTypography">{t('CUSTOMER')}</Typography>
						<FormDropdown
							name="customer"
							id="customer"
							placeholder=""
							optionsValues={customerOptions}
							disabled={false}
						/>
					</Grid>
					<Grid
						item
						xs={12}
						sm={6}
						md={4}
						lg={3}
						xl={2}
						className="pt-[5px!important]"
					>
						<Typography className="formTypography">{t('STATUS')}</Typography>
						<FormDropdown
							name="status"
							id="status"
							placeholder=""
							optionsValues={statusOptions}
							disabled={false}
						/>
					</Grid>
					<Grid
						item
						xs={12}
						sm={6}
						md={4}
						lg={3}
						xl={2}
						className="flex items-start gap-[5px] lg:gap-[10px] formikFormField !pt-[10px] sm:!pt-[26px]"
					>
						<div className="flex xl:justify-between items-start gap-[5px] lg:gap-[10px] w-full">
							<Button
								className="flex justify-center items-center min-w-max lg:min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
								type="submit"
								variant="contained"
								size="medium"
								disabled={false}
							>
								{t('CLEAR_ALL')}
							</Button>
							<Button
								className="flex justify-center items-center min-w-max lg:min-w-[100px] xl:min-w-[120px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
								type="button"
								variant="contained"
								size="medium"
								disabled={false}
								onClick={handleOpenNewMethodModal}
							>
								{t('FILTER_ALL')}
							</Button>
						</div>
						<Button
							className="flex lg:hidden justify-center items-center min-w-max min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
							type="button"
							variant="contained"
							size="medium"
							disabled={false}
							onClick={handleCreateButtonClick}
						>
							{t('CREATE_ORDER')}
						</Button>
					</Grid> */}
          <Grid
            item
            xs={12}
            className="hidden lg:flex justify-end items-start gap-[10px] formikFormField !pt-[26px] xl:!pt-[5px]"
          >
            <Button
              className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
              type="button"
              variant="contained"
              size="medium"
              disabled={false}
              onClick={handleCreateButtonClick}
            >
              {t("CREATE_ORDER")}
            </Button>
          </Grid>
        </Grid>
      </div>

      <Grid container spacing={2} className="pt-[20px] pr-[30px] mx-auto">
        <Grid item md={12} sm={12} xs={12} className="!pt-[5px]">
          <MaterialTableWrapper
            title=""
            filterChanged={null}
            handleColumnFilter={null}
            tableColumns={tableColumns}
            handlePageChange={handlePageChange}
            handlePageSizeChange={handlePageSizeChange}
            handleCommonSearchBar={null}
            pageSize={pageSize}
            disableColumnFiltering
            pageIndex={pageNo}
            setPageSize={setPageSize}
            searchByText=""
            // loading={isTableLoading}
            count={count}
            exportToExcel={null}
            handleRowDeleteAction={null}
            externalAdd={null}
            externalEdit={null}
            externalView={null}
            selection={false}
            selectionExport={null}
            disableSearch
            isColumnChoser
            records={hotlineOrders}
            tableRowViewHandler={handleViewIconClick}
            tableRowPrintHandler={tableRowPrintHandler}
          />
        </Grid>
      </Grid>
      {isOpenOrderCreateModal && (
        <HotlineOrdersCreateModal
          isOpen={isOpenOrderCreateModal}
          toggleModal={toggleHotlineOrdersCreateModal}
          // handleClose={setOpenNewMethodModal}
        />
      )}

      {isOpenOrderViewModal && (
        <OrderStatusModal
          isOpen={isOpenOrderViewModal}
          toggleModal={toggleHotlineOrderStatusModal}
          id={selectedRowData?.id}
        />
      )}
    </div>
  );
}

export default HotlineOrders;
