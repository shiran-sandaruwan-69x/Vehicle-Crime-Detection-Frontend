import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import CancelIcon from "@mui/icons-material/Cancel";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import axios, { AxiosResponse } from "axios";
import Button from "@mui/material/Button";
import { useTranslation } from "react-i18next";
import { HERO_SECTION_SLIDER } from "src/app/axios/services/AdminServices";
import ExtendedAxiosError from "src/app/types/ExtendedAxiosError";
import { imageType } from "../../../sample-component/root-component/types/general-advertisement-types";
import NavigationViewComp from "../../../../../common/FormComponents/NavigationViewComp";

interface SlideInterface {
  id: number;
  name: string;
  is_active: number;
  images: {
    image_url: string;
  }[];
  created_at: string;
  updated_at: string;
}

function ProductCarouselCompnent() {
  const { t } = useTranslation("diversDenAdvertisements");
  const [images, setImages] = useState<
    { id?: number; link?: string; file?: File; base64?: string }[]
  >([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isSaveEnabled, setIsSaveEnabled] = useState(false);

  const maxImageCount = 10;
  const maxImageSize = 5 * 1024 * 1024; // 5MB

  const [isImageLoading, setImageLoading] = useState(false);
  const [heroSlide, setHeroSlide] = useState<SlideInterface>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchHeroSectionImages();
  }, []);

  const fetchHeroSectionImages = async () => {
    setIsLoading(true);
    try {
      const response: AxiosResponse<{
        data: SlideInterface[];
      }> = await axios.get(`${HERO_SECTION_SLIDER}`);

      if (response.data.data.length > 0) {
        setHeroSlide(response.data.data[0]);

        const formattedSlides = await Promise.all(
          response.data.data.map(async (slide) => {
            const base64 = await getBase64FromUrl(slide.imageUrl); // assuming slide.imageUrl contains the image link
            return {
              id: slide.id,
              link: URL.createObjectURL(
                await (await fetch(slide.imageUrl)).blob()
              ),
              file: {},
              base64,
            };
          })
        );

        console.log("formattedSlides", formattedSlides);
        setImages(formattedSlides);
      }
    } catch (error) {
      const axiosError = error as ExtendedAxiosError;

      if (axiosError?.response?.data?.message) {
        toast.error(axiosError.response.data.message);
      } else if (axiosError.message) {
        toast.error(axiosError.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  const getBase64FromUrl = async (url: string) => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const sampleImages: imageType[] = [
    // {
    // 	id: 1,
    // 	link: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=500&h=500&fit=crop'
    // },
    // {
    // 	id: 2,
    // 	link: 'https://images.unsplash.com/photo-1494972308805-463bc619d34e?w=500&h=500&fit=crop'
    // },
    // {
    // 	id: 3,
    // 	link: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&h=500&fit=crop'
    // },
    // {
    // 	id: 4,
    // 	link: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=500&h=500&fit=crop'
    // },
    // {
    // 	id: 5,
    // 	link: 'https://images.unsplash.com/photo-1542362567-b07e54358753?w=500&h=500&fit=crop'
    // },
    // {
    // 	id: 6,
    // 	link: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500&h=500&fit=crop'
    // },
    // {
    // 	id: 7,
    // 	link: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=500&h=500&fit=crop'
    // },
    // {
    // 	id: 8,
    // 	link: 'https://images.unsplash.com/photo-1547038577-da80abbc4f19?w=500&h=500&fit=crop'
    // }
  ];

  useEffect(() => {
    loadImageById(sampleImages);
  }, []);

  const loadImageById = async (imageData: imageType[]) => {
    setImageLoading(true);
    const loadedImages = await Promise.all(
      imageData.map(async (image) => {
        // Fetch the image to get the file
        const response = await fetch(image.link);
        const blob = await response.blob();
        const file = new File([blob], `image_${image.id}.png`, {
          type: blob.type,
        });
        const base64 = await convertToBase64(file);
        return {
          id: image.id,
          link: image.link,
          file,
          base64,
        };
      })
    );

    setImages(loadedImages);
    setImageLoading(false);
  };

  const validateImageDimensions = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const aspectRatio = img.width / img.height;
        const expectedRatio = 16 / 9;
        const tolerance = 0.05; // Allow a small deviation

        if (
          Math.abs(aspectRatio - expectedRatio) <= tolerance &&
          file.size <= maxImageSize
        ) {
          resolve(true);
        } else {
          toast.error(
            "Image upload failed: Must be 16:9 aspect ratio and ≤ 1MB."
          );
          resolve(false);
        }
      };
    });
  };

  // const validateImageDimensions = (file: File): Promise<boolean> => {
  //   return new Promise((resolve) => {
  //     const img = new Image();
  //     img.src = URL.createObjectURL(file);
  //     img.onload = () => {
  //       if (img.width === img.height && file.size <= maxImageSize) {
  //         resolve(true);
  //       } else {
  //         toast.error(
  //           "Image upload failed: Width and height must be the same, and size should be <= 5MB."
  //         );
  //         resolve(false);
  //       }
  //     };
  //   });
  // };

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

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    alert("handleImageUpload");
    const { files } = event.target;

    if (files) {
      if (images.length + files.length > maxImageCount) {
        toast.error(
          `You can only upload a maximum of ${maxImageCount} images.`
        );
        return;
      }

      const validImages: {
        id: number;
        link: string;
        file: File;
        base64: string;
      }[] = [];
      // eslint-disable-next-line no-restricted-syntax
      for (const file of Array.from(files)) {
        // eslint-disable-next-line no-await-in-loop
        const isValid = await validateImageDimensions(file);

        if (isValid) {
          // eslint-disable-next-line no-await-in-loop
          const base64 = await convertToBase64(file);
          validImages.push({
            id: Date.now(),
            link: URL.createObjectURL(file),
            file,
            base64,
          });
        }
      }

      if (validImages.length > 0) {
        setImages((prevImages) => [...prevImages, ...validImages]);
        setIsSaveEnabled(true);
      }
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = (id: number) => {
    const newImages = images.filter((image) => image.id !== id);
    setImages(newImages);
    setIsSaveEnabled(newImages.length > 0);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const filteredImages = images.filter(
      (image) => !sampleImages?.some((mediaItem) => mediaItem?.id === image?.id)
    );
    const submitImages = filteredImages.map((image) => image.base64);
    console.log("submitImages", submitImages);

    try {
      const response = await axios.put(`${HERO_SECTION_SLIDER}/1`, {
        name: "slider 1",
        heading: "dummy",
        sub_heading: "dummy",
        description: "dummy",
        is_active: "1",
        images: submitImages,
      });
    } catch (error) {
      const axiosError = error as ExtendedAxiosError;

      if (axiosError?.response?.data?.message) {
        toast.error(axiosError.response.data.message);
      } else if (axiosError.message) {
        toast.error(axiosError.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsSubmitting(false);
      fetchHeroSectionImages();
    }
  };

  return (
    <div className="min-w-full max-w-[100vw]">
      <NavigationViewComp title="Content Management/Components Layouts/Product Carousel Components" />

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2} className="pt-[10px] pr-[30px] mx-auto">
          {/* Image Upload Section */}
          {isImageLoading ? (
            <Grid
              item
              xs={12}
              className="flex justify-start items-center w-full min-h-[100px] pl-[25px]"
            >
              <CircularProgress className="text-primaryBlue" />
            </Grid>
          ) : (
            <Grid item xs={12} className="formikFormField pt-[5px!important]">
              <h4 className="text-[10px] sm:text-[12px] lg:text-[14px] font-600 mb-[5px]">
                {/* {t("UPLOAD_A_THUMBNAIL_IMAGE")} */}
                Upload A Thumbnail Images (W:1920px * H:1080px) or (W:3840px *
                H:2160px)
                <span className="text-red"> *</span>
              </h4>
              <div className="relative flex flex-wrap gap-[10px]">
                {images?.map((image) => (
                  <div
                    key={image.base64}
                    className="relative w-[calc(50%-15px)] sm:w-[calc(33%-15px)] lg:w-[calc(20%-15px)] aspect-video m-[3px] border-[2px] border-[#ccc] rounded-[10px] overflow-hidden"
                  >
                    <img
                      src={image?.base64}
                      alt="Image"
                      className="w-full !h-full rounded-[10px] object-contain object-center"
                    />
                    <IconButton
                      disabled={false}
                      size="small"
                      className="absolute top-0 right-0 text-red p-[2px] rounded-full bg-black/5 transition-colors duration-300 hover:text-red"
                      onClick={() => handleRemoveImage(image.id)}
                    >
                      <CancelIcon fontSize="small" />
                    </IconButton>
                  </div>
                ))}

                {images.length < maxImageCount && (
                  <div className="relative flex justify-center items-center w-[calc(50%-15px)] sm:w-[calc(33%-15px)] lg:w-[calc(20%-15px)] aspect-video m-[3px] border-[2px] border-[#ccc] rounded-[10px]">
                    <IconButton
                      className="text-primaryBlue"
                      disabled={false}
                      onClick={() =>
                        document.getElementById("imageUpload")?.click()
                      }
                    >
                      <AddCircleIcon fontSize="large" />
                    </IconButton>
                    <input
                      ref={fileInputRef}
                      id="imageUpload"
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      multiple
                      onChange={handleImageUpload}
                    />
                  </div>
                )}
              </div>
              <span className="text-[10px] text-gray-700 italic">
                <b className="text-red">Note : </b>
                Image dimensions must be 16:9, and size ≤ 1MB.
              </span>
            </Grid>
          )}

          <Grid
            item
            md={12}
            sm={12}
            xs={12}
            className="flex justify-end items-center gap-[10px] pt-[10px!important] pr-[10px]"
          >
            <Button
              className="flex justify-center items-center min-w-[100px] min-h-[36px] max-h-[36px] text-[10px] sm:text-[12px] lg:text-[14px] text-white font-500 py-0 rounded-[6px] bg-primaryBlue hover:bg-primaryBlue/80"
              type="submit"
              variant="contained"
              color="primary"
            >
              Save Thumbnails
              {isSubmitting && (
                <CircularProgress size={20} className="text-white ml-[5px]" />
              )}
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}

export default ProductCarouselCompnent;
