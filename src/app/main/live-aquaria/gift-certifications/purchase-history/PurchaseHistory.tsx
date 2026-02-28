import { Button, Grid, Paper, TextField, Typography } from "@mui/material";
import useDebounce from "app/shared-components/useDebounce";
import axios from "axios";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { GIFT_CERTIFICATE_HISTORY } from "src/app/axios/services/AdminServices";
import NavigationViewComp from "../../../../common/FormComponents/NavigationViewComp";
import MaterialTableWrapper from "../../../../common/tableComponents/MaterialTableWrapper";
import PurchaseHistoryViewModal from "./components/PuchaseHistoryViewModal";

interface FilterValues {
  card_name: string;
  order_id: string;
  customer_id: string;
  purchase_date: string;
  expire_date: string;
}

interface Customer {
  id: string;
  code: string;
  first_name: string;
  last_name: string;
  mobile_no: string;
  email: string;
  gender: string | null;
  dob: string;
  is_active: number;
  profile_image: string;
  total_credit_points: string;
  total_remaining_points: string;
}

interface GiftCertificate {
  id: number;
  name: string;
  display_name: string;
  start_date: string;
  end_date: string;
  price: string;
  thumbnail: string;
  style: string;
  is_active: number;
}

export interface GiftCertificateMainInterface {
  id: number;
  order_id: string;
  customer: Customer;
  code: string;
  from: string;
  to: string;
  date_to_send: string | null;
  message: string;
  email: string | null;
  amount: string;
  delivery_method: string;
  created_at: string;
  gift_certificate: GiftCertificate;
}

function PurchaseHistory() {
  const { t } = useTranslation("purchaseHistory");
  const [pageNo, setPageNo] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(5);
  const [count, setCount] = useState(100);
  const [clickedRowData, setClickedRowData] =
    useState<GiftCertificateMainInterface>(null);
  const [isOpenViewModal, setIsOpenViewModal] = useState(false);
  const [filteredValues, setFilteredValues] = useState<FilterValues>({
    card_name: null,
    order_id: null,
    customer_id: null,
    purchase_date: null,
    expire_date: null,
  });
  const debouncedFilter = useDebounce<any>(filteredValues, 1000);
  const [GiftCertificateHistory, setGiftCertificateHistory] = useState<
    GiftCertificateMainInterface[]
  >([]);
  const toggleClickedViewModal = () => setIsOpenViewModal(!isOpenViewModal);

  useEffect(() => {
    fetchGiftCertificateHostory(filteredValues);
  }, [pageNo, pageSize]);

  useEffect(() => {
    if (debouncedFilter) fetchGiftCertificateHostory(filteredValues);
  }, [debouncedFilter]);

  const fetchGiftCertificateHostory = async (filteredValues: FilterValues) => {
    try {
      const response = await axios.get(
        `${GIFT_CERTIFICATE_HISTORY}?filter=order_id,${filteredValues.order_id ? filteredValues.order_id : null}|giftCertificate.name,${filteredValues.card_name ? filteredValues.card_name : null}|created_at,${filteredValues.purchase_date ? filteredValues.purchase_date : null}|giftCertificate.end_date,${filteredValues.expire_date ? filteredValues.expire_date : null}|customer.number,${filteredValues.customer_id ? filteredValues.customer_id : null}&limit=${pageSize}&page=${pageNo + 1}`
      );
      setGiftCertificateHistory(response.data.data);
      setCount(response.data.meta.total);
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  const handleFilterAll = (values: any) => {
    console.log("Form Values:", values);
  };

  const tableColumns = [
    {
      title: t("ORDER_ID"),
      field: "order_id",
      cellStyle: { padding: "4px 8px" },
    },
    {
      title: t("CUSTOMER_ID"),
      field: "customerId",
      render: (rowData: GiftCertificateMainInterface) =>
        rowData?.customer?.code,
      cellStyle: { padding: "4px 8px" },
    },
    {
      title: t("GIFT_CARD_CODE"),
      field: "code",
      cellStyle: { padding: "4px 8px" },
    },
    {
      title: t("GIFT_CARD_NAME"),
      field: "giftCardName",
      render: (rowData: GiftCertificateMainInterface) =>
        rowData?.gift_certificate?.name,
      cellStyle: { padding: "4px 8px" },
    },
    {
      title: t("DISPLAY_NAME"),
      field: "displayName",
      render: (rowData: GiftCertificateMainInterface) =>
        rowData?.gift_certificate?.display_name,
      cellStyle: { padding: "4px 8px" },
    },
    {
      title: t("PRICE"),
      field: "price",
      render: (rowData: GiftCertificateMainInterface) =>
        rowData?.gift_certificate?.price,
      cellStyle: { padding: "4px 8px" },
    },
    {
      title: t("PURCHASE_DATE"),
      field: "created_at",
      render: (rowData: GiftCertificateMainInterface) =>
        new Date(rowData?.created_at).toISOString().split("T")[0],
      cellStyle: { padding: "4px 8px" },
    },
    {
      title: t("EXPIRE_DATE"),
      field: "expireDate",
      render: (rowData: GiftCertificateMainInterface) =>
        rowData?.gift_certificate?.end_date,
      cellStyle: { padding: "4px 8px" },
    },
  ];

  const tableRowViewHandler = (rowData: GiftCertificateMainInterface) => {
    setClickedRowData(rowData);
    toggleClickedViewModal();
  };

  const handlePageChange = (page: number) => {
    setPageNo(page);
  };

  const handlePageSizeChange = (pageSize: number) => {
    setPageSize(pageSize);
  };

  const clearFilterHandler = () => {
    const resetFilters: FilterValues = {
      card_name: "",
      order_id: "",
      customer_id: "",
      purchase_date: "",
      expire_date: "",
    };
    setFilteredValues(resetFilters);
    //   fetchOrderReviews(resetFilters);
  };

  return (
    <div className="min-w-full max-w-[100vw]">
      <NavigationViewComp
        title={`${t("GIFT_CERTIFICATE", "Gift Certificate")} / ${t("PURCHASE_HISTORY", "Purchase History")}`}
      />

      <Grid container spacing={2} className="pt-[10px] pr-[30px] mx-auto">
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={2}
          className="formikFormField pt-[5px!important]"
        >
          <Typography className="formTypography">Gift Card Name</Typography>
          <TextField
            id="outlined-basic"
            label=""
            variant="outlined"
            size="small"
            className="w-full"
            value={filteredValues.card_name}
            onChange={(event) => {
              setFilteredValues({
                ...filteredValues,
                card_name: event.target.value,
              });
            }}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={2}
          className="formikFormField pt-[5px!important]"
        >
          <Typography className="formTypography">Order ID</Typography>
          <TextField
            id="outlined-basic"
            label=""
            variant="outlined"
            size="small"
            className="w-full"
            value={filteredValues.order_id}
            onChange={(event) => {
              setFilteredValues({
                ...filteredValues,
                order_id: event.target.value,
              });
            }}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={2}
          className="formikFormField pt-[5px!important]"
        >
          <Typography className="formTypography">Customer ID</Typography>
          <TextField
            id="outlined-basic"
            label=""
            variant="outlined"
            size="small"
            className="w-full"
            value={filteredValues.customer_id}
            onChange={(event) => {
              setFilteredValues({
                ...filteredValues,
                customer_id: event.target.value,
              });
            }}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={2}
          className="formikFormField pt-[5px!important]"
        >
          <Typography className="formTypography">Purchase Date</Typography>
          <TextField
            type="date"
            id="outlined-basic"
            label=""
            variant="outlined"
            size="small"
            className="w-full"
            value={filteredValues.purchase_date}
            onChange={(event) => {
              setFilteredValues({
                ...filteredValues,
                purchase_date: event.target.value,
              });
            }}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={2}
          className="formikFormField pt-[5px!important]"
        >
          <Typography className="formTypography">Expire Date</Typography>
          <TextField
            type="date"
            id="outlined-basic"
            label=""
            variant="outlined"
            size="small"
            className="w-full"
            value={filteredValues.expire_date}
            onChange={(event) => {
              setFilteredValues({
                ...filteredValues,
                expire_date: event.target.value,
              });
            }}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={6}
          xl={2}
          className="justify-end xl:justify-start items-end gap-[10px] !pt-[10px] sm:!pt-[26px]"
        >
          <Button
            className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] xl:text-[14px] text-gray-600 font-500 lg:!px-[2px] xl:!p-[16px] py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
            type="submit"
            variant="contained"
            size="medium"
            disabled={false}
            onClick={clearFilterHandler}
          >
            Clear Filters
          </Button>
        </Grid>
      </Grid>

      <Grid container spacing={2} className="pt-[20px] pr-[30px] mx-auto">
        <Grid item md={12} sm={12} xs={12} className="pt-[5px!important]">
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
            records={GiftCertificateHistory}
            tableRowViewHandler={tableRowViewHandler}
          />
        </Grid>
      </Grid>

      {isOpenViewModal && (
        <PurchaseHistoryViewModal
          isOpen={isOpenViewModal}
          toggleModal={toggleClickedViewModal}
          clickedRowData={clickedRowData}
        />
      )}
    </div>
  );
}

export default PurchaseHistory;
