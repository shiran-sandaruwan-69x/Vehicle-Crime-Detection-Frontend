import AddCircleIcon from "@mui/icons-material/AddCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { Field, Form, Formik, FormikHelpers } from "formik";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import * as yup from "yup";
import { CircularProgress } from "@mui/material";
import { updateCategoryManagement } from "../../../../../axios/services/live-aquaria-services/master-data-services/MasterDataServices";
import TextFormField from "../../../../../common/FormComponents/FormTextField";
import {
  CategoryFormData,
  FlattenedCategory,
} from "../category-nanagement-types/CategoryManagementTypes";
import FormDropdown from "../../../../../common/FormComponents/FormDropdown";

interface ErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}
interface Props {
  toggleModal: () => void;
  isOpen: boolean;
  clickedRowData: FlattenedCategory;
  compType: string;
  getAllCategory: () => void;
}

function ViewCategoryDialogForm({
  toggleModal,
  isOpen,
  clickedRowData,
  compType,
  getAllCategory,
}: Props) {
  const { t } = useTranslation("categoryManagement");
  const maxImageCount = 1;
  const maxImageSize = 5 * 1024 * 1024; // 5MB
  const [images, setImages] = useState<{ file: File; base64: string }[]>([]);
  const [isSaveEnabled, setIsSaveEnabled] = useState(false);
  const [isFormDataLoading, setFormDataLoading] = useState(false);
  const [isGoodType, setGoodType] = useState([
    {
      label: "Live",
      value: "live",
    },
    {
      label: "Hard",
      value: "hard",
    },
  ]);

  const schema = yup.object().shape({
    category: yup.string().required(t("Category is required")),
    goodType: yup.string().required(t("Good Type is required")),
  });

  useEffect(() => {
    if (clickedRowData?.attachment) {
      loadImageFromURL(clickedRowData.attachment);
    }
  }, []);

  const loadImageFromURL = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const file = new File([blob], "image.png", { type: blob.type });
      const base64 = await convertToBase64(file);
      setImages([{ file, base64 }]);
    } catch (error) {
      toast.error("Failed to load image:");
    }
  };

  const onSubmit = async (values: CategoryFormData) => {
    const id: string = clickedRowData.id ? clickedRowData.id : "";
    const image = images[0]?.base64 ? images[0]?.base64 : null;

    if (clickedRowData.parentId && clickedRowData.parentId.length > 0) {
      if (!image) {
        toast.error("Image is required for Sub Categories");
        return;
      }
    }

    setFormDataLoading(true);
    const mediaData = {
      name: values.category,
      attachment: image,
      goods_type: values.goodType ?? null,
      aquatic_type: values.aquaticType,
      reference: values.referenceName ? values.referenceName : null,
      is_active: clickedRowData.active === true ? 1 : 0,
    };
    try {
      const response = await updateCategoryManagement(mediaData, id);
      getAllCategory();
      setFormDataLoading(false);
      toggleModal();
      toast.success("Updated successfully");
    } catch (error: any) {
      setFormDataLoading(false);
      const isErrorResponse = (error: unknown): error is ErrorResponse => {
        return (
          typeof error === "object" && error !== null && "response" in error
        );
      };

      if (isErrorResponse(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Internal server error");
      }
    }
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { files } = event.target;

    if (files) {
      if (images.length + files.length > maxImageCount) {
        toast.error(
          `You can only upload a maximum of ${maxImageCount} images.`
        );
        return;
      }

      const validImages: { file: File; base64: string }[] = [];
      // eslint-disable-next-line no-restricted-syntax
      for (const file of Array.from(files)) {
        // eslint-disable-next-line no-await-in-loop
        const isValid = await validateImageDimensions(file);

        if (isValid) {
          // eslint-disable-next-line no-await-in-loop
          const base64 = await convertToBase64(file);
          validImages.push({ file, base64 });
        }
      }

      if (validImages.length > 0) {
        setImages([...images, ...validImages]);
        setIsSaveEnabled(true);
      }
    }
  };

  const validateImageDimensions = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        if (img.width === img.height && file.size <= maxImageSize) {
          resolve(true);
        } else {
          toast.error(
            "Image upload failed: Width and height must be the same, and size should be <= 5MB."
          );
          resolve(false);
        }
      };
    });
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    setIsSaveEnabled(newImages.length > 0);
  };

  const handleClearForm = (
    resetForm: FormikHelpers<CategoryFormData>["resetForm"]
  ) => {
    resetForm({
      values: {
        category: "",
        referenceName: "",
        goodType: "",
      },
    });
  };

  const aquaticType = [
    {
      label: "Saltwater",
      value: "salt",
    },
    {
      label: "Freshwater",
      value: "fresh",
    },
    {
      label: "Both",
      value: "both",
    },
  ];

  return (
    <Dialog fullWidth open={isOpen} maxWidth="md" onClose={toggleModal}>
      <DialogTitle className="pb-0">
        <h6 className="text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-400">
          {compType === "view" ? "View" : "Edit"} Category
        </h6>
      </DialogTitle>
      <DialogContent>
        <Formik
          initialValues={{
            category: clickedRowData.category ? clickedRowData.category : "",
            aquaticType: clickedRowData.aquatic_type
              ? clickedRowData.aquatic_type
              : "",
            referenceName: clickedRowData.referenceName
              ? clickedRowData.referenceName
              : "",
            goodType: clickedRowData.goodsType ? clickedRowData.goodsType : "",
          }}
          validationSchema={schema}
          onSubmit={onSubmit}
        >
          {({ values, setFieldValue, isValid, resetForm }) => (
            <Form>
              <Grid container spacing={2} className="pt-[10px]">
                <Grid
                  item
                  lg={4}
                  md={6}
                  xs={12}
                  className="formikFormField pt-[5px!important]"
                >
                  <Typography className="formTypography">
                    Category Name
                    <span className="text-red"> *</span>
                  </Typography>
                  <Field
                    disabled={compType === "view"}
                    name="category"
                    placeholder={t("")}
                    component={TextFormField}
                    fullWidth
                    size="small"
                    variant="outlined"
                    type="text"
                    className=""
                  />
                </Grid>

                <Grid
                  item
                  lg={4}
                  md={6}
                  xs={12}
                  className="formikFormField pt-[5px!important]"
                >
                  <Typography className="formTypography">
                    Aquatic Type
                  </Typography>
                  <FormDropdown
                    optionsValues={aquaticType}
                    name="aquaticType"
                    id="aquaticType"
                    placeholder=""
                    disabled={
                      clickedRowData?.aquatic_type === "salt" ||
                      clickedRowData?.aquatic_type === "fresh" ||
                      compType === "view"
                    }
                  />
                </Grid>

                <Grid
                  item
                  lg={4}
                  md={6}
                  xs={12}
                  className="formikFormField pt-[5px!important]"
                >
                  <Typography>
                    Good Type
                    <span className="text-red"> *</span>
                  </Typography>
                  <FormDropdown
                    id="goodType"
                    name="goodType"
                    value={values.goodType}
                    optionsValues={isGoodType}
                  />
                </Grid>

                <Grid
                  item
                  lg={4}
                  md={6}
                  xs={12}
                  className="formikFormField pt-[5px!important]"
                >
                  <Typography className="formTypography">
                    Reference Name
                  </Typography>
                  <Field
                    disabled={compType === "view"}
                    name="referenceName"
                    placeholder={t("")}
                    component={TextFormField}
                    fullWidth
                    size="small"
                    variant="outlined"
                    type="text"
                    className=""
                  />
                </Grid>

                <Grid
                  item
                  lg={4}
                  md={6}
                  xs={12}
                  className="formikFormField pt-[5px!important]"
                >
                  <Typography className="formTypography">
                    Category Image
                  </Typography>
                  <div className="relative flex flex-wrap">
                    {images.map((image, index) => (
                      <div
                        key={index}
                        className="relative w-[150px] h-[150px] m-0 border-[2px] border-[#ccc] rounded-[10px] overflow-hidden"
                      >
                        <img
                          className="w-full h-full rounded-[10px] object-contain object-center"
                          src={URL.createObjectURL(image.file)}
                          alt="Thumbnail"
                        />
                        <IconButton
                          size="small"
                          className="absolute top-0 right-0 text-red p-[2px] rounded-full bg-black/5 transition-colors duration-300 hover:!text-red hover:bg-white"
                          disabled={compType === "view"}
                          onClick={() => handleRemoveImage(index)}
                        >
                          <CancelIcon fontSize="small" />
                        </IconButton>
                      </div>
                    ))}

                    {images.length < maxImageCount && (
                      <div className="relative flex justify-center items-center w-[150px] h-[150px] m-0 border-[2px] border-[#ccc] rounded-[10px]">
                        <IconButton
                          className="text-primaryBlue"
                          disabled={compType === "view"}
                          onClick={() =>
                            document.getElementById("imageUpload")?.click()
                          }
                        >
                          <AddCircleIcon fontSize="large" />
                        </IconButton>
                        <input
                          id="imageUpload"
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          multiple
                          onChange={handleImageUpload}
                          disabled={compType === "view"}
                        />
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-gray-700 italic">
                    <b className="text-red">Note : </b>
                    Image dimensions must be 1:1, and size ≤ 5MB.
                  </span>
                </Grid>

                <Grid
                  item
                  md={12}
                  sm={12}
                  xs={12}
                  className="flex justify-end items-center gap-[10px] pt-[10px!important]"
                >
                  {compType === "view" ? null : (
                    <Button
                      className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
                      type="submit"
                      variant="contained"
                      size="medium"
                      disabled={compType === "view"}
                    >
                      Update
                      {isFormDataLoading ? (
                        <CircularProgress
                          className="text-white ml-[5px]"
                          size={24}
                        />
                      ) : null}
                    </Button>
                  )}
                  {compType === "view" ? null : (
                    <Button
                      className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
                      type="button"
                      variant="contained"
                      size="medium"
                      disabled={false}
                      onClick={() => handleClearForm(resetForm)}
                    >
                      {t("Reset")}
                    </Button>
                  )}
                  <Button
                    onClick={toggleModal}
                    className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-gray-600 font-500 py-0 rounded-[6px] bg-gray-300 hover:bg-gray-300/80"
                  >
                    Close
                  </Button>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}

export default ViewCategoryDialogForm;
