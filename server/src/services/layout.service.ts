import cloudinary from "cloudinary";

import {
  ICreateLayoutData,
  IUpdateLayoutData,
  LayoutType,
} from "../interfaces/layoutInterface";

import layoutRepository from "../repositories/layout.repository";
import AppError from "../utils/AppError";

const getAllLayouts = async () => {
  return await layoutRepository.getAllLayouts();
};

const createLayout = async (layoutData: ICreateLayoutData) => {
  const { type } = layoutData;

  // Check if layout type already exists
  const existingLayout = await layoutRepository.getLayoutByType(type);

  if (existingLayout) {
    throw new AppError(`Layout with type ${type} already exists`, 400);
  }

  // Create only with type
  return await layoutRepository.createLayout({
    type,
  });
};

const handleUpdateBannerLayout = async (layoutData: IUpdateLayoutData) => {
  const existingLayout = await layoutRepository.getLayoutByType("banner");

  if (!existingLayout) {
    throw new AppError("Banner layout not found", 404);
  }

  const existingBanner = existingLayout.banner;

  let lightBanner = existingBanner?.lightBanner;
  let darkBanner = existingBanner?.darkBanner;


  let oldLightPublicId: string | undefined;

  if (layoutData.lightBanner) {
    oldLightPublicId = lightBanner?.public_Id;

    const uploadedLight = await cloudinary.v2.uploader.upload(
      layoutData.lightBanner,
      {
        folder: "layouts/banner",
      },
    );

    console.log("✅ Light banner uploaded:", {
      public_id: uploadedLight.public_id,
      secure_url: uploadedLight.secure_url,
    });

    lightBanner = {
      public_Id: uploadedLight.public_id,
      url: uploadedLight.secure_url,
    };
  }


  let oldDarkPublicId: string | undefined;

  if (layoutData.darkBanner) {
    oldDarkPublicId = darkBanner?.public_Id;

    console.log("⬆️ Uploading new dark banner...");

    const uploadedDark = await cloudinary.v2.uploader.upload(
      layoutData.darkBanner,
      {
        folder: "layouts/banner",
      },
    );

   

    darkBanner = {
      public_Id: uploadedDark.public_id,
      url: uploadedDark.secure_url,
    };
  }


  const updatedLayout = await layoutRepository.updateLayout("banner", {
    banner: {
      lightBanner: lightBanner!,
      darkBanner: darkBanner!,

      title: layoutData.title ?? existingBanner?.title ?? "",

      subtitle: layoutData.subtitle ?? existingBanner?.subtitle ?? "",
    },
  });

  // ============================================
  // DELETE OLD IMAGES
  // ============================================

  if (oldLightPublicId) {
    console.log("🗑️ Deleting old light banner:", oldLightPublicId);

    const result = await cloudinary.v2.uploader.destroy(oldLightPublicId, {
      resource_type: "image",
      type: "upload",
      invalidate: true,
    });

    console.log("🗑️ Old light banner delete result:", result);
  }

  if (oldDarkPublicId) {
    console.log("🗑️ Deleting old dark banner:", oldDarkPublicId);

    const result = await cloudinary.v2.uploader.destroy(oldDarkPublicId, {
      resource_type: "image",
      type: "upload",
      invalidate: true,
    });

    console.log("🗑️ Old dark banner delete result:", result);
  }

  return updatedLayout;
};

const handleUpdateFaqLayout = async (layoutData: IUpdateLayoutData) => {
  const existingLayout = await layoutRepository.getLayoutByType("faq");

  if (!existingLayout) {
    throw new AppError("FAQ layout not found", 404);
  }

  if (!layoutData.faq) {
    throw new AppError("FAQ items are required", 400);
  }

  return await layoutRepository.updateLayout("faq", {
    faq: layoutData.faq,
  });
};

const updateLayout = async (layoutData: IUpdateLayoutData) => {
  switch (layoutData.type) {
    case "banner":
      return await handleUpdateBannerLayout(layoutData);

    case "faq":
      return await handleUpdateFaqLayout(layoutData);

    default:
      throw new AppError(`Invalid layout type ${layoutData.type}`, 400);
  }
};

const getLayoutByType = async (type: LayoutType) => {
  const layout = await layoutRepository.getLayoutByType(type);

  if (!layout) {
    throw new AppError(`Layout with type ${type} not found`, 404);
  }

  return layout;
};

const layoutService = {
  createLayout,
  updateLayout,
  getLayoutByType,
  getAllLayouts,
};

export default layoutService;
