import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useTranslation } from "react-i18next";
import { Grid, Typography } from "@mui/material";
import { Form, Formik } from "formik";
import FormDropdown from "../../../../../common/FormComponents/FormDropdown";
import DiscountPromotion from "./DiscountPromotion";
import NewCustomer from "./NewCustomer";
import SpecificCustomer from "./SpecificCustomer";
import { PromotionModifiedData } from "../promotions-types/PromotionsTypes";

interface Props {
  isOpen?: boolean;
  toggleModal?: () => void;
  isMode?: string;
  fetchAllPromotion: () => void;
  clickedRowData: PromotionModifiedData;
}

function RootComponent({
  isOpen = false,
  toggleModal,
  isMode,
  fetchAllPromotion,
  clickedRowData,
}: Props) {
  const { t } = useTranslation("promotions");

  useEffect(() => {
    if (isMode !== "create") {
      handleCategoryChange(clickedRowData?.type_id);
    }
  }, []);

  const category = [
    { value: "1", label: "Discount Promotions" },
    { value: "2", label: "New Customer" },
    { value: "3", label: "Specific Customer" },
  ];

  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };

  return (
    <Dialog
      fullWidth
      open={isOpen}
      maxWidth="sm"
      onClose={toggleModal}
      PaperProps={{
        style: {
          top: "40px",
          margin: 0,
          position: "absolute",
        },
      }}
    >
      <DialogTitle className="pb-0">
        <h6 className="text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-400">
          {(() => {
            switch (isMode) {
              case "view":
                return t("View");
              case "edit":
                return t("Edit");
              default:
                return t("Create New");
            }
          })()}{" "}
          Promotion
        </h6>
      </DialogTitle>
      <DialogContent>
        <Formik
          initialValues={{
            promotionType: clickedRowData?.type_id || "",
          }}
          onSubmit={null}
          validationSchema={null}
        >
          {({ values, setFieldValue, isValid, resetForm }) => (
            <Form>
              <Grid container spacing={2} className="pt-[10px]">
                <Grid
                  item
                  lg={6}
                  md={6}
                  sm={12}
                  xs={12}
                  className="pt-[5px!important]"
                >
                  <Typography className="formTypography">
                    {t("PROMOTION_TYPE")}
                  </Typography>
                  <FormDropdown
                    name="promotionType"
                    id="promotionType"
                    placeholder=""
                    optionsValues={category}
                    disabled={isMode !== "create"}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      e.preventDefault();
                      const { value } = e.target;
                      handleCategoryChange(value);
                    }}
                  />
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>

        <div className="mt-5">
          {selectedCategory === "1" && (
            <DiscountPromotion
              toggleModal={toggleModal}
              isMode={isMode}
              clickedRowData={clickedRowData}
              fetchAllPromotion={fetchAllPromotion}
            />
          )}

          {selectedCategory === "2" && (
            <NewCustomer
              toggleModal={toggleModal}
              isMode={isMode}
              clickedRowData={clickedRowData}
              fetchAllPromotion={fetchAllPromotion}
            />
          )}

          {selectedCategory === "3" && (
            <SpecificCustomer
              toggleModal={toggleModal}
              isMode={isMode}
              clickedRowData={clickedRowData}
              fetchAllPromotion={fetchAllPromotion}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default RootComponent;
