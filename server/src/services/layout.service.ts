import cloudinary from "cloudinary";

import {
  ICreateLayoutData,
  IUpdateLayoutData,
  LayoutType,
} from "../interfaces/layoutInterface";

import layoutRepository from "../repositories/layout.repository";
import AppError from "../utils/AppError";
import { delCached, getCached, setCached } from "../utils/redis";

/** the only layout types the api accepts; protects the cache key from a
 * caller-supplied type (unbounded keyspace if not whitelisted) */
const VALID_LAYOUT_TYPES = ["banner", "faq", "categories"] as const;

const LAYOUT_CACHE_TTL = 600;

const layoutCacheKey = (type: string) => `layout:${type}`;

const getLayoutByType = async (type: LayoutType) => {
  if (!VALID_LAYOUT_TYPES.includes(type as (typeof VALID_LAYOUT_TYPES)[number])) {
    throw new AppError(`Invalid layout type ${type}`, 400);
  }

  const cacheKey = layoutCacheKey(type);

  const cached = await getCached<any>(cacheKey);

  if (cached) {
    return cached;
  }

  const layout = await layoutRepository.getLayoutByType(type);

  if (!layout) {
    throw new AppError(`Layout with type ${type} not found`, 404);
  }

  await setCached(cacheKey, layout, LAYOUT_CACHE_TTL);

  return layout;
};

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
  const createdLayout = await layoutRepository.createLayout({
    type,
  });

  // the new doc is what a read would return, prime the cache so the public
  // endpoints never see a 404 during the ttl
  await delCached(layoutCacheKey(type));

  return createdLayout;
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



    lightBanner = {
      public_Id: uploadedLight.public_id,
      url: uploadedLight.secure_url,
    };
  }


  let oldDarkPublicId: string | undefined;

  if (layoutData.darkBanner) {
    oldDarkPublicId = darkBanner?.public_Id;


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


  if (oldLightPublicId) {
    const result = await cloudinary.v2.uploader.destroy(oldLightPublicId, {
      resource_type: "image",
      type: "upload",
      invalidate: true,
    });

  }

  if (oldDarkPublicId) {

    const result = await cloudinary.v2.uploader.destroy(oldDarkPublicId, {
      resource_type: "image",
      type: "upload",
      invalidate: true,
    });

  }

  await setCached(layoutCacheKey("banner"), updatedLayout, LAYOUT_CACHE_TTL);

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

  const updatedLayout = await layoutRepository.updateLayout("faq", {
    faq: layoutData.faq,
  });

  await setCached(layoutCacheKey("faq"), updatedLayout, LAYOUT_CACHE_TTL);

  return updatedLayout;
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

const layoutService = {
  createLayout,
  updateLayout,
  getLayoutByType,
  getAllLayouts,
};

export default layoutService;
