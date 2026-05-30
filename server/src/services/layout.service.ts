import cloudinary from "cloudinary";

import {
  ICreateLayoutData,
  ILayoutDocument,
} from "../interfaces/layoutInterface";

import layoutRepository from "../repositories/layout.repository";
import AppError from "../utils/AppError";

const handleBannerLayout = async (layoutData: ICreateLayoutData) => {
  const { image, title, subtitle } = layoutData;

  if (!image) {
    throw new AppError("Image is required", 400);
  }

  const result = await cloudinary.v2.uploader.upload(image, {
    folder: "layouts",
  });

  const data: Partial<ILayoutDocument> = {
    type: "banner",

    banner: {
      image: {
        public_Id: result.public_id,
        url: result.secure_url,
      },

      title: title || "",

      subtitle: subtitle || "",
    },
  };

  return await layoutRepository.createLayout(data);
};

const handleFaqLayout = async (layoutData: ICreateLayoutData) => {
  if (!layoutData.faq?.length) {
    throw new AppError("FAQ items are required", 400);
  }

  return await layoutRepository.createLayout({
    type: "faq",
    faq: layoutData.faq,
  });
};

const handleCategoriesLayout = async (layoutData: ICreateLayoutData) => {
  if (!layoutData.categories?.length) {
    throw new AppError("Categories are required", 400);
  }

  return await layoutRepository.createLayout({
    type: "categories",
    categories: layoutData.categories,
  });
};

const createLayout = async (layoutData: ICreateLayoutData) => {
  const { type } = layoutData;
  const isExistType = await layoutRepository.getLayoutByType(type);
  if (isExistType) {
    throw new AppError(`Layout with type ${type} already exists`, 400);
  }
  switch (type) {
    case "banner":
      return await handleBannerLayout(layoutData);

    case "faq":
      return await handleFaqLayout(layoutData);

    case "categories":
      return await handleCategoriesLayout(layoutData);

    default:
      throw new AppError("Invalid layout type", 400);
  }
};

// ---------------------------------------------------------------

const handleUpdateBannerLayout = async (layoutData: ICreateLayoutData) => {
  const existingLayout = await layoutRepository.getLayoutByType("banner");

  if (!existingLayout) {
    throw new AppError("Banner layout not found", 404);
  }

  let imageData = existingLayout.banner?.image;

  if (layoutData.image) {
    // delete old image
    if (existingLayout.banner?.image?.public_Id) {
      await cloudinary.v2.uploader.destroy(
        existingLayout.banner.image.public_Id,
      );
    }

    const uploaded = await cloudinary.v2.uploader.upload(layoutData.image, {
      folder: "layouts",
    });

    imageData = {
      public_Id: uploaded.public_id,
      url: uploaded.secure_url,
    };
  }

  return await layoutRepository.updateLayout("banner", {
    banner: {
      image: imageData!,
      title: layoutData.title || "",
      subtitle: layoutData.subtitle || "",
    },
  });
};

const handleUpdateFaqLayout = async (layoutData: ICreateLayoutData) => {
  if (!layoutData.faq?.length) {
    throw new AppError("FAQ items are required", 400);
  }
  const existingLayout = await layoutRepository.getLayoutByType("faq");

  if (!existingLayout) {
    throw new AppError("FAQ layout not found", 404);
  }
  return await layoutRepository.updateLayout("faq", {
    faq: layoutData.faq,
  });
};

const handleUpdateCategoriesLayout = async (layoutData: ICreateLayoutData) => {
  if (!layoutData.categories?.length) {
    throw new Error("Categories are required");
  }
  const existingLayout = await layoutRepository.getLayoutByType("categories");

  if (!existingLayout) {
    throw new AppError("Categories layout not found", 404);
  }
  return await layoutRepository.updateLayout("categories", {
    categories: layoutData.categories,
  });
};

const updateLayout = async (layoutData: ICreateLayoutData) => {
  switch (layoutData.type) {
    case "banner":
      return await handleUpdateBannerLayout(layoutData);

    case "faq":
      return await handleUpdateFaqLayout(layoutData);

    case "categories":
      return await handleUpdateCategoriesLayout(layoutData);

    default:
      throw new AppError(`Invalid layout type ${layoutData.type}`, 400);
  }
};

const getLayoutByType = async (type: string) => {
  const layout = await layoutRepository.getLayoutByType(type);

  if (!layout) {
    throw new Error("Layout not found");
  }

  return layout;
};
const layoutService = {
  createLayout,
  updateLayout,
  getLayoutByType,
};

export default layoutService;
